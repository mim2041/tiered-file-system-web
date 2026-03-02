import { http } from "@/lib/http";
import { unwrapList } from "@/lib/api-response";
import { PackagePlan } from "@/types/api";

export async function getPackages(): Promise<PackagePlan[]> {
  const { data } = await http.get("/packages");
  return unwrapList<PackagePlan>(data);
}
