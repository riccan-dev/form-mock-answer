import { backendUrl, forwardedHeaders, withForwardedCookies } from '@/lib/backendProxy';

export async function POST(request: Request) {
  const res = await fetch(backendUrl('/api/logout'), {
    method: 'POST',
    headers: forwardedHeaders(request),
    cache: 'no-store',
  });

  return withForwardedCookies(res, new Response(null, { status: res.status }));
}
