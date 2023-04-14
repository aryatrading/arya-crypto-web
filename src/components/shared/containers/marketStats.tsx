import { FC } from "react";
import { Col, Row } from "../layout/flex";
import AssetPnl from "./assetPnl";

type MarketProps = {
  bgColor: string;
  textColor: string;
  value: string;
  title: string;
};

export const MarketStats: FC<MarketProps> = ({
  bgColor,
  textColor,
  value,
  title,
}) => {
  return (
    <Col className={`ml-3.5 mr-3.5 ${bgColor} w-60 rounded-md h-20 pl-5 pt-2`}>
      <Row>
        <p className="text-[#F9FAFB] text-sm font-medium leading-5 items-center">
          {title}
        </p>
        <AssetPnl value={value} textColor={textColor} />
      </Row>
      <p className="text-[#F9FAFB] text-xl font-medium leading-7 pt-2">
        $1,227,747,623,904
      </p>
    </Col>
  );
};

export default MarketStats;
