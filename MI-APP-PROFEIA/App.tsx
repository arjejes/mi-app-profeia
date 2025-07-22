import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, UserConfig, CalendarEvent } from './types';
import { Header } from './components/Header';
import { ConfigView } from './components/views/ConfigView';
import { DashboardView } from './components/views/DashboardView';
import { FeatureView } from './components/views/FeatureView';
import { MotivationalModal } from './components/ui/MotivationalModal';
import { LoginView } from './components/views/LoginView';
import { initAi } from './services/geminiService';
import { Spinner } from './components/ui/Spinner';
import { CalendarView } from './components/views/CalendarView';

type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [view, setView] = useState<AppView>('login'); 
  const [showMotivationalModal, setShowMotivationalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const triggeredEventsRef = useRef<Set<string>>(new Set());

  // Restore state from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme); else document.documentElement.classList.add('dark');

    const savedConfig = localStorage.getItem('profeia-userConfig');
    if (savedConfig) {
      try { setUserConfig(JSON.parse(savedConfig)); }
      catch (e) { localStorage.removeItem('profeia-userConfig'); }
    }
    
    const savedEvents = localStorage.getItem('profeia-events');
    if(savedEvents) {
        try { setEvents(JSON.parse(savedEvents)); }
        catch (e) { localStorage.removeItem('profeia-events'); }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (userConfig) localStorage.setItem('profeia-userConfig', JSON.stringify(userConfig));
  }, [userConfig]);

  useEffect(() => {
    // Always save the current state of events, including an empty array.
    // This ensures that deleting the last event correctly clears it from storage.
    localStorage.setItem('profeia-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (view !== 'login' && view !== 'config') localStorage.setItem('profeia-appView', view);
  }, [view]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Voice Alarm System
  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentTime = now.toTimeString().substring(0, 5); // HH:MM

        events.forEach(event => {
            if(event.date === currentDate && event.time === currentTime && !triggeredEventsRef.current.has(event.id)) {
                console.log(`Triggering alarm for: ${event.activity}`);
                const utterance = new SpeechSynthesisUtterance(`Recordatorio: ${event.activity}`);
                utterance.lang = 'es-AR';
                window.speechSynthesis.speak(utterance);
                triggeredEventsRef.current.add(event.id);
            }
        });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [events]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      initAi(key);
      setApiKey(key);
      if (userConfig) {
        const savedView = localStorage.getItem('profeia-appView') as AppView;
        setView(savedView || 'dashboard');
      } else {
        setView('config');
      }
    } catch (e) {
      setError("La clave API no es válida o no se pudo inicializar la IA. Inténtalo de nuevo.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigured = (config: UserConfig) => {
    setUserConfig(config);
    setView('dashboard');
    setShowMotivationalModal(true);
  };
  
  const handleBackToDashboard = useCallback(() => {
    if (view !== 'dashboard') setView('dashboard');
  }, [view]);

  const handleLogout = () => {
    setApiKey(null);
    setView('login');
  };

  const renderView = () => {
    if (!apiKey) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <LoginView onLogin={handleLogin} isLoading={isLoading} />
        </div>
      );
    }

    if (!userConfig) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <ConfigView onConfigured={handleConfigured} />
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <DashboardView userConfig={userConfig} setView={setView} />;
      case 'planner':
      case 'exam_generator':
      case 'exam_corrector':
      case 'speech_generator':
        return <FeatureView type={view} userConfig={userConfig} />;
      case 'calendar':
        return <CalendarView events={events} setEvents={setEvents} />;
      default:
        return <DashboardView userConfig={userConfig} setView={setView} />;
    }
  };

  const showHeader = !!apiKey && !!userConfig;

  return (
    <div className="relative min-h-screen w-full">
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        {showHeader && <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          showBackButton={view !== 'dashboard'} 
          onBack={handleBackToDashboard} 
          onHome={handleBackToDashboard} 
          onLogout={handleLogout}
        />}
        <main className="flex-grow">
          {error && (
            <div className="container mx-auto p-4 text-center">
              <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-white">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="underline mt-2">Descartar</button>
              </div>
            </div>
          )}
          {renderView()}
        </main>
        {userConfig && <MotivationalModal 
          isOpen={showMotivationalModal}
          onClose={() => setShowMotivationalModal(false)}
          userConfig={userConfig}
        />}
      </div>
    </div>
  );
}