import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WizardLayout = ({ currentStep, totalSteps, steps, children, title }) => {
    return (
        <div className="min-h-screen bg-background text-white flex flex-col pt-20 pb-10 px-4 md:px-8 max-w-[1920px] mx-auto">
            {/* Header / Progress */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                        <span className="text-gold">Step {currentStep}</span>
                        <span className="text-gray-600">/</span>
                        <span>{totalSteps}</span>
                        <span className="text-gray-600">•</span>
                        <span>{steps[currentStep - 1]?.title}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col md:flex-row gap-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full flex flex-col"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
