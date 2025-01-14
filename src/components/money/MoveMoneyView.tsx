import { useState } from 'react';
import { ArrowLeft, Plus, Search, Building2, Phone, MapPin, Building } from 'lucide-react';
import PayeeForm from './PayeeForm';
import PaymentForm from './PaymentForm';
import { useSupabase } from '../../contexts/SupabaseContext';
import type { Payee } from '../../types';

interface MoveMoneyViewProps {
  onBack: () => void;
}

export default function MoveMoneyView({ onBack }: MoveMoneyViewProps) {
  const [showPayeeForm, setShowPayeeForm] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { session } = useSupabase();

  const [recentPayees] = useState<Payee[]>([
    {
      id: '1',
      name: 'Property Management Inc',
      type: 'business',
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
        date: '2024-02-15'
      }
    },
    {
      id: '2',
      name: 'City Water & Power',
      type: 'business',
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
        date: '2024-02-10'
      }
    }
  ]);

  const handlePayeeSubmit = async (payee: Omit<Payee, 'id'>) => {
    // In a real app, we would save to Supabase here
    setShowPayeeForm(false);
  };

  const handlePayeeSelect = (payee: Payee) => {
    setSelectedPayee(payee);
  };

  const filteredPayees = recentPayees.filter(payee =>
    payee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showPayeeForm) {
    return <PayeeForm onBack={() => setShowPayeeForm(false)} onSubmit={handlePayeeSubmit} />;
  }

  if (selectedPayee) {
    return (
      <PaymentForm
        payee={selectedPayee}
        onBack={() => setSelectedPayee(null)}
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
            placeholder="Search payees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder-cream/40 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <button
          onClick={() => setShowPayeeForm(true)}
          className="px-4 py-3 bg-dusty-pink text-navy rounded-xl hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Payee
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Recent Payees</h3>
          <div className="space-y-4">
            {filteredPayees.map((payee) => (
              <button
                key={payee.id}
                onClick={() => handlePayeeSelect(payee)}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    {payee.type === 'business' ? (
                      <Building2 className="w-6 h-6 text-dusty-pink" />
                    ) : (
                      <Phone className="w-6 h-6 text-dusty-pink" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-cream transition-colors">
                      {payee.name}
                    </div>
                    <div className="text-sm text-cream/60">
                      Last paid: ${payee.lastPayment.amount.toLocaleString()} on{' '}
                      {new Date(payee.lastPayment.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {payee.paymentMethods.map((method) => (
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
          <h3 className="font-playfair text-lg mb-6">Scheduled Payments</h3>
          <div className="h-[400px] flex items-center justify-center text-cream/40">
            No scheduled payments
          </div>
        </div>
      </div>
    </div>
  );
}