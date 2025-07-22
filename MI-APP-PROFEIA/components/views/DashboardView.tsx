
import React from 'react';
import { Card } from '../ui/Card';
import { MenuIcon } from '../icons/MenuIcon';
import { AppView, UserConfig } from '../../types';

interface DashboardViewProps {
  userConfig: UserConfig;
  setView: (view: AppView) => void;
}

const menuItems = [
  { view: 'planner', title: 'Generar Planificaciones', icon: 'planner', description: 'Crea planes de clase diarios, mensuales o anuales.' },
  { view: 'exam_generator', title: 'Generar Exámenes', icon: 'exam_generator', description: 'Diseña evaluaciones de opción múltiple, desarrollo y más.' },
  { view: 'exam_corrector', title: 'Corregir Exámenes', icon: 'exam_corrector', description: 'Sube exámenes y obtén correcciones y calificaciones automáticas.' },
  { view: 'speech_generator', title: 'Generar Discursos', icon: 'speech_generator', description: 'Prepara discursos para actos escolares y eventos especiales.' },
  { view: 'calendar', title: 'Calendario y Agenda', icon: 'calendar', description: 'Agenda tus actividades laborales y recibe recordatorios.' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ userConfig, setView }) => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="animate-fade-in mb-8 text-white">
        <h2 className="text-3xl font-bold font-display">
          Hola, {userConfig.name.split(' ')[0]}. ¿Qué necesitas crear hoy?
        </h2>
        <p className="text-lg text-gray-300 mt-1">
          Panel de control para {userConfig.subject} - {userConfig.level}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Card key={item.view} onClick={() => setView(item.view as AppView)} className="group">
            <div className="p-6 flex flex-col items-start h-full text-white">
              <div className="p-3 bg-violet-100/20 dark:bg-violet-900/50 rounded-lg transition-colors duration-300">
                <MenuIcon name={item.icon as any} className="h-8 w-8 text-violet-300" />
              </div>
              <h3 className="mt-4 text-xl font-bold font-display">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-300 flex-grow">
                {item.description}
              </p>
              <div className="mt-4 text-violet-400 font-semibold flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                Comenzar <span aria-hidden="true">&rarr;</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
