import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Disable PDF.js worker to avoid loading issues (will be slower but more reliable)
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

interface ProcessedBook {
  id: string;
  title: string;
  author: string;
  fileType: 'pdf' | 'epub';
  pageCount: number;
  pages: string[];
  uploadDate: Date;
}

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const processPDF = async (file: File): Promise<ProcessedBook> => {
    console.log('Starting PDF processing for file:', file.name, 'Size:', file.size);
    setProcessingStatus('Reading PDF file...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('PDF file read into array buffer, size:', arrayBuffer.byteLength);
      
      setProcessingStatus('Loading PDF document...');
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer
      }).promise;
      
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      const pages: string[] = [];
      
      setProcessingStatus(`Extracting text from ${pdf.numPages} pages...`);
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProcessingStatus(`Processing page ${pageNum} of ${pdf.numPages}...`);
        
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Extract text from the page
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          pages.push(pageText || `[Page ${pageNum} - No text content]`);
          console.log(`Page ${pageNum} processed, text length:`, pageText.length);
          
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          pages.push(`[Page ${pageNum} - Error extracting text]`);
        }
      }
      
      // Generate a simple ID and extract title from filename
      const bookId = Date.now().toString();
      const title = file.name.replace('.pdf', '').replace(/[-_]/g, ' ');
      
      console.log('PDF processing completed successfully');
      
      return {
        id: bookId,
        title: title,
        author: 'Unknown Author',
        fileType: 'pdf',
        pageCount: pages.length,
        pages: pages,
        uploadDate: new Date()
      };
      
    } catch (error) {
      console.error('Error in processPDF:', error);
      
      // If PDF.js fails completely, create a basic book entry
      console.log('PDF.js failed, creating basic book entry');
      const bookId = Date.now().toString();
      const title = file.name.replace('.pdf', '').replace(/[-_]/g, ' ');
      
      return {
        id: bookId,
        title: title,
        author: 'Unknown Author',
        fileType: 'pdf',
        pageCount: 1,
        pages: [`[PDF Upload Error] This PDF could not be processed automatically. 
        
File: ${file.name}
Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

The PDF was uploaded but text extraction failed. This could be due to:
- Password-protected PDF
- Scanned images (no text layer)
- Corrupted file
- Complex formatting

You can still view this as a placeholder in your library.`],
        uploadDate: new Date()
      };
    }
  };

  const saveBookToLibrary = (book: ProcessedBook) => {
    const existingBooks = JSON.parse(localStorage.getItem('bookLibrary') || '[]');
    const updatedBooks = [...existingBooks, book];
    localStorage.setItem('bookLibrary', JSON.stringify(updatedBooks));
  };

  const handleFile = async (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'pdf') {
      setIsProcessing(true);
      setProcessingStatus('Starting PDF processing...');
      
      try {
        const processedBook = await processPDF(file);
        saveBookToLibrary(processedBook);
        
        setProcessingStatus('');
        setIsProcessing(false);
        
        if (processedBook.pageCount === 1 && processedBook.pages[0].includes('[PDF Upload Error]')) {
          alert(`"${processedBook.title}" uploaded as placeholder!\n\nText extraction failed, but the file is saved in your library. You may need to try a different PDF file for full text extraction.`);
        } else {
          alert(`"${processedBook.title}" uploaded successfully!\n${processedBook.pageCount} pages processed.`);
        }
        
        // Navigate to library after successful upload
        setTimeout(() => {
          window.location.href = '/library';
        }, 1000);
        
      } catch (error) {
        console.error('Error processing PDF:', error);
        console.error('Error details:', error.message);
        setIsProcessing(false);
        setProcessingStatus('');
        alert(`Error processing PDF file: ${error.message}\n\nPlease try again with a different PDF file.`);
      }
    } else if (fileType === 'epub') {
      alert('EPUB support coming soon! Please use PDF files for now.');
    } else {
      alert('Please upload only PDF or EPUB files');
    }
  };

  return (
    <div className="upload-container">
      <h1>📚 Book Reader - Upload</h1>
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={isProcessing ? undefined : handleDrag}
        onDragLeave={isProcessing ? undefined : handleDrag}
        onDragOver={isProcessing ? undefined : handleDrag}
        onDrop={isProcessing ? undefined : handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.epub"
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-content">
            {isProcessing ? (
              <>
                <div className="upload-icon">⏳</div>
                <h3>Processing your book...</h3>
                <p>{processingStatus}</p>
                <div className="processing-spinner">🔄</div>
              </>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <h3>Drop your book here or click to browse</h3>
                <p>Supports PDF and EPUB formats</p>
              </>
            )}
          </div>
        </label>
      </div>

      <div className="actions">
        <button onClick={() => window.location.href = '/library'}>
          📖 Go to Library
        </button>
      </div>
    </div>
  );
};

export default Upload;
