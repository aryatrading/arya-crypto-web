import { FC, useEffect, useRef } from "react";
import {
    createChart,
    CrosshairMode,
    ColorType
} from 'lightweight-charts';

import { Col } from "../../layout/flex";

import { GraphChartType } from "./graph.type";
import clsx from "clsx";


const GraphChart: FC<GraphChartType> = ({ chartData, className }) => {

    const chartContainerRef = useRef<HTMLDivElement>(null);


    useEffect(
        () => {
            if (!chartContainerRef?.current || !chartData) {
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
                    mode: CrosshairMode.Normal,
                },
                leftPriceScale: {
                    borderColor: '#1F2A41',
                    borderVisible: false,
                    autoScale: false,
                    visible: true,
                },
                rightPriceScale: {
                    borderColor: '#1F2A41',
                    autoScale: false,
                    visible: false
                },
                timeScale: {
                    borderColor: '#1F2A41',
                    visible: true,
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            chart.timeScale().fitContent();

            const series = chart.addLineSeries({
                color: '#558AF2',
                priceLineVisible: false,
                lastValueVisible: true,
            });

            series.setData(chartData);

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
            };
        }, [chartData]
    );

    return (
        <>
            {
                chartData ?
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

export default GraphChart;