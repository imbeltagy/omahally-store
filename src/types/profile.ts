export type DeliveryType = "FAST" | "WAREHOUSE_PICKUP" | "SCHEDULED";

export interface Address {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
  is_favorite: boolean;
}

export interface FullAddress extends Address {
  delivery_price: number;
  delivery_type: DeliveryType[];
  delivery_time: number;
  min_order_price: number;
  currency: string;
}
