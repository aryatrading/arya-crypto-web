import { FC, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { ShadowButton } from "../../shared/buttons/shadow_button";
import { AssetDropdown } from "../../shared/assetDropdown";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../utils/helpers/prices";

const AssetTradeFromInput: FC = () => {
  const { t } = useTranslation(["asset"]);
  const [selectedAsset, setSelectedAsset] = useState({
    symbol: "Select",
    iconUrl: null,
    availabe: 0,
  });
  return (
    <Col className="bg-black-1 rounded-md px-4 py-2 gap-4 w-full">
      <Row className="flex justify-between">
        <p className="font-medium text-base">From</p>
        <p className="font-medium text-base">
          Balance: {formatNumber(selectedAsset.availabe, true)}
        </p>
      </Row>

      <Row className="flex justify-between">
        <p className="font-medium text-base">1.2</p>
        <Row className="gap-2 items-center">
          <ShadowButton
            title="Max"
            onClick={() => null}
            py="py-1"
            border="rounded-md"
            bgColor="bg-blue-3"
            textColor="text-blue-2"
          />
          {selectedAsset.iconUrl ? (
            <img
              className="w-5 h-5 rounded-full"
              src={selectedAsset?.iconUrl ?? ""}
              alt="new"
            />
          ) : null}
          <AssetDropdown
            onClick={(data: any) => {
              setSelectedAsset({
                ...selectedAsset,
                symbol: data.symbol.toUpperCase(),
                iconUrl: data.iconUrl,
              });
            }}
            t={t}
            disabled={false}
            title={selectedAsset.symbol}
          />
        </Row>
      </Row>
    </Col>
  );
};

export default AssetTradeFromInput;
