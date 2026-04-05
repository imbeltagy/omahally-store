"use client";

import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useMemo, useState, useCallback } from "react";

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

type View = "choice" | "map";

export default function GuestGate() {
  const t = useTranslations("Pages.GuestGate");
  const tCartLoc = useTranslations("Pages.Cart.Location");
  const { loading, authenticated } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const [hasAddressCookie, setHasAddressCookie] = useState(
    () => !!getCookie(COOKIES_KEYS.favAddress)
  );
  const [view, setView] = useState<View>("choice");
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
    !loading && !authenticated && !hasAddressCookie && !isAuthRoute;

  const handleOpenMap = useCallback(() => {
    setPosition(defaultMapPosition);
    setView("map");
  }, [defaultMapPosition]);

  const handleBackFromMap = useCallback(() => {
    setView("choice");
  }, []);

  const handleSaveLocation = useCallback(async () => {
    const pos = position ?? defaultMapPosition;
    setSaving(true);
    try {
      await saveFavAddress({
        latitude: pos.lat.toString(),
        longitude: pos.lng.toString(),
      });
      setHasAddressCookie(true);
      setView("choice");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [defaultMapPosition, position, router]);

  if (!showGate) {
    return null;
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth={view === "map" ? "sm" : "xs"}
      disableEscapeKeyDown
      onClose={() => {
        /* non-dismissible */
      }}
    >
      {view === "choice" ? (
        <>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t("message")}
              </Typography>
              <Button
                color="primary"
                variant="contained"
                href={paths.auth.jwt.login}
                LinkComponent={RouterLink}
              >
                {t("login")}
              </Button>
              <Button variant="outlined" onClick={handleOpenMap}>
                {t("choose_address")}
              </Button>
            </Stack>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle>{t("map_title")}</DialogTitle>
          <DialogContent>
            <Box height="20rem" sx={{ mt: 0.5 }}>
              <GoogleMap
                defaultPosition={defaultMapPosition}
                setCurrentPosition={(p) => setPosition(p)}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {t("map_hint")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleBackFromMap}>
              {tCartLoc("back")}
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
        </>
      )}
    </Dialog>
  );
}
