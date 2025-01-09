import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar, Clock, User, Mail } from 'lucide-react';

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement appointment creation with Supabase
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-playfair font-bold mb-8 text-navy">Schedule an Appointment</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-montserrat font-medium text-navy mb-2">
                  <User className="inline-block w-4 h-4 mr-2 text-gold" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-light-medium-grey rounded-md focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-montserrat font-medium text-navy mb-2">
                  <Mail className="inline-block w-4 h-4 mr-2 text-gold" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-light-medium-grey rounded-md focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-navy mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2 text-gold" />
                Select Date
              </label>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-4 bg-white font-montserrat"
                classNames={{
                  day_selected: "bg-gold text-white",
                  day_today: "text-burgundy font-bold",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-montserrat font-medium text-navy mb-2">
              <Clock className="inline-block w-4 h-4 mr-2 text-gold" />
              Available Times
            </label>
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center rounded-md font-montserrat transition-colors ${
                    selectedTime === time
                      ? 'bg-gold text-white'
                      : 'bg-light-grey text-navy hover:bg-light-medium-grey'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-navy text-cream font-montserrat font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
}