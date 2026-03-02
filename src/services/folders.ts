import { http } from "@/lib/http";
import { unwrapData, unwrapList } from "@/lib/api-response";
import { FolderItem } from "@/types/api";

export async function createFolder(payload: { name: string; parentId?: string }): Promise<FolderItem> {
  const { data } = await http.post("/folders", payload);
  return unwrapData<FolderItem>(data);
}

export async function getFolders(parentId?: string): Promise<FolderItem[]> {
  const { data } = await http.get("/folders", {
    params: parentId ? { parentId } : undefined,
  });
  return unwrapList<FolderItem>(data);
}

export async function renameFolder(folderId: string, payload: { name: string }): Promise<FolderItem> {
  const { data } = await http.patch(`/folders/${folderId}`, payload);
  return unwrapData<FolderItem>(data);
}

export async function deleteFolder(folderId: string) {
  const { data } = await http.delete(`/folders/${folderId}`);
  return data;
}
