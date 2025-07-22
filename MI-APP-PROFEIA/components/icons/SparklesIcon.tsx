
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.937 15.5L12 20l2.063-4.5L18.5 13.5l-4.5-2.063L12 7l-2.063 4.5L5.5 13.5z" />
    <path d="M18 4h.01" />
    <path d="M6 20h.01" />
  </svg>
);
