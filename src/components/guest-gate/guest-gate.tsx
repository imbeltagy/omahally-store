"use client";

import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useMemo, useState, useCallback, type ReactNode } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { saveFavAddress } from "@/actions/auth-methods";
import { useRouter, usePathname } from "@/i18n/routing";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { COOKIES_KEYS, DEFAULT_ADDRESS } from "@/config-global";

import { GoogleMap } from "@/components/map";

import type { Position } from "@/types/map";

type Props = {
  forceOpen?: boolean;
  children: ReactNode;
  noWarehouseNear?: boolean;
};

export default function GuestGate({
  forceOpen = false,
  children,
  noWarehouseNear = false,
}: Props) {
  const t = useTranslations("Pages.GuestGate");
  const { loading, authenticated } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const [hasAddressCookie, setHasAddressCookie] = useState(
    () => !!getCookie(COOKIES_KEYS.favAddress)
  );
  const [position, setPosition] = useState<Position | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultMapPosition = useMemo<Position>(
    () => ({
      lat: Number(DEFAULT_ADDRESS.latitude),
      lng: Number(DEFAULT_ADDRESS.longitude),
    }),
    []
  );

  const isAuthRoute = pathname?.startsWith("/auth") ?? false;

  const showGate =
    !loading &&
    !authenticated &&
    (forceOpen || !hasAddressCookie) &&
    !isAuthRoute;

  const handleSaveLocation = useCallback(async () => {
    const pos = position ?? defaultMapPosition;
    setSaving(true);
    try {
      await saveFavAddress({
        latitude: pos.lat.toString(),
        longitude: pos.lng.toString(),
      });
      setHasAddressCookie(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [defaultMapPosition, position, router]);

  if (loading) {
    return null;
  }

  if (!showGate) {
    return <>{children}</>;
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      onClose={() => {
        /* non-dismissible */
      }}
    >
      <DialogTitle>{t("map_title")}</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack spacing={1.5}>
          <Typography
            variant="body2"
            color={noWarehouseNear ? "error" : "text.secondary"}
          >
            {noWarehouseNear ? t("no_warehouse_near_message") : t("message")}
          </Typography>
          <Box height="20rem" sx={{ mt: 0.5 }}>
            <GoogleMap
              defaultPosition={defaultMapPosition}
              setCurrentPosition={(p) => setPosition(p)}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          href={paths.auth.jwt.login}
          LinkComponent={RouterLink}
        >
          {t("login")}
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={saving}
          onClick={handleSaveLocation}
        >
          {t("confirm_location")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
