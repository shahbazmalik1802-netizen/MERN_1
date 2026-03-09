const fs = require("fs");
const readline = require("readline");

const FILE = "tasks.json";

function makeCounter() {
  let count = 0;             
  return {
    add()    { count++; },
    remove() { count--; },
    value()  { return count; },
  };
}
const counter = makeCounter();
function load() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (err) {
    throw new Error("Could not read file: " + err.message);
  }
}

function save(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}
function listTasks() {
  const tasks = load();
  if (tasks.length === 0) return console.log("No tasks yet!");
  tasks.forEach((t, i) => {
    const done = t.completed ? "✔" : "○";
    console.log(`  ${i + 1}. [${done}] ${t.title}  (${t.priority})`);
  });
}

function addTask(title, priority) {
  if (!title) throw new Error("Title is required");
  if (!["low", "medium", "high"].includes(priority))
    throw new Error("Priority must be: low / medium / high");

  const tasks = load();
  tasks.push({ title, priority, completed: false });
  save(tasks);
  counter.add();
  console.log(`Added: "${title}"`);
}

function removeTask(num) {
  const tasks = load();
  const i = Number(num) - 1;
  if (i < 0 || i >= tasks.length) throw new Error("Invalid task number");
  const [removed] = tasks.splice(i, 1);
  save(tasks);
  counter.remove();
  console.log(`Removed: "${removed.title}"`);
}

function completeTask(num) {
  const tasks = load();
  const i = Number(num) - 1;
  if (i < 0 || i >= tasks.length) throw new Error("Invalid task number");
  tasks[i].completed = true;
  save(tasks);
  console.log(`Marked done: "${tasks[i].title}"`);
}

function searchTasks(keyword) {
  const results = load().filter(t =>
    t.title.toLowerCase().includes(keyword.toLowerCase())
  );
  if (results.length === 0) return console.log("No matches.");
  results.forEach(t => console.log(` - ${t.title} (${t.priority})`));
}

function sortByPriority() {
  const order = { high: 1, medium: 2, low: 3 };
  const sorted = load().sort((a, b) => order[a.priority] - order[b.priority]);
  sorted.forEach(t => console.log(` - [${t.priority}] ${t.title}`));
}

function showStats() {
  const tasks = load();

  const doneCount = tasks.reduce((acc, t) => t.completed ? acc + 1 : acc, 0);
  const hasUrgent = tasks.some(t => t.priority === "high" && !t.completed);
  const allDone = tasks.every(t => t.completed);

  console.log(`Total    : ${tasks.length}`);
  console.log(`Completed: ${doneCount}`);
  console.log(`Pending  : ${tasks.length - doneCount}`);
  console.log(`Urgent?  : ${hasUrgent ? "Yes ⚠️" : "No"}`);
  console.log(`All done?: ${allDone ? "Yes 🎉" : "Not yet"}`);
  console.log(`Added this session: ${counter.value()}`);
}
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(res => rl.question(q, res));

async function menu() {
  console.log("\n1) List  2) Add  3) Remove  4) Complete  5) Search  6) Sort  7) Stats  8) Exit");
  const choice = await ask("Choice: ");

  try {
    if      (choice === "1") { listTasks(); }
    else if (choice === "2") {
      const title    = await ask("Title: ");
      const priority = await ask("Priority (low/medium/high): ");
      addTask(title.trim(), priority.trim());
    }
    else if (choice === "3") { listTasks(); removeTask(await ask("Number to remove: ")); }
    else if (choice === "4") { listTasks(); completeTask(await ask("Number to complete: ")); }
    else if (choice === "5") { searchTasks(await ask("Search keyword: ")); }
    else if (choice === "6") { sortByPriority(); }
    else if (choice === "7") { showStats(); }
    else if (choice === "8") { console.log("Bye!"); rl.close(); return; }
    else                     { console.log("Invalid choice."); }
  } catch (err) {
    console.log("Error:", err.message); 
  }

  menu(); 
}

menu();
