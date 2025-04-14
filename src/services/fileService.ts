import { useState, useEffect } from 'react';

// Simulate file data structure
export interface TopicFile {
  id: number;
  topicId: number;
  subtopicId: number;
  type: 'book' | 'ai-notes' | 'question-bank';
  content: string;
  fileName: string;
  uploaded: boolean;
}

// Path mapping for subtopics to markdown files
const subtopicFileMap: Record<number, { type: string, path: string, uploaded: boolean }[]> = {
  1: [ // Algebra
    { type: 'book', path: '/markdown/math/algebra.md', uploaded: true },
    { type: 'ai-notes', path: '/markdown/math/algebra_ai_notes.md', uploaded: true },
    { type: 'question-bank', path: '/markdown/math/algebra_questions.md', uploaded: true }
  ],
  2: [ // Calculus
    { type: 'book', path: '', uploaded: false },
    { type: 'ai-notes', path: '', uploaded: false },
    { type: 'question-bank', path: '', uploaded: false }
  ],
  3: [ // Mechanics
    { type: 'book', path: '', uploaded: false },
    { type: 'ai-notes', path: '', uploaded: false },
    { type: 'question-bank', path: '', uploaded: false }
  ],
  4: [ // Thermodynamics
    { type: 'book', path: '', uploaded: false },
    { type: 'ai-notes', path: '', uploaded: false },
    { type: 'question-bank', path: '', uploaded: false }
  ]
};

// In-memory storage for files
const mockFiles: TopicFile[] = [];

// Initialize some files only in browser environment
if (typeof window !== 'undefined') {
  (async () => {
    // Add default files based on the map
    for (const [subtopicId, files] of Object.entries(subtopicFileMap)) {
      const sid = parseInt(subtopicId);
      const topicId = sid <= 2 ? 1 : 2; // Assuming subtopics 1-2 are Math, 3-4 are Physics
      
      for (const fileInfo of files) {
        const newFile: TopicFile = {
          id: mockFiles.length + 1,
          topicId,
          subtopicId: sid,
          type: fileInfo.type as 'book' | 'ai-notes' | 'question-bank',
          content: '',
          fileName: fileInfo.path.split('/').pop() || '',
          uploaded: fileInfo.uploaded
        };
        
        mockFiles.push(newFile);
        
        // Pre-fetch content for uploaded files
        if (fileInfo.uploaded && fileInfo.path) {
          try {
            // Use the same URL formatting as in fetchMarkdownContent
            const url = fileInfo.path.startsWith('/') 
              ? new URL(fileInfo.path, window.location.origin).href 
              : fileInfo.path;
              
            const response = await fetch(url);
            if (response.ok) {
              const content = await response.text();
              newFile.content = content;
            }
          } catch (error) {
            console.error('Error loading markdown file:', error);
            // Set a fallback content instead of leaving it empty
            newFile.content = `# Could Not Load Content\n\nThere was an error loading the content for ${fileInfo.path}.\n\nPlease try again later.`;
          }
        }
      }
    }
  })();
}

// Helper function to fetch markdown content
async function fetchMarkdownContent(path: string): Promise<string> {
  try {
    // In server environment, return a placeholder
    if (typeof window === 'undefined') {
      return '# Content will load in browser\n\nThis content is only available in the browser environment.';
    }
    
    // Fix the URL by ensuring it's properly formatted
    // If it starts with /, make it relative to the base URL
    const url = path.startsWith('/') 
      ? new URL(path, window.location.origin).href 
      : path;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown:', error);
    // Return a fallback content instead of empty string
    return `# Fallback Content\n\nThe requested content could not be loaded.\n\nPath: ${path}`;
  }
}

// Hook to get files for a specific subtopic and type
export function useTopicFiles(subtopicId: number | null, fileType: 'book' | 'ai-notes' | 'question-bank' | null = null) {
  const [files, setFiles] = useState<TopicFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch files from the mockFiles array
    const fetchFiles = async () => {
      setLoading(true);
      
      let filteredFiles = mockFiles.filter(file => file.subtopicId === subtopicId);
      
      if (fileType) {
        filteredFiles = filteredFiles.filter(file => file.type === fileType);
      }
      
      // Load content for each file that doesn't have content yet
      for (const file of filteredFiles) {
        if (file.uploaded && !file.content) {
          const fileInfo = subtopicFileMap[file.subtopicId]?.find(f => f.type === file.type);
          if (fileInfo?.path) {
            file.content = await fetchMarkdownContent(fileInfo.path);
          }
        }
      }
      
      setFiles([...filteredFiles]); // Create a new array to trigger re-render
      setLoading(false);
    };

    if (subtopicId) {
      fetchFiles();
    } else {
      setFiles([]);
      setLoading(false);
    }
  }, [subtopicId, fileType]);

  return { files, loading };
}

// Hook to get a single file
export function useTopicFile(subtopicId: number | null, fileType: 'book' | 'ai-notes' | 'question-bank') {
  const [file, setFile] = useState<TopicFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      
      if (!subtopicId) {
        setFile(null);
        setLoading(false);
        return;
      }
      
      // Find the file in our mock database
      let foundFile = mockFiles.find(
        file => file.subtopicId === subtopicId && file.type === fileType
      );
      
      // If not found, create a new entry
      if (!foundFile) {
        const topicId = subtopicId <= 2 ? 1 : 2; // Assuming subtopics 1-2 are Math, 3-4 are Physics
        
        foundFile = {
          id: mockFiles.length + 1,
          topicId,
          subtopicId,
          type: fileType,
          content: '',
          fileName: '',
          uploaded: false
        };
        
        mockFiles.push(foundFile);
      }
      
      // If file is uploaded but content not loaded, fetch it
      if (foundFile.uploaded && !foundFile.content) {
        const fileInfo = subtopicFileMap[subtopicId]?.find(f => f.type === fileType);
        if (fileInfo?.path) {
          foundFile.content = await fetchMarkdownContent(fileInfo.path);
        }
      }
      
      setFile(foundFile);
      setLoading(false);
    };

    fetchFile();
  }, [subtopicId, fileType]);

  return { file, loading, updateFile };
}

// Function to update file content
function updateFile(updatedFile: TopicFile) {
  const index = mockFiles.findIndex(file => 
    file.subtopicId === updatedFile.subtopicId && file.type === updatedFile.type
  );
  
  if (index >= 0) {
    mockFiles[index] = updatedFile;
  } else {
    // Create new file if doesn't exist
    mockFiles.push(updatedFile);
  }
  
  return updatedFile;
}

// Function to simulate file upload
export function uploadFile(subtopicId: number, fileType: 'book' | 'ai-notes' | 'question-bank', content: string, fileName: string) {
  const existingFileIndex = mockFiles.findIndex(
    file => file.subtopicId === subtopicId && file.type === fileType
  );
  
  if (existingFileIndex >= 0) {
    // Update existing file
    mockFiles[existingFileIndex].content = content;
    mockFiles[existingFileIndex].fileName = fileName;
    mockFiles[existingFileIndex].uploaded = true;
    return mockFiles[existingFileIndex];
  } else {
    // Create new file
    const newId = Math.max(...mockFiles.map(file => file.id), 0) + 1;
    const topicId = subtopicId <= 2 ? 1 : 2; // Assuming subtopics 1-2 are Math, 3-4 are Physics
    
    const newFile: TopicFile = {
      id: newId,
      topicId,
      subtopicId,
      type: fileType,
      content,
      fileName,
      uploaded: true
    };
    
    mockFiles.push(newFile);
    return newFile;
  }
} 