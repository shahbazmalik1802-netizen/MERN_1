
function Product(id, name, price, category, stock) {
  this.id       = id;
  this.name     = name;
  this.price    = price;
  this.category = category;
  this.stock    = stock;
  this.sold     = Math.floor(Math.random() * 200);
}
Product.prototype.isLowStock = function () { return this.stock < 10; };
Product.prototype.getRevenue = function () { return this.price * this.sold; };
Product.prototype.getSummary = function () {
  return `${this.name} | $${this.price} | stock: ${this.stock}`;
};
function createAuditCounter() {
  let count = 0;                        
  return {
    increment() { count++; },
    value()     { return count; },
    reset()     { count = 0; },
  };
}

export const auditCounter = createAuditCounter();
const RAW = [
  { id:1,  name:"Laptop Pro",     price:1299, category:"Electronics", stock:4  },
  { id:2,  name:"Wireless Mouse", price:29,   category:"Electronics", stock:45 },
  { id:3,  name:"Mechanical KB",  price:89,   category:"Electronics", stock:8  },
  { id:4,  name:"USB-C Hub",      price:49,   category:"Electronics", stock:3  },
  { id:5,  name:"Running Shoes",  price:99,   category:"Clothing",    stock:22 },
  { id:6,  name:"Hoodie",         price:59,   category:"Clothing",    stock:7  },
  { id:7,  name:"Denim Jeans",    price:79,   category:"Clothing",    stock:15 },
  { id:8,  name:"JS Deep Dive",   price:39,   category:"Books",       stock:60 },
  { id:9,  name:"TypeScript Handbook", price:34, category:"Books",    stock:5  },
  { id:10, name:"Clean Code",     price:44,   category:"Books",       stock:12 },
  { id:11, name:"Coffee Beans",   price:19,   category:"Food",        stock:2  },
  { id:12, name:"Green Tea",      price:14,   category:"Food",        stock:35 },
];
export function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = RAW.map(
        p => new Product(p.id, p.name, p.price, p.category, p.stock)
      );
      resolve(products);
    }, 600);
  });
}
