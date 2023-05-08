import { FC } from "react";
import { Col } from "../../layout/flex";
import { AssetType } from "../../../../types/asset";
import { useSelector } from "react-redux";
import { selectAssetLivePrice } from "../../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";
import { formatNumber } from "../../../../utils/helpers/prices";

type AssetInformationProps = {
  asset: AssetType;
};

export const AssetInformation: FC<AssetInformationProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(selectAssetLivePrice);

  return (
    <Col className="gap-11">
      <Col className="gap-4">
        <p className="font-medium text-xl">
          {asset.name} {t("pricelivedata")}
        </p>
        <p className="font-semibold text-sm">
          {asset.name} {t("pricetday")}
          {formatNumber(
            _assetprice[asset.symbol?.toLowerCase() ?? ""] ??
              asset.currentPrice,
            true
          )}
          {t("twentyfourvolume")} {formatNumber(asset.volume ?? 0)}.{" "}
          {asset.symbol?.toUpperCase()} {t("pricechange")} {asset.pnl}%{" "}
          {t("lasttwentyfour")} {formatNumber(asset.circlSupply ?? 0)}{" "}
          {asset.symbol?.toUpperCase()} {t("totalsupplyof")}{" "}
          {formatNumber(asset.supply ?? 0)}. {t("binanceexchange")}
        </p>
      </Col>
      <Col className="gap-4">
        <p className="font-medium text-xl">
          {t("whatis")} {asset.name}
        </p>
        <p className="font-semibold text-sm">{asset?.description ?? ""}</p>
      </Col>
    </Col>
  );
};
