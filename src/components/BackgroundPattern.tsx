import React, { useMemo } from 'react';

export default function BackgroundPattern() {
  // Randomly select one brushstroke on component mount
  const selectedStroke = useMemo(() => {
    const strokeNumber = Math.floor(Math.random() * 8) + 1;
    return `/src/assets/brushstrokes/stroke${strokeNumber}.svg`;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Deep Navy base */}
      <div className="absolute inset-0 bg-[#00112E]" />
      
      {/* Single Random Brushstroke */}
      <div 
        className="absolute inset-0 opacity-[0.20] mix-blend-soft-light"
        style={{
          backgroundImage: `url("${selectedStroke}")`,
          backgroundSize: '140% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transform: 'rotate(0deg)',
        }}
      />
    </div>
  );
}