'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SidePanel } from '@/components/story/SidePanel';
import { StoryFeed } from '@/components/story/StoryFeed';
import { ActionInput } from '@/components/story/ActionInput';
import { LoadingIndicator } from '@/components/story/LoadingIndicator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DUMMY_USER_ID = 'user-123';

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function StoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [storyId, setStoryId] = useState('');
    const [protagonistId, setProtagonistId] = useState('');
    const [characterState, setCharacterState] = useState<any>(null);
    const [scenes, setScenes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const sid = searchParams.get('storyId');
        const pid = searchParams.get('protagonistId');
        const name = searchParams.get('name');
        const genre = searchParams.get('genre');
        const trait = searchParams.get('trait');
        const location = searchParams.get('location');
        const narration = searchParams.get('narration');

        if (!sid || !pid || !name || !genre || !trait || !location || !narration) {
            router.push('/');
            return;
        }

        setStoryId(sid);
        setProtagonistId(pid);
        setCharacterState({
            name,
            coreTrait: trait,
            genre,
            location,
            health: 100,
            inventory: [
                {
                    id: generateId(),
                    name: "Traveler's Pack",
                    description: 'Basic supplies for the journey',
                },
            ],
        });

        setScenes([
            {
                id: generateId(),
                type: 'narrative',
                content: narration,
                timestamp: Date.now(),
            },
        ]);
    }, [searchParams, router]);

    const handleActionSubmit = async (action: string) => {
        if (!storyId || !characterState) return;

        try {
            setLoading(true);
            setError('');

            const actionScene = {
                id: generateId(),
                type: 'action',
                content: action,
                timestamp: Date.now(),
            };
            setScenes(prev => [...prev, actionScene]);

            const response = await axios.post(`${API_URL}/continue`, {
                storyId,
                userId: DUMMY_USER_ID,
                userAction: action,
            });

            const { data: narration, newState } = response.data;

            const narrativeScene = {
                id: generateId(),
                type: 'narrative',
                content: narration,
                timestamp: Date.now(),
                stateChanges: {
                    location: newState.location !== characterState.location ? newState.location : undefined,
                    health: newState.health !== characterState.health ? newState.health : undefined,
                },
            };

            setScenes(prev => [...prev, narrativeScene]);

            const currentInventoryNames = characterState.inventory.map((i: any) => i.name);
            const newInventoryNames = newState.inventory;

            const added = newInventoryNames
                .filter((name: string) => !currentInventoryNames.includes(name))
                .map((name: string) => ({
                    id: generateId(),
                    name,
                    description: undefined,
                }));

            const removed = characterState.inventory
                .filter((item: any) => !newInventoryNames.includes(item.name))
                .map((item: any) => item.id);

            let newInventory = [...characterState.inventory];
            if (added.length > 0) {
                newInventory = [...newInventory, ...added];
            }
            if (removed.length > 0) {
                newInventory = newInventory.filter((item: any) => !removed.includes(item.id));
            }

            setCharacterState({
                ...characterState,
                location: newState.location,
                health: newState.health,
                inventory: newInventory,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!characterState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingIndicator message="Loading your story..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <motion.header
                className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm sticky top-0 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                            {characterState.name}'s Adventure
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {characterState.genre} • {characterState.coreTrait}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to start a new story? Current progress will be lost.')) {
                                router.push('/');
                            }
                        }}
                        className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors"
                    >
                        New Story
                    </button>
                </div>
            </motion.header>

            <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="hidden lg:block">
                    <SidePanel characterState={characterState} />
                </div>

                <div className="flex-1 flex flex-col bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
                    <StoryFeed scenes={scenes} />

                    {loading && (
                        <div className="border-t border-[var(--color-border)] p-4">
                            <LoadingIndicator message="Generating story..." />
                        </div>
                    )}

                    {error && (
                        <motion.div
                            className="border-t border-[var(--color-border)] p-4 bg-[var(--color-error)]/10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-[var(--color-error)] text-sm text-center">
                                {error}
                            </p>
                        </motion.div>
                    )}
                </div>

                <div className="lg:hidden">
                    <details className="group">
                        <summary className="cursor-pointer list-none">
                            <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] flex items-center justify-between">
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                    Character Info
                                </span>
                                <svg
                                    className="w-5 h-5 text-[var(--color-text-secondary)] transition-transform group-open:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </summary>
                        <div className="mt-4">
                            <SidePanel characterState={characterState} />
                        </div>
                    </details>
                </div>
            </div>

            <ActionInput
                onSubmit={handleActionSubmit}
                isDisabled={loading}
                isLoading={loading}
            />
        </div>
    );
}
