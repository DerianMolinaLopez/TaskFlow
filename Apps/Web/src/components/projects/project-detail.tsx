"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Delete02Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ProjectProgress } from "@/components/projects/project-progress";
import { ProjectDot } from "@/components/tasks/task-badges";
import { TaskBrowser } from "@/components/tasks/task-browser";
import { useApi } from "@/hooks/use-api";
import { ApiError, api } from "@/lib/api";

export function ProjectDetail({ id }: { id: string }) {
  const router = useRouter();
  const project = useApi(() => api.projects.get(id), [id]);
  const summary = useApi(() => api.projects.summary(id), [id]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (project.error && !project.data) {
    const notFound = project.error instanceof ApiError && project.error.status === 404;
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-medium">
          {notFound ? "Este proyecto no existe." : project.error.message}
        </p>
        <Button variant="outline" nativeButton={false} render={<Link href="/projects" />}>
          Volver a proyectos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
        Proyectos
      </Link>

      {project.data ? (
        <PageHeader
          title={
            <span className="flex items-center gap-2">
              <ProjectDot color={project.data.color} className="size-3" />
              <span className="truncate">{project.data.name}</span>
            </span>
          }
          description={project.data.description ?? undefined}
        >
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} data-icon="inline-start" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
            Eliminar
          </Button>
        </PageHeader>
      ) : (
        <Skeleton className="h-12 w-72" />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card size="sm" className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Avance</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.data && project.data ? (
              <ProjectProgress summary={summary.data} color={project.data.color} />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Completadas" value={summary.data?.completedTasks} />
          <Stat label="Pendientes" value={summary.data?.pendingTasks} />
        </div>
      </div>

      <TaskBrowser projectId={id} />

      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project.data} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="¿Eliminar proyecto?"
        description="Solo se pueden eliminar proyectos sin tareas asociadas. Esta acción no se puede deshacer."
        onConfirm={async () => {
          await api.projects.remove(id);
          toast.success("Proyecto eliminado.");
          router.push("/projects");
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | undefined }) {
  return (
    <Card size="sm">
      <CardHeader>
        <span className="text-xs text-muted-foreground">{label}</span>
        <CardTitle className="text-2xl tabular-nums">
          {value === undefined ? <Skeleton className="h-7 w-10" /> : value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
