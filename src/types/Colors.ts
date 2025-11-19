export type ColorName =
  | "darkPrimary"
  | "primary"
  | "secondary"
  | "background"
  | "alternative"
  | "accent";

export type ColorPalette = Record<ColorName, string>;

export interface ColorProps {
  colors: ColorPalette;
}

export const defaultColors: ColorPalette = {
  darkPrimary: "#E9A7A0",
  primary: "#FFB5A7",
  secondary: "#FDE5CE",
  background: "#fafffb",
  alternative: "#F9DCC4",
  accent: "#FEC89A",
};
