'use client';

import { use } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { findFormById } from '@/lib/mockForms';

export default function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const form = findFormById(Number(id));

  if (!form) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">フォーム編集 (ID: {form.id})</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            キャンセル
          </Link>
          <Button variant="primary">保存</Button>
        </div>
      </div>

      <div className="card-body">
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>フォーム名</Form.Label>
            <Form.Control type="text" defaultValue={form.name} />
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label className="d-block">ステータス</Form.Label>
            <Form.Check
              inline
              label="下書き"
              name="status"
              type="radio"
              defaultChecked={form.status === '下書き'}
            />
            <Form.Check
              inline
              label="配信中"
              name="status"
              type="radio"
              defaultChecked={form.status === '配信中'}
            />
            <Form.Check
              inline
              label="回収終了"
              name="status"
              type="radio"
              defaultChecked={form.status === '回収終了'}
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
