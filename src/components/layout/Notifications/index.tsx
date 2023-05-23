import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";

import { firebaseCloudMessaging } from "../../../services/firebase/notifications/pushNotification.service";
import { getApp } from "firebase/app";

function PushNotificationLayout({ children }: any) {
    useEffect(() => {
        setToken();
        // Calls the getMessage() function if the token is there
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
        onMessage(getMessaging(getApp()), (data) => {
            toast(<div>
                <h5>{data?.notification?.title}</h5>
                <h6>{data?.notification?.body}</h6>
            </div>,
                {
                    closeOnClick: false,
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