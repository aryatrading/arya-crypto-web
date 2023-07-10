import { SmartAllocationAssetType } from "../types/smart-allocation.types";
import { USDTSymbol } from "./constants/market";

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

    // Sort USDT first
    if (a.name === USDTSymbol) {
        return -1;
    } else if (b.name === USDTSymbol) {
        return 1;
    }
    
    // Sort other stable coins last
    if (a.stable && !b.stable) {
        return 1;
    } else if (!a.stable && b.stable) {
        return -1;
    }

    // Sort the rest of coins based on their weight
    return (getAssetCurrentWeight(b, b.stable ? 1 : b.asset_details?.asset_data?.current_price ?? 0, totalValue)) - (getAssetCurrentWeight(a, a.stable ? 1 : a.asset_details?.asset_data?.current_price ?? 0, totalValue));
}