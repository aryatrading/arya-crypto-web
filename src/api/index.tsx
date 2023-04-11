import axios from "axios";
import { token } from "../constant";

export const instance = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: "http://172.16.0.247:8080",
  timeout: 5000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    // TODO: update token to read from firebase when integrated
    authorization: `Bearer ${token}`,
    "X-Arya-Crypto-Version": "1.0.0 web",
  },
});

// Intercept request
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Intercept response
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
