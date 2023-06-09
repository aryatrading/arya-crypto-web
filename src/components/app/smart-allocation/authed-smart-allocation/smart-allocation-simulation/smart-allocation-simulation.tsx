import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Time, UTCTimestamp } from "lightweight-charts";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import clsx from "clsx";

import RebalancePreviewDialog from "../smart-allocation-tabs/smart-allocation-holdings-tab/RebalancePreviewDialog/RebalancePreviewDialog";
import { EnumExitStrategyTrigger, EnumSmartAllocationSimulationPeriod } from "../../../../../utils/constants/smartAllocation";
import { SmartAllocationAssetType } from "../../../../../types/smart-allocation.types";
import CutoutDoughnutChart from "../../../../shared/charts/doughnut/cutout-doughnut";
import { formatNumber, percentageFormat } from "../../../../../utils/helpers/prices";
import { getAssetsHistoricalData } from "../../../../../services/controllers/asset";
import { doughnutChartDataType } from "../../../../shared/charts/doughnut/doughnut";
import { chartDataType } from "../../../../shared/charts/graph/graph.type";
import { useResponsive } from "../../../../../context/responsive.context";
import { stableCoinsFilter } from "../../../../../utils/smart-allocation";
import { ShadowButton } from "../../../../shared/buttons/shadow_button";
import { TextSkeleton } from "../../../../shared/skeletons/skeletons";
import { USDTSymbol } from "../../../../../utils/constants/market";
import { SmartAllocationContext } from "../authed-smart-alocation";
import LineChart from "../../../../shared/charts/graph/graph";
import { LineChartIcon } from "../../../../svg/lineChartIcon";
import { PieChartIcon } from "../../../../svg/pieChartIcon";
import { Col, Row } from "../../../../shared/layout/flex";
import { Trans, useTranslation } from "next-i18next";
import Input from "../../../../shared/inputs/Input";
import { MODE_DEBUG } from "../../../../../utils/constants/config";

function getShiftedDayDate(prevDay: Date, shiftInDays: number) {
    return new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate() + shiftInDays);
}

function applyLocalTimezoneOffset(timestamp: number) {
    const localTimezoneOffset = new Date().getTimezoneOffset();
    const timestampOffset = localTimezoneOffset * 60 * 1000;
    return timestamp - 2 * timestampOffset;
}

