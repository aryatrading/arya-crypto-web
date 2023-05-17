export interface SwapTradeType {
  symbol_name: string;
  asset_name: string;
  base_name: string;
  entry_order: EntryOrderType;
}

export interface TradeType {
  trade_id?: number;
  symbol_name: string;
  asset_name: string;
  base_name: string;
  available_quantity: number;
  entry_order?: EntryOrderType;
  take_profit?: ProfitsType[];
  stop_loss?: ProfitsType[];
  trailing_stop_loss?: TrailingType[];
}

interface EntryOrderType {
  type: string;
  trigger_price?: 0;
  order_type?: string;
  quantity?: number;
  price?: number;
  price_based?: boolean;
}

interface ProfitsType {
  order_id?: number;
  value: number;
  quantity: number;
}

interface TrailingType {
  order_id?: number;
  quantity: number;
  stop_price?: number;
  trigger_value?: number;
  trailing_delta?: number;
}
