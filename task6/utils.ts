
export function findByProp<T extends object>(
  items: T[],
  key: keyof T,       
  value: T[keyof T]
): T[] {
  return items.filter(item => item[key] === value);
}

export function sortByProp<T extends object>(
  items: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"   
): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ?  1 : -1;
    return 0;
  });
}
