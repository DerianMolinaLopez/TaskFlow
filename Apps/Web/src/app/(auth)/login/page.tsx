import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Iniciar sesión · TaskFlow" };

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
