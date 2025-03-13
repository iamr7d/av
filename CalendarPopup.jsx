import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { HiX, HiCalendar, HiClock, HiInformationCircle } from 'react-icons/hi';

/**
 * CalendarPopup - A reusable popup component for adding events to the calendar
 * Compatible with both direct usage and from OpportunityCard
 */
const CalendarPopup = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDate,
  // New props for compatibility with OpportunityCard
  title: initialTitle,
  description: initialDescription,
  date: directDate
}) => {
  // Handle both prop patterns
  const [date, setDate] = useState(directDate || initialDate || new Date());
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [eventType, setEventType] = useState('deadline');
  
  // Update state when props change
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialDescription) setDescription(initialDescription);
    if (directDate) setDate(directDate);
  }, [initialTitle, initialDescription, directDate]);
  
  const handleSave = () => {
    // If onSave is provided, use it
    if (onSave) {
      onSave({
        date,
        title,
        description,
        eventType
      });
    } else {
      // Otherwise, save to localStorage for the Calendar page to use
      const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      events.push({
        id: Date.now().toString(),
        date: date.toISOString(),
        title,
        description,
        eventType
      });
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
    
    // Close the popup
    if (onClose) {
      onClose();
    }
  };
  
  // If called from OpportunityCard without isOpen prop
  const isVisible = isOpen !== undefined ? isOpen : true;
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose || (() => {})}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Add to Calendar</h3>
          <button 
            onClick={onClose || (() => {})}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-slate-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <HiCalendar className="mr-1" />
              Date
            </label>
            <input
              type="date"
              id="event-date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(date);
                const [year, month, day] = e.target.value.split('-').map(Number);
                newDate.setFullYear(year);
                newDate.setMonth(month - 1);
                newDate.setDate(day);
                setDate(newDate);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="event-time" className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <HiClock className="mr-1" />
              Time
            </label>
            <input
              type="time"
              id="event-time"
              value={format(date, 'HH:mm')}
              onChange={(e) => {
                const newDate = new Date(date);
                const [hours, minutes] = e.target.value.split(':').map(Number);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                setDate(newDate);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="event-type" className="block text-sm font-medium text-slate-700 mb-1">
              Event Type
            </label>
            <select
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="deadline">Deadline</option>
              <option value="meeting">Meeting</option>
              <option value="academic">Academic</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <HiInformationCircle className="mr-1" />
              Description
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
              placeholder="Enter event description"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose || (() => {})}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Event
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalendarPopup;
