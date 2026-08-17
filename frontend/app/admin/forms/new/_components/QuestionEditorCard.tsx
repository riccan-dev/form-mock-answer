'use client';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CHOICE_TYPES, QUESTION_TYPE_LABELS } from '@/lib/questionTypes';
import type { Question, QuestionType } from '@/lib/questionTypes';

type Props = {
  question: Question;
  index: number;
  onChange: (question: Question) => void;
  onRemove: () => void;
  dragHandlers: {
    draggable: boolean;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
  };
};

function OptionListEditor({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange: (options: string[]) => void;
}) {
  return (
    <div className="mb-3">
      <Form.Label className="small text-muted mb-1">{label}</Form.Label>
      {options.map((option, i) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <Form.Control
            size="sm"
            value={option}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onChange(options.filter((_, j) => j !== i))}
            disabled={options.length <= 1}
          >
            削除
          </Button>
        </div>
      ))}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => onChange([...options, `選択肢${options.length + 1}`])}
      >
        + 選択肢を追加
      </Button>
    </div>
  );
}

export default function QuestionEditorCard({
  question,
  index,
  onChange,
  onRemove,
  dragHandlers,
}: Props) {
  const isChoiceType = CHOICE_TYPES.includes(question.type);

  return (
    <div
      className="card mb-3"
      draggable={dragHandlers.draggable}
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
    >
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="text-muted" style={{ cursor: 'grab' }} title="ドラッグで並び替え">
            ⠿
          </span>
          <span className="text-muted small">質問 {index + 1}</span>
          <div className="flex-grow-1" />
          <Form.Select
            size="sm"
            style={{ maxWidth: 220 }}
            value={question.type}
            onChange={(e) => {
              const type = e.target.value as QuestionType;
              onChange({
                ...question,
                type,
                options:
                  type === 'single' || type === 'multiple' || type === 'matrix'
                    ? question.options.length
                      ? question.options
                      : ['選択肢1', '選択肢2']
                    : question.options,
                matrixRows:
                  type === 'matrix'
                    ? question.matrixRows.length
                      ? question.matrixRows
                      : ['項目1', '項目2']
                    : question.matrixRows,
                allowOther: CHOICE_TYPES.includes(type) ? question.allowOther : false,
              });
            }}
          >
            {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
          <Button variant="outline-danger" size="sm" onClick={onRemove}>
            質問を削除
          </Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Control
            placeholder="質問文を入力"
            value={question.label}
            onChange={(e) => onChange({ ...question, label: e.target.value })}
          />
        </Form.Group>

        {isChoiceType && (
          <>
            <OptionListEditor
              label="選択肢"
              options={question.options}
              onChange={(options) => onChange({ ...question, options })}
            />
            <Form.Check
              label="「その他」を選択肢に追加する（選択時のみ自由記述欄を表示）"
              checked={question.allowOther}
              onChange={(e) => onChange({ ...question, allowOther: e.target.checked })}
            />
          </>
        )}

        {question.type === 'matrix' && (
          <>
            <OptionListEditor
              label="項目（行）"
              options={question.matrixRows}
              onChange={(matrixRows) => onChange({ ...question, matrixRows })}
            />
            <OptionListEditor
              label="共通選択肢（列）"
              options={question.options}
              onChange={(options) => onChange({ ...question, options })}
            />
          </>
        )}

        {question.type === 'scale' && (
          <div className="d-flex gap-3">
            <Form.Group style={{ maxWidth: 120 }}>
              <Form.Label className="small text-muted">段階数</Form.Label>
              <Form.Control
                type="number"
                min={3}
                max={10}
                size="sm"
                value={question.scaleMax}
                onChange={(e) => onChange({ ...question, scaleMax: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="flex-grow-1">
              <Form.Label className="small text-muted">最小側ラベル</Form.Label>
              <Form.Control
                size="sm"
                value={question.scaleMinLabel}
                onChange={(e) => onChange({ ...question, scaleMinLabel: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="flex-grow-1">
              <Form.Label className="small text-muted">最大側ラベル</Form.Label>
              <Form.Control
                size="sm"
                value={question.scaleMaxLabel}
                onChange={(e) => onChange({ ...question, scaleMaxLabel: e.target.value })}
              />
            </Form.Group>
          </div>
        )}

        {(question.type === 'text' ||
          question.type === 'textarea' ||
          question.type === 'number' ||
          question.type === 'date') && (
          <div className="text-muted small">
            回答者にはこの質問タイプに応じた入力欄が表示されます（追加設定なし）。
          </div>
        )}
      </div>
    </div>
  );
}
