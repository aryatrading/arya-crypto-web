export interface AssetType {
  id?: number;
  symbol?: string;
  name?: string;
  pair?: string;
  iconUrl?: string;
  price?: number;
  rank?: number;
  average?: number;
  weight?: number;
  exchange?: string;
  free?: number;
  locked?: number;
  isTradable?: boolean;
  isFavorite?: boolean;
  pnl?: any;
  mrkCap?: number;
  volume?: number;
  currentPrice?: number;
  supply?: number;
  dailyLow?: number;
  dailyHigh?: number;
  dilutedValuation?: number;
  priceChange?: number;
  circlSupply?: number;
  isHoldingAsset?: boolean;
}
