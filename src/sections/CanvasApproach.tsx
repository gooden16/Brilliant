import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../colors';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import { BarChart3, Folder, CreditCard, Brain, User, Building } from 'lucide-react';
import BrushStroke from '../components/BrushStroke';

interface Block {
  id: string;
  type: 'metric' | 'account' | 'logic' | 'payment' | 'credit' | 'collateral' | 'user';
  icon: React.ReactNode;
  value: string;
  label: string;
  subtitle?: string;
  color: string;
  position: 'left' | 'center' | 'right';
}

const blocks: Block[] = [
  // Metrics (Blue)
  {
    id: 'noi',
    type: 'metric',
    icon: <BarChart3 size={24} />,
    value: '$450,000',
    label: 'NOI',
    subtitle: 'Net Operating Income',
    color: colors.lightBlue,
    position: 'left'
  },
  {
    id: 'dscr',
    type: 'metric',
    icon: <BarChart3 size={24} />,
    value: '1.8x',
    label: 'DSCR',
    subtitle: 'Debt Service Coverage Ratio',
    color: colors.lightBlue,
    position: 'center'
  },
  {
    id: 'cap-rate',
    type: 'metric',
    icon: <BarChart3 size={24} />,
    value: '9%',
    label: 'Cap Rate',
    subtitle: 'Derived from NOI',
    color: colors.lightBlue,
    position: 'right'
  },

  // Accounts (Pink)
  {
    id: 'operating',
    type: 'account',
    icon: <Folder size={24} />,
    value: '$245,000',
    label: 'Operating Account',
    color: colors.dustyPink,
    position: 'left'
  },
  {
    id: 'reserve',
    type: 'account',
    icon: <Folder size={24} />,
    value: '$2,400,000',
    label: 'Reserve Account',
    color: colors.dustyPink,
    position: 'right'
  },

  // Business Logic (Yellow)
  {
    id: 'watermark',
    type: 'logic',
    icon: <Brain size={24} />,
    value: 'Active',
    label: 'Business Logic',
    subtitle: 'Keep Operating Account at $150,000 at all times',
    color: colors.gold,
    position: 'center'
  },
  {
    id: 'autopay',
    type: 'logic',
    icon: <Brain size={24} />,
    value: 'Active',
    label: 'Business Logic',
    subtitle: 'Autopay credit balance on due date',
    color: colors.gold,
    position: 'left'
  },

  // Payment Methods (Green)
  {
    id: 'ach',
    type: 'payment',
    icon: <CreditCard size={24} />,
    value: 'Active',
    label: 'ACH Payments',
    color: colors.deepOlive,
    position: 'left'
  },
  {
    id: 'wire',
    type: 'payment',
    icon: <CreditCard size={24} />,
    value: 'Active',
    label: 'Wire Payments',
    color: colors.deepOlive,
    position: 'center'
  },
  {
    id: 'visa',
    type: 'payment',
    icon: <CreditCard size={24} />,
    value: 'Active',
    label: 'Visa Infinite Credit Card',
    color: colors.deepOlive,
    position: 'right'
  },

  // Credit & Collateral (Orange & Red)
  {
    id: 'credit',
    type: 'credit',
    icon: <CreditCard size={24} />,
    value: '$250,000',
    label: 'Secured Credit Line',
    color: colors.bronzedOrange,
    position: 'left'
  },
  {
    id: 'collateral',
    type: 'collateral',
    icon: <Building size={24} />,
    value: '$5,000,000',
    label: 'Collateral',
    color: colors.burgundy,
    position: 'right'
  },

  // Users (Grey)
  {
    id: 'owner1',
    type: 'user',
    icon: <User size={24} />,
    value: 'Bill',
    label: 'Account Owner(s)',
    color: colors.mediumGrey,
    position: 'left'
  },
  {
    id: 'owner2',
    type: 'user',
    icon: <User size={24} />,
    value: 'Shelley',
    label: 'Account Owner(s)',
    color: colors.mediumGrey,
    position: 'center'
  },
  {
    id: 'manager',
    type: 'user',
    icon: <User size={24} />,
    value: 'Roger',
    label: 'Property Manager',
    color: colors.mediumGrey,
    position: 'right'
  }
];

interface Connection {
  from: string;
  to: string;
  color: string;
  type: 'solid' | 'dashed';
}

