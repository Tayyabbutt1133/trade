"use client"

import "./styles/prosecss.css";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Bold,
  Columns2Icon as ColumnSpanIcon,
  Combine,
  Grid2X2,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Rows2Icon as RowSpanIcon,
  SplitSquareHorizontal,
  TableIcon,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

const RichTextEditor = ({
  content = "<p>Start typing...</p>",
  onChange = () => {},
  placeholder = "Start typing...",
  sectionId = null,
  itemId = null,
  updateItem = null,
  extensions = [],
  className = "",
  defaultButtons = true,
  customButtons = [],
  maxLength = null,
  required = false,
  readOnly = false,
}) => {
  const editorExtensions = useMemo(
    () => [
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
      // Table.configure({
      //   resizable: true,
      // }),
      // TableRow,
      // TableHeader,
      // TableCell,
      ...extensions,
    ],
    [extensions]
  );

  const editor = useEditor({
    extensions: editorExtensions,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      if (maxLength && html.length > maxLength) {
        editor.commands.setContent(html.slice(0, maxLength));
        return;
      }

      onChange(html);

      if (updateItem && sectionId && itemId) {
        updateItem(sectionId, itemId, "details", html);
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
  });

  if (!editor) {
    return null;
  }

  const addImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src === "string") {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL of the link:", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const ImageButton = ({ icon }) => {
    return (
      <Button
        variant="outline"
        size="icon"
        type="button"
        disabled={readOnly}
        onClick={() => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              addImage(file);
            }
          };
          input.click();
        }}
      >
        {icon}
      </Button>
    );
  };

  const defaultEditorButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isDisabled: () => !editor.can().chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isDisabled: () => !editor.can().chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      onClick: () => setLink(),
      isActive: () => editor.isActive("link"),
    },
  ];

  const TableButton = ({ icon, onClick, isDisabled, tooltip }) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="icon"
            onClick={() => onClick()}
            disabled={isDisabled?.()}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  // const tableButtons = [
  //   {
  //     icon: <TableIcon className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  //     tooltip: "Insert table",
  //   },
  //   {
  //     icon: <ColumnSpanIcon className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().addColumnBefore().run(),
  //     isDisabled: () => !editor.can().addColumnBefore(),
  //     tooltip: "Add column before",
  //   },
  //   {
  //     icon: <ColumnSpanIcon className="h-4 w-4 rotate-180" />,
  //     onClick: () => editor.chain().focus().addColumnAfter().run(),
  //     isDisabled: () => !editor.can().addColumnAfter(),
  //     tooltip: "Add column after",
  //   },
  //   {
  //     icon: <RowSpanIcon className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().addRowBefore().run(),
  //     isDisabled: () => !editor.can().addRowBefore(),
  //     tooltip: "Add row before",
  //   },
  //   {
  //     icon: <RowSpanIcon className="h-4 w-4 rotate-180" />,
  //     onClick: () => editor.chain().focus().addRowAfter().run(),
  //     isDisabled: () => !editor.can().addRowAfter(),
  //     tooltip: "Add row after",
  //   },
  //   {
  //     icon: <Trash2 className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().deleteTable().run(),
  //     isDisabled: () => !editor.can().deleteTable(),
  //     tooltip: "Delete table",
  //   },
  //   {
  //     icon: <Combine className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().mergeCells().run(),
  //     isDisabled: () => !editor.can().mergeCells(),
  //     tooltip: "Merge cells",
  //   },
  //   {
  //     icon: <SplitSquareHorizontal className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().splitCell().run(),
  //     isDisabled: () => !editor.can().splitCell(),
  //     tooltip: "Split cell",
  //   },
  //   {
  //     icon: <Grid2X2 className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().toggleHeaderRow().run(),
  //     isDisabled: () => !editor.can().toggleHeaderRow(),
  //     tooltip: "Toggle header row",
  //   },
  //   {
  //     icon: <AlignVerticalJustifyStart className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
  //     isDisabled: () => !editor.can().toggleHeaderColumn(),
  //     tooltip: "Toggle header column",
  //   },
  //   {
  //     icon: <AlignVerticalJustifyEnd className="h-4 w-4" />,
  //     onClick: () => editor.chain().focus().toggleHeaderCell().run(),
  //     isDisabled: () => !editor.can().toggleHeaderCell(),
  //     tooltip: "Toggle header cell",
  //   },
  // ];

  const allButtons = [...defaultEditorButtons, ...customButtons];

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
              onClick={() => button.onClick()}
              disabled={button.isDisabled?.()}
              className={button.isActive?.() ? "bg-slate-500" : ""}
            >
              {button.icon}
            </Button>
          ))}
          {/* <TooltipProvider>
            <div className="flex gap-2">
              {tableButtons.map((button, index) => (
                <TableButton
                  key={`table-${index}`}
                  icon={button.icon}
                  onClick={button.onClick}
                  isDisabled={button.isDisabled}
                  tooltip={button.tooltip}
                />
              ))}
            </div>
          </TooltipProvider> */}
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
  );
};

export default RichTextEditor;