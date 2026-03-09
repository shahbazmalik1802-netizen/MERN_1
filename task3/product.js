
export class Product {
  constructor(id, name, price, category) {
    this.id       = id;
    this.name     = name;
    this.price    = price;
    this.category = category;
  }
  getSummary() {
    return `${this.name} ($${this.price}) — ${this.category}`;
  }

  static validate(product) {
    if (!product.name)        throw new Error("Product must have a name");
    if (product.price <= 0)   throw new Error("Price must be positive");
    return true;
  }

  static create(id, name, price, category) {
    const p = new Product(id, name, price, category);
    Product.validate(p);
    return p;
  }
}
