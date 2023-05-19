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

export const StoplossTrade: FC = () => {
  const trade = useSelector(getTrade);
  const dispatch = useDispatch();
  const _assetprice = useSelector(selectAssetLivePrice);
  const [slValue, setSlValue] = useState(
    _assetprice[trade?.asset_name?.toLowerCase() ?? "btc"] ?? 0
  );

  return (
    <>
      <p className="font-bold text-base">Add stop loss</p>
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
        <p>Add Stoploss</p>
      </Button>
      <p className="font-bold text-base">Stop loss</p>
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
