import React from 'react';
import { InputWrapper, TextArea } from '../ui/Form';

export const StepDetails = ({ details, setDetails, budget, setBudget }) => {

    const budgets = ['Economy', 'Standard', 'Premium', 'Luxury', 'Royal'];

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Project Specifics</h3>

                <InputWrapper label="Additional Preferences">
                    <TextArea
                        rows={6}
                        placeholder="Describe any specific requirements, color preferences, or materials you'd like to see..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="bg-white/5 border-white/10 focus:border-gold/50 min-h-[200px]"
                    />
                </InputWrapper>

                <div className="mt-6 p-4 bg-gold/10 rounded-xl border border-gold/20">
                    <h4 className="flex items-center gap-2 text-gold font-bold mb-2">
                        <span>⚡</span> AI Tip
                    </h4>
                    <p className="text-sm text-gold/80">
                        Be specific about lighting ("warm ambient light") and textures ("Italian marble floor") for the best rendering results.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Budget Range</h3>
                <div className="space-y-3">
                    {budgets.map((b) => (
                        <div
                            key={b}
                            onClick={() => setBudget(b)}
                            className={`
                                p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                                ${budget === b
                                    ? 'bg-gold/20 border-gold text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                            `}
                        >
                            <span className="font-medium">{b} Fit-out</span>
                            {budget === b && <span className="text-gold">●</span>}
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <input type="checkbox" id="pro" className="accent-gold w-4 h-4" />
                        <label htmlFor="pro">Enable High-Fidelity Rendering (Pro Mode)</label>
                    </div>
                </div>
            </div>
        </div>
    );
};
