import axios from "axios";
import { GraphDataRange } from "../../components/shared/charts/graph/graph.type";
import { AssetType } from "../../types/asset";
import { axiosInstance } from "../api/axiosConfig";
import { setAllProviders } from "../redux/exchangeSlice";
import { storeMrkAssets } from "../redux/marketSlice";
import { store } from "../redux/store";
import { USDTSymbol } from "../../utils/constants/market";
import { TradableAssetType } from "../../types/smart-allocation.types";
import { FAVORITES_LIST } from "../../utils/constants/config";

// FETCH REQUEST TO GET ASSETS FROM TWELEVE DATA AND RETURN A STRING OF SYMBOLS
export const fetchSymbolsList = async (assets?: AssetType[]) => {
  let _symbols = "";

  if (!assets?.length) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TWELEVE_SYMBOLS_API}`
    );
    const { data } = await response.json();
    for (let i = 0; i < data.length; i++) {
      _symbols += data[i].symbol + ",";
    }
  } else {
    for (let i = 0; i < assets.length; i++) {
      _symbols += assets[i].symbol?.toLocaleUpperCase() + "/USD,";
    }
  }

  return _symbols;
};

// GET ASSETS LIST FROM OUT BACKEND
export const fetchAssets = async (
  search?: string,
  limit: number = 20,
  firebaseId?: string
) => {
  const { data } = await axiosInstance.get(
    `utils/assets?limit=${limit}&offset=0${search ? `&search=${search}` : ""}${
      firebaseId ? `&firebase_id=${firebaseId}` : ""
    }`
  );

  let _assets: AssetType[] = [];

  if (data.length) {
    for (var i = 0; i < data.length; i++) {
      const mrkCapYesterday =
        parseFloat(data[i].asset_data.market_cap) +
        parseFloat(data[i].asset_data.market_cap_change_24h);

      if (data[i]?.is_favorite) {
        const favoritesList = localStorage.getItem(FAVORITES_LIST);

        if (!favoritesList) {
          return;
        }

        let _list = JSON.parse(favoritesList);

        if (_list.includes(data[i].id)) return;
        else {
          _list.push(data[i].id);
          localStorage.setItem(FAVORITES_LIST, JSON.stringify(_list));
        }
      }

      _assets.push({
        id: data[i]?.id ?? 0,
        name: data[i].asset_data.name,
        currentPrice: data[i].asset_data.current_price,
        pnl: data[i].asset_data.price_change_percentage_24h?.toFixed(2),
        price: 0,
        rank: data[i].asset_data.market_cap_rank,
        volume: data[i].asset_data.total_volume,
        iconUrl: data[i].asset_data.image,
        mrkCap: data[i].asset_data.market_cap,
        mrkCapYesterday: mrkCapYesterday,
        symbol: data[i].asset_data.symbol.toLowerCase(),
        isFavorite: data[i]?.is_favorite ?? false,
        change24H: data[i].asset_data.price_change_percentage_24h,
        change7D: data[i].asset_data.price_change_percentage_7d_in_currency,
      });
    }
  }
  store?.dispatch(storeMrkAssets(_assets));

  return _assets;
};

export const getPortfolioSnapshots = async (
  providerId?: number | null,
  range?: GraphDataRange
) => {
  return await axiosInstance.get(`/trade-engine/portfolio-snapshots/`, {
    params: { provider: providerId, range },
  });
};

export const getPortfolioHoldings = async (providerId?: number) => {
  return await axiosInstance.get(`/trade-engine/portfolio-holdings/`, {
    params: { provider: providerId },
  });
};

export const getConnectedProviders = async () => {
  return await axiosInstance.get(`/exchange/connected-keys`);
};

export const getAddableProviders = async () => {
  axiosInstance.get(`/general/providers`).then((response) => {
    if (response.data.length) {
      const arr: any[] = [];
      const connectedExchanges =
        store?.getState()?.exchange?.data?.connectedExchanges;
      response.data.map((e: any) => {
        return arr.push({
          ...e,
          isConnected:
            connectedExchanges.filter(
              (exchange: any) => exchange.provider_id === e.id
            ).length > 0,
        });
      });
      store?.dispatch(setAllProviders(arr));
    }
  });
};

export const getMarketCap = () => {
  return axios.get(
    "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": "3db8856e-c0d6-49c2-8ca2-9b2f33a70fd1",
      },
    }
  );
};

export const addAssetToWatchlist = async (asset_id: number) => {
  return await axiosInstance.post("/watchlist/assetpair/", { asset_id });
};

export const removeAssetFromWatchlist = async (asset_id: number) => {
  return await axiosInstance.delete(`/watchlist/assetpair/${asset_id}`);
};

export const getTradableAssets = async (providerId: number) => {
  return await axiosInstance.get<TradableAssetType[]>(`/trade-engine/tradable/symbols/`, {
    params: {
      provider: providerId,
      asset: USDTSymbol,
    }
  });
};
