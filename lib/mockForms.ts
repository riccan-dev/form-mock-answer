export type FormRow = {
  id: number;
  name: string;
  url: string;
  status: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
  count: number;
};

export const MOCK_FORMS: FormRow[] = [
  {
    id: 1191,
    name: 'アンケートフォーム',
    url: 'https://xjib.f.msgs.jp/n/form/xjib/t2GExs33a3UWp-nrMxUMS',
    status: '非公開',
    type: '新規・更新登録フォーム',
    updatedAt: '2026/04/01 17:31',
    updatedBy: '作成者（管理者同等）',
    count: 0,
  },
  {
    id: 1190,
    name: '顧客満足度調査',
    url: 'https://xjib.f.msgs.jp/n/form/xjib/SMPRJkVRB2xrFMxY7TQpC',
    status: '非公開',
    type: '新規・更新登録フォーム',
    updatedAt: '2026/04/01 17:31',
    updatedBy: '作成者（管理者同等）',
    count: 0,
  },
  {
    id: 1189,
    name: 'ウェビナーアンケート',
    url: 'https://xjib.f.msgs.jp/n/form/xjib/TzaFp3VDGdfDv98EkDAPb',
    status: '非公開',
    type: '新規・更新登録フォーム',
    updatedAt: '2026/04/01 17:30',
    updatedBy: '作成者（管理者同等）',
    count: 0,
  },
];

export function findFormById(id: number): FormRow | undefined {
  return MOCK_FORMS.find((form) => form.id === id);
}
