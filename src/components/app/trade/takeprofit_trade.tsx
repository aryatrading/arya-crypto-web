import { FC, useEffect, useState } from "react";
import TradeInput from "../../shared/inputs/tradeInput";
import { getTrade } from "../../../services/redux/tradeSlice";
import { useSelector } from "react-redux";
import Button from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";
import { getAssetAvailable } from "../../../services/controllers/trade";
import { selectSelectedExchange } from "../../../services/redux/exchangeSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { percentTabs } from "../../../utils/constants/profitsPercentage";

export const TakeprofitTrade: FC = () => {
  const trade = useSelector(getTrade);
  const selectedExchange = useSelector(selectSelectedExchange);
  const [values, setValues] = useState({
    price: 0,
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

  return (
    <>
      <p className="font-bold text-base">Add take profit</p>
      <TradeInput
        title="Price"
        value={trade.base_name ?? "USDT"}
        amount={values?.price ?? 0}
        onchange={(e: any) => setValues({ ...values, price: e })}
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
      <Button
        className="bg-blue-3 rounded-md py-3"
        onClick={() => console.log(".")}
      >
        <p>Add Take profit</p>
      </Button>
      <p className="font-bold text-base">Take profits</p>
      <ProfitSet
        content={`Sell {{qty}} ${trade.asset_name} at {{value}} USD`}
        profit={{ value: 3 }}
        symbol={trade.asset_name}
        quantity="3"
        base="USD"
        action={() => console.log(",")}
      />
    </>
  );
};
