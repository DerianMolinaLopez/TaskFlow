"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction, registerAction, type AuthFormState } from "./actions";

type Mode = "login" | "register";

const copy: Record<Mode, { title: string; description: string; submit: string }> = {
  login: {
    title: "Inicia sesión",
    description: "Ingresa con tu correo para ver tus tareas y proyectos.",
    submit: "Iniciar sesión",
  },
  register: {
    title: "Crea tu cuenta",
    description: "Empieza a organizar tus tareas en minutos.",
    submit: "Crear cuenta",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const expired = searchParams.get("expired") === "1";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    mode === "login" ? loginAction : registerAction,
    {},
  );
  const text = copy[mode];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <input type="hidden" name="next" value={next} />
          <FieldGroup>
            {expired && !state.error && (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Tu sesión expiró. Vuelve a iniciar sesión.
              </p>
            )}
            {state.error && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                defaultValue={state.email}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "register" ? 8 : undefined}
                required
              />
              {mode === "register" && (
                <FieldDescription>
                  Mínimo 8 caracteres, con mayúscula, minúscula, número y un símbolo.
                </FieldDescription>
              )}
            </Field>
            {mode === "register" && (
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </Field>
            )}
            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending ? "Procesando…" : text.submit}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <Link href="/register" className="text-foreground underline underline-offset-4">
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-foreground underline underline-offset-4">
                    Inicia sesión
                  </Link>
                </>
              )}
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
