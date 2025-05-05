import React from 'react';

interface BrushStrokeProps {
  color: string;
  opacity?: number;
  className?: string;
  variant?: 'wave' | 'splash' | 'swirl';
}

const BrushStroke: React.FC<BrushStrokeProps> = ({ 
  color, 
  opacity = 0.05,
  className = '',
  variant = 'wave'
}) => {
  // Complex path that mimics the intricate brush strokes from the reference image
  const paths = {
    wave: `M50,300 
      c0,0 100,-200 200,-150 
      c150,75 200,150 300,100 
      c100,-50 150,-100 250,-50 
      c-50,50 -100,100 -150,150 
      c-100,50 -200,0 -300,-50 
      c-100,-50 -200,-100 -300,0 
      c-50,50 -50,100 0,150 
      c100,100 200,50 300,0 
      c100,-50 200,-100 300,-50 
      c50,25 100,50 150,25`,
    splash: `M100,300 
      c50,-100 150,-150 250,-100 
      c100,50 150,100 250,50 
      c-50,100 -100,150 -200,150 
      c-150,0 -250,-50 -350,0 
      c50,-50 100,-100 150,-150 
      m0,0 c100,-50 200,0 300,50 
      c100,50 200,100 300,0 
      c50,-50 50,-100 0,-150 
      c-100,-100 -200,-50 -300,0 
      c-100,50 -200,100 -300,50`,
    swirl: `M200,300 
      c100,-200 300,-150 400,-50 
      c100,100 50,200 -50,250 
      c-100,50 -200,0 -250,-100 
      c-50,-100 0,-200 100,-250 
      c100,-50 200,0 250,100 
      c50,100 0,200 -100,250 
      c-100,50 -200,0 -250,-100 
      m0,0 c50,-100 150,-150 250,-100 
      c100,50 150,100 250,50 
      c-50,100 -100,150 -200,150`
  };

  return (
    <div 
      className={`absolute pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 600" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path 
            d={paths[variant]}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              vectorEffect: 'non-scaling-stroke'
            }}
          />
          {/* Multiple overlapping paths for texture */}
          <path 
            d={paths[variant]}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              vectorEffect: 'non-scaling-stroke',
              transform: 'translate(5px, 5px)'
            }}
          />
          <path 
            d={paths[variant]}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              vectorEffect: 'non-scaling-stroke',
              transform: 'translate(-5px, -5px)'
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default BrushStroke;