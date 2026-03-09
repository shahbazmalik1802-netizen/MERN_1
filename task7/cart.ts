
import { Product, CartItem, ReadonlyCart } from "./types";

export class Cart {
  private items: CartItem[] = [];
  readonly owner: string;

  constructor(owner: string) {
    this.owner = owner;
  }

  addItem(product: Product, quantity: number = 1): void {
    if (quantity <= 0) throw new Error("Quantity must be positive");
    if (product.stock < quantity) throw new Error(`Not enough stock for "${product.name}"`);

    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    console.log(`[${this.owner}] Added "${product.name}" x${quantity}`);
  }

  removeItem(id: number): void {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Item ${id} not in cart`);
    this.items.splice(index, 1);
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  getItems(): ReadonlyCart[] {
    return this.items as ReadonlyCart[];
  }
  print(): void {
    console.log(`\n── Cart: ${this.owner} ──`);
    if (this.items.length === 0) { console.log("  (empty)"); return; }
    this.items.forEach(i =>
      console.log(`  - ${i.name} x${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`)
    );
    console.log(`  Total: $${this.getTotal().toFixed(2)}`);
  }
}
function createCartSummary(cart: Cart) {
  return {
    owner:      cart.owner,
    itemCount:  cart.getItems().length,
    total:      cart.getTotal(),
    items:      cart.getItems().map(i => `${i.name} x${i.quantity}`),
  };
}
export type CartSummary = ReturnType<typeof createCartSummary>;

export { createCartSummary };
