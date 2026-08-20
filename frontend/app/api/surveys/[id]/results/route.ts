import { backendUrl, forwardedHeaders, withForwardedCookies } from '@/lib/backendProxy';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(backendUrl(`/api/surveys/${id}/results`), {
    method: 'GET',
    headers: forwardedHeaders(request),
    cache: 'no-store',
  });

  if (res.status === 404) {
    return new Response(null, { status: 404 });
  }

  const data = await res.json();
  return withForwardedCookies(res, Response.json(data, { status: res.status }));
}
