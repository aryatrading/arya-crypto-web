import { FC, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../shared/layout/flex"
import { PlusIcon } from "@heroicons/react/24/solid"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import GraphChart from "../../shared/charts/graph/graph"
import Button from "../../shared/buttons/button"
import Table from "../../shared/form/table/table"
import ExchangeSwitcher from "../../shared/exchange-switcher/exchangeSwitcher"
import { getPortfolioSnapshots } from "../../../services/controllers/market"



const Dashboard: FC = () => {

    const [isLoadingPortfolioSnapshts, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);

    useEffect(() => {
        setIsLoadingPortfolioSnapshots(true);
        getPortfolioSnapshots(1).then((res) => {
            console.log({ res });
        })
        .catch((error)=>{
            console.error(error)
        })
        .finally(() => {
            setIsLoadingPortfolioSnapshots(false);
        })
    }, [])


    const protfolioDonatChart = useMemo(() => {
        return (
            <Col className="col-span-1">
                <DoughnutChart
                    maxWidth="250px"
                    chartData={
                        [
                            {
                                label: "Bitcoin",
                                value: 100,
                            },
                            {
                                label: "Cordano",
                                value: 100,
                            },
                            {
                                label: "Polkadot",
                                value: 100,
                            },
                            {
                                label: "Link",
                                value: 100,
                            },
                        ]
                    }
                    title="Portfolio composition"
                />
            </Col>
        )
    }, [])

    const protfolioLineChart = useMemo(() => {
        return (
            <GraphChart chartData={[
                { time: '2018-12-12', value: 24.11, open: 24.11, close: 24.11, high: 24.11, low: 24.11 },
                { time: '2018-12-13', value: 31.74, open: 24.11, close: 24.11, high: 24.11, low: 24.11 },
            ]}
                className="col-span-2"
            />
        )
    }, [])

    const charts = useMemo(() => {
        return (
            <Row className="grid grid-cols-3 gap-4 col-span-12 gap-5 h-[400px]">
                {protfolioDonatChart}
                {protfolioLineChart}
            </Row>
        )
    }, [protfolioDonatChart, protfolioLineChart])

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
                <Table></Table>
            </Col>
        )
    }, []);

    return (
        <Col className="grid grid-cols-12 gap-10">
            <ExchangeSwitcher />
            {charts}
            {holdingsTable}
        </Col>
    )
}

export default Dashboard;