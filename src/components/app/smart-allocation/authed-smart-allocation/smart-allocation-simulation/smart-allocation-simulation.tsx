import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAssetsHistoricalData } from "../../../../../services/controllers/asset";
import { EnumExitStrategyTrigger, EnumRebalancingFrequency } from "../../../../../utils/constants/smartAllocation";
import { SmartAllocationAssetType } from "../../../../../types/smart-allocation.types";
import { Time } from "lightweight-charts";
import LineChart from "../../../../shared/charts/graph/graph";
import { chartDataType } from "../../../../shared/charts/graph/graph.type";
import { UTCTimestamp } from "lightweight-charts";
import { Col, Row } from "../../../../shared/layout/flex";
import Button from "../../../../shared/buttons/button";
import CutoutDoughnutChart from "../../../../shared/charts/doughnut/cutout-doughnut";
import { Trans, useTranslation } from "next-i18next";
import { USDTSymbol } from "../../../../../utils/constants/market";
import { doughnutChartDataType } from "../../../../shared/charts/doughnut/doughnut";
import { formatNumber } from "../../../../../utils/helpers/prices";
import clsx from "clsx";
import { useResponsive } from "../../../../../context/responsive.context";
import { ShadowButton } from "../../../../shared/buttons/shadow_button";
import { PieChartIcon } from "../../../../svg/pieChartIcon";
import { LineChartIcon } from "../../../../svg/lineChartIcon";
import Link from "next/link";
import RebalancePreviewDialog from "../smart-allocation-tabs/smart-allocation-holdings-tab/RebalancePreviewDialog/RebalancePreviewDialog";
import moment from "moment";
import { SmartAllocationContext } from "../authed-smart-alocation";


