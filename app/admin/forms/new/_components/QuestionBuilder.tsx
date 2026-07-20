'use client';

import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import QuestionEditorCard from './QuestionEditorCard';
import { createQuestion } from '@/lib/questionTypes';
import type { Question } from '@/lib/questionTypes';
import { saveAsTemplate } from '@/lib/templates';

type Props = {
  questions: Question[];
  onChange: (questions: Question[]) => void;
};

export default function QuestionBuilder({ questions, onChange }: Props) {
  const dragIndex = useRef<number | null>(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  function handleSaveTemplate() {
    if (!templateName.trim()) return;
    saveAsTemplate(templateName.trim(), questions);
    setSavedMessage(`テンプレート「${templateName.trim()}」として保存しました。`);
    setTemplateName('');
    setShowSaveTemplate(false);
  }

  function moveQuestion(from: number, to: number) {
    if (from === to) return;
    const next = [...questions];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fs-6 fw-bold mb-0">質問項目</h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={questions.length === 0}
            onClick={() => setShowSaveTemplate(true)}
          >
            テンプレートとして保存
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onChange([...questions, createQuestion()])}
          >
            + 質問を追加
          </Button>
        </div>
      </div>

      {savedMessage && <div className="text-success small mb-3">{savedMessage}</div>}

      {questions.length === 0 && (
        <div className="text-muted small text-center py-4 border rounded">
          まだ質問がありません。「+ 質問を追加」から作成してください。
        </div>
      )}

      {questions.map((question, index) => (
        <QuestionEditorCard
          key={question.id}
          question={question}
          index={index}
          onChange={(updated) => {
            const next = [...questions];
            next[index] = updated;
            onChange(next);
          }}
          onRemove={() => onChange(questions.filter((_, i) => i !== index))}
          dragHandlers={{
            draggable: true,
            onDragStart: () => {
              dragIndex.current = index;
            },
            onDragOver: (e) => {
              e.preventDefault();
            },
            onDrop: () => {
              if (dragIndex.current === null) return;
              moveQuestion(dragIndex.current, index);
              dragIndex.current = null;
            },
          }}
        />
      ))}

      <Modal show={showSaveTemplate} onHide={() => setShowSaveTemplate(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">テンプレートとして保存</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="templateName">
            <Form.Label className="small text-muted">テンプレート名</Form.Label>
            <Form.Control
              type="text"
              placeholder="例: 満足度調査テンプレート"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSaveTemplate(false)}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={handleSaveTemplate} disabled={!templateName.trim()}>
            保存する
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
