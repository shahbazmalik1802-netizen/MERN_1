

import { fetchProducts, auditCounter }       from "./data.js";
import { debounce, throttle, groupByCategory,
         getCategories, computeStats, exportToJSON } from "./utils.js";
import { runAllAudits, GenericTable }        from "./audit.js";

let allProducts = []; 

function renderStats(products) {
  const s = computeStats(products);
  document.querySelector("#statValue").textContent   = `$${s.totalValue.toLocaleString()}`;
  document.querySelector("#statRevenue").textContent = `$${s.totalRevenue.toLocaleString()}`;
  document.querySelector("#statSold").textContent    = s.totalSold.toLocaleString();
  document.querySelector("#statLow").textContent     = s.lowStock.length;
  document.querySelector("#statTop").textContent     = s.topSeller?.name || "—";
  document.querySelector("#statAlert").textContent   =
    s.hasCritical ? "⚠️ Critical stock levels!" : s.allInStock ? "✅ All items in stock" : "";
}
function renderGrid(products) {
  const grid = document.querySelector("#productGrid");
  auditCounter.increment();

  if (products.length === 0) {
    grid.innerHTML = `<p class="empty-msg">No products found.</p>`;
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card ${p.isLowStock() ? "low-stock" : ""}" data-id="${p.id}">
      <div class="card-category">${p.category}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-price">$${p.price}</div>
      <div class="card-meta">
        <span class="stock-badge ${p.stock < 5 ? "critical" : p.isLowStock() ? "low" : "ok"}">
          stock: ${p.stock}
        </span>
        <span class="sold-badge">sold: ${p.sold}</span>
      </div>
      <button class="btn-edit" data-action="edit" data-id="${p.id}">edit</button>
    </div>
  `).join("");
}

function renderTabs(products) {
  const cats  = ["All", ...getCategories(products)]; 
  const tabs  = document.querySelector("#categoryTabs");
  tabs.innerHTML = cats.map(c =>
    `<button class="tab ${c === "All" ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
}
function renderAudits(products) {
  const results  = runAllAudits(products);
  const container = document.querySelector("#auditResults");
  container.innerHTML = results.map(r => `
    <div class="audit-card ${r.passed ? "pass" : "fail"}">
      <div class="audit-title">${r.auditName} — ${r.passed ? "✅ PASS" : "❌ FAIL"}</div>
      <div class="audit-msg">${r.message}</div>
      ${r.items.length > 0
        ? new GenericTable(r.items, Object.keys(r.items[0])).render()
        : ""}
    </div>
  `).join("");
}
function openEditModal(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  document.querySelector("#modalTitle").textContent  = `Edit: ${product.name}`;
  document.querySelector("#editName").value   = product.name;
  document.querySelector("#editPrice").value  = product.price;
  document.querySelector("#editStock").value  = product.stock;
  document.querySelector("#editId").value     = product.id;
  document.querySelector("#editModal").classList.add("open");
}
document.querySelector("#productGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-action='edit']");
  if (!btn) return;
  openEditModal(Number(btn.dataset.id));
});
document.querySelector("#editForm").addEventListener("submit", e => {
  e.preventDefault(); 
  const id      = Number(document.querySelector("#editId").value);
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  product.name  = document.querySelector("#editName").value.trim();
  product.price = Number(document.querySelector("#editPrice").value);
  product.stock = Number(document.querySelector("#editStock").value);

  document.querySelector("#editModal").classList.remove("open");
  refreshView(allProducts);
});

document.querySelector("#modalClose").addEventListener("click", () => {
  document.querySelector("#editModal").classList.remove("open");
});
document.querySelector("#searchInput").addEventListener("input", debounce(e => {
  const kw      = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(kw));
  renderGrid(filtered);
}, 350));
document.querySelector("#categoryTabs").addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");

  const cat      = tab.dataset.cat;
  const filtered = cat === "All" ? allProducts : allProducts.filter(p => p.category === cat);
  renderGrid(filtered);
});
window.addEventListener("scroll", throttle(() => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0;
  document.querySelector("#scrollBar").style.width = `${pct}%`;
}, 100));
function refreshView(products) {
  renderStats(products);
  renderGrid(products);
  renderAudits(products);
  document.querySelector("#auditCount").textContent = `Renders: ${auditCounter.value()}`;
}
async function init() {
  document.querySelector("#loadingMsg").style.display = "block";
  const [result] = await Promise.allSettled([fetchProducts()]);

  document.querySelector("#loadingMsg").style.display = "none";

  if (result.status === "rejected") {
    document.querySelector("#productGrid").innerHTML = `<p class="empty-msg">Failed to load products.</p>`;
    return;
  }

  allProducts = result.value;
  renderTabs(allProducts);
  refreshView(allProducts);
}

document.querySelector("#exportBtn").addEventListener("click", () => exportToJSON(allProducts));
init();
