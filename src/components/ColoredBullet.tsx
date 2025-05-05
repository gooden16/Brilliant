import React from 'react';

interface ColoredBulletProps {
  color: string;
  className?: string;
}

const ColoredBullet: React.FC<ColoredBulletProps> = ({ color, className = '' }) => {
  return (
    <span 
      className={`inline-block h-2 w-2 rounded-full mr-2 ${className}`}
      style={{ backgroundColor: color }}
    ></span>
  );
};

export default ColoredBullet;