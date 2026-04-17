import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Microscope, ClipboardCheck, AlertCircle, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';
import { analyzeCropImage } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';
import ReactMarkdown from 'react-markdown';

export default function AgronomistAI() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotification();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCropImage(image, 'image/jpeg');
      setAnalysis(result || 'Impossibile analizzare l\'immagine.');
      showNotification('Analisi completata con successo!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Errore durante l\'analisi dell\'immagine.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary tracking-tighter uppercase mb-2">Agronomo AI</h2>
          <p className="text-on-surface-variant font-medium max-w-lg">
            Carica una foto dei tuoi germogli per ricevere un'analisi tecnica immediata sulla loro salute e consigli dal nostro esperto agronomo.
          </p>
        </div>
        {!image && (
          <button 
            onClick={triggerFileUpload}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-primary text-on-primary rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-on-accent transition-all shadow-2xl shadow-primary/20 active:scale-95"
          >
            <Camera className="w-5 h-5" />
            Scatta o Carica Foto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Upload / Image View */}
        <div className="space-y-6">
          <div className="bento-card-large p-2 overflow-hidden relative group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
              capture="environment"
            />
            
            {image ? (
              <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden">
                <img src={image} alt="Crop to analyze" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={triggerFileUpload}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all active:scale-90"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={triggerFileUpload}
                className="aspect-square md:aspect-video rounded-[2.5rem] border-4 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-surface-container-low transition-all bg-surface-container-lowest"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-primary/40" />
                </div>
                <div className="text-center">
                  <p className="font-black text-primary uppercase tracking-widest">Carica Immagine</p>
                  <p className="text-[10px] text-outline font-bold mt-1">Scegli una foto chiara dei germogli</p>
                </div>
              </div>
            )}
          </div>

          {image && !analysis && !isAnalyzing && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAnalyze}
              className="w-full py-6 bg-primary text-on-primary rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-accent hover:text-on-accent transition-all shadow-2xl shadow-primary/20 active:scale-[0.98]"
            >
              <Microscope className="w-6 h-6" />
              Avvia Diagnosi Botanica
            </motion.button>
          )}

          {isAnalyzing && (
            <div className="w-full py-8 bg-surface-container-high rounded-[2rem] flex flex-col items-center justify-center gap-4 border-2 border-primary/20">
              <RefreshCw className="w-10 h-10 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-black text-primary uppercase tracking-widest animate-pulse">L'agronomo sta analizzando...</p>
                <p className="text-[10px] text-outline font-bold mt-1">Verifica fase fenologica e vigore</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Analysis Result */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bento-card-large p-8 md:p-10 bg-surface-container-lowest h-full border-2 border-primary/10 shadow-2xl relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-outline/20">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                    <ClipboardCheck className="text-accent w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-primary tracking-tighter uppercase">Report Diagnostico</h3>
                    <p className="text-[10px] text-outline font-black uppercase tracking-widest">Generato istantaneamente</p>
                  </div>
                </div>

                <div className="markdown-body prose prose-slate max-w-none text-on-surface">
                  <ReactMarkdown 
                    components={{
                      p: ({children}) => <p className="mb-6 font-medium leading-relaxed">{children}</p>,
                      strong: ({children}) => <strong className="font-black text-primary">{children}</strong>,
                      li: ({children}) => <li className="mb-4 list-none flex items-start gap-3">{children}</li>,
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
                </div>

                <button 
                  onClick={() => { setImage(null); setAnalysis(null); }}
                  className="mt-10 w-full py-4 border-2 border-outline text-on-surface hover:bg-surface-container-high rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  Nuova Analisi
                </button>
              </motion.div>
            ) : !isAnalyzing && (
              <div className="h-full min-h-[400px] rounded-[3rem] border-4 border-dashed border-outline-variant flex flex-col items-center justify-center p-12 text-center opacity-40">
                <AlertCircle className="w-16 h-16 text-outline mb-6" />
                <h3 className="text-xl font-black text-outline uppercase tracking-tighter mb-4">In attesa di analisi</h3>
                <p className="text-sm font-medium max-w-xs">
                  Carica un'immagine e avvia la diagnosi per ricevere il report completo dell'agronomo.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
