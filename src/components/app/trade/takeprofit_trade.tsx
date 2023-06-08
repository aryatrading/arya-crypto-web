import { FC, useCallback, useEffect, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import {
  addTakeProfit,
  getTrade,
  removeTakeProfit,
} from "../../../services/redux/tradeSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { createTrade, getAssetAvailable, initiateTrade } from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { PremiumBanner } from "../../shared/containers/premiumBanner";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { TradeType } from "../../../types/trade";
import { MODE_DEBUG } from "../../../utils/constants/config";


interface ITrailingTrade {
  assetScreen?:boolean
}

export const TakeprofitTrade: FC<ITrailingTrade> = ({assetScreen}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["trade"]);
  const trade:TradeType = useSelector(getTrade);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [values, setValues] = useState({
    value: 0,
    quantity: 0,
  });
  const [available, setAvailable] = useState("");
  const [percent, setPercent] = useState("5");

  useEffect(() => {
    (async () => {
      let _res = await getAssetAvailable(
        trade.asset_name ?? "btc",
        selectedExchange?.provider_id ?? 1
      );

      setAvailable(_res);
    })();
  }, [selectedExchange?.provider_id, trade.asset_name, trade.symbol_name]);

  const onAddTp = () => {
    if (trade?.take_profit?.length??0 >= 3) {
      return toast.info("You can only add 3 TP's per asset");
    }
    if(assetScreen){
      submitTakeProfit()
    }
    else{
      dispatch(addTakeProfit(values));
    }
  };

  const submitTakeProfit = useCallback(
    async () => {
      if( !values.value || !values.quantity){
        if(MODE_DEBUG){
          console.log(`submitTakeProfit is passed falsy value:${values.value} or quantity:${values.quantity}`)
        }
        return
      }
      const tradeData:TradeType = {
        symbol_name:trade.symbol_name,
        asset_name:trade.asset_name,
        base_name:trade.base_name,
        available_quantity:trade.available_quantity
      }
      tradeData.take_profit =[values]
      
      await createTrade(tradeData, selectedExchange?.provider_id ?? 1);
      toast.success(`${trade.symbol_name} trade created`);

      await initiateTrade(
        trade.asset_name,
        selectedExchange?.provider_id ?? 1,
        trade.base_name
      );
    },
    [selectedExchange?.provider_id, trade, values],
  )
  

  return (
    <>
      <PremiumBanner />
      <span className="font-bold text-base">{t('addtakeprofit')}</span>
      <TradeInput
        title={t("price")}
        value={"USDT"}
        amount={values?.value}
        onchange={(e: any) => setValues({ ...values, value: e })}
      />
      <TradeInput
        title={t("quantity")}
        value={trade.asset_name ?? "BTC"}
        amount={values.quantity}
        onchange={(e: any) => setValues({ ...values, quantity: e })}
        header={available}
      />
      <div className="flex justify-center">
        <TimeseriesPicker
          buttonClassName='w-full'
          series={percentTabs}
          active={percent}
          onclick={(e: any) => {
            setPercent(e.key);
            setValues({
              ...values,
              quantity: (parseInt(e.key) / 100) * parseInt(available),
            });
          }}
        />
      </div>
      <Button className="bg-blue-3 rounded-md py-3 font-semibold" onClick={() => onAddTp()}>
        <p>{t("addtakeprofit")}</p>
      </Button>
      {trade && trade?.take_profit?.length ? (
        <p className="font-bold text-base">{t("takeprofit")}</p>
      ) : null}

      {!assetScreen&&trade &&
        trade?.take_profit?.map((elm: any, index: number) => {
          return (
            <ProfitSet
              key={index}
              content={`Sell ${elm.quantity} ${trade.asset_name} at ${elm.value} USD`}
              profit={{ value: 3 }}
              symbol={trade.asset_name}
              quantity="3"
              base="USD"
              action={() => dispatch(removeTakeProfit({ index: index + 1 }))}
            />
          );
        })}
    </>
  );
};
