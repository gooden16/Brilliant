import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Plus, Mic, Bell, X, Calendar } from 'lucide-react';
import { logger } from '../../lib/logger';
import CanvasCard from './CanvasCard';
import AppointmentScheduler from '../AppointmentScheduler';
import CanvasDetail from './CanvasDetail';
import { supabase } from '../../lib/supabase';
import SessionRecorder from '../SessionRecorder';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { Canvas } from '../../types';

interface CanvasViewProps {
  setActiveTab: (tab: 'onboarding' | 'dashboard') => void;
}

export default function CanvasView({ setActiveTab }: CanvasViewProps) {
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [showSessionNotification, setShowSessionNotification] = useState(true);
  const [hasScheduledMeeting, setHasScheduledMeeting] = useState(false);
  const { session } = useSupabase();

  useEffect(() => {
    const checkAppointments = async () => {
      if (!session?.user) return;
      logger.info('Checking upcoming appointments', { userId: session.user.id });
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'scheduled')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);

      if (error) {
        logger.error('Failed to fetch appointments', { error });
        return;
      }

      logger.info('Appointments check complete', { 
        hasUpcoming: appointments && appointments.length > 0 
      });
      setHasScheduledMeeting(appointments && appointments.length > 0);
    };

    checkAppointments();
  }, [session]);

  const [canvases] = useState<Canvas[]>([
    {
      id: 'c81d4e2e-bcf2-11e6-869b-7df92533d2db',
      appointmentId: '2024-Q1',
      name: 'Property Co',
      type: 'property',
      keyMetrics: [
        { id: 'a81d4e2e-bcf2-11e6-869b-7df92533d2db', name: 'Net Operating Income', graphType: 'line', value: 35.2 },
        { id: 'b81d4e2e-bcf2-11e6-869b-7df92533d2db', name: 'Target NOI', graphType: 'line', value: 30.0 }
      ],
      features: [],
      users: [],
      transcription: '',
      status: 'approved',
      createdAt: new Date().toISOString()
    },
    {
      id: 'd81d4e2e-bcf2-11e6-869b-7df92533d2db',
      appointmentId: '2024-Q2',
      name: 'Rainy Day',
      type: 'investment',
      keyMetrics: [
        { id: 'e81d4e2e-bcf2-11e6-869b-7df92533d2db', name: 'Balance', graphType: 'line', value: 125000 },
        { id: 'f81d4e2e-bcf2-11e6-869b-7df92533d2db', name: 'Yield', graphType: 'line', value: 4.8 }
      ],
      features: [],
      users: [],
      transcription: '',
      status: 'approved',
      createdAt: new Date().toISOString()
    }
  ]);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('canvas-scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (selectedCanvas) {
    return (
      <CanvasDetail
        canvas={selectedCanvas}
        onBack={() => setSelectedCanvas(null)}
      />
    );
  }

  if (showScheduler) {
    return <AppointmentScheduler onBack={() => setShowScheduler(false)} />;
  }
  
  if (showSession) {
    return <SessionRecorder onBack={() => setShowSession(false)} />;
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-dusty-pink" />
        <h2 className="text-2xl font-playfair">Dashboard</h2>
      </div>
      
      {showSessionNotification && (
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Bell className="w-6 h-6 text-dusty-pink" />
              </div>
              <div>
                <h3 className="font-playfair text-lg mb-1">Notifications</h3>
                <p className="text-cream/60 text-sm">Stay updated on your latest activities</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  {hasScheduledMeeting ? (
                    <Mic className="w-5 h-5 text-dusty-pink" />
                  ) : (
                    <Calendar className="w-5 h-5 text-dusty-pink" />
                  )}
                </div>
                <div>
                  {hasScheduledMeeting ? (
                    <>
                      <h4 className="font-medium mb-1">Start your session</h4>
                      <p className="text-sm text-cream/60">Record your next advisory session</p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium mb-1">Schedule your first session</h4>
                      <p className="text-sm text-cream/60">Set up your next advisory meeting</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => hasScheduledMeeting ? setShowSession(true) : setShowScheduler(true)}
                  className="px-4 py-2 bg-dusty-pink text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  {hasScheduledMeeting ? 'Start Session' : 'Schedule Now'}
                </button>
                <button
                  onClick={() => setShowSessionNotification(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative group">
        <div
          id="canvas-scroll-container"
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        >
          {canvases.map((canvas) => (
            <CanvasCard
              key={canvas.id}
              canvas={canvas}
              onClick={() => {
                setSelectedCanvas(canvas);
                setShowScheduler(false);
                setShowSession(false);
              }}
            />
          ))}
          <button
            onClick={() => setShowScheduler(true)}
            className="flex-none w-96 bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
          >
            <div className="h-[232px] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                <Plus className="w-8 h-8 text-dusty-pink" />
              </div>
              <div className="text-center">
                <p className="font-playfair text-lg mb-1">Create a New Canvas</p>
                <p className="font-montserrat text-sm text-cream/60">Schedule a discussion here</p>
              </div>
            </div>
          </button>
        </div>
        
        <button
          onClick={() => scrollContainer('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-navy/80 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => scrollContainer('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-navy/80 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}