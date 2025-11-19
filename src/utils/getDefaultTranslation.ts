import defaultTranslations from "@/data/data.json"

interface DefaultTranslations {
  [viewName: string]: {
    [lang: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [component: string]: any;
    };
  };
}

const castedTranslations = defaultTranslations as DefaultTranslations;

export function getDefaultTranslation(
  viewName: string,
  language: string,
  itemKey: string
): string | undefined {
  const keys = itemKey.split(".");
  const upperLang = language.toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromView = keys.reduce((acc: any, key) => {
    if (acc && typeof acc === "object") {
      return acc[key];
    }
    return undefined;
  }, castedTranslations[viewName]?.[upperLang]);

  if (typeof fromView === "string") {
    return fromView;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromGlobal = keys.reduce((acc: any, key) => {
    if (acc && typeof acc === "object") {
      return acc[key];
    }
    return undefined;
  }, castedTranslations["GLOBAL"]?.[upperLang]);

  if (typeof fromGlobal === "string") {
    return fromGlobal;
  }

  return undefined;
}
