
import React from 'react';

const icons = {
    planner: <path d="M8 2v4M16 2v4M3 10h18M3 6h18M7 14h.01M11 14h.01M15 14h.01M7 18h.01M11 18h.01M15 18h.01" />,
    exam_generator: <path d="m14 2-1.45 2.9A5 5 0 0 0 16.94 9L20 6Z"/><path d="m12 12 5 5"/><path d="M3.24 10.55c-.17-.12-.3-.28-.39-.47s-.14-.4-.14-.61c0-.21.05-.42.14-.61s.22-.35.39-.47l4.24-2.5c.34-.2.74-.28 1.13-.28s.79.08 1.13.28l4.24 2.5c.17.12.3.28.39-.47s.14.4.14.61c0 .21-.05.42-.14.61s-.22.35-.39-.47l-4.24 2.5c-.34.2-.74.28-1.13-.28s-.79-.08-1.13-.28Z"/><path d="M21 16a2 2 0 0 1-2 2h-2l-3-3 3-3h2a2 2 0 0 1 2 2Z"/>,
    exam_corrector: <path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8 0 1.06-.275 2.066-.75 2.966M13.5 9l-4 4M13.5 13l-4-4"/><path d="m15 5 6 6"/><path d="m21 11-4-4"/><path d="m3 14 3.09 3.09a3 3 0 0 0 4.24 0L18 9.5"/>,
    speech_generator: <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M16 20h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2"/><path d="M12 12h0"/>,
    calendar: <path d="M8 2v4M16 2v4M3 10h18M3 6h18M7 14h.01M11 14h.01M15 14h.01M7 18h.01M11 18h.01M15 18h.01" />,
};

export const MenuIcon: React.FC<{ name: keyof typeof icons, className?: string }> = ({ name, className }) => (
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
    {icons[name]}
  </svg>
);
