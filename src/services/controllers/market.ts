import { GraphDataRange } from "../../components/shared/charts/graph/graph.type";
import { AssetType } from "../../types/asset";
import { axiosInstance } from "../api/axiosConfig";
import { setAllProviders } from "../redux/exchangeSlice";
import { storeMrkAssets } from "../redux/marketSlice";
import { store } from "../redux/store";

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
export const fetchAssets = async (search?: string, limit: number = 100) => {
  const { data } = await axiosInstance.get(
    `utils/assets?limit=${limit}&offset=0${search ? `&search=${search}` : ""}`
  );

  let _assets: AssetType[] = [];

  if (data.length) {
    for (var i = 0; i < data.length; i++) {
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
        symbol: data[i].asset_data.symbol.toLowerCase(),
        isFavorite: i % 2 === 0,
      });
    }
  }
  if (limit === 100) {
    store?.dispatch(storeMrkAssets(_assets));
  }
  return _assets;
};

export const getPortfolioSnapshots = async (providerId?: number | null, range?: GraphDataRange) => {
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


export const getSmartAllocation = async (providerId?: number) => {
  return await axiosInstance.get(
    `/trade-engine/smart-allocation`,
    { params: { provider: providerId } }
  );
}

export const getAddableProviders = async () => {
  axiosInstance.get(`/general/providers`).then(response => {
    if (response.data.length) {
      const arr: any[] = [];
      const connectedExchanges = store.getState().exchange.data.connectedExchanges;
      response.data.map((e: any) => {
        return arr.push({
          ...e,
          isConnected: connectedExchanges.filter((exchange: any) => exchange.provider_id === e.id).length > 0,
        })
      });
      store?.dispatch(setAllProviders(arr));
    }
  });
};
