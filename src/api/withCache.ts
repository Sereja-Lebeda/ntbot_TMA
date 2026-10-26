const cache = new Map<string, unknown>();

export async function withCache<T>(
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;

  const value = await load();
  cache.set(key, value);
  return value;
}
