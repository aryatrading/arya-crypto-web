import { SmartAllocationAssetDetails, SmartAllocationResponseType, SmartAllocationSaveRequestType } from "../../types/smart-allocation.types";
import { EnumExitStrategyTrigger, EnumPredefinedSmartAllocationPortfolio, EnumReBalancingFrequency } from "../../utils/constants/smartAllocation";
import { axiosInstance } from "../api/axiosConfig";

export const getSmartAllocation = async (providerId?: number) => {

    return await axiosInstance.get<SmartAllocationResponseType>(
        `/trade-engine/smart-allocation`,
        { params: { provider: providerId } }
    );
};

export function updateSmartAllocation({ providerId, data, smartAllocationAlreadyExists }: { providerId?: number, data: SmartAllocationSaveRequestType, smartAllocationAlreadyExists: boolean }) {
    if (smartAllocationAlreadyExists) {
        return axiosInstance.put(
            `/trade-engine/smart-allocation`,
            data,
            { params: { provider: providerId } }
        );
    } else {
        return axiosInstance.post(
            `/trade-engine/smart-allocation`,
            data,
            { params: { provider: providerId } }
        );
    }
}

export function getTopCoins({ coins }: { coins: number }) {
    return axiosInstance.get('/exchange/top-coins', {
        params: { coins }
    });
}

function topCoinToHolding<SmartAllocationAssetType>(coin: SmartAllocationAssetDetails) {
    return ({
        name: coin.asset_data?.symbol?.toUpperCase(),
        ask_price: coin.asset_data?.current_price,
        weight: 0,
        current_weight: 0,
        available: 0,
        current_value: 0,
        asset_details: coin,
    }) as SmartAllocationAssetType;
}

export function getPredefinedPortfolioHoldings(predefinedPortfolioId: EnumPredefinedSmartAllocationPortfolio) {

    if (predefinedPortfolioId) {
        switch (predefinedPortfolioId) {
            case EnumPredefinedSmartAllocationPortfolio.top5:
                return getTopCoins({ coins: 5 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            case EnumPredefinedSmartAllocationPortfolio.top10:
                return getTopCoins({ coins: 10 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            case EnumPredefinedSmartAllocationPortfolio.top15:
                return getTopCoins({ coins: 15 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            default:
                return null;
        }
    }
}

export const setRebalancingFrequency = async (providerId: number, frequency: EnumReBalancingFrequency | null, rebalanceNow: boolean) => {
    const frequencyParams = {
        provider: providerId,
        frequency: frequency,
        rebalance_portfolio: rebalanceNow
    }
    return await axiosInstance.put(
        `/trade-engine/smart-allocation/frequency`,
        null,
        { params: frequencyParams }
    );
}

export const createExitStrategy = async (providerId: number, exitType: EnumExitStrategyTrigger, exitValue: number, exitPercentage: number) => {
    const exitStrategyParams = {
        provider: providerId
    }
    const exitStrategyBody = {
        exit_type: exitType,
        status: 'ACTIVE',
        exit_value: exitValue,
        exit_percentage: exitPercentage
    }
    return await axiosInstance.post(
        `/trade-engine/smart-allocation/exit`,
        exitStrategyBody,
        { params: exitStrategyParams }
    );
}

export const updateExitStrategy = async (providerId: number, exitType: EnumExitStrategyTrigger, exitValue: number, exitPercentage: number) => {
    const exitStrategyParams = {
        provider: providerId
    }
    const exitStrategyBody = {
        exit_type: exitType,
        exit_value: exitValue,
        exit_percentage: exitPercentage
    }
    return await axiosInstance.put(
        `/trade-engine/smart-allocation/exit`,
        exitStrategyBody,
        { params: exitStrategyParams }
    );
}

export const getExitStrategy = async (providerId: number) => {
    const exitStrategyParams = {
        provider: providerId
    }
    return await axiosInstance.get(
        `/trade-engine/smart-allocation/exit`,
        { params: exitStrategyParams }
    );
}

export const deleteExitStrategy = async (providerId: number) => {
    const exitStrategyParams = {
        provider: providerId
    }
    return await axiosInstance.delete(
        `/trade-engine/smart-allocation/exit`,
        { params: exitStrategyParams }
    );
}

export const performRebalance = async (providerId: number) => {
    const rebalanceNowParams = {
        provider: providerId
    }
    return await axiosInstance.get(
        `/trade-engine/smart-allocation/balance`,
        { params: rebalanceNowParams }
    );
}
export function getSmartAllocationTradeLogs(providerId: number) {
    return axiosInstance.get('/trade-engine/smart-allocation/orders-logs', {
        params: { provider: providerId }
    });
}