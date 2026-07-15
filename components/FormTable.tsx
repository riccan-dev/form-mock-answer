'use client';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Link from 'next/link';
import { MOCK_FORMS } from '@/lib/mockForms';

export default function FormTable() {
  return (
    <Table hover responsive className="mb-0 align-middle">
      <thead className="table-light">
        <tr>
          <th><Form.Check /></th>
          <th>ID</th>
          <th>フォーム名 / メモ / 公開用URL</th>
          <th>公開状況</th>
          <th>フォームタイプ</th>
          <th>更新日時</th>
          <th>登録件数</th>
          <th>レポート</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {MOCK_FORMS.map((row) => (
          <tr key={row.id}>
            <td><Form.Check /></td>
            <td className="text-muted">{row.id}</td>
            <td>
              <div className="fw-semibold">{row.name}</div>
              <a href={row.url} target="_blank" rel="noopener noreferrer" className="small">
                {row.url}
              </a>
              <Link href={`/forms/${row.id}/preview`} className="text-primary small">
                （プレビュー）
              </Link>
            </td>
            <td className="text-muted">
              ⏸ {row.status}
            </td>
            <td>📄 {row.type}</td>
            <td>
              <div>{row.updatedAt}</div>
              <div className="text-muted small">by {row.updatedBy}</div>
            </td>
            <td>{row.count}件</td>
            <td>
              <span className="me-2" role="img">📈</span>
              <span role="img">📋</span>
            </td>
            <td>
              <ButtonGroup size="sm">
                <Button as="a" href={`/forms/${row.id}/edit`} variant="outline-secondary">
                  ✎ 編集
                </Button>
                <Button variant="outline-secondary">⌄</Button>
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
