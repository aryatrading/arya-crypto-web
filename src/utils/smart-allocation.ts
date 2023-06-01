import { SmartAllocationAssetType } from "../types/smart-allocation.types";

export function getAssetCurrentValue(asset: SmartAllocationAssetType, price: number) {
    return (asset.available ?? 0) * price;
}

export function getAssetCurrentWeight(asset: SmartAllocationAssetType, price: number, totalAssetsValue: number) {
    const currentValue = getAssetCurrentValue(asset, price);
    return currentValue / totalAssetsValue;
}