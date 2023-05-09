import { FC } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { useSelector } from "react-redux";
import { getAsset } from "../../../services/redux/assetSlice";

const AssetTradeToInput: FC = () => {
  const asset = useSelector(getAsset);

  return (
    <Col className="bg-black-1 rounded-md px-4 py-2 gap-4 w-full">
      <Row className="flex justify-between">
        <p className="font-medium text-base">To</p>
        <p className="font-medium text-base text-grey-1">Price ~ $28,789.00</p>
      </Row>

      <Row className="flex justify-between">
        <p className="font-medium text-base">0.0000078</p>
        <Row className="gap-2 items-center">
          <img className="w-5 h-5 rounded-full" src={asset.iconUrl} alt="new" />
          <p className="font-medium text-base">
            {asset?.symbol?.toUpperCase() ?? "--"}
          </p>
        </Row>
      </Row>
    </Col>
  );
};

export default AssetTradeToInput;
