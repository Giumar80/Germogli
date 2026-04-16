import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Lightbulb, ArrowRight } from 'lucide-react';
import { ACTIVE_CROPS } from '../constants';

export default function Dashboard({ onSeeAll, activeCrops = [], userProfile }: { onSeeAll: () => void; activeCrops?: any[]; userProfile?: any }) {
  const activeCount = activeCrops.length;
  const readyToHarvest = activeCrops.filter(c => c.progress >= 90).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 min-h-[600px]">
      {/* Hero Section - Large Card */}
      <section className="md:col-span-2 md:row-span-2 bento-card-large group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Stato Ecosistema</h2>
          <div className="text-6xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter">
            {userProfile?.globalGrowth || 0}<span className="text-2xl md:text-4xl text-accent">%</span>
          </div>
          <p className="text-white/70 max-w-sm text-xs md:text-sm font-medium leading-relaxed mb-8">
            {activeCount > 0 
              ? `Il tuo giardino digitale è al ${userProfile?.globalGrowth || 0}% della sua capacità ottimale. Hai ${activeCount} lotti in fase attiva.`
              : 'Il tuo ecosistema è pronto per una nuova semina. Esplora il catalogo per iniziare.'}
          </p>
          <div className="progress-bar-bento h-2.5 md:h-3 bg-white/10 mt-auto">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${userProfile?.globalGrowth || 0}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="progress-fill-bento shadow-[0_0_20px_rgba(198,255,0,0.4)]"
            ></motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Small Cards */}
      <StatCard value={activeCount.toString()} label="Lotti Attivi" />
      <StatCard value="23°C" label="Temp. Media" />
      
      {/* Tall Card - Schedule */}
      <section className="md:row-span-2 bento-card border-2 border-outline/50">
        <div className="flex flex-col h-full">
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-8">Timeline Oggi</h3>
          <div className="space-y-6">
            <ScheduleItem time="08:00" task="Nebulizzazione" active />
            <ScheduleItem time="12:30" task="Monitoraggio" />
            <ScheduleItem time="18:00" task="Nebulizzazione" active />
            <ScheduleItem time="20:00" task="Controllo Luce" />
          </div>
          <button onClick={onSeeAll} className="mt-auto w-full py-3 bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
            Vedi Tutti
          </button>
        </div>
      </section>

      <StatCard value={readyToHarvest.toString()} label="Da Raccogliere" />
      <StatCard value="82%" label="Umidità" />

      {/* Wide Card - Growth Rate */}
      <section className="md:col-span-2 bento-card flex-row items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-3">Tasso di Crescita</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-primary tracking-tighter">72</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">mm / dì</span>
          </div>
        </div>
        <div className="h-16 w-32 flex items-end gap-1">
          {[40, 60, 45, 70, 55, 85, 72].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 bg-accent/20 rounded-t-sm"
            ></motion.div>
          ))}
        </div>
      </section>

      {/* Accent Card */}
      <section className="bento-card-accent relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col h-full">
          <h3 className="text-[10px] font-black text-on-accent/60 uppercase tracking-[0.2em] mb-2">Sprout Score</h3>
          <div className="text-5xl font-black text-on-accent tracking-tighter">
            {(userProfile?.totalHarvest || 0) * 100}
          </div>
          <div className="text-[9px] font-black text-on-accent mt-auto bg-white/20 self-start px-2 py-1 rounded-md uppercase tracking-widest">
            Livello Gold
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bento-card hover:bg-surface-container-high">
      <div>
        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</div>
        <div className="text-4xl font-extrabold text-primary">{value}</div>
      </div>
      <div className="text-xs text-on-surface-variant mt-4">Stabile</div>
    </div>
  );
}

function ScheduleItem({ time, task, active = false }: { time: string; task: string; active?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-outline-variant last:border-none">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-accent' : 'bg-outline-variant'}`}></div>
        <span className="text-xs font-bold text-primary">{time}</span>
      </div>
      <span className="text-xs text-on-surface-variant">{task}</span>
    </div>
  );
}
