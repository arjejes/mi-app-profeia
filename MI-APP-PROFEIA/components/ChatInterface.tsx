
import React, { useState, useRef, useEffect } from 'react';
import { Message, FileData } from '../types';
import { Button } from './ui/Button';
import { generateContent } from '../services/geminiService';
import { FileUpload } from './ui/FileUpload';

interface ChatInterfaceProps {
  initialMessage?: string;
  placeholderText?: string;
  showFileUpload?: boolean;
  onAiResponse?: (text: string) => void;
  isLocked?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessage = "Hola, ¿cómo puedo ayudarte hoy?",
  placeholderText = "Escribe tu consulta aquí...",
  showFileUpload = false,
  onAiResponse,
  isLocked = false,
}) => {
  const lockedMessage = { id: 'locked', sender: 'ai' as const, text: 'Completa la configuración de la izquierda y haz clic en "Iniciar Chat" para comenzar.'};
  const [messages, setMessages] = useState<Message[]>(
    isLocked ? [lockedMessage] : [{ id: 'initial', sender: 'ai', text: initialMessage }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // When chat is unlocked, replace the locked message with the initial message
    if (!isLocked) {
      setMessages(currentMessages => {
        if (currentMessages.length === 1 && currentMessages[0].id === 'locked') {
          return [{ id: 'initial', sender: 'ai', text: initialMessage }];
        }
        return currentMessages;
      });
    }
  }, [isLocked, initialMessage]);

  const handleSend = async () => {
    if ((input.trim() === '' && files.length === 0) || isLocked) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const aiResponseText = await generateContent(input, files);
      if (onAiResponse) {
        onAiResponse(aiResponseText);
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Hubo un error al procesar tu solicitud. Inténtalo de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setFiles([]); // Clear files after sending
    }
  };
  
  const handleFilesSelected = (selectedFiles: FileData[]) => {
      setFiles(selectedFiles);
  };

  return (
    <div className="flex flex-col h-full bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-inner text-white">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-violet-500 text-white'
                : 'bg-gray-200/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 border-t border-violet-400 dark:border-gray-600 pt-2 text-xs">
                      <p className="font-semibold">Archivos adjuntos:</p>
                      <ul className="list-disc list-inside">
                        {msg.files.map(f => <li key={f.name}>{f.name}</li>)}
                      </ul>
                  </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-lg p-3 rounded-lg bg-gray-200/80 dark:bg-gray-800/80">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 dark:border-gray-700/50">
        {showFileUpload && <FileUpload onFilesSelected={handleFilesSelected} />}
        <div className="mt-2 flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder={isLocked ? 'Inicia el chat para escribir...' : placeholderText}
            className="flex-1 p-2 border border-gray-400/50 rounded-lg bg-white/20 dark:bg-gray-800/50 text-white placeholder-gray-300 focus:ring-violet-500 focus:border-violet-500 resize-none transition disabled:opacity-50"
            rows={2}
            disabled={isLoading || isLocked}
          />
          <Button onClick={handleSend} isLoading={isLoading} disabled={isLocked}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};
