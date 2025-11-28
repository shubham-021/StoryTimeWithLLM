'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { CharacterState } from '@/lib/types';

interface SidePanelProps {
    characterState: CharacterState;
}

export function SidePanel({ characterState }: SidePanelProps) {
    const healthPercentage = characterState.health;
    const healthColor =
        healthPercentage > 70 ? 'var(--color-success)' :
            healthPercentage > 30 ? 'var(--color-warning)' :
                'var(--color-error)';

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
                <Card variant="glass" padding="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                                {characterState.name}
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-sm">
                                {characterState.coreTrait} • {characterState.genre}
                            </p>
                        </div>

                        <div className="h-px bg-[var(--color-border)]" />

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <svg
                                    className="w-4 h-4 text-[var(--color-primary)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                    Location
                                </span>
                            </div>
                            <p className="text-[var(--color-text-primary)]">
                                {characterState.location}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-[var(--color-error)]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                        Health
                                    </span>
                                </div>
                                <span className="text-sm font-semibold" style={{ color: healthColor }}>
                                    {characterState.health}%
                                </span>
                            </div>
                            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: healthColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${healthPercentage}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <svg
                                    className="w-4 h-4 text-[var(--color-secondary)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                    Inventory ({characterState.inventory.length})
                                </span>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {characterState.inventory.length === 0 ? (
                                    <p className="text-[var(--color-text-muted)] text-sm italic">
                                        No items yet
                                    </p>
                                ) : (
                                    characterState.inventory.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            className="p-2 bg-[var(--color-bg-tertiary)] rounded-md border border-[var(--color-border-subtle)]"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                                {item.name}
                                            </p>
                                            {item.description && (
                                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                                    {item.description}
                                                </p>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </div>
    );
}
