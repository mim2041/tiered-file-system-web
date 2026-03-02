import { http } from "@/lib/http";
import { unwrapData, unwrapList } from "@/lib/api-response";
import { Subscription } from "@/types/api";

export async function activateSubscription(payload: { packageId: string }): Promise<Subscription> {
  const { data } = await http.post("/subscriptions/activate", payload);
  return unwrapData<Subscription>(data);
}

export async function getMySubscriptions(): Promise<Subscription[]> {
  const { data } = await http.get("/subscriptions/me");
  return unwrapList<Subscription>(data);
}
