import { FC, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import { useDispatch, useSelector } from "react-redux";
import {
  addStoploss,
  getTrade,
  removeStoploss,
} from "../../../services/redux/tradeSlice";
import Button from "../../shared/buttons/button";
import { selectAssetLivePrice } from "../../../services/redux/marketSlice";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";

export const StoplossTrade: FC = () => {
  const trade = useSelector(getTrade);
  const { t } = useTranslation(["trade"]);
  const dispatch = useDispatch();
  const _assetprice = useSelector(selectAssetLivePrice);
  const [slValue, setSlValue] = useState(
    _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? 0
  );

  return (
    <>
      <PremiumBanner />
      <p className="font-bold text-base">{t("addstoploss")}</p>
      <TradeInput
        title="Price"
        value={trade.base_name ?? "USDT"}
        amount={slValue}
        onchange={(e: string) => setSlValue(e)}
      />

      <Button
        className="bg-blue-3 rounded-md py-3"
        onClick={() => dispatch(addStoploss({ value: slValue }))}
      >
        <p>{t("addstoploss")}</p>
      </Button>
      {trade && trade?.stop_loss?.length ? (
        <p className="font-bold text-base">{t("stoploss")}</p>
      ) : null}

      {trade &&
        trade?.stop_loss?.map((elm: any, index: number) => {
          return (
            <ProfitSet
              key={index}
              content={`Sell at ${elm.value} USD`}
              profit={{ value: elm.value }}
              symbol={trade.asset_name}
              base="USD"
              action={() => dispatch(removeStoploss())}
            />
          );
        })}
    </>
  );
};
