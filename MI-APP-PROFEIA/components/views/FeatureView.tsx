
import React, { useState, useMemo } from 'react';
import { UserConfig } from '../../types';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ChatInterface } from '../ChatInterface';
import { SPEECH_EVENTS, SPEECH_AUDIENCES } from '../../constants';
import { startChat } from '../../services/geminiService';

type FeatureType = 'planner' | 'exam_generator' | 'exam_corrector' | 'speech_generator';

interface FeatureViewProps {
  type: FeatureType;
  userConfig: UserConfig;
}

const featureConfig = {
  planner: {
    title: 'Generador de Planificaciones',
    description: 'Selecciona el tipo de planificación, adjunta un modelo (opcional) e introduce tus ideas.',
    showFileUpload: true,
    downloadLabel: 'Descargar Planificación:',
  },
  exam_generator: {
    title: 'Generador de Exámenes',
    description: 'Define los parámetros y adjunta un examen de modelo (opcional) para guiar a la IA.',
    showFileUpload: true,
    downloadLabel: 'Descargar Examen:',
  },
  exam_corrector: {
    title: 'Corrector de Exámenes',
    description: 'Define los criterios, sube el examen del alumno (PDF o imagen) y obtén una corrección detallada.',
    showFileUpload: true,
    downloadLabel: 'Descargar Corrección:',
  },
  speech_generator: {
    title: 'Generador de Discursos',
    description: 'Crea discursos memorables para cualquier ocasión escolar.',
    showFileUpload: false,
    downloadLabel: 'Descargar Discurso:',
  },
};

