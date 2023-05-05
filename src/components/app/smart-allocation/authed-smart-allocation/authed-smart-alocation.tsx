import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row } from "../../../shared/layout/flex";
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher";
import { PortfolioSnapshotType } from "../../../../types/exchange.types";
import { getPortfolioSnapshots } from "../../../../services/controllers/market";
import { selectSelectedExchange } from "../../../../services/redux/exchangeSlice";
import { useSelector } from "react-redux";
import { MODE_DEBUG } from "../../../../utils/constants/config";
import { chartDataType } from "../../../shared/charts/graph/graph.type";
import LineChart from "../../../shared/charts/graph/graph";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import SmartAllocationHoldingsTab from "./smart-allocation-tabs/smart-allocation-holdings-tab/smart-allocation-holdings-tab";
import { SmartAllocationAssetType } from "../../../../types/smart-allocation.types";
import PageLoader from "../../../shared/pageLoader/pageLoader";
import { getSmartAllocation } from "../../../../services/controllers/smart-allocation";

const AuthedSmartAllocation: FC = () => {
    const [isLoadingPortfolioHoldings, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
    const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);

    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);

    const selectedExchange = useSelector(selectSelectedExchange);


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
    }, [selectedExchange?.provider_id]);

    const initSmartAllocationHoldings = useCallback(() => {
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                const data: any = res.data;
                const holdings: SmartAllocationAssetType[] = data.assets;
                setSmartAllocationTotalEvaluation(data.total_asset_value);

                if (holdings && data.exists) {
                    holdings.sort((a, b) => ((b?.current_weight ?? 0) - (a?.current_weight ?? 0)));
                    setSmartAllocationHoldings(holdings);
                }
            })
            .catch((error) => {
                if (MODE_DEBUG)
                    console.error("Error while initSmartAllocationHoldings (initSmartAllocationHoldings)", error)
            })
            .finally(() => {
                setIsLoadingSmartAllocationHoldings(false);
            })
    }, [selectedExchange?.provider_id]);


    useEffect(() => {
        initPortfolioSnapshots();
        initSmartAllocationHoldings();
    }, [initPortfolioSnapshots, initSmartAllocationHoldings]);

    const noAllocation = useMemo(() => {
        return (
            <Col className="items-center justify-center col-span-full gap-10">
                <ExchangeSwitcher />
                <Row className="justify-center">
                    <Col className="items-center">
                        <p className="text-2xl">Select a preset or customize your portfolio</p>
                        <p className="text-grey-1">Select a preset below, or custom your portfolio.</p>
                    </Col>
                </Row>
                <Row className="items-center justify-center gap-5">
                    <Col className="w-64 bg-blue-1 aspect-video rounded-md items-center justify-center gap-1">
                        <div className="w-16 aspect-square rounded-full bg-blue-3"></div>
                        <p className="text-white font-bold">Customize portfolio</p>
                    </Col>
                    <Col className="w-64 bg-blue-3 aspect-video rounded-md items-center justify-center gap-1">
                        <div className="w-16 aspect-square rounded-full bg-blue-3"></div>
                        <p className="text-white font-bold">Current top 5 coins</p>
                    </Col>
                    <Col className="w-64 bg-blue-3 aspect-video rounded-md items-center justify-center gap-1">
                        <div className="w-16 aspect-square rounded-full bg-blue-3"></div>
                        <p className="text-white font-bold">Current top 10 coins</p>
                    </Col>
                    <Col className="w-64 bg-blue-3 aspect-video rounded-md items-center justify-center gap-1">
                        <div className="w-16 aspect-square rounded-full bg-blue-3"></div>
                        <p className="text-white font-bold">Current top 15 coins</p>
                    </Col>
                </Row>
            </Col>
        )
    }, []);


    const smartAllocationGraph = useMemo(() => {

        if (portfolioSnapshots.length) {
            const smartAllocationData: chartDataType[] = portfolioSnapshots?.map((snapshot) => {

                const time = new Date(snapshot.created_at).getTime();
                return {
                    time: Math.floor((time / 1000)) as chartDataType["time"],
                    value: snapshot.smart_allocation_total_evaluation ?? 0,
                }
            });

            return (
                <LineChart primaryLineData={smartAllocationData} className={"w-full h-[400px]"} />
            )

        }
    }, [portfolioSnapshots]);

    const tabs = useMemo(() => {

        console.log({ smartAllocationHoldings })
        return (
            <Tabs className="w-full font-light" selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                <TabList className="w-full border-b-[1px] border-grey-3 mb-6">
                    <Row className='gap-4'>
                        <Tab className="text-sm outline-none cursor-pointer px-5">Your holdings</Tab>
                        <Tab className="text-sm outline-none cursor-pointer px-5">Automation</Tab>
                        <Tab className="text-sm outline-none cursor-pointer px-5">Portfolio trade history</Tab>
                    </Row>
                </TabList>
                <TabPanel>
                    <SmartAllocationHoldingsTab smartAllocationHoldings={smartAllocationHoldings} smartAllocationTotalEvaluation={smartAllocationTotalEvaluation} />
                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
            </Tabs>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation]);

    const withAllocation = useMemo(() => {
        return (
            <Col className="items-center justify-center col-span-full gap-10">
                <Row className="w-full justify-between items-end">
                    <ExchangeSwitcher />
                </Row>
                {smartAllocationGraph}
                {tabs}
            </Col>
        )
    }, [smartAllocationGraph, tabs]);

    return (
        <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
            {(isLoadingSmartAllocationHoldings || isLoadingPortfolioHoldings) && <PageLoader />}
            {withAllocation}
        </Col>
    )
}

export default AuthedSmartAllocation;