'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import AssignedSurveyCard from './_components/AssignedSurveyCard';
import { daysUntil, isAssignedToDepartment, type FormRow } from '@/lib/mockForms';
import { mapSurveyResponseToFormRow, type SurveyResponse } from '@/lib/surveyApi';
import { useAuth } from '@/lib/AuthContext';

type StatusFilter = 'すべて' | '未回答' | '回答済み';

export default function RespondPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('すべて');
  const [forms, setForms] = useState<FormRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }
    fetch('/api/surveys')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SurveyResponse[]) => setForms(data.map(mapSurveyResponseToFormRow)))
      .finally(() => setIsLoading(false));
  }, [user, isAuthLoading]);

  const assignedForms = useMemo(() => {
    if (!user) return [];

    const assigned = forms.filter(
      (form) => form.status !== '下書き' && isAssignedToDepartment(form, user.department)
    );

    const filtered = assigned.filter((form) => {
      if (statusFilter === 'すべて') return true;
      if (form.status === '回収終了') return false;
      return form.myStatus === statusFilter;
    });

    return [...filtered].sort((a, b) => {
      const aDays = daysUntil(a.dueDate) ?? Infinity;
      const bDays = daysUntil(b.dueDate) ?? Infinity;
      return aDays - bDays;
    });
  }, [forms, statusFilter, user]);

  if (isAuthLoading) {
    return <div className="text-muted text-center py-5">読み込み中...</div>;
  }

  if (!user) {
    return (
      <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
        <div className="text-muted text-center py-5">
          アンケートに回答するには<Link href="/login">ログイン</Link>してください。
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
      <div className="px-4 py-3">
        <h1 className="fs-4 fw-bold mb-1">割当アンケート一覧</h1>
        <p className="text-muted small mb-0">
          {user.department}宛てに配布されたアンケートを表示しています。
        </p>
      </div>

      <div className="px-4 pb-3">
        <Form.Select
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="すべて">すべて</option>
          <option value="未回答">未回答</option>
          <option value="回答済み">回答済み</option>
        </Form.Select>
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="text-muted text-center py-5">読み込み中...</div>
        ) : assignedForms.length === 0 ? (
          <div className="text-muted text-center py-5">該当するアンケートがありません。</div>
        ) : (
          assignedForms.map((form) => <AssignedSurveyCard key={form.id} form={form} />)
        )}
      </div>
    </div>
  );
}
