import { FC, useState } from "react";
import {
  addTrailing,
  getAssetPrice,
  getTrade,
  removeTrailing,
} from "../../../services/redux/tradeSlice";
import { useDispatch, useSelector } from "react-redux";
import { TrailingPicker } from "../../shared/trailingPicker";
import TradeInput from "../../shared/inputs/tradeInput";
import { Button } from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { toast } from "react-toastify";
import { TrailingType } from "../../../types/trade";

export const TrailingTrade: FC = () => {
  const { t } = useTranslation(["trade"]);
  const dispatch = useDispatch();
  const trade = useSelector(getTrade);
  const _price = useSelector(getAssetPrice);
  const _assetprice = useSelector(selectAssetLivePrice);

  const [values, setValues] = useState({
    type: "Breakeven",
    price: _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price,
    value: 0,
  });

  const onAddTrailing = () => {
    if (values.price <= 0) {
      return toast.info("Please set price for this trade");
    }

    if (values.value <= 0) {
      return toast.info("Please set value for this trade");
    }

    let _trailing: TrailingType = {
      trigger_value: values.price,
    };

    if (values.type === "Breakeven") {
      _trailing.stop_price = values.value;
    }

    if (values.type === "Percentage") {
      _trailing.trailing_delta = values.value;
    }

    dispatch(addTrailing(_trailing));
  };

  const renderContent = () => {
    if (trade?.trailing_stop_loss[0]?.trailing_delta) {
      return `Fixed at ${
        trade?.trailing_stop_loss[0]?.stop_price ?? 0
      } with limit ${trade?.trailing_stop_loss[0]?.trailing_delta}`;
    }

    if (trade?.trailing_stop_loss[0]?.trigger_value) {
      return `Fixed at ${
        trade?.trailing_stop_loss[0]?.stop_price ?? 0
      } with limit ${trade?.trailing_stop_loss[0]?.trigger_value}`;
    }

    return "---";
  };

  return (
    <>
      <PremiumBanner />
      <p className="font-bold text-base">{t("addtrailing")}</p>
      <TrailingPicker
        type={values.type}
        onSelect={(e: any) => setValues({ ...values, type: e })}
      />
      <TradeInput
        title={t("price")}
        value="USDT"
        amount={values.price}
        onchange={(e: any) => setValues({ ...values, price: e })}
      />
      {values.type === "Breakeven" ? (
        <TradeInput
          title={t("slprice")}
          value=""
          amount={values.value}
          onchange={(e: any) => setValues({ ...values, value: e })}
        />
      ) : values.type === "Percentage" ? (
        <TradeInput
          title={t("percentage")}
          value=""
          amount={values.value}
          onchange={(e: any) => setValues({ ...values, value: e })}
        />
      ) : null}
      <Button
        className="bg-blue-3 rounded-md py-3"
        onClick={() => onAddTrailing()}
      >
        <p>{t("addtrailing")}</p>
      </Button>
      {trade?.trailing_stop_loss?.length > 0 ? (
        <p className="font-bold text-base">{t("currenttrailing")}</p>
      ) : null}
      {trade?.trailing_stop_loss?.map((elm: any, index: number) => {
        return (
          <ProfitSet
            key={index}
            content={renderContent()}
            profit={{ value: 3 }}
            symbol={trade.asset_name}
            quantity="3"
            base="USD"
            action={() => dispatch(removeTrailing())}
          />
        );
      })}
    </>
  );
};
