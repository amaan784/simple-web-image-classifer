import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Brain } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import UploadZone from './UploadZone';
import PredictionResults from './PredictionResults';

interface Prediction {
  className: string;
  probability: number;
}

export default function ImageClassifier() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        setIsLoading(true);
        // Initialize TensorFlow.js backend
        await tf.setBackend('webgl');
        await tf.ready();
        // Load MobileNet model
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Error initializing TensorFlow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTensorFlow();
  }, []);

  const classifyImage = async (imageElement: HTMLImageElement) => {
    if (!model) return;
    
    try {
      const predictions = await model.classify(imageElement);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error classifying image:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setImage(dataUrl);
        
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => classifyImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setImage(dataUrl);
        
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => classifyImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Image Classifier</h1>
          <p className="text-lg text-gray-600">
            Upload an image and let our ML model identify what it sees
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : image ? (
              <div>
                <img
                  src={image}
                  alt="Uploaded"
                  className="max-h-96 mx-auto rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <UploadZone onImageUpload={handleImageUpload} isDragging={isDragging} />
            )}
          </div>
        </div>

        {predictions.length > 0 && <PredictionResults predictions={predictions} />}
      </div>
    </div>
  );
}