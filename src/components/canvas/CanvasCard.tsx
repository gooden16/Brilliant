import { LineChart, BarChart } from 'lucide-react';
import type { Canvas } from '../../types';

interface CanvasCardProps {
  canvas: Canvas;
  onClick: () => void;
}

export default function CanvasCard({ canvas, onClick }: CanvasCardProps) {
  const primaryMetric = canvas.keyMetrics[0];

  return (
    <div
      onClick={onClick}
      className="flex-none w-80 bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-lg">Canvas #{canvas.id}</h3>
        <span className="text-xs text-cream/60">
          {new Date(canvas.createdAt).toLocaleDateString()}
        </span>
      </div>

      {primaryMetric && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cream/70">{primaryMetric.name}</span>
            <span className="text-lg font-medium">
              {typeof primaryMetric.value === 'number' && `${primaryMetric.value}%`}
            </span>
          </div>

          <div className="h-32 bg-white/5 rounded-lg p-4 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            {primaryMetric.graphType === 'line' ? (
              <LineChart className="w-full h-full text-dusty-pink opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <BarChart className="w-full h-full text-dusty-pink opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}