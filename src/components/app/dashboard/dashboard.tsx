import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "next-i18next"
import { useSelector } from "react-redux"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import { selectConnectedExchanges, selectExchangeStoreStatus, selectSelectedExchange } from "../../../services/redux/exchangeSlice"
import NoConnectedExchangePage from "../../shared/no-exchange-connected-page/no-exchange-connected-page"
import { getPortfolioHoldings, getPortfolioSnapshots } from "../../../services/controllers/market"
import { PortfolioAssetType, PortfolioSnapshotType } from "../../../types/exchange.types"
import { GraphDataRange, chartDataType } from "../../shared/charts/graph/graph.type"
import { TimeseriesPicker } from "../../shared/containers/asset/graphTimeseries"
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher"
import { percentageFormat, formatNumber } from "../../../utils/helpers/prices"
import CutoutDoughnutChart from "../../shared/charts/doughnut/cutout-doughnut"
import { portfolioGraphDataRanges } from "../../../utils/constants/dashboard"
import ExchangeImage from "../../shared/exchange-image/exchange-image"
import { useResponsive } from "../../../context/responsive.context"
import { TableRowSkeleton } from "../../shared/skeletons/skeletons"
import { getCoinColor } from "../../../utils/helpers/coinsColors"
import { ShadowButton } from "../../shared/buttons/shadow_button"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import AssetPnl from "../../shared/containers/asset/assetPnl"
import { MODE_DEBUG } from "../../../utils/constants/config"
import { LineChartIcon } from "../../svg/lineChartIcon"
import LineChart from "../../shared/charts/graph/graph"
import { PieChartIcon } from "../../svg/pieChartIcon"
import { Col, Row } from "../../shared/layout/flex"

import styles from "./dashboard.module.scss"

