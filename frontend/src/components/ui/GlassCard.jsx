import React from 'react';
import { motion } from 'framer-motion';

export function GlassCard({ children, className = '', ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
