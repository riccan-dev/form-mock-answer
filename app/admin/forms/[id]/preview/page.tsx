'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import type { FormRow } from '@/lib/mockForms';
import { mapSurveyResponseToFormRow, type SurveyResponse } from '@/lib/surveyApi';
import QuestionAnswerField from '../../../../respond/[id]/_components/QuestionAnswerField';

export default function PreviewFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState<FormRow | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/surveys/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SurveyResponse | null) => setForm(data ? mapSurveyResponseToFormRow(data) : null))
      .catch(() => setForm(null));
  }, [id]);

  if (form === undefined) {
    return <div className="card-body">読み込み中...</div>;
  }

  if (!form) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">プレビュー（{form.name}）</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          一覧へ戻る
        </Link>
      </div>

      <div className="card-body">
        <div className="mb-4 pb-4 border-bottom">
          <Badge bg="secondary">{form.status}</Badge>
          <div className="text-muted small mt-2">
            回答者にはこのように表示されます(プレビューでは回答・送信できません)。
          </div>
        </div>

        {form.questions.length === 0 ? (
          <div className="text-muted text-center py-5">この質問はまだ準備中です。</div>
        ) : (
          <fieldset disabled>
            <Form>
              {form.questions.map((question, index) => (
                <Form.Group key={question.id} className="mb-4">
                  <Form.Label className="fw-semibold">
                    問{index + 1}. {question.label}
                  </Form.Label>
                  <QuestionAnswerField question={question} answers={{}} onAnswerChange={() => {}} />
                </Form.Group>
              ))}
            </Form>
          </fieldset>
        )}
      </div>
    </>
  );
}
