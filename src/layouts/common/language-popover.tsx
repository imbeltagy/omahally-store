"use client";

import { m } from "framer-motion";
import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Button, IconButton, Typography } from "@mui/material";

import { clientRedirect } from "@/actions/client-redirect";
import { allLocales, LocaleType } from "@/i18n/config-locale";
import { useCurrentLocale } from "@/i18n/localization-provider";

import Iconify from "@/components/iconify";
import { varHover } from "@/components/animate";
import CustomPopover, { usePopover } from "@/components/custom-popover";

// ----------------------------------------------------------------------

interface LanguagePopoverProps {
  isMobile?: boolean;
}

export default function LanguagePopover({ isMobile }: LanguagePopoverProps) {
  const t = useTranslations("Global.Label");
  const popover = usePopover();
  const locale = useLocale();
  const currentLocale = useCurrentLocale();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeLang = useCallback(
    (newLocale: LocaleType) => {
      if (locale !== newLocale) {
        clientRedirect(
          `${pathname.replace(`/${locale}`, `/${newLocale}`)}${searchParams ? `?${searchParams.toString()}` : ""}`,
        );
      }
      popover.onClose();
    },
    [locale, pathname, popover, searchParams],
  );

  const languageLabel = t("language");

  const triggerButton = isMobile ? (
    <IconButton
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      onClick={popover.onOpen}
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        "&:hover": { bgcolor: "#ebe6de" },
        ...(popover.open && { bgcolor: "#ebe6de" }),
      }}
    >
      <Iconify icon={currentLocale.icon} width={22} />
    </IconButton>
  ) : (
    <Button
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      onClick={popover.onOpen}
      startIcon={
        <Iconify
          icon={currentLocale.icon}
          sx={{ borderRadius: 0.65, width: 20 }}
        />
      }
      endIcon={
        <Iconify
          icon="eva:chevron-down-fill"
          style={{
            transform: popover.open ? "rotate(180deg)" : "",
            transition: "0.2s",
          }}
        />
      }
      sx={{
        height: 44,
        borderRadius: 2.5,
        px: 2,
        py: 1.25,
        border: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        fontWeight: 600,
        "&:hover": {
          bgcolor: "#ebe6de",
          borderColor: "divider",
        },
        ...(popover.open && { bgcolor: "#ebe6de" }),
      }}
    >
      <Typography variant="body2">{currentLocale.label}</Typography>
    </Button>
  );

  return (
    <>
      {isMobile ? (
        <Tooltip title={languageLabel} arrow placement="bottom">
          <span>{triggerButton}</span>
        </Tooltip>
      ) : (
        triggerButton
      )}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 160 }}
      >
        {allLocales.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLocale.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <Iconify
              icon={option.icon}
              sx={{ borderRadius: 0.65, width: 28 }}
            />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
