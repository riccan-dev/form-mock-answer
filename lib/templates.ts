import type { Question } from '@/lib/questionTypes';
import { cloneQuestionWithNewId } from '@/lib/questionTypes';

export type SurveyTemplate = {
  id: string;
  name: string;
  questions: Question[];
};

export const TEMPLATES: SurveyTemplate[] = [
  {
    id: 'tpl-satisfaction',
    name: '満足度調査テンプレート',
    questions: [
      {
        id: 'tpl-satisfaction-1',
        type: 'single',
        label: '総合的な満足度を教えてください',
        options: ['満足', 'やや満足', '普通', 'やや不満', '不満'],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
      {
        id: 'tpl-satisfaction-2',
        type: 'textarea',
        label: 'ご意見・ご要望があればご記入ください',
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
    id: 'tpl-event',
    name: 'イベント参加希望調査テンプレート',
    questions: [
      {
        id: 'tpl-event-1',
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
        id: 'tpl-event-2',
        type: 'text',
        label: '参加希望の日程があれば入力してください',
        options: [],
        matrixRows: [],
        scaleMax: 5,
        scaleMinLabel: '',
        scaleMaxLabel: '',
        allowOther: false,
      },
    ],
  },
];

export function findTemplateById(id: string): SurveyTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function applyTemplate(id: string): Question[] {
  const template = findTemplateById(id);
  if (!template) return [];
  return template.questions.map(cloneQuestionWithNewId);
}

export function saveAsTemplate(name: string, questions: Question[]): SurveyTemplate {
  const newTemplate: SurveyTemplate = {
    id: `tpl-custom-${Date.now()}`,
    name,
    questions: questions.map(cloneQuestionWithNewId),
  };
  TEMPLATES.push(newTemplate);
  return newTemplate;
}
