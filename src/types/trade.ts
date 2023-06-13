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
  id?: number;
  provider_id?: number;
  status?: string;
  type?: string;
  amount?: number;
  price?: number;
  createdAt?: Date;
  exchange?: string;
}


export type Order = {
  id: number;
  quantity: number;
  order_value: number;
  value: number;
  number: number;
  executed_amount: number;
  total_price: number;
  total_fees: number;
  type: string;
  status: number;
  cancel_reason: null | string;
  edited_time: null | Date;
  created_at: Date;
  settled_at: null | Date;
  order_data: {
    trailing_delta?: string;
    activation_price?: string;
    stop_price?: string;
    status_check_time: null | Date;
    status_check_delay: number;
    side?: string;
    entry_type?: string;
    price_based?: string;
  };
  provider_data: {};
  order_origin: string;
  order_status: string;
  order_symbol: string;
  order_provider: number;
};
