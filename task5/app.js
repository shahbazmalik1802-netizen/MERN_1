
import { debounce, throttle, validateName, validateEmail, saveTasks } from "./utils.js";
export function render(tasks, listEl, countEl) {
  countEl.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;

  if (tasks.length === 0) {
    listEl.innerHTML = `<div class="empty">No tasks yet. Add one above!</div>`;
    return;
  }
  listEl.innerHTML = tasks.map(t => `
    <div class="task-item ${t.done ? "done" : ""}" data-id="${t.id}">
      <div class="task-check" data-action="toggle">${t.done ? "✓" : ""}</div>
      <div class="task-info">
        <div class="task-name">${t.name}</div>
        <div class="task-meta">${t.email} · due ${t.date || "—"}</div>
      </div>
      <span class="task-priority priority-${t.priority}">${t.priority}</span>
      <div class="task-actions">
        <button class="btn-icon" data-action="edit">edit</button>
        <button class="btn-icon btn-del" data-action="delete">del</button>
      </div>
    </div>
  `).join("");
}
function setHint(hintEl, inputEl, msg, isOk) {
  hintEl.textContent = msg;
  hintEl.className   = "hint " + (isOk ? "ok" : "err");
  inputEl.classList.toggle("valid",   isOk && msg !== "");
  inputEl.classList.toggle("invalid", !isOk && msg !== "");
}

export function setupForm(form, inputs, tasks, listEl, countEl) {
  const { nameInput, emailInput, prioritySel, dateInput,
          nameHint, emailHint, priorityHint, dateHint } = inputs;

  nameInput.addEventListener("input", debounce(e => {
    const { ok, msg } = validateName(e.target.value);
    setHint(nameHint, nameInput, msg, ok);
  }, 400));

  emailInput.addEventListener("input", debounce(e => {
    const { ok, msg } = validateEmail(e.target.value);
    setHint(emailHint, emailInput, msg, ok);
  }, 400));
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const priority = prioritySel.value;
    const date     = dateInput.value;

    const nv = validateName(name);
    const ev = validateEmail(email);

    setHint(nameHint,  nameInput,  nv.msg, nv.ok);
    setHint(emailHint, emailInput, ev.msg, ev.ok);

    let valid = nv.ok && ev.ok;

    if (!priority) { priorityHint.textContent = "Select a priority"; priorityHint.className = "hint err"; valid = false; }
    else           { priorityHint.textContent = ""; }

    if (!date)    { dateHint.textContent = "Pick a due date"; dateHint.className = "hint err"; valid = false; }
    else          { dateHint.textContent = ""; }

    if (!valid) return;

    tasks.push({ id: Date.now(), name, email, priority, date, done: false });
    saveTasks(tasks);
    render(tasks, listEl, countEl);
    form.reset();
    [nameHint, emailHint, priorityHint, dateHint].forEach(h => h.textContent = "");
    [nameInput, emailInput].forEach(i => i.className = "");
  });
}
export function setupDelegation(listEl, tasks, countEl) {
  listEl.addEventListener("click", e => {
    const actionEl = e.target.closest("[data-action]");
    const taskItem = e.target.closest("[data-id]");
    if (!actionEl || !taskItem) return;

    const action = actionEl.dataset.action;
    const id     = Number(taskItem.dataset.id);
    const task   = tasks.find(t => t.id === id);
    if (!task) return;

    if (action === "toggle") {
      task.done = !task.done;
      saveTasks(tasks);
      render(tasks, listEl, countEl);
    }

    if (action === "delete") {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks(tasks);
      render(tasks, listEl, countEl);
    }

    if (action === "edit") {
      const nameEl = taskItem.querySelector(".task-name");
      nameEl.innerHTML = `<input class="task-edit-input" value="${task.name}"/>`;
      const editInput = nameEl.querySelector("input");
      editInput.focus();

      function save() {
        const val = editInput.value.trim();
        if (val.length >= 3) task.name = val;
        nameEl.textContent = task.name;
        saveTasks(tasks);
      }

      editInput.addEventListener("keydown", e => { if (e.key === "Enter") save(); });
      editInput.addEventListener("blur", save);
    }
  });
}
export function setupResize(resizeBar) {
  const onResize = throttle(() => {
    resizeBar.textContent = `window: ${window.innerWidth} × ${window.innerHeight}px`;
  }, 300);
  window.addEventListener("resize", onResize);
  onResize();
}
