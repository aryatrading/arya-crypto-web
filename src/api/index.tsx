import axios from "axios";
import { token } from "../constant";

export const instance = axios.create({
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
