import { backendUrl, forwardedHeaders, withForwardedCookies } from '@/lib/backendProxy';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();

  const res = await fetch(backendUrl(`/api/surveys/${id}/answers`), {
    method: 'POST',
    headers: forwardedHeaders(request, { 'Content-Type': 'application/json' }),
    body,
    cache: 'no-store',
  });

  if (res.status === 401) {
    return withForwardedCookies(res, new Response(null, { status: 401 }));
  }

  const data = await res.json();
  return withForwardedCookies(res, Response.json(data, { status: res.status }));
}
