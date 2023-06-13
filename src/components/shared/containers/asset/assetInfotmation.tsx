import { FC, useMemo } from "react";
import { Col } from "../../layout/flex";
import { AssetType } from "../../../../types/asset";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../../utils/helpers/prices";
import styles from "./assetInformation.module.scss";
import { twMerge } from "tailwind-merge";
import { TextSkeleton } from "../../skeletons/skeletons";

type AssetInformationProps = {
  asset: AssetType;
};

export const AssetInformation: FC<AssetInformationProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(selectAssetLivePrice);

  const infoLoadingSkeleton = useMemo(() => {
    return (
      <Col className="gap-4">
        <Col className="gap-2">
          <TextSkeleton widthClassName="w-40" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton widthClassName="w-full" />
        </Col>
        <Col className="gap-2">
          <TextSkeleton widthClassName="w-40" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton widthClassName="w-full" />
          <TextSkeleton/>
        </Col>
      </Col>
    )
  }, [])

  return (
    <Col className="gap-11">
      {asset.name ?
        <Col className="gap-4">
          <h2 className="asset-header">{t("pricelivedata", { asset })}</h2>
          <p className="font-medium text-xs md:text-sm">
            <strong>
              {t("pricetday", { asset })}
              {formatNumber(
                _assetprice[asset.symbol?.toLowerCase() ?? ""] ??
                asset.currentPrice,
              true
            )}
          </strong>
          {asset.pnl <= 0 ? t("drop") : t("increase")}
          {asset.pnl}% {t("suply", { asset })}
          {formatNumber(asset.volume ?? 0)} {t("lasttwentyfour")}
          <br />
          {t("cap", { asset })}
          {formatNumber(asset.mrkCap ?? 0)} {t("circsuply")}{" "}
          {formatNumber(asset.circlSupply ?? 0)} {asset.symbol?.toUpperCase()}{" "}
          {t("totalsupplyof")} {formatNumber(asset.supply ?? 0)}{" "}
          {asset.symbol?.toUpperCase()}.
        </p>
      </Col>
      :infoLoadingSkeleton}
      {asset?.description && (
        <Col className="gap-4">
          <p className="font-medium text-base md:text-xl">
            {t("whatis")} {asset.name}
          </p>
          <p
            className={twMerge(
              "font-medium text-xs md:text-sm",
              styles.description
            )}
          >
            {asset?.description.replace(/<\/?[^>]+(>|$)/g, "")}
          </p>
        </Col>
      )}
    </Col>
  );
};
