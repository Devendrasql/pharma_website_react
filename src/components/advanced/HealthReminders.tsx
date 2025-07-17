import React, { useState } from 'react';
import { Bell, Plus, Clock, Pill, Calendar, Trash2 } from 'lucide-react';

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  notes?: string;
}

export const HealthReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'Paracetamol 500mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      startDate: '2025-01-14',
      endDate: '2025-01-21',
      notes: 'Take after meals'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    times: ['08:00']
  });

  const addReminder = () => {
    if (newReminder.medicineName && newReminder.dosage) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        medicineName: newReminder.medicineName!,
        dosage: newReminder.dosage!,
        frequency: newReminder.frequency || 'Once daily',
        times: newReminder.times || ['08:00'],
        startDate: newReminder.startDate || new Date().toISOString().split('T')[0],
        endDate: newReminder.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: newReminder.notes
      };
      
      setReminders([...reminders, reminder]);
      setNewReminder({ times: ['08:00'] });
      setShowAddForm(false);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getNextDose = (times: string[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (timeInMinutes > currentTime) {
        return time;
      }
    }
    
    return times[0]; // Next day's first dose
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Medicine Reminders</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No reminders set</h3>
          <p className="text-gray-500">Add medicine reminders to never miss a dose</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{reminder.medicineName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{reminder.dosage} • {reminder.frequency}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Next: {getNextDose(reminder.times)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Until {new Date(reminder.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {reminder.notes && (
                    <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {reminder.notes}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {reminder.times.map((time, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add Medicine Reminder</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={newReminder.medicineName || ''}
                  onChange={(e) => setNewReminder({...newReminder, medicineName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newReminder.dosage || ''}
                  onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1 tablet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={newReminder.times?.[0] || '08:00'}
                  onChange={(e) => setNewReminder({...newReminder, times: [e.target.value]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newReminder.notes || ''}
                  onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Take after meals"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addReminder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};