import React, { useState } from 'react';
import { Calendar, Mic } from 'lucide-react';
import AppointmentScheduler from './components/AppointmentScheduler';
import SessionRecorder from './components/SessionRecorder';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'session'>('schedule');

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-navy text-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-playfair font-bold">FinAdvisor</h1>
              </div>
              <div className="ml-8 flex space-x-8">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'schedule'
                      ? 'border-gold text-cream'
                      : 'border-transparent text-light-medium-grey hover:border-light-medium-grey hover:text-cream'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('session')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'session'
                      ? 'border-gold text-cream'
                      : 'border-transparent text-light-medium-grey hover:border-light-medium-grey hover:text-cream'
                  }`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'schedule' ? <AppointmentScheduler /> : <SessionRecorder />}
      </main>
    </div>
  );
}

export default App;