import { fetchOffers } from "@/actions/products-actions";

import DailyOffers from "@/sections/home/daily-offers";

export default async function OffersView() {
  const offers = await fetchOffers(1, 8);
  if ("error" in offers) {
    return null;
  }

  return <DailyOffers offers={offers.items} />;
}
