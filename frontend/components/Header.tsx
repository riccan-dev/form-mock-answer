'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CURRENT_USER } from '@/lib/currentUser';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isRespond = pathname.startsWith('/respond');

  return (
    <header className="d-flex align-items-center justify-content-between px-4 py-2 bg-white border-bottom">
      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
          style={{ width: 32, height: 32 }}
        >
          F
        </div>
        <span className="fw-bold">Acme Forms</span>
      </div>

      <div className="btn-group" role="group" aria-label="モード切り替え">
        <Link
          href="/admin"
          className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-outline-secondary'}`}
        >
          管理者
        </Link>
        <Link
          href="/respond"
          className={`btn btn-sm ${isRespond ? 'btn-primary' : 'btn-outline-secondary'}`}
        >
          回答者
        </Link>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ width: 28, height: 28, fontSize: 12 }}
        >
          {CURRENT_USER.initial}
        </div>
        <span className="small">
          {CURRENT_USER.name} さん（{CURRENT_USER.department}）
        </span>
        <a href="/login" className="small ms-2">
          ログアウト
        </a>
      </div>
    </header>
  );
}
