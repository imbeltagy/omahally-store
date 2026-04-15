"use client";

import { useEffect } from "react";

import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { usecheckoutStore } from "@/contexts/checkout-store";

type Props = {
  currencyCode: string | null;
};

export default function GuestCurrencySync({ currencyCode }: Props) {
  const { authenticated, loading } = useAuthContext();
  const { setChoosenCurrency } = usecheckoutStore();

  useEffect(() => {
    if (loading || authenticated) return;
    setChoosenCurrency(currencyCode);
  }, [authenticated, currencyCode, loading, setChoosenCurrency]);

  return null;
}
