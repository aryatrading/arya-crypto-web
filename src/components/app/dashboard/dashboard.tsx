import { FC, useMemo } from "react"
import { Col, Row } from "../../shared/layout/flex"
import { ArrowDownCircleIcon, PlusIcon } from "@heroicons/react/24/solid"
import DoughnutChart from "../../shared/charts/doughnut/doughnut"
import GraphChart from "../../shared/charts/graph/graph"
import Button from "../../shared/buttons/button"
import Table from "../../shared/form/table/table"



const Dashboard: FC = () => {


    const exchangeSelector = useMemo(() => {
        return (
            <Col className="col-span-12 items-start">
                <Row className="items-center justify-center gap-2">
                    <h3 className="text-2xl font-bold">Overall portfolio</h3>
                    <div><ArrowDownCircleIcon height="20px" width="20px" /></div>
                </Row>
                <Row>
                    <h3 className="text-3xl font-bold">$1,250.57 <span className="text-base">USD</span></h3>
                </Row>
            </Col>
        )
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
                        <PlusIcon width={15}/>
                        <p>
                            Add Assets
                        </p>
                    </Button>
                </Row>
                <Table></Table>
            </Col>
        )
    }, [])

    return (
        <Col className="grid grid-cols-12 gap-10">
            {exchangeSelector}
            {charts}
            {holdingsTable}
        </Col>
    )
}

export default Dashboard;