// types.ts

/**
 * Represents the content of a translation.
 * This can be extended if translations become more complex in el futuro.
 */
export type TranslationContent = string;

/**
 * Represents a map of component keys to their translations.
 * Example: { "header.title": "Welcome" }
 */
export interface ComponentTranslations {
  [componentKey: string]: TranslationContent;
}

/**
 * Allows nested translation objects (recursive).
 */
export type NestedTranslationContent =
  | string
  | { [key: string]: NestedTranslationContent };

/**
 * Represents translations for a specific language within a view.
 * Example: { "EN": { ... }, "ES": { ... } }
 */
export interface LanguageTranslations {
  [languageCode: string]: {
    [componentKey: string]: NestedTranslationContent;
  };
}

/**
 * Represents the full translation map for all views, including GLOBAL.
 */
export interface DefaultTranslations {
  [viewName: string]: LanguageTranslations;
}

/**
 * Language code in ISO format or similar.
 * Example: "en", "es", "fr"
 */
export type Language = string;

/**
 * Structured translation object (possibly nested).
 */
export type TranslationsType = {
  [key: string]: string | TranslationsType;
};

/**
 * API response shape for fetching translations from backend.
 */
export interface ApiResponse {
  status: "ok" | "error";
  message?: string;
  body?: {
    components: {
      itemKey: string;
      langs: {
        lang: string;
        content: string;
      }[];
    }[];
  };
}

/**
 * Returned map of translations from the loadTranslations function.
 */
export type TranslationsMap = TranslationsType;

/**
 * Type of the i18n context.
 */
export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (
    key: string,
    variables?: { [key: string]: string | number }
  ) => string;
  loading: boolean;
  loadTranslations: (
    viewName: string,
    storeFlat?: boolean,
    storeCache?: boolean
  ) => Promise<TranslationsType | undefined>;
}

/**
 * Interface of the I18n Provider.
 */
export interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  apiBaseUrl: string | undefined;
}
