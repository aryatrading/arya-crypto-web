import { FC, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useSelector } from "react-redux"
import { useTranslation } from "next-i18next"

import { Col, Row } from "../../shared/layout/flex"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import LineChart from "../../shared/charts/graph/graph"
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher"
import { getPortfolioHoldings, getPortfolioSnapshots } from "../../../services/controllers/market"
import { PortfolioAssetType, PortfolioSnapshotType } from "../../../types/exchange.types"
import { chartDataType } from "../../shared/charts/graph/graph.type"
import { percentageFormat, formatNumber } from "../../../utils/helpers/prices"
import { selectConnectedExchanges, selectExchangeStoreStatus, selectSelectedExchange } from "../../../services/redux/exchangeSlice"
import StatusAsync from "../../../utils/status-async"
import ExchangeImage from "../../shared/exchange-image/exchange-image"
import { MODE_DEBUG } from "../../../utils/constants/config"

import styles from "./dashboard.module.scss"
import Link from "next/link"
import PageLoader from "../../shared/pageLoader/pageLoader"

const Dashboard: FC = () => {

  const [isLoadingPortfolioSnapshots, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
  const [isLoadingPortfolioHoldings, setIsLoadingPortfolioHoldings] = useState<boolean>(false);
  const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioAssetType[]>([]);

  const exchangeStoreStatus = useSelector(selectExchangeStoreStatus);
  const selectedExchange = useSelector(selectSelectedExchange);
  const connectedExchanges = useSelector(selectConnectedExchanges);

  const { t } = useTranslation(["dashboard", "common"]);


  const initPortfolioSnapshots = useCallback(() => {
    setIsLoadingPortfolioSnapshots(true);
    getPortfolioSnapshots(selectedExchange?.provider_id)
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
  }, [selectedExchange?.provider_id])


  const getAssetUSDValue = (asset: PortfolioAssetType) => {
    return (asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0)
  }

  const initPortfolioHoldings = useCallback(() => {

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

  }, [selectedExchange?.provider_id]);


  useEffect(() => {
    initPortfolioSnapshots();
    initPortfolioHoldings();
  }, [initPortfolioSnapshots, initPortfolioHoldings]);


  const portfolioDoughnutChart = useMemo(() => {

    if (portfolioHoldings.length) {
      return (
        <Col className="sm:col-span-1 col-span-3">
          <DoughnutChart
            maxWidth="250px"
            chartData={portfolioHoldings.map(asset => ({
              label: asset.name ?? "",
              value: (asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0),
            }))}
            title={t("common:portfolioComposition")}
          />
        </Col>
      )
    }
  }, [portfolioHoldings, t])

  const portfolioLineChart = useMemo(() => {

    const chartData: chartDataType[] = portfolioSnapshots?.map((snapshot) => {

      const time = new Date(snapshot.created_at).getTime();
      return {
        time: Math.floor((time / 1000)) as chartDataType["time"],
        value: snapshot.total_evaluation ?? 0,
      }
    });

    const smartAllocationData: chartDataType[] = portfolioSnapshots?.map((snapshot) => {

      const time = new Date(snapshot.created_at).getTime();
      return {
        time: Math.floor((time / 1000)) as chartDataType["time"],
        value: snapshot.smart_allocation_total_evaluation ?? 0,
      }
    });

    return (
      <LineChart primaryLineData={chartData} secondaryLineData={smartAllocationData} className={"sm:col-span-2 col-span-3 h-[400px]"} />
    )

  }, [portfolioSnapshots])

  const charts = useMemo(() => {
    return (
      <Row className="grid grid-cols-3 col-span-12 gap-5 sm:h-[400px]">
        {portfolioDoughnutChart}
        {portfolioLineChart}
      </Row>
    )
  }, [portfolioDoughnutChart, portfolioLineChart]);

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

  const table = useMemo(() => {
    return (
      <Row className="w-full overflow-auto">
        <table className={styles.table}>
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
          <tbody>
            {!portfolioHoldings.length ?
              <tr>
                <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
              </tr>
              : portfolioHoldings.map(asset => {
                const isPriceChangePositive = (asset?.asset_details?.price_change_percentage_24h ?? 0) > 0;
                const signal = isPriceChangePositive ? '+' : '-';

                const formattedChangePercentage = `${signal}${percentageFormat(Math.abs(asset?.asset_details?.price_change_percentage_24h ?? 0))}`;
                const formattedChangePrice = `${signal}$${formatNumber(Math.abs(asset?.asset_details?.price_change_24h ?? 0))}`;

                const assetPortfolioPercentage = asset.weight;

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
                          <Row className={`h-full rounded-full bg-blue-1`} style={{
                            width: `${Math.ceil(assetPortfolioPercentage ?? 0)}%`
                          }} />
                        </Row>
                      </Row>
                    </td>
                    <td className="text-right">{formatNumber(asset.free ?? 0)} {asset.name}</td>
                    <td className="text-right font-semibold">${formatNumber(asset?.asset_details?.current_price ?? 0)}</td>
                    <td className="text-right">${formatNumber((asset?.free ?? 0) * (asset?.asset_details?.current_price ?? 0))}</td>
                    <td className="text-right">
                      <Row className="items-center justify-end ">
                        <Row className={clsx({ "text-green-1": isPriceChangePositive, "text-red-1": !isPriceChangePositive }, "mr-4")}>{formattedChangePrice}</Row>
                      
                      <Row className={clsx({ "bg-green-2 text-green-1": isPriceChangePositive, "bg-red-2 text-red-1": !isPriceChangePositive }, "rounded-md py-1 px-2 font-semibold text-sm")}>
                          {formattedChangePercentage}%
                        </Row>
                        </Row>
                       
                    </td>
                    <td>
                      <Row className="text-right justify-end gap-2">
                        {tableExchangesImages(asset?.exchanges_ids)}
                      </Row>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Row>
    )
  }, [portfolioHoldings, t, tableExchangesImages])

  const holdingsTable = useMemo(() => {
    if (portfolioHoldings.length) {
      return (
        <Col className="gap-5 col-span-12">
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
    }
  }, [portfolioHoldings.length, t, table]);

  return (
    <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
      <ExchangeSwitcher />
      {charts}
      {holdingsTable}
      {(isLoadingPortfolioSnapshots || isLoadingPortfolioHoldings || exchangeStoreStatus === StatusAsync.PENDING) && <PageLoader />}
    </Col>
  )
}

export default Dashboard;
