importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js");

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
};


firebase.initializeApp(self.firebaseConfigUrl || defaultConfig);

