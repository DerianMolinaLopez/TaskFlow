const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string | null | undefined): string {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

// <input type="date"> trabaja con fechas locales (yyyy-mm-dd).
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Npgsql solo acepta DateTimeOffset en UTC, así que se envía en ISO con "Z".
// Se usa el final del día local para que la tarea venza ese mismo día.
export function fromDateInputValue(value: string): string | null {
  if (!value) return null;
  return new Date(`${value}T23:59:59`).toISOString();
}

export function isOverdue(dueDate: string | null, done: boolean): boolean {
  return !done && !!dueDate && new Date(dueDate).getTime() < Date.now();
}
