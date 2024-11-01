import React from 'react';

interface Prediction {
  className: string;
  probability: number;
}

interface PredictionResultsProps {
  predictions: Prediction[];
}

export default function PredictionResults({ predictions }: PredictionResultsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Results</h2>
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50"
          >
            <span className="text-lg text-gray-800">
              {prediction.className}
            </span>
            <div className="flex items-center">
              <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${prediction.probability * 100}%`,
                  }}
                />
              </div>
              <span className="text-gray-600 w-16">
                {(prediction.probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}