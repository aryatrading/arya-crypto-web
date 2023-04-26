import { FC } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Row } from "../../layout/flex";

type AssetPnl = {
  isUp: boolean;
  value: string;
  bgColor: string;
  textColor: string;
};

export const AssetPnl: FC<AssetPnl> = ({ bgColor, value, isUp, textColor }) => {
  return (
    <Row className={`${bgColor} w-20 h-5 rounded  justify-center items-center`}>
      {isUp != null ? (
        <PlayIcon
          className={`w-3 h-3 ${
            isUp ? "fill-green-1 -rotate-90" : "fill-red-1 rotate-90"
          } stroke-0`}
        />
      ) : null}

      <p
        className={`text-sm font-medium leading-4 pl-1.5 pt-0.5 ${textColor} `}
      >
        {value}
      </p>
    </Row>
  );
};

export default AssetPnl;
