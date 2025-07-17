import React, { useState } from 'react';
import { Bell, Plus, Clock, Pill, Calendar, Trash2, Edit, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  notes?: string;
  isActive: boolean;
}

export const MedicineRemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'Paracetamol 500mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      startDate: '2025-01-14',
      endDate: '2025-01-21',
      notes: 'Take after meals',
      isActive: true
    },
    {
      id: '2',
      medicineName: 'Vitamin D3 1000IU',
      dosage: '1 capsule',
      frequency: 'Once daily',
      times: ['09:00'],
      startDate: '2025-01-10',
      endDate: '2025-02-10',
      notes: 'Take with breakfast',
      isActive: true
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [, setEditingReminder] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    times: ['08:00'],
    isActive: true
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
        notes: newReminder.notes,
        isActive: true
      };
      
      setReminders([...reminders, reminder]);
      setNewReminder({ times: ['08:00'], isActive: true });
      setShowAddForm(false);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
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

  const addTimeSlot = () => {
    setNewReminder({
      ...newReminder,
      times: [...(newReminder.times || []), '12:00']
    });
  };

  const updateTimeSlot = (index: number, time: string) => {
    const updatedTimes = [...(newReminder.times || [])];
    updatedTimes[index] = time;
    setNewReminder({
      ...newReminder,
      times: updatedTimes
    });
  };

  const removeTimeSlot = (index: number) => {
    const updatedTimes = (newReminder.times || []).filter((_, i) => i !== index);
    setNewReminder({
      ...newReminder,
      times: updatedTimes
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => {}} onAuthClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Medicine Reminders</h1>
                <p className="text-gray-600">Never miss a dose with smart reminders</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Reminder</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{reminders.length}</h3>
              <p className="text-gray-600">Total Reminders</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{reminders.filter(r => r.isActive).length}</h3>
              <p className="text-gray-600">Active Reminders</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {reminders.reduce((acc, r) => acc + r.times.length, 0)}
              </h3>
              <p className="text-gray-600">Daily Doses</p>
            </div>
          </div>

          {/* Reminders List */}
          {reminders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No reminders set</h3>
              <p className="text-gray-500 mb-6">Add medicine reminders to never miss a dose</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Add Your First Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className={`bg-white rounded-xl shadow-md p-6 ${!reminder.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{reminder.medicineName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          reminder.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {reminder.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{reminder.dosage} • {reminder.frequency}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                        <p className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">
                          💡 {reminder.notes}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {reminder.times.map((time, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`p-2 rounded-lg ${
                          reminder.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={reminder.isActive ? 'Pause reminder' : 'Activate reminder'}
                      >
                        {reminder.isActive ? <Clock className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => setEditingReminder(reminder.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit reminder"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete reminder"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">Add Medicine Reminder</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine Name *
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
                  Dosage *
                </label>
                <input
                  type="text"
                  value={newReminder.dosage || ''}
                  onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1 tablet, 2 capsules"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newReminder.frequency || 'Once daily'}
                  onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Times
                </label>
                <div className="space-y-2">
                  {(newReminder.times || []).map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {(newReminder.times || []).length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addTimeSlot}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add another time</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewReminder({...newReminder, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => setNewReminder({...newReminder, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  placeholder="e.g., Take after meals, With water"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewReminder({ times: ['08:00'], isActive: true });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addReminder}
                disabled={!newReminder.medicineName || !newReminder.dosage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};