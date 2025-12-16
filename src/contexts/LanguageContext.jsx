import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Initialize from URL or LocalStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang && (urlLang === 'en' || urlLang === 'zh')) {
            setLanguage(urlLang);
        }
    }, []);

    const t = (key) => {
        const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
        return dict[key] || key;
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'zh' : 'en';
        setLanguage(newLang);
        // Optional: Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);
        window.history.pushState({}, '', url);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
