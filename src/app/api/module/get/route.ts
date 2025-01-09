import type { NextRequest } from "next/server";

import type { ModuleCode } from "@/types/primitives/module";
import { api } from "@/trpc/server";

export async function GET(req: NextRequest) {
  const moduleCode = req.nextUrl.searchParams.get(
    "moduleCode",
  ) as ModuleCode | null;
  if (!moduleCode) {
    return new Response("Missing moduleCode query parameter", { status: 400 });
  }
  const res = await api.module.getModule({ moduleCode });
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
