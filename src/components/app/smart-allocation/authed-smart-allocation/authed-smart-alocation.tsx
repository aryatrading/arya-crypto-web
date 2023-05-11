import { FC, createContext, useCallback, useEffect, useMemo, useState } from "react"
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
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { Top10Icon, Top15Icon, Top5Icon } from "../../../svg/smart-allocation/top-coins-icons";
import Link from "next/link";
import clsx from "clsx";
import { SelectSmartAllocationPortfolioIcon } from "../../../svg/smart-allocation/customize-portfolio-icon";
import { useTranslation } from "next-i18next";
import { EnumPredefinedSmartAllocationPortfolio, EnumRebalancingFrequency } from "../../../../utils/constants/smartAllocation";
import SmartAllocationAutomation from "./SmartAllocationAutomation/SmartAllocationAutomation";


export interface ISmartAllocationContext {
    rebalancingDate: Date|null,
    rebalancingFrequency: EnumRebalancingFrequency|null,
    isLoadingSmartAllocationData: boolean,
    getSmartAllocationData: Function,
}

export const SmartAllocationContext = createContext<ISmartAllocationContext>({
    rebalancingDate: null,
    rebalancingFrequency: null,
    isLoadingSmartAllocationData: false,
    getSmartAllocationData: () => null,
})

const AuthedSmartAllocation: FC = () => {

    const {t} = useTranslation(['smart-allocation']);

    const [isLoadingPortfolioHoldings, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
    const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationExists, setSmartAllocationExists] = useState<boolean>(false);
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);
    const [rebalancingDate, setRebalancingDate] = useState<Date|null>(null);
    const [rebalancingFrequency, setRebalancingFrequency] = useState<EnumRebalancingFrequency|null>(null);

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
        if(!selectedExchange?.provider_id){
            return;
        }
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                if(MODE_DEBUG){
                    console.log(res.data)
                }
                const data: any = res.data;
                const holdings: SmartAllocationAssetType[] = data.assets;
                setSmartAllocationTotalEvaluation(data.total_asset_value);
                setSmartAllocationExists(data?.exists ?? false);

                if(data.frequency){
                    setRebalancingFrequency(data.frequency);
                }else{
                    setRebalancingFrequency(null);
                }
                if(data.next_run_time){
                    setRebalancingDate(new Date(data.next_run_time));
                }else{
                    setRebalancingDate(null);
                }
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


    const getPredefinedAllocationsButtons = useCallback(({ label, icon, href, isCustom }: { label: string, icon: any, href: string, isCustom: boolean }) => {
        return (
            <Link href={href} className={clsx("flex flex-col w-64 aspect-video rounded-md items-center justify-center gap-5", { "bg-blue-1": isCustom, "bg-blue-3": !isCustom, })}>
                <Row className="w-16 items-center justify-center aspect-square rounded-full bg-blue-3">{icon}</Row>
                <p className="text-white font-bold">{label}</p>
            </Link>
        )
    }, []);

    const noAllocation = useMemo(() => {
        return (
            <Col className="items-center justify-center col-span-full gap-10">
                <ExchangeSwitcher canSelectOverall={false}/>
                <Row className="justify-center">
                    <Col className="items-center">
                        <Col className="items-center gap-5 sm:flex-row">
                            <SelectSmartAllocationPortfolioIcon />
                            <p className="text-2xl text-center sm:text-start">{t('selectAPresetOrCustomizeYourPortfolio')}</p>
                        </Col>
                        <p className="text-grey-1 text-center sm:text-start">{t('selectAPresetBelowOrCustomYourPortfolio')}</p>
                    </Col>
                </Row>
                <Row className="items-center justify-center gap-5 flex-wrap">
                    {getPredefinedAllocationsButtons({
                        label: t('customizePortfolio'),
                        icon: <AdjustmentsHorizontalIcon width={35} height={35} />,
                        href: "smart-allocation/edit",
                        isCustom: true,
                    })}
                    {getPredefinedAllocationsButtons({
                        label: t('currentTop5Coins'),
                        icon: <Top5Icon />,
                        href: `smart-allocation/edit?portfolio=${EnumPredefinedSmartAllocationPortfolio.top5}`,
                        isCustom: false,
                    })}
                    {getPredefinedAllocationsButtons({
                        label: t('currentTop10Coins'),
                        icon: <Top10Icon />,
                        href: `smart-allocation/edit?portfolio=${EnumPredefinedSmartAllocationPortfolio.top10}`,
                        isCustom: false,
                    })}
                    {getPredefinedAllocationsButtons({
                        label: t('currentTop15Coins'),
                        icon: <Top15Icon />,
                        href: `smart-allocation/edit?portfolio=${EnumPredefinedSmartAllocationPortfolio.top15}`,
                        isCustom: false,
                    })}
                </Row>
            </Col>
        )
    }, [getPredefinedAllocationsButtons, t]);


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
        return (
            <Tabs defaultIndex={1} className="w-full font-light" selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                <TabList className="w-full border-b-[1px] border-grey-3 mb-6">
                    <Row className='gap-4'>
                        <Tab className="text-sm outline-none cursor-pointer px-5">{t('yourHoldings')}</Tab>
                        <Tab className="text-sm outline-none cursor-pointer px-5">{t('automation')}</Tab>
                        <Tab className="text-sm outline-none cursor-pointer px-5">{t('portfolioTradeHistory')}</Tab>
                    </Row>
                </TabList>
                <TabPanel>
                    <SmartAllocationHoldingsTab smartAllocationHoldings={smartAllocationHoldings} smartAllocationTotalEvaluation={smartAllocationTotalEvaluation} />
                </TabPanel>
                <TabPanel>
                    <SmartAllocationAutomation/>
                </TabPanel>
                <TabPanel>

                </TabPanel>
            </Tabs>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation, t]);

    const withAllocation = useMemo(() => {
        return (
            <Col className="items-center justify-center col-span-full gap-10">
                <Row className="w-full justify-between items-end">
                    <ExchangeSwitcher canSelectOverall={false}/>
                </Row>
                {smartAllocationGraph}
                {tabs}
            </Col>
        )
    }, [smartAllocationGraph, tabs]);

    return (
        <SmartAllocationContext.Provider value={{rebalancingDate, rebalancingFrequency,isLoadingSmartAllocationData:isLoadingSmartAllocationHoldings,getSmartAllocationData:initSmartAllocationHoldings}}>
            <Col className="w-full grid grid-cols-12 md:gap-10 lg:gap-16 pb-20 items-start justify-start">
                {(isLoadingSmartAllocationHoldings || isLoadingPortfolioHoldings) && <PageLoader />}
                {smartAllocationExists ? withAllocation : noAllocation}
            </Col>
        </SmartAllocationContext.Provider>
    )
}

export default AuthedSmartAllocation;