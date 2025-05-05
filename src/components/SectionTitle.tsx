import React from 'react';
import { colors } from '../colors';

interface SectionTitleProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  color?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  align = 'center',
  color = colors.darkCharcoal,
  className = '' 
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <h2 
      className={`font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${alignmentClasses[align]} ${className}`}
      style={{ color }}
    >
      {children}
    </h2>
  );
};

export default SectionTitle;