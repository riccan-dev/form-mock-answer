'use client';

import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';

type TabKey = 'all' | 'published' | 'scheduled' | 'unpublished';

type Tab = {
  key: TabKey;
  label: string;
  count: number;
};

const TABS: Tab[] = [
  { key: 'all', label: 'すべて', count: 86 },
  { key: 'published', label: '公開', count: 59 },
  { key: 'scheduled', label: '公開予約', count: 0 },
  { key: 'unpublished', label: '非公開', count: 27 },
];

type StatusTabsProps = {
  active: TabKey | string;
  onChange: (key: string) => void;
};

export default function StatusTabs({ active, onChange }: StatusTabsProps) {
  return (
    <Nav
      variant="tabs"
      activeKey={active}
      onSelect={(key) => onChange(key ?? 'all')}
      className="px-4"
    >
      {TABS.map((tab) => (
        <Nav.Item key={tab.key}>
          <Nav.Link eventKey={tab.key} className="d-flex align-items-center gap-2">
            {tab.label}
            <Badge bg={active === tab.key ? 'primary' : 'secondary'} pill>
              {tab.count}
            </Badge>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
