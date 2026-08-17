export type QuestionType =
  | 'single'
  | 'multiple'
  | 'scale'
  | 'matrix'
  | 'text'
  | 'textarea'
  | 'number'
  | 'date';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: '単一選択（ラジオボタン）',
  multiple: '複数選択（チェックボックス）',
  scale: '評価尺度',
  matrix: 'マトリックス',
  text: '一行テキスト',
  textarea: '複数行テキスト',
  number: '数値入力',
  date: '日付入力',
};

export const CHOICE_TYPES: QuestionType[] = ['single', 'multiple'];

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  options: string[]; // single / multiple / matrix の列(共通選択肢)
  matrixRows: string[]; // matrix の行(項目)
  scaleMax: number; // scale の段階数
  scaleMinLabel: string;
  scaleMaxLabel: string;
  allowOther: boolean; // single / multiple のみ: 「その他」自由記述を追加
};

let questionSeq = 0;

function nextQuestionId(): string {
  questionSeq += 1;
  return `q-${Date.now()}-${questionSeq}`;
}

export function createQuestion(type: QuestionType = 'single'): Question {
  return {
    id: nextQuestionId(),
    type,
    label: '',
    options: type === 'single' || type === 'multiple' || type === 'matrix' ? ['選択肢1', '選択肢2'] : [],
    matrixRows: type === 'matrix' ? ['項目1', '項目2'] : [],
    scaleMax: 5,
    scaleMinLabel: 'とても不満',
    scaleMaxLabel: 'とても満足',
    allowOther: false,
  };
}

export function cloneQuestionWithNewId(question: Question): Question {
  return { ...question, id: nextQuestionId() };
}
