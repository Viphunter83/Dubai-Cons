import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = "px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-gold to-[#F9E29C] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-transparent border border-cyan text-cyan hover:bg-cyan/10 hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] hover:-translate-y-1",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
        danger: "bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500/20"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-transparent`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
