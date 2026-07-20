'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { findFormById, updateDistribution } from '@/lib/mockForms';
import { DEPARTMENTS, getHeadcount } from '@/lib/departments';

function toDatetimeLocal(dateIso?: string): string {
  const d = dateIso ? new Date(dateIso) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DistributeFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const form = findFormById(Number(id));
  const router = useRouter();

  const [isAllCompany, setIsAllCompany] = useState(
    form?.targetDepartments.includes('全社') ?? false
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    form?.targetDepartments.filter((d) => d !== '全社') ?? []
  );
  const [startAt, setStartAt] = useState(toDatetimeLocal());
  const [dueAt, setDueAt] = useState(toDatetimeLocal(form?.dueDate));
  const [reminder3Days, setReminder3Days] = useState(true);
  const [reminderDayBefore, setReminderDayBefore] = useState(true);
  const [anonymity, setAnonymity] = useState<'anonymous' | 'named'>('named');

  if (!form) {
    return <div className="card-body">ID: {id} のフォームは見つかりませんでした。</div>;
  }

  const headcount = getHeadcount(isAllCompany ? ['全社'] : selectedDepartments);

  function toggleDepartment(name: string) {
    setSelectedDepartments((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  }

  function handleDistribute() {
    updateDistribution(Number(id), {
      targetDepartments: isAllCompany ? ['全社'] : selectedDepartments,
      distributionStartAt: startAt.slice(0, 10),
      dueDate: dueAt.slice(0, 10),
    });
    router.push('/admin');
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <h1 className="fs-4 fw-bold mb-0">配信設定（{form.name}）</h1>
        <div className="d-flex gap-2">
          <Link href="/admin" className="btn btn-outline-secondary">
            キャンセル
          </Link>
          <Button variant="primary" onClick={handleDistribute}>
            配信する
          </Button>
        </div>
      </div>

      <div className="card-body">
        <section className="mb-4 pb-4 border-bottom">
          <h2 className="fs-6 fw-bold mb-3">配信対象</h2>

          <Form.Check
            className="mb-2"
            label="全社に配信する"
            checked={isAllCompany}
            onChange={(e) => setIsAllCompany(e.target.checked)}
          />

          <div className="row mb-2">
            {DEPARTMENTS.map((dept) => (
              <div className="col-sm-6" key={dept.name}>
                <Form.Check
                  label={`${dept.name}（${dept.headcount}名）`}
                  disabled={isAllCompany}
                  checked={isAllCompany || selectedDepartments.includes(dept.name)}
                  onChange={() => toggleDepartment(dept.name)}
                />
              </div>
            ))}
          </div>

          <div className="text-muted small">配信対象人数: {headcount}名</div>
        </section>

        <section className="mb-4 pb-4 border-bottom">
          <h2 className="fs-6 fw-bold mb-3">配信期間</h2>
          <div className="row">
            <Form.Group className="col-sm-6 mb-3">
              <Form.Label className="small text-muted">配信開始日時</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="col-sm-6 mb-3">
              <Form.Label className="small text-muted">回答締切日時</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </Form.Group>
          </div>
        </section>

        <section className="mb-4 pb-4 border-bottom">
          <h2 className="fs-6 fw-bold mb-3">リマインド設定</h2>
          <Form.Check
            className="mb-2"
            label="締切3日前に未回答者へリマインドを送信する"
            checked={reminder3Days}
            onChange={(e) => setReminder3Days(e.target.checked)}
          />
          <Form.Check
            label="締切前日に未回答者へリマインドを送信する"
            checked={reminderDayBefore}
            onChange={(e) => setReminderDayBefore(e.target.checked)}
          />
        </section>

        <section>
          <h2 className="fs-6 fw-bold mb-3">回答条件</h2>
          <ul className="small text-muted mb-3">
            <li>一人一回のみ回答可能です。</li>
            <li>締切前までは回答の編集が可能です。</li>
            <li>締切後は編集できません（ロックされます）。</li>
          </ul>
          <Form.Group style={{ maxWidth: 240 }}>
            <Form.Label className="small text-muted">回答形式</Form.Label>
            <Form.Select
              value={anonymity}
              onChange={(e) => setAnonymity(e.target.value as 'anonymous' | 'named')}
            >
              <option value="named">記名</option>
              <option value="anonymous">匿名</option>
            </Form.Select>
          </Form.Group>
        </section>
      </div>
    </>
  );
}
