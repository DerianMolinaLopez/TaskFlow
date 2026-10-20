import type { NextRequest } from "next/server";
import { API_URL, SESSION_COOKIE } from "@/lib/session";

// Backend-for-frontend: reenvía las peticiones del navegador a la API de .NET
// agregando el JWT de la cookie httpOnly. Así se evita exponer el token y
// configurar CORS en la API.

const ALLOWED_ROOTS = new Set(["tasks", "projects"]);

async function forward(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;

  if (!ALLOWED_ROOTS.has(path[0])) {
    return Response.json({ error: "Ruta no permitida." }, { status: 404 });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return Response.json({ error: "Tu sesión expiró." }, { status: 401 });
  }

  const target = `${API_URL}/api/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const hasBody = request.method !== "GET" && request.method !== "DELETE";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "No se pudo conectar con la API. Verifica que esté en ejecución." },
      { status: 502 },
    );
  }

  const body = upstream.status === 204 ? null : await upstream.text();
  const response = new Response(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });

  if (upstream.status === 401) {
    response.headers.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    );
  }

  return response;
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
