// src/index.ts — demo tying everything together
import { InventoryManager }          from "./inventory";
import { Cart, createCartSummary }   from "./cart";
import { Product }                   from "./types";

console.log("========== TS SHOPPING CART ==========\n");

// ── PRODUCTS ──────────────────────────────────────────────
const products: Product[] = [
  { id: 1, name: "Laptop",      price: 999,  category: "Electronics", stock: 5  },
  { id: 2, name: "Phone",       price: 499,  category: "Electronics", stock: 10 },
  { id: 3, name: "T-Shirt",     price: 19,   category: "Clothing",    stock: 50 },
  { id: 4, name: "JS Book",     price: 39,   category: "Books",       stock: 20 },
];

// ── INVENTORY ─────────────────────────────────────────────
const inv = new InventoryManager();
products.forEach(p => inv.addProduct(p));
inv.print();

// UPDATE using Partial<Pick<Product, 'name'|'price'|'stock'>>
// Only the fields you pass are changed — all are optional
console.log("\n── Update product 1 ──");
inv.updateProduct(1, { price: 899, stock: 3 }); // only price and stock change
inv.updateProduct(3, { name: "Cool T-Shirt" }); // only name changes

// ── CART ──────────────────────────────────────────────────
console.log("\n── Cart ──");
const laptop = inv.findById(1)!; // ! = we're sure it exists (non-null assertion)
const phone  = inv.findById(2)!;
const tshirt = inv.findById(3)!;

const cart = new Cart("Alice");
cart.addItem(laptop, 1);
cart.addItem(phone,  2);
cart.addItem(tshirt, 3);
cart.print();

// ReadonlyCart — trying to mutate items would be a TypeScript ERROR at compile time
const items = cart.getItems();
// items[0].price = 1; // ← TS ERROR: Cannot assign to 'price' because it is a read-only property
console.log("\nReadonly items (cannot mutate):", items.map(i => i.name));

// ReturnType — CartSummary type is derived automatically from createCartSummary
const summary: import("./cart").CartSummary = createCartSummary(cart);
console.log("\n── Cart Summary (ReturnType) ──");
console.log(JSON.stringify(summary, null, 2));

// ── ERROR HANDLING ────────────────────────────────────────
console.log("\n── Errors ──");
try {
  inv.addProduct({ id: 99, name: "Bad", price: -10, category: "Books", stock: 5 });
} catch (e) { console.log("Caught:", (e as Error).message); }

try {
  cart.addItem(laptop, 999); // more than stock
} catch (e) { console.log("Caught:", (e as Error).message); }

console.log("\n========== DONE ==========");
