import { FC } from "react";
import { Col, Row } from "../layout/flex";
import AssetPnl from "./asset/assetPnl";
import { formatNumber } from "../../../utils/helpers/prices";

type MarketProps = {
  bgColor: string;
  title: string;
  amount: string;
  percent: number;
};

export const MarketStats: FC<MarketProps> = ({
  bgColor,
  title,
  amount,
  percent,
}) => {
  return (
    <Col className={`${bgColor} rounded-md min-h-20 px-5 py-2`}>
      <Row className="items-center">
        <p className="text-white text-base font-bold leading-5 items-center">
          {title}
        </p>
        <AssetPnl
          className={percent < 0 ? "text-red-1" : "text-green-1"}
          value={percent}
        />
      </Row>
      <p className="text-white text-xl font-medium leading-7 pt-2">
        {percent ? "" : "$"}
        {amount}
        {percent && ""}
      </p>
    </Col>
  );
};

export default MarketStats;
