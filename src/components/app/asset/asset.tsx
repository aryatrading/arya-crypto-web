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
import { formatNumber } from "../../../utils/format_currency";
import { AssetInformation } from "../../shared/containers/asset/assetInfotmation";
import AssetVote from "../../shared/containers/asset/assetVote";
import LineChart from "../../shared/charts/graph/graph";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { assetTimeseries } from "../../../utils/constants/assetTimeseries";
import { getAssetTimeseriesPrice } from "../../../services/controllers/asset";

type seriesInterface = { title: string; value: string; points: number };

const Asset: FC = () => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);
  const timeseries = useSelector(getAssetTimeseries);
  const [activeSeries, setActiveSeries] = useState("24H");

  const stats = useMemo(() => {
    return [
      { title: t("mrkCap"), value: formatNumber(asset.mrkCap ?? 0) },
      {
        title: t("fullydiluted"),
        value: formatNumber(asset.dilutedValuation ?? 0),
      },
      { title: t("circsupply"), value: asset.circlSupply },
      { title: t("volume"), value: formatNumber(asset.volume ?? 0) },
      { title: t("totalsupply"), value: asset.supply },
      { title: t("dailylow"), value: formatNumber(asset.dailyLow ?? 0) },
      { title: t("dailyhigh"), value: formatNumber(asset.dailyHigh ?? 0) },
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
          <TimeseriesPicker
            series={assetTimeseries}
            active={activeSeries}
            onclick={(e: seriesInterface) => onSeriesClick(e)}
          />
        </Row>
      </Row>
      <LineChart primaryLineData={timeseries} className="w-full h-80" />
      <AssetInformation asset={asset} />
    </Col>
  );
};

export default Asset;
