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
  type?: string;
  trigger_price?: 0;
  order_type?: string;
  quantity?: number;
  price?: number;
  price_based?: boolean;
}

export interface ProfitsType {
  order_id?: number;
  value: number;
  quantity?: number;
}

export interface TrailingType {
  order_id?: number;
  stop_price?: number;
  trigger_value?: number;
  trailing_delta?: number;
}

export interface TradeValidations {
  min_price?: number;
  max_price?: number;
  min_qty?: number;
  max_qty?: number;
}

export interface TradeOrder {
  status?: string;
  type?: string;
  amount?: number;
  price?: number;
  createdAt?: string;
  exchange?: string;
}
