'use client';

const CURRENT_USER = {
  name: '山田 太郎',
  initial: '山',
};

export default function Header() {
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

      <div className="d-flex align-items-center gap-2">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ width: 28, height: 28, fontSize: 12 }}
        >
          {CURRENT_USER.initial}
        </div>
        <span className="small">{CURRENT_USER.name} さん</span>
      </div>
    </header>
  );
}
