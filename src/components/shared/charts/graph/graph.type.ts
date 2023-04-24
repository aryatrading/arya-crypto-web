
export interface GraphChartType {
    chartData: chartDataType[],
    className?: string,
}

export interface chartDataType {
    time: string,
     value: number,
     open: number,
     close: number,
     high: number,
     low: number,
}
