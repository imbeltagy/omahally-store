import { endpoints } from "@/utils/endpoints";
import { getData } from "@/utils/crud-fetch-api";

import { Currency } from "@/types/currency";

export const getCurrencies = async () => {
  const res = await getData<Currency[]>(endpoints.currency.list);

  return res;
};
