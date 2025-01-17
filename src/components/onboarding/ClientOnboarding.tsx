import { useState } from 'react';
import { Building2, Users, User, ArrowRight, FileCheck, ShieldCheck } from 'lucide-react';
import { logger } from '../../lib/logger';
import AccountTypeSelection from './steps/AccountTypeSelection';
import TrustDocuments from './steps/TrustDocuments';
import IndividualKYC from './steps/IndividualKYC';
import TermsAndConditions from './steps/TermsAndConditions';
import type { ClientOnboarding, Individual } from '../../types';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIndividualIndex, setCurrentIndividualIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<ClientOnboarding>>({
    accountType: undefined,
    individuals: [],
    trustDocuments: [],
    termsAccepted: false,
  });

  const getSteps = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'account-type',
        title: 'Account Type',
        description: 'Select the type of account you want to open',
        icon: <Building2 className="w-6 h-6 text-gold" />,
      }
    ];

    if (onboardingData.accountType === 'trust') {
      baseSteps.push({
        id: 'trust-docs',
        title: 'Trust Documents',
        description: 'Upload trust documentation',
        icon: <FileCheck className="w-6 h-6 text-light-blue" />,
      });
    }

    if (onboardingData.accountType === 'trust' || onboardingData.accountType === 'joint') {
      baseSteps.push({
        id: 'multi-kyc',
        title: 'Identity Verification',
        description: 'Complete verification for all parties',
        icon: <User className="w-6 h-6 text-dusty-pink" />,
      });
    } else if (onboardingData.accountType === 'individual') {
      baseSteps.push({
        id: 'individual-kyc',
        title: 'Identity Verification',
        description: 'Complete identity verification',
        icon: <User className="w-6 h-6 text-dusty-pink" />,
      });
    }

    baseSteps.push({
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Review and accept terms',
      icon: <ShieldCheck className="w-6 h-6 text-deep-olive" />,
    });

    return baseSteps;
  };

  const handleAccountTypeSelect = (type: 'individual' | 'joint' | 'trust') => {
    logger.info('Account type selected', { type });
    setOnboardingData(prev => ({ ...prev, accountType: type }));
    setCurrentStep(type === 'trust' ? 1 : 2);
  };

  const handleTrustDocumentsUpload = (documents: string[], trustees: Partial<Individual>[]) => {
    logger.info('Trust documents uploaded', { 
      documentCount: documents.length,
      trusteeCount: trustees.length 
    });

    setOnboardingData(prev => ({ 
      ...prev, 
      trustDocuments: documents,
      individuals: trustees.map(trustee => ({
        ...trustee,
        kycStatus: 'pending',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        }
      }))
    }));
    setCurrentStep(2); // Move to KYC step
  };

  const handleIndividualKYC = (individual: Individual) => {
    logger.info('Processing individual KYC', {
      individualId: individual.id,
      currentIndex: currentIndividualIndex,
      totalCount: onboardingData.individuals?.length
    });

    setOnboardingData(prev => {
      const updatedIndividuals = [...(prev.individuals || [])];
      updatedIndividuals[currentIndividualIndex] = {
        ...updatedIndividuals[currentIndividualIndex],
        ...individual,
        kycStatus: 'approved'
      };
      return { ...prev, individuals: updatedIndividuals };
    });

    // Check if there are more individuals who need to complete KYC
    const totalIndividuals = onboardingData.individuals?.length || 0;
    if (currentIndividualIndex + 1 < totalIndividuals) {
      setCurrentIndividualIndex(currentIndividualIndex + 1);
    } else {
      setCurrentStep(3); // Move to T&Cs when all individuals are verified
    }
  };

  const handleTermsAccept = (accepted: boolean) => {
    logger.info('Terms and conditions response', { accepted });
    setOnboardingData(prev => ({ ...prev, termsAccepted: accepted }));
    // Here you would typically submit the completed onboarding data
    try {
      // Submit onboarding data to backend
      logger.info('Onboarding completed successfully');
    } catch (error) {
      logger.error('Failed to complete onboarding', { error });
      alert('Failed to complete onboarding. Please try again.');
    }
  };

  const getCurrentIndividual = () => {
    return onboardingData.individuals?.[currentIndividualIndex];
  };

  const getCompletedCount = () => {
    return onboardingData.individuals?.filter(i => i.kycStatus === 'approved').length || 0;
  };

  const getTotalCount = () => {
    return onboardingData.individuals?.length || 0;
  };

  const steps = getSteps();

  return (
    <div className="min-h-screen bg-navy text-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-playfair mb-4">Account Setup</h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  index === currentStep ? 'text-cream' : 'text-cream/40'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    index === currentStep 
                      ? step.id === 'account-type'
                        ? 'bg-gold text-navy'
                        : step.id === 'trust-docs'
                        ? 'bg-light-blue text-navy'
                        : step.id === 'multi-kyc' || step.id === 'individual-kyc'
                        ? 'bg-dusty-pink text-navy'
                        : 'bg-deep-olive text-navy'
                      : 'bg-white/5'
                  }`}>
                    <div className={`${
                      !index === currentStep && 'text-cream/40'
                    }`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs mt-1 max-w-[120px] text-center">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 mx-4 text-cream/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy/50 rounded-xl p-8 backdrop-blur-sm border border-white/5">
          {currentStep === 0 && (
            <AccountTypeSelection onSelect={handleAccountTypeSelect} />
          )}
          {currentStep === 1 && onboardingData.accountType === 'trust' && (
            <TrustDocuments onComplete={handleTrustDocumentsUpload} />
          )}
          {currentStep === 2 && (
            <IndividualKYC 
              onComplete={handleIndividualKYC}
              isJointAccount={onboardingData.accountType === 'joint'}
              completedCount={getCompletedCount()}
              totalCount={getTotalCount()}
              currentIndividual={getCurrentIndividual()}
            />
          )}
          {currentStep === 3 && (
            <TermsAndConditions onAccept={handleTermsAccept} />
          )}
        </div>
      </div>
    </div>
  );
}