// Shared TypeScript interfaces for the Book Reader application

export interface Book {
  id: string;
  title: string;
  author: string;
  fileType: 'pdf' | 'epub';
  filePath: string;
  pageCount: number;
  uploadDate: Date;
  lastReadPage?: number;
}

export interface BookPage {
  pageNumber: number;
  content: string;
  wordCount: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  pageNumber: number;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: string;
  createdAt: Date;
}

export interface Annotation {
  id: string;
  bookId: string;
  pageNumber: number;
  selectedText: string;
  note: string;
  color: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  bookId: string;
  pageNumber: number;
  createdAt: Date;
}

export interface UserPreferences {
  fontSize: number;
  fontFamily: 'serif1' | 'serif2' | 'sans1' | 'sans2';
  backgroundColor: string;
  textColor: string;
  lineHeight: number;
  pageWidth: number;
  defaultLanguage: string;
}

export interface SearchResult {
  bookId: string;
  pageNumber: number;
  context: string;
  highlightedText: string;
  position: number;
}

export interface DictionaryEntry {
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation?: string;
  examples?: string[];
}

export interface WikipediaEntry {
  title: string;
  summary: string;
  url: string;
  image?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadResponse {
  bookId: string;
  title: string;
  pageCount: number;
  processingStatus: 'processing' | 'completed' | 'error';
}
