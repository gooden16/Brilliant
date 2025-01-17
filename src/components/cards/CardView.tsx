import { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, PauseCircle, PlayCircle, AlertTriangle, XCircle, Eye, EyeOff, Fingerprint, Smartphone, Building, ShoppingBag } from 'lucide-react';
import { logger } from '../../lib/logger';
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
  const [showCardNumbers, setShowCardNumbers] = useState<Set<string>>(new Set());
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const { session } = useSupabase();
  const [transactions] = useState([
    {
      id: '1',
      date: new Date().toISOString(),
      merchant: 'Amazon',
      amount: 299.99,
      cardId: '2',
      type: 'online'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      merchant: 'Whole Foods Market',
      amount: 156.78,
      cardId: '1',
      type: 'retail'
    },
    {
      id: '3',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      merchant: 'Netflix',
      amount: 19.99,
      cardId: '2',
      type: 'subscription'
    }
  ]);

  const [cards] = useState<Card[]>([
    {
      id: '1',
      type: 'physical',
      status: 'active',
      lastFour: '4567',
      expirationDate: '12/25',
      cardNumber: '4532 1234 5678 4567',
      cvv: '123'
    },
    {
      id: '2',
      type: 'virtual',
      status: 'active',
      lastFour: '8901',
      expirationDate: '03/26',
      cardNumber: '4532 8765 4321 8901',
      cvv: '456'
    }
  ]);

  const handleAuthenticate = async (cardId: string) => {
    setIsAuthenticating(cardId);
    logger.info('Attempting card authentication', { cardId });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAuthenticatedCards(prev => new Set([...prev, cardId]));
      logger.info('Card authentication successful', { cardId });
    } catch (error) {
      logger.error('Card authentication failed', { cardId, error });
    } finally {
      setIsAuthenticating(null);
    }
  };

  const handleToggleCardNumber = (cardId: string) => {
    setShowCardNumbers(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleToggleCardStatus = async (card: Card) => {
    const newStatus = card.status === 'active' ? 'paused' : 'active';
    logger.info('Toggling card status', { 
      cardId: card.id, 
      currentStatus: card.status,
      newStatus 
    });

    // Update card status in the UI immediately
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, status: newStatus } : c
    );

    try {
      // In a real app, we would update the status in Supabase here
      logger.info('Card status updated successfully', {
        cardId: card.id,
        status: newStatus
      });
    } catch (error) {
      logger.error('Failed to update card status', { 
        cardId: card.id, 
        error 
      });
      alert('Failed to update card status. Please try again.');
    }
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
    logger.warn('Suspicious activity reported', { cardId });
    // In a real app, we would handle suspicious activity reporting here
    alert('Our fraud department will contact you shortly.');
  };

  const handleCancelCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to cancel this card? This action cannot be undone.')) return;
    
    logger.info('Attempting to cancel card', { cardId });
    try {
    // In a real app, we would cancel the card in Supabase here
      logger.info('Card cancelled successfully', { cardId });
    } catch (error) {
      logger.error('Failed to cancel card', { cardId, error });
      alert('Failed to cancel card. Please try again.');
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    const parts = cardNumber.split(' ');
    return [
      parts[0],
      '••••',
      '••••',
      parts[3]
    ].join(' ');
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
    const showCardNumber = showCardNumbers.has(card.id);

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
          <div className="flex items-center justify-between">
            <div className="font-medium font-mono">
              {showCardNumber ? card.cardNumber : maskCardNumber(card.cardNumber)}
            </div>
            <button
              onClick={() => handleToggleCardNumber(card.id)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cream/70 hover:text-cream"
            >
              {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
        <div className="flex items-center gap-4 flex-1">
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
          className="px-4 py-2 bg-light-blue text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Virtual Card
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div
          className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
          onClick={() => setShowCreateVirtual(true)}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Smartphone className="w-5 h-5 text-dusty-pink" />
              </div>
              <div>
                <div className="font-medium">Create Virtual Card</div>
                <div className="text-sm text-cream/60">Add a new virtual card</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-xl flex flex-col items-center justify-center gap-4 group-hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Plus className="w-6 h-6 text-dusty-pink" />
            </div>
            <div className="text-sm text-cream/60 text-center">
              Create a new virtual card for online purchases
            </div>
          </div>
        </div>

        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  {card.type === 'virtual' ? (
                    <Smartphone className="w-5 h-5 text-dusty-pink" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-dusty-pink" />
                  )}
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
      
      {/* Transactions Section */}
      <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-lg">Recent Transactions</h3>
          <button className="text-sm text-cream/60 hover:text-cream transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const card = cards.find(c => c.id === transaction.cardId);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    {transaction.type === 'online' ? (
                      <Smartphone className="w-5 h-5 text-dusty-pink" />
                    ) : transaction.type === 'subscription' ? (
                      <Building className="w-5 h-5 text-dusty-pink" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-dusty-pink" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.merchant}</div>
                    <div className="text-sm text-cream/60 flex items-center gap-2">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-cream/30" />
                      <span className="flex items-center gap-1">
                        {card?.type === 'virtual' ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <CreditCard className="w-3 h-3" />
                        )}
                        <span>••••{card?.lastFour}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-medium">
                  ${transaction.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}