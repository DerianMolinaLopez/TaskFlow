"use server";

import { redirect } from "next/navigation";
import { extractErrorMessage } from "@/lib/api";
import { API_URL, clearSession, setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export type AuthFormState = {
  error?: string;
  email?: string;
};

// Solo se permiten redirecciones internas para evitar open redirects.
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

async function authenticate(
  endpoint: "login" | "register",
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña.", email };
  }

  if (endpoint === "register" && password !== formData.get("confirmPassword")) {
    return { error: "Las contraseñas no coinciden.", email };
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { error: "No se pudo conectar con la API. Verifica que esté en ejecución.", email };
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    return { error: extractErrorMessage(body, response.status), email };
  }

  const auth = body as AuthResponse;
  await setSession(auth.accessToken, auth.expiresAt);
  redirect(safeNext(formData.get("next")));
}

export async function loginAction(_: AuthFormState, formData: FormData) {
  return authenticate("login", formData);
}

export async function registerAction(_: AuthFormState, formData: FormData) {
  return authenticate("register", formData);
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
