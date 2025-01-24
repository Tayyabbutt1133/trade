// components/RichTextEditor.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { Button } from '@/components/ui/button';

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    immediatelyRender: false,
    onUpdate : ({editor}) => {
        onChange(editor.getHTML())
    },
    editorProps: {
        attributes: {
            class: "min-h-[150px] cursor-text rounded-md border p-5  focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 "
        }
    },
    content: '<p>Start typing...</p>',
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
        <Button onClick={() => editor.chain().focus().setLink({ href: prompt('URL') }).run()}>Link</Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered List</Button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;