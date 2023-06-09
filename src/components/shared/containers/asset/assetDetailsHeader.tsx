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
import { twMerge } from "tailwind-merge";
import { TextSkeleton } from "../../skeletons/skeletons";

type AssetHeaderProps = {
  asset: AssetType;
};

export const AssetHeader: FC<AssetHeaderProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(selectAssetLivePrice);

  return (
    <Col className="gap-3 w-3/5 md:w-auto shrink-0">
      <Row className="gap-2">
        <ShadowButton
          bgColor="bg-grey-5"
          textColor="font-medium text-xs"
          border="rounded"
          onClick={() => null}
          title={`${t("rank")} #${asset.rank ?? 0}`}
        />
        <ShadowButton
          bgColor="bg-grey-5"
          textColor="font-medium text-xs"
          border="rounded"
          onClick={() => null}
          iconSvg={<StarIcon className="w-4 h-4 fill-orange-1 stroke-0" />}
          title={formatNumber(asset?.favoriteCount ?? 0)}
        />
      </Row>
      <AssetName
        iconUrl={asset.iconUrl}
        name={asset.name}
        symbol={asset.symbol?.toUpperCase()}
      />
      <Col>
        <Row className="gap-2 items-center">
          <p className="font-medium text-2xl md:text-4xl">
            {_assetprice[asset.symbol?.toLowerCase() ?? "btc"] ? formatNumber(
              _assetprice[asset.symbol?.toLowerCase() ?? "btc"] ??
              asset.currentPrice,
              true
            ) : <TextSkeleton />}
          </p>
          {(asset.pnl !== undefined) && <AssetPnl
            value={asset.pnl}
            className={
              asset.pnl <= 0 ? "bg-red-2 text-red-1" : "bg-green-2 text-green-1"
            }
          />}
          {(asset.priceChange !== undefined) && <AssetPnl
            value={asset.priceChange!}
            className={twMerge(asset.priceChange! <= 0 ? "text-red-1" : "text-green-1", 'hidden md:flex')}
            transform={formatNumber}
          />}
        </Row>
      </Col>
    </Col>
  );
};
