"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notifyDataChanged } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Project, ProjectInput } from "@/lib/types";

const PRESET_COLORS = [
  "#6366F1",
  "#0EA5E9",
  "#10B981",
  "#84CC16",
  "#F59E0B",
  "#F97316",
  "#EF4444",
  "#EC4899",
  "#A855F7",
  "#64748B",
];

type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSaved?: (project: Project) => void;
};

export function ProjectFormDialog({ open, onOpenChange, ...props }: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <ProjectForm {...props} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({
  project,
  onSaved,
  onDone,
}: Omit<ProjectFormDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) {
  const isEdit = !!project;
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [color, setColor] = useState(project?.color ?? PRESET_COLORS[0]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setNameError("El nombre es obligatorio.");
      return;
    }

    const input: ProjectInput = {
      name: name.trim(),
      description: description.trim() || null,
      color: color.toUpperCase(),
    };

    setPending(true);
    try {
      const saved = isEdit
        ? await api.projects.update(project.id, input)
        : await api.projects.create(input);
      toast.success(isEdit ? "Proyecto actualizado." : "Proyecto creado.");
      notifyDataChanged();
      onSaved?.(saved);
      onDone();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
        <DialogDescription>Agrupa tus tareas y sigue su avance.</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field data-invalid={!!nameError || undefined}>
          <FieldLabel htmlFor="project-name">Nombre</FieldLabel>
          <Input
            id="project-name"
            value={name}
            maxLength={150}
            autoFocus
            aria-invalid={!!nameError || undefined}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            placeholder="Ej. Lanzamiento web"
          />
          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="project-description">Descripción</FieldLabel>
          <Textarea
            id="project-description"
            value={description}
            maxLength={1000}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opcional"
          />
        </Field>

        <Field>
          <FieldLabel>Color</FieldLabel>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={`Color ${preset}`}
                aria-pressed={color.toUpperCase() === preset}
                onClick={() => setColor(preset)}
                className={cn(
                  "size-7 rounded-full ring-offset-2 ring-offset-background transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  color.toUpperCase() === preset && "ring-2 ring-foreground",
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
            <label className="relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed text-xs text-muted-foreground">
              +
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Color personalizado"
              />
            </label>
          </div>
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>Cancelar</DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear proyecto"}
        </Button>
      </DialogFooter>
    </form>
  );
}