const connections: Connection[] = [
  // Metric Connections (Blue)
  { from: 'noi', to: 'dscr', color: colors.lightBlue, type: 'solid' },
  { from: 'dscr', to: 'cap-rate', color: colors.lightBlue, type: 'solid' },
  { from: 'noi', to: 'operating', color: colors.lightBlue, type: 'solid' },
  
  // Account Connections (Pink)
  { from: 'operating', to: 'reserve', color: colors.dustyPink, type: 'solid' },
  
  // Logic Connections (Yellow)
  { from: 'watermark', to: 'operating', color: colors.gold, type: 'solid' },
  { from: 'watermark', to: 'reserve', color: colors.gold, type: 'solid' },
  { from: 'autopay', to: 'operating', color: colors.gold, type: 'solid' },
  
  // Payment Connections (Green)
  { from: 'ach', to: 'operating', color: colors.deepOlive, type: 'solid' },
  { from: 'wire', to: 'operating', color: colors.deepOlive, type: 'solid' },
  { from: 'visa', to: 'operating', color: colors.deepOlive, type: 'solid' },
  
  // Credit & Collateral Connections (Orange & Red)
  { from: 'credit', to: 'collateral', color: colors.bronzedOrange, type: 'solid' },
  { from: 'credit', to: 'visa', color: colors.bronzedOrange, type: 'dashed' },
  
  // User Connections (Grey)
  { from: 'owner1', to: 'operating', color: colors.mediumGrey, type: 'dashed' },
  { from: 'owner2', to: 'reserve', color: colors.mediumGrey, type: 'dashed' },
  { from: 'manager', to: 'operating', color: colors.mediumGrey, type: 'dashed' }
];

const CanvasApproach: React.FC = () => {
  const [activeBlocks, setActiveBlocks] = useState<string[]>([]);
  const [activeConnections, setActiveConnections] = useState<Connection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animation sequence
          const sequence = [
            ['noi', 'dscr', 'cap-rate'], // Blue metrics
            ['operating', 'reserve'], // Pink accounts
            ['watermark'], // First yellow logic
            ['ach', 'wire', 'visa'], // Green payments
            ['credit', 'collateral'], // Orange & red
            ['autopay'], // Second yellow logic
            ['owner1', 'owner2', 'manager'] // Grey users
          ];

          sequence.forEach((blockIds, index) => {
            setTimeout(() => {
              setActiveBlocks(prev => [...prev, ...blockIds]);
              const newConnections = connections.filter(
                conn => blockIds.includes(conn.from) || blockIds.includes(conn.to)
              );
              setActiveConnections(prev => [...prev, ...newConnections]);
            }, index * 1000);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderBlock = (block: Block) => (
    <div
      key={block.id}
      ref={el => blockRefs.current[block.id] = el}
      className={`relative transition-all duration-500 ${
        activeBlocks.includes(block.id)
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-20'
      }`}
    >
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div style={{ color: block.color }}>{block.icon}</div>
          <div>
            <div className="text-lg font-bold" style={{ color: block.color }}>
              {block.value}
            </div>
            <div className="text-sm" style={{ color: colors.mediumGrey }}>
              {block.label}
            </div>
            {block.subtitle && (
              <div className="text-xs mt-1" style={{ color: colors.mediumGrey }}>
                {block.subtitle}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" ref={containerRef}>
      <BrushStroke 
        color={colors.lightBlue} 
        className="top-0 right-0 w-3/4 transform rotate-12" 
        variant="wave"
      />
      <BrushStroke 
        color={colors.dustyPink} 
        className="bottom-0 left-0 w-2/3 transform -rotate-12" 
        variant="splash"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle>The Canvas Approach</SectionTitle>
        <p className="text-center text-lg mb-16 max-w-3xl mx-auto" style={{ color: colors.mediumGrey }}>
          Watch as intelligent building blocks combine to create your personalized financial command center.
        </p>
        
        <div className="relative bg-gray-50 rounded-3xl p-6 md:p-12 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-12">Your Real Estate Investment Canvas</h3>
          
          <div className="space-y-16">
            {/* Metrics Layer (Blue) */}
            <div className="grid grid-cols-3 gap-8">
              {blocks.filter(b => b.type === 'metric').map(renderBlock)}
            </div>
            
            {/* Accounts Layer (Pink) */}
            <div className="grid grid-cols-2 gap-8">
              {blocks.filter(b => b.type === 'account').map(renderBlock)}
            </div>
            
            {/* Logic Layer (Yellow) */}
            <div className="grid grid-cols-2 gap-8">
              {blocks.filter(b => b.type === 'logic').map(renderBlock)}
            </div>
            
            {/* Payments Layer (Green) */}
            <div className="grid grid-cols-3 gap-8">
              {blocks.filter(b => b.type === 'payment').map(renderBlock)}
            </div>
            
            {/* Credit & Collateral Layer (Orange & Red) */}
            <div className="grid grid-cols-2 gap-8">
              {blocks.filter(b => b.type === 'credit' || b.type === 'collateral').map(renderBlock)}
            </div>
            
            {/* Users Layer (Grey) */}
            <div className="grid grid-cols-3 gap-8">
              {blocks.filter(b => b.type === 'user').map(renderBlock)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanvasApproach;