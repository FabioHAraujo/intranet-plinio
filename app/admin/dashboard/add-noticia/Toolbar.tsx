'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

type Props = {
  editor: Editor | null;
};

const Toolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  const Button = ({ onClick, icon: Icon, isActive }: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault(); // Impede comportamento padrão para evitar problemas no editor
        onClick();
      }}
      className={`p-2 rounded-md transition-colors ${
        isActive ? 'bg-sky-500 text-white' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="flex flex-wrap gap-3 w-full border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-t-md">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={Bold}
        isActive={editor.isActive('bold')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={Italic}
        isActive={editor.isActive('italic')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        icon={Underline}
        isActive={editor.isActive('underline')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={Strikethrough}
        isActive={editor.isActive('strike')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={Heading1}
        isActive={editor.isActive('heading', { level: 1 })}
      />
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={List}
        isActive={editor.isActive('bulletList')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={ListOrdered}
        isActive={editor.isActive('orderedList')}
      />
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={Quote}
        isActive={editor.isActive('blockquote')}
      />
      <Button
        onClick={() => editor.chain().focus().setCode().run()}
        icon={Code}
        isActive={editor.isActive('code')}
      />
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        icon={Undo}
        isActive={false}
      />
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        icon={Redo}
        isActive={false}
      />
    </div>
  );
};

export default Toolbar;
