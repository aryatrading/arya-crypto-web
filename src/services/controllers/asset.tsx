import { AssetType } from "../../types/asset";
import { dispatchAction } from "../../utils/global_dispatch";
import { axiosInstance } from "../api/axiosConfig";
import { setAsset } from "../redux/assetSlice";

export const getAssetDetails = async (symbol?: any) => {
  let { data } = await axiosInstance.get(
    `/utils/asset-details?asset_name=${symbol}`
  );

  let _asset: AssetType = {};

  _asset.iconUrl = data.asset_data.image;
  _asset.id = data.id;
  _asset.rank = data.asset_data.market_cap_rank;
  _asset.currentPrice = data.asset_data.current_price;
  _asset.symbol = data.asset_data.symbol.toLowerCase();
  _asset.pnl = data.asset_data.price_change_percentage_24h.toFixed(2);
  _asset.mrkCap = data.asset_data.market_cap;
  _asset.volume = data.asset_data.total_volume;
  _asset.supply = data.asset_data.total_supply;
  _asset.dailyLow = data.asset_data.low_24h;
  _asset.dailyHigh = data.asset_data.high_24h;
  _asset.dilutedValuation = data.asset_data.fully_diluted_valuation;
  _asset.name = data.asset_data.name;
  _asset.priceChange = data.asset_data.price_change_24h.toFixed(3);
  _asset.circlSupply = data.asset_data.circulating_supply;

  dispatchAction(setAsset(_asset));
};
