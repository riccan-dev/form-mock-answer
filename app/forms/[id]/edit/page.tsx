'use client';

import { use } from 'react';
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
          <Button as="a" href="/" variant="outline-secondary">
            キャンセル
          </Button>
          <Button variant="primary">保存</Button>
        </div>
      </div>

      <div className="card-body">
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>フォーム名</Form.Label>
            <Form.Control type="text" defaultValue={form.name} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formType">
            <Form.Label>フォームタイプ</Form.Label>
            <Form.Select defaultValue={form.type}>
              <option>新規・更新登録フォーム</option>
              <option>アンケートフォーム</option>
              <option>ウェビナーアンケート</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label className="d-block">公開状況</Form.Label>
            <Form.Check
              inline
              label="公開"
              name="status"
              type="radio"
              defaultChecked={form.status === '公開'}
            />
            <Form.Check
              inline
              label="非公開"
              name="status"
              type="radio"
              defaultChecked={form.status === '非公開'}
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
