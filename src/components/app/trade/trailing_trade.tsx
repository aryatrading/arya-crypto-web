import { FC, useState } from "react";
import { getTrade } from "../../../services/redux/tradeSlice";
import { useSelector } from "react-redux";
import { TrailingPicker } from "../../shared/trailingPicker";
import TradeInput from "../../shared/inputs/tradeInput";
import { Button } from "../../shared/buttons/button";
import { ProfitSet } from "../../shared/containers/trade/profit_set";

export const TrailingTrade: FC = () => {
  const trade = useSelector(getTrade);
  const [values, setValues] = useState({
    type: "Select Trailing type",
    price: 0,
  });

  return (
    <>
      <p className="font-bold text-base">Add Trailing</p>
      <TrailingPicker
        type={values.type}
        onSelect={(e: any) => setValues({ ...values, type: e })}
      />
      <TradeInput
        title="Price"
        value="USDT"
        amount={values.price}
        onchange={(e: any) => setValues({ ...values, price: e })}
      />
      {values.type === "Breakeven" ? (
        <TradeInput
          title="SL price"
          value=""
          amount={values.price}
          onchange={(e: any) => setValues({ ...values, price: e })}
        />
      ) : values.type === "Percentage" ? (
        <TradeInput
          title="Percentage"
          value=""
          amount={values.price}
          onchange={(e: any) => setValues({ ...values, price: e })}
        />
      ) : null}
      <Button
        className="bg-blue-3 rounded-md py-3"
        onClick={() => console.log(".")}
      >
        <p>Add Trailing</p>
      </Button>
      <p className="font-bold text-base">Current Trailing</p>
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
