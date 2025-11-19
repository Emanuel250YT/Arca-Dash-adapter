export const shortHexToRgba = (hex: string, opacity: number = 1): string => {
  if (!/^#([a-fA-F0-9]{3})$/.test(hex)) {
    throw new Error("Invalid short hex color format. Expected #RGB.");
  }

  const r: number = parseInt(hex[1] + hex[1], 16);
  const g: number = parseInt(hex[2] + hex[2], 16);
  const b: number = parseInt(hex[3] + hex[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const hexToRgba = (
  hex: string,
  opacity: number = 1
): string => {
  if (!/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(hex)) {
    throw new Error("Invalid hex color format. Expected #RGB or #RRGGBB.");
  }

  if (hex.length === 4) {
    return shortHexToRgba(hex, opacity);
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
