import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getAssetsHistoricalData, periodToIntervalsAndOutputSize } from "../../../../../services/controllers/asset";
import { EnumRebalancingFrequency } from "../../../../../utils/constants/smartAllocation";
import { SmartAllocationAssetType } from "../../../../../types/smart-allocation.types";
import { Time } from "lightweight-charts";
import LineChart from "../../../../shared/charts/graph/graph";
import { chartDataType } from "../../../../shared/charts/graph/graph.type";
import { UTCTimestamp } from "lightweight-charts";
import { Col, Row } from "../../../../shared/layout/flex";
import Button from "../../../../shared/buttons/button";
import CutoutDoughnutChart from "../../../../shared/charts/doughnut/cutout-doughnut";
import { useTranslation } from "react-i18next";
import { USDTSymbol } from "../../../../../utils/constants/market";


const SmartAllocationSimulation: FC<{ smartAllocationHoldings?: SmartAllocationAssetType[] }> = ({ smartAllocationHoldings }) => {

    const [simulationPeriod, setSimulationPeriod] = useState<"1y" | "1w" | "1m">("1y");
    const [initialValue, setInitialValue] = useState<number>(10_000);
    const [rebalancingFrequency, setReBalancingFrequency] = useState<EnumRebalancingFrequency | null>(null);
    const [currentWeightsData, setCurrentWeightsData] = useState<chartDataType[]>([]);
    const [setWeightsData, setSetWeightsData] = useState<chartDataType[]>([]);
    const [assetsHistoricalData, setAssetsHistoricalData] = useState<{ [k: string]: chartDataType[] }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { t } = useTranslation(["smart-allocation"]);


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

            const numberOfPoints = Object.values(assetsHistoricalData)[0].length;


            const quantities: {
                [k: string]: {
                    currentWeightQuantity: number,
                    setWeightQuantity: number,
                }
            } = {};

            smartAllocationHoldings.forEach((holding) => {

                const currentWeight = holding.current_weight ?? 0;
                const setWeight = holding.weight ?? 0;
                const assetSymbol = getAssetSymbol(holding);
                const firstPointValue = assetsHistoricalData[assetSymbol][0].value ?? 1;

                quantities[assetSymbol] = {
                    currentWeightQuantity: currentWeight * initialValue / firstPointValue,
                    setWeightQuantity: setWeight * initialValue / firstPointValue,
                }
            })

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

                currentWeightsPoints.push({ time, value: currentWeightValue });
                setWeightsPoints.push({ time, value: setWeightValue });

            }
            setCurrentWeightsData(currentWeightsPoints);
            setSetWeightsData(setWeightsPoints);
        }

    }, [assetsHistoricalData, getAssetSymbol, initialValue, smartAllocationHoldings]);

    useEffect(() => {
        calculateLineChartsData();
    }, [calculateLineChartsData]);

    const chart = useCallback(({ chartTitle, chartData, drawdown, maxProfit, riskReturnRatio }: { chartTitle: string, chartData: any[], drawdown: number, maxProfit: number, riskReturnRatio: string }) => {
        return (
            <Col className="md:flex-row flex-1 gap-10 h-full">
                <CutoutDoughnutChart
                    title={chartTitle}
                    chartData={chartData}
                />
                <Col className="flex-1 justify-center gap-10">
                    <Row className="justify-between gap-5">
                        <Col>
                            <p>Drawdown</p>
                            <p>{drawdown}</p>
                        </Col>
                        <Col>
                            <p>max profit</p>
                            <p>{maxProfit}</p>
                        </Col>
                    </Row>
                    <Col>
                        <p>Risk-Return ratio</p>
                        <p>{riskReturnRatio}</p>
                    </Col>
                </Col>
            </Col>
        )
    }, []);

    const charts = useMemo(() => {
        return (
            <Row className="flex-[2] items-center justify-evenly h-44 md:h-[250px] gap-10">
                {chart({
                    chartTitle: "Current weight",
                    chartData: smartAllocationHoldings?.map(asset => ({ label: asset?.name ?? "", value: asset.current_value ?? 0, coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: 100,
                    maxProfit: 100,
                    riskReturnRatio: "2:1",
                })}
                {chart({
                    chartTitle: "Set weight",
                    chartData: smartAllocationHoldings?.map(asset => ({ label: asset?.name ?? "", value: asset.weight ?? 0, coinSymbol: asset.name ?? "" })) ?? [],
                    drawdown: 100,
                    maxProfit: 100,
                    riskReturnRatio: "2:1",
                })}
            </Row>
        )
    }, [chart, smartAllocationHoldings]);

    const reBalanceNow = useMemo(() => {
        return (
            <Col className="max-w-[300px] flex-1 gap-5">
                <Row className="w-full gap-4 text-center">
                    <Button className="flex-1 bg-blue-1 py-2.5 px-5 rounded-md text-sm font-bold">{t('RebalanceNow')}</Button>
                </Row>
                <Col className="gap-4">
                    <p className="font-bold text-grey-1">{t('automation')}</p>
                    <p className="text-sm font-bold">{t('automaticRebalancingScheduled')} <span className="text-blue-1">{t('common:monthly')}</span></p>
                    <p className="text-sm font-bold">{t('nextRebalancingSchedule')} : <span className="text-blue-1">01/12/2023</span></p>
                    <p className="font-bold text-grey-1">{t('common:exitStrategy')}</p>
                    <p className="text-sm font-bold max-w-full">{t('WhenCoinDropsByXAmountSellYAmountOfYourPortfolioForUSDT', { coinName: "Bitcoin", dropPercent: "5%", sellPercent: "50%", USDTSymbol })}</p>
                </Col>
            </Col>
        )
    }, [t]);

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

    return (
        <Col className="w-full gap-10">
            <Row className="items-center gap-5">
                <p className="font-bold text-xl">Simulate portfolio over</p>
                <select className="w-36 h-12 bg-grey-3 border-none rounded-md px-5" value={simulationPeriod} onChange={(event) => { setSimulationPeriod(event.target.value as any) }}>
                    <option value="1w">1 Week</option>
                    <option value="1m">1 Month</option>
                    <option value="1y">1 Year</option>
                </select>
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
            </Row>
            <Col className="w-full gap-5">
                <LineChart primaryLineData={currentWeightsData} secondaryLineData={setWeightsData} className={"w-full h-[200px] md:h-[400px]"} isLoading={isLoading} />
                {graphLegend}
            </Col>
            <Row className="gap-10">
                {charts}
                {reBalanceNow}
            </Row>
        </Col>
    )
}

export default SmartAllocationSimulation;