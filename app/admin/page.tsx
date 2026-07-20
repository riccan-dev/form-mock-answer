'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import SurveyToolbar, { type SortKey, type StatusFilter } from './_components/SurveyToolbar';
import SurveyCard from './_components/SurveyCard';
import { MOCK_FORMS, daysUntil, duplicateForm, deleteForm } from '@/lib/mockForms';

export default function AdminSurveyListPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('すべて');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [version, setVersion] = useState(0);

  function handleDuplicate(id: number) {
    duplicateForm(id);
    setVersion((v) => v + 1);
  }

  function handleDelete(id: number) {
    deleteForm(id);
    setVersion((v) => v + 1);
  }

  const visibleForms = useMemo(() => {
    let forms = MOCK_FORMS.filter((form) => {
      if (statusFilter !== 'すべて' && form.status !== statusFilter) return false;
      if (searchQuery && !form.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

    forms = [...forms].sort((a, b) => {
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

    return forms;
  }, [statusFilter, sortKey, searchQuery, version]);

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
        {visibleForms.length === 0 ? (
          <div className="text-muted text-center py-5">該当するアンケートがありません。</div>
        ) : (
          visibleForms.map((form) => (
            <SurveyCard
              key={form.id}
              form={form}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
