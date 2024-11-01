import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center mb-4">
        <Brain className="w-16 h-16 text-indigo-400" />
      </div>
      <p className="text-gray-500">Loading ML model...</p>
    </div>
  );
}