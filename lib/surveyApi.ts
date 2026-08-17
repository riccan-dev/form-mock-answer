import type { FormRow, FormStatus } from '@/lib/mockForms';
import type { Question, QuestionType } from '@/lib/questionTypes';

export type QuestionResponse = {
  id: number;
  type: QuestionType;
  label: string;
  options: string[] | null;
  matrixRows: string[] | null;
  scaleMax: number | null;
  scaleMinLabel: string | null;
  scaleMaxLabel: string | null;
  allowOther: boolean | null;
};

export type SurveyResponse = {
  id: number;
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'closed';
  targetDepartments: string[];
  dueDate: string | null;
  distributionStartedAt: string | null;
  createdAt: string;
  responseCount: number;
  totalCount: number;
  answeredByRespondent: boolean | null;
  questions: QuestionResponse[];
};

const STATUS_LABELS: Record<SurveyResponse['status'], FormStatus> = {
  draft: '下書き',
  published: '配信中',
  closed: '回収終了',
};

function mapQuestion(question: QuestionResponse): Question {
  return {
    id: String(question.id),
    type: question.type,
    label: question.label,
    options: question.options ?? [],
    matrixRows: question.matrixRows ?? [],
    scaleMax: question.scaleMax ?? 5,
    scaleMinLabel: question.scaleMinLabel ?? '',
    scaleMaxLabel: question.scaleMaxLabel ?? '',
    allowOther: question.allowOther ?? false,
  };
}

export type OptionCountResponse = {
  label: string;
  count: number;
};

export type QuestionResultResponse = {
  questionId: number;
  type: QuestionType;
  label: string;
  counts: OptionCountResponse[] | null;
  freeTextAnswers: string[] | null;
};

export type SurveyResultsResponse = {
  responseCount: number;
  questions: QuestionResultResponse[];
};

export function mapSurveyResponseToFormRow(survey: SurveyResponse): FormRow {
  const createdAt = survey.createdAt.slice(0, 10);

  return {
    id: survey.id,
    name: survey.title,
    url: '',
    status: STATUS_LABELS[survey.status],
    targetDepartments: survey.targetDepartments,
    dueDate: survey.dueDate ?? undefined,
    distributionStartAt: survey.distributionStartedAt ?? undefined,
    createdAt,
    responseCount: survey.responseCount,
    totalCount: survey.totalCount,
    updatedAt: createdAt,
    updatedBy: '作成者（管理者同等）',
    myStatus:
      survey.answeredByRespondent === null
        ? undefined
        : survey.answeredByRespondent
          ? '回答済み'
          : '未回答',
    questions: survey.questions.map(mapQuestion),
  };
}
