import { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, PauseCircle, PlayCircle, AlertTriangle, XCircle, Eye, EyeOff, Fingerprint } from 'lucide-react';
import type { Card } from '../../types';
import { useSupabase } from '../../contexts/SupabaseContext';
import CreateVirtualCard from './CreateVirtualCard';

interface CardViewProps {
  onBack: () => void;
}

export default function CardView({ onBack }: CardViewProps) {
  const [showCreateVirtual, setShowCreateVirtual] = useState(false);
  const [authenticatedCards, setAuthenticatedCards] = useState<Set<string>>(new Set());
  const [showSensitiveData, setShowSensitiveData] = useState<Set<string>>(new Set());
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const { session } = useSupabase();

  const [cards] = useState<Card[]>([
    {
      id: '1',
      type: 'physical',
      status: 'active',
      lastFour: '4567',
      expirationDate: '12/25',
      cardNumber: '4532 •••• •••• 4567',
      cvv: '123'
    },
    {
      id: '2',
      type: 'virtual',
      status: 'active',
      lastFour: '8901',
      expirationDate: '03/26',
      cardNumber: '4532 •••• •••• 8901',
      cvv: '456'
    }
  ]);

  const handleAuthenticate = async (cardId: string) => {
    setIsAuthenticating(cardId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAuthenticatedCards(prev => new Set([...prev, cardId]));
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsAuthenticating(null);
    }
  };

  const handleToggleCardStatus = async (card: Card) => {
    const newStatus = card.status === 'active' ? 'paused' : 'active';
    // Update card status in the UI immediately
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, status: newStatus } : c
    );
    // In a real app, we would update the status in Supabase here
  };

  const handleToggleSensitiveData = (cardId: string) => {
    setShowSensitiveData(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleReportSuspicious = async (cardId: string) => {
    // In a real app, we would handle suspicious activity reporting here
    alert('Our fraud department will contact you shortly.');
  };

  const handleCancelCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to cancel this card? This action cannot be undone.')) return;
    // In a real app, we would cancel the card in Supabase here
  };

  if (showCreateVirtual) {
    return <CreateVirtualCard onBack={() => setShowCreateVirtual(false)} />;
  }

  const CardActions = ({ card }: { card: Card }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleToggleCardStatus(card)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cream/70 hover:text-cream"
        title={card.status === 'active' ? 'Pause Card' : 'Unpause Card'}
      >
        {card.status === 'active' ? (
          <PauseCircle className="w-5 h-5" />
        ) : (
          <PlayCircle className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={() => handleReportSuspicious(card.id)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cream/70 hover:text-cream"
        title="Report Suspicious Activity"
      >
        <AlertTriangle className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleCancelCard(card.id)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cream/70 hover:text-cream"
        title="Cancel Card"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );

  const CardDetails = ({ card }: { card: Card }) => {
    const isAuthenticated = authenticatedCards.has(card.id);
    const showSensitive = showSensitiveData.has(card.id);

    if (!isAuthenticated) {
      return (
        <button
          onClick={() => handleAuthenticate(card.id)}
          disabled={isAuthenticating === card.id}
          className="relative w-full py-6 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group overflow-hidden"
        >
          <div className="absolute inset-0 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-2 z-10">
            <Fingerprint className="w-8 h-8 text-dusty-pink" />
            <span className="font-medium">
              {isAuthenticating === card.id ? 'Authenticating...' : 'Authenticate to View'}
            </span>
          </div>
          <div className="opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-cream/60 mb-1">Card Number</div>
                <div className="font-medium font-mono blur-sm">{card.cardNumber}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-cream/60 mb-1">Expiration</div>
                  <div className="font-medium blur-sm">{card.expirationDate}</div>
                </div>
                <div>
                  <div className="text-sm text-cream/60 mb-1">CVV</div>
                  <div className="font-medium font-mono blur-sm">•••</div>
                </div>
              </div>
            </div>
          </div>
        </button>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <div className="text-sm text-cream/60 mb-1">Card Number</div>
          <div className="font-medium font-mono">{card.cardNumber}</div>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-cream/60 mb-1">Expiration</div>
            <div className="font-medium">{card.expirationDate}</div>
          </div>
          <div>
            <div className="text-sm text-cream/60 mb-1">CVV</div>
            <button
              onClick={() => handleToggleSensitiveData(card.id)}
              className="flex items-center gap-2 hover:text-cream transition-colors"
            >
              {showSensitive ? (
                <>
                  <span className="font-medium font-mono">{card.cvv}</span>
                  <EyeOff className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="font-medium font-mono">•••</span>
                  <Eye className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-playfair">Cards</h2>
        </div>

        <button
          onClick={() => setShowCreateVirtual(true)}
          className="px-4 py-2 bg-dusty-pink text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Virtual Card
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-dusty-pink" />
                </div>
                <div>
                  <div className="font-medium">
                    {card.type === 'physical' ? 'Physical Card' : 'Virtual Card'}
                  </div>
                  <div className="text-sm text-cream/60">
                    {card.status === 'active' ? 'Active' : 'Paused'}
                  </div>
                </div>
              </div>
              <CardActions card={card} />
            </div>

            <CardDetails card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}