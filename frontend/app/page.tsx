"use client";

import React, { useState } from 'react';
import { CameraScanner } from '@/components/camera-scanner';
import { OverlayEngine } from '@/components/overlay-engine';
import { analyzeImage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to convert base64 to File
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function ScanPage() {
  const [viewState, setViewState] = useState<'scanning' | 'analyzing' | 'results'>('scanning');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: async (imageSrc: string) => {
      const file = dataURLtoFile(imageSrc, 'scan.jpg');
      return await analyzeImage(file);
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setViewState('results');
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (error) => {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please check backend connection.");
      setViewState('scanning'); // Reset on error
    }
  });

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setViewState('analyzing');
    analyzeMutation.mutate(imageSrc);
  };

  const handleReset = () => {
    setViewState('scanning');
    setCapturedImage(null);
    setAnalysisResult(null);
  };



  return (
    <div className="h-[calc(100vh-5rem)] w-full bg-black relative">
      <AnimatePresence mode="wait">
        {viewState === 'scanning' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <CameraScanner onCapture={handleCapture} />
          </motion.div>
        )}

        {viewState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white"
          >
            <div className="relative">
              {capturedImage && (
                <img src={capturedImage} alt="Processing" className="w-64 h-64 object-cover rounded-full opacity-50 blur-sm" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              </div>
            </div>
            <p className="mt-8 text-lg font-medium animate-pulse">Analyzing Skin Profile...</p>
            <p className="text-sm text-slate-400 mt-2">Detecting issues & generating routine</p>
          </motion.div>
        )}

        {viewState === 'results' && capturedImage && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative"
          >
            {/* Image is handled by OverlayEngine */}
            <OverlayEngine
              imageSrc={capturedImage}
              issues={analysisResult.issues}
              onClose={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
