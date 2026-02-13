export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: "Test route works", time: new Date().toISOString() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
