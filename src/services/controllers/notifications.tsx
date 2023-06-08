import { axiosInstance } from "../api/axiosConfig";
import { setNotifications } from "../redux/notificationsSlice";
import { store } from "../redux/store";

export const getNotifications = async (offset: number, limit: number, order: 'asc' | 'desc', setCanLoadMore?: any) => {
    const { data } = await axiosInstance.get(
        `/notifications/?limit=${limit}&skip=${offset}&order_by=${order}`
    );
    const oldNotifications = store?.getState().notifications.notifications;

    let notifications;

    if (setCanLoadMore) {
        notifications = [...oldNotifications, ...(data?.notifications || data)];
        setCanLoadMore((data?.notifications || data).length > 0);
    } else {
        notifications = data?.notifications || data;
    }

    store?.dispatch(setNotifications(notifications));
};

export const updateFCMToken = (token: string) => {
    return axiosInstance.put('/fcm/', {
        fcm_token: token,
        platform_type: "WEB"
    });
};

export const updateUnseenNotifications = (ids: number[]) => {
    return axiosInstance.put('/notifications/update-is-seen', ids);
}