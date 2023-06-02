import { SmartAllocationAssetType } from "../types/smart-allocation.types";
import { USDTSymbol } from "./constants/market";

export function getAssetCurrentValue(asset: SmartAllocationAssetType, price: number) {
    return (asset.available ?? 0) * price;
}

export function getAssetCurrentWeight(asset: SmartAllocationAssetType, price: number, totalAssetsValue: number) {
    const currentValue = getAssetCurrentValue(asset, price);
    return currentValue / totalAssetsValue;
}


export function usdtFilter(holding:SmartAllocationAssetType){
    return holding.name?.toLowerCase() !== USDTSymbol.toLowerCase();
}