import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDragging: boolean;
}

export default function UploadZone({ onImageUpload, isDragging }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4">
        <ImageIcon className="w-16 h-16 text-gray-400" />
        <div className="text-gray-600">
          <p className="mb-2">Drag and drop an image here, or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose a file
          </button>
        </div>
      </div>
    </>
  );
}