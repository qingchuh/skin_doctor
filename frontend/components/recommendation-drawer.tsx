"use client";

import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sun, Moon, ShoppingBag } from 'lucide-react';

interface RecommendationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    issue: any | null; // Using any for flexibility with API response, ideally typed
}

export const RecommendationDrawer: React.FC<RecommendationDrawerProps> = ({ isOpen, onClose, issue }) => {
    if (!issue) return null;

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="h-[90vh] max-h-[90vh] bg-white rounded-t-[2rem]">
                <div className="mx-auto w-full max-w-lg h-full flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 pb-2">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <DrawerTitle className="text-3xl font-bold text-slate-900 tracking-tight">
                                    {issue.type}
                                </DrawerTitle>
                                <DrawerDescription className="text-lg text-slate-500 font-medium mt-2">
                                    Severity: <span className="text-slate-900 font-semibold">{issue.severity}</span>
                                </DrawerDescription>
                            </div>
                            <div className="bg-slate-100 px-3 py-1 rounded-full">
                                <span className="text-sm font-semibold text-slate-600">{issue.timeframe}</span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <Tabs defaultValue="routine" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-slate-100 p-1 rounded-xl">
                                <TabsTrigger
                                    value="routine"
                                    className="rounded-lg text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Daily Routine
                                </TabsTrigger>
                                <TabsTrigger
                                    value="products"
                                    className="rounded-lg text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Products
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="routine" className="space-y-6 focus:outline-none">
                                {/* Morning Card */}
                                <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Sun className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Morning</h3>
                                    </div>
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                        {issue.recommendation.am}
                                    </p>
                                </div>

                                {/* Evening Card */}
                                <div className="bg-indigo-50/80 rounded-2xl p-6 border border-indigo-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <Moon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Evening</h3>
                                    </div>
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                        {issue.recommendation.pm}
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="products" className="space-y-4 focus:outline-none">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {issue.recommendation.products.map((product: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2">{product.name}</h4>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                                                    {(product as unknown as { name: string; price_tier: string }).price_tier} Price
                                                </span>
                                            </div>
                                        </div>

                                        <Button asChild className="w-full h-14 text-lg font-semibold bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-[0.98]">
                                            <a
                                                href={`https://www.google.com/search?q=${encodeURIComponent(product.link_query)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2"
                                            >
                                                Shop Now <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-2 border-t border-slate-100 bg-white">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-14 text-lg font-semibold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-900">
                                Close
                            </Button>
                        </DrawerClose>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
