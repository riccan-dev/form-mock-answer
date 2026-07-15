'use client';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

export default function Toolbar() {
  return (
    <div className="d-flex align-items-center gap-2 px-4 py-3">
      <InputGroup style={{ maxWidth: 420 }}>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="ID、フォーム名、メモ、公開用URL、更新者を検索"
        />
      </InputGroup>

      <DropdownButton variant="outline-secondary" title="フォームタイプ - すべて">
        <Dropdown.Item>すべて</Dropdown.Item>
        <Dropdown.Item>新規・更新登録フォーム</Dropdown.Item>
      </DropdownButton>

      <DropdownButton variant="outline-secondary" title="フォルダ - すべて">
        <Dropdown.Item>すべて</Dropdown.Item>
      </DropdownButton>

      <div className="flex-grow-1" />

      <Button variant="light" title="エクスポート">⭳</Button>
      <Button variant="light" title="設定">⚙</Button>
    </div>
  );
}
