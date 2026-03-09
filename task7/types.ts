
export type Category = "Electronics" | "Clothing" | "Books" | "Food";

export interface Product {
  id:       number;
  name:     string;
  price:    number;
  category: Category;
  stock:    number;
}
export interface CartItem extends Product {
  quantity: number;
}
export type ProductUpdate = Partial<Pick<Product, "name" | "price" | "stock">>;
export type Inventory = Record<Category, Product[]>;
export type ReadonlyCart = {
  readonly [K in keyof CartItem]: CartItem[K];
};
