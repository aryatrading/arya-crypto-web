import { Time } from "lightweight-charts";

export interface GraphChartType {
  primaryLineData: chartDataType[];
  secondaryLineData?: chartDataType[];
  className?: string;
  fixed?: boolean;
  responsive?: boolean;
}

export interface chartDataType {
  time: Time;
  value?: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
}

export enum GraphDataRange {
  "24h" = "24h",
  "week" = "week",
  "month" = "month",
  "six_month" = "six_month",
  "year" = "year",
}
