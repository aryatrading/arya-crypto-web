import { FC } from "react";
import { Col } from "../../layout/flex";
import { AssetType } from "../../../../types/asset";
import { formatNumber } from "../../../../utils/format_currency";
import { useSelector } from "react-redux";
import { getLivePrice } from "../../../../services/redux/marketSlice";
import { useTranslation } from "next-i18next";

type AssetInformationProps = {
  asset: AssetType;
};

export const AssetInformation: FC<AssetInformationProps> = ({ asset }) => {
  const { t } = useTranslation(["asset"]);
  const _assetprice = useSelector(getLivePrice);

  return (
    <Col className="gap-11">
      <Col className="gap-4">
        <p className="font-medium text-xl">
          {asset.name} {t("pricelivedata")}
        </p>
        <p className="font-semibold text-sm">
          {asset.name} {t("pricetday")}
          {formatNumber(
            _assetprice[asset.symbol?.toLowerCase() ?? ""] ?? asset.currentPrice
          )}
          {t("twentyfourvolume")} {formatNumber(asset.volume ?? 0)}.{" "}
          {asset.symbol?.toUpperCase()} {t("pricechange")} {asset.pnl}%{" "}
          {t("lasttwentyfour")} {asset.circlSupply ?? 0}{" "}
          {asset.symbol?.toUpperCase()} {t("totalsupplyof")} {asset.supply}.{" "}
          {t("binanceexchange")}
        </p>
      </Col>
      <Col className="gap-4">
        <p className="font-medium text-xl">
          {t("whatis")} {asset.name}
        </p>
        {/* The content below will be returned from the backend, keeping it hardcoded for now. */}
        <p className="font-semibold text-sm">
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
