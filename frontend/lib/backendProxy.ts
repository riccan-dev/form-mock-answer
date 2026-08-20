const API_BASE_URL = process.env.SURVEY_API_BASE_URL ?? 'http://localhost:8080';

export function backendUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

// ブラウザから来たセッションCookieをバックエンドへのfetchにも転記する
export function forwardedHeaders(request: Request, extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = { ...extra };
  const cookie = request.headers.get('cookie');
  if (cookie) headers.cookie = cookie;
  return headers;
}

// バックエンドのSet-Cookie(ログイン等でのセッション発行)をブラウザへの応答にも転記する
export function withForwardedCookies(backendRes: Response, frontRes: Response): Response {
  for (const cookie of backendRes.headers.getSetCookie()) {
    frontRes.headers.append('set-cookie', cookie);
  }
  return frontRes;
}
