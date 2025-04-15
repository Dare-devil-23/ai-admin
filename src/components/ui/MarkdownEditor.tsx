"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "./Tabs";
import { cn } from "../../lib/utils";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, Image, Heading1, Heading2, Save, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  onSave?: () => void;
  onCancelEdit?: () => void;
}

export function MarkdownEditor({
  content,
  onChange,
  className,
  placeholder = "Write your markdown content here...",
  readOnly = false,
  onSave,
  onCancelEdit,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(readOnly ? "preview" : "edit");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Update activeTab when readOnly changes
  useEffect(() => {
    setActiveTab(readOnly ? "preview" : "edit");
  }, [readOnly]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setHasUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setShowConfirmation(true);
    } else if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const confirmCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    setShowConfirmation(false);
    setHasUnsavedChanges(false);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);
      const newText = beforeText + prefix + selectedText + suffix + afterText;

      onChange(newText);
      setHasUnsavedChanges(true);

      // Set selection to after the inserted markdown
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length + selectedText.length;
      }, 0);
    }
  };

  const editorToolbar = (
    <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('# ')}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('## ')}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('**', '**')}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('*', '*')}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('- ')}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('1. ')}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('[', '](url)')}
        title="Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('![alt text](', ')')}
        title="Image"
      >
        <Image size={16} />
      </button>
      <button
        className="p-1.5 rounded hover:bg-secondary"
        onClick={() => insertMarkdown('```\n', '\n```')}
        title="Code Block"
      >
        <Code size={16} />
      </button>
      <div className="flex-grow"></div>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1.5 rounded text-xs font-medium ${hasUnsavedChanges ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          title="Save"
        >
          <span className="flex items-center gap-1">
            <Save size={14} />
            Save
          </span>
        </button>
        <button
          className="px-3 py-1.5 rounded bg-secondary text-xs font-medium flex items-center gap-1"
          onClick={handleCancelEdit}
          title="Cancel"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  );

  // Confirmation dialog
  const confirmationDialog = showConfirmation && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="text-lg font-bold mb-4">Unsaved Changes</h3>
        <p className="mb-6">You have unsaved changes. Are you sure you want to exit the editor?</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-secondary text-foreground rounded"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
            onClick={confirmCancelEdit}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(`w-full rounded-md ${!readOnly ? "border" : ''}`, className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="edit" className="p-0 focus-visible:outline-none focus-visible:ring-0 data-[state=active]:flex data-[state=active]:flex-col">
          {editorToolbar}
          <textarea
            ref={textareaRef}
            className="w-full min-h-[400px] p-4 bg-secondary/20 resize-none focus:outline-none"
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            disabled={readOnly}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4">
          <div className="prose max-w-none dark:prose-invert">
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeMathjax, rehypeRaw]}
                urlTransform={(url: string) => url}
                components={{
                  img: ({ node, ...props }) => props?.src && <img {...props} className="max-w-full" />,
                  table: ({ node, ...props }) => <table {...props} className="border-collapse table-auto w-full" />,
                  th: ({ node, ...props }) => <th {...props} className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left" />,
                  td: ({ node, ...props }) => <td {...props} className="border border-slate-300 dark:border-slate-700 px-4 py-2" />
                }}
                children={content}
              />
            ) : (
              <p className="text-muted-foreground italic">No content to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      {confirmationDialog}
    </div>
  );
} 