import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SparklesIcon } from '../icons/SparklesIcon';
import { Card } from '../ui/Card';

interface LoginViewProps {
  onLogin: (apiKey: string) => void;
  isLoading: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, isLoading }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onLogin(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
        <div className="p-8 text-center text-white">
          <SparklesIcon className="mx-auto h-16 w-16 mb-4 text-violet-300" />
          <h1 className="text-5xl font-display font-extrabold tracking-tight">
            ProfeIA
          </h1>
          <p className="mt-2 text-lg text-gray-200">
            Tu asistente docente inteligente.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              id="api-key"
              type="password"
              placeholder="Introduce tu clave API de Gemini"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-center bg-white/20 dark:bg-gray-800/50 border-gray-400/50 text-white placeholder-gray-300"
              required
            />
            <Button
              type="submit"
              className="w-full !py-3 text-lg"
              isLoading={isLoading}
              disabled={!apiKey.trim()}
            >
              Continuar
            </Button>
          </form>
          <p className="mt-4 text-xs text-gray-300">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-white"
            >
              ¿No tienes una clave? Consíguela aquí
            </a>
          </p>
        </div>
    </Card>
  );
};