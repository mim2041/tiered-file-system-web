import { http } from "@/lib/http";
import { unwrapData, unwrapList } from "@/lib/api-response";
import { FileItem } from "@/types/api";

export async function uploadFile(payload: { file: File; folderId?: string }): Promise<FileItem> {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.folderId) form.append("folderId", payload.folderId);
  const { data } = await http.post("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapData<FileItem>(data);
}

export async function getFiles(folderId?: string): Promise<FileItem[]> {
  const { data } = await http.get("/files", {
    params: folderId ? { folderId } : undefined,
  });
  return unwrapList<FileItem>(data);
}

export async function renameFile(fileId: string, payload: { name: string }): Promise<FileItem> {
  const { data } = await http.patch(`/files/${fileId}`, payload);
  return unwrapData<FileItem>(data);
}

export async function deleteFile(fileId: string) {
  const { data } = await http.delete(`/files/${fileId}`);
  return data;
}
