"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Pagination } from "@/components/pagination";
import { PriorityBadge, ProjectDot } from "@/components/tasks/task-badges";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { notifyDataChanged, useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  TaskStatus,
  priorityLabels,
  statusLabels,
  type Task,
  type TaskQuery,
  type TaskSortBy,
} from "@/lib/types";

const ALL = "all";
const PAGE_SIZE = 10;

const sortItems: { value: string; label: string }[] = [
  { value: "createdAt:desc", label: "Más recientes" },
  { value: "createdAt:asc", label: "Más antiguas" },
  { value: "dueDate:asc", label: "Vencimiento próximo" },
  { value: "dueDate:desc", label: "Vencimiento lejano" },
  { value: "priority:desc", label: "Mayor prioridad" },
  { value: "priority:asc", label: "Menor prioridad" },
  { value: "title:asc", label: "Título (A-Z)" },
  { value: "title:desc", label: "Título (Z-A)" },
  { value: "status:asc", label: "Estado" },
];

const statusFilterItems = [
  { value: ALL, label: "Todos los estados" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
];

const priorityFilterItems = [
  { value: ALL, label: "Todas las prioridades" },
  ...Object.entries(priorityLabels).map(([value, label]) => ({ value, label })),
];

const statusItems = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Listado de tareas con búsqueda, filtros, orden, paginación y acciones.
// Con projectId muestra solo las tareas de ese proyecto.
export function TaskBrowser({ projectId }: { projectId?: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [sort, setSort] = useState(sortItems[0].value);
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const debouncedSearch = useDebounced(search.trim());

  // Cualquier cambio de filtro regresa a la primera página.
  useEffect(() => setPage(1), [debouncedSearch]);
  const resetting = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const query: TaskQuery = useMemo(() => {
    const [sortBy, sortDirection] = sort.split(":") as [TaskSortBy, "asc" | "desc"];
    return {
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status === ALL ? undefined : (Number(status) as TaskStatus),
      priority: priority === ALL ? undefined : (Number(priority) as Task["priority"]),
      sortBy,
      sortDirection,
    };
  }, [page, debouncedSearch, status, priority, sort]);

  const tasks = useApi(
    () => (projectId ? api.projects.tasks(projectId, query) : api.tasks.list(query)),
    [projectId, query],
  );
  const projects = useApi(() => api.projects.list(), []);

  const projectsById = useMemo(
    () => new Map((projects.data ?? []).map((p) => [p.id, p])),
    [projects.data],
  );

  const hasFilters = !!debouncedSearch || status !== ALL || priority !== ALL;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormOpen(true);
  }

  async function changeStatus(task: Task, value: string) {
    const next = Number(value) as TaskStatus;
    if (next === task.status) return;
    try {
      await api.tasks.changeStatus(task.id, next);
      toast.success(`Tarea marcada como "${statusLabels[next]}".`);
      notifyDataChanged();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título…"
            maxLength={200}
            className="pl-8"
            aria-label="Buscar tareas"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <FilterSelect
            items={statusFilterItems}
            value={status}
            onChange={resetting(setStatus)}
            label="Estado"
          />
          <FilterSelect
            items={priorityFilterItems}
            value={priority}
            onChange={resetting(setPriority)}
            label="Prioridad"
          />
          <FilterSelect
            items={sortItems}
            value={sort}
            onChange={resetting(setSort)}
            label="Ordenar por"
          />
          <Button onClick={openCreate}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
            Nueva tarea
          </Button>
        </div>
      </div>

      {tasks.error && tasks.data && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {tasks.error.message}
          <Button variant="outline" size="sm" onClick={tasks.reload}>
            Reintentar
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-4">Tarea</TableHead>
              {!projectId && <TableHead className="hidden md:table-cell">Proyecto</TableHead>}
              <TableHead>Prioridad</TableHead>
              <TableHead className="hidden sm:table-cell">Vence</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={cn(tasks.loading && tasks.data && "opacity-60 transition-opacity")}>
            {tasks.error && !tasks.data ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <p className="text-destructive">{tasks.error.message}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={tasks.reload}>
                    Reintentar
                  </Button>
                </TableCell>
              </TableRow>
            ) : !tasks.data ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="px-4">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : tasks.data.items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  {hasFilters ? (
                    "Ninguna tarea coincide con los filtros."
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span>Todavía no hay tareas.</span>
                      <Button size="sm" onClick={openCreate}>
                        Crear la primera
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              tasks.data.items.map((task) => {
                const project = task.projectId ? projectsById.get(task.projectId) : undefined;
                const done = task.status === TaskStatus.Done;
                const overdue = isOverdue(task.dueDate, done);
                return (
                  <TableRow key={task.id}>
                    <TableCell className="max-w-[16rem] pl-4 whitespace-normal">
                      <button
                        type="button"
                        onClick={() => openEdit(task)}
                        className={cn(
                          "text-left font-medium hover:underline",
                          done && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </button>
                      {task.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </TableCell>
                    {!projectId && (
                      <TableCell className="hidden md:table-cell">
                        {project ? (
                          <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex items-center gap-2 hover:underline"
                          >
                            <ProjectDot color={project.color} />
                            <span className="max-w-[10rem] truncate">{project.name}</span>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <PriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell
                      className={cn(
                        "hidden sm:table-cell",
                        overdue && "font-medium text-destructive",
                      )}
                    >
                      {formatDate(task.dueDate)}
                      {overdue && <span className="sr-only"> (vencida)</span>}
                    </TableCell>
                    <TableCell>
                      <Select
                        items={statusItems}
                        value={String(task.status)}
                        onValueChange={(value) => value && changeStatus(task, value)}
                      >
                        <SelectTrigger size="sm" className="w-32" aria-label="Cambiar estado">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" aria-label="Acciones" />}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(task)}>
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleting(task)}>
                            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {tasks.data && (
        <Pagination
          page={tasks.data.page}
          totalPages={tasks.data.totalPages}
          totalCount={tasks.data.totalCount}
          pageSize={tasks.data.pageSize}
          onPageChange={setPage}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        projects={projects.data ?? []}
        task={editing}
        defaultProjectId={projectId}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar tarea?"
        description={
          <>
            Se eliminará <strong>{deleting?.title}</strong>. Esta acción no se puede deshacer.
          </>
        }
        onConfirm={async () => {
          if (!deleting) return;
          await api.tasks.remove(deleting.id);
          toast.success("Tarea eliminada.");
          // Si era la última de la página, retrocede una.
          if (tasks.data && tasks.data.items.length === 1 && page > 1) setPage(page - 1);
          notifyDataChanged();
        }}
      />
    </div>
  );
}

function FilterSelect({
  items,
  value,
  onChange,
  label,
}: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <Select items={items} value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="w-full sm:w-44" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
