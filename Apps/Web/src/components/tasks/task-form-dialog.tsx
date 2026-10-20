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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectDot } from "@/components/tasks/task-badges";
import { notifyDataChanged } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { fromDateInputValue, toDateInputValue } from "@/lib/format";
import { TaskPriority, priorityLabels, type Project, type Task, type TaskInput } from "@/lib/types";

const NO_PROJECT = "none";

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  // Si se pasa, el diálogo edita esa tarea; si no, crea una nueva.
  task?: Task | null;
  defaultProjectId?: string;
};

export function TaskFormDialog({ open, onOpenChange, ...props }: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <TaskForm {...props} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({
  projects,
  task,
  defaultProjectId,
  onDone,
}: Omit<TaskFormDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<string>(String(task?.priority ?? TaskPriority.Medium));
  const [dueDate, setDueDate] = useState(toDateInputValue(task?.dueDate));
  const [projectId, setProjectId] = useState<string>(
    task ? (task.projectId ?? NO_PROJECT) : (defaultProjectId ?? NO_PROJECT),
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const priorityItems = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }));
  const projectItems = [
    { value: NO_PROJECT, label: "Sin proyecto" },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError("El título es obligatorio.");
      return;
    }

    const input: TaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      priority: Number(priority) as TaskPriority,
      dueDate: fromDateInputValue(dueDate),
      projectId: projectId === NO_PROJECT ? null : projectId,
    };

    setPending(true);
    try {
      if (isEdit) {
        await api.tasks.update(task.id, input);
        toast.success("Tarea actualizada.");
      } else {
        await api.tasks.create(input);
        toast.success("Tarea creada.");
      }
      notifyDataChanged();
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
        <DialogTitle>{isEdit ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Modifica los detalles de la tarea." : "Agrega una tarea a tu lista."}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field data-invalid={!!titleError || undefined}>
          <FieldLabel htmlFor="task-title">Título</FieldLabel>
          <Input
            id="task-title"
            value={title}
            maxLength={200}
            autoFocus
            aria-invalid={!!titleError || undefined}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(null);
            }}
            placeholder="Ej. Preparar la presentación"
          />
          {titleError && <FieldError>{titleError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="task-description">Descripción</FieldLabel>
          <Textarea
            id="task-description"
            value={description}
            maxLength={2000}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles opcionales"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Prioridad</FieldLabel>
            <Select
              items={priorityItems}
              value={priority}
              onValueChange={(value) => value && setPriority(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="task-due">Fecha de vencimiento</FieldLabel>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Proyecto</FieldLabel>
          <Select
            items={projectItems}
            value={projectId}
            onValueChange={(value) => value && setProjectId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PROJECT}>Sin proyecto</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <ProjectDot color={project.color} />
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>Cancelar</DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear tarea"}
        </Button>
      </DialogFooter>
    </form>
  );
}
