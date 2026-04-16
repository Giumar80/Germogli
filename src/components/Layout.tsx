import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, User, Sprout, BookOpen, LayoutGrid, Settings, LogOut, RefreshCw, CheckCircle, Zap, X } from 'lucide-react';
import { Screen } from '../types';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import TimerWidget from './TimerWidget';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  title?: string;
  hideHeader?: boolean;
  hideNav?: boolean;
  onSave?: () => void;
  isLoading?: boolean;
  userProfile?: any;
}

export default function Layout({ 
  children, 
  currentScreen, 
  setScreen, 
  title = 'SPROUT', 
  hideHeader = false, 
  hideNav = false,
  onSave,
  isLoading = false,
  userProfile
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => signOut(auth);

  const navItems = [
    { id: 'diario' as Screen, label: 'Diario', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'crops' as Screen, label: 'Lotti', icon: <Sprout className="w-5 h-5" /> },
    { id: 'catalogo' as Screen, label: 'Catalogo', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'profilo' as Screen, label: 'Profilo', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-body relative overflow-hidden">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-primary animate-pulse uppercase tracking-[0.3em]">Sincronizzazione...</p>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!hideNav && (
        <nav className="hidden md:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest border-r border-outline flex-col py-10 z-50">
          <div className="px-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sprout className="text-accent w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tighter uppercase">{title}</h1>
            </div>
          </div>
          
          <div className="flex-1 px-4 space-y-2">
            {navItems.map(item => (
              <NavButton 
                key={item.id}
                active={currentScreen === item.id} 
                onClick={() => setScreen(item.id)} 
                icon={item.icon} 
                label={item.label} 
              />
            ))}
          </div>

          <div className="px-6 mb-8 mt-8">
            <TimerWidget />
          </div>

          <div className="px-4 mt-auto space-y-2 pt-10 border-t border-outline/30">
            <NavButton 
              active={false} 
              onClick={handleLogout} 
              icon={<LogOut className="w-5 h-5" />} 
              label="Esci" 
            />
          </div>
        </nav>
      )}

      {/* Mobile Top Bar */}
      {!hideNav && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/80 border-b border-outline flex items-center justify-between px-6 z-[60] backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="text-accent w-4 h-4" />
            </div>
            <span className="font-black text-primary tracking-tighter text-sm uppercase">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onSave}
              className="p-2 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 active:scale-90 transition-transform"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-surface-container-high rounded-xl transition-colors active:scale-90"
            >
              <Settings className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-container-lowest/90 border-t border-outline flex items-center justify-around px-4 z-[60] backdrop-blur-2xl pb-safe">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center gap-1.5 relative py-2 px-4"
            >
              <div className={`transition-all duration-300 ${currentScreen === item.id ? 'text-primary scale-110' : 'text-outline'}`}>
                {item.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${currentScreen === item.id ? 'text-primary' : 'text-outline'}`}>
                {item.label}
              </span>
              {currentScreen === item.id && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 w-8 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(198,255,0,0.8)]"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Settings Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[65] bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-[3rem] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-outline rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-black text-primary tracking-tighter uppercase mb-8 text-center">Impostazioni</h3>
              
              <div className="mb-8">
                <TimerWidget />
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-error/10 text-error font-black uppercase tracking-widest text-sm active:scale-95 transition-transform"
              >
                <LogOut className="w-5 h-5" />
                Esci dall'Ecosistema
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col ${!hideNav ? 'md:ml-72 pt-16 md:pt-0 pb-20 md:pb-0' : ''}`}>
        {/* Header (Growth Bar) */}
        {!hideHeader && (
          <header className="sticky top-16 md:top-0 w-full z-40 bg-surface/80 backdrop-blur-xl px-6 md:px-10 h-20 md:h-24 flex items-center justify-between border-b border-outline/50">
            <div className="flex-1 max-w-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-[8px] md:text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Crescita Globale</span>
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-primary">{userProfile?.globalGrowth || 0}%</span>
              </div>
              <div className="h-2 md:h-2.5 w-full bg-outline-variant rounded-full overflow-hidden p-0.5 border border-outline/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userProfile?.globalGrowth || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8 ml-4 md:ml-8">
              <button 
                onClick={onSave}
                className="hidden sm:flex items-center gap-2.5 px-6 md:px-8 py-3 md:py-3.5 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-on-accent transition-all shadow-xl shadow-primary/10 active:scale-95 group"
              >
                <RefreshCw className={`w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                Sincronizza
              </button>
              
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-0.5">Bentornato,</p>
                  <p className="text-sm font-black text-primary tracking-tight">{userProfile?.displayName || 'Giardiniere'}</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-accent flex items-center justify-center shadow-xl overflow-hidden border-2 border-white">
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="font-black text-on-accent text-sm md:text-base">{(userProfile?.displayName?.[0] || 'G').toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; key?: string | number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-6 py-4 transition-all duration-500 rounded-2xl group ${
        active 
          ? 'bg-primary text-on-primary shadow-2xl shadow-primary/20' 
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
      }`}
    >
      <div className={`${active ? 'text-accent' : 'text-outline group-hover:text-primary'} transition-colors duration-300`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-active-dot"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(198,255,0,0.8)]"
        />
      )}
    </button>
  );
}
