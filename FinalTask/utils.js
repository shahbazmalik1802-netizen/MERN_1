
export function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

export function throttle(fn, limit) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= limit) { last = now; fn(...args); } };
}
export function groupByCategory(products) {
  const map = new Map();
  products.forEach(p => {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category).push(p);
  });
  return map;
}
export function getCategories(products) {
  return [...new Set(products.map(p => p.category))];
}
export function computeStats(products) {
  const totalValue   = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.getRevenue(), 0);
  const totalSold    = products.reduce((sum, p) => sum + p.sold, 0);
  const hasCritical  = products.some(p => p.stock < 5);
  const allInStock   = products.every(p => p.stock > 0);

  const topSeller    = products.reduce((best, p) => p.sold > best.sold ? p : best, products[0]);
  const lowStock     = products.filter(p => p.isLowStock()).sort((a, b) => a.stock - b.stock);

  return { totalValue, totalRevenue, totalSold, hasCritical, allInStock, topSeller, lowStock };
}
export function exportToJSON(products) {
  const data = products.map(p => ({
    id: p.id, name: p.name, price: p.price,
    category: p.category, stock: p.stock, sold: p.sold,
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "inventory.json"; a.click();
  URL.revokeObjectURL(url);
}
