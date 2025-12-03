"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHistory } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns'; // Need to install date-fns or use native

export default function HistoryPage() {
    const { data: history, isLoading } = useQuery({
        queryKey: ['history'],
        queryFn: () => getHistory(1), // Hardcoded user ID 1 for demo
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Scan History</h1>

            <div className="grid grid-cols-2 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {history?.map((scan: any) => (
                    <Card key={scan.scan_id} className="overflow-hidden border-none shadow-md">
                        <div className="aspect-square relative">
                            <img
                                src={scan.image_url}
                                alt={`Scan ${scan.scan_id}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                <p className="text-white text-xs font-medium">
                                    {new Date(scan.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="text-xs text-slate-500 line-clamp-2">{scan.summary}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {history?.length === 0 && (
                <div className="text-center text-slate-500 mt-12">
                    <p>No scans yet.</p>
                </div>
            )}
        </div>
    );
}
