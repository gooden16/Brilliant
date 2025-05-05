import React from 'react';
import { colors } from '../colors';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import ColoredBullet from '../components/ColoredBullet';
import BrushStroke from '../components/BrushStroke';

const UseCases: React.FC = () => {
  const cases = [
    {
      title: 'Real Estate Investment Canvas',
      image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
      challenge: 'When time-sensitive property opportunities arise, traditional banking can\'t keep pace with your needs.',
      solution: 'Your Canvas provides immediate liquidity while maintaining optimal portfolio allocation, with property-specific metrics built right in.',
      benefit: 'Close deals quickly without liquidating your high-performing assets or disrupting your investment strategy.'
    },
    {
      title: 'Business & Personal Liquidity Canvas',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
      challenge: 'Managing both business expansion and personal wealth acquisition requires complex coordination.',
      solution: 'Your unified Canvas creates a seamless view of both personal and business finances, optimizing cash flow while maintaining appropriate boundaries.',
      benefit: 'Grow your business and manage personal wealth with a single, coherent strategy that works across all your financial needs.'
    },
    {
      title: 'Market Opportunity Canvas',
      image: 'https://images.pexels.com/photos/7567557/pexels-photo-7567557.jpeg',
      challenge: 'Market volatility creates both risk and opportunity, requiring quick and strategic decision-making.',
      solution: 'Your Canvas coordinates credit access with real-time portfolio monitoring, providing liquidity exactly when you need it.',
      benefit: 'Act decisively during market fluctuations without disrupting your long-term investment strategy, potentially enhancing overall returns.'
    }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden" style={{ backgroundColor: colors.cream }} id="use-cases">
      <BrushStroke 
        color={colors.gold} 
        className="top-20 right-0 w-2/3 transform rotate-180" 
        variant="swirl"
        opacity={0.05}
      />
      <BrushStroke 
        color={colors.deepOlive} 
        className="bottom-0 left-0 w-3/4" 
        variant="wave"
        opacity={0.05}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle>Use Cases</SectionTitle>
        <p className="font-montserrat text-center text-lg mb-16 max-w-3xl mx-auto" style={{ color: colors.mediumGrey }}>
          See how our Canvas approach transforms complex financial scenarios into intuitive, actionable solutions.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((useCase, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: colors.darkCharcoal }}>
                  {useCase.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-montserrat font-semibold mb-2 text-sm" style={{ color: colors.burgundy }}>
                      The Challenge
                    </h4>
                    <p className="text-sm" style={{ color: colors.mediumGrey }}>
                      {useCase.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-2 text-sm" style={{ color: colors.deepOlive }}>
                      Our Solution
                    </h4>
                    <p className="text-sm" style={{ color: colors.mediumGrey }}>
                      {useCase.solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold mb-2 text-sm" style={{ color: colors.gold }}>
                      Your Benefit
                    </h4>
                    <p className="text-sm" style={{ color: colors.mediumGrey }}>
                      {useCase.benefit}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;