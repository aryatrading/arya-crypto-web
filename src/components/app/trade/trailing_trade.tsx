import { FC, useState } from "react";
import { getTrade } from "../../../services/redux/tradeSlice";
import { useSelector } from "react-redux";
import { TrailingPicker } from "../../shared/trailingPicker";
import TradeInput from "../../shared/inputs/tradeInput";
import { Button } from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { Col } from "../../shared/layout/flex";
import { twMerge } from "tailwind-merge";


interface ITrailingTrade {
  assetScreen?:boolean
}

export const TrailingTrade: FC<ITrailingTrade> = ({assetScreen = false}) => {
  const { t } = useTranslation(["trade"]);
  const trade = useSelector(getTrade);
  const [values, setValues] = useState({
    type: "Select Trailing type",
    price: 0,
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
          amount={values.price}
          onchange={(e: any) => setValues({ ...values, price: e })}
        />
      ) : values.type === "Percentage" ? (
        <TradeInput
          title={t("percentage")}
          value=""
          amount={values.price}
          onchange={(e: any) => setValues({ ...values, price: e })}
        />
      ) : null}
      <Button
        className={twMerge("bg-blue-3 rounded-md py-3 font-semibold",assetScreen?"mt-auto":'')}
        onClick={() => console.log(".")}
      >
        <p>{t("addtrailing")}</p>
      </Button>
      {!assetScreen&&<Col className="gap-6">
        <p className="font-bold text-base">{t("currenttrailing")}</p>
        <ProfitSet
          content={`Fixed at {{v}} with {{t}} {{tl}}`}
          profit={{ value: 3 }}
          symbol={trade.asset_name}
          quantity="3"
          base="USD"
          action={() => console.log(",")}
        />
      </Col>}
    </>
  );
};
