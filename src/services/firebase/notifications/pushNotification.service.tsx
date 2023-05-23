import { getToken, getMessaging } from 'firebase/messaging';
import { updateFCMToken } from '../../controllers/notifications';
import { getApp } from 'firebase/app';

const firebaseCloudMessaging = {
    init: async () => {
        try {
            const tokenInLocalstorage = window.localStorage.getItem("fcm_token");

            // Return the token if it is alredy in our local storage
            if (tokenInLocalstorage !== null) {
                return tokenInLocalstorage;
            }

            // Request the push notification permission from browser
            const status = await Notification.requestPermission();
            if (status && status === "granted") {
                // Get new token from Firebase
                const fcm_token = await getToken(getMessaging(getApp()));

                // Set token in our local storage
                if (fcm_token) {
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