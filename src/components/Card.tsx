import React from 'react';
import { colors } from '../colors';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  background?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  background = colors.white
}) => {
  return (
    <div 
      className={`rounded-2xl p-6 shadow-lg ${className}`}
      style={{ backgroundColor: background }}
    >
      {children}
    </div>
  );
};

export default Card;