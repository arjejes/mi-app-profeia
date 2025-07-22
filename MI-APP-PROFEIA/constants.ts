
import { EducationalLevel } from './types';

export const GRADES_BY_LEVEL: Record<EducationalLevel, string[]> = {
  [EducationalLevel.Inicial]: ["Sala de 3 años", "Sala de 4 años", "Sala de 5 años"],
  [EducationalLevel.Primario]: ["Primer Grado", "Segundo Grado", "Tercer Grado", "Cuarto Grado", "Quinto Grado", "Sexto Grado"],
  [EducationalLevel.Secundario]: ["Primer Año", "Segundo Año", "Tercer Año", "Cuarto Año", "Quinto Año", "Sexto Año"],
  [EducationalLevel.Terciario]: ["Primer Año", "Segundo Año", "Tercer Año"],
  [EducationalLevel.Universitario]: ["No aplica"],
};

export const SPEECH_EVENTS = [
    "Acto de Inicio de Ciclo Lectivo",
    "Día de la Bandera",
    "Día de la Independencia",
    "Paso a la Inmortalidad del Gral. San Martín",
    "Día del Maestro",
    "Día de la Diversidad Cultural",
    "Acto de Fin de Ciclo Lectivo",
];

export const SPEECH_AUDIENCES = ["Directivos", "Docentes", "Alumnos", "Padres", "Comunidad Educativa"];
