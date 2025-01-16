import { useState } from 'react';
import { Mic, Video, ArrowLeft } from 'lucide-react';
import SessionRecorder from './SessionRecorder';

export default function StartMeeting() {
  const [hasStarted, setHasStarted] = useState(false);

  if (hasStarted) {
    return <SessionRecorder onBack={() => setHasStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-navy text-cream">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-12">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-playfair">Start Meeting</h2>
        </div>

        <div className="text-center mb-12">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80"
            alt="Meeting Illustration"
            className="w-64 h-64 object-cover rounded-full mx-auto mb-8"
          />
          <h3 className="text-xl font-playfair mb-2">Ready to begin?</h3>
          <p className="text-cream/60">Start recording to capture meeting insights</p>
        </div>

        <div className="space-y-4">
          <div className="bg-navy/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Audio Recording</div>
                <div className="text-sm text-cream/60">Capture meeting conversation</div>
              </div>
            </div>
          </div>

          <div className="bg-navy/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Video Optional</div>
                <div className="text-sm text-cream/60">Enable camera if needed</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setHasStarted(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gold text-navy font-medium py-4 px-12 rounded-xl hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      </div>
    </div>
  );
}