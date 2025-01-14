import { Building2, Users, User } from 'lucide-react';

interface AccountTypeSelectionProps {
  onSelect: (type: 'individual' | 'joint' | 'trust') => void;
}

export default function AccountTypeSelection({ onSelect }: AccountTypeSelectionProps) {
  const accountTypes = [
    {
      id: 'individual',
      title: 'Individual Account',
      description: 'Open an account for yourself',
      icon: <User className="w-8 h-8" />,
    },
    {
      id: 'joint',
      title: 'Joint Account',
      description: 'Open an account with another person',
      icon: <Users className="w-8 h-8" />,
    },
    {
      id: 'trust',
      title: 'Trust Account',
      description: 'Open an account for a trust',
      icon: <Building2 className="w-8 h-8" />,
    },
  ];

  return (
    <div>
      <h3 className="text-2xl font-playfair mb-6">Select Account Type</h3>
      <div className="grid grid-cols-3 gap-6">
        {accountTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id as 'individual' | 'joint' | 'trust')}
            className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-left transition-colors border border-white/5 hover:border-white/20"
          >
            <div className="mb-4">{type.icon}</div>
            <h4 className="text-lg font-medium mb-2">{type.title}</h4>
            <p className="text-sm text-cream/60">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}