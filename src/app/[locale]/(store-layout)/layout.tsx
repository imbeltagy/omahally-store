import StoreLayout from "@/layouts/store";
import { getAppTheme } from "@/actions/theme";
import { getFavAddress } from "@/actions/auth-methods";

import GuestGate from "@/components/guest-gate/guest-gate";
import GuestCurrencySync from "@/components/guest-gate/guest-currency-sync";

export default async function Layout({
  children,
  initcart,
  noguest,
}: {
  children: React.ReactNode;
  initcart: React.ReactNode;
  noguest: React.ReactNode;
}) {
  let logo: string | undefined;
  const theme = await getAppTheme();
  let guestCurrencyCode: string | null = null;
  if (!("error" in theme)) {
    logo = theme.data?.theme.logo;
    guestCurrencyCode = theme.data?.currency?.code || null;
  }

  const favAddress = await getFavAddress();

  return (
    <StoreLayout logo={logo}>
      <GuestCurrencySync currencyCode={guestCurrencyCode} />
      <GuestGate
        forceOpen={!favAddress || !guestCurrencyCode}
        noWarehouseNear={!!favAddress && !guestCurrencyCode}
      >
        {children}
        {initcart}
        {noguest}
      </GuestGate>
    </StoreLayout>
  );
}
