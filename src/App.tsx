import React from 'react';
import './fonts.css';
import './animations.css';
import Hero from './sections/Hero';
import CanvasApproach from './sections/CanvasApproach';
import UseCases from './sections/UseCases';
import Security from './sections/Security';
import CtaBanner from './sections/CtaBanner';
import Footer from './sections/Footer';

function App() {
  // Update the document title
  React.useEffect(() => {
    document.title = 'Brilliant* Financial | Better banking for smart money';
  }, []);
  
  return (
    <div className="font-montserrat">
      <Hero />
      <CanvasApproach />
      <UseCases />
      <Security />
      <CtaBanner />
      <Footer />
    </div>
  );
}

export default App;