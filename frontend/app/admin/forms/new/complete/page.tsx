import Link from 'next/link';

export default function NewFormCompletePage() {
  return (
    <div className="card-body text-center py-5">
      <div className="fs-1 mb-3">✅</div>
      <h1 className="fs-4 fw-bold mb-2">アンケートを作成しました</h1>
      <p className="text-muted mb-4">新しいフォームが一覧に追加されました。</p>
      <Link href="/admin" className="btn btn-primary">
        一覧へ戻る
      </Link>
    </div>
  );
}
