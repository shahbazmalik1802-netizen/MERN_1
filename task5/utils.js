
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
export function throttle(fn, limit) {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= limit) { lastRun = now; fn(...args); }
  };
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(val) {
  if (!val.trim())        return { ok: false, msg: "Name is required" };
  if (val.trim().length < 3) return { ok: false, msg: "At least 3 characters" };
  return { ok: true, msg: "✓ Looks good" };
}

export function validateEmail(val) {
  if (!val.trim())             return { ok: false, msg: "Email is required" };
  if (!EMAIL_REGEX.test(val))  return { ok: false, msg: "Invalid email format" };
  return { ok: true, msg: "✓ Valid email" };
}
export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadTasks() {
  const raw = localStorage.getItem("tasks");
  return raw ? JSON.parse(raw) : [];
}
