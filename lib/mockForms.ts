import type { Question } from '@/lib/questionTypes';

export type FormStatus = '下書き' | '配信中' | '回収終了';

export type MyResponseStatus = '未回答' | '回答済み';

// 質問への回答値: single/scale/text/textarea/number/date は string、
// multiple は string[]、matrix は 行ラベル→選択列 の Record
export type AnswerValue = string | string[] | Record<string, string>;
export type Answers = Record<string, AnswerValue>;

export type FormRow = {
  id: number;
  name: string;
  url: string;
  status: FormStatus;
  targetDepartments: string[];
  dueDate?: string; // ISO date (配信中・回収終了のみ)
  distributionStartAt?: string; // ISO date (配信中・回収終了のみ)
  createdAt: string; // ISO date
  responseCount: number;
  totalCount: number;
  updatedAt: string;
  updatedBy: string;
  myStatus?: MyResponseStatus; // ログイン中ユーザー自身の回答状況(配信中・回収終了のみ意味を持つ)
  questions: Question[];
  myAnswers?: Answers; // 回答済みの場合の自分の回答内容(編集時に初期値として使用)
};

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const MOCK_FORMS: FormRow[] = [
  {
    id: 1,
    name: '従業員満足度調査 2026上期',
    url: 'https://forms.example.com/f/mock-0001',
    status: '配信中',
    targetDepartments: ['営業本部', '開発本部', '人事本部'],
    dueDate: offsetDate(2),
    distributionStartAt: offsetDate(-15),
    createdAt: offsetDate(-18),
    responseCount: 42,
    totalCount: 60,
    updatedAt: '2026/04/01 17:31',
    updatedBy: '作成者（管理者同等）',
    myStatus: '未回答',
    questions: [
      {
        id: 'q1-1',
        type: 'single',
        label: '現在の業務内容に満足していますか？',
        options: ['満足', 'やや満足', '普通', 'やや不満', '不満'],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
      {
        id: 'q1-2',
        type: 'scale',
        label: '職場の人間関係を5段階で評価してください',
        options: [],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '不満',
        scaleMaxLabel: '満足',
        allowOther: false,
      },
      {
        id: 'q1-3',
        type: 'multiple',
        label: '改善してほしい点を選んでください（複数選択可）',
        options: ['給与', '労働時間', '人間関係', '設備'],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: true,
      },
      {
        id: 'q1-4',
        type: 'textarea',
        label: 'その他ご意見があれば自由にご記入ください',
        options: [],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
    ],
  },
  {
    id: 2,
    name: '社内イベント参加希望調査',
    url: 'https://forms.example.com/f/mock-0002',
    status: '配信中',
    targetDepartments: ['全社'],
    dueDate: offsetDate(12),
    distributionStartAt: offsetDate(-10),
    createdAt: offsetDate(-14),
    responseCount: 180,
    totalCount: 220,
    updatedAt: '2026/04/01 17:31',
    updatedBy: '作成者（管理者同等）',
    myStatus: '回答済み',
    questions: [
      {
        id: 'q2-1',
        type: 'single',
        label: '参加を希望しますか？',
        options: ['参加する', '参加しない', '未定'],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
      {
        id: 'q2-2',
        type: 'text',
        label: '参加希望のイベント名があれば入力してください',
        options: [],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
    ],
    myAnswers: {
      'q2-1': '参加する',
      'q2-2': '納涼祭',
    },
  },
  {
    id: 3,
    name: '顧客満足度調査',
    url: 'https://forms.example.com/f/mock-0003',
    status: '下書き',
    targetDepartments: ['営業本部'],
    createdAt: offsetDate(-2),
    responseCount: 0,
    totalCount: 0,
    updatedAt: '2026/04/01 17:31',
    updatedBy: '作成者（管理者同等）',
    questions: [],
  },
  {
    id: 4,
    name: 'ウェビナーアンケート',
    url: 'https://forms.example.com/f/mock-0004',
    status: '回収終了',
    targetDepartments: ['開発本部'],
    dueDate: offsetDate(-34),
    distributionStartAt: offsetDate(-38),
    createdAt: offsetDate(-40),
    responseCount: 34,
    totalCount: 40,
    updatedAt: '2026/04/01 17:30',
    updatedBy: '作成者（管理者同等）',
    myStatus: '未回答',
    questions: [
      {
        id: 'q4-1',
        type: 'single',
        label: 'ウェビナーの内容は分かりやすかったですか？',
        options: ['はい', 'いいえ', 'どちらとも言えない'],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
    ],
  },
];

export function findFormById(id: number): FormRow | undefined {
  return MOCK_FORMS.find((form) => form.id === id);
}

export function duplicateForm(id: number): FormRow | undefined {
  const original = findFormById(id);
  if (!original) return undefined;

  const newId = Math.max(...MOCK_FORMS.map((form) => form.id)) + 1;
  const copy: FormRow = {
    ...original,
    id: newId,
    name: `${original.name}のコピー`,
    status: '下書き',
    targetDepartments: [...original.targetDepartments],
    dueDate: undefined,
    createdAt: offsetDate(0),
    responseCount: 0,
    totalCount: 0,
    myStatus: undefined,
    myAnswers: undefined,
    questions: original.questions.map((question) => ({ ...question })),
  };

  MOCK_FORMS.push(copy);
  return copy;
}

export function deleteForm(id: number): void {
  const index = MOCK_FORMS.findIndex((form) => form.id === id);
  if (index !== -1) MOCK_FORMS.splice(index, 1);
}

export type DistributionSettings = {
  targetDepartments: string[];
  distributionStartAt: string; // ISO date
  dueDate: string; // ISO date
};

export function updateDistribution(id: number, settings: DistributionSettings): void {
  const form = findFormById(id);
  if (!form) return;
  form.targetDepartments = settings.targetDepartments;
  form.distributionStartAt = settings.distributionStartAt;
  form.dueDate = settings.dueDate;
  form.status = '配信中';
}

export function daysUntil(dueDateIso?: string): number | null {
  if (!dueDateIso) return null;
  const diffMs = new Date(dueDateIso).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// 締切日を過ぎているかどうか(日付ベース)。status が「配信中」のままでも
// 締切を過ぎていれば回答をロックするために使う。
export function isPastDue(form: FormRow): boolean {
  const remaining = daysUntil(form.dueDate);
  return remaining !== null && remaining < 0;
}

export function formatDepartments(departments: string[]): string {
  if (departments.length === 0) return '未設定';
  if (departments[0] === '全社') return '全社';
  if (departments.length === 1) return departments[0];
  return `${departments[0]} 他${departments.length - 1}件`;
}

export function isAssignedToDepartment(form: FormRow, department: string): boolean {
  return form.targetDepartments.includes('全社') || form.targetDepartments.includes(department);
}

export function formatDate(dateIso?: string): string {
  if (!dateIso) return '未設定';
  return dateIso.replaceAll('-', '/');
}
