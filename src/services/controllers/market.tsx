import { AssetType } from "../../types/asset";
import { dispatchAction } from "../../utils/global_dispatch";
import { axiosInstance } from "../api/axiosConfig";
import { storeMrkAssets } from "../redux/marketSlice";

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
export const fetchAssets = async (search?: string) => {
  const { data } = await axiosInstance.get(
    `utils/assets?limit=100&offset=0${search ? `&search=${search}` : ""}`
  );

  let _assets: AssetType[] = [];

  for (var i = 0; i < data.length; i++) {
    _assets.push({
      id: data[i]?.id ?? 0,
      name: data[i].asset_data.name,
      currentPrice: 0,
      pnl: data[i].asset_data.price_change_percentage_24h?.toFixed(2),
      price: 0,
      rank: data[i].asset_data.market_cap_rank,
      volume: data[i].asset_data.total_volume,
      iconUrl: data[i].asset_data.image,
      mrkCap: data[i].asset_data.market_cap,
      symbol: data[i].asset_data.symbol.toLowerCase(),
    });
  }
  dispatchAction(storeMrkAssets(_assets));
};
