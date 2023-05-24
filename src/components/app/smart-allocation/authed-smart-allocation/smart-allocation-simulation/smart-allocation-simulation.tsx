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


const SmartAllocationSimulation: FC<{ smartAllocationHoldings?: SmartAllocationAssetType[] }> = ({ smartAllocationHoldings }) => {

    const [simulationPeriod, setSimulationPeriod] = useState<"1y" | "1w" | "1m">("1y");
    const [initialValue, setInitialValue] = useState<number>(10_000);
    const [rebalancingFrequency, setReBalancingFrequency] = useState<EnumRebalancingFrequency | null>(null);
    const [currentWeightsData, setCurrentWeightsData] = useState<chartDataType[]>([]);
    const [setWeightsData, setSetWeightsData] = useState<chartDataType[]>([]);
    const [assetsHistoricalData, setAssetsHistoricalData] = useState<{ [k: string]: chartDataType[] }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);


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

    return (
        <Col className="w-full">
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
                {/* <Button className="w-36 h-12 bg-blue-1 rounded-md px-5 font-semibold">Preview</Button> */}
            </Row>
            <LineChart primaryLineData={currentWeightsData} secondaryLineData={setWeightsData} className={"w-full h-[200px] md:h-[400px]"} isLoading={isLoading} fixed={false}/>
        </Col>
    )
}

export default SmartAllocationSimulation;