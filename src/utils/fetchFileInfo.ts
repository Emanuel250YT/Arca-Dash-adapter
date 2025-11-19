/**
 * Fetches file metadata from a given URL.
 * @param url The URL of the remote file.
 * @returns An object containing file name and size.
 */
export async function fetchFileInfo(url: string): Promise<{
  name: string;
  size: string;
}> {
  const fileId = url.split("/").pop()?.split(".")[0];
  if (!fileId) throw new Error(`Invalid file URL: ${url}`);

  const dataResponse = await fetch(`/api/v1/content/data/${fileId}`);
  if (!dataResponse.ok) throw new Error(`Failed to fetch file data: ${url}`);
  const fileData = await dataResponse.json();

  return {
    name:
      fileData.body.name ||
      decodeURIComponent(url.split("/").pop() || "archivo"),
    size: fileData.body.size,
  };
}
