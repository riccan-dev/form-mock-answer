'use client';

import Form from 'react-bootstrap/Form';
import type { FormStatus } from '@/lib/mockForms';

export type StatusFilter = FormStatus | 'すべて';
export type SortKey = 'dueDate' | 'responseRate' | 'createdAt';

const SORT_LABELS: Record<SortKey, string> = {
  dueDate: '締切が近い順',
  responseRate: '回答率が低い順',
  createdAt: '作成日順',
};

type SurveyToolbarProps = {
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortKey: SortKey;
  onSortKeyChange: (value: SortKey) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function SurveyToolbar({
  statusFilter,
  onStatusFilterChange,
  sortKey,
  onSortKeyChange,
  searchQuery,
  onSearchQueryChange,
}: SurveyToolbarProps) {
  return (
    <div className="d-flex align-items-center gap-2 px-4 py-3">
      <Form.Select
        style={{ maxWidth: 180 }}
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
      >
        <option value="すべて">すべてのステータス</option>
        <option value="下書き">下書き</option>
        <option value="配信中">配信中</option>
        <option value="回収終了">回収終了</option>
      </Form.Select>

      <Form.Select
        style={{ maxWidth: 180 }}
        value={sortKey}
        onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
      >
        {Object.entries(SORT_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </Form.Select>

      <Form.Control
        type="text"
        placeholder="タイトルで検索"
        style={{ maxWidth: 260 }}
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
      />
    </div>
  );
}
