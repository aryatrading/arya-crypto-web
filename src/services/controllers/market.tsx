import { axiosInstance } from "../api/axiosConfig";

// Function to get assets snapshot data, (graph)
export const fetchAsset = async (symbol: string, interval: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_TWELEVE_API_URL}?symbol=${symbol}&interval=${interval}&apikey=${process.env.REACT_APP_TWELVE_DATA_API_KEY}`
  );
  const json = await response.json();
  console.log(json);
};


export const getPortfolioSnapshots = async (providerId?: number | null) => {
  // TODO: read providerId from state
  return await axiosInstance.get(
    `/trade-engine/portfolio-snapshots/`,
    { params: { provider: providerId, range: "year" } }
  );
};


export const getPortfolioHoldings = async (providerId?: number) => {
  // TODO: read providerId from state
  return await axiosInstance.get(
    `/trade-engine/portfolio-holdings/`,
    { params: { provider: providerId } }
  );
};


export const getConnectedProviders = async () => {
  return await axiosInstance.get(`/exchange/connected-keys`);
};
