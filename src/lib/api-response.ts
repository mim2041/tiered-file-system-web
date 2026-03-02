type Wrapped<T> = { data?: T; items?: T extends unknown[] ? T : never };

export function unwrapData<T>(payload: unknown): T {
  return (((payload as Wrapped<T>)?.data ?? payload) as T);
}

export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload;
  const w = payload as Wrapped<T[]>;
  if (Array.isArray(w?.data)) return w.data!;
  if (Array.isArray(w?.items)) return w.items! as T[];
  return [];
}
