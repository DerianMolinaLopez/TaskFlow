import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects/projects-view";

export const metadata: Metadata = { title: "Proyectos · TaskFlow" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
