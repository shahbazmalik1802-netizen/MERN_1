const cache     = new WeakMap();
const cacheKeys = {};           
export async function fetchWithCache(keyName, fetchFn) {
 
  if (!cacheKeys[keyName]) cacheKeys[keyName] = {};
  const key = cacheKeys[keyName];

  if (cache.has(key)) {
    console.log(`[cache hit] ${keyName}`);
    return cache.get(key);
  }
  const data = await fetchFn();
  cache.set(key, data);
  console.log(`[fetched]   ${keyName}`);
  return data;
}
