import React from 'react';
import { colors } from '../colors';
import Logo from '../components/Logo';
import Button from '../components/Button';
import BrushStroke from '../components/BrushStroke';

const Hero: React.FC = () => {
  const [activeMetric, setActiveMetric] = React.useState(0);
  
  const metrics = [
    {
      type: 'metrics',
      color: colors.lightBlue,
      title: 'Performance Metrics',
      items: [
        { label: 'Property NOI', value: '+12%' },
        { label: 'IRR', value: '18.5%' },
        { label: 'Cash on Cash Return', value: '8.4%' }
      ]
    },
    {
      type: 'accounts',
      color: colors.dustyPink,
      title: 'Account Status',
      items: [
        { label: 'Operating Account', value: '$245,000' },
        { label: 'Reserve Account', value: '$2.4M' },
        { label: 'Tax Reserve', value: '$380,000' }
      ]
    },
    {
      type: 'products',
      color: colors.gold,
      title: 'Credit Products',
      items: [
        { label: 'Secured Credit Line', value: '$5M' },
        { label: 'Real Estate LTV', value: '60%' },
        { label: 'Business Credit', value: 'Active' }
      ]
    },
    {
      type: 'logic',
      color: colors.deepOlive,
      title: 'Active Rules',
      items: [
        { label: 'Autopay', value: 'Enabled' },
        { label: 'Auto-replenish', value: 'Active' },
        { label: 'NOI Alerts', value: 'Set' }
      ]
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colors.deepNavy }}>
      <BrushStroke 
        color={colors.white}
        className="absolute inset-0 w-full h-full transform scale-150 rotate-45"
        opacity={0.05}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <Logo variant="light" />
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-montserrat text-white hover:text-opacity-80 transition-all">Features</a>
            <a href="#use-cases" className="font-montserrat text-white hover:text-opacity-80 transition-all">Use Cases</a>
            <a href="#security" className="font-montserrat text-white hover:text-opacity-80 transition-all">Security</a>
            <Button variant="secondary" className="ml-4">Talk to us</Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Better banking for smart money
            </h1>
            <p className="font-montserrat text-lg mb-6 text-white text-opacity-90">
              Tailored banking products designed for your financial needs, seamlessly integrated with your wealth management
            </p>
            <p className="font-montserrat text-base mb-10 text-white text-opacity-80">
              Experience banking that finally understands how you think about your finances, with customized solutions that match your business structure and investment strategy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Talk to us</Button>
              <Button variant="secondary">Learn more</Button>
            </div>
          </div>
          
          <div className="perspective-800">
            <div className="relative transform rotate-y-5 rotate-x-10 transition-all duration-300 hover:rotate-y-0 hover:rotate-x-0">
              <img 
                src="https://images.pexels.com/photos/7652189/pexels-photo-7652189.jpeg" 
                alt="Canvas Interface Visualization" 
                className="rounded-2xl shadow-xl w-full"
              />
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className={`absolute p-4 rounded-xl shadow-lg transform transition-all duration-500 ${
                    index === activeMetric
                      ? 'opacity-100 translate-y-0 animate-float'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    backgroundColor: 'white',
                    maxWidth: '200px',
                    top: `${20 + (index * 5)}%`,
                    right: `${10 + (index * 2)}%`,
                    zIndex: activeMetric === index ? 20 : 10
                  }}
                >
                  <div className="text-sm font-montserrat font-semibold" style={{ color: metric.color }}>
                    {metric.title}
                  </div>
                  {metric.items.map((item, i) => (
                    <div key={i} className="text-xs mt-1" style={{ color: i === 0 ? metric.color : colors.mediumGrey }}>
                      {item.label}: {item.value}
                    </div>
                  ))}
                  <div className="w-full h-2 mt-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: activeMetric === index ? '75%' : '0%',
                        backgroundColor: metric.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;