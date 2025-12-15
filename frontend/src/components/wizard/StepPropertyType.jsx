import React from 'react';
import { motion } from 'framer-motion';

const types = [
    { id: 'villa', label: 'Роскошная вилла', icon: '🏰', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80' },
    { id: 'apartment', label: 'Пентхаус и квартира', icon: '🏢', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
    { id: 'office', label: 'Корпоративный офис', icon: '💼', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
    { id: 'retail', label: 'Розничная торговля', icon: '🛍️', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' }
];

export const StepPropertyType = ({ selected, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full content-center">
            {types.map((type) => (
                <motion.div
                    key={type.id}
                    onClick={() => onSelect(type.id)}
                    className={`relative group cursor-pointer overflow-hidden rounded-2xl h-[400px] border transition-all duration-300 ${selected === type.id
                        ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-[1.02]'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    whileHover={{ y: -5 }}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-white/5">
                        <img
                            src={type.image || `https://placehold.co/600x800/1a1a1a/FFF?text=${type.label}`}
                            alt={type.label}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <h3 className={`text-2xl font-bold mb-1 ${selected === type.id ? 'text-gold' : 'text-white'}`}>
                            {type.label}
                        </h3>
                        <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                            Select to configure your {type.label.toLowerCase()} design
                        </p>
                    </div>

                    {/* Selection Indicator */}
                    {selected === type.id && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold shadow-lg">
                            ✓
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};
