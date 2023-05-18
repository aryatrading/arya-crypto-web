import { EnumEntityNames } from "../../utils/constants/utils";
import { axiosInstance } from "../api/axiosConfig";

export const getStatusList = ((entityName:EnumEntityNames)=>{
    return axiosInstance.get(`/utils/statuses`,{
        params:{
            entity_name:entityName
        }
    })
})