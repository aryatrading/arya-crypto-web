import { FC, useEffect, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import {
  addTakeProfit,
  getTrade,
  removeTakeProfit,
} from "../../../services/redux/tradeSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { getAssetAvailable } from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";
import { PremiumBanner } from "../../shared/containers/premiumBanner";

export const TakeprofitTrade: FC = () => {
  const dispatch = useDispatch();
  const trade = useSelector(getTrade);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [values, setValues] = useState({
    value: null,
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
  }, [trade.symbol_name]);

  const onAddTp = () => {
    dispatch(addTakeProfit(values));
  };

  return (
    <>
      <PremiumBanner />
      <p className="font-bold text-base">Add take profit</p>
      <TradeInput
        title="Price"
        value={trade.base_name ?? "USDT"}
        amount={values?.value}
        onchange={(e: any) => setValues({ ...values, value: e })}
      />
      <TradeInput
        title="Quantity"
        value={trade.asset_name ?? "BTC"}
        amount={values.quantity}
        onchange={(e: any) => setValues({ ...values, quantity: e })}
        header={available}
      />
      <div className="flex justify-center">
        <TimeseriesPicker
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
      <Button className="bg-blue-3 rounded-md py-3" onClick={() => onAddTp()}>
        <p>Add Take profit</p>
      </Button>
      {trade && trade?.take_profit?.length ? (
        <p className="font-bold text-base">Take profits</p>
      ) : null}

      {trade &&
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