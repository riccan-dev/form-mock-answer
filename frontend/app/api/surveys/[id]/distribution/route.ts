import { backendUrl, forwardedHeaders, withForwardedCookies } from '@/lib/backendProxy';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();

  const res = await fetch(backendUrl(`/api/surveys/${id}/distribution`), {
    method: 'PUT',
    headers: forwardedHeaders(request, { 'Content-Type': 'application/json' }),
    body,
    cache: 'no-store',
  });

  if (res.status === 404) {
    return new Response(null, { status: 404 });
  }

  const data = await res.json();
  return withForwardedCookies(res, Response.json(data, { status: res.status }));
}
