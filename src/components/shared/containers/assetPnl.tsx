import { FC } from "react";
import { Row } from "../layout/flex";
import { PlayIcon } from "@heroicons/react/24/outline";

type AssetPnl = {
  isUp: boolean;
  value: string;
  bgColor: string;
  textColor: string;
};

export const AssetPnl: FC<AssetPnl> = ({ bgColor, value, isUp, textColor }) => {
  return (
    <Row className={`${bgColor} w-20 h-5 rounded  justify-center items-center`}>
      <PlayIcon
        className={`w-3 h-3 ${
          isUp ? "fill-green_one -rotate-90" : "fill-red_one rotate-90"
        } stroke-0`}
      />
      <p
        className={`text-sm font-medium leading-4 pl-1.5 pt-0.5 ${textColor} `}
      >
        {value}%
      </p>
    </Row>
  );
};

export default AssetPnl;
