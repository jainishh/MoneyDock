import React from 'react';
import Hero from './Hero';
import ProductSections from './ProductSections';
import Universe from './Universe';

const ProductsPage = () => {
    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-10 pb-20 font-sans transition-colors duration-300">
            <Hero />
            <ProductSections />
            <Universe />
        </div>
    );
};

export default ProductsPage;
