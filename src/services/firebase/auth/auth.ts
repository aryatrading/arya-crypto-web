import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getApp } from "firebase/app";

export const loginUserEmailPassword = async (user: any) => {
  let auth = getAuth(getApp());
  const { email, password } = user;
  return await signInWithEmailAndPassword(auth, email, password);
};
