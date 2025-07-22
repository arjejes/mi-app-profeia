import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
  </div>
);