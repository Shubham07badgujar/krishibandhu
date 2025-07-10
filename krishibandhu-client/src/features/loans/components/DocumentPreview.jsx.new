// filepath: d:\Krishibandhu - Copy\krishibandhu-client\src\features\loans\components\DocumentPreview.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getDocumentUrl, getDocumentInfo, fetchDocumentWithAuth } from '../services/loanService';

// Document type display names
const DOCUMENT_TYPE_LABELS = {
  aadharCard: 'Aadhar Card',
  panCard: 'PAN Card',
  bankStatement: 'Bank Statement',
  landDocument: 'Land Document',
  incomeProof: 'Income Proof',
  bankPassbook: 'Bank Passbook',
  addressProof: 'Address Proof',
  other: 'Other Document'
};

const DocumentPreview = ({ document }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  // Use blob URL for authenticated document access
  const [secureDocumentUrl, setSecureDocumentUrl] = useState(null);
  
  // Ref to store and revoke blob URLs when component unmounts
  const blobUrlRef = useRef(null);

  // Handle document format display
  const getDocumentFormat = () => {
    if (!document || !document.path) return '';
    
    const extension = document.path.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'unknown';
  };
  
  // Get display name for document type
  const getDocumentTypeLabel = () => {
    if (!document || !document.documentType) return DOCUMENT_TYPE_LABELS.other;
    return DOCUMENT_TYPE_LABELS[document.documentType] || DOCUMENT_TYPE_LABELS.other;
  };

  // Load document info and content on component mount or when document changes
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (!document || !document.path || !document.loanId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch document info and content in parallel
        const [info, docBlob] = await Promise.all([
          getDocumentInfo(document.loanId, document.path),
          fetchDocumentWithAuth(document.loanId, document.path)
        ]);
        
        setDocumentInfo(info);
        
        // Create a secure blob URL that includes authentication
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current); // Clean up previous blob URL
        }
        
        const secureUrl = URL.createObjectURL(docBlob);
        blobUrlRef.current = secureUrl;
        setSecureDocumentUrl(secureUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please check your permissions.');
        setIsLoading(false);
      }
    };

    fetchDocumentData();
    
    // Clean up function to revoke blob URL when component unmounts
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [document]);

  const documentFormat = getDocumentFormat();
  const documentTypeLabel = getDocumentTypeLabel();
  
  // Get loan ID from the document
  const loanId = document.loanId || (document._id ? document._id.toString() : null);
  
  // Toggle fullscreen preview
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Close fullscreen on escape key
  if (isFullscreen) {
    window.onkeydown = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
  }

  if (!document) {
    return null;
  }

  // Early return if we're missing loan ID - this is critical for document access
  if (!loanId) {
    return (
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 text-center text-red-500">
          Cannot display document: Missing loan reference
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {documentFormat === 'image' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {documentFormat === 'pdf' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            <div>
              <span className="text-sm font-medium">{document.name || document.path.split('/').pop()}</span>
              <div className="flex items-center">
                <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded mr-2">
                  {documentTypeLabel}
                </span>
                <span className="text-xs text-gray-500">
                  {documentInfo?.size 
                    ? `${(documentInfo.size / 1024).toFixed(1)} KB` 
                    : document.size 
                      ? `${(document.size / 1024).toFixed(1)} KB` 
                      : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={toggleFullscreen}
              className="text-gray-600 hover:text-gray-900"
              disabled={isLoading || error || !secureDocumentUrl}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <a
              href={secureDocumentUrl}
              download={document.name || document.path.split('/').pop()}
              className={`text-gray-600 hover:text-gray-900 ${(isLoading || error || !secureDocumentUrl) ? 'pointer-events-none opacity-50' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="p-4 h-60 flex items-center justify-center bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading document...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          ) : documentFormat === 'image' && secureDocumentUrl ? (
            <img 
              src={secureDocumentUrl} 
              alt={document.name || "Document image"}
              className="max-w-full max-h-full object-contain" 
              onError={(e) => {
                console.error('Image failed to load');
                setError('Failed to load image. Please check permissions.');
              }}
            />
          ) : documentFormat === 'pdf' && secureDocumentUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <embed
                src={`${secureDocumentUrl}#view=FitH`}
                type="application/pdf"
                width="100%"
                height="100%"
                onError={() => {
                  console.error('PDF failed to load');
                  setError('Failed to load PDF. Please check permissions.');
                }}
              />
              <a 
                href={secureDocumentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Open PDF in new tab
              </a>
            </div>
          ) : (
            <div className="text-gray-500">
              {secureDocumentUrl ? 'This file type cannot be previewed' : 'Document loading failed'}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen preview modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl max-h-screen flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
              <span className="font-medium">{document.name || document.path.split('/').pop()}</span>
              <div className="flex space-x-4">
                <a
                  href={secureDocumentUrl}
                  download={document.name || document.path.split('/').pop()}
                  className={`text-blue-600 hover:text-blue-800 ${!secureDocumentUrl ? 'pointer-events-none opacity-50' : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-gray-50 overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 text-lg">Loading document...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try again
                  </button>
                </div>
              ) : documentFormat === 'image' && secureDocumentUrl ? (
                <img 
                  src={secureDocumentUrl} 
                  alt={document.name || "Document image"} 
                  className="max-w-full max-h-full object-contain" 
                  onError={() => setError('Failed to load image. Please check permissions.')}
                />
              ) : documentFormat === 'pdf' && secureDocumentUrl ? (
                <iframe
                  src={`${secureDocumentUrl}#view=FitH`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title={document.name || "Document"}
                  onError={() => setError('Failed to load PDF. Please check permissions.')}
                />
              ) : (
                <div className="text-gray-500 text-lg">
                  {secureDocumentUrl ? 'This file type cannot be previewed' : 'Document loading failed'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentPreview;
