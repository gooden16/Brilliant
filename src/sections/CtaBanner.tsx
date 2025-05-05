import React from 'react';
import { colors } from '../colors';
import Button from '../components/Button';
import BrushStroke from '../components/BrushStroke';

const CtaBanner: React.FC = () => {
  return (
    <section style={{ backgroundColor: colors.gold }} className="py-16 md:py-24 relative overflow-hidden">
      <BrushStroke 
        color={colors.deepNavy} 
        className="top-0 right-0 w-full transform rotate-180" 
        variant="wave"
        opacity={0.05}
      />
      <BrushStroke 
        color={colors.deepNavy} 
        className="bottom-0 left-0 w-full" 
        variant="splash"
        opacity={0.05}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 
          className="font-playfair text-3xl md:text-4xl font-bold mb-8 leading-tight"
          style={{ color: colors.deepNavy }}
        >
          Let's build the future of wealth management
        </h2>
        <Button 
          variant="primary" 
          className="text-white font-medium px-8 py-4 text-lg"
          style={{ backgroundColor: colors.deepNavy, color: colors.white }}
        >
          Book a Demo
        </Button>
      </div>
    </section>
  );
};

export default CtaBanner;