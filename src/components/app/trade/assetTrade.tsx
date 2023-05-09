import { FC } from "react";
import { Col } from "../../shared/layout/flex";
import AssetTradeFromInput from "./assetTradeFromInput";
import AssetTradeToInput from "./assetTradeToInput";
import Button from "../../shared/buttons/button";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";

const AssetTrade: FC = () => {
  return (
    <Col className="bg-grey-2 px-5 py-5 rounded-md gap-10 items-center">
      <AssetTradeFromInput />
      <Button className="flex justify-center items-center rounded-full bg-blue-3 text-white h-11 w-11">
        <ArrowsUpDownIcon className="h-5 w-5" />
      </Button>
      <AssetTradeToInput />
      <Button className="gap-1 p-2 rounded-md bg-green-1 text-white w-full">
        <p className="text-center font-semibold text-base">Trade</p>
      </Button>
      <Button className="gap-1 rounded-md bg-transparent text-white w-full">
        <p className="text-center font-semibold text-base">Advance Mode</p>
      </Button>
    </Col>
  );
};

export default AssetTrade;
