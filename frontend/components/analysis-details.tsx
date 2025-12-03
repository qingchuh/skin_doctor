"use client";

import React from 'react';
import { Sun, Moon, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Issue {
    type: string;
    severity: string;
    timeframe: string;
    location_area: string;
    recommendation: {
        am: string;
        pm: string;
        products: Array<{ name: string; price_tier: string; link_query: string }>;
    };
}

interface AnalysisDetailsProps {
    issue: Issue | null;
}

export const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ issue }) => {
    if (!issue) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                <p className="text-lg font-medium">Select a marked area on your face to see recommendations</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">{issue.type}</h2>
                <p className="text-lg text-slate-500 mt-1">
                    Severity: <span className="font-medium text-slate-900">{issue.severity}</span> • Fix in <span className="font-medium text-slate-900">{issue.timeframe}</span>
                </p>
            </div>

            {/* Routine Cards */}
            <div className="grid gap-4">
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
                        <Sun className="w-5 h-5" /> Morning Routine
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-base font-medium">
                        {issue.recommendation.am}
                    </p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-2 text-lg flex items-center gap-2">
                        <Moon className="w-5 h-5" /> Evening Routine
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-base font-medium">
                        {issue.recommendation.pm}
                    </p>
                </div>
            </div>

            {/* Products Section */}
            <div>
                <h4 className="font-bold text-xl mb-4 text-slate-900">Recommended Products</h4>
                <div className="space-y-3">
                    {issue.recommendation.products.map((prod, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{prod.name}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                                        {prod.price_tier} Cost
                                    </span>
                                </div>
                            </div>
                            <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl">
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(prod.link_query)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    Shop Now <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
