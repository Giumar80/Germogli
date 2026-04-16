import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Clock, Sprout, ArrowRight, Zap, Flame, PlusCircle, Thermometer, RefreshCw } from 'lucide-react';
import { SEEDS } from '../constants';

import { startCropBatch } from '../services/cropService';
import { useNotification } from '../context/NotificationContext';

export default function Catalog({ onSeeGuide, user }: { onSeeGuide: () => void; user: any }) {
  const [isStarting, setIsStarting] = React.useState<string | null>(null);
  const { showNotification } = useNotification();

  const handleStartBatch = async (seed: any) => {
    if (!user) return;
    setIsStarting(seed.id);
    try {
      await startCropBatch(user.uid, seed);
      showNotification(`${seed.name} aggiunto al tuo diario!`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'avvio del lotto.', 'error');
    } finally {
      setIsStarting(null);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Catalogo Semi</h2>
        <p className="text-on-surface-variant mb-8 max-w-lg">Scopri i micro-ortaggi perfetti per il tuo giardino digitale. Inizia il tuo percorso con la nostra selezione curata.</p>
        
        {/* Search Bar */}
        <div className="relative group max-w-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-outline" />
          </div>
          <input 
            type="text" 
            placeholder="Cerca germogli, nutrienti o tempi di crescita..." 
            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-surface-container-lowest border-none outline-none focus:ring-2 focus:ring-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all placeholder:text-outline"
          />
          <button className="absolute right-3 top-3 px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            Filtra
          </button>
        </div>
      </section>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SEEDS.map((seed) => (
          <SeedCard 
            key={seed.id} 
            seed={seed} 
            onSeeGuide={onSeeGuide} 
            onStart={() => handleStartBatch(seed)}
            isStarting={isStarting === seed.id}
          />
        ))}
        
        {/* Empty State / Suggestion */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-[2rem] p-12 text-center">
          <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full mb-6">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">Richiedi una Varietà</h3>
          <p className="text-sm text-on-surface-variant max-w-[200px] mx-auto mb-6">Non vedi i tuoi semi preferiti? Faccelo sapere!</p>
          <button className="text-primary font-bold text-sm hover:underline decoration-2 underline-offset-4">Suggerisci Seme</button>
        </div>
      </div>
    </div>
  );
}

interface SeedCardProps {
  seed: any;
  onSeeGuide: () => void;
  onStart: () => void;
  isStarting: boolean;
  key?: string | number;
}

function SeedCard({ seed, onSeeGuide, onStart, isStarting }: SeedCardProps) {
  return (
    <div className="bento-card group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden relative rounded-xl mb-4 md:mb-6">
        <img 
          src={seed.image} 
          alt={seed.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {seed.badge && (
          <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-accent text-on-accent px-2.5 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg backdrop-blur-md">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{seed.badge}</span>
          </div>
        )}

        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex flex-wrap gap-1.5">
            {seed.cultivationModule.nutrients.map((n: string) => (
              <span key={n} className="bg-white/20 backdrop-blur-md text-white text-[7px] md:text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg md:text-xl font-black text-on-surface leading-tight">{seed.name}</h3>
          <div className={`text-[7px] md:text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
            seed.difficulty === 'Facile' ? 'bg-green-100 text-green-700' : 
            seed.difficulty === 'Medio' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
          }`}>
            {seed.difficulty}
          </div>
        </div>
        
        <p className="text-[10px] md:text-xs text-on-surface-variant mb-4 md:mb-6 leading-relaxed line-clamp-2 min-h-[2.5rem]">{seed.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6">
          <div className="bg-surface-container-highest/30 p-2 md:p-2.5 rounded-xl flex items-center gap-2 md:gap-2.5">
            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
            <div>
              <p className="text-[6px] md:text-[7px] font-black text-outline uppercase tracking-tighter">Tempo</p>
              <p className="text-[9px] md:text-[10px] font-bold">{seed.time}</p>
            </div>
          </div>
          <div className="bg-surface-container-highest/30 p-2 md:p-2.5 rounded-xl flex items-center gap-2 md:gap-2.5">
            <Thermometer className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
            <div>
              <p className="text-[6px] md:text-[7px] font-black text-outline uppercase tracking-tighter">Temp Ideale</p>
              <p className="text-[9px] md:text-[10px] font-bold">{seed.cultivationModule.idealTemp}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button 
            onClick={onSeeGuide}
            className="flex-1 border-2 border-outline text-on-surface py-2.5 md:py-3 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-surface-container-high transition-all active:scale-95"
          >
            Guida
          </button>
          <button 
            disabled={isStarting}
            onClick={onStart}
            className="flex-[2] bg-primary text-on-primary py-2.5 md:py-3 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-2 hover:bg-accent hover:text-on-accent transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary/10"
          >
            {isStarting ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <span>Avvia Lotto</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
