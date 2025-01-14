import { useState, useEffect } from 'react';
import { Check, Bell } from 'lucide-react';

interface TermsAndConditionsProps {
  onAccept: (accepted: boolean) => void;
}

function Notification({ message }: { message: string }) {
  return (
    <div className="fixed top-4 right-4 bg-dusty-pink text-navy p-4 rounded-lg shadow-lg flex items-center gap-2 animate-paintIn">
      <Bell className="w-5 h-5" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

export default function TermsAndConditions({ onAccept }: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleAccept = () => {
    setAccepted(true);
    onAccept(true);
    setShowNotification(true);
  };

  return (
    <div>
      <h3 className="text-2xl font-playfair mb-6">Terms & Conditions</h3>
      
      <div className="bg-white/5 rounded-xl p-6 mb-8 h-96 overflow-y-auto">
        <div className="prose prose-invert">
          <h4>Investment Advisory Agreement</h4>
          <p>This Investment Advisory Agreement (the "Agreement") is entered into between you and Brilliant Financial ("Advisor").</p>
          
          <h5>1. Services</h5>
          <p>Advisor will provide investment advisory services including:</p>
          <ul>
            <li>Portfolio management</li>
            <li>Investment recommendations</li>
            <li>Regular portfolio monitoring</li>
            <li>Periodic rebalancing</li>
          </ul>

          <h5>2. Fiduciary Duty</h5>
          <p>Advisor acknowledges its fiduciary duty to clients and agrees to act in the client's best interest at all times.</p>

          <h5>3. Fees</h5>
          <p>Advisory fees will be calculated and charged according to the fee schedule provided in the Form ADV Part 2A.</p>

          <h5>4. Risk Acknowledgment</h5>
          <p>Client acknowledges that all investments carry risk, including the risk of losing money. Past performance does not guarantee future results.</p>

          <h5>5. Privacy Policy</h5>
          <p>Advisor will protect client's private information according to its privacy policy.</p>

          <h5>6. Termination</h5>
          <p>Either party may terminate this agreement with written notice.</p>
        </div>
      </div>

      <div className="flex items-center mb-8">
        <button
          onClick={() => setAccepted(!accepted)}
          className={`w-6 h-6 rounded border transition-colors mr-3 flex items-center justify-center ${
            accepted 
              ? 'bg-dusty-pink border-dusty-pink text-navy' 
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          {accepted && <Check className="w-4 h-4" />}
        </button>
        <label className="text-sm text-cream/80">
          I have read and agree to the terms and conditions
        </label>
      </div>

      <button
        onClick={handleAccept}
        disabled={!accepted}
        className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Account Setup
      </button>

      {showNotification && (
        <Notification message="Terms and conditions accepted successfully" />
      )}
    </div>
  );
}