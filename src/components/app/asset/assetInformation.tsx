import { FC, useMemo, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
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
import CoinProfitCalculator from "../../shared/coinProfitCalculator";
import CoinConverter from "../../shared/coinConverter";
import AssetTrade from "../trade/assetTrade";
import { PostTypes } from "../../../types/asset";
import { Post } from "../community/Post";

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
  const { posts } = useSelector(({ posts }: any) => posts);
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
    <Col className="lg:flex-row w-full ">
      <Col className="flex-1">
        <Row className="justify-between items-center">
          <h2 className="font-medium text-xl">
            <span className="uppercase">{asset.symbol}</span> {t("price_chart")}
          </h2>
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
              onclick={(e: seriesInterface) => setView(e.key)}
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

        <Col className="mt-14 gap-14">
          <CoinProfitCalculator />
          {asset?.id && <CoinConverter preDefined staticCoin={asset} />}
        </Col>
      </Col>
      <Col className="flex-[0.5] ps-6 gap-10">
        <Col className="gap-5">
          <p className="text-base font-semibold">
            {t("trade_title")} {asset?.name ?? ""}
          </p>
          <AssetTrade />
        </Col>
        {/* Community widget */}
        {posts.length > 0 && (
          <Col className="gap-5">
            <h3 className="font-extrabold text-white header-label pb-2">
              {t("communityTitle", { coin: asset.name })}
            </h3>
            <Col className="w-full min-h-[300px] bg-grey-6 rounded-md px-10 py-5">
              {posts?.slice(0, 2)?.map((post: PostTypes) => {
                return <Post post={post} />;
              })}

              <a
                href={`https://arya-web-app.vercel.app/asset/?s=${asset.symbol}&m=crypto&t=USD&n=${asset.name}/US%20Dollar`}
                className="text-white text-base font-bold underline text-center"
                target="_blank"
                rel="noreferrer"
              >
                {t('seeMore')} +
              </a>
            </Col>
          </Col>
        )}
      </Col>
    </Col>
  );
};

export default AssetInformationTab;
