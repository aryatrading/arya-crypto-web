import { AssetType } from "../../types/asset";
import { axiosInstance } from "../api/axiosConfig";
import { storeMrkAssets } from "../redux/marketSlice";
import { store } from "../redux/store";

// FETCH REQUEST TO GET ASSETS FROM TWELEVE DATA AND RETURN A STRING OF SYMBOLS
export const fetchSymbolsList = async () => {
  let _symbols = "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TWELEVE_SYMBOLS_API}`
  );
  const { data } = await response.json();
  for (var i = 0; i < data.length; i++) {
    _symbols += data[i].symbol + ",";
  }

  return _symbols;
};

// GET ASSETS LIST FROM OUT BACKEND
export const fetchAssets = async () => {
  const { data } = await axiosInstance.get("utils/assets?limit=100&offset=0");

  let _assets: AssetType[] = [];

  for (var i = 0; i < data.length; i++) {
    _assets.push({
      id: data[i]?.id ?? 0,
      name: data[i].asset_data.name,
      currentPrice: 0,
      price: 0,
      rank: data[i].asset_data.market_cap_rank,
      volume: data[i].asset_data.total_volume,
      iconUrl: data[i].asset_data.image,
      symbol: data[i].asset_data.symbol.toLowerCase(),
    });
  }
  store.dispatch(storeMrkAssets(_assets));
};
