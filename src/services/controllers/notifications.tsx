import { axiosInstance } from "../api/axiosConfig";

export const getNotifications = async (offset: number, limit: number, order: 'asc' | 'desc') => {
    const { data } = await axiosInstance.get(
        `/notifications/?limit=${limit}&skip=${offset}&order_by=${order}`
    );

    console.log({ data });
};