import { useState } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Modal from 'react-bootstrap/Modal';
import type { FormRow } from '@/lib/mockForms';
import { daysUntil, formatDepartments, formatDate } from '@/lib/mockForms';

const DUE_SOON_THRESHOLD = 3; // 締切が近いとみなす日数(仮、後日決定)

function StatusBadge({ form }: { form: FormRow }) {
  if (form.status === '下書き') {
    return <Badge bg="secondary">下書き</Badge>;
  }
  if (form.status === '回収終了') {
    return <Badge bg="dark">回収終了</Badge>;
  }
  const remaining = daysUntil(form.dueDate);
  const isUrgent = remaining !== null && remaining <= DUE_SOON_THRESHOLD;
  return <Badge bg={isUrgent ? 'danger' : 'success'}>配信中</Badge>;
}

function MetaLine({ form }: { form: FormRow }) {
  const target = formatDepartments(form.targetDepartments);

  return (
    <div className="text-muted small mb-2">
      <div>{deadlineText(form, target)}</div>
      <div>
        作成日: {formatDate(form.createdAt)} ・ 配信開始日: {formatDate(form.distributionStartAt)}
      </div>
    </div>
  );
}

function deadlineText(form: FormRow, target: string): string {
  if (form.status === '下書き') {
    return `対象: ${target} ・ 未配信`;
  }
  if (form.status === '回収終了') {
    return `対象: ${target} ・ 締切: ${formatDate(form.dueDate)}`;
  }
  const remaining = daysUntil(form.dueDate);
  return `対象: ${target} ・ 締切まで残り${remaining}日`;
}

type Props = {
  form: FormRow;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function SurveyCard({ form, onDuplicate, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleConfirmDelete() {
    onDelete(form.id);
    setShowDeleteConfirm(false);
  }

  const responseRate =
    form.totalCount > 0 ? Math.round((form.responseCount / form.totalCount) * 100) : 0;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h2 className="fs-5 fw-bold mb-0">{form.name}</h2>
          <StatusBadge form={form} />
        </div>

        <MetaLine form={form} />

        {form.status !== '下書き' && (
          <div className="mb-3">
            <div className="text-muted small mb-1">回答率</div>
            <div className="d-flex align-items-center gap-2">
              <ProgressBar now={responseRate} className="flex-grow-1" style={{ height: 8 }} />
              <span className="small text-nowrap">
                {form.responseCount}/{form.totalCount}名 ({responseRate}%)
              </span>
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          {form.status === '下書き' ? (
            <>
              <Link href={`/admin/forms/${form.id}/edit`} className="btn btn-outline-secondary btn-sm">
                編集を続ける
              </Link>
              <Link href={`/admin/forms/${form.id}/distribute`} className="btn btn-primary btn-sm">
                配信設定
              </Link>
              <Button variant="outline-secondary" size="sm" onClick={() => onDuplicate(form.id)}>
                複製
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                削除
              </Button>
            </>
          ) : form.status === '配信中' ? (
            <>
              <Link href={`/admin/forms/${form.id}/results`} className="btn btn-outline-secondary btn-sm">
                回答状況を見る
              </Link>
              <Link href={`/admin/forms/${form.id}/edit`} className="btn btn-outline-secondary btn-sm">
                編集
              </Link>
              <Link href={`/admin/forms/${form.id}/distribute`} className="btn btn-outline-secondary btn-sm">
                配信設定
              </Link>
              <Button variant="outline-secondary" size="sm" onClick={() => onDuplicate(form.id)}>
                複製
              </Button>
            </>
          ) : (
            <>
              <Link href={`/admin/forms/${form.id}/results`} className="btn btn-outline-secondary btn-sm">
                回答状況を見る
              </Link>
              <Link href={`/admin/forms/${form.id}/edit`} className="btn btn-outline-secondary btn-sm">
                編集
              </Link>
              <Button variant="outline-secondary" size="sm" onClick={() => onDuplicate(form.id)}>
                複製
              </Button>
            </>
          )}
        </div>
      </div>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">アンケートの削除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          「{form.name}」を削除します。この操作は取り消せません。よろしいですか？
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteConfirm(false)}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            削除する
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
