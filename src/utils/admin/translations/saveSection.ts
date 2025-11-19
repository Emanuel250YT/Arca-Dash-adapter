import { ComponentType, LangType, SaveSectionParams } from "@/types/Api";
import { fetchViewData } from "./fetchView";
import { toast } from "react-toastify";

/**
 * Saves a section's content per language and key.
 *
 * This function handles the saving of content for a particular section, including handling
 * different languages and component creation if necessary. If the content for the current
 * language does not exist, it attempts to create the required components and saves the data.
 *
 * It interacts with the backend to:
 * - Fetch the view data for the specified view name.
 * - Check if the corresponding components for the section exist.
 * - If a component is not found, create it.
 * - Update or create language-specific entries for the content.
 *
 * @template TContent - Structure of the content to save, expected as a record with language codes as keys
 * and values being records of section keys with string content.
 * 
 * @param {SaveSectionParams<TContent>} params - Parameters for saving section content, including:
 *   - `activeLanguage`: The language to save the content for (default: "ES").
 *   - `defaultKey`: The key representing the section or field to save.
 *   - `selectedContent`: The content to save, structured by language.
 *   - `setIsSubmitting`: Function to toggle loading state while saving.
 *   - `fetchSectionContent`: Function to fetch updated content after saving.
 *   - `viewName`: The name of the view associated with the section (default: "main").
 *
 * @returns {Promise<void>} A promise indicating the completion of the saving operation.
 * 
 * @throws {Error} If there are issues creating or saving components, or if the content is invalid.
 * 
 * @example
 * await saveSection({
 *   activeLanguage: "EN",
 *   defaultKey: "hero",
 *   selectedContent: {
 *     EN: {
 *       title: "Welcome",
 *       description: "Lorem ipsum..."
 *     }
 *   },
 *   setIsSubmitting: setLoadingState,
 *   fetchSectionContent: refreshContent,
 *   viewName: "homepage"
 * });
 */

export const saveSection = async <
  TContent extends Record<string, Record<string, string | undefined>>
>({
  activeLanguage = "ES",
  defaultKey,
  selectedContent,
  setIsSubmitting,
  fetchSectionContent,
  viewName = "main",
}: SaveSectionParams<TContent>) => {
  const currentLang = activeLanguage.toUpperCase();
  const contentToSave = selectedContent[currentLang];

  if (!contentToSave || typeof contentToSave !== "object") {
    toast.info("No hay contenido para guardar");
    return;
  }

  try {
    setIsSubmitting(true);

    const viewData = await fetchViewData(viewName);
    const viewUUID = viewData.body.uuid;
    const components: ComponentType[] = viewData.body.components || [];

    for (const [key, value] of Object.entries(contentToSave)) {
      if (typeof value !== "string") continue;

      const itemKey = `${defaultKey}.${key}`;
      let component = components.find((c) => c.itemKey === itemKey);

      if (!component) {
        const createRes = await fetch("/api/v1/components/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ views: [viewUUID], itemKey }),
        });

        const createData = await createRes.json();

        if (!createRes.ok || !createData.body) {
          throw new Error(createData.message || "Error creando componente.");
        }

        component = createData.body;
      }

      if (!component) {
        throw new Error(
          `Componente no encontrado ni creado para clave: ${itemKey}`
        );
      }

      const langEntry = (component.langs || []).find(
        (l: LangType) => l.lang.toUpperCase() === currentLang
      );

      if (langEntry?.content === value) continue;

      const langPayload = {
        lang: currentLang,
        content: value,
        component: component.uuid,
      };

      if (langEntry) {
        await fetch(`/api/v1/lang/${langEntry.uuid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(langPayload),
        });
      } else {
        await fetch("/api/v1/langs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(langPayload),
        });
      }
    }

    toast.success(`La sección ha sido guardada con éxito.`);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem(`translations_${viewName}_ES`);
      localStorage.removeItem(`translations_${viewName}_EN`);
    }
    
    await fetchSectionContent();
  } catch {
    toast.error(`Ha ocurrido un error guardando la sección.`);
  } finally {
    setIsSubmitting(false);
  }
};
