import React from 'react';

export function InputWrapper({ label, children, className = '' }) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    {label}
                </label>
            )}
            {children}
        </div>
    );
}

export function TextArea({ className = '', ...props }) {
    return (
        <textarea
            className={`w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder-white/20 ${className}`}
            {...props}
        />
    )
}
