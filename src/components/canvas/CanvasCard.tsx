import { LineChart } from 'lucide-react';
import type { Canvas } from '../../types';

interface CanvasCardProps {
  canvas: Canvas;
  onClick: () => void;
}

export default function CanvasCard({ canvas, onClick }: CanvasCardProps) {
  const primaryMetric = canvas.keyMetrics[0];

  const formatMetricValue = (metric: typeof primaryMetric) => {
    if (!metric) return '';
    if (metric.name === 'Balance') {
      return `$${metric.value?.toLocaleString()}`;
    }
    return `${metric.value}%`;
  };

  return (
    <div
      onClick={onClick}
      className="flex-none w-96 bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-lg">{canvas.name}</h3>
        <span className="text-xs text-cream/60">
          {new Date(canvas.createdAt).toLocaleDateString()}
        </span>
      </div>

      {primaryMetric && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cream/70">{primaryMetric.name}</span>
            <span className="text-lg font-medium">
              {formatMetricValue(primaryMetric)}
            </span>
          </div>

          <div className="h-40 bg-white/5 rounded-lg p-4 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <path
                d="M0,75 C100,50 200,100 300,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-dusty-pink opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <circle
                cx="0"
                cy="75"
                r="4"
                className="fill-dusty-pink"
              />
              <circle
                cx="100"
                cy="50"
                r="4"
                className="fill-dusty-pink"
              />
              <circle
                cx="200"
                cy="100"
                r="4"
                className="fill-dusty-pink"
              />
              <circle
                cx="300"
                cy="25"
                r="4"
                className="fill-dusty-pink"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}