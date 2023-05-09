import { PortfolioAssetDetailsType } from "./exchange.types"

export type SmartAllocationResponseType = {
    exists?: boolean,
    id?: number,
    user_id?: number,
    provider?: number,
    provider_name?: string,
    frequency?: SmartAllocationFrequency,
    status?: SmartAllocationAssetStatus,
    base_asset_value?: number,
    created_at?: string,
    modified_at?: string,
    next_run_time?: string,
    assets?: SmartAllocationAssetType[],
    total_asset_value?: number
}

export type SmartAllocationAssetType = {
    id?: number,
    name?: string,
    ask_price?: number,
    available?: number,
    current_weight?: number,
    current_value?: number,
    executed_amount?: number,
    weight?: number,
    status?: SmartAllocationAssetStatus,
    last_executed_time?: null,
    executable?: boolean,
    expected_value?: number,
    pnl?: {
        value?: number,
        percent?: number
    },
    asset_details?: SmartAllocationAssetDetails,
    removed:boolean,
}

export type SmartAllocationAssetDetails = {
    id?: number,
    added_on?: string,
    asset_name?: string,
    asset_data?: PortfolioAssetDetailsType,
    updated_on?: string
}


export type SaveSmartAllocationAssetType = {
    name?: string,
    weight?: number,
    id?: number,
    status?: SmartAllocationAssetStatus
}

export enum SmartAllocationAssetStatus {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED",
}

export enum SmartAllocationFrequency {
    MONTHLY = "MONTHLY"
}

export enum PredefinedSmartAllocationPortfolio {
    top5 = "top5",
    top10 = "top10",
    top15 = "top15",
}