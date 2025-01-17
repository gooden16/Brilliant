import { useState, useEffect, useRef } from 'react';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Auth from './components/Auth';
import AppointmentScheduler from './components/AppointmentScheduler';
import CanvasView from './components/canvas/CanvasView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Session } from '@supabase/supabase-js';
import { Bell, Settings, LogOut, LayoutDashboard, Phone, ChevronDown, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from './lib/supabase';
import { logger } from './lib/logger';
import BackgroundPattern from './components/BackgroundPattern';
import ClientOnboarding from './components/onboarding/ClientOnboarding';

interface AppContentProps {
  session: Session | null;
  isLoading: boolean;
}

interface TopNavProps {
  setActiveTab: (tab: 'onboarding' | 'dashboard') => void;
  setShowScheduler: (show: boolean) => void;
}

function TopNav({ setActiveTab, setShowScheduler }: TopNavProps) {
  const [showRobynMenu, setShowRobynMenu] = useState(false);
  const robynMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    logger.info('User signing out');
    await supabase.auth.signOut();
  };

  const handleLogoClick = () => {
    logger.info('Logo clicked, navigating to dashboard');
    setActiveTab('dashboard');
    setShowScheduler(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (robynMenuRef.current && !robynMenuRef.current.contains(event.target as Node)) {
        setShowRobynMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-navy/50 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogoClick}
              className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="font-['Raleway'] text-xl">
                <span className="text-cream">Brilliant</span>
                <span className="text-dusty-pink">*</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogoClick}
              className="px-4 py-2 bg-white/5 text-cream rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative" ref={robynMenuRef}>
            <button 
              onClick={() => setShowRobynMenu(!showRobynMenu)}
              className="px-4 py-2 bg-white/5 text-cream rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img 
                  src="/src/assets/robyn.jpg" 
                  alt="Robyn" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Contact Robyn</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showRobynMenu && (
              <div className="fixed right-4 top-[4.5rem] mt-2 bg-[#00112E] border border-white/10 rounded-xl backdrop-blur-md overflow-hidden w-64 z-[9999] shadow-xl">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/src/assets/robyn.jpg" 
                      alt="Robyn" 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium">Robyn Williams</div>
                      <div className="text-sm text-cream/60">Financial Advisor</div>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-[#00112E]">
                  <button 
                    onClick={() => {
                      setShowRobynMenu(false);
                      setShowScheduler(true);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <Calendar className="w-4 h-4 text-dusty-pink" />
                    <span>Setup Appointment</span>
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors rounded-lg">
                    <MessageSquare className="w-4 h-4 text-dusty-pink" />
                    <span>Send a Message</span>
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors rounded-lg">
                    <Phone className="w-4 h-4 text-dusty-pink" />
                    <span>Call Robyn</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                <img 
                  src="/src/assets/jaclyn.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-navy/95 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent({ session, isLoading }: AppContentProps) {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'dashboard'>('dashboard');
  const [showScheduler, setShowScheduler] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#00112E]">
        <BackgroundPattern />
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundPattern />
      <TopNav setActiveTab={setActiveTab} setShowScheduler={setShowScheduler} />
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-[calc(100vh-80px)]">
        {activeTab === 'dashboard' && !showScheduler && <CanvasView setActiveTab={setActiveTab} />}
        {activeTab === 'onboarding' && <ClientOnboarding />}
        {showScheduler && <AppointmentScheduler onBack={() => setShowScheduler(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SupabaseProvider>
      {({ session, isLoading }) => (
        <AppContent session={session} isLoading={isLoading} />
      )}
    </SupabaseProvider>
  );
}