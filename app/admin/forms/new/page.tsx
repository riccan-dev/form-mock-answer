'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import QuestionBuilder from './_components/QuestionBuilder';
import type { Question } from '@/lib/questionTypes';
import { TEMPLATES, applyTemplate } from '@/lib/templates';

type SurveyStatus = 'draft' | 'published';

export default function NewFormPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<SurveyStatus>('draft');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    if (id) {
      setQuestions(applyTemplate(id));
    }
  }

  function handleSave() {
    setErrors([]);
    startTransition(async () => {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status,
          questions: questions.map((q) => ({
            type: q.type,
            label: q.label,
            options: q.options,
            matrixRows: q.matrixRows,
            scaleMax: q.scaleMax,
            scaleMinLabel: q.scaleMinLabel,
            scaleMaxLabel: q.scaleMaxLabel,
            allowOther: q.allowOther,
          })),
        }),
      });

      if (res.status === 201) {
        router.push('/admin/forms/new/complete');
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors);
      } else {
        throw new Error(`アンケートの作成に失敗しました (status: ${res.status})`);
      }
    });
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">新規アンケート作成</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            キャンセル
          </Link>
          <Button variant="primary" onClick={handleSave} disabled={isPending}>
            {isPending ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <div className="card-body">
        {errors.length > 0 && (
          <Alert variant="danger">
            <Alert.Heading className="fs-6">入力内容を確認してください</Alert.Heading>
            <ul className="mb-0">
              {errors.map((error, i) => (
                <li key={i}>
                  {error.field}: {error.message}
                </li>
              ))}
            </ul>
          </Alert>
        )}

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
            <Form.Control
              type="text"
              placeholder="例: 顧客満足度調査"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMemo">
            <Form.Label>メモ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="社内向けの補足メモ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formStatus">
            <Form.Label className="d-block">ステータス</Form.Label>
            <Form.Check
              inline
              label="下書き保存"
              name="status"
              type="radio"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
            />
            <Form.Check
              inline
              label="このまま配信する"
              name="status"
              type="radio"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
            />
          </Form.Group>
        </Form>

        <hr className="mb-4" />

        <QuestionBuilder questions={questions} onChange={setQuestions} />
      </div>
    </>
  );
}
