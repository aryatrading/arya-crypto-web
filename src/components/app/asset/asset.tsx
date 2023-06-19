import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { useAuthUser } from "next-firebase-auth";

import { AssetHeader } from "../../shared/containers/asset/assetDetailsHeader";
import AssetStatistics from "../../shared/containers/asset/assetStatistics";
import { Col, Row } from "../../shared/layout/flex";
import { getAsset } from "../../../services/redux/assetSlice";
import AssetVote from "../../shared/containers/asset/assetVote";
import { formatNumber } from "../../../utils/helpers/prices";
import AssetInformationTab from "./assetInformation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AssetHoldingTab from "./assetHolding";
import AssetExitStrategy from "./AssetExitStrategy";
import AssetSparkLine from "../../shared/containers/asset/AssetSparkLine";
import { useResponsive } from "../../../context/responsive.context";
import { getStats } from "../../../services/controllers/asset";
import { TextSkeleton } from "../../shared/skeletons/skeletons";
import { StatisticsResponseType } from "../../../types/asset";

const Asset: FC = () => {
  const { t } = useTranslation(["asset", "common"]);
  const asset = useSelector(getAsset);
  const { isTabletOrMobileScreen } = useResponsive(); 
  const { id } = useAuthUser();
  const [coinstats, setCoinStats] = useState<StatisticsResponseType>();

  useEffect(() => {
    if (asset?.symbol && id != null) {
      getStats(asset?.symbol).then(setCoinStats);
    }
  }, [asset?.symbol, id]);

  const stats = useMemo(() => {
    return [
      { title: t("mrkCap"), value: asset.mrkCap ? formatNumber(asset.mrkCap ?? 0, true) : asset.mrkCap },
      {
        title: t("fullydiluted"),
        value: asset.dilutedValuation ? formatNumber(asset.dilutedValuation ?? 0, true) : asset.dilutedValuation,
      },
      { title: t("circsupply"), value: asset.circlSupply ? formatNumber(asset.circlSupply) : asset.circlSupply },
      { title: t("volume"), value: asset.volume ? formatNumber(asset.volume ?? 0, true) : asset.volume },
      { title: t("totalsupply"), value: asset.supply ? formatNumber(asset.supply) : asset.supply },
      { title: t("dailylow"), value: asset.dailyLow ? formatNumber(asset.dailyLow ?? 0, true) : asset.dailyLow },
      {
        title: t("dailyhigh"),
        value: asset.dailyHigh ? formatNumber(asset.dailyHigh ?? 0, true) : asset.dailyHigh,
      },
    ];
  }, [
    asset.circlSupply,
    asset.dailyHigh,
    asset.dailyLow,
    asset.dilutedValuation,
    asset.mrkCap,
    asset.supply,
    asset.volume,
    t,
  ]);

  return (
    <Col className="h-full w-full gap-12">
      <Row className="text-grey-1 gap-1">
        <span>{t("market")}</span>
        <span> / </span>
        {asset.name ? <h1 className="inline">{t("pricelivedata", { asset })}</h1> : <TextSkeleton heightClassName="h-5" widthClassName="w-52" />}
      </Row>
      <Row className="justify-between gap-5">
        <Row className="items-end gap-5 justify-between w-full md:w-auto">
          <AssetHeader asset={asset} />
          <AssetSparkLine symbol={asset.symbol} />
        </Row>
        <AssetVote className="hidden md:flex w-full" />
      </Row>
      <Row className="mt-7 flex-wrap gap-5 xl:gap-16 xl:justify-start hidden md:flex">
        {stats.map((elm, index) => {
          return (
            <AssetStatistics key={index} title={elm.title} value={elm.value} />
          );
        })}
      </Row>
      <Tabs selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
        <TabList className="border-b-[1px] border-grey-3 mb-6">
          <Row className="gap-6">
            <Tab className="font-semibold text-sm outline-none cursor-pointer">
              {t("assetinfotab")}
            </Tab>
            {!!asset?.isHoldingAsset && (
              <Tab className="font-semibold text-sm outline-none cursor-pointer">
                {t("holdingsinfo")}
              </Tab>
            )}
            {!!asset?.isHoldingAsset && (
              <Tab className='font-semibold text-sm outline-none cursor-pointer'>
                {
                  isTabletOrMobileScreen? t("trade_title"):t("common:exitStrategy")
                }
              </Tab>
            )}
          </Row>
        </TabList>
        <TabPanel>
          <AssetInformationTab stats={stats} coinstats={coinstats} />
        </TabPanel>
        {
          !!asset?.isHoldingAsset &&
          <TabPanel>
            <AssetHoldingTab />
          </TabPanel>
        }
        <TabPanel>
          <AssetExitStrategy />
        </TabPanel>
      </Tabs>
    </Col>
  );
};

export default Asset;
