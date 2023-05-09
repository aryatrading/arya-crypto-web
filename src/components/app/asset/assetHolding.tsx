import { FC } from "react";
import { Col } from "../../shared/layout/flex";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { getAsset } from "../../../services/redux/assetSlice";
import { ExhangeHoldingTable } from "../../shared/tables/exchangeHoldingTable";
import { AssetOrdersTable } from "../../shared/tables/assetOrders";

const AssetHoldingTab: FC = () => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);

  return (
    <Col className="gap-20">
      <Col>
        <p className="font-medium text-xl mb-5">
          {asset.name} {t("holdingperexchange")}
        </p>
        <ExhangeHoldingTable />
      </Col>
      <Col>
        <p className="font-medium text-xl mb-5">{t("orders")}</p>
        <AssetOrdersTable />
      </Col>
    </Col>
  );
};

export default AssetHoldingTab;
