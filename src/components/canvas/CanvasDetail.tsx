import { ArrowLeft, LineChart, BarChart, PieChart } from 'lucide-react';
import type { Canvas } from '../../types';

interface CanvasDetailProps {
  canvas: Canvas;
  onBack: () => void;
}

export default function CanvasDetail({ canvas, onBack }: CanvasDetailProps) {
  const getGraphComponent = (type: 'line' | 'bar' | 'pie') => {
    switch (type) {
      case 'line':
        return <LineChart className="w-full h-full text-dusty-pink" />;
      case 'bar':
        return <BarChart className="w-full h-full text-dusty-pink" />;
      case 'pie':
        return <PieChart className="w-full h-full text-dusty-pink" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-playfair">Canvas #{canvas.id}</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {canvas.keyMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-lg">{metric.name}</h3>
              {typeof metric.value === 'number' && (
                <span className="text-2xl font-medium">{metric.value}%</span>
              )}
            </div>

            <div className="h-48 bg-white/5 rounded-lg p-4">
              {getGraphComponent(metric.graphType)}
            </div>
          </div>
        ))}
      </div>

      {canvas.transcription && (
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-4">Session Notes</h3>
          <p className="text-cream/70 whitespace-pre-wrap">{canvas.transcription}</p>
        </div>
      )}
    </div>
  );
}