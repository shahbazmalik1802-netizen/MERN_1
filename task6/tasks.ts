
import * as fs from "fs";
import * as path from "path";
import { Task, Priority } from "./types";

const FILE = path.join(__dirname, "..", "tasks.json");

function load(): Task[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Task[];
}

function save(tasks: Task[]): void {  
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}
export function addTask(title: string, priority: Priority = Priority.Medium, assignedTo?: string): void {
  const tasks = load();
  const newTask: Task = {
    id:          Date.now(),
    title:       title.trim(),
    priority,
    completed:   false,
    createdAt:   new Date().toISOString().split("T")[0],
    assignedTo,                
  };
  tasks.push(newTask);
  save(tasks);
  console.log(`Added: "${newTask.title}" [${priority}]`);
}

export function removeTask(id: number): void {
  const tasks = load();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error(`No task with id ${id}`);
  const [removed] = tasks.splice(index, 1);
  save(tasks);
  console.log(`Removed: "${removed.title}"`);
}

export function completeTask(id: number): void {
  const tasks = load();
  const task  = tasks.find(t => t.id === id);
  if (!task) throw new Error(`No task with id ${id}`);
  task.completed = true;
  save(tasks);
  console.log(`Done: "${task.title}"`);
}

export function listTasks(): void {
  const tasks = load();
  if (tasks.length === 0) return console.log("No tasks yet!");
  tasks.forEach((t, i) => {
    const done = t.completed ? "✔" : "○";
    const who  = t.assignedTo ? ` → ${t.assignedTo}` : "";
    console.log(`  ${i + 1}. [${done}] ${t.title}  (${t.priority})${who}`);
  });
}

export function showStats(): void {
  const tasks = load();
  const done      = tasks.reduce((acc, t) => t.completed ? acc + 1 : acc, 0);
  const hasUrgent = tasks.some(t => t.priority === Priority.High && !t.completed);
  const allDone   = tasks.every(t => t.completed);
  console.log(`Total: ${tasks.length} | Done: ${done} | Urgent: ${hasUrgent} | All done: ${allDone}`);
}

export function getTasks(): Task[] {
  return load();
}
