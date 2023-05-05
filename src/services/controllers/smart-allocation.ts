import { SaveSmartAllocationAssetType, SmartAllocationResponseType } from "../../types/smart-allocation.types";
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
