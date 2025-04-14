"use client";

import React, { useState, useRef } from "react";
import { Upload, File, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface FileUploadProps {
  onUpload: (content: string, fileName: string) => void;
  className?: string;
  label?: string;
  acceptedFileTypes?: string;
}

export function FileUpload({
  onUpload,
  className,
  label = "Upload PDF or Markdown",
  acceptedFileTypes = ".pdf,.md,.markdown",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    
    // Start mock upload process
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Simulate network delay
      setTimeout(() => {
        onUpload(content, file.name);
        setIsUploading(false);
        setUploadComplete(true);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setUploadComplete(false);
          setSelectedFile(null);
        }, 2000);
      }, 1000);
    };
    
    reader.readAsText(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes}
        className="hidden"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-pulse bg-primary h-12 w-12 rounded-full flex items-center justify-center">
            <File className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-center text-muted-foreground">Uploading {selectedFile?.name}...</p>
        </div>
      ) : uploadComplete ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-green-500 h-12 w-12 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-center text-muted-foreground">Upload complete!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              Drag and drop your file here or{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={openFileDialog}
              >
                click to browse
              </button>
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 