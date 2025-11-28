'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'textarea' | 'select';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
}

export function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    options,
    required = false,
}: FormFieldProps) {
    const baseInputStyles = 'w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200';

    const errorStyles = error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : '';

    return (
        <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label
                htmlFor={name}
                className="block text-sm font-medium text-[var(--color-text-secondary)]"
            >
                {label}
                {required && <span className="text-[var(--color-error)] ml-1">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className={cn(baseInputStyles, errorStyles, 'resize-none')}
                    required={required}
                />
            ) : type === 'select' && options ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(baseInputStyles, errorStyles)}
                    required={required}
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    name={name}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(baseInputStyles, errorStyles)}
                    required={required}
                />
            )}

            {error && (
                <motion.p
                    className="text-sm text-[var(--color-error)] flex items-center gap-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
}
