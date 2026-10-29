const cache = new Map<string, Promise<unknown>>();

export function withCache<T>(key: string, load: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = load().catch((e) => {
    cache.delete(key);
    throw e;
  });

  cache.set(key, promise);

  return promise;
}
