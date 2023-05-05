import { FC, useMemo, useState } from "react";
import { Row } from "../../shared/layout/flex";
import { assetTimeseries } from "../../../utils/constants/assetTimeseries";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import {
  getAsset,
  getAssetTimeseries,
} from "../../../services/redux/assetSlice";
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries";
import { getAssetTimeseriesPrice } from "../../../services/controllers/asset";
import LineChart from "../../shared/charts/graph/graph";
import TradingViewWidget from "../../shared/charts/tradingView/tradingView";
import { AssetInformation } from "../../shared/containers/asset/assetInfotmation";

type seriesInterface = {
  title: string;
  value: string;
  points: number;
  key: string;
};

const AssetInformationTab: FC = () => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);
  const timeseries = useSelector(getAssetTimeseries);
  const [activeSeries, setActiveSeries] = useState("24H");
  const [view, setView] = useState("price");

  const assetGraphToggles = useMemo(() => {
    return [
      {
        title: t("pricegraph"),
        value: "price",
        key: "price",
      },
      {
        title: t("tradinggraph"),
        value: "tradingview",
        key: "tradingview",
      },
    ];
  }, []);

  const onSeriesClick = async (series: seriesInterface) => {
    setActiveSeries(series.key);
    await getAssetTimeseriesPrice(asset.symbol, series.value, series.points);
  };

  return (
    <>
      <Row className="justify-between items-center">
        <p className="font-medium text-xl">
          {asset.name} {t("price_chart")}
        </p>
        <Row className="gap-3">
          {view === "price" ? (
            <TimeseriesPicker
              series={assetTimeseries}
              active={activeSeries}
              onclick={(e: seriesInterface) => onSeriesClick(e)}
            />
          ) : null}
          <TimeseriesPicker
            series={assetGraphToggles}
            active={view}
            onclick={(e: seriesInterface) => setView(e.value)}
          />
        </Row>
      </Row>
      <div className="mt-7 mb-7">
        {view === "price" ? (
          <LineChart primaryLineData={timeseries} className="w-full h-80" />
        ) : (
          <TradingViewWidget />
        )}
      </div>

      <AssetInformation asset={asset} />
    </>
  );
};

export default AssetInformationTab;
