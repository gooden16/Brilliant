import { useState } from 'react';
import { ArrowLeft, Calendar, RefreshCcw, Building2, Phone, MapPin, Building } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { Payee } from '../../types';
import 'react-day-picker/dist/style.css';

interface PaymentFormProps {
  payee: Payee;
  onBack: () => void;
}

type RecurrenceType = 'one-time' | 'weekly' | 'monthly' | 'quarterly';

export default function PaymentForm({ payee, onBack }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('one-time');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
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
        <h2 className="text-2xl font-playfair">Make Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              {payee.type === 'business' ? (
                <Building2 className="w-6 h-6 text-dusty-pink" />
              ) : (
                <Phone className="w-6 h-6 text-dusty-pink" />
              )}
            </div>
            <div>
              <h3 className="font-playfair text-lg">{payee.name}</h3>
              <div className="text-sm text-cream/60 flex items-center gap-2">
                {payee.paymentMethods.map((method) => (
                  <div
                    key={method.type}
                    className="flex items-center gap-1"
                  >
                    {method.type === 'ach' && <Building className="w-4 h-4" />}
                    {method.type === 'check' && <MapPin className="w-4 h-4" />}
                    {method.type === 'zelle' && <Phone className="w-4 h-4" />}
                    <span>{method.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Payment Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <span>
                    {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                  </span>
                  <Calendar className="w-5 h-5 text-cream/40" />
                </button>

                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 bg-navy/95 border border-white/10 rounded-xl backdrop-blur-sm p-4 z-10">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                      fromDate={new Date()}
                      classNames={{
                        head_cell: "text-cream/60 font-normal text-sm",
                        cell: "text-center p-0",
                        day: "h-10 w-10 text-sm rounded-lg hover:bg-white/10 transition-colors",
                        selected: "bg-cream !text-navy font-medium",
                        today: "text-dusty-pink font-medium"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 'one-time', label: 'One Time' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRecurrence(option.value as RecurrenceType)}
                    className={`p-3 rounded-xl border transition-colors ${
                      recurrence === option.value
                        ? 'border-dusty-pink bg-white/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {recurrence !== 'one-time' && (
              <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">
                <RefreshCcw className="w-5 h-5 text-dusty-pink" />
                <div className="text-sm">
                  Payment will repeat {recurrence} until canceled
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || !selectedDate}
          className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule Payment
        </button>
      </form>
    </div>
  );
}