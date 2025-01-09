import { api } from "@/trpc/server";

export async function GET() {
  const res = await api.module.getAllModules();
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
