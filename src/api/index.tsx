import axios from "axios";

export let instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 5000,
  headers: {
    authorization: `Bearer {token here}`,
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
