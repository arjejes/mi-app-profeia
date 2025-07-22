
export enum EducationalLevel {
  Inicial = "Nivel Inicial",
  Primario = "Nivel Primario",
  Secundario = "Nivel Secundario",
  Terciario = "Nivel Terciario",
  Universitario = "Nivel Universitario",
}

export interface UserConfig {
  name: string;
  subject: string;
  level: EducationalLevel;
  grade: string;
}

export type AppView =
  | "login"
  | "config"
  | "dashboard"
  | "planner"
  | "exam_generator"
  | "exam_corrector"
  | "speech_generator"
  | "calendar";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  files?: { name: string; type: string; size: number }[];
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activity: string;
}
