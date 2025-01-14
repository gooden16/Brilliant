import { Calendar as CalendarIcon, Video, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import StartMeeting from './StartMeeting';

interface AppointmentConfirmationProps {
  date: Date;
  time: string;
  onBack: () => void;
}

export default function AppointmentConfirmation({ date, time, onBack }: AppointmentConfirmationProps) {
  const [startMeeting, setStartMeeting] = useState(false);

  if (startMeeting) {
    return <StartMeeting />;
  }

  return (
    <div className="min-h-screen bg-navy text-cream">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Rest of the component remains the same until the Zoom button */}
        
        <div className="text-center">
          <div className="text-sm text-cream/60 mb-3">Join remotely</div>
          <button 
            onClick={() => setStartMeeting(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#0E72ED] text-white py-3 px-6 rounded-xl hover:bg-opacity-90 transition-colors w-full"
          >
            <Video className="w-5 h-5" />
            Start Meeting
          </button>
        </div>

        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
}