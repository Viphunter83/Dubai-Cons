import React from 'react';
import { motion } from 'framer-motion';

export function GlassCard({ children, className = '', ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 border border-white/5 hover:border-gold/30 hover:shadow-glow transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
