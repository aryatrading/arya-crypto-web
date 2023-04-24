import { axiosInstance } from "../api/axiosConfig";

const channel = `${process.env.REACT_APP_TWELEVE_SOCKET}?apikey=${process.env.REACT_APP_TWELVE_DATA_API_KEY}`;

// Function to get assets snapshot data, (graph)
export const fetchAsset = async (symbol: string, interval: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_TWELEVE_API_URL}?symbol=${symbol}&interval=${interval}&apikey=${process.env.REACT_APP_TWELVE_DATA_API_KEY}`
  );
  const json = await response.json();
  console.log(json);
};
