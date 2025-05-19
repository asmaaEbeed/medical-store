import  { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');
  const [currentLang, setCurrentLang] = useState('en');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setIsRTL(newLang === 'ar');
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    if (currentLang === 'en') { 
      localStorage.setItem('lang', 'ar')
      setCurrentLang('ar');
     } else { 
      localStorage.setItem('lang', 'en');
      setCurrentLang('en');
    }
  };
  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (!lang || lang === undefined) {
      localStorage.setItem('lang', 'en');
      setCurrentLang('en');
    }
    else {
      setCurrentLang(lang);
    }
  }, [])

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <LanguageContext.Provider value={{ isRTL, toggleLanguage, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}; 