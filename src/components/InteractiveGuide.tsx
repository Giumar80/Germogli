import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowLeft, ArrowRight, Droplets, Check, Sprout, Info } from 'lucide-react';
import { GUIDE_STEPS } from '../constants';

export default function InteractiveGuide({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const step = GUIDE_STEPS[currentStep];

  return (
    <div className="min-h-[80vh] flex flex-col py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-2 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Esci dalla Guida
        </button>
        <div className="flex gap-2">
          {GUIDE_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-accent' : 'w-2 bg-outline-variant'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Left Side - Info */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4">Step {currentStep + 1} di {GUIDE_STEPS.length}</span>
          <h2 className="text-5xl font-extrabold text-primary leading-tight tracking-tighter mb-6">{step.title}</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">{step.description}</p>
          
          <div className="space-y-4 mb-12">
            {step.checklist.map((item, idx) => (
              <div key={idx} className="bento-card flex-row items-center gap-4 p-4 hover:bg-surface-container-high">
                <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm font-bold text-primary">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-8 py-4 border border-outline rounded-xl font-bold text-xs disabled:opacity-30 transition-all uppercase tracking-widest"
            >
              Indietro
            </button>
            <button 
              onClick={() => {
                if (currentStep < GUIDE_STEPS.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  onBack();
                }
              }}
              className="flex-1 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-xs hover:bg-accent hover:text-on-accent transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {currentStep === GUIDE_STEPS.length - 1 ? 'Concludi Guida' : 'Prossimo Step'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="bento-card-large p-0 overflow-hidden border-none relative">
          <img 
            src={step.image} 
            alt={step.title} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <div className="bento-card-accent p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-on-accent" />
                <span className="font-bold text-sm uppercase tracking-widest">Consiglio Pro</span>
              </div>
              <p className="text-xs font-bold text-on-accent/80 leading-relaxed">
                Assicurati che l'acqua sia a temperatura ambiente per non stressare i semi durante l'attivazione.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
