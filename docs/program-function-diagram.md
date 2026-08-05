# プログラム機能構成図(アンケート作成機能)

アンケート作成機能(バックエンド: `survey` / フロントエンド: `form-mock-answer`)の画面遷移とプログラム対応表。

## バックエンド(Spring Boot / survey)

| 画面名(遷移前) | 画面名(遷移後) | ボタン/リンク | URL(Method) | Model(入力) | Model(出力) | Controllerクラス | Controllerメソッド | Service | Dao | テーブル名 |
|---|---|---|---|---|---|---|---|---|---|---|
| (初回アクセス) | アンケート一覧画面(index.html) | — | `/`(GET) | なし | `List<Survey>`(属性名`surveys`) | TopController | index | SurveyListService(Impl) | SurveyDao(selectAll) | surveys |
| アンケート一覧画面 | アンケート作成画面(survey-form.html) | 「新規作成」リンク | `/surveys/new`(GET) | なし | SurveyForm(空) | SurveyController | newForm | — | — | — |
| アンケート作成画面 | アンケート一覧画面(正常時)/アンケート作成画面(エラー時) | 「登録」ボタン | `/surveys`(POST) | SurveyForm(title, description) | なし(リダイレクト)/エラー時はSurveyForm+BindingResult | SurveyController | create | SurveyCreateService(Impl) | SurveyDao(insert) | surveys |
| (form-mock-answerから) | — | — | `/api/surveys`(POST) | SurveyCreateRequest(title, description, status, questions[]) | SurveyResponse(正常時)/ErrorResponse(異常時) | SurveyApiController | create | SurveyApiCreateService(Impl) + SurveyCreateRequestValidator | SurveyDao(insert, selectById), QuestionDao(insert), QuestionOptionDao(insert), QuestionMatrixRowDao(insert) | surveys, questions, question_options, question_matrix_rows |

## フロントエンド(Next.js / form-mock-answer)

Spring MVCの「Controller/Service/Dao/テーブル」に相当する概念がないため、対応する仕組みを代わりに記載。

| 画面名(遷移前) | 画面名(遷移後) | ボタン/リンク | URL(Method) | Model(入力) | Model(出力) | 相当する処理 |
|---|---|---|---|---|---|---|
| 新規アンケート作成画面(`/admin/forms/new`) | 作成完了画面(`/admin/forms/new/complete`)(正常時)/同画面に留まりエラー表示(異常時) | 「保存」ボタン | `/api/surveys`(POST) ※画面から見たURL。実体はfetchでバックエンドの`/api/surveys`を呼ぶ | 同上のSurveyCreateRequest相当のJSON | 同上のSurveyResponse/ErrorResponse相当のJSON | Route Handler: `app/api/surveys/route.ts`のPOST関数(Controllerクラス相当) |

### 補足

- 「Model(入力)」「Model(出力)」は、SpringならJavaのDTOクラス名、Next.js側はTypeScriptの型(実質的には同じJSON構造)。
- フロントの`/api/surveys`は画面から見たURLで、実際にデータを保存するのはバックエンドの`http://localhost:8080/api/surveys`。フロントのRoute Handlerはサーバー側でバックエンドAPIへプロキシするだけの薄い層。
