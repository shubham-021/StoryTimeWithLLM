'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface LoadingIndicatorProps {
    message?: string;
}

export function LoadingIndicator({ message = 'Generating story...' }: LoadingIndicatorProps) {
    return (
        <motion.div
            className="flex items-center justify-center gap-3 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-[var(--color-primary)] rounded-full"
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
            <span className="text-[var(--color-text-secondary)] text-sm">{message}</span>
        </motion.div>
    );
}
