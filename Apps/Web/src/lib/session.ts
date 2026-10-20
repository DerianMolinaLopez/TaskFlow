import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";

// El JWT vive en una cookie httpOnly: el navegador nunca lo ve desde JavaScript
// y todas las llamadas a la API pasan por el route handler /api/backend.
export const SESSION_COOKIE = "tf_token";

export const API_URL = process.env.API_URL ?? "http://localhost:5020";

export type SessionUser = {
  id: string;
  email: string;
};

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setSession(token: string, expiresAt: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// Solo decodifica el payload para mostrar datos en la interfaz.
// La firma la valida la API en cada petición.
export function decodeToken(token: string): (SessionUser & { exp: number }) | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    return { id: payload.sub, email: payload.email ?? "", exp: payload.exp };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  // Marca la lectura como de tiempo de petición antes de usar Date.now().
  await connection();
  const token = await getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded || decoded.exp * 1000 <= Date.now()) return null;
  return { id: decoded.id, email: decoded.email };
}
