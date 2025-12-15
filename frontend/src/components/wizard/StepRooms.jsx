import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

// Default rooms for quick add
const defaultRooms = [
    { type: 'living_room', label: 'Living Room', icon: '🛋️', area: 30 },
    { type: 'bedroom', label: 'Master Bedroom', icon: '🛏️', area: 25 },
    { type: 'kitchen', label: 'Kitchen', icon: '🍳', area: 15 },
    { type: 'bathroom', label: 'Bathroom', icon: '🚿', area: 10 },
    { type: 'office', label: 'Home Office', icon: '💻', area: 12 }
];

export const StepRooms = ({ rooms, setRooms }) => {

    const addRoom = (preset) => {
        setRooms([...rooms, {
            type: preset.type,
            label: preset.label,
            quantity: 1,
            area: preset.area,
            id: Date.now()
        }]);
    };

    const updateRoom = (id, field, value) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const removeRoom = (id) => {
        setRooms(rooms.filter(r => r.id !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Left: Quick Add */}
            <div className="w-full lg:w-1/3">
                <h3 className="text-xl font-bold mb-4 text-white">Add Spaces</h3>
                <div className="grid grid-cols-2 gap-3">
                    {defaultRooms.map(room => (
                        <motion.button
                            key={room.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addRoom(room)}
                            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/50 transition-colors text-left flex flex-col items-center justify-center gap-2"
                        >
                            <span className="text-3xl">{room.icon}</span>
                            <span className="text-sm font-medium">{room.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Right: Current Configuration */}
            <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 overflow-y-auto max-h-[600px]">
                <h3 className="text-xl font-bold mb-6 text-white flex justify-between items-center">
                    Configuration
                    <span className="text-sm font-normal text-gray-400">{rooms.length} spaces added</span>
                </h3>

                <div className="space-y-4">
                    <AnimatePresence initial={false}>
                        {rooms.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-xl text-gold">
                                    {defaultRooms.find(d => d.type === room.type)?.icon || '🏠'}
                                </div>

                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Type</label>
                                        <div className="font-medium">{room.label}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Area (m²)</label>
                                        <input
                                            type="number"
                                            value={room.area}
                                            onChange={(e) => updateRoom(room.id, 'area', parseFloat(e.target.value))}
                                            className="bg-transparent border-b border-white/20 w-20 focus:border-gold outline-none text-white text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Count</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20"
                                                onClick={() => updateRoom(room.id, 'quantity', Math.max(1, room.quantity - 1))}
                                            >-</button>
                                            <span>{room.quantity}</span>
                                            <button
                                                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20"
                                                onClick={() => updateRoom(room.id, 'quantity', room.quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeRoom(room.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    ✕
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {rooms.length === 0 && (
                        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                            Select room types from the left to start building your floor plan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
