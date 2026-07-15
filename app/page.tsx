'use client';

import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import StatusTabs from '@/components/StatusTabs';
import Toolbar from '@/components/Toolbar';
import FormTable from '@/components/FormTable';

export default function Page() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 1280 }}>
      <Card>
        <div className="d-flex align-items-center justify-content-between px-4 py-3">
          <h1 className="fs-4 fw-bold mb-0">フォーム管理</h1>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary">
              旧バージョンのフォーム管理からコピー
            </Button>
            <Button as="a" href="/forms/new" variant="primary">
              ＋ 新規作成
            </Button>
          </div>
        </div>
        <StatusTabs active={activeTab} onChange={setActiveTab} />
        <Toolbar />
        <FormTable />
      </Card>
    </div>
  );
}
