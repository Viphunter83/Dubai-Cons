import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, Calculator, Box, Glasses, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

export default function BentoGrid() {
    return (
        <div className="py-24 px-6 max-w-7xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
                <span className="text-white">Experience</span>
                <span className="block text-gold text-2xl mt-4 font-normal">Digital Luxury Services</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-8 md:grid-rows-4 gap-6 h-auto md:h-[800px]">

                {/* 1. Main Feature - Design Engine (Large Square) */}
                <GlassCard className="md:col-span-2 md:row-span-2 relative overflow-hidden group border-gold/20 bg-gray-900/40">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-between p-2">
                        <div className="bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-full text-gold text-xs border border-gold/20 flex items-center gap-2 shadow-lg">
                            <LayoutDashboard size={14} /> AI POWERED
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Design Studio</h3>
                            <p className="text-gray-200 drop-shadow-md">Generative conceptual architecture tailored to Dubai's skyline constraints.</p>
                        </div>
                    </div>
                </GlassCard>

                {/* 2. Timeline (Wide Rectangle) */}
                <GlassCard className="md:col-span-2 md:row-span-1 border-cyan/20 bg-gray-900/40 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
                    <div className="h-full flex flex-col justify-center relative z-10 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="text-cyan drop-shadow-md" size={28} />
                            <h3 className="text-xl font-bold text-white drop-shadow-md">Instant Speed</h3>
                        </div>
                        <p className="text-gray-200 text-sm drop-shadow-md max-w-[80%]">Reduce concept phase from weeks to minutes.</p>
                        {/* Fake visualization graphic */}
                        <div className="mt-4 flex gap-1 h-1 w-full opacity-80 mix-blend-screen">
                            <div className="bg-cyan w-[20%] rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                            <div className="bg-white/20 w-[80%] rounded-full" />
                        </div>
                    </div>
                </GlassCard>

                {/* 3. Materials (Tall Vertical) */}
                <GlassCard className="md:col-span-1 md:row-span-2 relative overflow-hidden group border-white/10 bg-zinc-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518731517036-d9ff8a34237c?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end">
                        <Box className="text-white mb-2 drop-shadow-md" size={24} />
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Materials</h3>
                        <p className="text-gray-200 text-xs drop-shadow-md">Live supplier stocks</p>
                    </div>
                </GlassCard>

                {/* 4. Cost Estimation (Square) */}
                <GlassCard className="md:col-span-1 md:row-span-1 bg-gray-900/40 relative overflow-hidden group border-magenta/20">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="h-full flex flex-col justify-center items-center text-center relative z-10">
                        <Calculator className="text-magenta mb-3 drop-shadow-md" size={32} />
                        <h3 className="text-lg font-bold text-white drop-shadow-md">Smart Costing</h3>
                    </div>
                </GlassCard>

                {/* 5. VR Tour (Wide) */}
                <GlassCard className="md:col-span-2 md:row-span-1 relative overflow-hidden group hover:border-gold/40 transition-colors bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />
                    <img src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" alt="VR" />
                    <div className="relative z-20 h-full flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                <Glasses className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white drop-shadow-md">Immersive VR</h3>
                                <p className="text-gray-200 text-sm drop-shadow-md">Walk through before you build.</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/10 backdrop-blur-sm">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </GlassCard>

                {/* 6. Legal & Compliance (Square) */}
                <GlassCard className="md:col-span-1 md:row-span-1 bg-gray-900/40 relative overflow-hidden group border-green-500/20">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="h-full flex flex-col justify-center p-4 relative z-10">
                        <CheckCircle2 className="text-green-400 mb-3 drop-shadow-md" size={28} />
                        <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">Dubai Code Compliant</h3>
                    </div>
                </GlassCard>

                {/* 7. Analytics (Square) */}
                <GlassCard className="md:col-span-1 md:row-span-1 bg-gray-900/40 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="h-full flex flex-col justify-center items-center relative z-10">
                        <BarChart3 className="text-white mb-2 drop-shadow-md" size={32} />
                        <h3 className="text-sm font-bold text-white drop-shadow-md">Analytics</h3>
                    </div>
                </GlassCard>

            </div>
        </div>
    );
}
