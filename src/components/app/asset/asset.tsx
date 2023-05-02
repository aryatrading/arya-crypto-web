import { FC, useMemo, useState } from "react";
import { AssetHeader } from "../../shared/containers/asset/assetDetailsHeader";
import AssetStatistics from "../../shared/containers/asset/assetStatistics";
import { Col, Row } from "../../shared/layout/flex";
import { useSelector } from "react-redux";
import {
  getAsset,
  getAssetTimeseries,
} from "../../../services/redux/assetSlice";
import { useTranslation } from "next-i18next";
import { AssetInformation } from "../../shared/containers/asset/assetInfotmation";
import AssetVote from "../../shared/containers/asset/assetVote";
import LineChart from "../../shared/charts/graph/graph";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import {
  assetGraphView,
  assetTimeseries,
} from "../../../utils/constants/assetTimeseries";
import { getAssetTimeseriesPrice } from "../../../services/controllers/asset";
import { formatNumber } from "../../../utils/helpers/prices";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";

type seriesInterface = { title: string; value: string; points: number };

const Asset: FC = () => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);
  const timeseries = useSelector(getAssetTimeseries);
  const [activeSeries, setActiveSeries] = useState("24H");
  const [view, setView] = useState("Price");

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
  }, [asset]);

  const onSeriesClick = async (series: seriesInterface) => {
    setActiveSeries(series.title);
    await getAssetTimeseriesPrice(asset.symbol, series.value, series.points);
  };

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
      <Row className="justify-between items-center">
        <p className="font-medium text-xl">
          {asset.name} {t("price_chart")}
        </p>
        <Row className="gap-3">
          {view === "Price" ? (
            <TimeseriesPicker
              series={assetTimeseries}
              active={activeSeries}
              onclick={(e: seriesInterface) => onSeriesClick(e)}
            />
          ) : null}
          <TimeseriesPicker
            series={assetGraphView}
            active={view}
            onclick={(e: seriesInterface) => setView(e.title)}
          />
        </Row>
      </Row>
      {view === "Price" ? (
        <LineChart primaryLineData={timeseries} className="w-full h-80" />
      ) : (
        <TradingViewWidget />
      )}

      <AssetInformation asset={asset} />
    </Col>
  );
};

export default Asset;
