
import { Product, Category, Inventory, ProductUpdate } from "./types";
import { validate, validatePrice, validateStock }       from "./validators";

function emptyInventory(): Inventory {
  return { Electronics: [], Clothing: [], Books: [], Food: [] };
}
export class InventoryManager {
 
  private inventory: Inventory = emptyInventory();

  addProduct(product: Product): void {
    validate(product, [validatePrice, validateStock]);
    this.inventory[product.category].push(product);
    console.log(`Added: ${product.name} → ${product.category}`);
  }
  updateProduct(id: number, changes: ProductUpdate): void {
    const product = this.findById(id);
    if (!product) throw new Error(`Product ${id} not found`);

    Object.assign(product, changes);
    console.log(`Updated product ${id}:`, changes);
  }
  getByCategory(category: Category): Product[] {
    return this.inventory[category];
  }
  getAll(): Product[] {
    return Object.values(this.inventory).flat();
  }
  findById(id: number): Product | undefined {
    return this.getAll().find(p => p.id === id);
  }

  print(): void {
    console.log("\n── Inventory ──");
    (Object.keys(this.inventory) as Category[]).forEach(cat => {
      const products = this.inventory[cat];
      if (products.length === 0) return;
      console.log(`\n  ${cat}:`);
      products.forEach(p =>
        console.log(`    - ${p.name} | $${p.price} | stock: ${p.stock}`)
      );
    });
  }
}
