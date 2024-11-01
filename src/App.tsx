import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Upload, Camera, RefreshCw } from 'lucide-react';

function App() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initModel = async () => {
      await tf.ready();
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      setIsLoading(false);
    };
    initModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);
        await classifyImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async (imgUrl: string) => {
    if (!model) return;
    
    setIsLoading(true);
    const img = new Image();
    img.src = imgUrl;
    img.onload = async () => {
      const predictions = await model.classify(img);
      setPrediction(predictions[0].className);
      setIsLoading(false);
    };
  };

  const handleReset = () => {
    setImageUrl('');
    setPrediction('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            AI Image Classifier
          </h1>

          <div className="space-y-6">
            {!imageUrl && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={isLoading}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            )}

            {imageUrl && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-64 object-contain rounded-lg"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Prediction
                  </h3>
                  {isLoading ? (
                    <div className="flex items-center text-gray-600">
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Analyzing image...
                    </div>
                  ) : (
                    <p className="text-xl font-medium text-indigo-600">
                      {prediction}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;