import { FC, useCallback, useMemo, useState } from "react";
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
import { PostTypes, StatisticsResponseType } from "../../../types/asset";
import { Post } from "../community/Post";
import AssetVote from "../../shared/containers/asset/assetVote";
import CandleStickGraphFilled from "../../svg/candleStickGraphFilled";
import LineGraphIcon from "../../svg/LineGraphIcon";
import AssetStatistics from "../../shared/containers/asset/assetStatistics";
import Button from "../../shared/buttons/button";
import { PremiumIcon } from "../../svg/premiumIcon";
import { PostSkeleton } from "../../shared/skeletons/skeletons";
import { percentageFormat } from "../../../utils/helpers/prices";
import { Modal } from "../modal";
import CloseIcon from "../../svg/Shared/CloseIcon";
import { Time } from "lightweight-charts";

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
  coinstats?: StatisticsResponseType
}

const AssetInformationTab: FC<IAssetInformationTab> = ({ stats, coinstats }) => {
  const { t } = useTranslation(["asset"]);
  const asset = useSelector(getAsset);
  const timeseries = useSelector(getAssetTimeseries);
  const { posts } = useSelector(({ posts }: any) => posts);
  const [activeSeries, setActiveSeries] = useState("24H");
  const [view, setView] = useState("price");
  const [viewHoldingsStatisticsModal, setViewHoldingsStatisticsModal] = useState<boolean>(false);
  const [viewTradesStatisticsModal, setViewTradesStatisticsModal] = useState<boolean>(false);

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

  const holdingsStatisticsModal = useMemo(() => {
    if (coinstats?.portfolio_holdings.length) {
      const data = coinstats.portfolio_holdings.map(holdingStats => ({ value: holdingStats.holding_percentage, time: (new Date(holdingStats.day).getTime() / 1000) as Time }));
      return (
        <Modal isVisible={viewHoldingsStatisticsModal} size='5xl'>
          <Col className='min-h-[200px] w-full p-6 bg-black-2 rounded-lg gap-5'>
            <Row className="justify-end">
              <Button onClick={() => { setViewHoldingsStatisticsModal(false) }}>
                <CloseIcon className='stroke-current text-[#89939F] w-4 h-4' />
              </Button>
            </Row>
            <p className="font-bold">{t("usersWhoHoldAssetOnARYACrypto", { assetSymbol: asset.symbol.toUpperCase() })}</p>
            <LineChart
              className="w-full h-96"
              primaryLineData={data}
              tooltip={{
                show: false,
                title: `${asset.symbol.toUpperCase()} Holders %`,
              }}
            />
          </Col>
        </Modal>
      )
    }
  }, [asset.symbol, coinstats?.portfolio_holdings, t, viewHoldingsStatisticsModal]);

  const tradeStatisticsModal = useMemo(() => {
    if (coinstats?.trades.length) {
      const data = coinstats.trades.map(tradesStats => ({ value: tradesStats.orders_count, time: (new Date(tradesStats.day).getTime() / 1000) as Time }));
      return (
        <Modal isVisible={viewTradesStatisticsModal} size='5xl'>
          <Col className='min-h-[200px] w-full p-6 bg-black-2 rounded-lg gap-5'>
            <Row className="justify-end">
              <Button onClick={() => { setViewTradesStatisticsModal(false) }}>
                <CloseIcon className='stroke-current text-[#89939F] w-4 h-4' />
              </Button>
            </Row>
            <p className="font-bold">{t("assetTradesToday", { assetSymbol: asset.symbol.toUpperCase() })}</p>
            <LineChart
              className="w-full h-96"
              primaryLineData={data}
              tooltip={{
                show: false,
                title: `${asset.symbol.toUpperCase()} Holders %`,
              }}
            />
          </Col>
        </Modal>
      )
    }
  }, [asset.symbol, coinstats?.trades, t, viewTradesStatisticsModal]);

  const holdingInsightsCard = useMemo(() => {
    if (coinstats && coinstats.portfolio_holdings.length) {
      const todaysHoldingsStatistics = coinstats.portfolio_holdings[coinstats.portfolio_holdings.length - 1];
      return (
        <Col className="relative flex-1 w-full">
          <Row className={clsx({ "blur-md": coinstats?.premium }, "bg-grey-3 px-6 py-4 rounded-lg gap-4 flex-row items w-full")}>
            <Col>
              <CircularProgressbar text="" value={coinstats?.premium ? 12.6 : todaysHoldingsStatistics?.holding_percentage || 0} className="max-w-28 h-28" strokeWidth={18} styles={buildStyles({
                pathColor: "#558AF2",
                strokeLinecap: 'butt',
              })} />
            </Col>
            <Col className="flex-1 justify-center gap-2">
              <Row className="justify-between">
                <p className="text-4xl font-bold text-blue-1 text-left">{coinstats?.premium ? '12.6' : percentageFormat(todaysHoldingsStatistics?.holding_percentage || 0)}%</p>
              </Row>
              <p className="text-sm font-bold text-white text-left">{t('statsHolding', { coin: asset?.symbol?.toUpperCase() || '' })}</p>
            </Col>
            <Button className="text-sm font-bold bg-blue-3 px-5 py-1 absolute right-6 top-6 md:top-4 rounded-lg" onClick={() => { setViewHoldingsStatisticsModal(true) }}>{t("viewMore")}</Button>
            {holdingsStatisticsModal}
          </Row>

          {coinstats?.premium && <Row className="top-0 right-0 bottom-0 left-0 absolute items-center justify-center gap-4 px-5">
            <PremiumIcon />
            <p className="text-white font-bold">{t('common:premiumusersfeature')}</p>
            <Button className="bg-blue-1 h-12 px-4 rounded-lg text-bold text-white font-bold text-sm">
              {t('common:upgradenow')}
            </Button>
          </Row>}
        </Col>
      )
    }
  }, [asset?.symbol, coinstats, holdingsStatisticsModal, t]);

  const assetTradesInsightsCard = useMemo(() => {
    if (coinstats && coinstats.trades.length > 1) {
      const todaysTradingsStatistics = coinstats.trades[coinstats.trades.length - 1];
      const yesterdaysTradingsStatistics = coinstats.trades[coinstats.trades.length - 2];

      return (
        <Col className="relative flex-1 w-full">
          <Row className={clsx({ "blur-md": coinstats?.premium }, "bg-grey-3 px-6 py-4 rounded-lg flex-1 gap-2 min-h-[126px] w-full relative")}>
            <Col className="justify-center gap-2">
              <p className="text-4xl font-extrabold text-blue-1 text-left">{coinstats?.premium ? '1011' : todaysTradingsStatistics?.orders_count || 0}</p>
              <p className="text-sm font-bold text-white text-left">{t('todayTrades', { coin: asset?.symbol?.toUpperCase() || '' })}</p>
            </Col>
            <Col className="justify-center gap-2">
              <p className="text-4xl font-extrabold text-blue-1 text-left">{coinstats?.premium ? '+12' : coinstats?.trades.length < 2 ? "0" : ((todaysTradingsStatistics?.orders_count - yesterdaysTradingsStatistics?.orders_count) / (yesterdaysTradingsStatistics?.orders_count) * 100).toFixed(1)}%</p>
              <p className="text-sm font-bold text-white text-left">{t('todayVolume')}</p>
            </Col>
            <Button className="text-sm font-bold bg-blue-3 px-5 py-1 absolute right-6 top-6 md:top-4 rounded-lg" onClick={() => { setViewTradesStatisticsModal(true) }}>{t("viewMore")}</Button>
            {tradeStatisticsModal}
          </Row>

          {coinstats?.premium && <Row className="top-0 right-0 bottom-0 left-0 absolute items-center justify-center gap-4 px-5">
            <PremiumIcon />
            <p className="text-white font-bold">{t('common:premiumusersfeature')}</p>
            <Button className="bg-blue-1 h-12 px-4 rounded-lg text-bold text-white font-bold text-sm">
              {t('common:upgradenow')}
            </Button>
          </Row>}
        </Col>
      )
    }
  }, [coinstats, t, asset?.symbol, tradeStatisticsModal])

  const assetInsights = useMemo(() => {
    return (
      <Col className="justify-center gap-6">
        <h3 className="asset-header">{t('insights')}</h3>
        <Row className="gap-10 items-center flex-col xl:flex-row flex-1">
          {holdingInsightsCard}
          {assetTradesInsightsCard}
        </Row>
      </Col>
    )
  }, [assetTradesInsightsCard, holdingInsightsCard, t])

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
            <div className="h-[500px] w-full">
              <TradingViewWidget
                asset={`${asset.symbol?.toUpperCase()}USDT`}
                height={500}
              />
            </div>
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
        {assetInsights}
        <AssetVote className="md:hidden" />
        <Col className="gap-4">
          <h3 className="asset-header">{t("cryptoProfitCalculator")}</h3>
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
          {posts ? posts?.length > 0 ? (
            <>
              <h3 className="asset-header">
                {t("communityTitle", { coin: asset.name })}
              </h3>
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
            </>
          )
            : (<></>)
            : (<>
              <h3 className="asset-header">
                {t("communityTitle", { coin: asset.name })}
              </h3>
              <PostSkeleton />
            </>
            )}
        </Col>
      </Col>
    </Col >
  );
};

export default AssetInformationTab;
