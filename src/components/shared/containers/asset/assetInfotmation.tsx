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
const name = asset.name
  return (
    <Col className="gap-11">
      <Col className="gap-4">
        <h2 className="font-medium text-xl">
          {t("pricelivedata",{asset} )}
        </h2>
        <p className="font-medium text-sm">
          <strong>{t("pricetday", {asset})}
          {formatNumber(_assetprice[asset.symbol?.toLowerCase() ?? ""] ?? asset.currentPrice, true )}
          </strong>
          {asset.pnl <= 0 ? t("drop") : t("increase")}
          {asset.pnl}%{" "}
          {t("suply", {asset})}
          {formatNumber(asset.volume ?? 0)}{" "}
            {t("lasttwentyfour")}<br/>
            {t("cap", {asset})}
            {formatNumber(asset.mrkCap ?? 0)}{" "}
            {" "}{t("circsuply")}{" "}
           {formatNumber(asset.circlSupply ?? 0)}{" "}{asset.symbol?.toUpperCase()}{" "}
           {t("totalsupplyof")}{" "}
          {formatNumber(asset.supply ?? 0)}{" "}{asset.symbol?.toUpperCase()}.
        </p>
      </Col>
      <Col className="gap-4">
        <h2 className="font-medium text-xl">
          {t("whatis")} {asset.name} ({asset.symbol?.toUpperCase()})
        </h2>
        {/* The content below will be returned from the backend, keeping it hardcoded for now. */}
        <p className="font-regular text-sm">
          Bitcoin is a decentralized cryptocurrency originally described in a
          2008 whitepaper by a person, or group of people, using the alias
          Satoshi Nakamoto. It was launched soon after, in January 2009. Bitcoin
          is a peer-to-peer online currency, meaning that all transactions
          happen directly between equal, independent network participants,
          without the need for any intermediary to permit or facilitate them.
          Bitcoin was created, according to Nakamoto’s own words, to allow
          “online payments to be sent directly from one party to another without
          going through a financial institution.” Some concepts for a similar
          type of a decentralized electronic currency precede BTC, but Bitcoin
          holds the distinction of being the first-ever cryptocurrency to come
          into actual use.
        </p>
      </Col>
    </Col>
  );
};
