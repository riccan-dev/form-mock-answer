'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SurveyToolbar, { type SortKey, type StatusFilter } from './_components/SurveyToolbar';
import SurveyCard from './_components/SurveyCard';
import { daysUntil, type FormRow } from '@/lib/mockForms';
import { mapSurveyResponseToFormRow, type SurveyResponse } from '@/lib/surveyApi';

export default function AdminSurveyListPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('すべて');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [forms, setForms] = useState<FormRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/surveys')
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data: SurveyResponse[]) => {
        if (cancelled) return;
        setForms(data.map(mapSurveyResponseToFormRow));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleDelete(id: number) {
    fetch(`/api/surveys/${id}`, { method: 'DELETE' }).then((res) => {
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
      }
    });
  }

  const visibleForms = useMemo(() => {
    let filtered = forms.filter((form) => {
      if (statusFilter !== 'すべて' && form.status !== statusFilter) return false;
      if (searchQuery && !form.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortKey === 'dueDate') {
        const aDays = daysUntil(a.dueDate) ?? Infinity;
        const bDays = daysUntil(b.dueDate) ?? Infinity;
        return aDays - bDays;
      }
      if (sortKey === 'responseRate') {
        const aRate = a.totalCount > 0 ? a.responseCount / a.totalCount : -1;
        const bRate = b.totalCount > 0 ? b.responseCount / b.totalCount : -1;
        return aRate - bRate;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [forms, statusFilter, sortKey, searchQuery]);

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 1280 }}>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">アンケート管理</h1>
        <Link href="/admin/forms/new" className="btn btn-primary">
          ＋ 新規作成
        </Link>
      </div>

      <SurveyToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="px-4">
        {isLoading ? (
          <div className="text-muted text-center py-5">読み込み中...</div>
        ) : loadError ? (
          <div className="text-danger text-center py-5">アンケート一覧の取得に失敗しました。</div>
        ) : visibleForms.length === 0 ? (
          <div className="text-muted text-center py-5">該当するアンケートがありません。</div>
        ) : (
          visibleForms.map((form) => (
            <SurveyCard key={form.id} form={form} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
