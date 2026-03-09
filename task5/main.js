
import { loadTasks }                          from "./utils.js";
import { render, setupForm, setupDelegation,
         setupResize }                        from "./app.js";

const tasks = loadTasks();

render(tasks,
  document.querySelector("#taskList"),
  document.querySelector("#taskCount")
);

setupForm(
  document.querySelector("#taskForm"),
  {
    nameInput:    document.querySelector("#taskName"),
    emailInput:   document.querySelector("#taskEmail"),
    prioritySel:  document.querySelector("#taskPriority"),
    dateInput:    document.querySelector("#taskDate"),
    nameHint:     document.querySelector("#nameHint"),
    emailHint:    document.querySelector("#emailHint"),
    priorityHint: document.querySelector("#priorityHint"),
    dateHint:     document.querySelector("#dateHint"),
  },
  tasks,
  document.querySelector("#taskList"),
  document.querySelector("#taskCount")
);

setupDelegation(
  document.querySelector("#taskList"),
  tasks,
  document.querySelector("#taskCount")
);

setupResize(document.querySelector("#resizeBar"));
