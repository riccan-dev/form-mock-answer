'use client';

import Form from 'react-bootstrap/Form';
import type { Question } from '@/lib/questionTypes';
import type { Answers, AnswerValue } from '@/lib/mockForms';

const OTHER_LABEL = 'その他';

type Props = {
  question: Question;
  answers: Answers;
  onAnswerChange: (key: string, value: AnswerValue) => void;
};

export default function QuestionAnswerField({ question, answers, onAnswerChange }: Props) {
  const value = answers[question.id];
  const otherKey = `${question.id}__other`;
  const otherText = (answers[otherKey] as string) ?? '';

  if (question.type === 'single') {
    const selected = (value as string) ?? '';
    return (
      <div>
        {question.options.map((option) => (
          <Form.Check
            key={option}
            type="radio"
            name={question.id}
            label={option}
            checked={selected === option}
            onChange={() => onAnswerChange(question.id, option)}
          />
        ))}
        {question.allowOther && (
          <>
            <Form.Check
              type="radio"
              name={question.id}
              label={OTHER_LABEL}
              checked={selected === OTHER_LABEL}
              onChange={() => onAnswerChange(question.id, OTHER_LABEL)}
            />
            {selected === OTHER_LABEL && (
              <Form.Control
                size="sm"
                className="mt-2"
                placeholder="自由記述"
                value={otherText}
                onChange={(e) => onAnswerChange(otherKey, e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  }

  if (question.type === 'multiple') {
    const selected = (value as string[]) ?? [];
    const toggle = (option: string) => {
      const next = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option];
      onAnswerChange(question.id, next);
    };
    return (
      <div>
        {question.options.map((option) => (
          <Form.Check
            key={option}
            type="checkbox"
            label={option}
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
          />
        ))}
        {question.allowOther && (
          <>
            <Form.Check
              type="checkbox"
              label={OTHER_LABEL}
              checked={selected.includes(OTHER_LABEL)}
              onChange={() => toggle(OTHER_LABEL)}
            />
            {selected.includes(OTHER_LABEL) && (
              <Form.Control
                size="sm"
                className="mt-2"
                placeholder="自由記述"
                value={otherText}
                onChange={(e) => onAnswerChange(otherKey, e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  }

  if (question.type === 'scale') {
    const selected = (value as string) ?? '';
    const scale = Array.from({ length: question.scaleMax }, (_, i) => String(i + 1));
    return (
      <div>
        <div className="d-flex align-items-center gap-3">
          <span className="small text-muted">{question.scaleMinLabel}</span>
          {scale.map((n) => (
            <Form.Check
              key={n}
              type="radio"
              name={question.id}
              label={n}
              inline
              checked={selected === n}
              onChange={() => onAnswerChange(question.id, n)}
            />
          ))}
          <span className="small text-muted">{question.scaleMaxLabel}</span>
        </div>
      </div>
    );
  }

  if (question.type === 'matrix') {
    const rowAnswers = (value as Record<string, string>) ?? {};
    return (
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th />
              {question.options.map((col) => (
                <th key={col} className="text-center small fw-normal">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.matrixRows.map((row) => (
              <tr key={row}>
                <td className="small">{row}</td>
                {question.options.map((col) => (
                  <td key={col} className="text-center">
                    <Form.Check
                      type="radio"
                      name={`${question.id}-${row}`}
                      checked={rowAnswers[row] === col}
                      onChange={() =>
                        onAnswerChange(question.id, { ...rowAnswers, [row]: col })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <Form.Control
        as="textarea"
        rows={3}
        value={(value as string) ?? ''}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
      />
    );
  }

  // text / number / date
  return (
    <Form.Control
      type={question.type === 'number' ? 'number' : question.type === 'date' ? 'date' : 'text'}
      value={(value as string) ?? ''}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
    />
  );
}