const SmartAllocationSimulation: FC<{ smartAllocationHoldings?: SmartAllocationAssetType[], isLoadingSmartAllocationHoldings: boolean, blured?: boolean }> = ({ smartAllocationHoldings, isLoadingSmartAllocationHoldings, blured }) => {

    const [simulationPeriod, setSimulationPeriod] = useState<EnumSmartAllocationSimulationPeriod>(EnumSmartAllocationSimulationPeriod["1m"]);
    const [initialValue, setInitialValue] = useState<number>(10_000);
    const [currentWeightsData, setCurrentWeightsData] = useState<chartDataType[]>([]);
    const [setWeightsData, setSetWeightsData] = useState<chartDataType[]>([]);
    const [currentWeightsDrawdown, setCurrentWeightsDrawdown] = useState<number>();
    const [setWeightsDrawdown, setSetWeightsDrawdown] = useState<number>();
    const [assetsHistoricalData, setAssetsHistoricalData] = useState<{ [k: string]: chartDataType[] }>();
    const [isLoading, setIsLoading] = useState<boolean>(isLoadingSmartAllocationHoldings);
    const [selectedChart, setSelectedChart] = useState<"doughnut" | "graph">("graph");
    const [customPeriodStartDate, setCustomPeriodStartDate] = useState<Date>(getShiftedDayDate(new Date(), -1));
    const [customPeriodEndDate, setCustomPeriodEndDate] = useState<Date>(new Date());
    const [validSymbols, setValidSymbols] = useState<String[]>([])

    const { t } = useTranslation(["smart-allocation"]);

    const { push } = useRouter();

    const { isTabletOrMobileScreen } = useResponsive();

    const { rebalancingDate, rebalancingFrequency, exitStrategyData } = useContext(SmartAllocationContext)


    const getAssetSymbol = useCallback((holding: SmartAllocationAssetType) => {
        const exchange = "BINANCE";
        if (holding.asset_details?.asset_name?.toLowerCase() !== USDTSymbol.toLowerCase()) {
            return `${holding.asset_details?.asset_name}/usd:${exchange}`
        } else {
            return `${holding.name}/usd`
        }
    }, []);

    const getHistoricalData = useCallback(() => {
        if (smartAllocationHoldings?.length) {

            const symbols = smartAllocationHoldings.map(getAssetSymbol);
            setIsLoading(true);
            getAssetsHistoricalData(symbols, simulationPeriod, customPeriodStartDate, customPeriodEndDate).then((res) => {
                const data = res.data;
                if (data) {
                    const assetsHistoricalData: { [k: string]: chartDataType[] } = {};
                    const symbolWithData = symbols.filter((symbol)=>data[symbol]?.values)
                    setValidSymbols(symbolWithData.map((symbol)=>symbol.split('/')[0].toLowerCase()))
                    symbolWithData.forEach(symbol => {
                        const assetData = data[symbol];
                        const values = assetData.values.map((value:any) => {
                            const item: chartDataType = {
                                value: parseFloat(value.open),
                                close: parseFloat(value.close),
                                time: (applyLocalTimezoneOffset(new Date(value.datetime).getTime()) /
                                    1000) as chartDataType["time"],
                                high: parseFloat(value.high),
                                low: parseFloat(value.low),
                                open: parseFloat(value.open),
                            };
                            return item;
                        }).reverse();
                        assetsHistoricalData[symbol] = values;
                    });

                    setAssetsHistoricalData(assetsHistoricalData);
                }
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [customPeriodEndDate, customPeriodStartDate, getAssetSymbol, simulationPeriod, smartAllocationHoldings]);


    useEffect(() => {
        getHistoricalData();
    }, [getHistoricalData])


    const calculateLineChartsData = useCallback(() => {
        if (assetsHistoricalData && smartAllocationHoldings?.length) {
            const holdingsWithHistoricalData = smartAllocationHoldings.filter((holding)=>validSymbols.includes(holding.asset_details?.asset_name?.toLowerCase()||''))
            const currentWeightsPoints: chartDataType[] = [];
            const setWeightsPoints: chartDataType[] = [];

            let currentWeightsDrawdown = initialValue;
            let setWeightsDrawdown = initialValue;

            const numberOfPoints = Object.values(assetsHistoricalData)[0].length;


            const quantities: {
                [k: string]: {
                    currentWeightQuantity: number,
                    setWeightQuantity: number,
                }
            } = {};

            const totalCurrentWeight = holdingsWithHistoricalData.map((a) => a.current_weight).reduce((prev, curr) => ((prev ?? 0) + (curr ?? 0))) ?? 1;

            holdingsWithHistoricalData.forEach((holding) => {
                const currentWeight = (holding.current_weight ?? 0) / totalCurrentWeight;
                const setWeight = holding.weight ?? 0;

                const assetSymbol = getAssetSymbol(holding);
                if(!assetsHistoricalData[assetSymbol]){
                    return
                }
                const firstPointValue = assetsHistoricalData[assetSymbol][0].value ?? 0;

                quantities[assetSymbol] = {
                    currentWeightQuantity: currentWeight * initialValue / firstPointValue,
                    setWeightQuantity: setWeight * initialValue / firstPointValue,
                }
            });


            for (let pointIndex = 0; pointIndex < numberOfPoints; pointIndex++) {

                let currentWeightValue = 0;
                let setWeightValue = 0;
                let time: Time = 0 as UTCTimestamp;

                Object.keys(quantities).forEach((assetSymbol) => {
                    const currentWeightQuantity = quantities[assetSymbol].currentWeightQuantity;
                    const setWeightQuantity = quantities[assetSymbol].setWeightQuantity;

                    currentWeightValue += (assetsHistoricalData[assetSymbol][pointIndex]?.value ?? 0) * currentWeightQuantity;
                    setWeightValue += (assetsHistoricalData[assetSymbol][pointIndex]?.value ?? 0) * setWeightQuantity;
                    if (assetsHistoricalData[assetSymbol][pointIndex]?.time)
                        time = assetsHistoricalData[assetSymbol][pointIndex]?.time;
                });

                if (currentWeightValue < currentWeightsDrawdown) {
                    currentWeightsDrawdown = currentWeightValue;
                }

                if (setWeightValue < setWeightsDrawdown) {
                    setWeightsDrawdown = setWeightValue;
                }

                currentWeightsPoints.push({ time, value: currentWeightValue });
                setWeightsPoints.push({ time, value: setWeightValue });

            }

            if (MODE_DEBUG) {
                console.log({ currentWeightsPoints })
            }
            setCurrentWeightsData(currentWeightsPoints);
            setSetWeightsData(setWeightsPoints);

            setCurrentWeightsDrawdown(currentWeightsDrawdown);
            setSetWeightsDrawdown(setWeightsDrawdown);
        }

    }, [assetsHistoricalData, getAssetSymbol, initialValue, smartAllocationHoldings, validSymbols]);

    useEffect(() => {
        calculateLineChartsData();
    }, [calculateLineChartsData]);

    const weightsDoughnutCharts = useCallback(({ chartTitle, chartData, drawdown, maxProfit, isBlured }: { chartTitle: string, chartData: doughnutChartDataType[], drawdown: number, maxProfit: number, isBlured?: boolean }) => {
        const riskValue = initialValue - drawdown;
        const returnValue = maxProfit - initialValue;
        const returnRiskRatio = returnValue / riskValue;
        const riskPercentage = riskValue / initialValue;
        const returnPercentage = returnValue / initialValue;
        const isLowRisk = returnRiskRatio > 0;
        return (
            <Col className="items-center w-[165px] md:flex-row md:flex-1 gap-5 md:h-full shrink-0 relative">
                {isBlured && <Link href="/smart-allocation/edit" className="flex items-center justify-center px-10 sm:top-auto top-1/4 left-[10%] h-[54px] dark:bg-blue-3 bg-blue-1 text-white absolute z-50 self-center rounded-lg">
                    {t('createPortfolio')}
                </Link>}

                <CutoutDoughnutChart
                    title={chartTitle}
                    chartData={chartData}
                    className={clsx({ "blur-2xl": isBlured }, "w-[160px] md:w-[262px] md:min-w-[130px]")}
                    isLoading={isLoadingSmartAllocationHoldings}
                />
                {<Col className={clsx({ "blur-2xl": isBlured }, "justify-center gap-5 px-2")}>
                    <Row className="gap-5 flex-wrap">
                        <Col>
                            <p className="text-sm font-bold">{t("drawdown")}</p>
                            {isLoading ? <TextSkeleton widthClassName="w-full" /> : <p className={clsx("text-sm font-bold", { "text-green-1": drawdown >= initialValue, "text-red-1": drawdown < initialValue })}>{percentageFormat(riskPercentage * 100)}%</p>}
                        </Col>
                        <Col>
                            <p className="text-sm font-bold">{t("profit")}</p>
                            {isLoading ? <TextSkeleton widthClassName="w-full" /> : <p className={clsx("text-sm font-bold", { "text-green-1": maxProfit >= initialValue, "text-red-1": maxProfit < initialValue })}>{percentageFormat(returnPercentage * 100)}%</p>}
                        </Col>
                    </Row>
                    <Col>
                        <p className="text-sm font-bold">{t("returnRisk")}</p>
                        {isLoading ? <TextSkeleton widthClassName="w-full" /> : <p className={clsx("text-3xl font-bold", { "text-green-1": isLowRisk, "text-red-1": !isLowRisk })}>{formatNumber(returnRiskRatio)}</p>}
                    </Col>
                </Col>}
            </Col>
        )
    }, [initialValue, isLoading, isLoadingSmartAllocationHoldings, t]);

    const doughnutCharts = useMemo(() => {
        return (
            <Row className="md:flex-[2] justify-between md:justify-evenly md:h-[250px] gap-2.5 w-full">
                {weightsDoughnutCharts({
                    chartTitle: t("currentWeight"),
                    chartData: smartAllocationHoldings?.filter(stableCoinsFilter)?.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: currentWeightsDrawdown ?? initialValue,
                    maxProfit: currentWeightsData[currentWeightsData.length - 1]?.value ?? 0,
                })}
                {weightsDoughnutCharts({
                    chartTitle: t("setWeight"),
                    chartData:
                        blured ?
                            smartAllocationHoldings?.filter(stableCoinsFilter)?.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" })) ?? []
                            :
                            smartAllocationHoldings?.filter(stableCoinsFilter)?.map(asset => ({ label: asset?.name ?? "", value: (asset.current_value ?? 0) / (asset.current_weight ?? 0) * (asset.weight ?? 0), coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: blured ? currentWeightsDrawdown ?? initialValue : setWeightsDrawdown ?? initialValue,
                    maxProfit: blured ? currentWeightsData[currentWeightsData.length - 1]?.value ?? 0 : setWeightsData[setWeightsData.length - 1]?.value ?? 0,
                    isBlured: blured
                })}
            </Row>
        )
    }, [weightsDoughnutCharts, t, smartAllocationHoldings, currentWeightsDrawdown, initialValue, currentWeightsData, blured, setWeightsDrawdown, setWeightsData]);

    const reBalanceNow = useMemo(() => {
        return (
            <Col className="w-full md:max-w-[300px] flex-1 gap-5 justify-center">
                <Row className="md:flex-col w-full gap-4 text-center">
                    <Link href="smart-allocation/edit" className="w-full flex items-center justify-center bg-blue-1 h-12 px-5 rounded-md text-sm font-bold">{t('editPortfolio')}</Link>
                    {!blured && <RebalancePreviewDialog holdingData={smartAllocationHoldings?.filter((asset) => asset.name?.toLowerCase() !== USDTSymbol.toLowerCase()) ?? []} />}
                </Row>
                <Col className="gap-4">
                    {rebalancingFrequency && <>
                        <p className="font-bold text-grey-1">{t('automation')}</p>
                        <p className="text-sm font-bold">{t('automaticRebalancingScheduled')} : <span className="text-blue-1">{t(`common:${rebalancingFrequency}`)}</span></p>
                        <p className="text-sm font-bold">{t('nextRebalancingSchedule')} : <span className="text-blue-1">{moment(rebalancingDate).format('DD/MM/YY')}</span></p>
                    </>}
                    {exitStrategyData && <>
                        <p className="font-bold text-grey-1">{t('common:exitStrategy')}</p>
                        <span className="text-sm font-medium">
                            <Trans i18nKey={'smart-allocation:haveExitStrategy'}

                                components={{ blueText: <span /> }}
                                values={{
                                    assetChangeType: t(exitStrategyData.exit_type as string),
                                    assetChangeValue: `${exitStrategyData.exit_type === EnumExitStrategyTrigger.RisesBy ? `${(exitStrategyData.exit_value ?? 0) * 100}%` : `${exitStrategyData.exit_value}$`}`,
                                    assetSellPercentage: `${(exitStrategyData.exit_percentage ?? 0) * 100}%`
                                }}
                            />
                        </span>
                    </>}
                </Col>
            </Col>
        )
    }, [exitStrategyData, rebalancingDate, rebalancingFrequency, smartAllocationHoldings, t])

    const graphLegend = useMemo(() => {
        return (
            <Row className="w-full items-center justify-center gap-5">
                <Row className="items-center justify-center gap-2">
                    <Col className="h-5 w-5 bg-blue-1 rounded-full" />
                    <p>{t("currentWeight")}</p>
                </Row>
                <Row className="items-center justify-center gap-2">
                    <Col className="h-5 w-5 bg-yellow-1  rounded-full" />
                    <p>{t("setWeight")}</p>
                </Row>
            </Row>
        )
    }, [t])

    const graphChart = useMemo(() => {
        return (

            <Col className="w-full gap-5">
                <LineChart
                    primaryLineData={currentWeightsData}
                    secondaryLineData={setWeightsData}
                    className={"w-full h-[200px] md:h-[400px]"}
                    isLoading={isLoading}
                    fixed={true}
                    tooltip={{
                        show: true,
                        title: t("profitChange%"),
                        showProfitChange: true,
                    }}
                />
                {graphLegend}
            </Col>
        )
    }, [currentWeightsData, graphLegend, isLoading, setWeightsData, t])


    const charts = useMemo(() => {
        if (isTabletOrMobileScreen) {
            return (
                <Col className="w-full items-center justify-center gap-5">
                    {selectedChart === "doughnut" ? doughnutCharts : graphChart}
                    <Row className="w-full h-10 justify-between gap-2 overflow-auto">
                        <Row className="gap-1">
                            <ShadowButton
                                onClick={() => { setSelectedChart('doughnut') }}
                                iconSvg={
                                    <PieChartIcon stroke={selectedChart === "doughnut" ? "#558AF2" : "#6B7280"} />
                                }
                                border="rounded-l-md"
                                bgColor={selectedChart === "doughnut" ? "bg-blue-3" : "bg-grey-2"}
                                textColor={selectedChart === "doughnut" ? "text-blue-2" : ""}
                            />
                            <ShadowButton
                                iconSvg={
                                    <LineChartIcon pathFill={selectedChart !== "doughnut" ? "#558AF2" : "#6B7280"} />
                                }
                                onClick={() => { setSelectedChart('graph') }}
                                border="rounded-r-md"
                                bgColor={selectedChart !== "doughnut" ? "bg-blue-3" : "bg-grey-2"}
                                textColor={selectedChart !== "doughnut" ? "text-blue-2" : ""}
                            />
                        </Row>
                    </Row>
                    {reBalanceNow}
                </Col>
            )
        } else {
            return (
                <Col className="w-full gap-10">
                    {graphChart}
                    <Col className="gap-10 md:flex-row flex-wrap">
                        {doughnutCharts}
                        {reBalanceNow}
                    </Col>
                </Col>
            )
        }
    }, [doughnutCharts, graphChart, isTabletOrMobileScreen, reBalanceNow, selectedChart])

    return (
        <Col className="w-full gap-10">
            <Col className="md:items-center md:flex-row gap-5">
                <Row className="items-center gap-5 justify-between">
                    <p className="font-bold text-xl">{t("simulatePortfolioOverThePast")}</p>
                    <select className="h-12 bg-grey-3 border-none rounded-md px-5 w-40 shrink-0  md:w-auto md:shrink" value={simulationPeriod} onChange={(event) => { setSimulationPeriod(event.target.value as any) }}>
                        <option value={EnumSmartAllocationSimulationPeriod["1w"]}>{t("1Week")}</option>
                        <option value={EnumSmartAllocationSimulationPeriod["1m"]}>{t("1Month")}</option>
                        <option value={EnumSmartAllocationSimulationPeriod["1y"]}>{t("1Year")}</option>
                        <option value={EnumSmartAllocationSimulationPeriod["5y"]}>{t("5Years")}</option>
                        <option value={EnumSmartAllocationSimulationPeriod["custom"]}>{t("custom")}</option>
                    </select>
                </Row>
                {simulationPeriod === EnumSmartAllocationSimulationPeriod.custom && <>
                    <Row className="items-center gap-5 justify-between">
                        <p className="font-bold text-xl">{t("from")}</p>
                        <Input
                            value={moment(new Date(customPeriodStartDate)).format('YYYY-MM-DD')}
                            type="date"
                            onChange={(event) => {
                                const value = event.target.value;
                                setCustomPeriodStartDate(new Date(value))
                            }}
                            className="w-40 md:w-auto h-12 bg-grey-3 border-none rounded-md px-5"
                            min="2009-01-03"
                            max={moment(getShiftedDayDate(new Date(), -1)).format('YYYY-MM-DD')}
                        />
                    </Row>
                    <Row className="items-center gap-5 justify-between">
                        <p className="font-bold text-xl">{t("to")}</p>
                        <Input
                            value={moment(new Date(customPeriodEndDate)).format('YYYY-MM-DD')}
                            type="date"
                            onChange={(event) => {
                                const value = event.target.value;
                                setCustomPeriodEndDate(new Date(value))
                            }}
                            className="w-40 md:w-auto h-12 bg-grey-3 border-none rounded-md px-5"
                            min={moment(getShiftedDayDate(customPeriodStartDate, 1)).format('YYYY-MM-DD')}
                            max={moment(new Date()).format('YYYY-MM-DD')}
                        />
                    </Row>
                </>}
                <Row className="items-center gap-5 justify-between">
                    <p className="font-bold text-xl">{t("startingWith")}</p>
                    <Row className="items-center justify-between gap-2 md:gap-5 w-40 md:w-auto h-12 bg-grey-3 border-none rounded-md px-5">
                        <Input
                            value={initialValue}
                            type="number"
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value)
                                    setInitialValue(parseFloat(value))
                                else
                                    setInitialValue(0)
                            }}
                            className="w-24"
                        />
                        <p className="font-bold text-xl">$</p>
                    </Row>
                </Row>
            </Col>
            {charts}
        </Col>
    )
}

export default SmartAllocationSimulation;