const Dashboard: FC = () => {
  const [isLoadingPortfolioSnapshots, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
  const [isLoadingPortfolioHoldings, setIsLoadingPortfolioHoldings] = useState<boolean>(false);
  const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioAssetType[]>([]);
  const [activeSeries, setActiveSeries] = useState<GraphDataRange>(GraphDataRange["24h"]);
  const [selectedChart, setSelectedChart] = useState<"doughnut" | "graph">("doughnut");

  const exchangeStoreStatus = useSelector(selectExchangeStoreStatus);
  const selectedExchange = useSelector(selectSelectedExchange);
  const connectedExchanges = useSelector(selectConnectedExchanges);

  const { isTabletOrMobileScreen } = useResponsive();
  const { t } = useTranslation(["dashboard", "common"]);


  const initPortfolioSnapshots = useCallback(() => {
    if (!portfolioSnapshots.length)
      setIsLoadingPortfolioSnapshots(true);

    getPortfolioSnapshots(selectedExchange?.provider_id, activeSeries)
      .then((res) => {
        const data: any = res.data;
        const exchangeSnapshotsData: PortfolioSnapshotType[] = data.data;

        if (exchangeSnapshotsData) {
          exchangeSnapshotsData.sort((a, b) => ((new Date(a.created_at).getTime()) - new Date(b.created_at).getTime()));
          setPortfolioSnapshots(exchangeSnapshotsData);
        }
      })
      .catch((error) => {
        if (MODE_DEBUG)
          console.error("Error while getting portfolio Snapshots (getPortfolioSnapshots)", error)
      })
      .finally(() => {
        setIsLoadingPortfolioSnapshots(false);
      })

  }, [activeSeries, portfolioSnapshots.length, selectedExchange?.provider_id])


  const getAssetUSDValue = (asset: PortfolioAssetType) => {
    return (asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0)
  }

  const initPortfolioHoldings = useCallback(() => {
    if (!portfolioHoldings.length)
      setIsLoadingPortfolioHoldings(true);
    getPortfolioHoldings(selectedExchange?.provider_id)
      .then((res) => {
        const data: any = res?.data;
        const assets: PortfolioAssetType[] = data?.data;
        if (assets?.length) {
          assets.sort((a, b) => (getAssetUSDValue(b) - getAssetUSDValue(a)));
          setPortfolioHoldings(assets);
        }

      })
      .catch((error) => {
        if (MODE_DEBUG)
          console.error("Error while getting portfolio holdings (getPortfolioHoldings)", error)
      })
      .finally(() => {
        setIsLoadingPortfolioHoldings(false);
      });

  }, [portfolioHoldings.length, selectedExchange?.provider_id]);


  useEffect(() => {
    initPortfolioSnapshots();
  }, [initPortfolioSnapshots]);

  useEffect(() => {
    initPortfolioHoldings();
  }, [initPortfolioHoldings]);

  const portfolioDoughnutChart = useMemo(() => {
    return (
      <Col className="justify-center w-full sm:max-w-[300px] h-[400px]">
        <DoughnutChart
          maxWidth="min(100%, 300px)"
          chartData={portfolioHoldings.map(asset => ({
            coinSymbol: asset.asset_details?.symbol ?? "",
            label: asset.name ?? "",
            value: (asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0),
          }))}
          title={t("common:portfolioComposition")}
          isLoading={isLoadingPortfolioHoldings}
        />
      </Col>
    )
  }, [isLoadingPortfolioHoldings, portfolioHoldings, t])



  const portfolioCutoutDoughnutChart = useMemo(() => {
    return (
      <Col className="justify-center w-full sm:max-w-[300px] h-[200px]  md:h-[400px]">
        <CutoutDoughnutChart
          chartData={portfolioHoldings.map(asset => ({
            coinSymbol: asset.asset_details?.symbol ?? "",
            label: asset.name ?? "",
            value: (asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0),
          }))}
          cutout="70%"
        />
      </Col>
    )
  }, [portfolioHoldings])

  const onSeriesClick = useCallback(async (series: any) => {
    setActiveSeries(series.key);
  }, []);

  const portfolioLineChart = useMemo(() => {

    const chartData: chartDataType[] = portfolioSnapshots?.map((snapshot) => {

      const time = new Date(snapshot.created_at).getTime();
      return {
        time: Math.floor((time / 1000)) as chartDataType["time"],
        value: snapshot.total_evaluation ?? 0,
      }
    });

    return (
      <Col className="w-full gap-10">
        {!isTabletOrMobileScreen && <Row className="justify-end h-10">
          <TimeseriesPicker
            series={portfolioGraphDataRanges}
            active={activeSeries}
            onclick={onSeriesClick}
          />
        </Row>}
        <LineChart primaryLineData={chartData} className={"h-[200px] md:h-[400px]"} tooltip={{
          show: true,
          title: t("portfolioValue"),
          showValue: true,
        }}
          isLoading={isLoadingPortfolioSnapshots}
        />
      </Col>
    )

  }, [activeSeries, isLoadingPortfolioSnapshots, isTabletOrMobileScreen, onSeriesClick, portfolioSnapshots, t])

  const charts = useMemo(() => {
    if (isTabletOrMobileScreen) {
      return (
        <Col className="w-full items-center justify-center gap-5">
          {selectedChart === "doughnut" ? portfolioCutoutDoughnutChart : portfolioLineChart}
          <Row className="w-full h-10 justify-between gap-0.5 overflow-auto">
            {portfolioGraphDataRanges.map((elm, index) => {
              return (
                <ShadowButton
                  className={twMerge('px-3 py-2 gap-0 w-full')}
                  key={index}
                  title={elm.title}
                  onClick={() => onSeriesClick(elm)}
                  showBadge={index % 2 === 0}
                  border={index === 0 ? "rounded-l-md" : ""}
                  iconSvg={null}
                  bgColor={activeSeries === elm.key ? "bg-blue-3" : "bg-grey-2"}
                  textColor={activeSeries === elm.key ? "text-blue-2" : "text-grey-1"}
                  textSize={`font-medium text-xs`}
                />
              );
            })}
            {selectedChart === "doughnut" ?
              <ShadowButton
                iconSvg={
                  <LineChartIcon pathFill={"#558AF2"} />
                }
                onClick={() => { setSelectedChart('graph') }}
                border="rounded-r-md"
                bgColor={"bg-black-2"}
                textColor={"text-blue-1"}
              />
              : <ShadowButton
                onClick={() => { setSelectedChart('doughnut') }}
                iconSvg={
                  <PieChartIcon stroke={"#558AF2"}/>
                }
                border="rounded-r-md"
                bgColor={"bg-black-2"}
                textColor={"text-blue-1"}
              />
            }
          </Row>
        </Col>
      )
    } else {
      return (
        <Col className="w-full items-center justify-center gap-5 sm:h-[400px] sm:flex-row">
          {portfolioDoughnutChart}
          {portfolioLineChart}
        </Col>
      )
    }
  }, [activeSeries, isTabletOrMobileScreen, onSeriesClick, portfolioCutoutDoughnutChart, portfolioDoughnutChart, portfolioLineChart, selectedChart]);

  const tableExchangesImages = useCallback((exchanges_ids?: number[]) => {
    if (exchanges_ids?.length) {
      return exchanges_ids?.map((exchangeId) => {
        return (
          <ExchangeImage key={exchangeId} providerId={exchangeId} ></ExchangeImage>
        );
      })
    } else {
      if (selectedExchange?.provider_id) {
        return (
          <ExchangeImage providerId={selectedExchange?.provider_id} ></ExchangeImage>
        );
      }
    }
  }, [selectedExchange?.provider_id])


  const tableHeader = useMemo(() => {

    if (isTabletOrMobileScreen) {
      return (
        <thead>
          <tr>
            <th className="text-left">{t("common:amount")}</th>
            <th className="text-right">{t("common:24hP/L")}</th>
            <th className="text-right">{t("common:price")}</th>
          </tr>
        </thead>
      );
    } else {
      return (
        <thead>
          <tr>
            <th className="text-left">{t("common:name")}</th>
            <th className="text-left">{t("common:weight")}</th>
            <th className="text-right">{t("common:amount")}</th>
            <th className="text-right">{t("common:currentPrice")}</th>
            <th className="text-right">{t("common:value")}</th>
            <th className="text-right">{t("common:24hP/L")}</th>
            <th className="text-right">{t("common:exchange")}</th>
          </tr>
        </thead>
      );
    }
  }, [isTabletOrMobileScreen, t]);

  const tableLoadingSkeleton = useMemo(() => {
    if (isTabletOrMobileScreen) {
      return (
        <>
          <TableRowSkeleton numberOfColumns={3} />
          <TableRowSkeleton numberOfColumns={3} />
          <TableRowSkeleton numberOfColumns={3} />
          <TableRowSkeleton numberOfColumns={3} />
          <TableRowSkeleton numberOfColumns={3} />
        </>
      )
    } else {
      return (
        <>
          <TableRowSkeleton numberOfColumns={7} />
          <TableRowSkeleton numberOfColumns={7} />
          <TableRowSkeleton numberOfColumns={7} />
          <TableRowSkeleton numberOfColumns={7} />
          <TableRowSkeleton numberOfColumns={7} />
        </>
      )
    }
  }, [isTabletOrMobileScreen]);

  const tableBody = useMemo(() => {
    if (!portfolioHoldings.length) {
      if (isLoadingPortfolioHoldings) {
        return tableLoadingSkeleton;
      } else {
        return (
          <tr>
            <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
          </tr>
        )
      }
    } else {
      return portfolioHoldings.map((asset, index) => {
        const isPriceChangePositive = (asset?.pnl?.percentage ?? 0) > 0;
        const signal = isPriceChangePositive ? '+' : '-';

        const formattedChangePrice = `${signal}$${formatNumber(Math.abs(asset?.asset_details?.price_change_24h ?? 0))}`;

        const assetPortfolioPercentage = asset.weight;

        const coinColor = getCoinColor(asset.asset_details?.symbol ?? "", index);


        if (isTabletOrMobileScreen) {
          return (
            <tr className="hover:bg-black-2/25 hover:bg-blend-darken cursor-pointer" key={asset.name}>
              <td>
                <Link href={`/asset?symbol=${asset.asset_details?.symbol}`} className="flex flex-Col items-center">
                  <Image className="mr-4" src={asset?.asset_details?.image ?? ""} alt="" width={30} height={30} />
                  <Col className="text-sm font-semibold">
                    <Row className="gap-2">
                      <p className="">{asset.name}</p>
                      <p>{formatNumber(asset.free ?? 0)}</p>
                    </Row>
                    <p>${formatNumber((asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0))}</p>
                  </Col>
                </Link>
              </td>
              <td className="text-right">
                <AssetPnl
                  value={asset?.pnl?.percentage ?? 0}
                  className={
                    (asset?.pnl?.percentage ?? 0) <= 0
                      ? "bg-red-2 text-red-1"
                      : "bg-green-2 text-green-1"
                  }
                />
              </td>
              <td className="text-right font-semibold">${formatNumber(asset?.asset_details?.current_price ?? 0)}</td>
            </tr>
          );
        } else {
          return (
            <tr className="hover:bg-black-2/25 hover:bg-blend-darken cursor-pointer" key={asset.name}>
              <td>
                <Link href={`/asset?symbol=${asset.asset_details?.symbol}`} className="flex flex-row items-center">
                  <Image className="mr-4" src={asset?.asset_details?.image ?? ""} alt="" width={23} height={23} />
                  <p className="font-semibold mr-1">{asset?.asset_details?.name}</p>
                  <span className="text-sm text-grey-1 font-semibold"> • {asset.name}</span>
                </Link>
              </td>
              <td>
                <Row className="justify-between items-center w-[120px]">
                  <p>{percentageFormat(asset.weight ?? 0)}%</p>
                  <Row className="h-[5px] rounded-full w-[50px] bg-white">
                    <Row className={`h-full rounded-full`} style={{
                      width: `${Math.ceil(assetPortfolioPercentage ?? 0)}%`,
                      backgroundColor: coinColor,
                    }} />
                  </Row>
                </Row>
              </td>
              <td className="text-right">{formatNumber(asset.free ?? 0)} {asset.name}</td>
              <td className="text-right">${formatNumber(asset?.asset_details?.current_price ?? 0)}</td>
              <td className="text-right">${formatNumber((asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0))}</td>
              <td className="text-right">
                <Row className="items-center justify-end ">
                  <Row className={clsx({ "text-green-1": isPriceChangePositive, "text-red-1": !isPriceChangePositive }, "mr-4")}>{formattedChangePrice}</Row>
                  <AssetPnl
                    value={asset?.pnl?.percentage ?? 0}
                    className={
                      (asset?.pnl?.percentage ?? 0) <= 0
                        ? "bg-red-2 text-red-1"
                        : "bg-green-2 text-green-1"
                    }
                  />
                </Row>

              </td>
              <td>
                <Row className="text-right justify-end gap-2">
                  {tableExchangesImages(asset?.exchanges_ids)}
                </Row>
              </td>
            </tr>
          );

        }
      });
    }
  }, [isLoadingPortfolioHoldings, isTabletOrMobileScreen, portfolioHoldings, t, tableExchangesImages, tableLoadingSkeleton]);

  const table = useMemo(() => {
    return (
      <Row className="w-full overflow-auto">
        <table className={styles.table}>
          {tableHeader}
          <tbody>
            {tableBody}
          </tbody>
        </table>
      </Row>
    )
  }, [tableBody, tableHeader]);

  const holdingsTable = useMemo(() => {
    return (
      <Col className="w-full gap-5">
        <Row className="items-center justify-between w-full">
          <h3 className="text-2xl font-semibold">{t("yourHoldings")}</h3>
          <Link href="/trade" className="flex items-center gap-1 p-2 rounded-md bg-blue-3 text-blue-1">
            <PlusIcon width={15} />
            <p className="font-bold">
              {t('addAssets')}
            </p>
          </Link>
        </Row>
        {table}
      </Col>
    )
  }, [t, table]);


  const connectedExchangesWithProviders = useMemo(() => connectedExchanges?.filter(exchange => exchange.provider_id), [connectedExchanges]);


  if (!connectedExchanges || connectedExchangesWithProviders?.length) {
    return (
      <Col className="w-full gap-10 lg:gap-16 pb-20 items-start justify-start">
        <ExchangeSwitcher />
        {charts}
        {holdingsTable}
      </Col>
    )
  } else {
    const connectedExchangesWithProviders = connectedExchanges?.filter(exchange => exchange.provider_id);
    if (connectedExchangesWithProviders?.length) {
      return (
        <Col className="w-full gap-10 lg:gap-16 pb-20 items-center md:items-start justify-start">
          <ExchangeSwitcher />
          {charts}
          {holdingsTable}
        </Col>
      )
    } else {
      return (
        <NoConnectedExchangePage />
      )
    }
  }
}

export default Dashboard;
