
class AuditBase {
  constructor(name) {
    if (new.target === AuditBase) throw new Error("AuditBase is abstract — cannot instantiate directly");
    this.name = name;
  }

  run(_products) { throw new Error(`${this.name} must implement run()`); }
}
export class LowStockAudit extends AuditBase {
  constructor() { super("LowStockAudit"); }

  run(products) {
    const flagged = products.filter(p => typeof p.stock === "number" && p.isLowStock());
    return {
      auditName: this.name,
      passed:    flagged.length === 0,
      count:     flagged.length,
      items:     flagged.map(p => ({ name: p.name, stock: p.stock })),
      message:   flagged.length === 0 ? "All items sufficiently stocked" : `${flagged.length} items low on stock`,
    };
  }
}

export class PriceAudit extends AuditBase {
  constructor() { super("PriceAudit"); }

  run(products) {
    const invalid = products.filter(p => typeof p.price !== "number" || p.price <= 0);
    return {
      auditName: this.name,
      passed:    invalid.length === 0,
      count:     invalid.length,
      items:     invalid.map(p => ({ name: p.name, price: p.price })),
      message:   invalid.length === 0 ? "All prices valid" : `${invalid.length} invalid prices found`,
    };
  }
}
export class GenericTable {
  constructor(data, columns) {
    this.data    = data;
    this.columns = columns;
  }
  render() {
    if (this.data.length === 0) return `<p class="empty">No data.</p>`;
    return `
      <table>
        <thead>
          <tr>${this.columns.map(c => `<th>${c}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${this.data.map(row => `
            <tr>${this.columns.map(c => `<td>${row[c] ?? "—"}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>`;
  }
}
export function runAllAudits(products) {
  const audits = [new LowStockAudit(), new PriceAudit()];
  return audits.map(a => a.run(products));
}
