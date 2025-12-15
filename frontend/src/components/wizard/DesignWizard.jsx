import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { StepPropertyType } from './StepPropertyType';
import { StepStyle } from './StepStyle';
import { StepRooms } from './StepRooms';
import { StepDetails } from './StepDetails';
import { Button } from '../ui/Button';
import { useDesign } from '../../hooks/useDesign';

export default function DesignWizard() {
    const [step, setStep] = useState(1);
    const { actions, loading, result } = useDesign();

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

    const handleGenerate = () => {
        // Transform wizard data to API payload format expected by useDesign
        const presetData = {
            property_type: wizardData.propertyType,
            design_style: wizardData.style,
            rooms: wizardData.rooms.map(r => ({ type: r.type, quantity: r.quantity, area: r.area })),
            budget_range: wizardData.budget,
            additional_preferences: wizardData.details
        };

        actions.generateFromPresets(presetData);
    };

    const steps = [
        { id: 1, title: 'Property Type', component: <StepPropertyType selected={wizardData.propertyType} onSelect={(val) => { updateData('propertyType', val); nextStep(); }} /> },
        { id: 2, title: 'Aesthetic Style', component: <StepStyle selected={wizardData.style} onSelect={(val) => { updateData('style', val); nextStep(); }} /> },
        { id: 3, title: 'Room Config', component: <StepRooms rooms={wizardData.rooms} setRooms={(val) => updateData('rooms', val)} /> },
        { id: 4, title: 'Final Details', component: <StepDetails details={wizardData.details} setDetails={(val) => updateData('details', val)} budget={wizardData.budget} setBudget={(val) => updateData('budget', val)} /> }
    ];

    return (
        <WizardLayout
            currentStep={step}
            totalSteps={totalSteps}
            steps={steps}
            title="Create New Design"
        >
            <div className="flex-1 overflow-y-auto min-h-[500px] mb-8">
                {steps[step - 1].component}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
                >
                    ← Back
                </Button>

                <div className="flex gap-4">
                    {step === totalSteps ? (
                        <Button
                            variant="primary"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-48"
                        >
                            {loading ? 'Generative AI Processing...' : 'Generate Design 🚀'}
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={nextStep} disabled={step === 1 && !wizardData.propertyType}>
                            Next Step →
                        </Button>
                    )}
                </div>
            </div>
        </WizardLayout>
    );
}
