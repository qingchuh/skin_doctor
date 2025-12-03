"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Scan', icon: Camera },
        { href: '/history', label: 'History', icon: History },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-24 pb-safe flex justify-around items-center z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-blue-600" : "text-gray-400"
                        )}
                    >
                        <item.icon
                            className="w-8 h-8"
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
