"use client";

import React from 'react';
import Webcam from 'react-webcam';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraScannerProps {
    onCapture: (imageSrc: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture }) => {
    const {
        webcamRef,
        isCameraReady,
        cameraError,
        handleUserMedia,
        handleUserMediaError,
        capture,
    } = useCamera();

    const handleCapture = () => {
        capture();
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    };

    const videoConstraints = {
        facingMode: "user", // or "environment" for rear camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden rounded-xl">
            {cameraError && (
                <div className="absolute z-10 text-white bg-red-500/80 p-4 rounded-lg">
                    Camera Error: {cameraError}
                </div>
            )}

            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                className="w-full h-full object-cover"
                mirrored={true} // Mirror for selfie mode
            />

            {/* Camera Overlay / Viewfinder UI */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 m-4 rounded-2xl" />

            {/* Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-20">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCapture}
                    disabled={!isCameraReady}
                    className="w-20 h-20 rounded-full bg-white border-4 border-slate-200 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-900" />
                </motion.button>

                {/* Fallback Upload for Testing/No Camera */}
                <div className="absolute right-8">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="upload-input"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    onCapture(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    <label htmlFor="upload-input">
                        <Button variant="secondary" size="sm" className="pointer-events-auto cursor-pointer" asChild>
                            <span>Upload</span>
                        </Button>
                    </label>
                </div>
            </div>
        </div>
    );
};
