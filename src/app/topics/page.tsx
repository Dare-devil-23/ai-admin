"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/ui/Layout";
import { Upload, ChevronRight, File, Plus, Edit, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Sidebar, { Topic } from "../../components/ui/Sidebar";
import { MarkdownEditor } from "../../components/ui/MarkdownEditor";
import { FileUpload } from "../../components/ui/FileUpload";
import { useTopicFile, uploadFile } from "../../services/fileService";

const DUMMY_TOPICS: Topic[] = [
  {
    id: 1,
    name: "Mathematics",
    subtopics: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Calculus" },
    ],
  },
  {
    id: 2,
    name: "Physics",
    subtopics: [
      { id: 3, name: "Mechanics" },
      { id: 4, name: "Thermodynamics" },
    ],
  },
];

const DUMMY_CONTENT = {
  book: `# Chapter Overview
  
This is the book content for this chapter. It contains detailed explanations of concepts and formulas.

## Key Concepts

- First principle
- Second principle
- Third principle

### Formulas

$$E = mc^2$$

### Examples

Here are some examples to illustrate the concepts discussed in this chapter...`,

  "ai-notes": `# AI Generated Notes

These notes highlight the most important concepts from the chapter.

## Main Takeaways

1. First important point with simplified explanation
2. Second important point with practical applications
3. Third important point with diagrams and illustrations

### Quick Reference

| Concept | Definition | Application |
| ------- | ---------- | ----------- |
| Term 1 | Definition 1 | Where to use |
| Term 2 | Definition 2 | Where to use |`,

  "question-bank": `# Practice Questions

## Multiple Choice

1. What is the correct formula for calculating X?
   - a) X = Y²
   - b) X = Y + Z
   - c) X = Y × Z
   - d) X = Y ÷ Z

2. Which of the following is true about concept Z?

## Problems

1. Calculate the value of X when Y = 5 and Z = 3.

2. Explain the relationship between X and Y in your own words.`
};

