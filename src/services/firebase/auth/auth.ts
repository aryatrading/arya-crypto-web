import {
    GoogleAuthProvider,
    OAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    updatePassword
} from "firebase/auth";
import { getApp } from 'firebase/app';

import { MODE_DEBUG } from "../../../utils/constants/config";

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export const loginUserEmailPassword = async (user: any) => {
    const auth = getAuth(getApp());
    const { email, password } = user
    return await signInWithEmailAndPassword(auth, email, password)
}

export const appleAuth = async () => {
    const auth = getAuth(getApp());
    try {

        const result = await signInWithPopup(auth, appleProvider)
        const user = result.user;
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;
        if (MODE_DEBUG) {
            console.log(user, accessToken, idToken, credential)
        }

    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = OAuthProvider.credentialFromError(error);
        if (MODE_DEBUG) {
            console.log(errorCode, errorMessage, email, credential)
        }
        throw Error(error.message);

    }
}

export const googleAuth = async () => {
    const auth = getAuth(getApp());
    try {
        await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (MODE_DEBUG) {
            console.log(errorCode, errorMessage, email, credential)
        }
        throw Error(error.message);
    }
}

export const registerUser = async (user: any) => {
    const auth = getAuth(getApp());
    const { email, password, name } = user

    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        updateProfile(user, {
            displayName: name,
        });
    } catch (error: any) {
        if (MODE_DEBUG) {
            console.log(error.code)
        }
        throw Error(error);
    }
}

export const resetPassword = async (email: string) => {
    const auth = getAuth(getApp());
    try {
        await sendPasswordResetEmail(auth, email)

    } catch (error: any) {
        throw Error(error.message);
    }
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const auth = getAuth(getApp());
    try {
        if (auth.currentUser?.email) {
            return signInWithEmailAndPassword(auth, auth.currentUser?.email, oldPassword)
                .then(async () => {
                    if (auth.currentUser) {
                        await updatePassword(auth.currentUser, newPassword);
                    }
                });
        }

    } catch (error: any) {
        throw Error(error.message);
    }
}
