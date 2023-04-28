import StatusAsync from "../utils/status-async"

export interface ExchangeStateType {
    status: StatusAsync,
    data: {
        selectedExchange: ExchangeType | null,
        connectedExchanges: ExchangeType[] | null,
    }
    error: Error | null,
}

export type ExchangeType = {
    name: string,
    provider_id: number,
    provider_name: string,
    "24h_change_value": number,
    "24h_change_percentage": number,
    last_5m_evaluation: number,
}


export type PortfolioSnapshotType = {
    created_at: string,
    total_evaluation: number,
    smart_allocation_total_evaluation: number
}


export type PortfolioAssetType = {
    name: string,
    current_amount: number,
    current_value: number,
    buy_amount: number,
    buy_value: number,
    pnl_value: number,
    pnl_percent: number,
    sell_amount: number,
    sell_value: number,
    asset_details: {
        id: string,
        ath: number,
        atl: number,
        roi: null,
        name: string,
        image: string,
        symbol: string,
        low_24h: number,
        ath_date: string,
        atl_date: string,
        high_24h: number,
        market_cap: number,
        max_supply: number,
        last_updated: string,
        total_supply: number,
        total_volume: number,
        current_price: number,
        market_cap_rank: number,
        price_change_24h: number,
        circulating_supply: number,
        ath_change_percentage: number,
        atl_change_percentage: number,
        market_cap_change_24h: number,
        fully_diluted_valuation: number,
        price_change_percentage_24h: number,
        market_cap_change_percentage_24h: number
    }
}