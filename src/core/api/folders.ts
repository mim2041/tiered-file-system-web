import { http } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";
import { unwrapData, unwrapList } from "@/lib/api-response";
import type { FolderItem } from "@/types/api";

export async function createFolder(payload: {
  name: string;
  parentId?: string;
}): Promise<FolderItem> {
  const { data } = await http.post(API_ENDPOINTS.FOLDERS.ROOT, payload);
  return unwrapData<FolderItem>(data);
}

export async function getFolders(parentId?: string): Promise<FolderItem[]> {
  const { data } = await http.get(API_ENDPOINTS.FOLDERS.ROOT, {
    params: parentId ? { parentId } : undefined,
  });
  return unwrapList<FolderItem>(data);
}

export async function renameFolder(
  folderId: string,
  payload: { name: string },
): Promise<FolderItem> {
  const { data } = await http.patch(API_ENDPOINTS.FOLDERS.BY_ID(folderId), payload);
  return unwrapData<FolderItem>(data);
}

export async function deleteFolder(folderId: string) {
  const { data } = await http.delete(API_ENDPOINTS.FOLDERS.BY_ID(folderId));
  return data;
}

