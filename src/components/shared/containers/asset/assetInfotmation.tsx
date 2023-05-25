import { FC } from "react";
import { Col } from "../../layout/flex";
import { AssetType } from "../../../../types/asset";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../../utils/helpers/prices";
import parse from "html-react-parser";

type AssetInformationProps = {
  asset: AssetType;
};

export const AssetInformation: FC<AssetInformationProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(selectAssetLivePrice);
  return (
    <Col className="gap-11">
      <Col className="gap-4">
        <h2 className="font-medium text-sm md:text-xl">{t("pricelivedata", { asset })}</h2>
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
      <Col className="gap-4">
        <p className="font-medium text-sm md:text-xl">
          {t("whatis")} {asset.name}
        </p>
        <p className="font-semibold text-xs md:text-sm">{ parse(asset?.description ?? "")}</p>
      </Col>
    </Col>
  );
};
