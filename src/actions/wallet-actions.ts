import { cookies } from "next/headers";

import { endpoints } from "@/utils/endpoints";
import { getData } from "@/utils/crud-fetch-api";

import { COOKIES_KEYS } from "@/config-global";

import { Wallet } from "@/types/wallet";

export async function fetchWallet() {
  const cookieStore = cookies();
  const user = cookieStore.get(COOKIES_KEYS.user);

  const res = await getData<Wallet>(
    `${endpoints.wallet}?user_id=${JSON.parse(user?.value || "{}").id}`,
  );
  return res;
}
