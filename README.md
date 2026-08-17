# form-mock-answer

社内向けアンケートシステムのモノレポ。フロントエンドとバックエンドを1つのリポジトリで管理しています。

## 構成

| ディレクトリ | 内容 |
|---|---|
| [`frontend/`](frontend/) | Next.js (App Router) + TypeScript + react-bootstrap による画面。詳細は [frontend/README.md](frontend/README.md) を参照 |
| [`backend/`](backend/) | Spring Boot + Doma によるREST API(`survey`)。PostgreSQLは`backend/docker-compose.yml`で起動 |

## プログラム機能構成図

- [管理者画面 アンケート一覧機能](frontend/docs/admin-list-function-diagram.md)
- [Entity / Dao / Dto の役割と一覧](backend/docs/entity-dao-dto-overview.md)

## 起動方法

### バックエンド

```bash
cd backend
docker compose up -d
./gradlew bootRun
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

`frontend`は`SURVEY_API_BASE_URL`(デフォルト`http://localhost:8080`)経由でバックエンドのREST APIを呼び出します。
