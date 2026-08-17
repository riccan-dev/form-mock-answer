'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { formatDepartments } from '@/lib/mockForms';
import type { FormRow } from '@/lib/mockForms';
import { mapSurveyResponseToFormRow } from '@/lib/surveyApi';
import type { SurveyResponse, SurveyResultsResponse } from '@/lib/surveyApi';
import ResultsBarChart from './_components/ResultsBarChart';

function escapeCsvField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function buildCsv(results: SurveyResultsResponse): string {
  const rows: string[][] = [['質問', '選択肢 / 種別', '件数']];

  results.questions.forEach((question) => {
    if (question.counts) {
      question.counts.forEach((option) => {
        rows.push([question.label, option.label, String(option.count)]);
      });
    } else {
      rows.push([question.label, '自由記述等（集計対象外）', String(results.responseCount)]);
    }
  });

  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\n');
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState<FormRow | null | undefined>(undefined);
  const [results, setResults] = useState<SurveyResultsResponse | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/surveys/${id}`).then((res) => (res.ok ? res.json() : null)),
      fetch(`/api/surveys/${id}/results`).then((res) => (res.ok ? res.json() : null)),
    ]).then(([surveyData, resultsData]: [SurveyResponse | null, SurveyResultsResponse | null]) => {
      setForm(surveyData ? mapSurveyResponseToFormRow(surveyData) : null);
      setResults(resultsData);
    });
  }, [id]);

  if (form === undefined) {
    return <div className="card-body">読み込み中...</div>;
  }

  if (!form || !results) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  const responseRate =
    form.totalCount > 0 ? Math.round((form.responseCount / form.totalCount) * 100) : 0;
  const resultByQuestionId = new Map(results.questions.map((q) => [q.questionId, q]));

  function handleExportCsv() {
    if (!results) return;
    const csv = buildCsv(results);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form!.name}_集計結果.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">集計結果（{form.name}）</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            一覧へ戻る
          </Link>
          <Button variant="primary" onClick={handleExportCsv}>
            CSVエクスポート
          </Button>
        </div>
      </div>

      <div className="card-body">
        <div className="mb-4 pb-4 border-bottom">
          <div className="text-muted small mb-1">回答率</div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <ProgressBar now={responseRate} className="flex-grow-1" style={{ height: 8 }} />
            <span className="small text-nowrap">
              {form.responseCount}/{form.totalCount}名（{responseRate}%）
            </span>
          </div>
          <div className="text-muted small">
            対象: {formatDepartments(form.targetDepartments)}
            {form.dueDate && ` ・ 締切: ${form.dueDate}`}
          </div>
        </div>

        {form.questions.length === 0 ? (
          <div className="text-muted text-center py-5">この質問はまだ準備中です。</div>
        ) : (
          form.questions.map((question, index) => {
            const result = resultByQuestionId.get(Number(question.id));
            return (
              <div key={question.id} className="mb-4 pb-4 border-bottom">
                <h2 className="fs-6 fw-bold mb-3">
                  問{index + 1}. {question.label}
                </h2>

                {result?.counts && (
                  <ResultsBarChart data={result.counts} total={results.responseCount} />
                )}

                {result?.freeTextAnswers && (
                  <div>
                    <div className="text-muted small mb-2">
                      自由記述等のため集計対象外です（回答数: {results.responseCount}件）
                    </div>
                    {result.freeTextAnswers.length > 0 && (
                      <ul className="small mb-0">
                        {result.freeTextAnswers.map((answer, i) => (
                          <li key={i}>{answer}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
