import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskPriority, TaskStatus, priorityLabels, statusLabels } from "@/lib/types";

const statusStyles: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: "bg-muted text-muted-foreground",
  [TaskStatus.InProgress]: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  [TaskStatus.Done]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

const priorityStyles: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "border-border text-muted-foreground",
  [TaskPriority.Medium]: "border-amber-500/40 text-amber-700 dark:text-amber-300",
  [TaskPriority.High]: "border-orange-500/50 text-orange-700 dark:text-orange-300",
  [TaskPriority.Urgent]: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={cn(statusStyles[status])}>{statusLabels[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={cn(priorityStyles[priority])}>
      {priorityLabels[priority]}
    </Badge>
  );
}

export function ProjectDot({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2.5 shrink-0 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
}
