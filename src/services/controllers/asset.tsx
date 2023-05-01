import { AssetType } from "../../types/asset";
import { CapitalizeString } from "../../utils/format_string";
import { axiosInstance } from "../api/axiosConfig";
import { setAsset } from "../redux/assetSlice";
import { store } from "../redux/store";

export const getAssetDetails = async (symbol?: any) => {
  let { data } = await axiosInstance.get(
    `trade-engine/exposure-details?asset_name=${symbol}&provider=1`
  );

  let _res = data.asset_details;

  let _asset: AssetType = {};

  _asset.iconUrl = _res.image;
  _asset.id = data.asset_id;
  _asset.rank = _res.market_cap_rank;
  _asset.currentPrice = _res.current_price;
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

  store.dispatch(setAsset(_asset));
};
