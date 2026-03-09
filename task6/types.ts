
export enum Priority {
  High   = "high",
  Medium = "medium",
  Low    = "low",
}
export interface Task {
  id:          number;
  title:       string;
  priority:    Priority;
  completed:   boolean;
  createdAt:   string;
  assignedTo?: string;    
}

export interface User {
  id:    number;
  name:  string;
  email: string;
}
