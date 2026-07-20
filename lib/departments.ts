export type Department = {
  name: string;
  headcount: number;
};

export const DEPARTMENTS: Department[] = [
  { name: '営業本部', headcount: 12 },
  { name: '開発本部', headcount: 40 },
  { name: '人事本部', headcount: 8 },
  { name: '管理本部', headcount: 50 },
  { name: 'マーケティング本部', headcount: 45 },
  { name: 'カスタマーサポート本部', headcount: 65 },
];

export const TOTAL_HEADCOUNT = DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0);

export function getHeadcount(departmentNames: string[]): number {
  if (departmentNames.includes('全社')) return TOTAL_HEADCOUNT;
  return DEPARTMENTS.filter((d) => departmentNames.includes(d.name)).reduce(
    (sum, d) => sum + d.headcount,
    0
  );
}
