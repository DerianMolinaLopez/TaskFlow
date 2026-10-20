import type { ProjectSummary } from "@/lib/types";

export function ProjectProgress({ summary, color }: { summary: ProjectSummary; color: string }) {
  const percentage = Math.round(summary.progressPercentage);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <span>
          {summary.completedTasks} de {summary.totalTasks}{" "}
          {summary.totalTasks === 1 ? "tarea completada" : "tareas completadas"}
        </span>
        <span className="font-medium text-foreground tabular-nums">{percentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label={`Avance de ${summary.projectName}`}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
