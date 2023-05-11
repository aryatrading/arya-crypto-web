import { EnumExitStrategyTrigger, EnumRebalancingFrequency, EnumSmartAllocationAssetStatus } from "../utils/constants/smartAllocation"
import { PortfolioAssetDetailsType } from "./exchange.types"

export type SmartAllocationResponseType = {
    exists?: boolean,
    id?: number,
    user_id?: number,
    provider?: number,
    provider_name?: string,
    frequency?: EnumRebalancingFrequency,
    status?:EnumSmartAllocationAssetStatus,
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
    status?: EnumSmartAllocationAssetStatus,
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
    status?: EnumSmartAllocationAssetStatus
}

export type SmartAllocationExitStrategyType = {
    id: number;
    exit_type: EnumExitStrategyTrigger;
    status: string;
    provider: number;
    exit_value: number;
    created_time: string;
    exit_percentage: number;
    executed_asset_data: string;
    executed_asset_total_evaluation: number;
    completed_at: Date | null;
    executed_at: Date | null;
    provider_name: string;
}

