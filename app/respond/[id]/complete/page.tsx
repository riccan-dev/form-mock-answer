import Link from 'next/link';
import { findFormById } from '@/lib/mockForms';

export default async function RespondCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = findFormById(Number(id));

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="fs-1 mb-3">✅</div>
          <h1 className="fs-4 fw-bold mb-2">回答を送信しました</h1>
          <p className="text-muted mb-4">
            {form ? `「${form.name}」への` : ''}ご協力ありがとうございました。
          </p>
          <Link href="/respond" className="btn btn-primary">
            一覧へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