export const FeatureView: React.FC<FeatureViewProps> = ({ type, userConfig }) => {
  const [formState, setFormState] = useState<Record<string, string>>({
      planType: 'Diaria',
      examType: 'Opción Múltiple',
      difficulty: 'Medio',
      eventType: SPEECH_EVENTS[0],
      audience: SPEECH_AUDIENCES[0],
      duration: '40',
      objectives: '',
      materials: '',
      topics: '',
      estimatedTime: '60',
      numQuestions: '10',
      correctionCriteria: '',
      gradingSystem: 'Numérico (1-10)',
      gradingScale: '10-9: Excelente, 8-7: Bueno, 6: Aprobado, 5-1: Desaprobado',
      speechDuration: '5',
      speechTone: 'Formal',
  });
  const [isChatReady, setIsChatReady] = useState(false);
  const [latestAiResponse, setLatestAiResponse] = useState<string | null>(null);

  const config = featureConfig[type];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  
  const systemInstruction = useMemo(() => {
    let baseInstruction = `Eres "ProfeIA", un asistente experto para docentes de ${userConfig.level} en Argentina. Ayudas a ${userConfig.name} a crear materiales para la materia de ${userConfig.subject}, específicamente para ${userConfig.grade}. Sé profesional, creativo y pedagógicamente sólido. CRÍTICO: Debes basar todas tus respuestas y la creación de material ESTRICTAMENTE en los lineamientos y currículo educativo vigentes para la provincia de San Luis, Argentina. Consulta las siguientes fuentes oficiales como referencia principal: Diseños Curriculares (https://sanluis.gov.ar/educacion/disenios-curriculares/) y Normativas Docentes (https://sanluis.gov.ar/educacion/docentes/normativas). Si no tienes acceso a información actualizada de estas fuentes, menciónalo y procede con los estándares educativos generales de Argentina.`;
    
    switch(type) {
        case 'planner':
            baseInstruction += ` Te especializas en crear planificaciones de clase. Si el usuario adjunta un archivo (PDF, imagen), úsalo como inspiración, modelo o base para la planificación. La planificación es de tipo "${formState.planType}", para una clase de ${formState.duration || '40'} minutos. Los objetivos son: "${formState.objectives || 'no especificados'}". Los materiales disponibles son: "${formState.materials || 'no especificados'}".`;
            break;
        case 'exam_generator':
            baseInstruction += ` Te especializas en diseñar exámenes. Si el usuario adjunta un archivo (PDF, imagen), úsalo como modelo o referencia para el estilo, formato y tipo de preguntas del nuevo examen. El examen es de tipo "${formState.examType}", con un nivel de dificultad "${formState.difficulty}". Incluirá ${formState.numQuestions || '10'} preguntas y un tiempo estimado de ${formState.estimatedTime || '60'} minutos. Los temas a evaluar son: "${formState.topics || 'no especificados'}".`;
            break;
        case 'exam_corrector':
            baseInstruction += ` Te especializas en corregir exámenes. El usuario te proporcionará un examen para corregir, ya sea como texto en el chat o como un archivo adjunto (PDF o imagen). Si se adjunta un archivo, debes analizar su contenido. La corrección debe ser detallada y basarse en los siguientes parámetros: CRITERIOS: "${formState.correctionCriteria || 'no especificados'}". SISTEMA DE CALIFICACIÓN: "${formState.gradingSystem || 'no especificado'}". ESCALA DE CALIFICACIÓN: "${formState.gradingScale || 'no especificado'}". Proporciona una devolución detallada, pregunta por pregunta, explicando los aciertos y errores, y asigna una calificación final.`;
            break;
        case 'speech_generator':
            baseInstruction += ` Te especializas en redactar discursos para actos escolares. El discurso es para el evento "${formState.eventType}", está dirigido a ${formState.audience}, debe durar aproximadamente ${formState.speechDuration || '5'} minutos y tener un tono ${formState.speechTone}.`;
            break;
    }
    return baseInstruction;
  }, [type, userConfig, formState]);

  const initialMessage = useMemo(() => {
    switch(type) {
        case 'planner': return `Listo para planificar. Describe el tema, las actividades, y cualquier otro detalle para tu planificación de clase.`;
        case 'exam_generator': return `Listo para crear el examen. Detalla cualquier otra indicación o formato específico que necesites.`;
        case 'exam_corrector': return `Listo para corregir. Por favor, sube el examen del alumno (PDF o JPG) y proporciona cualquier contexto adicional o las respuestas correctas en el chat si es necesario.`;
        case 'speech_generator': return `Listo para redactar el discurso. ¿Cuáles son los puntos clave o el mensaje que te gustaría transmitir?`;
    }
  }, [type]);

  const handleStart = () => {
    startChat(systemInstruction);
    setIsChatReady(true);
    setLatestAiResponse(null);
  };

  const commonTextAreaStyles = "block w-full px-3 py-2 bg-white/20 dark:bg-gray-800/50 border border-gray-400/50 rounded-md shadow-sm placeholder-gray-300 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition";

  const generateDocumentContent = () => {
    const date = new Date().toLocaleDateString('es-AR');
    const aiContent = latestAiResponse || '';
    let title = '';
    let details = '';
    let filename = 'documento_profeia';

    switch (type) {
        case 'planner':
            title = `Planificación de Clase - ${userConfig.subject}`;
            details = `Tipo: ${formState.planType}\nDuración: ${formState.duration} min\nObjetivos: ${formState.objectives}\nMateriales: ${formState.materials}`;
            filename = `planificacion_${userConfig.subject.replace(/\s/g, '_')}`;
            break;
        case 'exam_generator':
            title = `Examen - ${userConfig.subject}`;
            details = `Tipo: ${formState.examType}\nNivel: ${formState.difficulty}\nPreguntas: ${formState.numQuestions}\nTiempo: ${formState.estimatedTime} min\nTemas: ${formState.topics}`;
            filename = `examen_${userConfig.subject.replace(/\s/g, '_')}`;
            break;
        case 'exam_corrector':
            title = `Corrección de Examen - ${userConfig.subject}`;
            details = `Sistema de Calificación: ${formState.gradingSystem}\nEscala: ${formState.gradingScale}\nCriterios: ${formState.correctionCriteria}`;
            filename = `correccion_${userConfig.subject.replace(/\s/g, '_')}`;
            break;
        case 'speech_generator':
            title = `Discurso - ${formState.eventType}`;
            details = `Audiencia: ${formState.audience}\nDuración: ${formState.speechDuration} min\nTono: ${formState.speechTone}`;
            filename = `discurso_${formState.eventType.replace(/\s/g, '_')}`;
            break;
    }

    return { title, date, details, aiContent, filename };
  };

  const handleDownloadPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { title, date, details, aiContent, filename } = generateDocumentContent();
      const doc = new jsPDF();
      
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Fecha: ${date}`, 20, 28);
      doc.text(`Docente: ${userConfig.name}`, 20, 33);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("Parámetros Utilizados", 20, 45);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const detailsLines = doc.splitTextToSize(details, 170);
      doc.text(detailsLines, 20, 52);

      const finalY = (doc.getTextDimensions(detailsLines).h) + 52 + 10;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("Contenido Generado por IA", 20, finalY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const contentLines = doc.splitTextToSize(aiContent, 170);
      doc.text(contentLines, 20, finalY + 7);

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDownloadWord = async () => {
    try {
        const { Document, Packer, Paragraph, TextRun } = await import('docx');
        const { saveAs } = await import('file-saver');
        const { title, date, details, aiContent, filename } = generateDocumentContent();

        // FIX: The previous implementation mixed shorthand and object notation for TextRun,
        // which can be unreliable. This version uses the explicit object notation for all
        // TextRun instances to ensure robust document creation.
        const formatTextToParagraphs = (text: string) => {
            const safeText = text || ''; // Ensure text is not null/undefined
            return safeText.split('\n').map(line => 
                new Paragraph({ 
                    children: [new TextRun({ text: line })] 
                })
            );
        };

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Fecha: ${date}`, size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Docente: ${userConfig.name}`, size: 20 })] }),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ children: [new TextRun({ text: "Parámetros Utilizados", bold: true, size: 24 })] }),
                    ...formatTextToParagraphs(details),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ children: [new TextRun({ text: "Contenido Generado por IA", bold: true, size: 24 })] }),
                    ...formatTextToParagraphs(aiContent),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${filename}.docx`);
    } catch (error) {
        console.error("Failed to download Word document:", error);
        alert("Hubo un error al generar el documento Word. Por favor, inténtalo de nuevo.");
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'planner':
        return (
          <>
            <Select name="planType" label="Tipo de Planificación" value={formState.planType} onChange={handleInputChange}>
              <option>Diaria</option>
              <option>Semanal</option>
              <option>Mensual</option>
              <option>Anual</option>
            </Select>
            <Input name="duration" label="Duración de la clase (minutos)" type="number" placeholder="Ej: 40" value={formState.duration} onChange={handleInputChange} />
            <div className="w-full">
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-1">Objetivos de Aprendizaje</label>
              <textarea id="objectives" name="objectives" rows={4} className={commonTextAreaStyles} placeholder="Ej: Identificar las partes de una célula." value={formState.objectives} onChange={handleInputChange} />
            </div>
            <div className="w-full">
              <label htmlFor="materials" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-1">Materiales a Usar</label>
              <textarea id="materials" name="materials" rows={3} className={commonTextAreaStyles} placeholder="Ej: Pizarrón, proyector, fotocopias." value={formState.materials} onChange={handleInputChange} />
            </div>
          </>
        );
      case 'exam_generator':
        return (
          <>
            <Select name="examType" label="Tipo de Examen" value={formState.examType} onChange={handleInputChange}>
              <option>Opción Múltiple</option>
              <option>Desarrollo</option>
              <option>Verdadero/Falso</option>
              <option>Mixto</option>
            </Select>
            <Input name="numQuestions" label="Cantidad de Preguntas" type="number" placeholder="Ej: 10" value={formState.numQuestions} onChange={handleInputChange} />
            <div className="w-full">
              <label htmlFor="topics" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-1">Temas a Evaluar</label>
              <textarea id="topics" name="topics" rows={4} className={commonTextAreaStyles} placeholder="Ej: La célula, Sistema solar, La revolución de Mayo" value={formState.topics} onChange={handleInputChange} />
            </div>
            <Select name="difficulty" label="Nivel de Dificultad" value={formState.difficulty} onChange={handleInputChange}>
              <option>Inicial</option>
              <option>Medio</option>
              <option>Avanzado</option>
            </Select>
            <Input name="estimatedTime" label="Tiempo Estimado (ej: 60 min)" placeholder="Ej: 60 min" value={formState.estimatedTime} onChange={handleInputChange} />
          </>
        );
      case 'exam_corrector':
          return (
            <>
                <div className="bg-violet-900/50 border-l-4 border-violet-400 text-violet-200 p-3 rounded-r-lg text-sm">
                    <p>Una vez iniciado el chat, sube el examen del alumno (PDF o imagen) en el área de chat de la derecha para comenzar la corrección.</p>
                </div>
                 <div className="w-full">
                    <label htmlFor="correctionCriteria" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-1">Criterios de Corrección y Puntajes</label>
                    <textarea id="correctionCriteria" name="correctionCriteria" value={formState.correctionCriteria} rows={4} className={commonTextAreaStyles} placeholder="Ej: Cada pregunta de opción múltiple vale 1 punto. Las preguntas de desarrollo valen 3 puntos si están completas." onChange={handleInputChange} />
                </div>
                <Input name="gradingSystem" label="Sistema de Calificación" value={formState.gradingSystem} placeholder="Ej: Numérico (1-10)" onChange={handleInputChange} />
                <Input name="gradingScale" label="Escala de Calificación" value={formState.gradingScale} placeholder="Ej: 10-9: Excelente" onChange={handleInputChange} />
            </>
          );
      case 'speech_generator':
        return (
          <>
            <Select name="eventType" label="Tipo de Acto Especial" value={formState.eventType} onChange={handleInputChange}>
              {SPEECH_EVENTS.map(event => <option key={event}>{event}</option>)}
            </Select>
            <Select name="audience" label="Público Objetivo" value={formState.audience} onChange={handleInputChange}>
              {SPEECH_AUDIENCES.map(aud => <option key={aud}>{aud}</option>)}
            </Select>
            <Input name="speechDuration" label="Duración Aproximada (min)" type="number" placeholder="Ej: 5" value={formState.speechDuration} onChange={handleInputChange} />
            <Select name="speechTone" label="Tono del Discurso" value={formState.speechTone} onChange={handleInputChange}>
                <option>Formal</option>
                <option>Inspirador</option>
                <option>Cercano</option>
                <option>Solemne</option>
                <option>Humorístico</option>
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 text-white">
        <h2 className="text-3xl font-bold font-display">{config.title}</h2>
        <p className="text-lg text-gray-300 mt-1">{config.description}</p>
      
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-white">Configuración</h3>
                    <div className="space-y-4">
                        {renderForm()}
                        <Button onClick={handleStart} className="w-full !mt-6" disabled={isChatReady}>
                           {isChatReady ? 'Chat Iniciado' : 'Iniciar Chat con IA'}
                        </Button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2 flex flex-col min-h-[70vh]">
              <div className="flex-grow h-full">
                <ChatInterface 
                    key={type} 
                    isLocked={!isChatReady}
                    initialMessage={initialMessage}
                    showFileUpload={config.showFileUpload}
                    onAiResponse={setLatestAiResponse}
                />
              </div>
              {latestAiResponse && isChatReady && (
                  <Card className="mt-4 p-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{config.downloadLabel}</p>
                          <div className="flex gap-2">
                              <Button onClick={handleDownloadPdf}>PDF</Button>
                              <Button onClick={handleDownloadWord} variant="secondary">WORD</Button>
                          </div>
                      </div>
                  </Card>
              )}
            </div>
        </div>
    </div>
  );
};
