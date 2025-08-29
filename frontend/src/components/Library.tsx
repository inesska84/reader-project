import React, { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  fileType: 'pdf' | 'epub';
  pageCount: number;
  pages: string[];
  uploadDate: Date;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Load books from localStorage
    const storedBooks = localStorage.getItem('bookLibrary');
    if (storedBooks) {
      const parsedBooks = JSON.parse(storedBooks);
      setBooks(parsedBooks);
    }
  }, []);

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
        {books.length === 0 ? (
          <div className="empty-library">
            <p>No books uploaded yet</p>
            <button onClick={() => window.location.href = '/'}>
              Upload your first book
            </button>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => openBook(book.id)}>
              <div className="book-cover">
                <div className="file-type-badge">{book.fileType.toUpperCase()}</div>
                📖
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="pages">{book.pageCount} pages</p>
                <p className="upload-date">
                  Uploaded: {new Date(book.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;
