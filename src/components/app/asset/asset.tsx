import { FC, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useSelector } from "react-redux";

import { AssetHeader } from "../../shared/containers/asset/assetDetailsHeader";
import AssetStatistics from "../../shared/containers/asset/assetStatistics";
import { Col, Row } from "../../shared/layout/flex";
import { getAsset } from "../../../services/redux/assetSlice";
import AssetVote from "../../shared/containers/asset/assetVote";
import { formatNumber } from "../../../utils/helpers/prices";
import AssetInformationTab from "./assetInformation";

const Asset: FC = () => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);

  const stats = useMemo(() => {
    return [
      { title: t("mrkCap"), value: formatNumber(asset.mrkCap ?? 0, true) },
      {
        title: t("fullydiluted"),
        value: formatNumber(asset.dilutedValuation ?? 0, true),
      },
      { title: t("circsupply"), value: formatNumber(asset.circlSupply) },
      { title: t("volume"), value: formatNumber(asset.volume ?? 0, true) },
      { title: t("totalsupply"), value: formatNumber(asset.supply) },
      { title: t("dailylow"), value: formatNumber(asset.dailyLow ?? 0, true) },
      {
        title: t("dailyhigh"),
        value: formatNumber(asset.dailyHigh ?? 0, true),
      },
    ];
  }, [asset.circlSupply, asset.dailyHigh, asset.dailyLow, asset.dilutedValuation, asset.mrkCap, asset.supply, asset.volume, t]);

  return (
    <Col className="h-full w-full gap-12">
      <Row className="justify-between">
        <AssetHeader asset={asset} />
        <AssetVote />
      </Row>
      <Row className="mt-7 flex flex-wrap xl:justify-between">
        {stats.map((elm, index) => {
          return (
            <AssetStatistics key={index} title={elm.title} value={elm.value} />
          );
        })}
      </Row>
      <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
        <TabList className="border-b-[1px] border-grey-3 mb-6">
          <Row className="gap-4">
            <Tab className="font-bold text-lg outline-none cursor-pointer">
              {t("assetinfotab")}
            </Tab>
            <Tab className="font-bold text-lg outline-none cursor-pointer">
              {t("holdingsinfo")}
            </Tab>
          </Row>
        </TabList>
        <TabPanel>
          <AssetInformationTab />
        </TabPanel>
      </Tabs>
    </Col>
  );
};

export default Asset;
