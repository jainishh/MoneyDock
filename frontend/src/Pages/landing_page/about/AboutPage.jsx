import React from 'react';
import Hero from './Hero';
import Team from './Team';

const AboutPage = () => {
    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-10 pb-20 transition-colors duration-300">
            <Hero />
            <Team />
        </div>
    );
};

export default AboutPage;
