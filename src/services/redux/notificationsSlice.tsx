import { createSlice } from "@reduxjs/toolkit";
import { NotificationType } from "../../types/notifications";

interface initialStateType {
    notifications: NotificationType[];
    hasNewNotifications: boolean;
}
// TODO: remove this dummy data.
const initialState: initialStateType = {
    notifications: [],
    hasNewNotifications: false,
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: { payload: NotificationType[] }) => {
            state.notifications = action.payload;
        },
        updateNotificationBadge: (state, action: { payload: boolean }) => {
            state.hasNewNotifications = action.payload
        }
    },
});

export const { setNotifications, updateNotificationBadge } = notificationsSlice.actions;

export default notificationsSlice.reducer;
