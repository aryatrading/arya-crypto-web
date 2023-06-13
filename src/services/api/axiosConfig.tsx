import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const auth = getAuth(getApp())

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 20000,
});

export const axiosShopInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SHOP_URL,
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
})

// Intercept request
axiosInstance.interceptors.request.use(
  async function (config) {
    if (typeof window !== 'undefined') {
      const localStorageToken = localStorage?.getItem("idToken");
      const idToken = await auth.currentUser?.getIdToken()
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
        localStorage?.setItem("idToken", idToken);
      }
      else if (localStorageToken) {
        config.headers.Authorization = `Bearer ${localStorageToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Intercept response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosShopInstance.interceptors.request.use(
  async function (config) {
    if (typeof window !== 'undefined') {
      const localStorageToken = localStorage?.getItem("idToken");
      const idToken = await auth.currentUser?.getIdToken()
      if (idToken) {
        config.headers.Authorization = `Bearer firebase ${idToken}`;
        localStorage?.setItem("idToken", idToken);
      }
      else if (localStorageToken) {
        config.headers.Authorization = `Bearer firebase ${localStorageToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);