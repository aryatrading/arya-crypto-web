import { FC, createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Col, Row } from "../../../shared/layout/flex";
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher";
import { PortfolioSnapshotType } from "../../../../types/exchange.types";
import { getPortfolioSnapshots } from "../../../../services/controllers/market";
import { selectConnectedExchanges, selectSelectedExchange } from "../../../../services/redux/exchangeSlice";
import { MODE_DEBUG } from "../../../../utils/constants/config";
import { chartDataType } from "../../../shared/charts/graph/graph.type";
import LineChart from "../../../shared/charts/graph/graph";
import SmartAllocationHoldingsTab from "./smart-allocation-tabs/smart-allocation-holdings-tab/smart-allocation-holdings-tab";
import { ISmartAllocationContext, SmartAllocationAssetType } from "../../../../types/smart-allocation.types";
import PageLoader from "../../../shared/pageLoader/pageLoader";
import { getSmartAllocation } from "../../../../services/controllers/smart-allocation";
import { Top10Icon, Top15Icon, Top5Icon } from "../../../svg/smart-allocation/top-coins-icons";
import { SelectSmartAllocationPortfolioIcon } from "../../../svg/smart-allocation/customize-portfolio-icon";
import NoConnectedExchangePage from "../../../shared/no-exchange-connected-page/no-exchange-connected-page";
import { EnumPredefinedSmartAllocationPortfolio, EnumRebalancingFrequency } from "../../../../utils/constants/smartAllocation";
import SmartAllocationTradeLog from "./smart-allocation-tabs/SmartAllocationTradeLog/SmartAllocationTradeLog";
import PortfolioComposition from "../../../shared/portfolio-composition/portfolio-composition";
import { useResponsive } from "../../../../context/responsive.context";
import SmartAllocationSimulation from "./smart-allocation-simulation/smart-allocation-simulation";
import { useRouter } from "next/router";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";




export const SmartAllocationContext = createContext<ISmartAllocationContext>({
    rebalancingDate: null,
    rebalancingFrequency: null,
    isLoadingSmartAllocationData: false,
    getSmartAllocationData: () => null,
})

