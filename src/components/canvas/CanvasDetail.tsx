import { ArrowLeft, TrendingUp, Building2, Wallet, Activity, CreditCard, PiggyBank, Banknote, Receipt, Users, ArrowRightLeft, CreditCard as CardIcon, Paintbrush } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Canvas } from '../../types';
import { useSupabase } from '../../contexts/SupabaseContext';
import MoveMoneyView from '../money/MoveMoneyView';
import CardView from '../cards/CardView';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../LoadingSpinner';

interface CanvasDetailProps {
  canvas: Canvas;
  onBack: () => void;
}

interface CanvasProduct {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'cd' | 'credit' | 'debit';
  balance: number;
  yield_rate: number;
  has_cards: boolean;
}

interface CanvasMetric {
  id: string;
  name: string;
  value: number;
  graph_type: string;
  is_primary: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'ach' | 'wire' | 'check' | 'card';
  is_enabled: boolean;
}

export default function CanvasDetail({ canvas, onBack }: CanvasDetailProps) {
  const { session } = useSupabase();
  const [currentView, setCurrentView] = useState<'overview' | 'money' | 'cards'>('overview');
  const [products, setProducts] = useState<CanvasProduct[]>([]);
  const [metrics, setMetrics] = useState<CanvasMetric[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalNOI] = useState(() => {
    const baseNOI = 35.2;
    return Array.from({ length: 12 }).map((_, i) => ({
      date: new Date(Date.now() - (11 - i) * 86400000 * 2),
      value: Math.min(baseNOI + (Math.random() * 2 - 1), 40) // Cap at 40%
    }));
  });
  const [transactions] = useState([
    {
      id: '1',
      date: new Date().toISOString(),
      description: 'Monthly Rent Payment',
      amount: -5000,
      type: 'expense'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      description: 'Property Income',
      amount: 8500,
      type: 'income'
    }
  ]);

  useEffect(() => {
    const fetchCanvasData = async () => {
      if (!session?.user) return;

      // Set default products for Property Co
      if (canvas.type === 'property') {
        setProducts([
          {
            id: crypto.randomUUID(),
            name: 'Operating Account',
            type: 'checking',
            balance: 245000,
            yield_rate: 0.1,
            has_cards: true
          },
          {
            id: crypto.randomUUID(),
            name: 'Reserve Account',
            type: 'savings',
            balance: 500000,
            yield_rate: 4.5,
            has_cards: false
          },
          {
            id: crypto.randomUUID(),
            name: 'Credit Card',
            type: 'credit',
            balance: -15000,
            yield_rate: 0,
            has_cards: true
          },
          {
            id: crypto.randomUUID(),
            name: 'Mortgage',
            type: 'cd',
            balance: -2500000,
            yield_rate: 5.25,
            has_cards: false
          }
        ]);
        
        setMetrics([
          {
            id: crypto.randomUUID(),
            name: 'Net Operating Income',
            value: 35.2,
            graph_type: 'line',
            is_primary: true
          },
          {
            id: crypto.randomUUID(),
            name: 'Target NOI',
            value: 30.0,
            graph_type: 'line',
            is_primary: false
          }
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const [productsRes, metricsRes, paymentsRes] = await Promise.all([
          supabase
            .from('canvas_products')
            .select('*')
            .eq('canvas_id', canvas.id),
          supabase
            .from('canvas_metrics')
            .select('*')
            .eq('canvas_id', canvas.id),
          supabase
            .from('payment_methods')
            .select('*')
            .eq('canvas_id', canvas.id)
        ]);

        if (productsRes.error) throw productsRes.error;
        if (metricsRes.error) throw metricsRes.error;
        if (paymentsRes.error) throw paymentsRes.error;

        setProducts(productsRes.data || []);
        setMetrics(metricsRes.data || []);
        setPaymentMethods(paymentsRes.data || []);
      } catch (error) {
        console.error('Error fetching canvas data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCanvasData();
  }, [canvas.id, session?.user]);

  if (currentView === 'money') {
    return <MoveMoneyView onBack={() => setCurrentView('overview')} />;
  }

  if (currentView === 'cards') {
    return <CardView onBack={() => setCurrentView('overview')} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
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
          <h2 className="text-2xl font-playfair">{canvas.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Products</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {product.type === 'checking' && <Building2 className="w-5 h-5 text-dusty-pink" />}
                    {product.type === 'savings' && <PiggyBank className="w-5 h-5 text-dusty-pink" />}
                    {product.type === 'cd' && <Banknote className="w-5 h-5 text-dusty-pink" />}
                    {product.type === 'credit' && <Receipt className="w-5 h-5 text-dusty-pink" />}
                    {product.type === 'debit' && <CardIcon className="w-5 h-5 text-dusty-pink" />}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-cream/60">{product.type}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream/60">Balance</span>
                  <span className={`font-medium ${product.balance < 0 ? 'text-red-500' : ''}`}>
                    ${Math.abs(product.balance).toLocaleString()}
                    {product.balance < 0 ? ' (Due)' : ''}
                  </span>
                </div>
                {product.yield_rate && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-cream/60">Yield</span>
                    <span className="font-medium">{product.yield_rate}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('money')}
              className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors text-left group"
            >
              <div className="p-3 bg-white/10 rounded-lg w-fit mb-3 group-hover:bg-white/20 transition-colors">
                <ArrowRightLeft className="w-5 h-5 text-dusty-pink" />
              </div>
              <div className="font-medium mb-1">Move Money</div>
              <div className="text-sm text-cream/60">Transfer funds</div>
            </button>

            <button
              onClick={() => setCurrentView('cards')}
              className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors text-left group"
            >
              <div className="p-3 bg-white/10 rounded-lg w-fit mb-3 group-hover:bg-white/20 transition-colors">
                <CardIcon className="w-5 h-5 text-dusty-pink" />
              </div>
              <div className="font-medium mb-1">Cards</div>
              <div className="text-sm text-cream/60">Manage cards</div>
            </button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Key Metrics</h3>
          {metrics.length > 0 && (
            <div className="relative">
              <div className="h-48 flex items-end">
                {historicalNOI.map((point, i) => {
                  const targetNoi = 30;
                  const maxValue = 40; // Y-axis maximum fixed at 40%
                  
                  return (
                    <div key={i} className="flex-1 relative">
                      {/* Target NOI watermark */}
                      <div 
                        className="absolute inset-0 bg-cream/5"
                        style={{ height: `${(targetNoi / maxValue) * 100}%` }}
                      />
                      {/* Actual NOI bar */}
                      <div 
                        className="relative bg-dusty-pink/40 hover:bg-dusty-pink/60 transition-colors rounded-t-lg cursor-pointer group"
                        style={{ height: `${(point.value / maxValue) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy/90 text-cream px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          NOI: {point.value.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-xs text-cream/40 mt-2 text-center">
                        {point.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
                {/* Y-axis labels */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none">
                  {[40, 30, 20, 10, 0].map((value) => (
                    <div key={value} className="text-xs text-cream/40 -translate-x-6">
                      {value}%
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-dusty-pink/40 rounded" />
                  <span className="text-cream/60">Current NOI: {historicalNOI[historicalNOI.length - 1].value.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cream/5 rounded" />
                  <span className="text-cream/60">Target NOI: 30.0%</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                } flex items-center justify-center`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className={`w-5 h-5 ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`} />
                  ) : (
                    <ArrowRightLeft className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-cream/60">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`font-medium ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                ${Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}