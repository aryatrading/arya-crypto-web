import { FC } from "react";
import { Row } from "../layout/flex";

type AssetPnl = {
  side: string;
  value: string;
  bgColor: string;
  textColor: string;
};

export const AssetPnl: FC<AssetPnl> = ({ bgColor, value, side, textColor }) => {
  return (
    <Row className={`${bgColor} w-20 h-5 rounded  justify-center`}>
      <p
        className={`text-sm font-medium leading-4 pl-1.5 pt-0.5 ${textColor} `}
      >
        {value}%
      </p>
    </Row>
  );
};

export default AssetPnl;
