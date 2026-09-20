import { config } from "../config";
import { redis } from "./redis";

export interface CacheResult<T> {
  data: T;
  hit: boolean;
}

// Falls back to the source (fetcher) on Redis errors instead of failing the request,
// so a down/unreachable cache degrades performance but not availability.
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<CacheResult<T>> {
  if (!config.cacheEnabled) {
    return { data: await fetcher(), hit: false };
  }

  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      return { data: JSON.parse(cached) as T, hit: true };
    }
  } catch (err) {
    console.error(`Redis GET failed for key "${key}":`, err);
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (err) {
    console.error(`Redis SET failed for key "${key}":`, err);
  }

  return { data, hit: false };
}

export async function invalidateCache(key: string) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Redis DEL failed for key "${key}":`, err);
  }
}
