import React, { useMemo } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import { Button } from "@/components/ui/button"
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, LinkIcon, ImageIcon 
} from "lucide-react"
import "@/app/styles/prosecss.css"

const RichTextEditor = ({
  // Core functionality
  content = "<p>Start typing...</p>",
  onChange = () => {},
  placeholder = "Start typing...",

  // Optional nested form management
  sectionId = null,
  itemId = null,
  updateItem = null,

  // Customization
  extensions = [],
  className = "",
  
  // Toolbar Configuration
  defaultButtons = true,
  customButtons = [],

  // Constraints
  maxLength = null,
  required = false,

  // Additional props
  readOnly = false
}) => {
  const editorExtensions = useMemo(() => [
    StarterKit.configure({
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
    }),
    Heading.configure({ levels: [1, 2, 3] }),
    BulletList,
    OrderedList,
    ListItem,
    Image,
    Link.configure({
      openOnClick: false,
    }),
    ...extensions
  ], [extensions])

  const editor = useEditor({
    extensions: editorExtensions,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      
      // Check max length if specified
      if (maxLength && html.length > maxLength) {
        editor.commands.setContent(html.slice(0, maxLength))
        return
      }

      onChange(html)
      
      if (updateItem && sectionId && itemId) {
        updateItem(sectionId, itemId, "details", html)
      }
    },
    content,
    editorProps: {
      attributes: {
        class: `min-h-[150px] h-full cursor-text rounded-md border p-5 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className}`,
        placeholder: placeholder,
      },
    },
    editable: !readOnly,
  })

  if (!editor) {
    return null
  }

  const addImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result
      if (typeof src === "string") {
        editor.chain().focus().setImage({ src }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter the URL of the link:", previousUrl)
    if (url === null) {
      return
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const ImageButton = ({ icon }) => {
    return (
      <Button
        variant="outline"
        size="icon"
        type="button"
        disabled={readOnly}
        onClick={() => {
          const input = document.createElement("input")
          input.setAttribute("type", "file")
          input.setAttribute("accept", "image/*")
          input.onchange = (event) => {
            const file = event.target.files[0]
            if (file) {
              addImage(file)
            }
          }
          input.click()
        }}
      >
        {icon}
      </Button>
    )
  }

  const defaultEditorButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isDisabled: () => !editor.can().chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold")
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isDisabled: () => !editor.can().chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic")
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 })
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 })
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 })
    },
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList")
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList")
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      onClick: setLink,
      isActive: () => editor.isActive("link")
    }
  ]

  // Combine default and custom buttons
  const allButtons = [...defaultEditorButtons, ...customButtons]

  return (
    <div className="border rounded-md p-4">
      {!readOnly && defaultButtons && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              type="button"
              size="icon"
              onClick={button.onClick}
              disabled={button.isDisabled?.()}
              className={button.isActive?.() ? "bg-slate-500" : ""}
            >
              {button.icon}
            </Button>
          ))}
          {!readOnly && <ImageButton icon={<ImageIcon className="h-4 w-4" />} />}
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert" 
      />
      {maxLength && (
        <div className="text-sm text-gray-500 mt-2">
          {editor.getHTML().length} / {maxLength} characters
        </div>
      )}
      {required && content.trim() === "" && (
        <div className="text-red-500 text-sm mt-2">
          This field is required
        </div>
      )}
    </div>
  )
}

export default RichTextEditor