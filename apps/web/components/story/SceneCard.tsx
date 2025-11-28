'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Scene } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';

interface SceneCardProps {
    scene: Scene;
    index: number;
}

export function SceneCard({ scene, index }: SceneCardProps) {
    const isNarrative = scene.type === 'narrative';
    const isAction = scene.type === 'action';
    const isSystem = scene.type === 'system';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            {isAction ? (
                <div className="flex justify-end mb-4">
                    <div className="max-w-[80%] bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded-lg px-5 py-4">
                        <div className="flex items-start gap-2">
                            <svg
                                className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="text-[var(--color-text-primary)] font-medium">
                                    {scene.content}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    {formatTimestamp(scene.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : isSystem ? (
                <div className="flex justify-center mb-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-2">
                        <p className="text-sm text-[var(--color-text-muted)] italic">
                            {scene.content}
                        </p>
                    </div>
                </div>
            ) : (
                <Card variant="glass" padding="lg" className="mb-4 p-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                    Story
                                </span>
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)]">
                                {formatTimestamp(scene.timestamp)}
                            </span>
                        </div>

                        <div className="narrative-text">
                            {scene.content}
                        </div>

                        {scene.stateChanges && (
                            <div className="pt-3 border-t border-[var(--color-border-subtle)]">
                                <div className="flex flex-wrap gap-2">
                                    {scene.stateChanges.location && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded text-xs text-[var(--color-primary)]">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            Location changed
                                        </span>
                                    )}
                                    {scene.stateChanges.health !== undefined && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded text-xs text-[var(--color-error)]">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            Health updated
                                        </span>
                                    )}
                                    {scene.stateChanges.inventory && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 rounded text-xs text-[var(--color-secondary)]">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                            </svg>
                                            Item acquired
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </motion.div>
    );
}
