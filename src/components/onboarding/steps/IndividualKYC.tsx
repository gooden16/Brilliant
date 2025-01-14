import { useState } from 'react';
import { User, ChevronRight, Plus, X } from 'lucide-react';
import type { Individual } from '../../../types';

interface IndividualKYCProps {
  onComplete: (individual: Individual) => void;
  isJointAccount: boolean;
  completedCount: number;
  totalCount: number;
  currentIndividual?: Partial<Individual>;
}

interface JointHolder {
  firstName: string;
  lastName: string;
  email: string;
}

export default function IndividualKYC({ 
  onComplete, 
  isJointAccount,
  completedCount,
  totalCount,
  currentIndividual
}: IndividualKYCProps) {
  const [formData, setFormData] = useState<Partial<Individual>>({
    firstName: currentIndividual?.firstName || '',
    lastName: currentIndividual?.lastName || '',
    email: currentIndividual?.email || '',
    phone: currentIndividual?.phone || '',
    address: currentIndividual?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    ssn: '',
    dob: '',
  });
  const [currentSection, setCurrentSection] = useState<
    'holders' | 'personal' | 'contact' | 'identity'
  >(isJointAccount && completedCount === 0 ? 'holders' : 'personal');
  const [jointHolders, setJointHolders] = useState<JointHolder[]>([
    { firstName: '', lastName: '', email: '' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [name]: value,
      },
    }));
  };

  const handleAddJointHolder = () => {
    setJointHolders(prev => [...prev, { firstName: '', lastName: '', email: '' }]);
  };

  const handleRemoveJointHolder = (index: number) => {
    setJointHolders(prev => prev.filter((_, i) => i !== index));
  };

  const handleJointHolderChange = (index: number, field: keyof JointHolder, value: string) => {
    setJointHolders(prev => prev.map((holder, i) => 
      i === index ? { ...holder, [field]: value } : holder
    ));
  };

  const handleSubmit = async () => {
    if (currentSection === 'holders') {
      // Convert joint holders to individuals and move to personal info
      const individuals = jointHolders.map(holder => ({
        firstName: holder.firstName,
        lastName: holder.lastName,
        email: holder.email,
        kycStatus: 'pending' as const
      }));
      onComplete(individuals[0] as Individual);
      setCurrentSection('personal');
      return;
    }

    // For personal/contact/identity sections
    const individual: Individual = {
      id: crypto.randomUUID(),
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      ssn: formData.ssn || '',
      dob: formData.dob || '',
      kycStatus: 'approved',
      kycDetails: {
        verificationId: crypto.randomUUID(),
        status: 'approved',
        completedAt: new Date().toISOString(),
      },
    };

    onComplete(individual);
  };

  const renderJointHoldersSection = () => (
    <div className="space-y-6">
      {jointHolders.map((holder, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Joint Holder {index + 1}
            </h4>
            {jointHolders.length > 1 && (
              <button
                onClick={() => handleRemoveJointHolder(index)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={holder.firstName}
                onChange={(e) => handleJointHolderChange(index, 'firstName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={holder.lastName}
                onChange={(e) => handleJointHolderChange(index, 'lastName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-cream/80 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={holder.email}
              onChange={(e) => handleJointHolderChange(index, 'email', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleAddJointHolder}
        className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-cream/60 hover:text-cream hover:border-white/40 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Another Joint Holder
      </button>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-cream/80 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
        />
      </div>
      <button
        onClick={() => setCurrentSection('contact')}
        className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center"
      >
        Continue
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-cream/80 mb-2">
          Street Address
        </label>
        <input
          type="text"
          name="street"
          value={formData.address?.street || ''}
          onChange={handleAddressChange}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
        />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.address?.city || ''}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.address?.state || ''}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.address?.zipCode || ''}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
          />
        </div>
      </div>
      <button
        onClick={() => setCurrentSection('identity')}
        className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center"
      >
        Continue
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );

  const renderIdentityVerification = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cream/80 mb-2">
          Social Security Number
        </label>
        <input
          type="password"
          name="ssn"
          value={formData.ssn || ''}
          onChange={handleInputChange}
          placeholder="XXX-XX-XXXX"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors"
      >
        Complete Verification
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-playfair">
          {isJointAccount ? `Account Holder ${completedCount + 1}` : 'Identity Verification'}
        </h3>
        <div className="flex items-center text-sm text-cream/60">
          <User className="w-4 h-4 mr-2" />
          {completedCount}/{totalCount} Verified
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        {isJointAccount && completedCount === 0 && (
          <button
            onClick={() => setCurrentSection('holders')}
            className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
              currentSection === 'holders'
                ? 'border-dusty-pink text-cream'
                : 'border-white/10 text-cream/40'
            }`}
          >
            Joint Holders
          </button>
        )}
        <button
          onClick={() => setCurrentSection('personal')}
          className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
            currentSection === 'personal'
              ? 'border-dusty-pink text-cream'
              : 'border-white/10 text-cream/40'
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setCurrentSection('contact')}
          className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
            currentSection === 'contact'
              ? 'border-dusty-pink text-cream'
              : 'border-white/10 text-cream/40'
          }`}
        >
          Contact Details
        </button>
        <button
          onClick={() => setCurrentSection('identity')}
          className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
            currentSection === 'identity'
              ? 'border-dusty-pink text-cream'
              : 'border-white/10 text-cream/40'
          }`}
        >
          Identity
        </button>
      </div>

      {currentSection === 'holders' && renderJointHoldersSection()}
      {currentSection === 'personal' && renderPersonalInfo()}
      {currentSection === 'contact' && renderContactInfo()}
      {currentSection === 'identity' && renderIdentityVerification()}
    </div>
  );
}