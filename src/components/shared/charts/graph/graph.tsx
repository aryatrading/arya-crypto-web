import { FC, useEffect, useRef } from "react";
import {
    createChart,
    CrosshairMode,
    ColorType,
    PriceScaleMode,
    BarPrice
} from 'lightweight-charts';
import colors from 'tailwindcss/colors'

import { Col } from "../../layout/flex";

import { GraphChartType } from "./graph.type";
import clsx from "clsx";
import { shortNumberFormat } from "../../../../utils/helpers/prices";


const LineChart: FC<GraphChartType> = ({ primaryLineData, secondaryLineData: secondaryData, className, fixed = true }) => {

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (!chartContainerRef?.current || !primaryLineData) {
                return;
            }

            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
            };

            const chart = createChart(chartContainerRef?.current, {
                width: chartContainerRef?.current?.clientWidth,
                height: chartContainerRef?.current?.clientHeight,
                layout: {
                    background: { type: ColorType.Solid, color: '#00000000' },
                    textColor: '#6B7280',
                    fontSize: 12,
                },
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        color: '#1F2A41',
                    },
                },
                crosshair: {
                    mode: CrosshairMode.Magnet,
                },
                leftPriceScale: {
                    borderVisible: false,
                    autoScale: true,
                    visible: true,
                    mode: PriceScaleMode.Normal,
                },
                rightPriceScale: {
                    visible: false
                },
                timeScale: {
                    borderColor: '#1F2A41',
                    visible: true,
                    timeVisible: true,
                    secondsVisible: false,
                },
                handleScale: !fixed,
                handleScroll: !fixed,
            });

            chart.timeScale().fitContent();

            const series = chart.addLineSeries({
                color: colors.blue[500],
                priceLineVisible: false,
                lastValueVisible: true,
                priceFormat: {
                    type: "custom",
                    formatter: (priceValue: BarPrice) => {
                        return shortNumberFormat(priceValue)
                    },
                }
            });

            series.setData(primaryLineData);



            if (secondaryData) {
                const series2 = chart.addLineSeries({
                    color: colors.yellow[500],
                    priceLineVisible: false,
                    lastValueVisible: true,
                });
                series2.setData(secondaryData)
            }


            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
            };
        }, [fixed, primaryLineData, secondaryData]
    );

    return (
        <>
            {
                primaryLineData ?
                    <Col
                        reference={chartContainerRef}
                        className={clsx(className)}
                    />
                    :
                    <></>
            }
        </>
    );
}

export default LineChart;