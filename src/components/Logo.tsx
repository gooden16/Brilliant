import React from 'react';
import { colors } from '../colors';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '' }) => {
  const textColor = variant === 'light' ? colors.white : colors.darkCharcoal;
  
  return (
    <div className={`font-raleway ${className}`}>
      <div className="flex items-baseline">
        <span className="text-2xl font-semibold tracking-tight" style={{ color: textColor }}>
          Brilliant
        </span>
        <span className="text-xl" style={{ color: colors.dustyPink }}>*</span>
      </div>
      <span 
        className="text-sm tracking-wide block text-center font-small-caps" 
        style={{ 
          color: textColor,
          fontVariant: 'small-caps',
          letterSpacing: '0.05em'
        }}
      >
        financial
      </span>
    </div>
  );
};

export default Logo;