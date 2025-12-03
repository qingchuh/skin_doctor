import React from 'react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
            <p className="text-slate-500 mt-2">Manage your skin preferences and settings.</p>

            <div className="mt-8 w-full max-w-xs space-y-4">
                <Button className="w-full" variant="outline">Skin Type: Combination</Button>
                <Button className="w-full" variant="outline">Concerns: Acne, Dryness</Button>
                <Button className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200">Log Out</Button>
            </div>
        </div>
    );
}
