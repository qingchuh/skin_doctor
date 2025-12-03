
"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { AnalysisDetails } from './analysis-details';

// Define Types (Adjust to match your API response)
interface Issue {
    type: string;
    severity: string;
    timeframe: string;
    // Semantic Area
    location_area: string;
    recommendation: {
        am: string;
        pm: string;
        products: Array<{ name: string; price_tier: string; link_query: string }>;
    };
}

const AREA_COORDINATES: Record<string, { top: string; left: string }> = {
    "Forehead": { top: "25%", left: "50%" },
    "Nose": { top: "50%", left: "50%" },
    "Chin": { top: "85%", left: "50%" },
    "Left Cheek": { top: "55%", left: "70%" },
    "Right Cheek": { top: "55%", left: "30%" },
    "Under Eyes": { top: "45%", left: "50%" },
    // Fallback
    "Other": { top: "50%", left: "50%" }
};

// Helper to get style from area
const getDotStyle = (issue: Issue) => {
    const coords = AREA_COORDINATES[issue.location_area] || AREA_COORDINATES["Other"];
    return {
        left: coords.left,
        top: coords.top,
        transform: 'translate(-50%, -50%)'
    };
};

interface OverlayEngineProps {
    imageSrc: string;
    issues: Issue[];
    onClose: () => void;
}

export const OverlayEngine: React.FC<OverlayEngineProps> = ({ imageSrc, issues, onClose }) => {
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    // Handle responsive state
    useEffect(() => {
        const checkDesktop = () => {
            const isLg = window.innerWidth >= 1024;
            setIsDesktop(isLg);

            // Auto-select first issue on desktop if none selected
            if (isLg && !selectedIssue && issues.length > 0) {
                setSelectedIssue(issues[0]);
            }
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, [issues, selectedIssue]); // Re-run if issues change or selection changes (to ensure we don't override user deselection if we wanted that, but here we want to enforce selection on desktop)

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-black">
            {/* LEFT SIDE: Image Viewer */}
            {/* On Desktop, this takes available space. On Mobile, it takes full height. */}
            <div className="relative flex-1 flex items-center justify-center p-4 bg-black overflow-hidden">
                {/* HEADER (Mobile Only or Floating) */}
                <div className="absolute top-4 left-4 z-50">
                    <Button variant="ghost" className="text-white bg-black/50 hover:bg-black/70 rounded-full p-2" onClick={onClose}>
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                {/* RELATIVE INLINE-BLOCK: This wrapper shrinks to fit the image exactly. */}
                <div className="relative inline-block max-h-[85vh] max-w-full shadow-2xl rounded-lg overflow-hidden">

                    {/* The Image: strict max-height to fit screen, w-auto preserves aspect ratio */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageSrc}
                        alt="Analyzed Face"
                        className="block max-h-[85vh] w-auto object-contain"
                    />

                    {/* The Dots: Absolute positioned relative to the inline-block wrapper */}
                    {issues.map((issue, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => setSelectedIssue(issue)}
                            style={getDotStyle(issue)}
                            className={`absolute w-12 h-12 rounded-full focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 ${selectedIssue === issue
                                ? 'bg-blue-500/40 border-2 border-blue-400 ring-4 ring-blue-500/30 opacity-100'
                                : 'bg-white/20 border border-white/40 opacity-40 hover:opacity-100 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: Desktop Details Panel */}
            {/* Hidden on Mobile (hidden), Visible on Desktop (lg:flex) */}
            <div className="hidden lg:flex w-[450px] h-full bg-white border-l border-gray-800 overflow-y-auto p-8 flex-col shadow-2xl z-20">
                <AnalysisDetails issue={selectedIssue} />
            </div>

            {/* MOBILE ONLY: Keep the Drawer */}
            {/* The Drawer content should now just wrap <AnalysisDetails /> */}
            {/* Only render Drawer if NOT desktop to prevent double rendering or portal issues */}
            {!isDesktop && (
                <Drawer open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)}>
                    <DrawerContent className="max-h-[90vh] bg-white rounded-t-[2rem]">
                        <div className="mx-auto w-full max-w-md h-full flex flex-col">
                            <div className="flex-1 overflow-y-auto p-6">
                                <AnalysisDetails issue={selectedIssue} />
                            </div>
                            <DrawerFooter className="pt-2 pb-8 px-6">
                                <DrawerClose asChild>
                                    <Button variant="outline" className="h-14 text-lg font-semibold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-900">
                                        Close Details
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
};

