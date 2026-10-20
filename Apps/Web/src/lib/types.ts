// Tipos que reflejan los DTOs de Services.Application.
// La API serializa los enums como números.

export const TaskStatus = {
  Todo: 1,
  InProgress: 2,
  Done: 3,
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const statusLabels: Record<TaskStatus, string> = {
  1: "Por hacer",
  2: "En progreso",
  3: "Completada",
};

export const priorityLabels: Record<TaskPriority, string> = {
  1: "Baja",
  2: "Media",
  3: "Alta",
  4: "Urgente",
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = {
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
};

export type TaskSortBy = "createdAt" | "title" | "dueDate" | "priority" | "status";

export type TaskQuery = {
  page?: number;
  pageSize?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: TaskSortBy;
  sortDirection?: "asc" | "desc";
};

export type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  name: string;
  description: string | null;
  color: string;
};

export type ProjectSummary = {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progressPercentage: number;
};

export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
};
