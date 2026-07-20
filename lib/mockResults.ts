import type { Question } from '@/lib/questionTypes';

export type OptionCount = { label: string; count: number };

// 実際の個票データは持たないため、回答者数から見た目上妥当な分布を決定的に生成する
function distribute(total: number, buckets: number, seedOffset = 0): number[] {
  if (buckets === 0 || total === 0) return Array(buckets).fill(0);
  const weights = Array.from({ length: buckets }, (_, i) => ((i + seedOffset) % buckets) + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.floor((w / weightSum) * total));
  let diff = total - counts.reduce((a, b) => a + b, 0);
  let i = 0;
  while (diff > 0) {
    counts[i % counts.length] += 1;
    diff -= 1;
    i += 1;
  }
  return counts;
}

export function getOptionCounts(question: Question, totalResponses: number): OptionCount[] {
  if (question.type === 'single' || question.type === 'multiple') {
    const options = question.allowOther ? [...question.options, 'その他'] : question.options;
    const counts = distribute(totalResponses, options.length);
    return options.map((label, i) => ({ label, count: counts[i] }));
  }
  if (question.type === 'scale') {
    const levels = Array.from({ length: question.scaleMax }, (_, i) => String(i + 1));
    const counts = distribute(totalResponses, levels.length);
    return levels.map((label, i) => ({ label, count: counts[i] }));
  }
  return [];
}

export function getMatrixCounts(
  question: Question,
  totalResponses: number
): Record<string, OptionCount[]> {
  const result: Record<string, OptionCount[]> = {};
  question.matrixRows.forEach((row, rowIndex) => {
    const counts = distribute(totalResponses, question.options.length, rowIndex + 1);
    result[row] = question.options.map((label, i) => ({ label, count: counts[i] }));
  });
  return result;
}

const SAMPLE_FREE_TEXT_ANSWERS = [
  '特にありません。',
  '今のところ満足しています。',
  '業務量の見直しをお願いしたいです。',
  'もう少し休暇を取りやすくしてほしいです。',
];

export function getSampleFreeTextAnswers(count: number): string[] {
  const n = Math.min(count, SAMPLE_FREE_TEXT_ANSWERS.length);
  return SAMPLE_FREE_TEXT_ANSWERS.slice(0, n);
}
