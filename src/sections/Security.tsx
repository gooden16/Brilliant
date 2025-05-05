import React from 'react';
import { colors } from '../colors';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import { Shield, Lock, Users } from 'lucide-react';
import BrushStroke from '../components/BrushStroke';

const Security: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Shield size={40} style={{ color: colors.deepOlive }} />,
      title: 'Multi-layered Security',
      description: 'Bank-grade encryption and multiple security layers protect sensitive financial data at all times.'
    },
    {
      icon: <Lock size={40} style={{ color: colors.burgundy }} />,
      title: 'Regulatory Compliance',
      description: 'Built to meet and exceed financial industry compliance standards and regulations.'
    },
    {
      icon: <Users size={40} style={{ color: colors.bronzedOrange }} />,
      title: 'Access Control',
      description: 'Granular permissions and role-based access ensure data is only available to authorized users.'
    }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" style={{ backgroundColor: colors.cream }} id="security">
      <BrushStroke 
        color={colors.burgundy} 
        className="top-0 right-0 w-2/3 transform rotate-45" 
        variant="splash"
        opacity={0.05}
      />
      <BrushStroke 
        color={colors.bronzedOrange} 
        className="bottom-0 left-0 w-3/4 transform -rotate-45" 
        variant="swirl"
        opacity={0.05}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle>Security Features</SectionTitle>
        <p className="font-montserrat text-center text-lg mb-16 max-w-3xl mx-auto" style={{ color: colors.mediumGrey }}>
          We take security seriously. Our platform incorporates multiple layers of protection 
          to ensure your clients' financial data remains secure.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="p-8 text-center">
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3" style={{ color: colors.darkCharcoal }}>
                {feature.title}
              </h3>
              <p className="font-montserrat" style={{ color: colors.mediumGrey }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;