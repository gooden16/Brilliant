import { useState } from 'react';
import { ArrowLeft, Plus, Search, Building2, Phone, MapPin, Building, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { logger } from '../../lib/logger';
import CounterpartyForm from './CounterpartyForm';
import PaymentForm from './PaymentForm';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { Counterparty } from '../../types';

interface MoveMoneyViewProps {
  onBack: () => void;
}

export default function MoveMoneyView({ onBack }: MoveMoneyViewProps) {
  const [showCounterpartyForm, setShowCounterpartyForm] = useState(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { session } = useSupabase();

  const [recentCounterparties] = useState<Counterparty[]>([
    {
      id: '1',
      name: 'Property Management Inc',
      type: 'business',
      isClientAccount: false,
      paymentMethods: [
        {
          type: 'ach',
          routingNumber: '123456789',
          accountNumber: '987654321',
          accountType: 'checking'
        }
      ],
      lastPayment: {
        amount: 5000,
        date: '2024-02-15',
        direction: 'out'
      }
    },
    {
      id: '2',
      name: 'City Water & Power',
      type: 'business',
      isClientAccount: false,
      paymentMethods: [
        {
          type: 'ach',
          routingNumber: '987654321',
          accountNumber: '123456789',
          accountType: 'checking'
        }
      ],
      lastPayment: {
        amount: 850,
        date: '2024-02-10',
        direction: 'out'
      }
    },
    {
      id: '3',
      name: 'Chase Checking Account',
      type: 'external_account',
      isClientAccount: true,
      paymentMethods: [
        {
          type: 'ach',
          routingNumber: '021000021',
          accountNumber: '123456789',
          accountType: 'checking'
        }
      ],
      lastPayment: {
        amount: 10000,
        date: '2024-02-01',
        direction: 'in'
      }
    }
  ]);

  const handleCounterpartySubmit = async (counterparty: Omit<Counterparty, 'id'>) => {
    if (!session?.user) {
      logger.error('Attempted to submit counterparty without authentication');
      return;
    }

    logger.info('Submitting new counterparty', { 
      counterpartyType: counterparty.type,
      isClientAccount: counterparty.isClientAccount,
      paymentMethods: counterparty.paymentMethods.map(m => m.type)
    });

    try {
      // In a real app, we would save to Supabase here
      logger.info('Counterparty created successfully');
    } catch (error) {
      logger.error('Failed to create counterparty', { error });
      alert('Failed to create counterparty. Please try again.');
      return;
    }

    setShowCounterpartyForm(false);
  };

  const handleCounterpartySelect = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty);
  };

  const filteredCounterparties = recentCounterparties.filter(counterparty =>
    counterparty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showCounterpartyForm) {
    return <CounterpartyForm onBack={() => setShowCounterpartyForm(false)} onSubmit={handleCounterpartySubmit} />;
  }

  if (selectedCounterparty) {
    return (
      <PaymentForm
        counterparty={selectedCounterparty}
        onBack={() => setSelectedCounterparty(null)}
      />
    );
  }

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
          <h2 className="text-2xl font-playfair">Move Money</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" />
          <input
            type="text"
            placeholder="Search counterparties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder-cream/40 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <button
          onClick={() => setShowCounterpartyForm(true)}
          className="px-4 py-3 bg-dusty-pink text-navy rounded-xl hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Counterparty
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Recent Counterparties</h3>
          <div className="space-y-4">
            {filteredCounterparties.map((counterparty) => (
              <button
                key={counterparty.id}
                onClick={() => handleCounterpartySelect(counterparty)}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-centsenter justify-center">
                    <div className="flex items-center justify-center">
                      {counterparty.type === 'business' ? (
                        <Building2 className="w-6 h-6 text-dusty-pink" />
                      ) : counterparty.type === 'individual' ? (
                        <Phone className="w-6 h-6 text-dusty-pink" />
                      ) : (
                        <Wallet className="w-6 h-6 text-dusty-pink" />
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-cream transition-colors">
                      {counterparty.name}
                      {counterparty.isClientAccount && (
                        <span className="ml-2 text-xs bg-light-blue/20 text-light-blue px-2 py-1 rounded-full">
                          External Account
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-cream/60">
                      Last {counterparty.lastPayment.direction === 'out' ? 'sent' : 'received'}: ${counterparty.lastPayment.amount.toLocaleString()} on{' '}
                      {new Date(counterparty.lastPayment.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {counterparty.paymentMethods.map((method) => (
                    <div
                      key={method.type}
                      className="p-2 bg-white/5 rounded-lg"
                      title={method.type.toUpperCase()}
                    >
                      {method.type === 'ach' && <Building className="w-4 h-4" />}
                      {method.type === 'check' && <MapPin className="w-4 h-4" />}
                      {method.type === 'zelle' && <Phone className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-lg">Scheduled Money Movements</h3>
            <button
              onClick={() => setShowCounterpartyForm(true)}
              className="px-4 py-2 bg-dusty-pink text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Counterparty
            </button>
          </div>
          <div className="h-[400px] flex items-center justify-center text-cream/40">
            No scheduled money movements
          </div>
        </div>
      </div>
    </div>
  );
}