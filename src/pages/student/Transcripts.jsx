import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/ApplicationContext";

export default function Transcripts() {
  const { user } = useAuth();
  const { transcripts, uploadTranscript, deleteTranscript } = useAppData();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const links = [
    { to: "/student/profile", label: "Update Profile / Documents" },
    { to: "/student/apply", label: "Apply for Courses" },
    { to: "/student/admissions", label: "Admissions Results" },
    { to: "/student/jobs", label: "Job Postings" },
    { to: "/student/transcripts", label: "Upload Transcripts / Certificates" },
  ];

  // Filter only this student's transcripts
  const myTranscripts = transcripts.filter((t) => t.studentId === user.id);

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
      await uploadTranscript(user.id, file);
      setFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (transcriptId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteTranscript(transcriptId);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().includes('.pdf')) return '📄';
    if (fileName?.toLowerCase().includes('.doc')) return '📝';
    if (fileName?.toLowerCase().includes('.jpg') || fileName?.toLowerCase().includes('.png')) return '🖼️';
    return '📎';
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
        <Sidebar links={links} />
        
        <main className="transcripts-main">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Academic Documents</h1>
                <p>Upload and manage your transcripts, certificates, and academic records</p>
              </div>
              <div className="header-stats">
                <div className="stat-card">
                  <div className="stat-icon">📄</div>
                  <div className="stat-info">
                    <span className="stat-number">{myTranscripts.length}</span>
                    <span className="stat-label">Uploaded Files</span>
                  </div>
                </div>
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
                      <p>Size: {formatFileSize(file.size)}</p>
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
                  Clear
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
                      📤 Upload Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="documents-section">
            <div className="section-header">
              <h2>Your Documents</h2>
              <p>Manage your uploaded academic records</p>
            </div>

            {myTranscripts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No documents uploaded yet</h3>
                <p>Upload your first transcript or certificate to get started</p>
              </div>
            ) : (
              <div className="documents-grid">
                {myTranscripts.map((transcript) => (
                  <div key={transcript.id} className="document-card">
                    <div className="document-header">
                      <div className="document-icon">
                        {getFileIcon(transcript.fileName)}
                      </div>
                      <div className="document-info">
                        <h4>{transcript.fileName}</h4>
                        <p>Uploaded {new Date(transcript.uploadedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="document-actions">
                        <button className="action-btn view" title="View">
                          👁️
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete"
                          onClick={() => handleDelete(transcript.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="document-meta">
                      <span className="meta-item">
                        <span className="meta-label">Type:</span>
                        <span className="meta-value">
                          {transcript.fileName?.split('.').pop()?.toUpperCase() || 'File'}
                        </span>
                      </span>
                      <span className="meta-item">
                        <span className="meta-label">Status:</span>
                        <span className="status-verified">Verified</span>
                      </span>
                    </div>

                    <div className="document-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '100%'}}></div>
                      </div>
                      <span className="progress-text">Upload Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .transcripts-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .transcripts-main {
          flex: 1;
          padding: 30px;
          margin-left: 280px;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
          margin-bottom: 10px;
          background: linear-gradient(135deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 500px;
          line-height: 1.6;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .upload-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .upload-header p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 15px;
          padding: 50px 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 25px 0;
          background: #fafafa;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f8fafc;
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
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .upload-content p {
          color: #6b7280;
          margin-bottom: 12px;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .file-ready {
          color: #10b981;
          font-weight: 600;
          padding: 6px 12px;
          background: #dcfce7;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .browse-text {
          color: #667eea;
          font-weight: 600;
          padding: 8px 16px;
          background: #eff6ff;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .upload-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .documents-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 25px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .section-header p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 60px 30px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: #374151;
        }

        .documents-grid {
          display: grid;
          gap: 20px;
        }

        .document-card {
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 25px;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .document-card:hover {
          border-color: #667eea;
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .document-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .document-icon {
          font-size: 2rem;
        }

        .document-info {
          flex: 1;
        }

        .document-info h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .document-info p {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .action-btn.view:hover {
          background: #dbeafe;
        }

        .action-btn.delete:hover {
          background: #fef2f2;
        }

        .document-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
        }

        .meta-label {
          color: #6b7280;
        }

        .meta-value {
          color: #374151;
          font-weight: 500;
        }

        .status-verified {
          color: #10b981;
          font-weight: 600;
          padding: 2px 8px;
          background: #dcfce7;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        .document-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .transcripts-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .header-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 25px;
          }
          
          .header-text h1 {
            font-size: 2rem;
          }
          
          .upload-actions {
            flex-direction: column;
          }
          
          .document-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .document-actions {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .transcripts-main {
            padding: 15px;
          }
          
          .upload-card, .documents-section {
            padding: 20px;
          }
          
          .upload-area {
            padding: 30px 15px;
          }
        }
      `}</style>
    </>
  );
}