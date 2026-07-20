import Link from 'next/link';
import Badge from 'react-bootstrap/Badge';
import type { FormRow } from '@/lib/mockForms';
import { daysUntil, isPastDue, formatDate } from '@/lib/mockForms';

export default function AssignedSurveyCard({ form }: { form: FormRow }) {
  const isClosed = form.status === '回収終了' || isPastDue(form);
  const isAnswered = form.myStatus === '回答済み';
  const remaining = daysUntil(form.dueDate);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h2 className="fs-5 fw-bold mb-0">{form.name}</h2>
          {isClosed ? (
            <Badge bg="dark">受付終了</Badge>
          ) : (
            <Badge bg={isAnswered ? 'success' : 'warning'} text={isAnswered ? undefined : 'dark'}>
              {isAnswered ? '回答済み' : '未回答'}
            </Badge>
          )}
        </div>

        <div className="text-muted small mb-3">
          {isClosed ? `締切: ${formatDate(form.dueDate)}（受付終了）` : `締切まで残り${remaining}日`}
        </div>

        {isClosed ? (
          <div className="text-muted small">回答受付は終了しました。</div>
        ) : (
          <Link
            href={`/respond/${form.id}`}
            className={`btn btn-sm ${isAnswered ? 'btn-outline-secondary' : 'btn-primary'}`}
          >
            {isAnswered ? '回答を編集する' : '回答する'}
          </Link>
        )}
      </div>
    </div>
  );
}
