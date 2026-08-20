'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { isPastDue, type FormRow } from '@/lib/mockForms';
import type { Answers, AnswerValue } from '@/lib/mockForms';
import { mapSurveyResponseToFormRow, type SurveyResponse } from '@/lib/surveyApi';
import { useAuth } from '@/lib/AuthContext';
import QuestionAnswerField from './_components/QuestionAnswerField';

function draftKey(id: string) {
  return `survey-draft-${id}`;
}

export default function RespondFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [form, setForm] = useState<FormRow | null | undefined>(undefined);
  const [answers, setAnswers] = useState<Answers>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetch(`/api/surveys/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SurveyResponse | null) => {
        setForm(data ? mapSurveyResponseToFormRow(data) : null);
      })
      .catch(() => setForm(null));

    const raw = window.localStorage.getItem(draftKey(id));
    if (raw) {
      setAnswers(JSON.parse(raw));
    }
  }, [id]);

  if (form === undefined || isAuthLoading) {
    return <div className="card-body">読み込み中...</div>;
  }

  if (!form) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  if (!user) {
    return (
      <div className="card-body">
        回答するには<Link href="/login">ログイン</Link>してください。
      </div>
    );
  }

  if (form.status === '回収終了' || isPastDue(form)) {
    return (
      <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            このアンケートは回答受付を終了しています。
          </div>
        </div>
      </div>
    );
  }

  function handleAnswerChange(key: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveDraft() {
    window.localStorage.setItem(draftKey(id), JSON.stringify(answers));
    setSavedAt(
      new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    );
  }

  function handleSubmit() {
    setSubmitError(false);
    setIsSubmitting(true);

    const payload = {
      answers: Object.fromEntries(
        Object.entries(answers).filter(
          ([key, value]) => !key.endsWith('__other') && (typeof value === 'string' || Array.isArray(value))
        )
      ),
    };

    fetch(`/api/surveys/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        window.localStorage.removeItem(draftKey(id));
        router.push(`/respond/${id}/complete`);
      })
      .catch(() => {
        setSubmitError(true);
        setIsSubmitting(false);
      });
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
      <div className="card">
        <div className="d-flex align-items-center justify-content-between px-4 py-3">
          <h1 className="fs-4 fw-bold mb-0">{form.name}</h1>
          <Link href="/respond" className="btn btn-outline-secondary">
            一覧へ戻る
          </Link>
        </div>

        <div className="card-body">
          {form.questions.length === 0 ? (
            <div className="text-muted text-center py-5">この質問はまだ準備中です。</div>
          ) : (
            <Form>
              {form.questions.map((question, index) => (
                <Form.Group key={question.id} className="mb-4">
                  <Form.Label className="fw-semibold">
                    問{index + 1}. {question.label}
                  </Form.Label>
                  <QuestionAnswerField
                    question={question}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                </Form.Group>
              ))}

              <div className="d-flex align-items-center gap-3 pt-3 border-top">
                <Button variant="outline-secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
                  一時保存
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? '送信中...' : '回答を送信する'}
                </Button>
                {savedAt && (
                  <span className="text-muted small">{savedAt} に一時保存しました</span>
                )}
                {submitError && (
                  <span className="text-danger small">送信に失敗しました。もう一度お試しください。</span>
                )}
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
