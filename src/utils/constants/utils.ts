export enum EnumEntityNames {
    order = "order",
    trade = "trade"
}

export enum EnumStatusCodes {
    PENDING_ENTRY = 0,
    ACTIVE = 100,
    CANCELLED = -100,
    FULFILLED = 200,
    BROKER_ERROR = -200,
    DATA_ERROR = -300
}

export enum EnumOrderType {
    smartAllocationRebalance = 'smart_allocation_rebalance',
    manualOrder = 'manual_order',
    smartAllocationExitStrategy = 'smart_allocation_exit_strategy',
    closeExposure = 'close_exposure',
    migratedFromProvider = 'migrated_from_provider'
}