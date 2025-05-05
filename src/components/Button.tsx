import React from 'react';
import { colors } from '../colors';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  onClick 
}) => {
  const baseStyles = 'font-montserrat py-3 px-6 rounded-2xl font-medium transition-all duration-300 inline-block text-center';
  
  const variantStyles = {
    primary: `bg-[${colors.gold}] text-[${colors.deepNavy}] hover:bg-opacity-90`,
    secondary: `border-2 border-[${colors.gold}] text-[${colors.gold}] hover:bg-[${colors.gold}] hover:bg-opacity-10`
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      onClick={onClick}
      style={{
        backgroundColor: variant === 'primary' ? colors.gold : 'transparent',
        color: variant === 'primary' ? colors.deepNavy : colors.gold,
        borderColor: colors.gold
      }}
    >
      {children}
    </button>
  );
};

export default Button;