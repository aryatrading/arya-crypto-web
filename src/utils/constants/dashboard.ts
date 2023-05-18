import { GraphDataRange } from "../../components/shared/charts/graph/graph.type";

export const overallExchangeName = 'Overall portfolio';

export const portfolioGraphDataRanges = [
    {
        key: GraphDataRange["24h"],
        title: "24H",
    },
    {
        key: GraphDataRange["week"],
        title: "1W",
    },
    {
        key: GraphDataRange["month"],
        title: "1M",
    },
    {
        key: GraphDataRange["six_month"],
        title: "6M",
    },
    {
        key: GraphDataRange["year"],
        title: "1Y",
    },
]