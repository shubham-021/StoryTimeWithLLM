'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DUMMY_USER_ID = 'user-123';

const CORE_TRAITS = [
    { value: 'brave', label: 'Brave' },
    { value: 'cunning', label: 'Cunning' },
    { value: 'wise', label: 'Wise' },
    { value: 'charismatic', label: 'Charismatic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'ruthless', label: 'Ruthless' },
];

const GENRES = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
];

export function SetupForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        protagonistName: '',
        coreTrait: '',
        genre: '',
        startingScenario: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.protagonistName.trim()) {
            newErrors.protagonistName = 'Please enter a name for your protagonist';
        } else if (formData.protagonistName.length < 2) {
            newErrors.protagonistName = 'Name must be at least 2 characters';
        }

        if (!formData.coreTrait) {
            newErrors.coreTrait = 'Please select a core trait';
        }

        if (!formData.genre) {
            newErrors.genre = 'Please select a genre';
        }

        if (!formData.startingScenario.trim()) {
            newErrors.startingScenario = 'Please describe the starting scenario';
        } else if (formData.startingScenario.length < 10) {
            newErrors.startingScenario = 'Please provide more detail (at least 10 characters)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios.post(`${API_URL}/start`, {
                title: `${formData.protagonistName}'s ${formData.genre} Adventure`,
                description: `A ${formData.genre} story featuring ${formData.protagonistName}`,
                name: formData.protagonistName,
                currentScenario: formData.startingScenario,
                location: formData.startingScenario,
                genre: formData.genre,
                baseTraits: formData.coreTrait,
                userId: DUMMY_USER_ID,
            });

            const { storyId, protagonistId, data: narration } = response.data;

            router.push(`/story?storyId=${storyId}&protagonistId=${protagonistId}&name=${encodeURIComponent(formData.protagonistName)}&genre=${formData.genre}&trait=${formData.coreTrait}&location=${encodeURIComponent(formData.startingScenario)}&narration=${encodeURIComponent(narration)}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 md:p-8">
            <motion.div
                className="w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Begin Your Story
                    </motion.h1>
                    <motion.p
                        className="text-[var(--color-text-secondary)] text-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Create your protagonist and set the stage for an epic adventure
                    </motion.p>
                </div>

                <Card variant="glass" padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Protagonist Name"
                            name="protagonistName"
                            value={formData.protagonistName}
                            onChange={(value) => handleChange('protagonistName', value)}
                            error={errors.protagonistName}
                            placeholder="Enter your character's name"
                            required
                        />

                        <FormField
                            label="Core Trait"
                            name="coreTrait"
                            type="select"
                            value={formData.coreTrait}
                            onChange={(value) => handleChange('coreTrait', value)}
                            error={errors.coreTrait}
                            options={CORE_TRAITS}
                            required
                        />

                        <FormField
                            label="Genre"
                            name="genre"
                            type="select"
                            value={formData.genre}
                            onChange={(value) => handleChange('genre', value)}
                            error={errors.genre}
                            options={GENRES}
                            required
                        />

                        <FormField
                            label="Starting Scenario"
                            name="startingScenario"
                            type="textarea"
                            value={formData.startingScenario}
                            onChange={(value) => handleChange('startingScenario', value)}
                            error={errors.startingScenario}
                            placeholder="Describe where your story begins... (e.g., 'a dark forest at midnight', 'the bridge of a starship', 'a bustling medieval marketplace')"
                            required
                        />

                        {error && (
                            <motion.div
                                className="p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-lg"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <p className="text-[var(--color-error)] text-sm">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={loading}
                        >
                            {loading ? 'Creating your story...' : 'Start Adventure'}
                        </Button>
                    </form>
                </Card>

                <motion.p
                    className="text-center text-[var(--color-text-muted)] text-sm mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Your choices will shape the narrative. Every action matters.
                </motion.p>
            </motion.div>
        </div>
    );
}
