import { FC, useCallback, useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Row } from "../../layout/flex";
import { twMerge } from "tailwind-merge";
import { percentageFormat } from "../../../../utils/helpers/prices";

interface IAssetPnlProps {
  value: number;
  className?: string;
  transform?: Function;
};


const AssetPnl: FC<IAssetPnlProps> = ({ value, className, transform }) => {
  const [isProfit, setIsProfit] = useState<boolean | null>(false)

  useEffect(() => {

    if (value > 0) {
      setIsProfit(true)
    } else if (value < 0) {
      setIsProfit(false)
    }
    else {
      setIsProfit(null)
    }
  }, [value])

  const handleValue = useCallback(
    () => {
      if (value !== null && value !== undefined) {
        return <p className={`text-xs md:text-sm font-semibold:''}`}>
          {transform ? transform(value ?? 0) : `${isProfit ? '+' : ''}${percentageFormat(value)}%`}
        </p>
      }
      else {
        return <span className="text-xs md:text-sm font-semibold text-grey-1">N/A</span>
      }
    },
    [isProfit, transform, value],
  )

  return (
    <Row className={twMerge(`py-1 px-2 rounded-md text-xs md:text-sm font-semibold justify-center items-center gap-1`, className)}>
      {(isProfit !== null) && (
        <PlayIcon
          className={`w-3 h-3 ${isProfit ? "fill-green-1 -rotate-90" : "fill-red-1 rotate-90"
            } stroke-0`}
        />
      )}
      {handleValue()}
    </Row>
  );
};

export default AssetPnl;
