import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Crear cuenta · TaskFlow" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[30rem] rounded-xl" />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
