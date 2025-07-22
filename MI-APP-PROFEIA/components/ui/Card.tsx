import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, onClick, className = '' }) => {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out animate-slide-up ${
        isClickable ? 'hover:scale-105 hover:shadow-[0_0_25px_rgba(196,181,253,0.3)] cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};