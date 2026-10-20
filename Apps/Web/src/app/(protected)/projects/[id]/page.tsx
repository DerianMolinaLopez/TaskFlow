import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetail } from "@/components/projects/project-detail";

export const metadata: Metadata = { title: "Proyecto · TaskFlow" };

// params es un dato de tiempo de petición, así que se resuelve dentro del Suspense.
async function ProjectDetailLoader({ params }: Pick<PageProps<"/projects/[id]">, "params">) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}

export default function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <ProjectDetailLoader params={params} />
    </Suspense>
  );
}
