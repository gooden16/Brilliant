import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useSupabase } from '../contexts/SupabaseContext';
import AppointmentConfirmation from './AppointmentConfirmation';
import 'react-day-picker/dist/style.css';

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { session } = useSupabase();

  const availableTimes = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '4:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !session?.user) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            client_name: session.user.email?.split('@')[0] || 'Unknown',
            client_email: session.user.email,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            user_id: session.user.id
          }
        ]);

      if (error) throw error;
      
      setShowConfirmation(true);
    } catch (error) {
      alert('Error scheduling appointment');
      console.error(error);
    }
  };

  if (showConfirmation && selectedDate) {
    return (
      <AppointmentConfirmation
        date={selectedDate}
        time={selectedTime}
        onBack={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-playfair mb-8">Schedule Appointment</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-playfair text-xl mb-4">Select Date</h3>
          <DayPicker
            className="!font-montserrat bg-transparent flex justify-center"
            mode="single"
            fromDate={new Date()}
            selected={selectedDate}
            onSelect={setSelectedDate}
            classNames={{
              head_cell: "text-cream/60 font-normal text-sm",
              cell: "text-center p-0",
              day: "h-10 w-10 text-sm rounded-lg hover:bg-white/10 transition-colors",
              selected: "bg-cream !text-navy font-medium",
              today: "text-dusty-pink font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "p-1 hover:bg-white/10 rounded-lg transition-colors",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "relative flex justify-center items-center h-10",
              root: "flex justify-center w-full"
            }}
            modifiers={{
              disabled: { before: new Date() }
            }}
          />
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-playfair text-xl">Available Times</h3>
            <button type="button" className="text-sm text-cream/60 hover:text-cream">
              See All
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-xl text-left transition-colors ${
                  selectedTime === time
                    ? 'bg-cream text-navy font-medium'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-sm mb-1">{time.split(' ')[1]}</div>
                <div className="font-medium">{time}</div>
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className="w-full mt-8 bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Appointment
          </button>
        </div>
      </form>
    </div>
  );
}