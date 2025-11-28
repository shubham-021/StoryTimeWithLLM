'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'gradient-border';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    className,
    ...props
}: CardProps) {
    const baseStyles = 'rounded-lg transition-all duration-200';

    const variantStyles = {
        default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
        glass: 'glass-panel',
        'gradient-border': 'gradient-border',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const hoverStyles = hover
        ? 'hover:shadow-lg hover:shadow-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 cursor-pointer'
        : '';

    return (
        <motion.div
            className={cn(
                baseStyles,
                variantStyles[variant],
                paddingStyles[padding],
                hoverStyles,
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
