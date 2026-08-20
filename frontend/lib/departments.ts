export type Department = {
  id: number;
  name: string;
  headcount: number;
};

export const DEPARTMENTS: Department[] = [
  { id: 1, name: '営業本部', headcount: 12 },
  { id: 2, name: '開発本部', headcount: 40 },
  { id: 3, name: '人事本部', headcount: 8 },
  { id: 4, name: '管理本部', headcount: 50 },
  { id: 5, name: 'マーケティング本部', headcount: 45 },
  { id: 6, name: 'カスタマーサポート本部', headcount: 65 },
];

export const TOTAL_HEADCOUNT = DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0);

export function getHeadcount(departmentNames: string[]): number {
  if (departmentNames.includes('全社')) return TOTAL_HEADCOUNT;
  return DEPARTMENTS.filter((d) => departmentNames.includes(d.name)).reduce(
    (sum, d) => sum + d.headcount,
    0
  );
}

export function getDepartmentName(deptId: number): string {
  return DEPARTMENTS.find((d) => d.id === deptId)?.name ?? '';
}
