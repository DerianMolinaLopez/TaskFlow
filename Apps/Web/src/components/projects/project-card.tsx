"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Edit02Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectProgress } from "@/components/projects/project-progress";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const summary = useApi(() => api.projects.summary(project.id), [project.id]);

  return (
    <Card className="relative transition-shadow hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: project.color }} />
      <CardHeader>
        <CardTitle className="truncate">
          <Link href={`/projects/${project.id}`} className="after:absolute after:inset-0">
            {project.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">
          {project.description ?? "Sin descripción"}
        </CardDescription>
        <CardAction className="relative z-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Acciones del proyecto" />}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        {summary.data ? (
          <ProjectProgress summary={summary.data} color={project.color} />
        ) : summary.error ? (
          <p className="text-xs text-destructive">No se pudo cargar el avance.</p>
        ) : (
          <Skeleton className="h-9 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
