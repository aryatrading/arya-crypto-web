import axios from "axios";
import { token } from "../constant";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 5000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    // TODO: update token to read from firebase when integrated
    authorization: `Bearer ${token}`,
    "X-AryaCrypto-Version": "1 web",
  },
});

// Intercept request
axiosInstance.interceptors.request.use(
  function (config) {
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
