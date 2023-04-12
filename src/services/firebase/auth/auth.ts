import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from "./config";

export const loginUserEmailPassword = async (user: any) => {
    let auth = getAuth(getApp());
    const { email, password } = user
    return await signInWithEmailAndPassword(auth, email, password)
}