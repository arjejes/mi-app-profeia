import React, { useState, useEffect } from 'react';
import { EducationalLevel, UserConfig } from '../../types';
import { GRADES_BY_LEVEL } from '../../constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

interface ConfigViewProps {
  onConfigured: (config: UserConfig) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({ onConfigured }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState<EducationalLevel>(EducationalLevel.Secundario);
  const [grade, setGrade] = useState('');
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);

  useEffect(() => {
    const gradesForLevel = GRADES_BY_LEVEL[level];
    setAvailableGrades(gradesForLevel);
    setGrade(gradesForLevel[0] || '');
  }, [level]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && subject && level && grade) {
      onConfigured({ name, subject, level, grade });
    }
  };
  
  const commonInputStyles = "text-white bg-white/20 dark:bg-gray-800/50 border-gray-400/50 placeholder-gray-300 focus:text-white";

  return (
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold">Configuración del Docente</h2>
            <p className="mt-2 text-gray-300">Cuéntanos un poco sobre ti para personalizar tu experiencia.</p>
          </div>
          
          <Input
            id="name"
            label="Tu Nombre"
            placeholder="Ej. Ana Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={commonInputStyles}
            required
          />

          <Input
            id="subject"
            label="Materia que enseñas"
            placeholder="Ej. Matemática, Historia, Literatura"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={commonInputStyles}
            required
          />

          <Select
            id="level"
            label="Nivel Educativo"
            value={level}
            onChange={(e) => setLevel(e.target.value as EducationalLevel)}
            className={commonInputStyles}
            required
          >
            {Object.values(EducationalLevel).map((lvl) => (
              <option key={lvl} value={lvl} className="text-black">{lvl}</option>
            ))}
          </Select>
          
          {level !== EducationalLevel.Universitario ? (
            <Select
              id="grade"
              label={level === EducationalLevel.Secundario ? "Año" : "Grado"}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={commonInputStyles}
              required
            >
              {availableGrades.map((grd) => (
                <option key={grd} value={grd} className="text-black">{grd}</option>
              ))}
            </Select>
          ) : (
            <Input
              id="grade"
              label="Carrera o Asignatura"
              placeholder="Ej. Ingeniería de Software"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={commonInputStyles}
              required
            />
          )}

          <Button type="submit" className="w-full !mt-8" disabled={!name || !subject || !grade}>
            Guardar y Continuar
          </Button>
        </form>
      </Card>
  );
};