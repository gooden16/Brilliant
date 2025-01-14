import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CanvasCard from './CanvasCard';
import CanvasDetail from './CanvasDetail';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { Canvas } from '../../types';

export default function CanvasView() {
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
  const { session } = useSupabase();
  const [canvases, setCanvases] = useState<Canvas[]>([
    {
      id: '1',
      appointmentId: '1',
      keyMetrics: [
        { id: '1', name: 'Portfolio Growth', graphType: 'line', value: 12.5 },
        { id: '2', name: 'Risk Score', graphType: 'bar', value: 7.2 }
      ],
      features: [],
      users: [],
      transcription: '',
      status: 'approved',
      createdAt: new Date().toISOString()
    },
    // Add more mock data as needed
  ]);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('canvas-scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (selectedCanvas) {
    return <CanvasDetail canvas={selectedCanvas} onBack={() => setSelectedCanvas(null)} />;
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-playfair mb-8">Financial Canvases</h2>
      
      <div className="relative group">
        <div
          id="canvas-scroll-container"
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {canvases.map((canvas) => (
            <CanvasCard
              key={canvas.id}
              canvas={canvas}
              onClick={() => setSelectedCanvas(canvas)}
            />
          ))}
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