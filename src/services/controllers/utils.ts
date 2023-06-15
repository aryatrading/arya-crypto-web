import { EnumEntityNames } from "../../utils/constants/utils";
import { axiosInstance } from "../api/axiosConfig";

export const getStatusList = ((entityName: EnumEntityNames) => {
    return axiosInstance.get(`/utils/statuses`, {
        params: {
            entity_name: entityName
        }
    })
})

export const saveUserLanguage = (language: 'en' | 'fr') => {
    return axiosInstance.post('/user/', {
        language: language,
    })
}

export const getUserLanguage = () => {
    return axiosInstance.get('/user/');
}