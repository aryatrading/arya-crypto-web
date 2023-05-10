import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-AryaCrypto-Version": "1.0.0 web",
  },
});

// Intercept request
axiosInstance.interceptors.request.use(
  async function (config) {
    if (typeof window !== 'undefined') {
      const localStorageToken = localStorage?.getItem("idToken");
      if (localStorageToken) {
        config.headers.authorization = `Bearer ${localStorageToken}`;
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
