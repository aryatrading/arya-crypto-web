import { getToken, getMessaging } from 'firebase/messaging';
import { updateFCMToken } from '../../controllers/notifications';
import { getApp } from 'firebase/app';

const firebaseCloudMessaging = {
    init: async () => {
        try {
            // Request the push notification permission from browser
            const status = await Notification.requestPermission();
            if (status && status === "granted") {
                // Get new token from Firebase
                const fcm_token = await getToken(getMessaging(getApp()));
                const savedToken = window.localStorage.getItem("fcm_token");

                // Set token in our local storage
                if (fcm_token !== savedToken) {
                    window.localStorage.setItem("fcm_token", fcm_token);
                    updateFCMToken(fcm_token);
                    return fcm_token;
                }
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};
export { firebaseCloudMessaging };