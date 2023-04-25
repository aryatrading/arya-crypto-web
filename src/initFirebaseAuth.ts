// ./initAuth.js
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { init } from 'next-firebase-auth'
import { axiosInstance } from './services/api/axiosConfig';

const stagingFirebaseAPIKey = "AIzaSyBsvYPxUfROiiGW5RmrxPAt_Lf_IjRwdVA";

const initAuth = () => {

    const auth = getAuth(getApp());
    auth.onAuthStateChanged(async (user) => {
        const idToken = await user?.getIdToken();
        if (idToken) {
            localStorage.setItem("idToken", idToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        }
    })

    init({
        authPageURL: '/login',
        appPageURL: '/',
        loginAPIEndpoint: '/api/login',
        logoutAPIEndpoint: '/api/logout',
        onLoginRequestError: (err) => {
            console.error(err)
        },
        onLogoutRequestError: (err) => {
            console.error(err)
        },
        // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
        firebaseClientInitConfig: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? stagingFirebaseAPIKey,
            authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
            databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_APP_ID
        },
        cookies: {
            name: 'arya-crypto', // required
            // Keys are required unless you set `signed` to `false`.
            // The keys cannot be accessible on the client side.
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS,
            ],
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
            overwrite: true,
            path: '/',
            sameSite: 'strict',
            secure: false, // set this to false in local (non-HTTPS) development
            signed: false,
        },
        onVerifyTokenError: (err) => {
            console.error(err)
        },
        onTokenRefreshError: (err) => {
            console.error(err)
        },
    })
}


export default initAuth