import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Search, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

// Updated styles with Russian text and better images
const styles = [
    {
        id: 'modern_luxury',
        label: 'Современная Роскошь',
        desc: 'Чистые линии, мрамор, золотые акценты. Идеальный баланс между комфортом и статусом.',
        color: '#d4af37',
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'minimalist',
        label: 'Минимализм',
        desc: 'Простота, функциональность, светлые тона. Пространство, где ничего не отвлекает.',
        color: '#ffffff',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'arabic_modern',
        label: 'Арабский Модерн',
        desc: 'Традиционные узоры в современном исполнении. Теплота востока с лаконичностью запада.',
        color: '#c2a061',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'industrial',
        label: 'Индустриальный Шик',
        desc: 'Сырые материалы, открытые коммуникации, бетон и металл. Эстетика лофта.',
        color: '#888888',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'neoclassic',
        label: 'Неоклассика',
        desc: 'Вневременная элегантность и симметрия. Классические формы в новой интерпретации.',
        color: '#e6d2b5',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'cyberpunk',
        label: 'Киберпанк',
        desc: 'Неоновые огни, темная технологичная эстетика. Стиль будущего.',
        color: '#00f2ea',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800'
    }
];

export const StepStyle = ({ selected, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeModal, setActiveModal] = useState(null);

    // Filter styles based on search
    const filteredStyles = styles.filter(s =>
        s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCustomStyle = () => {
        if (searchTerm.trim()) {
            onSelect('custom_' + searchTerm);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-light mb-8 text-center text-gray-300">
                Выберите эстетическое <span className="text-white font-bold block text-4xl mt-2">направление</span>
            </h2>

            {/* Search / Custom Style Input (Pinterest-like) */}
            <div className="mb-10 max-w-2xl mx-auto relative group z-20">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Не нашли свой стиль? Опишите, например: 'Скандинавский лофт...'"
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all shadow-lg backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomStyle()}
                />
                {searchTerm && (
                    <button
                        onClick={handleCustomStyle}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-gold text-black rounded-full font-bold hover:bg-gold-light transition-all flex items-center gap-2"
                    >
                        Выбрать <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredStyles.map((style, idx) => (
                    <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`
                            relative h-80 overflow-hidden rounded-2xl cursor-pointer border transition-all duration-500 group
                            ${selected === style.id
                                ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-[1.02]'
                                : 'border-white/10 hover:border-white/30 hover:shadow-lg'}
                        `}
                        onClick={() => onSelect(style.id)}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${style.image})` }}
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${selected === style.id ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/10' : 'bg-gradient-to-t from-black/90 via-black/50 to-black/40 group-hover:via-black/40'}`} />

                        {/* Info Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveModal(style);
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-gold/20 text-white hover:text-gold backdrop-blur-md border border-white/10 transition-all z-20 opacity-0 group-hover:opacity-100"
                            title="Подробнее о стиле"
                        >
                            <Info size={20} />
                        </button>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-end h-full p-6">
                            <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                <h3 className={`text-2xl font-bold mb-2 ${selected === style.id ? 'text-gold' : 'text-white'}`}>
                                    {style.label}
                                </h3>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed opacity-90 line-clamp-2">
                                    {style.desc}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            <div className={`mt-4 flex items-center gap-3 transition-opacity duration-300 ${selected === style.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className={`h-1 flex-1 rounded-full ${selected === style.id ? 'bg-gold' : 'bg-white/30'}`} />
                                <span className={`text-xs font-bold uppercase tracking-widest ${selected === style.id ? 'text-gold' : 'text-white'}`}>
                                    {selected === style.id ? 'Выбрано' : 'Выбрать'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                                <img
                                    src={activeModal.image}
                                    alt={activeModal.label}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Modal Content */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <h3 className="text-3xl font-bold text-white mb-4">{activeModal.label}</h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    {activeModal.desc}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {['Интерьер', 'Дизайн', 'Стиль', 'Эстетика'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            onSelect(activeModal.id);
                                            setActiveModal(null);
                                        }}
                                        className="w-full mt-6"
                                    >
                                        Выбрать этот стиль
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
