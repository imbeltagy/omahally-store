export type Wallet = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user_id: string;
  balances: Record<string, string | number>;
  default_currency: string;
  limit: string | number | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
