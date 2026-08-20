import { backendUrl, forwardedHeaders } from '@/lib/backendProxy';

export async function GET(request: Request) {
  const res = await fetch(backendUrl('/api/me'), {
    method: 'GET',
    headers: forwardedHeaders(request),
    cache: 'no-store',
  });

  if (res.status === 401) {
    return new Response(null, { status: 401 });
  }

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
