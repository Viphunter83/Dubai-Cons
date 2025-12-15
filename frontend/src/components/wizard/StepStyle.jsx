import React from 'react';
import { motion } from 'framer-motion';

const styles = [
    { id: 'modern_luxury', label: 'Modern Luxury', desc: 'Clean lines, marble, gold accents', color: '#d4af37' },
    { id: 'minimalist', label: 'Minimalist', desc: 'Simplicity, functionality, light tones', color: '#ffffff' },
    { id: 'arabic_modern', label: 'Arabic Modern', desc: 'Traditional patterns with modern twist', color: '#c2a061' },
    { id: 'industrial', label: 'Industrial Chic', desc: 'Raw materials, exposed structures', color: '#888888' },
    { id: 'neoclassic', label: 'Neoclassic', desc: 'Timeless elegance and symmetry', color: '#e6d2b5' },
    { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon lights, dark tech aesthetics', color: '#00f2ea' }
];

export const StepStyle = ({ selected, onSelect }) => {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-light mb-8 text-center text-gray-300">Choose your <span className="text-white font-bold">Aesthetic Direction</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {styles.map((style, idx) => (
                    <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(style.id)}
                        className={`
                            relative overflow-hidden rounded-xl p-6 cursor-pointer border backdrop-blur-sm transition-all duration-300 group
                            ${selected === style.id
                                ? 'bg-white/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'}
                        `}
                    >
                        {/* Color Accent */}
                        <div
                            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"
                            style={{ backgroundColor: style.color }}
                        />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold mb-2 ${selected === style.id ? 'text-gold' : 'text-white'}`}>
                                    {style.label}
                                </h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                    {style.desc}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="h-1 w-12 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-current transition-all duration-300"
                                        style={{ width: selected === style.id ? '100%' : '0%', backgroundColor: style.color }}
                                    />
                                </div>
                                <span className={`text-xs uppercase tracking-widest ${selected === style.id ? 'text-white' : 'text-gray-600'}`}>
                                    {selected === style.id ? 'Selected' : 'Select'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
