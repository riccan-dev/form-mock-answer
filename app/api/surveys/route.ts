const API_BASE_URL = process.env.SURVEY_API_BASE_URL ?? 'http://localhost:8080';

export async function POST(request: Request) {
  const body = await request.text();

  const res = await fetch(`${API_BASE_URL}/api/surveys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    cache: 'no-store',
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
