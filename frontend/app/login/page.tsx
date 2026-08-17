'use client';

import Link from 'next/link';
import Form from 'react-bootstrap/Form';

export default function LoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ width: 360 }}>
        <div className="card-body">
          <h1 className="fs-4 fw-bold text-center mb-4">ログイン</h1>
          <Form>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control type="email" placeholder="you@example.com" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>パスワード</Form.Label>
              <Form.Control type="password" placeholder="パスワード" />
            </Form.Group>

            <Link href="/admin" className="btn btn-primary w-100">
              ログイン
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
}
