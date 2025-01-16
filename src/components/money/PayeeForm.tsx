import { useState } from 'react';
import { ArrowLeft, Building2, User, Building, Phone, MapPin, ChevronDown, Check } from 'lucide-react';
import type { PaymentMethod, Payee } from '../../types';

interface PayeeFormProps {
  onBack: () => void;
  onSubmit: (payee: Omit<Payee, 'id'>) => void;
}

type PaymentMethodType = 'ach' | 'zelle' | 'check';

export default function PayeeForm({ onBack, onSubmit }: PayeeFormProps) {
  const [payeeType, setPayeeType] = useState<'business' | 'individual'>('business');
  const [name, setName] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('ach');
  const [showMethodSelect, setShowMethodSelect] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: 'ach',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking'
  });

  const paymentMethods = [
    {
      type: 'ach' as const,
      label: 'Bank Account (ACH)',
      icon: <Building className="w-4 h-4" />
    },
    {
      type: 'zelle' as const,
      label: 'Zelle',
      icon: <Phone className="w-4 h-4" />
    },
    {
      type: 'check' as const,
      label: 'Physical Check',
      icon: <MapPin className="w-4 h-4" />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type: payeeType,
      paymentMethods: [paymentMethod as PaymentMethod],
      lastPayment: {
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      }
    });
  };

  const renderPaymentMethodFields = () => {
    switch (selectedMethod) {
      case 'ach':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={paymentMethod.routingNumber || ''}
                onChange={(e) => setPaymentMethod(prev => ({
                  ...prev,
                  routingNumber: e.target.value
                }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={paymentMethod.accountNumber || ''}
                onChange={(e) => setPaymentMethod(prev => ({
                  ...prev,
                  accountNumber: e.target.value
                }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Account Type
              </label>
              <select
                value={paymentMethod.accountType}
                onChange={(e) => setPaymentMethod(prev => ({
                  ...prev,
                  accountType: e.target.value as 'checking' | 'savings'
                }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        );
      case 'zelle':
        return (
          <div>
            <label className="block text-sm font-medium text-cream/80 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={paymentMethod.phoneNumber || ''}
              onChange={(e) => setPaymentMethod(prev => ({
                ...prev,
                phoneNumber: e.target.value
              }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              placeholder="(555) 555-5555"
            />
          </div>
        );
      case 'check':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={paymentMethod.address?.street || ''}
                onChange={(e) => setPaymentMethod(prev => ({
                  ...prev,
                  address: { ...(prev.address || {}), street: e.target.value }
                }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={paymentMethod.address?.city || ''}
                  onChange={(e) => setPaymentMethod(prev => ({
                    ...prev,
                    address: { ...(prev.address || {}), city: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={paymentMethod.address?.state || ''}
                  onChange={(e) => setPaymentMethod(prev => ({
                    ...prev,
                    address: { ...(prev.address || {}), state: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={paymentMethod.address?.zipCode || ''}
                  onChange={(e) => setPaymentMethod(prev => ({
                    ...prev,
                    address: { ...(prev.address || {}), zipCode: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        );
    }
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
        <h2 className="text-2xl font-playfair">Add New Payee</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Payee Information</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPayeeType('business')}
                className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                  payeeType === 'business'
                    ? 'border-dusty-pink bg-white/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Building2 className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Business</div>
              </button>
              
              <button
                type="button"
                onClick={() => setPayeeType('individual')}
                className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                  payeeType === 'individual'
                    ? 'border-dusty-pink bg-white/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Individual</div>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                {payeeType === 'business' ? 'Business Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                placeholder={payeeType === 'business' ? 'Enter business name' : 'Enter full name'}
              />
            </div>
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <h3 className="font-playfair text-lg mb-6">Payment Method</h3>
          
          <div className="space-y-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMethodSelect(!showMethodSelect)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {paymentMethods.find(m => m.type === selectedMethod)?.icon}
                  <span>{paymentMethods.find(m => m.type === selectedMethod)?.label}</span>
                </div>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showMethodSelect && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-navy/95 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden z-10">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.type}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.type);
                        setShowMethodSelect(false);
                        setPaymentMethod({ type: method.type });
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      {method.icon}
                      <span>{method.label}</span>
                      {selectedMethod === method.type && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {renderPaymentMethodFields()}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gold text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Add Payee
        </button>
      </form>
    </div>
  );
}