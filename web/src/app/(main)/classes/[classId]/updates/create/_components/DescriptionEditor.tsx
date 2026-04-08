"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";
import type { CreateUpdateFormData } from "@/types/update.types";
import { cn } from "@/lib/utils";
import { RICH_TEXT_STLYES } from "@/components/ui/RichTextContent";

interface DescriptionEditorProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

type CommandAction =
  | { kind: "command"; cmd: string; value?: string }
  | { kind: "block"; tag: string }
  | { kind: "link" };

interface ToolbarItem {
  icon: React.ReactNode;
  label: string;
  action: CommandAction;
  active?: string;
}

const TOOLBAR: (ToolbarItem | "divider")[] = [
  { icon: <Undo2 size={15} />, label: "Undo", action: { kind: "command", cmd: "undo" } },
  { icon: <Redo2 size={15} />, label: "Redo", action: { kind: "command", cmd: "redo" } },
  "divider",
  { icon: <Bold size={15} />, label: "Bold", action: { kind: "command", cmd: "bold" }, active: "bold" },
  { icon: <Italic size={15} />, label: "Italic", action: { kind: "command", cmd: "italic" }, active: "italic" },
  { icon: <Underline size={15} />, label: "Underline", action: { kind: "command", cmd: "underline" }, active: "underline" },
  { icon: <Strikethrough size={15} />, label: "Strike", action: { kind: "command", cmd: "strikeThrough" }, active: "strikeThrough" },
  "divider",
  { icon: <Heading1 size={15} />, label: "H1", action: { kind: "block", tag: "h1" } },
  { icon: <Heading2 size={15} />, label: "H2", action: { kind: "block", tag: "h2" } },
  { icon: <Heading3 size={15} />, label: "H3", action: { kind: "block", tag: "h3" } },
  "divider",
  { icon: <List size={15} />, label: "Bullets", action: { kind: "command", cmd: "insertUnorderedList" } },
  { icon: <ListOrdered size={15} />, label: "Numbers", action: { kind: "command", cmd: "insertOrderedList" } },
  { icon: <Quote size={15} />, label: "Quote", action: { kind: "block", tag: "blockquote" } },
  "divider",
  { icon: <LinkIcon size={15} />, label: "Link", action: { kind: "link" } },
  { icon: <Code size={15} />, label: "Code", action: { kind: "block", tag: "code" } },
  { icon: <RemoveFormatting size={15} />, label: "Clear", action: { kind: "command", cmd: "removeFormat" } },
];

export function DescriptionEditor({ form, setForm }: DescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  /**
   * 1. SYNC FROM BACKEND/FORM TO EDITOR
   * This ensures that when data arrives from the API, it is displayed in the editor.
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Only update if the content is actually different and we aren't currently typing
    if (form.description !== editor.innerHTML && !isInternalUpdate.current) {
      editor.innerHTML = form.description || "";
    }
  }, [form.description]);

  /**
   * 2. CLEAN HTML & SYNC TO FORM
   * Removes messy inline styles and data attributes (like oklab, data-path) 
   * to keep the character count low and prevent database errors.
   */
  const syncToForm = useCallback(() => {
    if (!editorRef.current) return;

    const rawHtml = editorRef.current.innerHTML;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawHtml;

    // Remove all messy attributes that bloat character count
    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("data-path-to-node");
      el.removeAttribute("data-index-in-node");
      el.removeAttribute("class");
    });

    const cleanHtml = tempDiv.innerHTML;

    isInternalUpdate.current = true;
    setForm((prev) => ({ ...prev, description: cleanHtml }));

    // Reset the internal update flag after the state cycle
    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 0);
  }, [setForm]);

  /**
   * 3. EXECUTE TOOLBAR COMMANDS
   */
  const execAction = useCallback((action: CommandAction) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    if (action.kind === "command") {
      document.execCommand(action.cmd, false, action.value ?? "");
    }

    if (action.kind === "block") {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const selected = range.extractContents();
      const el = document.createElement(action.tag);
      el.appendChild(selected);
      range.insertNode(el);
    }

    if (action.kind === "link") {
      const url = window.prompt("Enter URL:", "https://");
      if (url) document.execCommand("createLink", false, url);
    }

    syncToForm();
  }, [syncToForm]);

  const isActive = (queryCmd?: string): boolean => {
    if (!queryCmd) return false;
    try { return document.queryCommandState(queryCmd); } catch { return false; }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
        Description
      </label>

      <div className="bg-slate-50 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary transition-all overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-slate-200 bg-slate-100/50 flex-wrap">
          {TOOLBAR.map((item, idx) => {
            if (item === "divider") {
              return <div key={`div-${idx}`} className="w-px h-5 bg-slate-300 mx-1 shrink-0" />;
            }
            const active = isActive(item.active);
            return (
              <button
                key={item.label}
                type="button"
                title={item.label}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents editor from losing focus
                  execAction(item.action);
                }}
                className={cn(
                  "p-1.5 rounded transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-200",
                  active && "bg-primary/10 text-primary"
                )}
              >
                {item.icon}
              </button>
            );
          })}
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Write a description for your update..."
          className={cn(RICH_TEXT_STLYES, "min-h-37.5 p-4")}
          onInput={syncToForm}
          onPaste={(e) => {
            // Forces plain text paste to avoid messy external HTML
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
        />
      </div>

      <p className="text-[10px] text-slate-400">
        Rich text enabled. Use toolbar or shortcuts (Ctrl+B, Ctrl+I).
      </p>

      {/* Placeholder CSS */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}