// index.ts — entry point
// ── CLI MENU ──────────────────────────────────────────────
import * as readline from "readline";
import { Priority }  from "./types";
import { addTask, removeTask, completeTask, listTasks, showStats, getTasks } from "./tasks";
import { filterByProp, sortByProp, findByProp } from "./generics";

const rl  = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise(res => rl.question(q, res));

async function menu(): Promise<void> {
  console.log("\n1) List  2) Add  3) Remove  4) Complete  5) Filter  6) Sort  7) Find  8) Stats  9) Exit");
  const choice = await ask("Choice: ");

  try {
    if (choice === "1") {
      listTasks();

    } else if (choice === "2") {
      const title    = await ask("Title: ");
      const p        = await ask("Priority (high/medium/low): ") as Priority;
      const assignee = await ask("Assign to (optional, press Enter to skip): ");
      addTask(title, p || Priority.Medium, assignee || undefined);

    } else if (choice === "3") {
      listTasks();
      const id = await ask("ID to remove: ");
      removeTask(Number(id));

    } else if (choice === "4") {
      listTasks();
      const id = await ask("ID to complete: ");
      completeTask(Number(id));

    } else if (choice === "5") {
      // Generic filterByProp<Task> — works for any property
      const p = await ask("Filter by priority (high/medium/low): ") as Priority;
      const results = filterByProp(getTasks(), "priority", p);
      console.log(`Found ${results.length} task(s):`);
      results.forEach(t => console.log(`  - ${t.title}`));

    } else if (choice === "6") {
      // Generic sortByProp<Task> — works for any property
      const results = sortByProp(getTasks(), "createdAt");
      results.forEach(t => console.log(`  [${t.createdAt}] ${t.title}`));

    } else if (choice === "7") {
      listTasks();
      const id      = await ask("Find by ID: ");
      const found   = findByProp(getTasks(), "id", Number(id));
      console.log(found ? `Found: ${found.title} (${found.priority})` : "Not found");

    } else if (choice === "8") {
      showStats();

    } else if (choice === "9") {
      console.log("Bye!"); rl.close(); return;

    } else {
      console.log("Invalid choice.");
    }

  } catch (err) {
    // err is "unknown" in strict TS — we narrow it with instanceof
    if (err instanceof Error) console.log("Error:", err.message);
  }

  menu();
}

menu();
