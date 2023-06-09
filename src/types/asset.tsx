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
  description?: string;
  stable?: boolean;
  mrkCapYesterday?: number;
  change24H?: number;
  change7D?: number;
  favoriteCount?: number;
}

export interface AssetSwapType {
  symbol?: string;
  quantity?: number;
  iconUrl?: string;
  availableBalance?: number;
  price?: number;
}

export interface PostTypes {
  Category?: string;
  LastComment?: {
    Author?: {
      Id?: string;
      VanityAlias?: string;
      PictureDate?: string;
      Job?: string;
      Name?: string;
      SystemAlias?: string;
    };
    Text?: string;
    Id?: string;
    TextLocalizations?: {
      fr?: string;
      en?: string;
    };
    Date?: string;
    TextLang?: string;
  };
  Images?: string[];
  Video?: {
    size?: number;
    videoUrl?: string;
    width?: number;
    height: number;
    thumbnailUrl: string;
  };
  IndexMentions?: [
    {
      Length?: number;
      Start?: number;
      MarketItem?: {
        Symbol?: string;
        To?: string;
        Market?: string;
        Key?: string;
        Name?: string;
      };
      Name?: string;
    }
  ];
  CommentsCount?: number;
  Author?: {
    Id?: string;
    PictureDate?: string;
    Job?: string;
    Name?: string;
  };
  Text?: string;
  TextLocalizations?: {
    fr?: string;
    en?: string;
  };
  Date?: string;
  LastActivity?: string;
  TextLang?: string;
  _id?: string;
  FinancialData?: {
    IsPriceEvaluationCompleted?: boolean;
    Type?: string;
    BreakEven?: number;
    Timeframe?: string;
    ExpirationDate?: string;
    Sell?: boolean;
    Instrument?: {
      Length?: number;
      Start?: number;
      MarketItemKey?: string;
      MarketItem?: {
        Symbol?: string;
        To?: string;
        Market?: string;
        Key?: string;
        Name?: string;
      };
      Name?: string;
    };
    StopLoss?: number;
    EntryValue?: number;
    PriceEvaluations?: [
      {
        ReachedAt?: string;
        Type?: string;
        Price?: number;
      }
    ];
    TakeProfits?: [
      {
        Value?: number;
      }
    ];
  };
  AwardsCount?: any;
  ReactionCounts?: {
    Likes?: number;
  };
  SharesCount?: number;
  Audio?: string;
  RestrictedTo?: string;
}

type tradeState = {
  day: string,
  orders_count: number
}

type portfolioHoldingType = {
  day: string,
  holding_count: number,
  holding_percentage: number
}

export type StatisticsResponseType = {
  trades: tradeState[],
  portfolio_holdings: portfolioHoldingType[],
  premium: boolean
}