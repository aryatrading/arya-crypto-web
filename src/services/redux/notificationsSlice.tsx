import { createSlice } from "@reduxjs/toolkit";
import { NotificationType } from "../../types/notifications";
import { number } from "yargs";

interface initialStateType {
    notifications: {
        notifications: NotificationType[],
        count?: number
    };
    hasNewNotifications: boolean;
}
const initialState: initialStateType = {
    notifications: {
        notifications: [],
        count: 0,
    },
    hasNewNotifications: false,
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: {
            payload: {
                notifications: NotificationType[],
                count?: number
            }
        }) => {
            state.notifications = action.payload;
        },
        updateNotificationBadge: (state, action: { payload: boolean }) => {
            state.hasNewNotifications = action.payload
        }
    },
});

export const { setNotifications, updateNotificationBadge } = notificationsSlice.actions;

export default notificationsSlice.reducer;
