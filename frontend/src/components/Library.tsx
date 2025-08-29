import React from 'react';

// Mock data for now - later we'll use real uploaded books
const mockBooks = [
  {
    id: '1',
    title: 'Sample Book',
    author: 'Test Author',
    fileType: 'pdf' as const,
    pageCount: 150
  },
  {
    id: '2', 
    title: 'Another Book',
    author: 'Another Author',
    fileType: 'epub' as const,
    pageCount: 200
  }
];

const Library: React.FC = () => {
  const openBook = (bookId: string) => {
    window.location.href = `/reader/${bookId}`;
  };

  return (
    <div className="library-container">
      <h1>📚 Your Library</h1>
      
      <div className="library-header">
        <button onClick={() => window.location.href = '/'}>
          ➕ Upload New Book
        </button>
      </div>

      <div className="books-grid">
        {mockBooks.length === 0 ? (
          <div className="empty-library">
            <p>No books uploaded yet</p>
            <button onClick={() => window.location.href = '/'}>
              Upload your first book
            </button>
          </div>
        ) : (
          mockBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => openBook(book.id)}>
              <div className="book-cover">
                <div className="file-type-badge">{book.fileType.toUpperCase()}</div>
                📖
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="pages">{book.pageCount} pages</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;
