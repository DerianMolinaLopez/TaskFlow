"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FolderKanbanIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { notifyDataChanged, useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

export function ProjectsView() {
  const projects = useApi(() => api.projects.list(), []);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Proyectos"
        description="Agrupa tus tareas y revisa el avance de cada proyecto."
      >
        <Button onClick={openCreate}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Nuevo proyecto
        </Button>
      </PageHeader>

      {projects.error && !projects.data ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-destructive">{projects.error.message}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={projects.reload}>
            Reintentar
          </Button>
        </div>
      ) : !projects.data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : projects.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon icon={FolderKanbanIcon} strokeWidth={2} className="size-6" />
          </div>
          <div>
            <p className="font-medium">Aún no tienes proyectos</p>
            <p className="text-sm text-muted-foreground">
              Crea uno para agrupar tus tareas y medir su avance.
            </p>
          </div>
          <Button onClick={openCreate}>Crear proyecto</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setEditing(project);
                setFormOpen(true);
              }}
              onDelete={() => setDeleting(project)}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar proyecto?"
        description={
          <>
            Se eliminará <strong>{deleting?.name}</strong>. Solo se pueden eliminar proyectos sin
            tareas asociadas.
          </>
        }
        onConfirm={async () => {
          if (!deleting) return;
          await api.projects.remove(deleting.id);
          toast.success("Proyecto eliminado.");
          notifyDataChanged();
        }}
      />
    </div>
  );
}
