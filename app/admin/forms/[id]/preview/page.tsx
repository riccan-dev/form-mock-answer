import Link from 'next/link';
import { findFormById } from '@/lib/mockForms';

export default async function PreviewFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = findFormById(Number(id));

  if (!form) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">プレビュー (ID: {form.id})</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          一覧へ戻る
        </Link>
      </div>

      <div className="card-body">
        <dl className="row mb-0">
          <dt className="col-sm-3">フォーム名</dt>
          <dd className="col-sm-9">{form.name}</dd>

          <dt className="col-sm-3">公開状況</dt>
          <dd className="col-sm-9">{form.status}</dd>

          <dt className="col-sm-3">公開用URL</dt>
          <dd className="col-sm-9">
            <a href={form.url} target="_blank" rel="noopener noreferrer">
              {form.url}
            </a>
          </dd>

          <dt className="col-sm-3">更新日時</dt>
          <dd className="col-sm-9">
            {form.updatedAt}(by {form.updatedBy})
          </dd>
        </dl>
      </div>
    </>
  );
}
