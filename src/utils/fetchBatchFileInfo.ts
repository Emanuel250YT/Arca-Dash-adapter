import { getReadableFileSize } from "./getReadableFileSize";

interface BatchFileInfoResponse {
  results: Record<
    string,
    {
      name: string;
      size: string;
    }
  >;
}

export async function fetchBatchFileInfo(
  urls: string[]
): Promise<BatchFileInfoResponse> {
  try {
    const response = await fetch("/api/v1/content/data/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: urls }),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud batch: ${response.status}`);
    }

    const data = await response.json();
    const results: Record<string, { name: string; size: string }> = {};

    urls.forEach((id) => {
      const fileId = id.split("/").pop()?.split(".")[0];
      if (fileId) {
        const fileData = data.body?.results?.[id];
        if (fileData?.name && typeof fileData.size === 'number') {
          results[fileId] = {
            name: fileData.name,
            size: getReadableFileSize(fileData.size),
          };
        } else {
          results[fileId] = {
            name: 'Archivo no encontrado',
            size: "...",
          };
        }
      }
    });

    return { results };
  } catch {
    return {
      results: urls.reduce((acc, id) => {
        acc[id] = {
          name: 'Archivo no encontrado',
          size: "...",
        };
        return acc;
      }, {} as Record<string, { name: string; size: string }>),
    };
  }
}