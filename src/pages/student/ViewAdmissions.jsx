import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";

export default function Transcripts() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Successfully uploaded: ${file.name}`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <>
      <Navbar />
      <div className="transcripts-container">
        <main className="transcripts-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Upload Academic Documents</h1>
                <p>Upload your transcripts, certificates, and academic records for verification</p>
              </div>
              <div className="header-graphic">
                <div className="graphic-icon">📚</div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-card">
              <div className="upload-header">
                <h2>Upload New Document</h2>
                <p>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
              </div>
              
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'file-selected' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                
                <div className="upload-content">
                  <div className="upload-icon">📤</div>
                  {file ? (
                    <>
                      <h3>{file.name}</h3>
                      <p>Size: {formatFileSize(file.size)} • Type: {file.name.split('.').pop().toUpperCase()}</p>
                      <span className="file-ready">Ready to upload</span>
                    </>
                  ) : (
                    <>
                      <h3>Drag & drop your file here</h3>
                      <p>or click to browse files</p>
                      <span className="browse-text">Browse Files</span>
                    </>
                  )}
                </div>
              </div>

              <div className="upload-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={!file}
                >
                  Clear Selection
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="spinner"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-section">
            <h3>Why Upload Your Documents?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Fast Processing</h4>
                <p>Quick verification and processing of your academic records</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h4>Secure Storage</h4>
                <p>Your documents are stored securely with encryption</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Easy Access</h4>
                <p>Access your documents anytime from your dashboard</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h4>Better Opportunities</h4>
                <p>Increase your chances with verified academic records</p>
              </div>
            </div>
          </div>

          {/* Upload Progress (Visible during upload) */}
          {isUploading && (
            <div className="upload-progress">
              <div className="progress-header">
                <h4>Uploading Document...</h4>
                <span>Please wait while we process your file</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .transcripts-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .transcripts-main {
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .header-text h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 400px;
        }

        .header-graphic {
          display: flex;
          justify-content: center;
        }

        .graphic-icon {
          font-size: 4rem;
          opacity: 0.8;
        }

        .upload-section {
          margin-bottom: 40px;
        }

        .upload-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .upload-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .upload-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .upload-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .upload-area {
          border: 3px dashed #d1d5db;
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 30px;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }

        .upload-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .upload-area:hover::before {
          left: 100%;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .upload-area.drag-active {
          border-color: #667eea;
          background: #f0f4ff;
          transform: scale(1.02);
        }

        .upload-area.file-selected {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .upload-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .upload-content p {
          color: #6b7280;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .upload-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .file-ready {
          color: #10b981;
          font-weight: 600;
          padding: 8px 16px;
          background: #dcfce7;
          border-radius: 20px;
          font-size: 0.9rem;
          border: 2px solid #10b981;
        }

        .browse-text {
          color: #667eea;
          font-weight: 600;
          padding: 10px 20px;
          background: #eff6ff;
          border-radius: 10px;
          font-size: 0.9rem;
          border: 2px solid #667eea;
          transition: all 0.3s ease;
        }

        .upload-area:hover .browse-text {
          background: #667eea;
          color: white;
        }

        .upload-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .features-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .features-section h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .feature-card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .feature-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        .upload-progress {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          animation: slideUp 0.3s ease;
        }

        .progress-header {
          margin-bottom: 15px;
        }

        .progress-header h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .progress-header span {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        @media (max-width: 768px) {
          .transcripts-main {
            padding: 20px;
          }
          
          .page-header {
            padding: 30px 25px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .upload-card {
            padding: 25px;
          }
          
          .upload-area {
            padding: 40px 20px;
          }
          
          .upload-actions {
            flex-direction: column;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .transcripts-main {
            padding: 15px;
          }
          
          .page-header {
            padding: 25px 20px;
          }
          
          .header-text h1 {
            font-size: 1.75rem;
          }
          
          .upload-card {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}