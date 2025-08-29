import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  fileType: 'pdf' | 'epub';
  pageCount: number;
  pages: string[];
  uploadDate: Date;
}

const Reader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Polish');

  useEffect(() => {
    // Load book from localStorage
    if (bookId) {
      const storedBooks = localStorage.getItem('bookLibrary');
      if (storedBooks) {
        const books: Book[] = JSON.parse(storedBooks);
        const foundBook = books.find(b => b.id === bookId);
        if (foundBook) {
          setBook(foundBook);
          setOriginalText(foundBook.pages[0] || 'No content available');
          setTranslatedText('[Translation will appear here after clicking "Translate Page"]');
        }
      }
    }
  }, [bookId]);

  useEffect(() => {
    // Update text when page changes
    if (book && book.pages[currentPage - 1]) {
      setOriginalText(book.pages[currentPage - 1]);
      setTranslatedText('[Translation will appear here after clicking "Translate Page"]');
    }
  }, [currentPage, book]);

  const translatePage = async () => {
    setIsTranslating(true);
    
    // Simulate AI translation delay
    setTimeout(() => {
      const mockTranslation = `Rozdział 1: Początek

Lorem ipsum dolor sit amet to przykładowy tekst używany w przemyśle drukarskim i składzie tekstu. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua została przetłumaczona na język polski.

Sed ut perspiciatis unde omnis iste natus error - ta część została również przetłumaczona przez AI, pokazując jak system będzie działał z prawdziwą integracją OpenAI.

Nemo enim ipsam voluptatem - tutaj widzimy jak AI zachowuje strukturę paragrafów i kontekst podczas tłumaczenia księgi.`;
      
      setTranslatedText(mockTranslation);
      setIsTranslating(false);
    }, 2000);
  };

  if (!book) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>📚 Loading Book...</h2>
          <p>Please wait while we load your book.</p>
          <button 
            onClick={() => window.location.href = '/library'}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <div className="reader-container">
      <div className="reader-header">
        <button onClick={() => window.location.href = '/library'}>
          ← Back to Library
        </button>
        <h2>{book ? `${book.title} - Page ${currentPage}` : 'Loading...'}</h2>
        <div className="reader-controls">
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="Polish">Polish</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
          <button 
            onClick={translatePage} 
            disabled={isTranslating}
            className="translate-btn"
          >
            {isTranslating ? '🔄 Translating...' : '🌍 Translate Page'}
          </button>
        </div>
      </div>

      <div className="reader-content">
        <div className="text-panel original">
          <h3>📖 Original Text</h3>
          <div className="text-content">
            {originalText.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="text-panel translated">
          <h3>🌍 AI Translation ({targetLanguage})</h3>
          <div className="text-content">
            {translatedText.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="reader-navigation">
        <button 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          ← Previous Page
        </button>
        <span>Page {currentPage} of {book?.pageCount || 0}</span>
        <button 
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!book || currentPage >= book.pageCount}
        >
          Next Page →
        </button>
      </div>
    </div>
    </div>
  );
};

export default Reader;
