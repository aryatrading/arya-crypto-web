importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfigUrl = Object.fromEntries(urlParams);
})

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
  console.log({ payload });
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

