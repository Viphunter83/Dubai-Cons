import React, { useState } from 'react';
import SceneViewer from '../visualization/SceneViewer';
import { WizardLayout } from './WizardLayout';
import { StepPropertyType } from './StepPropertyType';
import { StepStyle } from './StepStyle';
import { StepRooms } from './StepRooms';
import { StepDetails } from './StepDetails';
import { Button } from '../ui/Button';
import { useDesign } from '../../hooks/useDesign';

export default function DesignWizard() {
    const [step, setStep] = useState(1);
    const { actions, loading, result, error } = useDesign();

    // Wizard State - Collecting data locally before sending to useDesign hook
    const [wizardData, setWizardData] = useState({
        propertyType: null,
        style: null,
        rooms: [],
        budget: null,
        details: ''
    });

    const totalSteps = 4;

    const nextStep = () => setStep(Math.min(totalSteps, step + 1));
    const prevStep = () => setStep(Math.max(1, step - 1));

    const updateData = (key, value) => {
        setWizardData(prev => ({ ...prev, [key]: value }));
    };

    const handleGenerate = async () => {
        console.log('Generate button clicked');
        // Transform wizard data to API payload format expected by useDesign
        const presetData = {
            property_type: wizardData.propertyType,
            design_style: wizardData.style,
            rooms: wizardData.rooms.map(r => ({ type: r.type, quantity: r.quantity, area: r.area })),
            budget_range: wizardData.budget,
            additional_preferences: wizardData.details
        };

        console.log('Sending payload:', presetData);

        try {
            await actions.generateFromPresets(presetData);
            console.log('Generation request sent');
        } catch (err) {
            console.error('Generation failed:', err);
            alert('Ошибка при запуске генерации: ' + err.message);
        }
    };

    const steps = [
        { id: 1, title: 'Property Type', component: <StepPropertyType selected={wizardData.propertyType} onSelect={(val) => { updateData('propertyType', val); nextStep(); }} /> },
        { id: 2, title: 'Aesthetic Style', component: <StepStyle selected={wizardData.style} onSelect={(val) => { updateData('style', val); nextStep(); }} /> },
        { id: 3, title: 'Room Config', component: <StepRooms rooms={wizardData.rooms} setRooms={(val) => updateData('rooms', val)} /> },
        { id: 4, title: 'Final Details', component: <StepDetails details={wizardData.details} setDetails={(val) => updateData('details', val)} budget={wizardData.budget} setBudget={(val) => updateData('budget', val)} /> }
    ];

    // Show Result if available
    if (result) {
        return (
            <WizardLayout
                currentStep={totalSteps + 1}
                totalSteps={totalSteps}
                steps={steps}
                title="Your AI Design Concept"
            >
                <div className="flex-1 overflow-y-auto min-h-[500px] mb-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8">
                        <div className="inline-block p-2 rounded-full bg-green-500/20 text-green-400 mb-4">
                            ✅ Design Generated Successfully
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {result.style || 'Custom Design'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {result.image_url && (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
                                    <img
                                        src={result.image_url}
                                        alt="Generated Design"
                                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <p className="text-sm font-medium text-white/90">Created with Nano Banana Pro</p>
                                    </div>
                                </div>
                            )}

                            {/* 3D Visualization Viewer */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-white">Interactive 3D Preview</h3>
                                <div className="aspect-[4/3] w-full">
                                    <React.Suspense fallback={<div className="text-white">Loading 3D...</div>}>
                                        <SceneViewer sceneData={result.visualization} isLoading={false} />
                                    </React.Suspense>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xl font-semibold mb-4 text-primary-400">Design Description</h3>
                                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                                    {result.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <Button variant="outline" onClick={actions.resetDesign}>
                        ← Create New Design
                    </Button>
                    <Button variant="primary" onClick={() => window.print()}>
                        Download Report 📄
                    </Button>
                </div>
            </WizardLayout>
        );
    }

    return (
        <WizardLayout
            currentStep={step}
            totalSteps={totalSteps}
            steps={steps}
            title="Create New Design"
        >
            <div className="flex-1 overflow-y-auto min-h-[500px] mb-8">
                {steps[step - 1].component}
                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200">
                        {error}
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
                >
                    ← Назад
                </Button>

                <div className="flex gap-4">
                    {step === totalSteps ? (
                        <Button
                            variant="primary"
                            onClick={handleGenerate}
                            disabled={loading || !wizardData.budget}
                            className={!wizardData.budget ? 'opacity-50 cursor-not-allowed w-48' : 'w-48'}
                        >
                            {loading ? 'Генерация дизайна...' : 'Создать дизайн 🚀'}
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={nextStep}
                            disabled={
                                (step === 1 && !wizardData.propertyType) ||
                                (step === 2 && !wizardData.style) ||
                                (step === 3 && wizardData.rooms.length === 0)
                            }
                            className={
                                ((step === 1 && !wizardData.propertyType) ||
                                    (step === 2 && !wizardData.style) ||
                                    (step === 3 && wizardData.rooms.length === 0))
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }
                        >
                            Следующий шаг →
                        </Button>
                    )}
                </div>
            </div>
        </WizardLayout >
    );
}
