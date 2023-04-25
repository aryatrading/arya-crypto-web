import { FC, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../shared/layout/flex"
import { PlusIcon } from "@heroicons/react/24/solid"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import LineChart from "../../shared/charts/graph/graph"
import Button from "../../shared/buttons/button"
import Table from "../../shared/form/table/table"
import ExchangeSwitcher from "../../shared/exchange-switcher/exchangeSwitcher"
import { getPortfolioHoldings, getPortfolioSnapshots } from "../../../services/controllers/market"
import { PortfolioAssetType, PortfolioSnapshotType } from "../../../types/exchange.types"
import { chartDataType } from "../../shared/charts/graph/graph.type"

import styles from "./dashboard.module.scss"
import { percentageFormat, priceFormat } from "../../../utils/helpers/prices"
import LoadingSpinner from "../../shared/loading-spinner/loading-spinner"



const Dashboard: FC = () => {

    const [isLoadingPortfolioSnapshts, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
    const [isLoadingPortfolioHoldings, setIsLoadingPortfolioHoldings] = useState<boolean>(false);
    const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
    const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioAssetType[]>([]);
    const [totalPortfolioAmountInUSD, setTotalPortfolioAmountInUSD] = useState<number>(0);

    const exchangeId = 1;

    useEffect(() => {
        setIsLoadingPortfolioSnapshots(true);
        getPortfolioSnapshots(1).then((res) => {
            const data: any = res.data;
            const exchangeSnapshotsData: PortfolioSnapshotType[] = data[exchangeId]?.data;

            if (exchangeSnapshotsData) {
                exchangeSnapshotsData.sort((a, b) => ((new Date(a.created_at).getTime()) - new Date(b.created_at).getTime()));
                setPortfolioSnapshots(exchangeSnapshotsData);
            }

        })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setIsLoadingPortfolioSnapshots(false);
            })
    }, []);

    useEffect(() => {
        setIsLoadingPortfolioHoldings(true);
        getPortfolioHoldings(1).then((res) => {
            const data: any = res.data;
            const assets: PortfolioAssetType[] = data[exchangeId]?.data;

            if (assets?.length) {
                assets.sort((a, b) => (b.current_value - a.current_value));
                setPortfolioHoldings(assets);


                let total = assets.map(asset => asset.current_value)?.reduce((prev, current) => {
                    return prev + current;
                });

                setTotalPortfolioAmountInUSD(total);

            }

        })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setIsLoadingPortfolioHoldings(false);
            })
    }, []);


    const protfolioDonatChart = useMemo(() => {
        return (
            <Col className="col-span-1">
                <DoughnutChart
                    maxWidth="250px"
                    chartData={portfolioHoldings.map(asset => ({
                        label: asset.name,
                        value: asset.current_value,
                    }))
                    }
                    title="Portfolio composition"
                />
            </Col>
        )
    }, [portfolioHoldings])

    const protfolioLineChart = useMemo(() => {

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
            <LineChart primaryLineData={chartData} secondaryLineData={smartAllocationData} className="col-span-2" />
        )

    }, [portfolioSnapshots])

    const charts = useMemo(() => {
        return (
            <Row className="grid grid-cols-3 gap-4 col-span-12 gap-5 h-[400px]">
                {protfolioDonatChart}
                {protfolioLineChart}
            </Row>
        )
    }, [protfolioDonatChart, protfolioLineChart])


    const table = useMemo(() => {

        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Amount</th>
                        <th>Current Price</th>
                        <th>Value</th>
                        <th>24h P/L</th>
                        <th>Exchange</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolioHoldings.map(asset => (
                        <tr key={asset.name}>
                            <td>{asset.name}</td>
                            <td>{percentageFormat(asset.current_value / totalPortfolioAmountInUSD * 100)}%</td>
                            <td>{priceFormat(asset.current_value)} BTC</td>
                            <td>${priceFormat(asset.current_value)}</td>
                            <td>${priceFormat(asset.current_value)}</td>
                            <td>{percentageFormat(asset.asset_details.price_change_24h)}% (+$152.8)</td>
                            <td>BINANCE</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }, [portfolioHoldings])

    const holdingsTable = useMemo(() => {
        return (
            <Col className="gap-5 col-span-12">
                <Row className="items-center justify-between w-full">
                    <h3 className="text-2xl font-bold">Your Holdings</h3>
                    <Button className="flex items-center gap-1 p-2 rounded-md bg-blue_three text-blue_one">
                        <PlusIcon width={15} />
                        <p className="font-bold">
                            Add Assets
                        </p>
                    </Button>
                </Row>
                {table}
            </Col>
        )
    }, [table]);

    const loadingOverlay = useMemo(() => {
        return (
            <Col className="w-full h-full bg-black_one bg-opacity-50 fixed z-10 left-0 top-0 items-center justify-center">
                <Col className="w-40 h-40 bg-slate-50 rounded-md">
                    <LoadingSpinner />
                </Col>
            </Col>
        )


    }, [])

    return (
        <Col className="grid grid-cols-12 gap-10 pb-20">
            <ExchangeSwitcher />
            {charts}
            {holdingsTable}
            {(isLoadingPortfolioSnapshts || isLoadingPortfolioHoldings) && loadingOverlay}
        </Col>
    )
}

export default Dashboard;