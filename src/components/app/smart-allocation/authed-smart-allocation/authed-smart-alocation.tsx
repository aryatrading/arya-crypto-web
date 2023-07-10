import { FC, createContext, useCallback, useEffect, useMemo, useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import { ISmartAllocationContext, SmartAllocationAssetType, SmartAllocationExitStrategyType } from "../../../../types/smart-allocation.types";
import SmartAllocationHoldingsTab from "./smart-allocation-tabs/smart-allocation-holdings-tab/smart-allocation-holdings-tab";
import SmartAllocationTradeLog from "./smart-allocation-tabs/SmartAllocationTradeLog/SmartAllocationTradeLog";
import NoConnectedExchangePage from "../../../shared/no-exchange-connected-page/no-exchange-connected-page";
import { selectConnectedExchanges, selectSelectedExchange } from "../../../../services/redux/exchangeSlice";
import { getExitStrategy, getSmartAllocation } from "../../../../services/controllers/smart-allocation";
import SmartAllocationSimulation from "./smart-allocation-simulation/smart-allocation-simulation";
import { getAssetCurrentValue, getAssetCurrentWeight, sortSmartAllocationsHoldings } from "../../../../utils/smart-allocation";
import { EnumReBalancingFrequency } from "../../../../utils/constants/smartAllocation";
import ExchangeSwitcher from "../../../shared/exchange-switcher/exchange-switcher";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { MODE_DEBUG } from "../../../../utils/constants/config";
import { Col, Row } from "../../../shared/layout/flex";
import { USDTSymbol } from "../../../../utils/constants/market";




export const SmartAllocationContext = createContext<ISmartAllocationContext>({
    rebalancingDate: null,
    rebalancingFrequency: null,
    isLoadingSmartAllocationData: false,
    exitStrategyData: null,
    isLoadingExitStrategy: false,
    fetchSmartAllocationData: () => null,
    fetchExitStrategy: () => null,
})

const AuthedSmartAllocation: FC = () => {

    const { t } = useTranslation(['smart-allocation']);

    const [isLoadingExitStrategy, setIsLoadingExitStrategy] = useState<boolean>(false);
    const [isLoadingSmartAllocationHoldings, setIsLoadingSmartAllocationHoldings] = useState<boolean>(false);
    const [smartAllocationHoldings, setSmartAllocationHoldings] = useState<SmartAllocationAssetType[]>([]);
    const [smartAllocationExists, setSmartAllocationExists] = useState<boolean>();
    const [fetchingHoldingsError, setFetchingHoldingsError] = useState<string>();

    const [rebalancingDate, setRebalancingDate] = useState<Date | null>(null);
    const [rebalancingFrequency, setRebalancingFrequency] = useState<EnumReBalancingFrequency | null>(null);
    const [exitStrategy, setExitStrategy] = useState<null | SmartAllocationExitStrategyType>(null);
    const selectedExchange = useSelector(selectSelectedExchange);
    const connectedExchanges = useSelector(selectConnectedExchanges);

    const getTotalAssetsValue = useCallback((smartAllocationHoldings: SmartAllocationAssetType[]) => {
        const total = smartAllocationHoldings.map(holding => getAssetCurrentValue(holding, holding.asset_details?.asset_data?.current_price ?? 0)).reduce((prev, curr) => prev + curr);
        const stableCoinsExceptUSDTTotal = smartAllocationHoldings.map(holding => holding.stable && holding.name !== USDTSymbol ? getAssetCurrentValue(holding, holding.asset_details?.asset_data?.current_price ?? 0) : 0).reduce((prev, curr) => (prev ?? 0) + (curr ?? 0));
        return total - stableCoinsExceptUSDTTotal;
    }, [])

    const initSmartAllocationHoldings = useCallback(() => {
        if (!selectedExchange?.provider_id) {
            if (MODE_DEBUG) {
                console.error('initSmartAllocationHolding: selectedExchange?.provider_id is false', selectedExchange?.provider_id)
            }
            return
        };
        setIsLoadingSmartAllocationHoldings(true);
        getSmartAllocation(selectedExchange?.provider_id)
            .then((res) => {
                const data: any = res.data;
                const holdings: SmartAllocationAssetType[] = data.assets;
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
                if (holdings) {

                    const totalValue = getTotalAssetsValue(holdings);

                    holdings.sort((a, b) => sortSmartAllocationsHoldings(a, b, totalValue));

                    setSmartAllocationHoldings(holdings.map((holding) => {
                        const currentWeight = getAssetCurrentWeight(holding, holding.asset_details?.asset_data?.current_price ?? 0, totalValue);
                        return {
                            ...holding,
                            current_value: getAssetCurrentValue(holding, holding.asset_details?.asset_data?.current_price ?? 0),
                            current_weight: currentWeight,
                            expected_value: (holding.weight ?? 0) * totalValue,
                        };
                    }));
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
    }, [getTotalAssetsValue, selectedExchange?.provider_id]);

    const fetchExitStrategy = useCallback(() => {
        if (!selectedExchange?.provider_id) {
            if (MODE_DEBUG) {
                console.error(`fetchExitStrategy: missing provider_id:${selectedExchange?.provider_id}`)
            }
            return
        }
        setIsLoadingExitStrategy(true)
        getExitStrategy(selectedExchange?.provider_id).then((res) => {
            const { data } = res
            if (data) {
                setExitStrategy(data)
            }
        }).catch((error) => {
            if (MODE_DEBUG) {
                console.error(error)
            }
        }).finally(() => {
            setIsLoadingExitStrategy(false)
        })
    }, [selectedExchange?.provider_id])


    useEffect(() => {
        if (selectedExchange?.provider_id) {
            initSmartAllocationHoldings();
        }
    }, [initSmartAllocationHoldings, selectedExchange?.provider_id]);

    useEffect(() => {
        if (selectedExchange?.provider_id) {
            fetchExitStrategy()
        }
    }, [fetchExitStrategy, selectedExchange?.provider_id])

    const tabs = useMemo(() => {
        return (
            <Tabs className="w-full font-light" selectedTabClassName="text-blue-1 font-bold text-lg border-b-2 border-blue-1 pb-3">
                <TabList className="flex overflow-auto w-full border-b-[1px] border-grey-3 mb-6">
                    <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t('yourHoldings')}</Tab>
                    <Tab className="text-sm shrink-0 outline-none cursor-pointer px-5">{t('portfolioTradeHistory')}</Tab>
                </TabList>
                <TabPanel>
                    <SmartAllocationHoldingsTab smartAllocationHoldings={smartAllocationHoldings} isLoading={isLoadingSmartAllocationHoldings} />
                </TabPanel>
                <TabPanel>
                    <SmartAllocationTradeLog />
                </TabPanel>
            </Tabs>
        )
    }, [isLoadingSmartAllocationHoldings, smartAllocationHoldings, t]);

    const withAllocation = useMemo(() => {
        return (
            <Col className="w-full items-center justify-center col-span-full gap-10">
                <Row className="w-full justify-between items-end">
                    <ExchangeSwitcher canSelectOverall={false} />
                </Row>
                <SmartAllocationSimulation blured={smartAllocationExists === false} smartAllocationHoldings={smartAllocationHoldings} isLoadingSmartAllocationHoldings={isLoadingSmartAllocationHoldings} />
                {tabs}
            </Col>
        )
    }, [isLoadingSmartAllocationHoldings, smartAllocationExists, smartAllocationHoldings, tabs]);

    const noAllocation = useMemo(() => {
        if (smartAllocationExists === false) {
            return withAllocation;
        } else {
            return (
                <Col className="w-full md:items-center justify-center col-span-full gap-10">
                    <ExchangeSwitcher canSelectOverall={false} />
                    <Row className="justify-center  mt-40">
                        <Col className="items-center gap-5">
                            <Col className="items-center gap-5">
                                <ExclamationTriangleIcon color="yellow" width={50} />
                                <p className="text-2xl max-w-xs md:max-w-none font-semibold text-center md:text-start">{t("somethingWentWrongWhileFetchingYourSmartAllocation")}</p>
                            </Col>
                            <p className="text-grey-1 text-center md:text-start">{fetchingHoldingsError}</p>
                        </Col>
                    </Row>
                </Col>
            )
        }
    }, [fetchingHoldingsError, smartAllocationExists, t, withAllocation]);

    const connectedExchangesWithProviders = useMemo(() => connectedExchanges?.filter(exchange => exchange.provider_id), [connectedExchanges]);

    if (connectedExchangesWithProviders?.length || isLoadingSmartAllocationHoldings || isLoadingExitStrategy) {
        return (
            <SmartAllocationContext.Provider value={{
                rebalancingDate,
                rebalancingFrequency,
                isLoadingSmartAllocationData: isLoadingSmartAllocationHoldings,
                fetchSmartAllocationData: initSmartAllocationHoldings,
                exitStrategyData: exitStrategy,
                isLoadingExitStrategy,
                fetchExitStrategy
            }}>
                <Col className="w-full md:gap-10 lg:gap-16 md:items-center pb-20 items-start justify-start">
                    {(smartAllocationExists || isLoadingSmartAllocationHoldings) ? withAllocation : noAllocation}
                </Col>
            </SmartAllocationContext.Provider>
        )
    } else {
        const DummyView = () => (
            <SmartAllocationContext.Provider value={{
                rebalancingDate,
                rebalancingFrequency,
                isLoadingSmartAllocationData: isLoadingSmartAllocationHoldings,
                fetchSmartAllocationData: initSmartAllocationHoldings,
                exitStrategyData: exitStrategy,
                isLoadingExitStrategy,
                fetchExitStrategy
            }}>
                <Col className="w-full md:items-center pb-20 items-start justify-start">
                    {withAllocation}
                </Col>
            </SmartAllocationContext.Provider>
        );
        return (
            <NoConnectedExchangePage Component={DummyView} />
        )
    }
}

export default AuthedSmartAllocation;