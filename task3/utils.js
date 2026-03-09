
export function groupByCategory(items) {
  const map = new Map();

  items.forEach(item => {
    if (!map.has(item.category)) {
      map.set(item.category, []);
    }
    map.get(item.category).push(item);
  });

  return map;
}

export function getUniqueCategories(items) {
  const set = new Set(items.map(item => item.category));
  return [...set];
}

export function sortByPrice(items) {
  return [...items].sort((a, b) => a.price - b.price);
}

export function sortByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}
