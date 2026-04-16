import React from 'react';
import { motion } from 'motion/react';
import { Thermometer, Droplets, X, Sprout, Zap, Clock } from 'lucide-react';
import { waterCrop, deleteCrop, calculateProgress, advanceCropDay, updateCrop } from '../services/cropService';
import { SEEDS } from '../constants';
import { useNotification } from '../context/NotificationContext';
import { useTimer } from '../context/TimerContext';
import { Edit2, FastForward, Save } from 'lucide-react';

export default function ActiveCrops({ activeCrops = [], user }: { activeCrops?: any[]; user?: any }) {
  const { timeLeft, isActive, formatTime } = useTimer();

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-5xl font-black text-on-surface tracking-tighter mb-2 uppercase">I Tuoi Lotti</h2>
          <p className="text-on-surface-variant max-w-md text-sm font-medium">Monitora la crescita e segui i moduli di coltivazione specifici.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-highest/50 py-2.5 px-6 rounded-2xl flex items-center gap-3 border border-outline/30">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(198,255,0,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{activeCrops.length} Attivi</span>
          </div>
        </div>
      </header>

      {/* Timer Status Card */}
      {timeLeft > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card-accent p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isActive ? 'bg-white/20 animate-pulse' : 'bg-white/10'}`}>
              <Clock className="w-8 h-8 text-on-accent" />
            </div>
            <div>
              <h3 className="text-on-accent/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Prossima Azione</h3>
              <p className="text-4xl font-black text-on-accent tracking-tighter">{formatTime(timeLeft)}</p>
            </div>
          </div>
          <div className="text-center md:text-right relative z-10">
            <p className="text-on-accent/80 text-sm font-bold max-w-[200px]">
              {isActive ? 'Il timer è attivo. Riceverai una notifica al termine.' : 'Timer in pausa. Riprendi per ricevere avvisi.'}
            </p>
          </div>
        </motion.div>
      )}

      {activeCrops.length === 0 ? (
        <div className="bento-card p-24 flex flex-col items-center justify-center text-center bg-surface-container-low/30 border-dashed border-2">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-8 shadow-inner">
            <Sprout className="w-12 h-12 text-outline/50" />
          </div>
          <h3 className="text-2xl font-black mb-3 tracking-tight">Il tuo giardino è in attesa</h3>
          <p className="text-on-surface-variant max-w-xs mx-auto mb-10 text-sm font-medium">Scegli una varietà dal catalogo per iniziare la tua prima coltivazione digitale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCrops.map((crop) => (
            <LegumeCard key={crop.id} crop={crop} user={user} />
          ))}
        </div>
      )}

      {/* Cultivation Tips Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <div className="lg:col-span-2 bento-card-accent p-12 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-on-accent mb-6 tracking-tighter uppercase">Ottimizzazione Resa</h3>
            <p className="text-on-accent/80 mb-10 max-w-lg text-sm font-bold leading-relaxed">
              Ricorda di mantenere i tuoi barattoli in un luogo con temperatura costante. 
              La stabilità termica è il segreto per microgreens croccanti e nutrienti.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Umidità Ideale</p>
                <p className="text-xl font-black">65-75%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Luce Diurna</p>
                <p className="text-xl font-black">12-14h</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <TipCard icon={<Zap className="w-5 h-5" />} title="Luce" text="Aumenta l'esposizione per i broccoli dal 3° giorno." />
          <TipCard icon={<Droplets className="w-5 h-5" />} title="Acqua" text="Controlla l'umidità del ravanello: non deve mai seccare." />
        </div>
      </section>
    </div>
  );
}

function LegumeCard({ crop, user }: { crop: any; user: any; key?: string | number }) {
  const { day, progress } = calculateProgress(crop.createdAt, crop.harvestTime);
  const seedInfo = SEEDS.find(s => s.id === crop.seedId);
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(crop.name);
  const [editedTemp, setEditedTemp] = React.useState(crop.stats?.temp || '22°C');
  const [editedWatering, setEditedWatering] = React.useState(crop.stats?.watering || '2x/dì');

  const handleWater = async () => {
    try {
      await waterCrop(crop.id);
      showNotification(`Lotto di ${crop.name} nebulizzato!`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'irrigazione.', 'error');
    }
  };

  const handleAdvance = async () => {
    try {
      await advanceCropDay(crop.id, crop.createdAt);
      showNotification('Lotto avanzato di un giorno!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'avanzamento.', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCrop(crop.id, { 
        name: editedName,
        stats: {
          temp: editedTemp,
          watering: editedWatering
        }
      });
      setIsEditing(false);
      showNotification('Lotto aggiornato!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'aggiornamento.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm(`Sei sicuro di voler eliminare il lotto di ${crop.name}?`)) return;
    try {
      await deleteCrop(user.uid, crop.id);
      showNotification('Lotto eliminato correttamente.', 'info');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'eliminazione.', 'error');
    }
  };

  return (
    <div className="bento-card group hover:shadow-2xl transition-all duration-500">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2 mb-2">
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Nome Lotto"
                className="bg-surface-container-high border-none rounded-lg px-3 py-1.5 text-sm font-black w-full outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl md:text-2xl font-black text-primary tracking-tight">{crop.name}</h3>
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-outline hover:text-primary transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-container-highest/50 px-2 py-0.5 rounded-md">
              {crop.phase}
            </span>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary">
              Giorno {day}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <button onClick={handleUpdate} className="p-2 bg-primary text-on-primary rounded-lg shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleDelete} className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-all">
              <X className="w-4 h-4 md:w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 relative shadow-lg">
        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em]">Crescita</span>
            <span className="text-[10px] md:text-xs font-black text-white">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 md:h-2 rounded-full overflow-hidden backdrop-blur-md">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-accent shadow-[0_0_10px_rgba(198,255,0,0.8)]"
            ></motion.div>
          </div>
        </div>
      </div>

      {seedInfo && (
        <div className="mb-4 md:mb-6">
          <p className="text-[7px] md:text-[8px] font-black text-outline uppercase tracking-widest mb-2">Modulo di Coltivazione</p>
          <div className="flex flex-wrap gap-1.5">
            {seedInfo.cultivationModule.instructions.slice(0, 2).map((inst, i) => (
              <span key={i} className="text-[8px] md:text-[9px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-lg">
                {inst}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="bg-surface-container-low p-2.5 md:p-3.5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3.5 border border-outline/10">
          <div className="w-7 h-7 md:w-8 h-8 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center">
            <Thermometer className="w-3.5 h-3.5 md:w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[6px] md:text-[7px] font-black text-outline uppercase tracking-tighter">Temp</p>
            {isEditing ? (
              <input 
                type="text" 
                value={editedTemp} 
                onChange={(e) => setEditedTemp(e.target.value)}
                className="bg-transparent border-none p-0 text-[10px] md:text-xs font-black w-full outline-none focus:text-primary"
              />
            ) : (
              <p className="text-[10px] md:text-xs font-black">{crop.stats?.temp || '22°C'}</p>
            )}
          </div>
        </div>
        <div className="bg-surface-container-low p-2.5 md:p-3.5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3.5 border border-outline/10">
          <div className="w-7 h-7 md:w-8 h-8 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center">
            <Droplets className="w-3.5 h-3.5 md:w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[6px] md:text-[7px] font-black text-outline uppercase tracking-tighter">Acqua</p>
            {isEditing ? (
              <input 
                type="text" 
                value={editedWatering} 
                onChange={(e) => setEditedWatering(e.target.value)}
                className="bg-transparent border-none p-0 text-[10px] md:text-xs font-black w-full outline-none focus:text-primary"
              />
            ) : (
              <p className="text-[10px] md:text-xs font-black">{crop.stats?.watering || '2x/dì'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button 
          onClick={handleWater}
          className="w-full py-3.5 md:py-4 bg-primary text-on-primary rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 hover:bg-accent hover:text-on-accent transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
        >
          <Droplets className="w-3.5 h-3.5 md:w-4 h-4" />
          Nebulizza Ora
        </button>
        
        <button 
          onClick={handleAdvance}
          className="w-full py-3 md:py-3.5 border-2 border-outline text-on-surface rounded-xl md:rounded-2xl font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 hover:bg-surface-container-high transition-all active:scale-[0.98]"
        >
          <FastForward className="w-3.5 h-3.5 md:w-4 h-4" />
          Avanza Giorno
        </button>
      </div>
    </div>
  );
}

function TipCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bento-card hover:bg-surface-container-high">
      <div className="mb-4">{icon}</div>
      <h4 className="text-sm font-bold mb-2 uppercase tracking-widest text-primary">{title}</h4>
      <p className="text-xs text-on-surface-variant leading-relaxed">{text}</p>
    </div>
  );
}
