'use client';

import { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import QuestionBuilder from '../../new/_components/QuestionBuilder';
import type { Question } from '@/lib/questionTypes';
import { mapSurveyResponseToFormRow, type SurveyResponse } from '@/lib/surveyApi';

export default function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch(`/api/surveys/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SurveyResponse | null) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        const mapped = mapSurveyResponseToFormRow(data);
        setTitle(mapped.name);
        setDescription(data.description ?? '');
        setQuestions(mapped.questions);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="card-body">読み込み中...</div>;
  }

  if (notFound) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  function handleSave() {
    setErrors([]);
    startTransition(async () => {
      const res = await fetch(`/api/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
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

      if (res.status === 200) {
        router.push('/admin');
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors);
      } else if (res.status === 404) {
        setNotFound(true);
      } else {
        throw new Error(`アンケートの更新に失敗しました (status: ${res.status})`);
      }
    });
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">アンケート編集</h1>
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

          <Form.Group className="mb-4" controlId="formMemo">
            <Form.Label>メモ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="社内向けの補足メモ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>

        <hr className="mb-4" />

        <QuestionBuilder questions={questions} onChange={setQuestions} />
      </div>
    </>
  );
}
