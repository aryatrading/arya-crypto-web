import { FC, useState } from "react";
import { getAssetPrice, getTrade } from "../../../services/redux/tradeSlice";
import { useSelector } from "react-redux";
import { TrailingPicker } from "../../shared/trailingPicker";
import TradeInput from "../../shared/inputs/tradeInput";
import { Button } from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";

export const TrailingTrade: FC = () => {
  const { t } = useTranslation(["trade"]);
  const trade = useSelector(getTrade);
  const _price = useSelector(getAssetPrice);
  const _assetprice = useSelector(selectAssetLivePrice);

  const [values, setValues] = useState({
    type: "Breakeven",
    price: _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? _price,
    value: 0,
  });

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
        onClick={() => console.log(".")}
      >
        <p>{t("addtrailing")}</p>
      </Button>
      <p className="font-bold text-base">{t("currenttrailing")}</p>
      <ProfitSet
        content={`Fixed at {{v}} with {{t}} {{tl}}`}
        profit={{ value: 3 }}
        symbol={trade.asset_name}
        quantity="3"
        base="USD"
        action={() => console.log(",")}
      />
    </>
  );
};
