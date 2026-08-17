const API_BASE_URL = process.env.SURVEY_API_BASE_URL ?? 'http://localhost:8080';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${API_BASE_URL}/api/surveys/${id}/results`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (res.status === 404) {
    return new Response(null, { status: 404 });
  }

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