const SmartAllocationSimulation: FC<{ smartAllocationHoldings?: SmartAllocationAssetType[] }> = ({ smartAllocationHoldings }) => {

    const [simulationPeriod, setSimulationPeriod] = useState<"1y" | "1w" | "1m">("1w");
    const [initialValue, setInitialValue] = useState<number>(10_000);
    const [currentWeightsData, setCurrentWeightsData] = useState<chartDataType[]>([]);
    const [setWeightsData, setSetWeightsData] = useState<chartDataType[]>([]);
    const [currentWeightsDrawdown, setCurrentWeightsDrawdown] = useState<number>();
    const [setWeightsDrawdown, setSetWeightsDrawdown] = useState<number>();
    const [assetsHistoricalData, setAssetsHistoricalData] = useState<{ [k: string]: chartDataType[] }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedChart, setSelectedChart] = useState<"doughnut" | "graph">("graph");

    const { t } = useTranslation(["smart-allocation"]);

    const { isTabletOrMobileScreen } = useResponsive();

    const { rebalancingDate, rebalancingFrequency, exitStrategyData } = useContext(SmartAllocationContext)


    const getAssetSymbol = useCallback((holding: SmartAllocationAssetType) => {
        const exchange = "BINANCE";
        if (holding.asset_details?.asset_name) {
            return `${holding.asset_details?.asset_name}/usd:${exchange}`
        } else {
            return `${holding.name}/usd`
        }
    }, []);

    const getHistoricalData = useCallback(() => {
        if (smartAllocationHoldings?.length) {

            const symbols = smartAllocationHoldings.map(getAssetSymbol);
            setIsLoading(true);
            getAssetsHistoricalData(symbols, simulationPeriod).then((res) => {
                const data = res.data;
                if (data) {
                    const assetsHistoricalData: { [k: string]: chartDataType[] } = {};
                    symbols.forEach(symbol => {
                        const assetData = data[symbol];
                        const values = assetData.values.map((value) => {
                            const item: chartDataType = {
                                value: parseFloat(value.open),
                                close: parseFloat(value.close),
                                time: (new Date(value.datetime).getTime() /
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
    }, [getAssetSymbol, simulationPeriod, smartAllocationHoldings]);


    useEffect(() => {
        getHistoricalData();
    }, [getHistoricalData])


    const calculateLineChartsData = useCallback(() => {
        if (assetsHistoricalData && smartAllocationHoldings?.length) {
            const currentWeightsPoints: chartDataType[] = [];
            const setWeightsPoints: chartDataType[] = [];

            let currentWeightsPreviousPointValue = initialValue;
            let setWeightsPreviousPointValue = initialValue;

            let currentWeightsDrawdown = initialValue;
            let setWeightsDrawdown = initialValue;

            const numberOfPoints = Object.values(assetsHistoricalData)[0].length;


            const quantities: {
                [k: string]: {
                    currentWeightQuantity: number,
                    setWeightQuantity: number,
                }
            } = {};

            const totalCurrentWeight = smartAllocationHoldings.map((a) => a.current_weight).reduce((prev, curr) => ((prev ?? 0) + (curr ?? 0))) ?? 1;

            smartAllocationHoldings.forEach((holding) => {

                const currentWeight = (holding.current_weight ?? 0) / totalCurrentWeight;
                const setWeight = holding.weight ?? 0;

                const assetSymbol = getAssetSymbol(holding);
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

                    currentWeightValue += (assetsHistoricalData[assetSymbol][pointIndex].value ?? 0) * currentWeightQuantity;
                    setWeightValue += (assetsHistoricalData[assetSymbol][pointIndex].value ?? 0) * setWeightQuantity;
                    time = assetsHistoricalData[assetSymbol][pointIndex].time;
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
            setCurrentWeightsData(currentWeightsPoints);
            setSetWeightsData(setWeightsPoints);

            setCurrentWeightsDrawdown(currentWeightsDrawdown);
            setSetWeightsDrawdown(setWeightsDrawdown);
        }

    }, [assetsHistoricalData, getAssetSymbol, initialValue, smartAllocationHoldings]);

    useEffect(() => {
        calculateLineChartsData();
    }, [calculateLineChartsData]);

    const weightsDoughnutCharts = useCallback(({ chartTitle, chartData, drawdown, maxProfit }: { chartTitle: string, chartData: doughnutChartDataType[], drawdown: number, maxProfit: number }) => {
        const riskValue = initialValue - drawdown;
        const returnValue = maxProfit - initialValue;
        const returnRiskRatio = returnValue / riskValue;

        // let formattedRiskValue = Math.abs(riskValue / returnValue);
        // let formattedReturnValue = 1;
        let isLowRisk = returnRiskRatio > 0;

        // if (formattedRiskValue < 1) {
        //     formattedRiskValue = 1;
        //     formattedReturnValue = 1 / formattedReturnValue;
        // }

        // formattedReturnValue *= (returnValue < 0 ? -1 : 1);

        return (
            <Col className="items-center w-[165px] md:flex-row md:flex-1 gap-5 md:h-full">
                <CutoutDoughnutChart
                    title={chartTitle}
                    chartData={chartData}
                />
                <Col className="justify-center gap-5 px-2">
                    <Row className="gap-5 flex-wrap">
                        <Col>
                            <p className="text-sm font-bold">Drawdown</p>
                            <p className={clsx("text-sm font-bold", { "text-green-1": drawdown >= initialValue, "text-red-1": drawdown < initialValue })}>{formatNumber(drawdown, true)}</p>
                        </Col>
                        <Col>
                            <p className="text-sm font-bold">Profit</p>
                            <p className={clsx("text-sm font-bold", { "text-green-1": maxProfit >= initialValue, "text-red-1": maxProfit < initialValue })}>{formatNumber(maxProfit, true)}</p>
                        </Col>
                    </Row>
                    <Col>
                        <p className="text-sm font-bold">Return / Risk</p>
                        <p className={clsx("text-4xl font-bold", { "text-green-1": isLowRisk, "text-red-1": !isLowRisk })}>{formatNumber(returnRiskRatio)}</p>
                    </Col>
                </Col>
            </Col>
        )
    }, [initialValue]);

    const doughnutCharts = useMemo(() => {
        return (
            <Row className="md:flex-[2] justify-between md:justify-evenly md:h-[250px] gap-2.5 md:gap-20 w-full">
                {weightsDoughnutCharts({
                    chartTitle: "Current weight",
                    chartData: smartAllocationHoldings?.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: currentWeightsDrawdown ?? initialValue,
                    maxProfit: currentWeightsData[currentWeightsData.length - 1]?.value ?? 0,
                })}
                {weightsDoughnutCharts({
                    chartTitle: "Set weight",
                    chartData: smartAllocationHoldings?.map(asset => ({ label: asset?.name ?? "", value: asset.weight ?? 0, coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: setWeightsDrawdown ?? initialValue,
                    maxProfit: setWeightsData[setWeightsData.length - 1]?.value ?? 0,
                })}
            </Row>
        )
    }, [weightsDoughnutCharts, currentWeightsData, currentWeightsDrawdown, initialValue, setWeightsData, setWeightsDrawdown, smartAllocationHoldings]);

    const reBalanceNow = useMemo(() => {
        return (
            <Col className="w-full md:max-w-[300px] flex-1 gap-5 justify-center">
                <Row className="w-full gap-4 text-center">
                    <Link href="smart-allocation/edit" className="flex-1 flex items-center justify-center bg-blue-1 h-12 px-5 rounded-md text-sm font-bold">{t('editPortfolio')}</Link>
                </Row>
                <Col className="gap-4">
                    <RebalancePreviewDialog holdingData={smartAllocationHoldings?.filter((asset) => asset.name !== USDTSymbol) ?? []} />
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
                    <p>Current weight</p>
                </Row>
                <Row className="items-center justify-center gap-2">
                    <Col className="h-5 w-5 bg-yellow-1  rounded-full" />
                    <p>Set weight</p>
                </Row>
            </Row>
        )
    }, [])

    const graphChart = useMemo(() => {
        return (

            <Col className="w-full gap-5">
                <LineChart primaryLineData={currentWeightsData} secondaryLineData={setWeightsData} className={"w-full h-[200px] md:h-[400px]"} isLoading={isLoading} />
                {graphLegend}
            </Col>
        )
    }, [currentWeightsData, graphLegend, isLoading, setWeightsData])


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
                    <Col className="gap-20 md:flex-row">
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
                    <p className="font-bold text-xl">Simulate portfolio over the past</p>
                    <select className="h-12 bg-grey-3 border-none rounded-md px-5 w-40 shrink-0  md:w-auto md:shrink" value={simulationPeriod} onChange={(event) => { setSimulationPeriod(event.target.value as any) }}>
                        <option value="1w">1 Week</option>
                        <option value="1m">1 Month</option>
                        <option value="1y">1 Year</option>
                    </select>
                </Row>
                <Row className="items-center gap-5 justify-between">
                    <p className="font-bold text-xl">starting with</p>
                    <Row className="items-center gap-2 md:gap-5 w-40 md:w-auto">
                        <input
                            value={initialValue}
                            type="number"
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value)
                                    setInitialValue(parseFloat(value))
                                else
                                    setInitialValue(0)
                            }}
                            className="w-36 h-12 bg-grey-3 border-none rounded-md px-5"
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