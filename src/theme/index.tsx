"use client";

import { useMemo } from "react";
import merge from "lodash/merge";

import CssBaseline from "@mui/material/CssBaseline";
import {
  Theme,
  Palette,
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { useSettingsContext } from "@/components/settings";

// system
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
// options
import RTL from "./options/right-to-left";
import { customShadows } from "./custom-shadows";
import { componentsOverrides } from "./overrides";
import NextAppDirEmotionCacheProvider from "./next-emotion-cache";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  theme?: DeepPartial<Theme>;
};

export default function ThemeProvider({ children, theme: propsTheme }: Props) {
  const settings = useSettingsContext();

  const paletteObj = merge(
    palette(settings.themeMode),
    propsTheme?.palette,
  ) as Palette;

  const memoizedValue = useMemo(
    () => ({
      palette: paletteObj,
      customShadows: customShadows(settings.themeMode, paletteObj),
      direction: settings.themeDirection,
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [paletteObj, settings.themeMode, settings.themeDirection],
  );
  const theme = createTheme(
    merge(memoizedValue, propsTheme || {}) as ThemeOptions,
  );

  theme.components = componentsOverrides(theme);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <RTL themeDirection={settings.themeDirection}>
          <CssBaseline />
          {children}
        </RTL>
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
