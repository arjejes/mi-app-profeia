
import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { Button } from './ui/Button';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showBackButton: boolean;
  onBack: () => void;
  onHome: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, showBackButton, onBack, onHome, onLogout }) => {
  return (
    <header className="bg-transparent p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {showBackButton && (
            <Button variant="ghost" onClick={onBack} className="!p-2 rounded-full bg-black/10 hover:bg-black/20">
              <ArrowLeftIcon className="w-6 h-6" />
            </Button>
          )}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
            <SparklesIcon className="h-8 w-8 text-violet-400" />
            <h1 className="text-2xl font-display font-bold text-white">
              ProfeIA
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="!p-2 rounded-full bg-black/10 hover:bg-black/20"
            >
                {theme === 'light' ? <MoonIcon className="h-6 w-6 text-white" /> : <SunIcon className="h-6 w-6 text-white" />}
            </Button>
            <Button
                variant="secondary"
                onClick={onLogout}
                aria-label="Logout"
                className="!p-2 !px-3 text-sm"
            >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
            </Button>
        </div>
      </div>
    </header>
  );
};
