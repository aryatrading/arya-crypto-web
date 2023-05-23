import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";

import { firebaseCloudMessaging } from "../../../services/firebase/notifications/pushNotification.service";
import { getApp } from "firebase/app";

function PushNotificationLayout({ children }: any) {

    function showNotification(data: any) {
        if (document.visibilityState === 'visible') {
            return;
        }
        var icon = "https://uploads-ssl.webflow.com/62133fadfe3e62071a2d063e/6214aed8ff94c926b744afc9_Group%2012856.png"

        var notification = new Notification(data.notification.title, { body: data.notification.body, icon });
        notification.onclick = () => {
            notification.close();
            window.parent.focus();
        }
    }

    useEffect(() => {
        setToken();

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("firebase-messaging-sw.js", (event) => {
                console.log({ event });
                // showNotification(event.data);
            });
        }
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