const AuthedSmartAllocation: FC = () => {

    const { t } = useTranslation(['smart-allocation']);

    const router = useRouter()

    const [isLoadingPortfolioHoldings, setIsLoadingPortfolioSnapshots] = useState<boolean>(false);
    const [portfolioSnapshots, setPortfolioSnapshots] = useState<PortfolioSnapshotType[]>([]);
    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationExists, setSmartAllocationExists] = useState<boolean>();
    const [smartAllocationTotalEvaluation, setSmartAllocationTotalEvaluation] = useState<number>(0);
    const [rebalancingDate, setRebalancingDate] = useState<Date | null>(null);
    const [rebalancingFrequency, setRebalancingFrequency] = useState<EnumRebalancingFrequency | null>(null);
    const [fetchingHoldingsError, setFetchingHoldingsError] = useState<string>();

    const selectedExchange = useSelector(selectSelectedExchange);
    const connectedExchanges = useSelector(selectConnectedExchanges);

    const { isTabletOrMobileScreen } = useResponsive();


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
        if (!selectedExchange?.provider_id) {
            if (MODE_DEBUG) {
                console.log('initSmartAllocationHolding: selectedExchange?.provider_id is false', selectedExchange?.provider_id)
            }
            return
        };
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                if (MODE_DEBUG) {
                    console.log(res.data)
                }
                const data: any = res.data;
                const holdings: SmartAllocationAssetType[] = data.assets;
                setSmartAllocationTotalEvaluation(data.total_asset_value);
                setSmartAllocationExists(data?.exists ?? false);

                if (data.frequency) {
                    setRebalancingFrequency(data.frequency);
                } else {
                    setRebalancingFrequency(null);
                }
                if (data.next_run_time) {
                    setRebalancingDate(new Date(data.next_run_time));
                } else {
                    setRebalancingDate(null);
                }
                if (holdings && data.exists) {
                    holdings.sort((a, b) => ((b?.current_weight ?? 0) - (a?.current_weight ?? 0)));
                    setSmartAllocationHoldings(holdings);
                }
            })
            .catch((error) => {
                setFetchingHoldingsError(error.message);
                if (MODE_DEBUG)
                    console.error("Error while initSmartAllocationHoldings (initSmartAllocationHoldings)", error)
            })
            .finally(() => {
                setIsLoadingSmartAllocationHoldings(false);
            })
    }, [selectedExchange?.provider_id]);


    useEffect(() => {
        if (selectedExchange?.provider_id) {
            initPortfolioSnapshots();
            initSmartAllocationHoldings();
        }
    }, [initPortfolioSnapshots, initSmartAllocationHoldings, selectedExchange?.provider_id]);


    const noAllocation = useMemo(() => {
        if (smartAllocationExists === false) {
            router.push("/smart-allocation/edit");
        } else {
            return (
                <Col className="w-full md:items-center justify-center col-span-full gap-10">
                <ExchangeSwitcher canSelectOverall={false} />
                    <Row className="justify-center  mt-40">
                        <Col className="items-center gap-5">
                            <Col className="items-center gap-5">
                                <ExclamationTriangleIcon color="yellow" width={50}/>
                                <p className="text-2xl max-w-xs md:max-w-none font-semibold text-center md:text-start">{"Something went wrong while fetching your smart allocation"}</p>
                            </Col>
                            <p className="text-grey-1 text-center md:text-start">{fetchingHoldingsError}</p>
                        </Col>
                    </Row>
                </Col>
            )
        }
    }, [fetchingHoldingsError, router, smartAllocationExists]);


    const portfolioComposition = useMemo(() => {
        return (
            <PortfolioComposition portfolioAssets={smartAllocationHoldings.map(asset => {
                return {
                    symbol: asset.name ?? '',
                    name: (asset.name ?? ''),
                    weight: (asset.current_value ?? 0) / (smartAllocationTotalEvaluation ?? 1)
                };
            })} />
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation]);

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
                <Col className="w-full gap-5">
                    {isTabletOrMobileScreen && portfolioComposition}
                    <LineChart primaryLineData={smartAllocationData} className={"w-full h-[200px] md:h-[400px]"} />
                </Col>
            )

        }
    }, [isTabletOrMobileScreen, portfolioComposition, portfolioSnapshots]);

    const tabs = useMemo(() => {
        return (
            <Tabs className="w-full font-light" selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                <TabList className="flex overflow-auto w-full border-b-[1px] border-grey-3 mb-6">
                    <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t('yourHoldings')}</Tab>
                    <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t('portfolioTradeHistory')}</Tab>
                </TabList>
                <TabPanel>
                    <SmartAllocationHoldingsTab smartAllocationHoldings={smartAllocationHoldings} smartAllocationTotalEvaluation={smartAllocationTotalEvaluation} />
                </TabPanel>
                <TabPanel>
                    <SmartAllocationTradeLog />
                </TabPanel>
            </Tabs>
        )
    }, [smartAllocationHoldings, smartAllocationTotalEvaluation, t]);

    const withAllocation = useMemo(() => {
        return (
            <Col className="items-center justify-center col-span-full gap-10">
                <Row className="w-full justify-between items-end">
                    <ExchangeSwitcher canSelectOverall={false} />
                </Row>
                <SmartAllocationSimulation smartAllocationHoldings={smartAllocationHoldings} />
                {tabs}
            </Col>
        )
    }, [smartAllocationHoldings, tabs]);

    if (isLoadingSmartAllocationHoldings || isLoadingPortfolioHoldings) {
        return <PageLoader />;
    } else {
        const connectedExchangesWithProviders = connectedExchanges?.filter(exchange => exchange.provider_id);
        if (connectedExchangesWithProviders?.length) {
            return (
                <SmartAllocationContext.Provider value={{ rebalancingDate, rebalancingFrequency, isLoadingSmartAllocationData: isLoadingSmartAllocationHoldings, getSmartAllocationData: initSmartAllocationHoldings }}>
                    <Col className="w-full md:gap-10 lg:gap-16 md:items-center pb-20 items-start justify-start">
                        {(isLoadingSmartAllocationHoldings || isLoadingPortfolioHoldings) && <PageLoader />}
                        {smartAllocationExists ? withAllocation : noAllocation}
                    </Col>
                </SmartAllocationContext.Provider>
            )
        } else {
            return (
                <NoConnectedExchangePage />
            )
        }
    }
}

export default AuthedSmartAllocation;