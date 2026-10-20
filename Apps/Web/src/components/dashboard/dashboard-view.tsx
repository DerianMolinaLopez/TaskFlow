"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CircleCheckIcon,
  Clock01Icon,
  FolderKanbanIcon,
  ListChecksIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { ProjectProgress } from "@/components/projects/project-progress";
import { PriorityBadge, ProjectDot, StatusBadge } from "@/components/tasks/task-badges";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TaskStatus, type Project } from "@/lib/types";

async function loadStats() {
  const count = (status?: TaskStatus) =>
    api.tasks.list({ pageSize: 1, status }).then((r) => r.totalCount);
  const [total, todo, inProgress, done] = await Promise.all([
    count(),
    count(TaskStatus.Todo),
    count(TaskStatus.InProgress),
    count(TaskStatus.Done),
  ]);
  return { total, todo, inProgress, done };
}

async function loadUpcoming() {
  const page = await api.tasks.list({ pageSize: 100, sortBy: "dueDate", sortDirection: "asc" });
  return page.items.filter((t) => t.status !== TaskStatus.Done && t.dueDate).slice(0, 6);
}

export function DashboardView() {
  const stats = useApi(loadStats, []);
  const upcoming = useApi(loadUpcoming, []);
  const projects = useApi(() => api.projects.list(), []);
  const [formOpen, setFormOpen] = useState(false);

  const projectsById = new Map((projects.data ?? []).map((p) => [p.id, p]));
  const completion =
    stats.data && stats.data.total > 0 ? Math.round((stats.data.done / stats.data.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Un vistazo rápido a tus tareas y proyectos.">
        <Button onClick={() => setFormOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Nueva tarea
        </Button>
      </PageHeader>

      {stats.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {stats.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <StatCard
          label="Total de tareas"
          value={stats.data?.total}
          footer="Registradas en tu cuenta"
          icon={ListChecksIcon}
          color="#A855F7"
          href="/tasks"
        />
        <StatCard
          label="Completadas"
          value={stats.data?.done}
          footer={stats.data ? `${completion}% del total` : "—"}
          icon={CircleCheckIcon}
          color="#10B981"
          href="/tasks"
        />
        <StatCard
          label="Pendientes"
          value={stats.data ? stats.data.todo + stats.data.inProgress : undefined}
          footer={stats.data ? `${stats.data.inProgress} en progreso` : "—"}
          icon={Clock01Icon}
          color="#F59E0B"
          href="/tasks"
        />
        <StatCard
          label="Proyectos"
          value={projects.data?.length}
          footer="Proyectos creados"
          icon={FolderKanbanIcon}
          color="#0EA5E9"
          href="/projects"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Próximas a vencer</CardTitle>
            <CardDescription>Tareas pendientes ordenadas por fecha de vencimiento.</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/tasks" />}
              >
                Ver todas
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            {!upcoming.data ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-1.5 h-9" />)
            ) : upcoming.data.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay tareas pendientes con fecha de vencimiento.
              </p>
            ) : (
              <ul className="divide-y">
                {upcoming.data.map((task) => {
                  const project = task.projectId ? projectsById.get(task.projectId) : undefined;
                  const overdue = isOverdue(task.dueDate, false);
                  return (
                    <li key={task.id} className="flex items-center gap-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{task.title}</p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {project && (
                            <>
                              <ProjectDot color={project.color} className="size-2" />
                              <span className="truncate">{project.name}</span>
                              <span>·</span>
                            </>
                          )}
                          <span className={cn(overdue && "font-medium text-destructive")}>
                            {overdue ? "Venció el " : "Vence el "}
                            {formatDate(task.dueDate)}
                          </span>
                        </p>
                      </div>
                      <PriorityBadge priority={task.priority} />
                      <span className="hidden sm:inline-flex">
                        <StatusBadge status={task.status} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Avance por proyecto</CardTitle>
            <CardDescription>Porcentaje de tareas completadas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {!projects.data ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)
            ) : projects.data.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center text-sm text-muted-foreground">
                Aún no tienes proyectos.
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/projects" />}
                >
                  Crear proyecto
                </Button>
              </div>
            ) : (
              projects.data
                .slice(0, 6)
                .map((project) => <ProjectRow key={project.id} project={project} />)
            )}
          </CardContent>
        </Card>
      </div>

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} projects={projects.data ?? []} />
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const summary = useApi(() => api.projects.summary(project.id), [project.id]);
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-1.5 rounded-lg hover:opacity-80"
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <ProjectDot color={project.color} />
        <span className="truncate">{project.name}</span>
      </span>
      {summary.data ? (
        <ProjectProgress summary={summary.data} color={project.color} />
      ) : (
        <Skeleton className="h-6" />
      )}
    </Link>
  );
}

function StatCard({
  label,
  value,
  footer,
  icon,
  color,
  href,
}: {
  label: string;
  value: number | undefined;
  footer: string;
  icon: typeof ListChecksIcon;
  color: string;
  href: string;
}) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardDescription>
          <Link href={href} className="after:absolute after:inset-0">
            {label}
          </Link>
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value === undefined ? <Skeleton className="h-9 w-16" /> : value}
        </CardTitle>
        <CardAction>
          <HugeiconsIcon icon={icon} strokeWidth={2} color={color} />
        </CardAction>
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground">{footer}</CardFooter>
    </Card>
  );
}
