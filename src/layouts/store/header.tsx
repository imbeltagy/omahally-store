"use client";

import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { Button, Container, useMediaQuery } from "@mui/material";

import { useBoolean } from "@/hooks/use-boolean";
import { useOffSetTop } from "@/hooks/use-off-set-top";

import { bgBlur } from "@/theme/css";

import Logo from "@/components/logo";
import Iconify from "@/components/iconify";

import StoreSearch from "./search";
import CartButton from "./cart-button";
import { HEADER } from "../config-layout";
import AccountPopover from "../common/account-popover";

// ----------------------------------------------------------------------

interface Props {
  logo?: string;
}

export default function StoreHeader({ logo }: Props) {
  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_OFFSET);

  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const openXsScreenSearch = useBoolean();

  const renderContent = (
    <>
      <Logo image={logo} sx={{ marginInlineStart: 0.5, marginInlineEnd: 1 }} />

      {isSm ? (
        <Button
          onClick={openXsScreenSearch.onToggle}
          variant="contained"
          size="small"
          sx={{
            minWidth: 0,
            borderRadius: "100%",
            aspectRatio: 1,
            flexShrink: 0,
            padding: "5px",
            marginInlineEnd: 1,
          }}
        >
          <Iconify
            icon={
              openXsScreenSearch.value
                ? "eva:close-outline"
                : "material-symbols:search"
            }
            width={{ xs: 20, sm: 24 }}
          />
        </Button>
      ) : (
        <StoreSearch />
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        flexShrink={0}
      >
        <CartButton />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        top: HEADER.H_SIMPLE,
        height: HEADER.H_MOBILE + (isSm && openXsScreenSearch.value ? 60 : 0),
        overflow: "hidden",
        borderTop: `solid 1px ${theme.palette.divider}`,
        borderBottom: `solid 1px transparent`,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["top", "height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(offsetTop && {
          top: 0,
          borderColor: theme.palette.divider,
        }),
      }}
    >
      <Container sx={{ minHeight: "100%" }}>
        <Toolbar sx={{ height: HEADER.H_MOBILE }}>{renderContent}</Toolbar>

        {isSm && <StoreSearch />}
      </Container>
    </AppBar>
  );
}
