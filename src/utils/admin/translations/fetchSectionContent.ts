/**
 * Fetches and parses multilingual section content from a view by its name and default key.
 *
 * This function dynamically maps language content for a specific section identified by `defaultKey`
 * from a list of components returned by the backend. It supports internationalized fields and
 * ensures a solid structure using strong typing via generics.
 *
 * @template TField - A union of valid field keys expected in the content.
 * @template TContent - A mapped object where each language code maps to an object of fields and their string content.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.viewName - The name of the view to fetch from the backend.
 * @param {string} params.defaultKey - The prefix key used to identify the relevant section's fields.
 * @param {(content: TContent) => void} params.setContent - Setter function to update the content state.
 * @param {(isLoading: boolean) => void} params.setIsSectionLoading - Setter to toggle the loading state for the section.
 *
 * @returns {Promise<void>} A Promise that resolves once the content is fetched and state updated.
 *
 * @example
 * fetchSectionContent({
 *   viewName: "HomePage",
 *   defaultKey: "hero",
 *   setContent: setHeroContent,
 *   setIsSectionLoading: setHeroLoading
 * });
 *
 * @throws Logs errors if the fetch fails, but does not throw exceptions to avoid unhandled rejections.
 */

export async function fetchSectionContent<
  TField extends string,
  TContent extends Record<string, Partial<Record<TField, string>>>
>({
  viewName,
  defaultKey,
  setContent,
  setIsSectionLoading,
}: {
  viewName: string;
  defaultKey: string;
  setContent: (content: TContent) => void;
  setIsSectionLoading: (isLoading: boolean) => void;
}): Promise<void> {
  try {
    const res = await fetch(`/api/v1/view/${encodeURIComponent(viewName)}`);

    if (!res.ok) {
      console.warn(`Failed to fetch view "${viewName}": ${res.statusText}`);
      return;
    }

    const data = await res.json();

    const components = data.body?.components ?? [];

    const contentMap = new Map<string, Partial<Record<TField, string>>>();

    for (const component of components) {
      const itemKey: string | undefined = component.itemKey;

      if (!itemKey || !itemKey.startsWith(`${defaultKey}.`)) continue;

      const field = itemKey.substring(defaultKey.length + 1) as TField;

      for (const lang of component.langs ?? []) {
        const langCode = lang.lang?.toUpperCase();
        const content = lang.content;

        if (!langCode) continue;

        if (!contentMap.has(langCode)) {
          contentMap.set(langCode, {});
        }

        contentMap.get(langCode)![field] = content;
      }
    }

    const finalContent: TContent = Object.fromEntries(contentMap) as TContent;

    setContent(finalContent);
  } catch (err) {
    console.error("❌ Error loading section content:", err);
  } finally {
    setIsSectionLoading(false);
  }
}
