'use client';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function NewFormPage() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">新規アンケート作成</h1>
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
            <Form.Control type="text" placeholder="例: 顧客満足度調査" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMemo">
            <Form.Label>メモ</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="社内向けの補足メモ" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formType">
            <Form.Label>フォームタイプ</Form.Label>
            <Form.Select>
              <option>新規・更新登録フォーム</option>
              <option>アンケートフォーム</option>
              <option>ウェビナーアンケート</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label className="d-block">公開状況</Form.Label>
            <Form.Check inline label="公開" name="status" type="radio" defaultChecked />
            <Form.Check inline label="非公開" name="status" type="radio" />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
