import { ColorPalette } from "@/types/Colors";

let cachedPalette: ColorPalette | null = null;
let lastFetchTime: number | null = null;
let fetchPromise: Promise<ColorPalette> | null = null;

const CACHE_TTL_MS = 30 * 60 * 1000;

const isCacheValid = (): boolean => {
  return (
    cachedPalette !== null &&
    lastFetchTime !== null &&
    Date.now() - lastFetchTime < CACHE_TTL_MS
  );
};

export const fetchColorPalette = async (): Promise<ColorPalette> => {
  if (isCacheValid()) {
    return cachedPalette as ColorPalette;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetch("/colors.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch color palette");
      return res.json();
    })
    .then((data: ColorPalette) => {
      cachedPalette = data;
      lastFetchTime = Date.now();
      fetchPromise = null;
      return data;
    })
    .catch((error) => {
      fetchPromise = null;
      throw error;
    });

  return fetchPromise;
};
