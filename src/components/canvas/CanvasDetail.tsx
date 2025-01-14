import { ArrowLeft, TrendingUp, Building2, Wallet, Activity, CreditCard, PiggyBank, Banknote, Receipt, Users, ArrowRightLeft, CreditCard as CardIcon, Paintbrush, CreditCard as CardManageIcon } from 'lucide-react';
import { useState } from 'react';
import type { Canvas } from '../../types';
import MoveMoneyView from '../money/MoveMoneyView';
import CardView from '../cards/CardView';

interface CanvasDetailProps {
  canvas: Canvas;
  onBack: () => void;
}

export default function CanvasDetail({ canvas, onBack }: CanvasDetailProps) {
  const [showMoveMoneyView, setShowMoveMoneyView] = useState(false);
  const [showCardView, setShowCardView] = useState(false);

  if (showMoveMoneyView) {
    return <MoveMoneyView onBack={() => setShowMoveMoneyView(false)} />;
  }

  if (showCardView) {
    return <CardView onBack={() => setShowCardView(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-playfair">Property Co Canvas</h2>
            <p className="text-sm text-cream/60">Last updated {new Date(canvas.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMoveMoneyView(true)}
            className="px-4 py-2 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Move Money
          </button>
          
          <button
            className="px-4 py-2 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2"
            onClick={() => setShowCardView(true)}
          >
            <CardIcon className="w-4 h-4" />
            Cards
          </button>
          
          <button
            className="px-4 py-2 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center gap-2"
          >
            <Paintbrush className="w-4 h-4" />
            Edit
          </button>
          
          <button
            className="px-4 py-2 bg-dusty-pink text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-5 h-5 text-dusty-pink" />
            </div>
            <div>
              <div className="text-sm text-cream/60">Net Operating Income</div>
              <div className="text-xl font-medium">$85,000</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+12.5%</span>
            <span className="text-cream/60">vs last month</span>
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Activity className="w-5 h-5 text-dusty-pink" />
            </div>
            <div>
              <div className="text-sm text-cream/60">Portfolio Growth</div>
              <div className="text-xl font-medium">14.2%</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+2.3%</span>
            <span className="text-cream/60">vs last month</span>
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Building2 className="w-5 h-5 text-dusty-pink" />
            </div>
            <div>
              <div className="text-sm text-cream/60">Properties</div>
              <div className="text-xl font-medium">12</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+1</span>
            <span className="text-cream/60">new this month</span>
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Users className="w-5 h-5 text-dusty-pink" />
            </div>
            <div>
              <div className="text-sm text-cream/60">Total Tenants</div>
              <div className="text-xl font-medium">48</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">95%</span>
            <span className="text-cream/60">occupancy rate</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-lg">Financial Performance</h3>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Monthly
              </button>
              <button className="px-3 py-1.5 text-sm bg-dusty-pink text-navy rounded-lg">
                Quarterly
              </button>
              <button className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Yearly
              </button>
          </div>
            </div>

          <div className="h-80 bg-white/5 rounded-lg p-6">
            <svg className="w-full h-full" viewBox="0 0 800 300">
              <path
                d="M0,150 C100,100 200,200 300,50 C400,150 500,100 600,200 C700,150 800,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-dusty-pink"
              />
              {/* Data points */}
              <circle cx="0" cy="150" r="6" className="fill-dusty-pink" />
              <circle cx="200" cy="200" r="6" className="fill-dusty-pink" />
              <circle cx="400" cy="150" r="6" className="fill-dusty-pink" />
              <circle cx="600" cy="200" r="6" className="fill-dusty-pink" />
              <circle cx="800" cy="50" r="6" className="fill-dusty-pink" />
              
              {/* Grid lines */}
              <line x1="0" y1="0" x2="0" y2="300" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="400" y1="0" x2="400" y2="300" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="600" y1="0" x2="600" y2="300" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="800" y1="0" x2="800" y2="300" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              
              <line x1="0" y1="75" x2="800" y2="75" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
              <line x1="0" y1="225" x2="800" y2="225" stroke="currentColor" strokeWidth="1" className="text-cream/10" />
            </svg>
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-4 gap-6 mt-6">
          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet className="w-5 h-5 text-dusty-pink" />
              </div>
              <div>
                <div className="text-sm text-cream/60">Operating Account</div>
                <div className="text-xl font-medium">$245,000</div>
              </div>
            </div>
          </div>

          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <PiggyBank className="w-5 h-5 text-dusty-pink" />
              </div>
              <div>
                <div className="text-sm text-cream/60">Reserve Account</div>
                <div className="text-xl font-medium">$180,000</div>
              </div>
            </div>
          </div>

          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-dusty-pink" />
              </div>
              <div>
                <div className="text-sm text-cream/60">Credit Line</div>
                <div className="text-xl font-medium">$50,000</div>
                <div className="text-xs text-cream/40">of $200,000</div>
              </div>
            </div>
          </div>

          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Banknote className="w-5 h-5 text-dusty-pink" />
              </div>
              <div>
                <div className="text-sm text-cream/60">Mortgage Balance</div>
                <div className="text-xl font-medium">$3.2M</div>
                <div className="text-xs text-cream/40">4.5% fixed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-lg">Recent Transactions</h3>
            <button className="text-sm text-cream/60 hover:text-cream transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Receipt className="w-4 h-4 text-dusty-pink" />
                </div>
                <div>
                  <div className="font-medium">Rent Payment - 123 Main St</div>
                  <div className="text-sm text-cream/60">Operating Account</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-400">+$8,500</div>
                <div className="text-sm text-cream/60">Mar 1, 2024</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Receipt className="w-4 h-4 text-dusty-pink" />
                </div>
                <div>
                  <div className="font-medium">Property Tax Payment</div>
                  <div className="text-sm text-cream/60">Reserve Account</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-burgundy">-$12,000</div>
                <div className="text-sm text-cream/60">Feb 28, 2024</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Receipt className="w-4 h-4 text-dusty-pink" />
                </div>
                <div>
                  <div className="font-medium">Mortgage Payment</div>
                  <div className="text-sm text-cream/60">Operating Account</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-burgundy">-$15,500</div>
                <div className="text-sm text-cream/60">Feb 25, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {canvas.transcription && (
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 mt-6">
          <h3 className="font-playfair text-lg mb-4">Session Notes</h3>
          <p className="text-cream/70 whitespace-pre-wrap">{canvas.transcription}</p>
        </div>
      )}
    </div>
  );
}