import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { UserConfig } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';

interface MotivationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userConfig: UserConfig | null;
}

export const MotivationalModal: React.FC<MotivationalModalProps> = ({ isOpen, onClose, userConfig }) => {
  if (!userConfig) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4">
        <SparklesIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
          ¡Bienvenido/a, {userConfig.name}!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Estamos encantados de tenerte aquí. Prepárate para transformar tus clases de <span className="font-semibold text-violet-500">{userConfig.subject}</span>.
        </p>
        <p className="mt-4 text-lg italic text-gray-500 dark:text-gray-300">
          "Un buen maestro puede crear esperanza, encender la imaginación e inspirar amor por el aprendizaje."
        </p>
        <Button onClick={onClose} className="mt-8 w-full">
          Comenzar a Crear
        </Button>
      </div>
    </Modal>
  );
};