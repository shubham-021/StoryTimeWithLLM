'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SceneCard } from './SceneCard';
import { Scene } from '@/lib/types';
import { scrollToBottom } from '@/lib/utils';

interface StoryFeedProps {
    scenes: Scene[];
}

export function StoryFeed({ scenes }: StoryFeedProps) {
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedRef.current) {
            scrollToBottom(feedRef.current);
        }
    }, [scenes.length]);

    return (
        <div
            ref={feedRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
            {scenes.length === 0 ? (
                <motion.div
                    className="flex items-center justify-center h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-[var(--color-text-muted)] italic">
                        Your story will appear here...
                    </p>
                </motion.div>
            ) : (
                scenes.map((scene, index) => (
                    <SceneCard key={scene.id} scene={scene} index={index} />
                ))
            )}
        </div>
    );
}
