import { http } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";
import { unwrapData, unwrapList } from "@/lib/api-response";
import type { Subscription } from "@/types/api";

export async function activateSubscription(payload: {
  packageId: string;
}): Promise<Subscription> {
  const { data } = await http.post(API_ENDPOINTS.SUBSCRIPTIONS.ACTIVATE, payload);
  return unwrapData<Subscription>(data);
}

export async function getMySubscriptions(): Promise<Subscription[]> {
  const { data } = await http.get(API_ENDPOINTS.SUBSCRIPTIONS.ME);
  return unwrapList<Subscription>(data);
}

