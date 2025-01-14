import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';

interface CreateVirtualCardProps {
  onBack: () => void;
}

export default function CreateVirtualCard({ onBack }: CreateVirtualCardProps) {
  const [purpose, setPurpose] = useState('');
  const [limit, setLimit] = useState('');
  const { session } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would create the virtual card in Supabase here
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-playfair">Create Virtual Card</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                placeholder="e.g., Online Subscriptions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Monthly Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40">$</span>
                <input
                  type="text"
                  value={limit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setLimit(value);
                  }}
                  className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!purpose || !limit}
          className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Virtual Card
        </button>
      </form>
    </div>
  );
}