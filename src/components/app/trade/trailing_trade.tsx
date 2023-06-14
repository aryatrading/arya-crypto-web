import { FC, useCallback, useState } from "react";
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
import { Col } from "../../shared/layout/flex";
import { twMerge } from "tailwind-merge";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { toast } from "react-toastify";
import { TradeType, TrailingType } from "../../../types/trade";
import {
  cancelOrder,
  createTrade,
  getAssetOpenOrders,
} from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { isPremiumUser } from "../../../services/redux/userSlice";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Row } from "../../shared/layout/flex";

interface ITrailingTrade {
  assetScreen?: boolean;
  postCreation?: Function;
}

export const TrailingTrade: FC<ITrailingTrade> = ({
  assetScreen = false,
  postCreation,
}) => {
  const { t } = useTranslation(["trade"]);
  const dispatch = useDispatch();
  // const isPremium = useSelector(isPremiumUser);
  const isPremium = true;
  const trade = useSelector(getTrade);
  const _price = useSelector(getAssetPrice);
  const _assetprice = useSelector(selectAssetLivePrice);
  const selectedExchange = useSelector(selectSelectedExchange);

  const [values, setValues] = useState({
    type: "Breakeven",
    price: _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price,
    value: 0,
  });

  const createTrailing = async (trailing: TrailingType) => {
    const tradeData: TradeType = {
      symbol_name: trade.symbol_name,
      asset_name: trade.asset_name,
      base_name: trade.base_name,
      available_quantity: trade.available_quantity,
      trailing_stop_loss: [trailing],
    };

    await createTrade(tradeData, selectedExchange?.provider_id ?? 1);
    postCreation!();
    toast.success(`${trade.symbol_name} trailing created`);
  };

  const onAddTrailing = () => {
    if (values.price <= 0) {
      return toast.info(t("addentryerror"));
    }

    if (values.value <= 0) {
      return toast.info(t("addentrtyqty"));
    }

    if (!isPremium) {
      return toast.info(t("premium"));
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

    if (assetScreen) {
      createTrailing(_trailing);
    } else {
      dispatch(addTrailing(_trailing));
    }
  };

  const renderContent = () => {
    return `Fixed at ${values.price ?? 0} with limit ${values.value}`;
  };

  const onremovetrailing = async (order: any) => {
    if (order?.order_id) {
      await cancelOrder(order?.order_id, selectedExchange?.provider_id ?? 1);
      await getAssetOpenOrders(
        trade.symbol_name,
        selectedExchange?.provider_id ?? 1
      );
      toast.success(t("openorderclosed"));
    }

    dispatch(removeTrailing());
  };

  return (
    <>
      {isPremium ? null : <PremiumBanner />}
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
        className={twMerge(
          isPremium ? "bg-blue-3" : "bg-grey-1",
          "rounded-md py-3",
          assetScreen ? "mt-auto" : ""
        )}
        onClick={() => onAddTrailing()}
      >
        <Row className="justify-center items-center gap-2">
          {isPremium ? null : (
            <LockClosedIcon width={15} height={15} color="bg-orange-1" />
          )}
          <p>{t("addtrailing")}</p>
        </Row>
      </Button>
      {!assetScreen && (
        <Col className="gap-6">
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
                action={() => onremovetrailing(elm)}
              />
            );
          })}
        </Col>
      )}
    </>
  );
};
