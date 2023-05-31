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
  percent
}) => {
  return (
    <Col className={`${bgColor} w-60 rounded-md min-h-20 pl-5 py-2`}>
      <Row className="items-center">
        <p className="text-[#F9FAFB] text-sm font-medium leading-5 items-center max-w-[100px]">
          {title}
        </p>
        <AssetPnl className={(value < 0) ? 'text-red-1' : 'text-green-1'} value={value} />
      </Row>
      <p className="text-[#F9FAFB] text-xl font-medium leading-7 pt-2">
        {percent ? '' : '$'}{formatNumber(parseFloat(amount))}{percent && '%'}
      </p>
    </Col>
  );
};

export default MarketStats;
