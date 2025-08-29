import React, { useState } from 'react';

interface ReaderProps {
  bookId?: string;
}

// Mock book content - later we'll load real PDF/EPUB content
const mockContent = {
  originalText: `Chapter 1: The Beginning

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
  
  translatedText: `[Translation will appear here after clicking "Translate Page"]

Click the translate button to see AI translation of the current page.`
};

const Reader: React.FC<ReaderProps> = ({ bookId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [originalText, setOriginalText] = useState(mockContent.originalText);
  const [translatedText, setTranslatedText] = useState(mockContent.translatedText);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Polish');

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

  return (
    <div className="reader-container">
      <div className="reader-header">
        <button onClick={() => window.location.href = '/library'}>
          ← Back to Library
        </button>
        <h2>Book Title - Page {currentPage}</h2>
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
        <span>Page {currentPage} of 150</span>
        <button 
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === 150}
        >
          Next Page →
        </button>
      </div>
    </div>
  );
};

export default Reader;
