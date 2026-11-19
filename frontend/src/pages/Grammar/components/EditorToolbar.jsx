import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Undo2,
} from "lucide-react";

const TOOL_GROUPS = [
  [
    {
      label: "粗體",
      icon: Bold,
      isActive: (editor) => editor.isActive("bold"),
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "斜體",
      icon: Italic,
      isActive: (editor) => editor.isActive("italic"),
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "刪除線",
      icon: Strikethrough,
      isActive: (editor) => editor.isActive("strike"),
      run: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "行內程式碼",
      icon: Code,
      isActive: (editor) => editor.isActive("code"),
      run: (editor) => editor.chain().focus().toggleCode().run(),
    },
  ],
  [
    {
      label: "標題 2",
      icon: Heading2,
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
      run: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "標題 3",
      icon: Heading3,
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
      run: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "項目符號清單",
      icon: List,
      isActive: (editor) => editor.isActive("bulletList"),
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "編號清單",
      icon: ListOrdered,
      isActive: (editor) => editor.isActive("orderedList"),
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "引用",
      icon: Quote,
      isActive: (editor) => editor.isActive("blockquote"),
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "程式碼區塊",
      icon: SquareCode,
      isActive: (editor) => editor.isActive("codeBlock"),
      run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
  ],
  [
    {
      label: "復原",
      icon: Undo2,
      can: (editor) => editor.can().chain().focus().undo().run(),
      run: (editor) => editor.chain().focus().undo().run(),
    },
    {
      label: "重做",
      icon: Redo2,
      can: (editor) => editor.can().chain().focus().redo().run(),
      run: (editor) => editor.chain().focus().redo().run(),
    },
  ],
];

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="grammar-toolbar" role="toolbar" aria-label="筆記編輯工具">
      {TOOL_GROUPS.map((group, groupIndex) => (
        <div className="grammar-toolbar-group" key={groupIndex}>
          {group.map((action) => {
            const Icon = action.icon;
            const isActive = action.isActive?.(editor);
            const canRun = action.can ? action.can(editor) : true;

            return (
              <button
                key={action.label}
                type="button"
                className={`grammar-toolbar-button ${isActive ? "is-active" : ""}`}
                title={action.label}
                aria-label={action.label}
                aria-pressed={action.isActive ? isActive : undefined}
                disabled={!canRun}
                onClick={() => action.run(editor)}
              >
                <Icon size={17} strokeWidth={1.8} />
              </button>
            );
          })}

          {groupIndex < TOOL_GROUPS.length - 1 && (
            <span className="grammar-toolbar-divider" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

export default EditorToolbar;
