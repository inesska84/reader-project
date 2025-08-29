import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import Library from './components/Library';
import Reader from './components/Reader';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reader/:bookId" element={<Reader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
