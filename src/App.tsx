import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Sprout, RefreshCw, LogIn } from 'lucide-react';
import { Screen } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import ActiveCrops from './components/ActiveCrops';
import InteractiveGuide from './components/InteractiveGuide';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDocFromServer, collection, query, where, updateDoc } from 'firebase/firestore';
import { calculateProgress } from './services/cropService';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { TimerProvider } from './context/TimerContext';

function AppContent() {
  const [currentScreen, setScreen] = useState<Screen>('diario');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeCrops, setActiveCrops] = useState<any[]>([]);
  const { showNotification } = useNotification();

  // Calculate global growth based on active crops progress
  const globalGrowth = useMemo(() => {
    if (activeCrops.length === 0) return 0;
    const totalProgress = activeCrops.reduce((sum, crop) => {
      const { progress } = calculateProgress(crop.createdAt, crop.harvestTime);
      return sum + progress;
    }, 0);
    return Math.round(totalProgress / activeCrops.length);
  }, [activeCrops]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setActiveCrops([]);
      return;
    }

    // Fetch Profile
    const userDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        const initialProfile = {
          displayName: user.displayName || 'Giardiniere',
          email: user.email || '',
          role: 'client',
          totalBatches: 0,
          totalHarvest: 0,
          globalGrowth: 0
        };
        setDoc(userDocRef, initialProfile).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
          showNotification('Errore durante la creazione del profilo', 'error');
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      showNotification('Errore nel caricamento del profilo', 'error');
    });

    // Fetch Active Crops
    const cropsQuery = query(collection(db, 'crops'), where('ownerId', '==', user.uid));
    const unsubCrops = onSnapshot(cropsQuery, (snapshot) => {
      const crops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveCrops(crops);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'crops');
      showNotification('Errore nel caricamento dei lotti', 'error');
    });

    return () => {
      unsubProfile();
      unsubCrops();
    };
  }, [user, showNotification]);

  // Sync global growth to profile
  useEffect(() => {
    if (user && userProfile && globalGrowth !== userProfile.globalGrowth) {
      const userDocRef = doc(db, 'users', user.uid);
      updateDoc(userDocRef, { globalGrowth }).catch(console.error);
    }
  }, [globalGrowth, user, userProfile]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showNotification('Accesso effettuato con successo!', 'success');
    } catch (error) {
      console.error("Login failed:", error);
      showNotification('Accesso fallito. Riprova.', 'error');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { ...userProfile, lastSaved: new Date().toISOString(), globalGrowth });
      showNotification('Progressi sincronizzati con successo!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      showNotification('Errore durante il salvataggio', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <Sprout className="text-accent w-10 h-10" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Inizializzazione</p>
            <div className="w-48 h-1.5 bg-outline rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,0,0.05),transparent_70%)]"></div>
        <div className="w-28 h-28 bg-primary rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl relative z-10 rotate-3">
          <Sprout className="w-14 h-14 text-accent" />
        </div>
        <h1 className="text-6xl font-black text-primary tracking-tighter mb-4 uppercase relative z-10">Sprout Journal</h1>
        <p className="text-on-surface-variant max-w-sm mb-12 text-lg font-medium leading-relaxed relative z-10">
          Il tuo ecosistema digitale per la coltivazione artigianale di micro-ortaggi.
        </p>
        <button 
          onClick={handleLogin}
          className="bg-primary text-on-primary px-14 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-on-accent transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center gap-4 relative z-10 group"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Inizia Ora
        </button>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'diario':
        return <Dashboard onSeeAll={() => setScreen('crops')} activeCrops={activeCrops} userProfile={userProfile} />;
      case 'catalogo':
        return <Catalog onSeeGuide={() => setScreen('guida')} user={user} />;
      case 'crops':
        return <ActiveCrops activeCrops={activeCrops} user={user} />;
      case 'guida':
        return <InteractiveGuide onBack={() => setScreen('catalogo')} />;
      case 'profilo':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] bg-surface-container-highest overflow-hidden shadow-2xl border-4 border-white rotate-3">
                <img 
                  src={user.photoURL || 'https://picsum.photos/seed/user/200/200'} 
                  alt="User" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                <CheckCircle className="w-6 h-6 text-on-accent" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">{userProfile?.displayName || 'Giardiniere'}</h2>
              <p className="text-on-surface-variant font-bold text-sm tracking-widest uppercase mt-1">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-md mt-12">
              <div className="bento-card p-8 bg-surface-container-low border-none shadow-xl">
                <p className="text-4xl font-black text-primary tracking-tighter mb-1">{userProfile?.totalBatches || 0}</p>
                <p className="text-[10px] font-black uppercase text-outline tracking-widest">Lotti Totali</p>
              </div>
              <div className="bento-card p-8 bg-surface-container-low border-none shadow-xl">
                <p className="text-4xl font-black text-primary tracking-tighter mb-1">{userProfile?.totalHarvest || 0}kg</p>
                <p className="text-[10px] font-black uppercase text-outline tracking-widest">Raccolto</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onSeeAll={() => setScreen('crops')} activeCrops={activeCrops} userProfile={userProfile} />;
    }
  };

  return (
    <Layout 
      currentScreen={currentScreen} 
      setScreen={setScreen}
      hideHeader={currentScreen === 'guida'}
      hideNav={currentScreen === 'guida'}
      onSave={handleSave}
      isLoading={isLoading}
      userProfile={{ ...userProfile, globalGrowth }}
    >
      {renderScreen()}
    </Layout>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <TimerProvider>
        <AppContent />
      </TimerProvider>
    </NotificationProvider>
  );
}
