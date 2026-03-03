import React from 'react';
import Hero from './Hero';
import TrustSection from './TrustSection';
import PricingSection from './PricingSection';
import EducationSection from './EducationSection';
import OpenAccount from './OpenAccount';

const HomePage = () => {
    return (
        <div className="pb-10 font-sans">
            <Hero />
            <TrustSection />
            <PricingSection />
            <EducationSection />
            <OpenAccount />
        </div>
    );
};

export default HomePage;
