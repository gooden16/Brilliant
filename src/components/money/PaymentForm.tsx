import { useState } from 'react';
import { ArrowLeft, Calendar, RefreshCcw, Building2, Phone, MapPin, Building, ChevronDown, Check } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { Payee } from '../../types';
import 'react-day-picker/dist/style.css';

interface PaymentFormProps {
  payee: Payee;
  onBack: () => void;
}

type RecurrenceType = 'one-time' | 'weekly' | 'monthly' | 'quarterly';
type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
type MonthDay = 1 | 5 | 10 | 15 | 20 | 25 | 'last';
type QuarterDay = { month: 1 | 2 | 3, day: 1 | 15 };

interface RecurrenceDetails {
  type: RecurrenceType;
  weekDay?: WeekDay;
  monthDay?: MonthDay;
  quarterDay?: QuarterDay;
}

export default function PaymentForm({ payee, onBack }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceDetails>({ type: 'one-time' });
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  const weekDays: { value: WeekDay; label: string }[] = [
    { value: 'sunday', label: 'Sunday' },
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' }
  ];

  const monthDays: { value: MonthDay; label: string }[] = [
    { value: 1, label: '1st' },
    { value: 5, label: '5th' },
    { value: 10, label: '10th' },
    { value: 15, label: '15th' },
    { value: 20, label: '20th' },
    { value: 25, label: '25th' },
    { value: 'last', label: 'Last day' }
  ];

  const quarterMonths = [
    { value: 1, label: 'First month' },
    { value: 2, label: 'Second month' },
    { value: 3, label: 'Third month' }
  ];

  const quarterDays = [
    { value: 1, label: '1st' },
    { value: 15, label: '15th' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
  };

  const getRecurrenceDescription = () => {
    switch (recurrence.type) {
      case 'weekly':
        return `Every ${recurrence.weekDay || 'week'}`;
      case 'monthly':
        return `Every ${recurrence.monthDay === 'last' ? 'last day' : `${recurrence.monthDay}${getOrdinalSuffix(Number(recurrence.monthDay))}`} of the month`;
      case 'quarterly':
        if (recurrence.quarterDay) {
          const month = quarterMonths.find(m => m.value === recurrence.quarterDay?.month)?.label;
          const day = recurrence.quarterDay.day === 1 ? '1st' : '15th';
          return `Every ${day} of the ${month?.toLowerCase()} of each quarter`;
        }
        return 'Quarterly';
      default:
        return 'One time payment';
    }
  };

  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const renderRecurrenceOptions = () => {
    switch (recurrence.type) {
      case 'weekly':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-cream/80 mb-2">
              Day of Week
            </label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setRecurrence(prev => ({ ...prev, weekDay: day.value }))}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    recurrence.weekDay === day.value
                      ? 'bg-dusty-pink text-navy'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {day.label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        );

      case 'monthly':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-cream/80 mb-2">
              Day of Month
            </label>
            <div className="grid grid-cols-4 gap-2">
              {monthDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setRecurrence(prev => ({ ...prev, monthDay: day.value }))}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    recurrence.monthDay === day.value
                      ? 'bg-dusty-pink text-navy'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'quarterly':
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Month of Quarter
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quarterMonths.map((month) => (
                  <button
                    key={month.value}
                    type="button"
                    onClick={() => setRecurrence(prev => ({
                      ...prev,
                      quarterDay: {
                        month: month.value as 1 | 2 | 3,
                        day: prev.quarterDay?.day || 1
                      }
                    }))}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      recurrence.quarterDay?.month === month.value
                        ? 'bg-dusty-pink text-navy'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Day of Month
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quarterDays.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => setRecurrence(prev => ({
                      ...prev,
                      quarterDay: {
                        month: prev.quarterDay?.month || 1,
                        day: day.value as 1 | 15
                      }
                    }))}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      recurrence.quarterDay?.day === day.value
                        ? 'bg-dusty-pink text-navy'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
        <h2 className="text-2xl font-playfair">Move Money</h2>
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
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRecurrenceOptions(!showRecurrenceOptions)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-cream flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-dusty-pink" />
                    <span>{getRecurrenceDescription()}</span>
                  </div>
                  <ChevronDown className="w-5 h-5" />
                </button>

                {showRecurrenceOptions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-navy/95 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden z-10">
                    {[
                      { value: 'one-time', label: 'One time payment' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'quarterly', label: 'Quarterly' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRecurrence({ type: option.value as RecurrenceType });
                          setShowRecurrenceOptions(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                      >
                        <span>{option.label}</span>
                        {recurrence.type === option.value && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {renderRecurrenceOptions()}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || !selectedDate}
          className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule Money Movement
        </button>
      </form>
    </div>
  );
}