import { http } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";
import { unwrapList } from "@/lib/api-response";
import type { PackagePlan } from "@/types/api";

export async function getPackages(): Promise<PackagePlan[]> {
  const { data } = await http.get(API_ENDPOINTS.PACKAGES.LIST);
  return unwrapList<PackagePlan>(data);
}

