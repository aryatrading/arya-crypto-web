import axios from "axios";
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
import { EnumSmartAllocationSimulationPeriod } from "../../utils/constants/smartAllocation";
import moment from "moment";

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
  _asset.favoriteCount = data?.asset_favorites_count ?? 0;

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

export const getAssetSparkLineData = async (symbol: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_TWELEVE_API_URL}?symbol=${symbol}/usd&interval=1h&outputsize=168&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`
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

export const getOpenOrdersApi = async (symbol: string, provider: number) => {
  const { data } = await axiosInstance.get(
    `trade-engine/orders?provider=${provider}&skip=0&limit=100&symbol=${symbol}USDT&order_origin=manual_order&order_status=0&order_status=100`
  );

  return data;
};

type assetsHistoricalDataResponseType = {
  [k: string]: {
    meta: {
      symbol: string;
      interval: string;
      currency: string;
      exchange_timezone: string;
      exchange: string;
      mic_code: string;
      type: string;
    };
    values: [
      {
        datetime: string;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
      }
    ];
    status: "ok";
  };
};

export const periodToIntervalsAndOutputSize: {
  [k: string]: { interval: string; outputsize: number };
} = {
  "1w": {
    interval: "30min",
    outputsize: 2 * 24 * 7,
  },
  "1m": {
    interval: "2h",
    outputsize: 12 * 30,
  },
  "1y": {
    interval: "1day",
    outputsize: 365,
  },
  "5y": {
    interval: "1day",
    outputsize: 365 * 5,
  },
};

function getCustomPeriodIntervalsAndOutputSize(
  startDate: number,
  endDate: number
) {
  const diffTime = Math.abs(startDate - endDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  console.log({ diffDays });
  if (diffDays <= 7) {
    return {
      interval: "30min",
      outputsize: 2 * 24 * diffDays,
    };
  } else if (diffDays <= 30) {
    return {
      interval: "2h",
      outputsize: 12 * diffDays,
    };
  } else if (diffDays <= 365) {
    return {
      interval: "1day",
      outputsize: diffDays,
    };
  } else {
    return {
      interval: "1week",
      outputsize: Math.round(diffDays / 7),
    };
  }
}

export async function getAssetsHistoricalData(
  symbols: string[],
  period: EnumSmartAllocationSimulationPeriod,
  startDate?: Date,
  endDate?: Date
) {
  const params: { [k: string]: any } = {
    symbol: symbols.join(","),
    apikey: process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY,
  };

  if (period === EnumSmartAllocationSimulationPeriod.custom) {
    if (startDate && endDate) {
      const customPeriod = getCustomPeriodIntervalsAndOutputSize(
        startDate.getTime(),
        endDate.getTime()
      );
      params.interval = customPeriod.interval;
      params.outputsize = customPeriod.outputsize;
      params.start_date = moment(startDate, "DD-MM-YYYY");
      params.end_date = moment(endDate, "DD-MM-YYYY");
    } else {
      params.interval = periodToIntervalsAndOutputSize["1y"].interval;
      params.outputsize = periodToIntervalsAndOutputSize["1y"].outputsize;
    }
  } else {
    params.interval = periodToIntervalsAndOutputSize[period].interval;
    params.outputsize = periodToIntervalsAndOutputSize[period].outputsize;
  }

  return axios.get<assetsHistoricalDataResponseType>(
    process.env.NEXT_PUBLIC_TWELEVE_API_URL ?? "",
    {
      params,
    }
  );
}
