import { PredefinedSmartAllocationPortfolio, SaveSmartAllocationAssetType, SmartAllocationAssetDetails, SmartAllocationResponseType } from "../../types/smart-allocation.types";
import { axiosInstance } from "../api/axiosConfig";

export const getSmartAllocation = async (providerId?: number) => {
    return await axiosInstance.get<SmartAllocationResponseType>(
        `/trade-engine/smart-allocation`,
        { params: { provider: providerId } }
    );
};

export function updateSmartAllocation({ providerId, data, smartAllocationAlreadyExists }: { providerId?: number, data: SaveSmartAllocationAssetType[], smartAllocationAlreadyExists: boolean }) {
    console.log({ providerId, data, smartAllocationAlreadyExists });
    if (smartAllocationAlreadyExists) {
        return axiosInstance.put(
            `/trade-engine/smart-allocation/assets`,
            data,
            { params: { provider: providerId } }
        );
    } else {
        return axiosInstance.post(
            `/trade-engine/smart-allocation`,
            { assets: data },
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

export function getPredefinedPortfolioHoldings(predefinedPortfolioId: PredefinedSmartAllocationPortfolio) {

    if (predefinedPortfolioId) {
        switch (predefinedPortfolioId) {
            case PredefinedSmartAllocationPortfolio.top5:
                return getTopCoins({ coins: 5 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            case PredefinedSmartAllocationPortfolio.top10:
                return getTopCoins({ coins: 10 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            case PredefinedSmartAllocationPortfolio.top15:
                return getTopCoins({ coins: 15 }).then((res) => {
                    const data = res.data;
                    return data.map((coin: any) => topCoinToHolding(coin));
                })
            default:
                return null;
        }
    }
}