import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSizeState] = useState(() => {
        return localStorage.getItem('font-size') || 'Medium';
    });

    const setFontSize = (size) => {
        setFontSizeState(size);
        localStorage.setItem('font-size', size);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [fontSize]);

    return (
        <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => {
    const context = useContext(FontSizeContext);
    if (!context) {
        throw new Error('useFontSize must be used within a FontSizeProvider');
    }
    return context;
};
