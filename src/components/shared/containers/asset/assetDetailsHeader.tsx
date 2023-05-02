import { FC } from "react";
import { AssetType } from "../../../../types/asset";
import { Col, Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";
import { StarIcon } from "@heroicons/react/24/outline";
import { AssetName } from "./assetName";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../../services/redux/marketSlice";
import AssetPnl from "./assetPnl";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../../utils/helpers/prices";

type AssetHeaderProps = {
  asset: AssetType;
};

export const AssetHeader: FC<AssetHeaderProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(selectAssetLivePrice);

  return (
    <Col className="gap-2">
      <Row className="gap-2">
        <ShadowButton
          bgColor="bg-grey-5"
          textColor="font-medium text-xs"
          border="rounded"
          onClick={() => console.log("d")}
          title={`${t("rank")} #${asset.rank ?? 0}`}
        />
        <ShadowButton
          bgColor="bg-grey-5"
          textColor="font-medium text-xs"
          border="rounded"
          onClick={() => console.log("d")}
          iconSvg={<StarIcon className="w-4 h-4 fill-orage-1 stroke-0" />}
          title="1.8k"
        />
      </Row>
      <AssetName
        iconUrl={asset.iconUrl}
        name={asset.name}
        symbol={asset.symbol?.toUpperCase()}
      />
      <Row className="gap-2 items-center">
        <p className="font-medium text-4xl">
          {formatNumber(
            _assetprice[asset.symbol?.toLowerCase() ?? "eth"] ??
              asset.currentPrice,
            true
          )}
        </p>
        <AssetPnl
          value={asset.pnl > 0 ? `+${asset.pnl}%` : asset.pnl + "%"}
          bgColor={asset.pnl <= 0 ? "bg-red-2" : "bg-green-2"}
          textColor={asset.pnl <= 0 ? "text-red-1" : "text-green-1"}
          isUp={asset.pnl > 0}
        />
        <AssetPnl
          value={formatNumber(asset.priceChange ?? 0)}
          textColor={asset.priceChange! <= 0 ? "text-red-1" : "text-green-1"}
        />
      </Row>
    </Col>
  );
};
