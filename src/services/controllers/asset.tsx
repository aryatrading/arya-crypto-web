import { chartDataType } from "../../components/shared/charts/graph/graph.type";
import { AssetType } from "../../types/asset";
import { CapitalizeString } from "../../utils/format_string";
import { axiosInstance } from "../api/axiosConfig";
import {
  setAsset,
  setAssetHolding,
  setOrders,
  setTimesseries,
} from "../redux/assetSlice";
import { store } from "../redux/store";
import { setTo } from "../redux/swapSlice";

export const getAssetDetails = async (symbol?: any) => {
  let { data } = await axiosInstance.get(
    `trade-engine/exposure-details?asset_name=${symbol}&provider=1`
  );

  let _res = data.asset_details;
  let _trade = data.trade;
  let _holding = data.asset_holding_information;
  let _orders = data?.trade?.orders ?? [];

  let _asset: AssetType = {};

  _asset.iconUrl = _res.image;
  _asset.id = data.asset_id;
  _asset.rank = _res.market_cap_rank;
  _asset.currentPrice = _res.current_price;
  _asset.description = _res.description ?? "";
  _asset.symbol = _res.symbol.toLowerCase();
  _asset.pnl = _res.price_change_percentage_24h.toFixed(2);
  _asset.mrkCap = _res.market_cap;
  _asset.volume = _res.total_volume;
  _asset.supply = _res.total_supply;
  _asset.dailyLow = _res.low_24h;
  _asset.dailyHigh = _res.high_24h;
  _asset.dilutedValuation = _res.fully_diluted_valuation;
  _asset.name = CapitalizeString(_res.id);
  _asset.priceChange = _res.price_change_24h.toFixed(3);
  _asset.circlSupply = _res.circulating_supply;
  _asset.isHoldingAsset = _trade ? true : false;

  store.dispatch(setAsset(_asset));
  store.dispatch(setAssetHolding(_holding));
  store.dispatch(setOrders(_orders));
  store.dispatch(
    setTo({
      symbol: _res.symbol.toUpperCase(),
      quantity: 0,
      price: _asset.currentPrice,
      iconUrl: _asset.iconUrl,
    })
  );
};

export const getAssetTimeseriesPrice = async (
  symbol: string | string[],
  interval: string,
  output: number
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TWELEVE_API_URL}?symbol=${symbol}/usd&interval=${interval}&outputsize=${output}&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`
  );

  const { values } = await response.json();

  const _list: chartDataType[] = [];

  for (var i = 0; i < values?.length; i++) {
    let item: chartDataType = {
      value: parseFloat(values[i].open),
      close: parseFloat(values[i].close),
      time: (new Date(values[i].datetime).getTime() /
        1000) as chartDataType["time"],
      high: parseFloat(values[i].high),
      low: parseFloat(values[i].low),
      open: parseFloat(values[i].open),
    };
    _list.push(item);
  }

  store.dispatch(
    setTimesseries(
      _list.sort((a, b) => (a.time as number) - (b.time as number))
    )
  );
};

export const getAssetVotes = async (assetId: number) => {
  const { data } = await axiosInstance.get(
    `asset-bullish-bearish-vote?asset_id=${assetId}`
  );
  return data;
};

export const castVote = async (vote: string, assetId: number) => {
  const { data } = await axiosInstance.post(
    `asset-bullish-bearish-vote?asset_id=${assetId}&vote=${vote}`
  );

  return data;
};

export const getFree = async (symbol: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/assets/${symbol}/?provider=${provider}`
  );

  return data[provider];
};
