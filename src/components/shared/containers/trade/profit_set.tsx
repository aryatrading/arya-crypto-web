import { FC } from "react";
import { Row } from "../../layout/flex";
import { ProfitsType } from "../../../../types/trade";
import { Button } from "../../buttons/button";

interface props {
  profit: ProfitsType;
  base?: string;
  symbol?: string;
  action: Function;
  quantity?: string;
}

export const ProfitSet: FC<props> = ({
  profit,
  base,
  symbol,
  action,
  quantity,
}) => {
  return (
    <Row className="bg-grey-3 flex justify-between p-3 rounded-md">
      <p className="font-semibold text-sm">
        Sell {quantity} {symbol ?? "0-0"} at {profit.value} {base}
      </p>
      <Button className="text-grey-1 font-bold px-5" onClick={() => action()}>
        <p>X</p>
      </Button>
    </Row>
  );
};
