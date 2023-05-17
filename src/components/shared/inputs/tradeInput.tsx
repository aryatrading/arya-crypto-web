import { FC } from "react";
import { Row } from "../layout/flex";

interface InputProps {
  title: string;
  value: string;
}

const TradeInput: FC<InputProps> = ({ title, value }) => {
  return (
    <Row className="flex justify-between bg-black-1 p-3 rounded-lg">
      <p className="font-bold text-grey-1">{title}</p>
      <Row className="gap-3">
        <p>{value}</p>
        <p className="font-bold text-grey-1">{value}</p>
      </Row>
    </Row>
  );
};

export default TradeInput;
