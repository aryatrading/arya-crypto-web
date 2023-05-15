export interface SwapTradeType {
  symbol_name: string;
  asset_name: string;
  base_name: string;
  entry_order: EntryOrderType;
}

interface EntryOrderType {
  type: string;
  trigger_price: 0;
  order_type: string;
  quantity: number;
  price: number;
  price_based: boolean;
}
