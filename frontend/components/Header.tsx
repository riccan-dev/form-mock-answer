'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdmin = pathname.startsWith('/admin');
  const isRespond = pathname.startsWith('/respond');

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

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
        {user ? (
          <>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
              style={{ width: 28, height: 28, fontSize: 12 }}
            >
              {user.userName.charAt(0)}
            </div>
            <span className="small">
              {user.userName} さん（{user.department}）
            </span>
            <button type="button" onClick={handleLogout} className="btn btn-link btn-sm small ms-2 p-0">
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/login" className="small">
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}
