import { useState } from 'react';
import { Phone, Mail, Calendar, Mic, LogOut, Bell, Settings, UserCircle, Users, ChevronDown, MessageSquare, LayoutDashboard } from 'lucide-react';
import AppointmentScheduler from './components/AppointmentScheduler';
import SessionRecorder from './components/SessionRecorder';
import CanvasView from './components/canvas/CanvasView';
import Auth from './components/Auth';
import ClientOnboarding from './components/onboarding/ClientOnboarding';
import { useSupabase } from './contexts/SupabaseContext';
import { supabase } from './lib/supabase';
import robynImage from './assets/robyn.jpg';
import jaclynImage from './assets/jaclyn.jpg';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cream"></div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'session' | 'onboarding' | 'canvas'>('schedule');
  const [showCommunicationOptions, setShowCommunicationOptions] = useState(false);
  const { session, isLoading } = useSupabase();

  const communicationOptions = [
    {
      id: 'phone',
      label: 'Schedule Call',
      icon: <Phone className="w-4 h-4" />,
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: 'message',
      label: 'Direct Message',
      icon: <MessageSquare className="w-4 h-4" />,
    }
  ];

  const handleCommunicationSelect = (optionId: string) => {
    setShowCommunicationOptions(false);
    // Handle communication option selection
    switch (optionId) {
      case 'phone':
        // Handle phone call scheduling
        break;
      case 'email':
        // Handle email composition
        break;
      case 'message':
        // Handle direct messaging
        break;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Auth />;
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-navy text-cream border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-12">
              <div className="flex-shrink-0">
                <div className="flex flex-col items-center -space-y-1">
                  <h1 className="text-3xl font-raleway font-bold tracking-wide">
                    Brilliant<span className="text-dusty-pink">*</span>
                  </h1>
                  <span className="text-xs tracking-widest">FINANCIAL</span>
                </div>
              </div>
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'schedule'
                      ? 'border-light-blue text-cream'
                      : 'border-transparent text-cream/70 hover:border-cream/30 hover:text-cream'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('session')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'session'
                      ? 'border-light-blue text-cream'
                      : 'border-transparent text-cream/70 hover:border-cream/30 hover:text-cream'
                  }`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Session
                </button>
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'onboarding'
                      ? 'border-light-blue text-cream'
                      : 'border-transparent text-cream/70 hover:border-cream/30 hover:text-cream'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Onboarding
                </button>
                <button
                  onClick={() => setActiveTab('canvas')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-montserrat font-medium transition-colors ${
                    activeTab === 'canvas'
                      ? 'border-light-blue text-cream'
                      : 'border-transparent text-cream/70 hover:border-cream/30 hover:text-cream'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Canvas
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowCommunicationOptions(!showCommunicationOptions)}
                    className="inline-flex items-center gap-3 px-4 py-2 group border border-cream/20 rounded-full hover:border-cream/40 transition-colors"
                  >
                    <div className="relative flex items-center">
                      <img
                        src={robynImage}
                        alt="Financial Advisor Robyn"
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-cream/40 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-navy rounded-full"></div>
                      <ChevronDown className="w-4 h-4 absolute bottom-0 right-0 text-cream/70 group-hover:text-cream transition-colors" />
                    </div>
                    <span className="text-sm text-cream/70 group-hover:text-cream transition-colors font-medium">Contact Robyn</span>
                  </button>
                  
                  {showCommunicationOptions && (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-navy/95 shadow-lg border border-white/10 backdrop-blur-sm py-2 z-50">
                      {communicationOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleCommunicationSelect(option.id)}
                          className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-white/10 transition-colors"
                        >
                          {option.icon}
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button className="inline-flex items-center gap-3 px-4 py-2 group border border-cream/20 rounded-full hover:border-cream/40 transition-colors">
                    <div className="relative">
                      <img
                        src={jaclynImage}
                        alt="Client Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-cream/40 transition-colors"
                      />
                    </div>
                  </button>
                </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-cream/70 hover:text-cream">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-cream/70 hover:text-cream">
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-cream/70 hover:text-cream"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'schedule' && <AppointmentScheduler />}
        {activeTab === 'session' && <SessionRecorder />}
        {activeTab === 'onboarding' && <ClientOnboarding />}
        {activeTab === 'canvas' && <CanvasView />}
      </main>
    </div>
  );
}