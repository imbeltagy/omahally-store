import Color from "color";

export function generatePalette(color: string): {
  main: string;
  light: string;
  dark: string;
  lighter: string;
  darker: string;
  contrastText: string;
} {
  const generatedColor = Color(color);

  return {
    main: generatedColor.hex(),
    light: generatedColor.lighten(0.16).hex(),
    dark: generatedColor.darken(0.16).hex(),
    lighter: generatedColor.lighten(0.32).hex(),
    darker: generatedColor.darken(0.32).hex(),
    contrastText: generatedColor.isLight() ? "#000000" : "#FFFFFF",
  };
}
