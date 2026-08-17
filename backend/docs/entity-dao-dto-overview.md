# Entity / Dao / Dto の役割と一覧

バックエンド(`backend/`)のデータアクセス層(Doma)とAPI層で使っている3種類のクラスの役割の違いと、全ファイルの一覧。

## 全体像

| 種類 | 役割 |
|---|---|
| **Entity** | DBの1テーブル(1行)に対応するクラス。Doma(ORM)がSQL結果をマッピングする単位で、`insert`/`update`/`delete`もこれを介して行う |
| **Dao** | Entityに対して実際にSQLを発行する窓口。基本は「1 Dao = 1 Entity(≒1テーブル)」 |
| **Dto** | 画面(API)とやり取りするためのデータの形。DBのテーブル構造とは無関係で、複数Entityの値をServiceがJavaコードで組み立てて(Response)/分解して(Request)使う |

## Entity(`domain/entity/`)

| クラス | テーブル | 役割 |
|---|---|---|
| Enquete | enquete | アンケート本体(タイトル・説明・状態ID・配信期間) |
| EnqueteState | enquete_state | 状態マスタ(下書き/配信中/回収終了) |
| Question | question | アンケート内の1質問(タイプ・本文・並び順) |
| QuestionType | question_type | 質問タイプのマスタ(single/multiple/scale等) |
| Choice | choice | 質問の選択肢(選択式・尺度用) |
| Dept | dept | 部署マスタ(部署名・人数) |
| EnqueteDept | enquete_dept | アンケート×配信対象部署の中間テーブル(多対多) |
| EnqueteAnswer | enquete_answer | 「誰がいつこのアンケートに回答したか」のヘッダ |
| QuestionAnswer | question_answer | 1質問に対する回答本体(自由記述テキスト等) |
| ChoiceAnswer | choice_answer | 選択式の質問でどの選択肢を選んだかの記録 |
| **EnqueteAnswerCount** | *(なし)* | `enquete_answer`をenquete_idごとに集計した件数を受け取るための読み取り専用クラス。特定の行と対応しないので`@Table`なし。一覧APIのN+1対策で追加 |

## Dao(`domain/dao/`)

| クラス | 対応Entity | 主なメソッド |
|---|---|---|
| EnqueteDao | Enquete | selectAll / selectById / insert / update / deleteById |
| EnqueteStateDao | EnqueteState | selectAll(マスタ取得のみ) |
| QuestionDao | Question | selectByEnqueteId(**+Ids**) / selectById / insert / deleteByEnqueteId |
| QuestionTypeDao | QuestionType | selectAll(マスタ取得のみ) |
| ChoiceDao | Choice | selectByQuestionId(**+Ids**) / insert |
| DeptDao | Dept | selectAll(マスタ取得のみ) |
| EnqueteDeptDao | EnqueteDept | selectDeptNamesByEnqueteId(dept JOIN) / **selectByEnqueteIds** / insert / deleteByEnqueteId |
| EnqueteAnswerDao | EnqueteAnswer | countByEnqueteId(**+Ids**) / countByEnqueteIdAndRespondentName / **selectAnsweredEnqueteIds** / selectById / insert |
| QuestionAnswerDao | QuestionAnswer | selectByQuestionId / insert |
| ChoiceAnswerDao | ChoiceAnswer | countByChoiceId / insert |

太字(`+Ids`など)は、一覧API(`GET /api/surveys`)のN+1対策で追加したバッチ版メソッド。詳細は[program-function-diagram.md](../../frontend/docs/program-function-diagram.md)を参照。

## Dto(`domain/dto/`)

用途別に分けると見通しが良い。

### 一覧・詳細取得

| クラス | 役割 |
|---|---|
| SurveyResponse | アンケート1件分(複数Entityの値をServiceが詰め替えたもの) |
| QuestionResponse | SurveyResponse内の質問1件分 |

### 作成・更新

| クラス | 役割 |
|---|---|
| SurveyCreateRequest | アンケート新規作成のリクエストボディ |
| SurveyUpdateRequest | アンケート編集(下書きのみ)のリクエストボディ |
| QuestionRequest | 上記2つの中の質問1件分の入力 |
| DistributionUpdateRequest | 配信設定(対象部署・配信期間)更新のリクエストボディ |

### 回答

| クラス | 役割 |
|---|---|
| AnswerSubmitRequest | 回答者が送信する内容(respondentName + answers) |
| AnswerSubmitResponse | 回答送信成功時のレスポンス(回答ID・送信日時) |

### 集計結果

| クラス | 役割 |
|---|---|
| SurveyResultsResponse | 集計結果画面全体(総回答数+質問ごとの集計) |
| QuestionResultResponse | 集計結果内の質問1件分(選択肢別件数 or 自由記述一覧) |
| OptionCountResponse | 集計結果内の、選択肢1つあたりの件数 |

### エラー

| クラス | 役割 |
|---|---|
| ErrorResponse | バリデーションエラー時のレスポンス(エラー一覧) |
| FieldError | エラー1件分(フィールド名+メッセージ) |

## ポイント

EntityとDaoは「1テーブル=1Entity=1Dao」が徹底されている一方、Dtoは**APIのやり取り単位(画面1つ、操作1つ)**で切られていて、テーブル数とは無関係。`SurveyResponse`1件を作るのに5〜6個のEntityが使われているのがその典型例。
