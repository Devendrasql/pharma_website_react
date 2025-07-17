import React, { useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';

interface PrescriptionUploadProps {
  onUpload: (file: File) => void;
  onClose: () => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setUploadedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = () => {
    if (uploadedFile) {
      onUpload(uploadedFile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Upload Prescription</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload your prescription</h3>
            <p className="text-gray-500 mb-4">Drag and drop or click to select</p>
            
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 inline-flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Choose File</span>
                </div>
              </label>
              
              <div className="text-sm text-gray-500">
                Supported formats: JPG, PNG, PDF (Max 5MB)
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">File uploaded successfully</p>
                  <p className="text-sm text-green-600">{uploadedFile.name}</p>
                </div>
              </div>
            </div>

            {preview && (
              <div className="border rounded-lg p-2">
                <img src={preview} alt="Prescription preview" className="w-full h-48 object-contain" />
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ensure prescription is clearly visible</li>
                <li>• Doctor's signature must be present</li>
                <li>• Prescription should be recent (within 30 days)</li>
                <li>• Our pharmacist will verify before processing</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setPreview(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Upload Different
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};