import { EnumExitStrategyTrigger, EnumReBalancingFrequency, EnumSmartAllocationAssetStatus } from "../utils/constants/smartAllocation"
import { PortfolioAssetDetailsType } from "./exchange.types"

export type SmartAllocationResponseType = {
    exists?: boolean,
    id?: number,
    user_id?: number,
    provider?: number,
    provider_name?: string,
    frequency?: EnumReBalancingFrequency,
    status?:EnumSmartAllocationAssetStatus,
    base_asset_value?: number,
    created_at?: string,
    modified_at?: string,
    next_run_time?: string,
    assets?: SmartAllocationAssetType[],
    exit_strategy: SmartAllocationExitStrategyType
}

export type SmartAllocationAssetType = {
    id?: number,
    name?: string,
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


export type SmartAllocationSaveRequestType = {
    assets: SaveSmartAllocationAssetType[],
    frequency: EnumReBalancingFrequency | null,
    exit_strategy: SmartAllocationExitStrategyType | null
}

export type SaveSmartAllocationAssetType = {
    name?: string,
    weight?: number,
    id?: number,
    status?: EnumSmartAllocationAssetStatus
}

export type SmartAllocationExitStrategyType = {
    id?: number;
    exit_type?: EnumExitStrategyTrigger;
    status?: EnumSmartAllocationAssetStatus;
    provider?: number;
    exit_value?: number;
    created_time?: string;
    exit_percentage?: number;
    executed_asset_data?: string;
    executed_asset_total_evaluation?: number;
    completed_at?: Date | null;
    executed_at?: Date | null;
    provider_name?: string;
}

export interface ISmartAllocationContext {
    rebalancingDate: Date|null,
    rebalancingFrequency: EnumReBalancingFrequency|null,
    isLoadingSmartAllocationData: boolean,
    exitStrategyData: SmartAllocationExitStrategyType|null,
    isLoadingExitStrategy: boolean
    fetchSmartAllocationData: Function,
    fetchExitStrategy: Function,

}

export interface ISmartAllocationOrderLog{
    status: number;
    quantity: number;
    order_data: {
        side: string;
        entry_type: string;
        price_based?: string;
        status_check_time?: string;
        status_check_delay?: number;
    };
    settled_at: string|null;
    price: number;
    asset_name: string;
    order_id: number;
}
