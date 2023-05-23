import { axiosInstance } from "../api/axiosConfig";
import { setNotifications } from "../redux/notificationsSlice";
import { store } from "../redux/store";

export const getNotifications = async (offset: number, limit: number, order: 'asc' | 'desc') => {
    const { data } = await axiosInstance.get(
        `/notifications/?limit=${limit}&skip=${offset}&order_by=${order}`
    );

    store.dispatch(setNotifications(data));
};

export const updateFCMToken = (token: string) => {
    return axiosInstance.post('/fcm/', {
        fcm_token: token,
        platform_type: "WEB"
    });
};