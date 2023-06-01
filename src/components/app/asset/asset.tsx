import { FC, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

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

const Asset: FC = () => {
  const { t } = useTranslation(["asset","common"]);
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
        <h1 className="">{t("pricelivedata", { asset })}</h1>
      </Row>
      <Row className="justify-between gap-5">
        <Row className="items-end gap-5 justify-between w-full md:w-auto">
          <AssetHeader asset={asset} />
          <AssetSparkLine symbol={asset.symbol}/>
        </Row>
        <AssetVote className="hidden md:flex"/>
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
            <Tab className='font font-semibold text-sm outline-none cursor-pointer lg:hidden'>
              {
                t("trade_title")
              }
            </Tab>
          </Row>
        </TabList>
        <TabPanel>
          <AssetInformationTab stats={stats} />
        </TabPanel>
        {
          !!asset?.isHoldingAsset && 
          <TabPanel>
            <AssetHoldingTab />
          </TabPanel>
        }
        <TabPanel>
          <AssetExitStrategy/>
        </TabPanel>
      </Tabs>
    </Col>
  );
};

export default Asset;
