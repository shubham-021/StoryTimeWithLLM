'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface ActionInputProps {
    onSubmit: (action: string) => void;
    isDisabled: boolean;
    isLoading: boolean;
}

export function ActionInput({ onSubmit, isDisabled, isLoading }: ActionInputProps) {
    const [action, setAction] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!action.trim() || isDisabled) return;

        onSubmit(action.trim());
        setAction('');

        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.div
            className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isDisabled}
                            placeholder={
                                isLoading
                                    ? 'Waiting for the story to continue...'
                                    : 'What do you do? (Press Enter to submit, Shift+Enter for new line)'
                            }
                            rows={2}
                            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        <div className="absolute bottom-2 right-2 text-xs text-[var(--color-text-muted)]">
                            {action.length} / 500
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isDisabled || !action.trim() || action.length > 500}
                        isLoading={isLoading}
                        variant="primary"
                        size="md"
                        className="self-end"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </Button>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Tip: Be specific with your actions for better results</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
