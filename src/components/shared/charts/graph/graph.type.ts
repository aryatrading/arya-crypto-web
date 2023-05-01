
import {Time} from "lightweight-charts"

export interface GraphChartType {
    primaryLineData: chartDataType[],
    secondaryLineData?: chartDataType[],
    className?: string,
    fixed?: boolean,
}

export interface chartDataType {
    time: Time,
    value?: number,
    open?: number,
    close?: number,
    high?: number,
    low?: number,
}
