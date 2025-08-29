import React, { useState } from 'react';

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);

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

  const handleFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'pdf' || fileType === 'epub') {
      console.log('File uploaded:', file.name);
      // TODO: Process file and add to library
      alert(`File "${file.name}" uploaded successfully!`);
    } else {
      alert('Please upload only PDF or EPUB files');
    }
  };

  return (
    <div className="upload-container">
      <h1>📚 Book Reader - Upload</h1>
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.epub"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>Drop your book here or click to browse</h3>
            <p>Supports PDF and EPUB formats</p>
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
