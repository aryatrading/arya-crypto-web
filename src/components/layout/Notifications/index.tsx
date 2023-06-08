import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";

import { firebaseCloudMessaging } from "../../../services/firebase/notifications/pushNotification.service";
import { getApp } from "firebase/app";
import { Col, Row } from "../../shared/layout/flex";
import ExchangeImage from "../../shared/exchange-image/exchange-image";
import { store } from "../../../services/redux/store";
import { setNotifications, updateNotificationBadge } from "../../../services/redux/notificationsSlice";
import { NotificationType } from "../../../types/notifications";

function PushNotificationLayout({ children }: any) {
    useEffect(() => {
        setToken();
        async function setToken() {
            try {
                await firebaseCloudMessaging.init();
                onMessaging();
            } catch (error) {
                console.log(error);
            }
        }
    });

    const onMessaging = () => {
        onMessage(getMessaging(getApp()), async ({ data }: any) => {
            const currentNotifications: NotificationType[] = [...await store?.getState()?.notifications?.notifications.notifications];
            currentNotifications.unshift(data);
            store.dispatch(setNotifications({
                notifications: currentNotifications,
            }));
            store.dispatch(updateNotificationBadge(true));
            toast(<Row className="gap-4">
                {data?.provider_id && <ExchangeImage providerId={parseInt(data?.provider_id)} width={24} height={24} />}
                <Col className="gap-2">
                    <h2 className="text-white font-bold text-base">{data?.title}</h2>
                    <h4 className="text-white font-medium text-sm">{data?.body}</h4>
                </Col>
            </Row>,
                {
                    closeOnClick: false,
                    autoClose: 20000,
                    className: "bg-blue-3",
                    theme: 'dark',
                    toastId: data?.id || '_' + new Date().getTime() + '_',
                    progressStyle: {
                        background: '#558AF2',
                    }
                })
        })
    }

    return (
        <>
            {children}
        </>
    );
}

export default PushNotificationLayout;