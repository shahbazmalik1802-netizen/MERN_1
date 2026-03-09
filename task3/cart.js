

export function createCart(owner) {
  let items = [];

  return {
    owner,

    addItem(product, quantity = 1) {
      const existing = items.find(i => i.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ ...product, quantity }); 
      }
      console.log(`Added "${product.name}" x${quantity}`);
    },

    removeItem(id) {
      const before = items.length;
      items = items.filter(i => i.id !== id);
      if (items.length === before) throw new Error(`Item id ${id} not in cart`);
      console.log(`Removed item #${id}`);
    },
    getItems() {
      return [...items];
    },
    getTotal() {
      return items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    },

    clone() {
      const copy = createCart(this.owner + "_copy");
      const clonedItems = structuredClone(items);
      clonedItems.forEach(item => {
        const { quantity, ...product } = item; 
        copy.addItem(product, quantity);
      });
      return copy;
    },

    getSummary() {
      const total = this.getTotal();
      const count = items.reduce((sum, i) => sum + i.quantity, 0);
      const summary = {
        owner: this.owner,
        totalItems: count,
        totalPrice: `$${total.toFixed(2)}`,
        items: items.map(({ name, price, quantity }) =>
          `${name} x${quantity} = $${(price * quantity).toFixed(2)}`
        ),
      };
      return JSON.stringify(summary, null, 2);
    },
  };
}
