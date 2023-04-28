import { FC, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useSelector } from "react-redux"
import { useTranslation } from "next-i18next"

import { Col, Row } from "../../shared/layout/flex"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import LineChart from "../../shared/charts/graph/graph"
import Button from "../../shared/buttons/button"
import ExchangeSwitcher from "../../shared/exchange-switcher/exchange-switcher"
import { getPortfolioHoldings, getPortfolioSnapshots } from "../../../services/controllers/market"
import { PortfolioAssetType, PortfolioSnapshotType } from "../../../types/exchange.types"
import { chartDataType } from "../../shared/charts/graph/graph.type"
import { percentageFormat, priceFormat } from "../../../utils/helpers/prices"
import LoadingSpinner from "../../shared/loading-spinner/loading-spinner"
import { selectConnectedExchanges, selectExchangeStoreStatus, selectSelectedExchange } from "../../../services/redux/exchangeSlice"
import StatusAsync from "../../../utils/status-async"
import ExchangeImage from "../../shared/exchange-image/exchange-image"
import { MODE_DEBUG } from "../../../utils/constants/config"

import styles from "./dashboard.module.scss"

const Dashboard: FC = () => {

    const [isLoadingPortfolioSnapshots, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
    const [isLoadingPortfolioHoldings, setIsLoadingPortfolioHoldings] = useState<boolean>(false);
    const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
    const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioAssetType[]>([]);
    const [totalPortfolioAmountInUSD, setTotalPortfolioAmountInUSD] = useState<number>(0);

    const exchangeStoreStatus = useSelector(selectExchangeStoreStatus);
    const selectedExchange = useSelector(selectSelectedExchange);
    const connectedExchanges = useSelector(selectConnectedExchanges);

    const { t } = useTranslation(["dashboard", "common"]);

    useEffect(() => {
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
    }, [selectedExchange?.provider_id]);

    useEffect(() => {
        setIsLoadingPortfolioHoldings(true);
        getPortfolioHoldings(selectedExchange?.provider_id)
            .then((res) => {
                const data: any = res.data;
                if (selectedExchange?.provider_id) {
                    const assets: PortfolioAssetType[] = data[selectedExchange?.provider_id]?.data;
                    if (assets?.length) {
                        assets.sort((a, b) => (b.current_value - a.current_value));
                        setPortfolioHoldings(assets);

                        let total = assets.map(asset => asset.current_value)?.reduce((prev, current) => {
                            return prev + current;
                        });
                        setTotalPortfolioAmountInUSD(total);
                    }
                } else {
                    setPortfolioHoldings([]);
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
        setIsLoadingPortfolioHoldings(true);
    }, []);


    const portfolioDoughnutChart = useMemo(() => {

        if (selectedExchange?.provider_id) {
            return (
                <Col className="sm:col-span-1 col-span-3">
                    <DoughnutChart
                        maxWidth="250px"
                        chartData={portfolioHoldings.map(asset => ({
                            label: asset.name,
                            value: asset.current_value,
                        }))}
                        title={t("common:portfolioComposition")}
                    />
                </Col>
            )
        }
    }, [portfolioHoldings, selectedExchange?.provider_id, t])

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
            <LineChart primaryLineData={chartData} secondaryLineData={smartAllocationData} className={clsx("sm:col-span-2 col-span-3 h-[400px]", { "sm:col-span-3": (!selectedExchange?.provider_id) },)} />
        )

    }, [portfolioSnapshots, selectedExchange?.provider_id])

    const charts = useMemo(() => {
        return (
            <Row className="grid grid-cols-3 col-span-12 gap-5 sm:h-[400px]">
                {portfolioDoughnutChart}
                {portfolioLineChart}
            </Row>
        )
    }, [portfolioDoughnutChart, portfolioLineChart]);

    const tableExchangesImages = useMemo(() => {
        if (selectedExchange?.provider_id) {
            return (
                <ExchangeImage providerId={selectedExchange?.provider_id} ></ExchangeImage>
            );
        } else {
            return connectedExchanges?.map((exchange) => {
                return (
                    <ExchangeImage key={exchange.name} providerId={exchange?.provider_id} ></ExchangeImage>
                );
            })
        }
    }, [connectedExchanges, selectedExchange?.provider_id])

    const table = useMemo(() => {
        return (
            <Row className="w-full overflow-auto">
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t("common:name")}</th>
                            <th>{t("common:weight")}</th>
                            <th>{t("common:amount")}</th>
                            <th>{t("common:currentPrice")}</th>
                            <th>{t("common:value")}</th>
                            <th>{t("common:24hP/L")}</th>
                            <th>{t("common:exchange")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!portfolioHoldings.length ?
                            <tr>
                                <td colSpan={7} className="row-span-full">{t("common:noAssets")}</td>
                            </tr>
                            : portfolioHoldings.map(asset => {
                                const isPriceChangePositive = asset.asset_details.price_change_percentage_24h > 0;
                                const signal = isPriceChangePositive ? '+' : '-';

                                const formattedChangePercentage = `${signal}${percentageFormat(Math.abs(asset.asset_details.price_change_percentage_24h))}`;
                                const formattedChangePrice = `${signal}$${priceFormat(Math.abs(asset.asset_details.price_change_24h))}`;

                                const assetPortfolioPercentage = asset.current_value / totalPortfolioAmountInUSD * 100;

                                return (
                                    <tr key={asset.name}>
                                        <td>
                                            <Row className="gap-3 items-center">
                                                <Image src={asset.asset_details.image} alt="" width={23} height={23} />
                                                <p>{asset.asset_details.name}</p>
                                                <span className="text-sm text-grey-1">{asset.name}</span>
                                            </Row>
                                        </td>
                                        <td>
                                            <Row className="justify-between items-center w-[120px]">
                                                <p>{percentageFormat(asset.current_value / totalPortfolioAmountInUSD * 100)}%</p>
                                                <Row className="h-[5px] rounded-full w-[50px] bg-white">
                                                    <Row className={`h-full rounded-full bg-blue-1`} style={{
                                                        width: `${Math.ceil(assetPortfolioPercentage)}%`
                                                    }} />
                                                </Row>
                                            </Row>
                                        </td>
                                        <td>{priceFormat(asset.current_amount)} {asset.name}</td>
                                        <td>${priceFormat(asset.asset_details.current_price)}</td>
                                        <td>${priceFormat(asset.current_amount * asset.asset_details.current_price)}</td>
                                        <td className={clsx({ "text-green-1": isPriceChangePositive, "text-red-1": !isPriceChangePositive })}>{formattedChangePercentage}% ({formattedChangePrice})</td>
                                        <td>
                                            <Row className="gap-2">
                                                {tableExchangesImages}
                                            </Row>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </Row>
        )
    }, [portfolioHoldings, t, tableExchangesImages, totalPortfolioAmountInUSD])

    const holdingsTable = useMemo(() => {
        if (selectedExchange?.provider_id) {
            return (
                <Col className="gap-5 col-span-12">
                    <Row className="items-center justify-between w-full">
                        <h3 className="text-2xl font-semibold">{t("yourHoldings")}</h3>
                        <Button className="flex items-center gap-1 p-2 rounded-md bg-blue-3 text-blue-1">
                            <PlusIcon width={15} />
                            <p className="font-bold">
                                {t('addAssets')}
                            </p>
                        </Button>
                    </Row>
                    {table}
                </Col>
            )
        }
    }, [selectedExchange?.provider_id, t, table]);

    const loadingOverlay = useMemo(() => {
        return (
            <Col className="w-full h-full bg-white bg-opacity-40 fixed z-10 left-0 top-0 items-center justify-center">
                <Col className="w-40 h-40 bg-slate-50 rounded-md">
                    <LoadingSpinner />
                </Col>
            </Col>
        )


    }, [])

    return (
        <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
            <ExchangeSwitcher />
            {charts}
            {holdingsTable}
            {(isLoadingPortfolioSnapshots || isLoadingPortfolioHoldings || exchangeStoreStatus === StatusAsync.PENDING) && loadingOverlay}
        </Col>
    )
}

export default Dashboard;