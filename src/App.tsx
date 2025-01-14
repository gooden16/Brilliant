import { useState } from 'react';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Auth from './components/Auth';
import CanvasView from './components/canvas/CanvasView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'dashboard'>('dashboard');

  return (
    <SupabaseProvider>
      <div className="min-h-screen bg-navy text-cream p-8">
        <Auth />
      </div>
    </SupabaseProvider>
  )
}