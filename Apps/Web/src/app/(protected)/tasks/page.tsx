import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { TaskBrowser } from "@/components/tasks/task-browser";

export const metadata: Metadata = { title: "Tareas · TaskFlow" };

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tareas" description="Busca, filtra y actualiza todas tus tareas." />
      <TaskBrowser />
    </div>
  );
}
