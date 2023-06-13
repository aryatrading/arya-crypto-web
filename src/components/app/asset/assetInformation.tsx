import { FC, useMemo, useState } from "react";
import { Col, Row } from "../../shared/layout/flex";
import { assetTimeseries } from "../../../utils/constants/assetTimeseries";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import clsx from "clsx";

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
import AssetVote from "../../shared/containers/asset/assetVote";
import CandleStickGraphFilled from "../../svg/candleStickGraphFilled";
import LineGraphIcon from "../../svg/LineGraphIcon";
import AssetStatistics from "../../shared/containers/asset/assetStatistics";
import Button from "../../shared/buttons/button";
import { PremiumIcon } from "../../svg/premiumIcon";

type seriesInterface = {
  title: string;
  value: string;
  points: number;
  key: string;
};

type stats = {
  title: string;
  value: string;
};

interface IAssetInformationTab {
  stats: stats[];
  coinstats?: any
}

const AssetInformationTab: FC<IAssetInformationTab> = ({ stats, coinstats }) => {
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
        icon: LineGraphIcon,
      },
      {
        title: t("tradinggraph"),
        value: "tradingview",
        key: "tradingview",
        icon: CandleStickGraphFilled,
      },
    ];
  }, [t]);

  const onSeriesClick = async (series: seriesInterface) => {
    setActiveSeries(series.key);
    await getAssetTimeseriesPrice(asset.symbol, series.value, series.points);
  };

  return (
    <Col className="lg:flex-row w-full gap-8 lg:gap-5">
      <Col className="lg:w-8/12 gap-10">
        <Col className="gap-2">
          <Row className="justify-between items-center gap-4">
            <h2 className="asset-header">
              <span className="uppercase">{asset.symbol}</span>{" "}
              {t("price_chart")}
            </h2>
            <Row className="gap-3 hidden md:flex">
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

          {view === "price" ? (
            <LineChart primaryLineData={timeseries} className="w-full h-80" tooltip={{ show: true, title: t("common:price"), showValue: true }} />
          ) : (
            <TradingViewWidget />
          )}

          <Row className="gap-3 md:hidden justify-between ">
            <TimeseriesPicker
              series={assetGraphToggles}
              active={view}
              onclick={(e: seriesInterface) => setView(e.key)}
            />
            {view === "price" ? (
              <TimeseriesPicker
                series={assetTimeseries}
                active={activeSeries}
                onclick={(e: seriesInterface) => onSeriesClick(e)}
              />
            ) : null}
          </Row>
        </Col>

        <Row className="grid grid-cols-3 gap-5 justify-start md:hidden">
          {stats.map((elm, index) => {
            return (
              <AssetStatistics
                key={index}
                title={elm.title}
                value={elm.value}
              />
            );
          })}
        </Row>

        <AssetInformation asset={asset} />
        <Col className="justify-center gap-6">
          <h3 className="asset-header">{t('insights')}</h3>

          <Row className="gap-10 items-center flex-col xl:flex-row flex-1">
            <Col className="relative flex-1">
              <Row className={clsx({ "blur-md": coinstats?.premium }, "bg-grey-3 px-6 py-4 rounded-lg gap-8 flex-col sm:flex-row sm:items w-full")}>
                <Col>
                  <CircularProgressbar text="" value={coinstats?.premium ? 12.6 : coinstats?.portfolio_holdings} className="max-w-28 h-28" strokeWidth={18} styles={buildStyles({
                    pathColor: "#F7931A",
                    strokeLinecap: 'butt',
                  })} />
                </Col>
                <Col className="flex-1 justify-center gap-2">
                  <p className="text-4xl font-bold text-orange-1 text-center sm:text-left">{coinstats?.premium ? '12.6' : coinstats?.portfolio_holdings}%</p>
                  <p className="text-lg md:text-sm font-bold text-white text-center sm:text-left">{t('statsHolding')}</p>
                </Col>
              </Row>

              {coinstats?.premium && <Row className="top-0 right-0 bottom-0 left-0 absolute items-center justify-center gap-4 px-5">
                <PremiumIcon />

                <p className="text-white font-bold">{t('common:premiumMsg')}</p>

                <Button className="bg-orange-1 h-12 md:px-4 rounded-lg text-bold text-white font-bold text-sm">
                  {t('common:upgrade')}
                </Button>
              </Row>}
            </Col>

            <Col className="relative flex-1">
              <Row className={clsx({ "blur-md": coinstats?.premium }, "bg-grey-3 px-6 py-4 rounded-lg flex-1 gap-8 md:gap-0 min-h-[126px] w-full relative flex-col md:flex-row justify-center")}>
                <Col className="flex-1 justify-center gap-2">
                  <p className="text-4xl font-bold text-orange-1 text-center sm:text-left">{coinstats?.premium ? '1011' : coinstats?.trades[0]?.orders_count || 0}</p>
                  <p className="text-lg md:text-sm font-bold text-white text-center sm:text-left">{t('todayTrades')}</p>
                </Col>
                <Col className="flex-1 justify-center gap-2">
                  <p className="text-4xl font-bold text-orange-1 text-center sm:text-left">{coinstats?.premium ? '+12' : coinstats?.trades.length < 2 ? "0" : ((coinstats?.trades[0]?.orders_count - coinstats?.trades[1]?.orders_count) / (coinstats?.trades[1]?.orders_count) * 100).toFixed(2)}%</p>
                  <p className="text-lg md:text-sm font-bold text-white text-center sm:text-left">{t('todayVolume')}</p>
                </Col>

                <Button className="bg-blue-3 h-12 md:px-4 rounded-lg text-bold text-white font-bold text-sm">
                  {t('seeMore')}
                </Button>
              </Row>

              {coinstats?.premium && <Row className="top-0 right-0 bottom-0 left-0 absolute items-center justify-center gap-4 px-5">
                <PremiumIcon />

                <p className="text-white font-bold">{t('common:premiumMsg')}</p>

                <Button className="bg-orange-1 h-12 md:px-4 rounded-lg text-bold text-white font-bold text-sm">
                  {t('common:upgrade')}
                </Button>
              </Row>}
            </Col>
          </Row>
        </Col>
        <AssetVote className="md:hidden" />
        <Col className="gap-4">
          <h3 className="asset-header">{t('cryptoProfitCalculator')}</h3>
          <CoinProfitCalculator />
        </Col>
        {asset?.id && <CoinConverter preDefined staticCoin={asset} />}

      </Col>

      <Col className="lg:w-4/12 gap-10">
        <Col className="hidden lg:flex gap-5">
          <p className="text-xl font-medium">
            {t("trade_title")} {asset?.name ?? ""}
          </p>
          <AssetTrade />
        </Col>
        <Col className="gap-5">
          <h3 className="asset-header">
            {t("communityTitle", { coin: asset.name })}
          </h3>
          {posts.length > 0 && (
            <Col className="w-full min-h-[300px] bg-grey-6 rounded-md px-6 py-3">
              {posts?.slice(0, 2)?.map((post: PostTypes) => {
                return <Post post={post} key={post._id} />;
              })}

              <a
                href={`https://arya-web-app.vercel.app/asset/?s=${asset.symbol}&m=crypto&t=USD&n=${asset.name}/US%20Dollar`}
                className="text-white text-base font-bold underline text-center"
                target="_blank"
                rel="noreferrer"
              >
                {t("seeMore")} +
              </a>
            </Col>
          )}
        </Col>
      </Col>
    </Col >
  );
};

export default AssetInformationTab;
