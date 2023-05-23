importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
};


firebase.initializeApp(self.firebaseConfigUrl || defaultConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "https://uploads-ssl.webflow.com/62133fadfe3e62071a2d063e/6214aed8ff94c926b744afc9_Group%2012856.png",
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

