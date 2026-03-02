import { http } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";
import { unwrapData, unwrapList } from "@/lib/api-response";
import type { FileItem } from "@/types/api";

export async function uploadFile(payload: {
  file: File;
  folderId?: string;
}): Promise<FileItem> {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.folderId) form.append("folderId", payload.folderId);

  const { data } = await http.post(API_ENDPOINTS.FILES.ROOT, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return unwrapData<FileItem>(data);
}

export async function getFiles(folderId?: string): Promise<FileItem[]> {
  const { data } = await http.get(API_ENDPOINTS.FILES.ROOT, {
    params: folderId ? { folderId } : undefined,
  });
  return unwrapList<FileItem>(data);
}

export async function renameFile(
  fileId: string,
  payload: { name: string },
): Promise<FileItem> {
  const { data } = await http.patch(API_ENDPOINTS.FILES.BY_ID(fileId), payload);
  return unwrapData<FileItem>(data);
}

export async function deleteFile(fileId: string) {
  const { data } = await http.delete(API_ENDPOINTS.FILES.BY_ID(fileId));
  return data;
}

