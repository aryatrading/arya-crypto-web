import { FC, useCallback } from "react";
import { Col, Row } from "../layout/flex";

type VotingCompositionProps = {
  votes: [number, number];
};

const bgColors = ["bg-green-1", "bg-red-1"];

export const VotingComposition: FC<VotingCompositionProps> = ({ votes }) => {
  const assetLine = useCallback((weight: number, index: number) => {
    return (
      <Row
        key={index}
        className={`h-full ${bgColors[index % bgColors.length]}`}
        style={{ width: `${weight * 100}%` }}
      />
    );
  }, []);

  return (
    <Col className="gap-2 w-full">
      <Row className="h-3 w-full bg-blue-1 rounded-full overflow-hidden">
        {votes?.map((weight, index) => assetLine(weight, index))}
      </Row>
      <Row className="justify-between">
        <p className="text-grey-1 font-semibold">{votes[0]}%</p>
        <p className="text-grey-1 font-semibold">{votes[1]}%</p>
      </Row>
    </Col>
  );
};
