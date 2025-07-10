import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DOCUMENT_TYPES = {
  aadharCard: 'Aadhar Card',
  panCard: 'PAN Card',
  bankStatement: 'Bank Statement (Last 1 Year)',
  landDocument: 'Land Documents',
  incomeProof: 'Income Proof',
  bankPassbook: 'Bank Passbook',
  addressProof: 'Address Proof',
  other: 'Other Documents'
};

const DocumentUploader = ({ onChange, disabled }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [documentType, setDocumentType] = useState('other');
  const [documentTypes, setDocumentTypes] = useState({});
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const invalidFiles = selectedFiles.filter(file => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const isValidType = validTypes.includes(file.type);
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const isValidSize = file.size <= maxSize;
      
      return !isValidType || !isValidSize;
    });
    
    if (invalidFiles.length > 0) {
      setError(t('error.fileValidation', 'Please upload valid files (JPG, PNG, PDF) under 5MB'));
      return;
    }
    
    setError(null);
    
    // Create a copy of the current document types
    const newDocumentTypes = { ...documentTypes };
    
    // Attach document type to files
    const enhancedFiles = selectedFiles.map(file => {
      // Create a copy of the file object with document type
      const enhancedFile = new File([file], file.name, { type: file.type });
      
      // Add document type property
      Object.defineProperty(enhancedFile, 'documentType', {
        value: documentType,
        writable: true,
        enumerable: true
      });
      
      // Add to document types mapping
      newDocumentTypes[enhancedFile.name] = documentType;
      
      return enhancedFile;
    });
    
    const updatedFiles = [...files, ...enhancedFiles];
    setFiles(updatedFiles);
    setDocumentTypes(newDocumentTypes);
    
    // Call parent's onChange handler with files and document types mapping
    if (onChange) {
      onChange(updatedFiles, newDocumentTypes);
    }
  };
    const removeFile = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    
    // Update document types mapping
    const updatedDocumentTypes = { ...documentTypes };
    if (fileToRemove) {
      delete updatedDocumentTypes[fileToRemove.name];
    }
    setDocumentTypes(updatedDocumentTypes);
    
    // Call parent's onChange handler
    if (onChange) {
      onChange(updatedFiles, updatedDocumentTypes);
    }
  };
    // Set document type for the file
  const setDocumentTypeForFile = (index, type) => {
    const updatedFiles = [...files];
    const file = updatedFiles[index];
      if (file) {
      // Update the document type
      file.documentType = type;
      
      // Create a new document types object with the updated type
      const updatedDocumentTypes = {
        ...documentTypes,
        [file.name]: type
      };
      
      setDocumentTypes(updatedDocumentTypes);
      setFiles(updatedFiles);
      
      // Call parent's onChange handler with the updated document types
      if (onChange) {
        onChange(updatedFiles, updatedDocumentTypes);
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {t('loans.documentType', 'Document Type')}
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={disabled}
        >
          {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="document-upload"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={disabled}
        />
        <label 
          htmlFor="document-upload"
          className={`flex flex-col items-center justify-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-gray-400 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">{t('loans.uploadDocuments', 'Upload Documents')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('loans.supportedFormats', 'JPG, JPEG, PNG, PDF (max 5MB)')}</p>
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('loans.selectedDocuments', 'Selected Documents')}</h4>
          <ul className="divide-y divide-gray-200">            {files.map((file, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <div className="flex items-center flex-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-500 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        {DOCUMENT_TYPES[file.documentType || 'other']}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!disabled && (
                  <div className="flex items-center">
                    <select
                      className="text-xs border border-gray-300 rounded mr-2 py-1 px-2"
                      value={file.documentType || 'other'}
                      onChange={(e) => setDocumentTypeForFile(index, e.target.value)}
                      disabled={disabled}
                    >
                      {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
