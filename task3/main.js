
import { Product } from "./product.js";
import { createCart } from "./cart.js";
import { groupByCategory, getUniqueCategories, sortByPrice } from "./utils.js";

console.log(" SHOPPING CART ");
const p1 = Product.create(1, "Laptop",     999,  "Electronics");
const p2 = Product.create(2, "Phone",      499,  "Electronics");
const p3 = Product.create(3, "Headphones", 79,   "Electronics");
const p4 = Product.create(4, "T-Shirt",    19,   "Clothing");
const p5 = Product.create(5, "Jeans",      49,   "Clothing");

const allProducts = [p1, p2, p3, p4, p5];

const cart = createCart("Alice");

cart.addItem(p1);        
cart.addItem(p2, 2);     
cart.addItem(p4, 3);     
cart.addItem(p1);        

console.log("\n-- Cart Items --");
cart.getItems().forEach(({ name, quantity, price }) => {
 
  console.log(`  ${name} x${quantity} @ $${price}`);
});

console.log("\nTotal:", `$${cart.getTotal()}`);

console.log("\n-- Clone Cart --");
const cloned = cart.clone();
cloned.removeItem(p2.id); 
console.log("Original total:", `$${cart.getTotal()}`);  
console.log("Cloned total  :", `$${cloned.getTotal()}`);  

console.log("\n-- JSON Summary --");
console.log(cart.getSummary());

console.log("\n-- Group by Category --");
const grouped = groupByCategory(allProducts);
grouped.forEach((products, category) => {
  console.log(`${category}: ${products.map(p => p.name).join(", ")}`);
});

console.log("\n-- Unique Categories --");
console.log(getUniqueCategories(allProducts));

console.log("\n-- Sort by Price --");
sortByPrice(allProducts).forEach(p => console.log(`  $${p.price} — ${p.name}`));

console.log("\n-- Dynamic Import --");
const { sortByName } = await import("./utils.js");
const sorted = sortByName(allProducts);
console.log("Sorted by name:", sorted.map(p => p.name));

console.log("\n-- Error Handling --");
try {
  Product.create(99, "", -10, "Bad");
} catch (err) {
  console.log("Caught:", err.message);
}

console.log("DONE ");