export default function TopicsPage() {
  const [topics] = useState(DUMMY_TOPICS);
  const [selectedSubtopic, setSelectedSubtopic] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'book' | 'ai-notes' | 'question-bank'>("book");
  const [markdownContent, setMarkdownContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<'book' | 'ai-notes' | 'question-bank' | null>(null);
  const [pendingSubtopicChange, setPendingSubtopicChange] = useState<number | null>(null);

  // Get the file data for the current subtopic and active tab
  const { file, loading, updateFile } = useTopicFile(selectedSubtopic, activeTab);

  // Auto-select first subtopic if none is selected
  useEffect(() => {
    if (!selectedSubtopic && topics.length > 0 && topics[0].subtopics.length > 0) {
      setSelectedSubtopic(topics[0].subtopics[0].id);
    }
  }, [selectedSubtopic, topics]);

  // Update markdown content when file changes
  useEffect(() => {
    if (file) {
      try {
        setMarkdownContent(file.content || '# No content available\n\nThis section has no content yet.');
      } catch (error) {
        console.error('Error setting markdown content:', error);
        setMarkdownContent('# Error loading content\n\nThere was an error loading this content. Please try again later.');
      }
    } else {
      setMarkdownContent("");
    }
  }, [file]);

  // Safe tab change with confirmation if needed
  const handleTabChange = (newTab: 'book' | 'ai-notes' | 'question-bank') => {
    if (isEditMode && hasUnsavedChanges) {
      // Store the pending tab change and show confirmation
      setPendingTabChange(newTab);
      setShowConfirmDialog(true);
    } else {
      // Safe to change tab directly
      setActiveTab(newTab);
    }
  };

  // Safe subtopic change with confirmation if needed
  const handleSubtopicChange = (subtopicId: number) => {
    if (isEditMode && hasUnsavedChanges) {
      // Store the pending subtopic change and show confirmation
      setPendingSubtopicChange(subtopicId);
      setShowConfirmDialog(true);
    } else {
      // Safe to change subtopic directly
      setSelectedSubtopic(subtopicId);
    }
  };

  // Handle content change in editor
  const handleContentChange = (newContent: string) => {
    setMarkdownContent(newContent);
    setHasUnsavedChanges(true);
  };

  // Handle save content
  const handleSaveContent = () => {
    if (file) {
      updateFile({
        ...file,
        content: markdownContent
      });
    }
    setHasUnsavedChanges(false);
    
    // If there was a pending navigation, handle it now
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    if (pendingSubtopicChange !== null) {
      setSelectedSubtopic(pendingSubtopicChange);
      setPendingSubtopicChange(null);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Revert to original content and exit edit mode
    if (file) {
      setMarkdownContent(file.content);
    }
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    
    // If there was a pending navigation, handle it now
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    if (pendingSubtopicChange !== null) {
      setSelectedSubtopic(pendingSubtopicChange);
      setPendingSubtopicChange(null);
    }
  };

  // Proceed with discarding changes after confirmation
  const handleConfirmDiscard = () => {
    setHasUnsavedChanges(false);
    setShowConfirmDialog(false);
    
    // Apply the pending navigation
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    if (pendingSubtopicChange !== null) {
      setSelectedSubtopic(pendingSubtopicChange);
      setPendingSubtopicChange(null);
    }
    
    // Reset edit mode and revert content
    setIsEditMode(false);
    if (file) {
      setMarkdownContent(file.content);
    }
  };

  // Cancel the confirmation dialog and keep editing
  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setPendingTabChange(null);
    setPendingSubtopicChange(null);
  };

  // Handle file upload - just use dummy data
  const handleFileUpload = (content: string, fileName: string) => {
    if (selectedSubtopic) {
      // Upload dummy data for all three content types
      uploadFile(selectedSubtopic, "book", DUMMY_CONTENT.book, `${fileName}_book.md`);
      uploadFile(selectedSubtopic, "ai-notes", DUMMY_CONTENT["ai-notes"], `${fileName}_ai_notes.md`);
      uploadFile(selectedSubtopic, "question-bank", DUMMY_CONTENT["question-bank"], `${fileName}_questions.md`);
      
      // Set current tab content
      setMarkdownContent(DUMMY_CONTENT[activeTab]);
    }
  };

  // Check if there's content for the current subtopic and tab
  const hasContent = file?.uploaded && file?.content;

  // Confirmation dialog for unsaved changes
  const confirmationDialog = showConfirmDialog && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-2">Unsaved Changes</h3>
          <p className="text-muted-foreground text-sm">
            You have unsaved changes. What would you like to do?
          </p>
        </div>
        <div className="flex flex-row justify-end items-center gap-2 flex-wrap">
          <button 
            className="px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded transition-colors"
            onClick={handleCancelDialog}
          >
            Continue Editing
          </button>
          <button 
            className="px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
            onClick={handleSaveContent}
          >
            Save & Continue
          </button>
          <button 
            className="px-3 py-1.5 text-xs font-medium bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded transition-colors"
            onClick={handleConfirmDiscard}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout className="bg-background">
      {confirmationDialog}
      <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] gap-4">
        <Sidebar
          topics={topics}
          selectedSubtopic={selectedSubtopic}
          onSubtopicSelect={handleSubtopicChange}
          className="w-full md:w-64 md:flex-shrink-0"
          activePage="topics"
        />
        <div className="flex-1 p-4 bg-card rounded-xl overflow-hidden">
          {selectedSubtopic ? (
            hasContent ? (
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "book"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    onClick={() => handleTabChange("book")}
                  >
                    Book
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "ai-notes"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    onClick={() => handleTabChange("ai-notes")}
                  >
                    AI Notes
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "question-bank"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    onClick={() => handleTabChange("question-bank")}
                  >
                    Question Bank
                  </button>

                  <div className="ml-auto">
                    <button
                      className="flex items-center space-x-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90"
                      onClick={() => {
                        if (isEditMode && hasUnsavedChanges) {
                          setShowConfirmDialog(true);
                        } else {
                          // Reset to upload screen
                          if (file) {
                            updateFile({
                              ...file,
                              uploaded: false
                            });
                          }
                        }
                      }}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload again</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Edit</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEditMode ? "bg-primary" : "bg-muted"
                            }`}
                            onClick={() => {
                              if (isEditMode && hasUnsavedChanges) {
                                setShowConfirmDialog(true);
                              } else {
                                setIsEditMode(!isEditMode);
                              }
                            }}
                            role="switch"
                            aria-checked={isEditMode}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                                isEditMode ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pb-6">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
                        </div>
                      ) : (
                        <MarkdownEditor
                          content={markdownContent}
                          onChange={handleContentChange}
                          readOnly={!isEditMode}
                          onSave={handleSaveContent}
                          onCancelEdit={handleCancelEdit}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center text-lg">
                      <File className="mr-2 h-5 w-5" />
                      Upload Chapter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onUpload={handleFileUpload}
                      label="Upload Chapter PDF"
                      className="min-h-[200px]"
                    />
                    <p className="mt-4 text-sm text-center text-muted-foreground">
                      After uploading, our AI will automatically generate the book content, AI notes, and question bank.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a topic to view its content
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}