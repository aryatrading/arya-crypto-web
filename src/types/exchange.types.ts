import StatusAsync from "../utils/status-async"

export interface ExchangeStateType {
    status: StatusAsync,
    data: {
        selectedExchange: SelectedExchangeType | null,
        connectedExchanges: any | null,
        allExchanges: any | null,
    }
    error: Error | null,
}

export type SelectedExchangeType = {
    id?: string,
    name?: string,
    portfolioValue?: number,
    portfolioChange?: number,
}


export type PortfolioSnapshotType = {
    created_at: string,
    total_evaluation: number,
    smart_allocation_total_evaluation: number
}