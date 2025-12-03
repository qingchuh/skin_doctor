import { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';

export const useCamera = () => {
    const webcamRef = useRef<Webcam>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleUserMedia = useCallback(() => {
        setIsCameraReady(true);
        setCameraError(null);
    }, []);

    const handleUserMediaError = useCallback((error: string | DOMException) => {
        setIsCameraReady(false);
        setCameraError(typeof error === 'string' ? error : error.message);
    }, []);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const reset = useCallback(() => {
        setCapturedImage(null);
    }, []);

    return {
        webcamRef,
        isCameraReady,
        cameraError,
        capturedImage,
        handleUserMedia,
        handleUserMediaError,
        capture,
        reset,
    };
};
