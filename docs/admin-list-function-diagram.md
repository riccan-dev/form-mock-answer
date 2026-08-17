# プログラム機能構成図(管理者画面 アンケート一覧機能)

管理者画面のアンケート一覧(`/admin`)から直接呼ばれる範囲の画面遷移とプログラム対応表。
一覧画面自体はクライアントコンポーネントで、表示直後の`useEffect`でAPIを叩き、絞り込み・並び替え・検索(SurveyToolbar)はクライアント側の`useMemo`のみで完結しAPI通信は発生しない。

## バックエンド(Spring Boot / survey)

`SurveyApiController`のうち、一覧画面が直接利用する一覧取得・削除の2エンドポイント。

| URL(Method) | Model(入力) | Model(出力) | Controllerクラス | Controllerメソッド | Service | Dao | テーブル名 |
|---|---|---|---|---|---|---|---|
| `/api/surveys`(GET) | `respondentName`(クエリ・任意) | `List<SurveyResponse>` | SurveyApiController | list | SurveyApiListService(Impl) | EnqueteDao(selectAll), EnqueteStateDao(selectAll), QuestionDao(selectByEnqueteId), QuestionTypeDao(selectAll), ChoiceDao(selectByQuestionId), EnqueteDeptDao(selectDeptNamesByEnqueteId), EnqueteAnswerDao(countByEnqueteId, countByEnqueteIdAndRespondentName), DeptDao(selectAll) | enquete, enquete_state, question, question_type, choice, enquete_dept, enquete_answer, dept |
| `/api/surveys/{id}`(DELETE) | `id`(パス変数) | なし(204)/404 | SurveyApiController | delete | SurveyDeleteService(Impl) | EnqueteDao(selectById), EnqueteDao(deleteById) | enquete ※question/choice/enquete_dept/enquete_answerはON DELETE CASCADEで連鎖削除 |

## フロントエンド(Next.js / form-mock-answer)

Spring MVCの「Controller/Service/Dao/テーブル」に相当する概念がないため、対応する仕組み(Route Handler / Component)を代わりに記載。

| 画面名(遷移前) | 画面名(遷移後) | ボタン/リンク | URL(Method) | Model(入力) | Model(出力) | Route Handler / Component |
|---|---|---|---|---|---|---|
| (他画面/初回アクセス) | アンケート管理画面(`app/admin/page.tsx`) | —(ページ遷移) | `/admin`(画面遷移のみ) | なし | なし | AdminSurveyListPage |
| アンケート管理画面(初期表示) | アンケート管理画面(一覧表示後) | —(mount時に自動実行) | `/api/surveys`(GET) | なし | `SurveyResponse[]` → `mapSurveyResponseToFormRow`で`FormRow[]`に変換 | `app/api/surveys/route.ts`のGET関数 |
| アンケート管理画面 | アンケート管理画面(絞り込み/並び替え後) | ステータス選択・並び替え選択・検索欄(SurveyToolbar) | —(API呼び出しなし) | — | —(クライアント内stateのみ) | `page.tsx`内`useMemo` |
| アンケート管理画面 | アンケート作成画面(`forms/new`) | 「＋ 新規作成」リンク | `/admin/forms/new`(画面遷移のみ) | なし | — | Link → `app/admin/forms/new` |
| アンケート管理画面(SurveyCard) | プレビュー画面(`forms/[id]/preview`) | 「プレビュー」リンク | `/admin/forms/[id]/preview`(画面遷移のみ) | なし | — | Link → PreviewFormPage |
| アンケート管理画面(下書きのみ) | アンケート編集画面(`forms/[id]/edit`) | 「編集を続ける」リンク | `/admin/forms/[id]/edit`(画面遷移のみ) | なし | — | Link → `forms/[id]/edit` |
| アンケート管理画面(下書き/配信中) | 配信設定画面(`forms/[id]/distribute`) | 「配信設定」リンク | `/admin/forms/[id]/distribute`(画面遷移のみ) | なし | — | Link → `forms/[id]/distribute` |
| アンケート管理画面(配信中/回収終了) | 回答状況画面(`forms/[id]/results`) | 「回答状況を見る」リンク | `/admin/forms/[id]/results`(画面遷移のみ) | なし | — | Link → `forms/[id]/results` |
| アンケート管理画面(下書きのみ・削除確認モーダル) | アンケート管理画面(カードが一覧から消える) | 「削除」→モーダル内「削除する」ボタン(SurveyCard) | `/api/surveys/{id}`(DELETE) | `id`(パスパラメータ) | なし(204)。失敗時は一覧を変更しない | `app/api/surveys/[id]/route.ts`のDELETE関数 |

### 補足

- フロントエンドの`GET /api/surveys`・`DELETE /api/surveys/{id}`は画面から見たURLで、実際にデータを扱うのはバックエンドの`http://localhost:8080/api/surveys`。フロントのRoute Handlerはサーバー側でバックエンドAPIへプロキシするだけの薄い層。
- 対象範囲は一覧画面本体とそこから直接呼ぶAPIのみ。遷移先(プレビュー/編集/配信設定/回答状況/新規作成)各画面の内部処理は対象外(画面遷移リンクとしてのみ記載)。
