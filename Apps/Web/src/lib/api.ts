import type {
  PagedResponse,
  Project,
  ProjectInput,
  ProjectSummary,
  Task,
  TaskInput,
  TaskQuery,
  TaskStatus,
} from "@/lib/types";

// Cliente del navegador. Todas las rutas pasan por /api/backend,
// que agrega el JWT de la cookie de sesión.

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// La API responde { error } en errores controlados y ProblemDetails
// ({ title, errors }) cuando falla la validación del modelo.
export function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const data = body as { error?: string; title?: string; errors?: Record<string, string[]> };
    if (data.error) return data.error;
    if (data.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    if (data.title) return data.title;
  }
  if (status >= 500) return "Ocurrió un error en el servidor. Revisa los datos e intenta de nuevo.";
  return "No se pudo completar la solicitud.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path}`, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("No hay conexión con el servidor.", 0);
  }

  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.assign(`/login?expired=1&next=${next}`);
    throw new ApiError("Tu sesión expiró.", 401);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(body, response.status), response.status);
  }

  return body as T;
}

function toQueryString(query: TaskQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

const json = (data: unknown) => JSON.stringify(data);

export const api = {
  tasks: {
    list: (query: TaskQuery = {}) => request<PagedResponse<Task>>(`tasks${toQueryString(query)}`),
    get: (id: string) => request<Task>(`tasks/${id}`),
    create: (input: TaskInput) => request<Task>("tasks", { method: "POST", body: json(input) }),
    update: (id: string, input: TaskInput) =>
      request<Task>(`tasks/${id}`, { method: "PUT", body: json(input) }),
    changeStatus: (id: string, status: TaskStatus) =>
      request<Task>(`tasks/${id}/status`, { method: "PATCH", body: json({ status }) }),
    remove: (id: string) => request<void>(`tasks/${id}`, { method: "DELETE" }),
  },
  projects: {
    list: () => request<Project[]>("projects"),
    get: (id: string) => request<Project>(`projects/${id}`),
    create: (input: ProjectInput) =>
      request<Project>("projects", { method: "POST", body: json(input) }),
    update: (id: string, input: ProjectInput) =>
      request<Project>(`projects/${id}`, { method: "PUT", body: json(input) }),
    remove: (id: string) => request<void>(`projects/${id}`, { method: "DELETE" }),
    summary: (id: string) => request<ProjectSummary>(`projects/${id}/summary`),
    tasks: (id: string, query: TaskQuery = {}) =>
      request<PagedResponse<Task>>(`projects/${id}/tasks${toQueryString(query)}`),
  },
};
