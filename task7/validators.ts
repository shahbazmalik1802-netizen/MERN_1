// src/validators.ts
// ── GENERIC VALIDATORS WITH CONSTRAINTS ───────────────────
// T extends { price: number } means T must have a price field
// This lets us reuse the same validator for Product, CartItem, etc.

export function validatePrice<T extends { price: number }>(item: T): boolean {
  if (item.price <= 0) throw new Error(`Invalid price: ${item.price}`);
  return true;
}

// T extends { stock: number }
export function validateStock<T extends { stock: number }>(item: T): boolean {
  if (item.stock < 0) throw new Error(`Stock cannot be negative: ${item.stock}`);
  return true;
}

// Generic validator — runs all checks on any object
// T extends object = must be an object (not a primitive)
export function validate<T extends object>(
  item: T,
  checks: Array<(item: T) => boolean>  // array of check functions
): boolean {
  return checks.every(check => check(item));
}
