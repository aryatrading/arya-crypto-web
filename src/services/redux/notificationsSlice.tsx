import { createSlice } from "@reduxjs/toolkit";
import { NotificationType } from "../../types/notifications";

interface initialStateType {
    notifications: NotificationType[];
}
// TODO: remove this dummy data.
const initialState: initialStateType = {
    notifications: [
        {
            "id": 87,
            "title": "Buy order executed !",
            "body": "Buy 333 BTCUSDT at 212 in Binance",
            "notification_type": "BUY_ORDER",
            "created_time": "2023-05-23T07:05:02.550257+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 88,
            "title": "Stop loss Executed",
            "body": "BTCUSDT stoploss reached at 212 in Binance.",
            "notification_type": "STOP_LOSS_EXECUTED",
            "created_time": "2023-05-23T07:25:59.639335+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 89,
            "title": "Take profit Executed",
            "body": "Sell 333 BTCUSDT at 212 in Binance.",
            "notification_type": "TAKE_PROFIT_EXECUTED",
            "created_time": "2023-05-23T07:26:23.714300+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 90,
            "title": "Portfolio rebalancing executed",
            "body": "Your Crypto Portfolio has been rebalanced automatically in Binance.",
            "notification_type": "SMART_ALLOCATION_REBALANCED",
            "created_time": "2023-05-23T07:27:11.526205+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 91,
            "title": "Sell order executed",
            "body": "Sell 333 BTCUSDT at 212 in Binance.",
            "notification_type": "SELL_ORDER",
            "created_time": "2023-05-23T07:38:23.797728+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 92,
            "title": "Trailing executed",
            "body": "Sell 333 BTCUSDT at 212 in Binance.",
            "notification_type": "TRAILIING_EXECUTED",
            "created_time": "2023-05-23T07:38:38.174667+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 93,
            "title": "Binance API keys Expiring soon !",
            "body": "Your Binance API keys will be expired very soon, please update them as soon as possible.",
            "notification_type": "KEYS_EXPIRATION_SOON",
            "created_time": "2023-05-23T07:46:24.198230+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 94,
            "title": "Binance API keys are expired !",
            "body": "Your Binance API keys are expired, please update them as soon as possible.",
            "notification_type": "KEYS_EXPIRED",
            "created_time": "2023-05-23T07:46:46.530341+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE"
        },
        {
            "id": 98,
            "title": "Exit Strategy executed",
            "body": "50% of your our portfolio has been sold when portfolio REACHED 1200.",
            "notification_type": "EXIT_STRATEGY_EXECUTED",
            "created_time": "2023-05-23T07:49:32.656470+00:00",
            "provider_id": 1,
            "provider_name": "BINANCE",
            "seen": false,
        }
    ],
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: { payload: NotificationType[] }) => {
            state.notifications = action.payload;
        }
    },
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
