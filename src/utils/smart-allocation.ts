import { SmartAllocationAssetType } from "../types/smart-allocation.types";

export function getAssetCurrentValue(asset: SmartAllocationAssetType, price: number) {
    return (asset.available ?? 0) * price;
}

export function getAssetCurrentWeight(asset: SmartAllocationAssetType, price: number, totalAssetsValue: number) {
    const currentValue = getAssetCurrentValue(asset, price);
    return currentValue / totalAssetsValue;
}


export function stableCoinsFilter(holding: SmartAllocationAssetType) {
    return !holding?.stable;
}


export function sortSmartAllocationsHoldings(a: SmartAllocationAssetType, b: SmartAllocationAssetType, totalValue: number) {

    // sort stable coins last
    if (a.stable && !b.stable) {
        return 1;
    } else if (!a.stable && b.stable) {
        return -1;
    }

    return (getAssetCurrentWeight(b, b.stable ? 1 : b.asset_details?.asset_data?.current_price ?? 0, totalValue)) - (getAssetCurrentWeight(a, a.stable ? 1 : a.asset_details?.asset_data?.current_price ?? 0, totalValue));
}