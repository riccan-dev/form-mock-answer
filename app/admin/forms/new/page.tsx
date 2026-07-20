'use client';

import { useState } from 'react';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import QuestionBuilder from './_components/QuestionBuilder';
import type { Question } from '@/lib/questionTypes';
import { TEMPLATES, applyTemplate } from '@/lib/templates';

export default function NewFormPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [templateId, setTemplateId] = useState('');

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    if (id) {
      setQuestions(applyTemplate(id));
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">新規アンケート作成</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            キャンセル
          </Link>
          <Link href="/admin/forms/new/complete" className="btn btn-primary">
            保存
          </Link>
        </div>
      </div>

      <div className="card-body">
        <Form.Group className="mb-4" controlId="templateSelect">
          <Form.Label className="small text-muted">テンプレートから作成(任意)</Form.Label>
          <Form.Select value={templateId} onChange={(e) => handleTemplateChange(e.target.value)}>
            <option value="">テンプレートを使わない</option>
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Form.Select>
          {templateId && (
            <Form.Text className="text-muted">
              テンプレートの質問項目で下の質問リストが上書きされました。この後も自由に編集できます。
            </Form.Text>
          )}
        </Form.Group>

        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>フォーム名</Form.Label>
            <Form.Control type="text" placeholder="例: 顧客満足度調査" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMemo">
            <Form.Label>メモ</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="社内向けの補足メモ" />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formStatus">
            <Form.Label className="d-block">ステータス</Form.Label>
            <Form.Check inline label="下書き保存" name="status" type="radio" defaultChecked />
            <Form.Check inline label="このまま配信する" name="status" type="radio" />
          </Form.Group>
        </Form>

        <hr className="mb-4" />

        <QuestionBuilder questions={questions} onChange={setQuestions} />
      </div>
    </>
  );
}
