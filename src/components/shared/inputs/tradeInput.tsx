import { FC } from "react";
import { Col, Row } from "../layout/flex";
import Input from "./Input";

interface InputProps {
  title: string;
  value: string;
  disabled?: boolean;
  amount?: number | null;
  header?: string;
  onchange: Function;
}

const TradeInput: FC<InputProps> = ({
  title,
  value,
  disabled = false,
  amount,
  header,
  onchange,
}) => {
  return (
    <Col className="gap-2">
      {header ? (
        <p className="text-right text-blue-1">Available: {header}</p>
      ) : null}

      <Row className="flex justify-between bg-black-1 p-3 rounded-lg">
        <p className="font-bold text-grey-1">{title}</p>
        <Row className="gap-3">
          <Input
            disabled={disabled}
            className="bg-transparent text-right font-bold"
            value={amount ?? ""}
            onChange={(e:any) => onchange(e.target.value ?? 0)}
          />
          <p className="font-bold text-grey-1">{value}</p>
        </Row>
      </Row>
    </Col>
  );
};

export default TradeInput;
