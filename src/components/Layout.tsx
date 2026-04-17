import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, User, Sprout, BookOpen, LayoutGrid, Settings, LogOut, RefreshCw, CheckCircle, Zap, X, Microscope } from 'lucide-react';
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
    { id: 'agronomo' as Screen, label: 'Agronomo', icon: <Microscope className="w-5 h-5" /> },
    { id: 'profilo' as Screen, label: 'Profilo', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body relative overflow-hidden">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-primary animate-pulse uppercase tracking-[0.3em]">Sincronizzazione...</p>
        </div>
      )}

      {/* Top Navigation Bar */}
      {!hideNav && (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline z-50 flex items-center justify-between px-6 md:px-12">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sprout className="text-accent w-6 h-6" />
            </div>
            <h1 className="text-lg md:text-xl font-black text-primary tracking-tighter uppercase">{title}</h1>
          </div>

          {/* Minimalist Expanding Nav */}
          <div className="hidden md:flex items-center bg-surface-container-low rounded-2xl p-1.5 gap-1.5">
            {navItems.map(item => (
              <motion.button 
                key={item.id}
                onClick={() => setScreen(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-0 overflow-hidden px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  currentScreen === item.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/10' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <div className={`${currentScreen === item.id ? 'text-accent' : 'text-outline group-hover:text-primary'} transition-colors duration-300`}>
                  {item.icon}
                </div>
                <motion.span 
                  initial={false}
                  animate={{ 
                    width: currentScreen === item.id ? 'auto' : 0,
                    marginLeft: currentScreen === item.id ? 12 : 0,
                    opacity: currentScreen === item.id ? 1 : 0
                  }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            ))}
          </div>

          {/* Actions & Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <TimerWidget mini />
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-surface-container-high rounded-xl hover:bg-primary/10 active:scale-90 transition-all text-primary"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-accent flex items-center justify-center shadow-md overflow-hidden border-2 border-white">
              {auth.currentUser?.photoURL ? (
                <img src={auth.currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-black text-on-accent text-sm">{(userProfile?.displayName?.[0] || 'G').toUpperCase()}</span>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-container-lowest/90 border-t border-outline flex items-center justify-around px-2 z-[60] backdrop-blur-2xl pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setScreen(item.id)}
              className="flex flex-col items-center justify-center relative w-16 h-full group"
            >
              <div className={`transition-all duration-300 z-10 ${currentScreen === item.id ? 'text-primary scale-110 -translate-y-2' : 'text-outline group-hover:text-on-surface-variant'}`}>
                {item.icon}
              </div>
              <span className={`absolute bottom-3 text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${currentScreen === item.id ? 'text-primary opacity-100 translate-y-0' : 'text-outline opacity-0 translate-y-2'}`}>
                {item.label}
              </span>
              {currentScreen === item.id && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-10 h-1 bg-accent rounded-b-full shadow-[0_0_10px_rgba(198,255,0,0.8)]"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Settings Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[65] bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-[70] bg-surface p-8 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black text-primary tracking-tighter uppercase">Impostazioni</h3>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-surface-container-high rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-12">
                <TimerWidget />
              </div>

              <div className="space-y-4 px-4 bg-surface-container-low rounded-[2rem] p-8 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-4">Account</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center font-black">
                    {userProfile?.displayName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{userProfile?.displayName}</p>
                    <p className="text-[10px] text-outline">{auth.currentUser?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={onSave}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Salva Stato
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-auto w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-error/10 text-error font-black uppercase tracking-widest text-sm active:scale-95 transition-transform"
              >
                <LogOut className="w-5 h-5" />
                Esci
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col ${!hideNav ? 'pt-20 pb-24 md:pb-0' : ''}`}>
        {/* Sub-Header (Growth Bar) */}
        {!hideHeader && (
          <div className="w-full px-6 md:px-12 py-6 bg-surface">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
              <div className="flex-1 max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Crescita Globale</span>
                  </div>
                  <span className="text-[10px] font-black text-primary">{userProfile?.globalGrowth || 0}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${userProfile?.globalGrowth || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                  />
                </div>
              </div>
              <div className="hidden md:block lg:hidden">
                 <TimerWidget mini />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-4 md:p-12 max-w-7xl mx-auto w-full">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
