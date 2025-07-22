
import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface CalendarViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventTime, setEventTime] = useState('09:00');
  const [eventActivity, setEventActivity] = useState('');

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ key: `empty-${i}`, empty: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(e => e.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));
      days.push({ key: `day-${i}`, day: i, date, events: dayEvents });
    }
    return days;
  }, [currentDate, events, daysInMonth, startDay]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setEventActivity('');
    setEventTime('09:00');
    setSelectedDate(null);
  };

  const handleDayClick = (dayDate: Date) => {
    setEditingEvent(null);
    setSelectedDate(dayDate);
    setEventActivity('');
    setEventTime('09:00');
    setIsModalOpen(true);
  };
  
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    // FIX: Check if the click target is the delete button to prevent the edit modal from opening on delete.
    if ((e.target as HTMLElement).closest('.delete-event-btn')) {
        return;
    }
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(new Date(`${event.date}T00:00:00`)); // Ensure correct date object
    setEventActivity(event.activity);
    setEventTime(event.time);
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = () => {
    if (!selectedDate || !eventActivity.trim()) return;

    const eventData = {
        date: selectedDate.toISOString().split('T')[0],
        time: eventTime,
        activity: eventActivity.trim(),
    };
    
    if (editingEvent) {
        // Update existing event
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? {...e, ...eventData} : e)
            .sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()));
    } else {
        // Add new event
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            ...eventData
        };
        setEvents(prev => [...prev, newEvent]
            .sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()));
    }
    
    closeModalAndReset();
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const confirmAndDelete = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro que quieres eliminar la actividad "${event.activity}"?`)) {
        handleDeleteEvent(event.id);
    }
  };

  const handleDeleteFromModal = () => {
    if(editingEvent) {
      if (window.confirm(`¿Estás seguro que quieres eliminar la actividad "${editingEvent.activity}"?`)) {
        handleDeleteEvent(editingEvent.id);
        closeModalAndReset();
      }
    }
  };

  const upcomingEvents = events.filter(event => new Date(`${event.date}T${event.time}`) >= new Date());

  return (
    <div className="container mx-auto p-4 md:p-8 text-white">
      <h2 className="text-3xl font-bold font-display">Calendario y Agenda</h2>
      <p className="text-lg text-gray-300 mt-1">Agenda tus actividades y recibe recordatorios con voz.</p>
      
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="p-2 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handlePrevMonth} className="!p-2.5">
                        <span className="hidden sm:inline">Anterior</span>
                        <span className="sm:hidden font-bold">&lt;</span>
                    </Button>
                    <h3 className="text-lg sm:text-xl font-bold text-center">
                        {currentDate.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                    </h3>
                    <Button onClick={handleNextMonth} className="!p-2.5">
                        <span className="hidden sm:inline">Siguiente</span>
                        <span className="sm:hidden font-bold">&gt;</span>
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-violet-300">
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
                    {calendarDays.map(day => (
                        day.empty ? <div key={day.key}></div> :
                        <div key={day.key} onClick={() => handleDayClick(day.date)} className="p-1 h-20 sm:p-2 sm:h-28 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors duration-200 flex flex-col overflow-hidden">
                            <span className="font-bold text-sm">{day.day}</span>
                            <div className="overflow-y-auto text-[10px] sm:text-xs mt-1 space-y-1">
                                {day.events.map(event => (
                                    <div key={event.id} onClick={(e) => handleEventClick(event, e)} className="group relative bg-violet-500/50 p-1 pr-4 rounded hover:bg-violet-400/50 cursor-pointer">
                                        <span className="block w-full h-full truncate" title={event.activity}>{event.activity}</span>
                                        <button
                                            onClick={(e) => confirmAndDelete(event, e)}
                                            className="delete-event-btn absolute top-1/2 right-0.5 transform -translate-y-1/2 p-0.5 bg-red-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                            aria-label={`Eliminar actividad: ${event.activity}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="p-6 h-full">
                <h3 className="font-bold text-xl mb-4 text-white">Próximas Actividades</h3>
                <div className="space-y-3 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <div key={event.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{event.activity}</p>
                                    <p className="text-sm text-gray-300">{new Date(`${event.date}T${event.time}`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} - {event.time} hs</p>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Button 
                                        variant="ghost" 
                                        className="!p-1 !px-2 sm:!p-2 sm:!px-3 text-xs" 
                                        onClick={(e) => handleEventClick(event, e)}
                                        aria-label={`Editar actividad: ${event.activity}`}
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        className="!p-1 !px-2 sm:!p-2 sm:!px-3 text-xs !bg-red-800/50 hover:!bg-red-700/50" 
                                        onClick={(e) => confirmAndDelete(event, e)}
                                        aria-label={`Eliminar actividad: ${event.activity}`}
                                    >
                                        Borrar
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No tienes actividades agendadas.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset}>
        <h3 className="text-2xl font-bold mb-4">{editingEvent ? 'Editar Actividad' : 'Agendar Actividad'}</h3>
        {selectedDate && <p className="mb-4">Fecha: {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
        <div className="space-y-4">
            <Input label="Hora" type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} />
            <Input label="Actividad" type="text" placeholder="Ej: Corregir exámenes" value={eventActivity} onChange={e => setEventActivity(e.target.value)} />
            <div className="flex justify-between items-center pt-4">
                <div>
                    {editingEvent && (
                        <Button variant="secondary" className="!bg-red-800 hover:!bg-red-700" onClick={handleDeleteFromModal}>Eliminar</Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={closeModalAndReset}>Cancelar</Button>
                    <Button onClick={handleSaveEvent}>{editingEvent ? 'Guardar Cambios' : 'Guardar'}</Button>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};
