# AWSアカウント側の準備手順(フェーズ4〜5)

`frontend`/`backend`をECR + ECS Fargate + ALB + Auroraにデプロイするための、アカウント側インフラ準備の手順。実際のタスク定義・ECSサービス作成・デプロイは次のフェーズで別途まとめる。

## 前提となる設計

- リージョン: 東京(`ap-northeast-1`)
- VPC: 新規作成。パブリックサブネット×2 + プライベートサブネット×2(異なるAZに分散)、NAT Gateway経由でプライベートサブネットからインターネットアクセス
- ALB(パブリック)がfrontend・backend両方へパスベースルーティングで振り分け(例: `/api/*` → backend、それ以外 → frontend)
- ECS Fargate(frontend・backendコンテナ)はプライベートサブネットに配置
- Aurora(PostgreSQL互換)もプライベートサブネットに配置、backendからのみアクセス可能

### 重要な注意点

`/api/*`をALBが直接backendへ振り分けるため、AWS環境ではブラウザ→backendが直接つながる。現在フロントエンドに用意している`/api/*`のRoute Handler(セッションCookie中継のプロキシ、`frontend/lib/backendProxy.ts`)は**ローカル開発時のみ使われる仕組み**になり、AWS環境では経由されなくなる(backend自身がSet-Cookieを直接ブラウザに返すため、これはこれで正しく動作する)。

## 手順

### 1. IAMユーザーの準備
- rootアカウントではなく、このプロジェクト専用のIAMユーザーを作成(MFA設定を推奨)
- CLI操作用のアクセスキーを発行
- 権限: 学習用アカウントのため、まずは`AdministratorAccess`を付与して進め、慣れてきたら必要な権限だけに絞る方針とする

### 2. AWS CLIのインストール・設定
- AWS CLI v2をインストール
- `aws configure`でアクセスキー・シークレットキー・リージョン(`ap-northeast-1`)を設定

### 3. VPC・サブネット・ルーティング
- VPC(例: `10.0.0.0/16`)を新規作成
- パブリックサブネット×2(異なるAZ、ALB・NAT Gateway用)
- プライベートサブネット×2(異なるAZ、ECS・Aurora用)
- インターネットゲートウェイをVPCにアタッチし、パブリックサブネットのルートテーブルに設定
- NAT Gatewayをパブリックサブネットに1つ作成(学習用途はAZ冗長化せず1つで十分、コスト優先)、プライベートサブネットのルートテーブルから参照

### 4. セキュリティグループ

| SG | インバウンド許可 |
|---|---|
| ALB用 | 80番(必要なら443番)を`0.0.0.0/0`から |
| frontend(ECS)用 | 3000番をALB用SGから |
| backend(ECS)用 | 8080番をALB用SGから |
| Aurora用 | 5432番をbackend用SGから |

### 5. ECRリポジトリ作成
- `survey-frontend`・`survey-backend`の2つ(プライベートリポジトリ、プッシュ時のイメージスキャン有効化を推奨)

### 6. ECSクラスタ作成
- Fargate起動タイプでクラスタ作成(EC2管理不要)

### 7. IAMロール(ECS用)
- `ecsTaskExecutionRole`: マネージドポリシー`AmazonECSTaskExecutionRolePolicy`をアタッチ(ECRからのイメージ取得・CloudWatch Logsへの書き込み用)。Aurora接続情報をSecrets Manager経由で渡すため、参照権限も追加する

### 8. Aurora(PostgreSQL互換)準備
- Aurora Serverless v2を推奨(学習用途はトラフィックが少なく、時間課金のServerless v2の方がコストを抑えられる。最小ACU 0.5〜)
- DBサブネットグループ: 手順3で作成したプライベートサブネット2つ
- セキュリティグループ: 手順4のAurora用SG
- マスター認証情報は「Secrets Managerで管理」オプションを使う(平文で持たない)

### 9. スキーマの移行準備(任意だが推奨)
- 現在はローカルのPostgreSQLに直接DDLを流し込んでいる状態。`pg_dump --schema-only`で現在のスキーマを書き出しておくと、Auroraへの反映がスムーズになる。この機会にFlyway移行を先に行うのも一つの手

### 10. ALB本体・ターゲットグループの作成
- ALB(インターネット向け、パブリックサブネットに配置)
- ターゲットグループ×2: `frontend-tg`(ポート3000、ターゲットタイプ`ip`)・`backend-tg`(ポート8080、ターゲットタイプ`ip`)
- リスナー(80番)のルール: パスパターン`/api/*` → `backend-tg`、それ以外(デフォルト) → `frontend-tg`
- ターゲットグループへの実際の紐付けはECSサービス作成時(次のデプロイ段階)に行うため、ここでは空の状態で作成しておく

## 次のフェーズ

タスク定義(ECRイメージ・環境変数・Secrets Managerの参照を指定)、ECSサービス作成(上記ターゲットグループとの紐付け)、実際のデプロイと動作確認。
