import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  const language = (i18n.language?.startsWith('ar') ? 'ar' : 'en') as Language;

  const setLanguage = useCallback(
    (lang: Language) => {
      i18n.changeLanguage(lang);
    },
    [i18n]
  );

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(language === 'ar' ? 'en' : 'ar');
  }, [language, i18n]);

  const t = useCallback(
    (ar: string, en: string) => (language === 'ar' ? ar : en),
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRtl: language === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
