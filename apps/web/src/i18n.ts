/**
 * i18next configuration - Arabic primary, English secondary
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arProperties from './locales/ar/properties.json';
import arRequests from './locales/ar/requests.json';
import arCrm from './locales/ar/crm.json';
import arTransactions from './locales/ar/transactions.json';
import arDashboard from './locales/ar/dashboard.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enProperties from './locales/en/properties.json';
import enRequests from './locales/en/requests.json';
import enCrm from './locales/en/crm.json';
import enTransactions from './locales/en/transactions.json';
import enDashboard from './locales/en/dashboard.json';

const resources = {
  ar: { common: arCommon, auth: arAuth, properties: arProperties, requests: arRequests, crm: arCrm, transactions: arTransactions, dashboard: arDashboard },
  en: { common: enCommon, auth: enAuth, properties: enProperties, requests: enRequests, crm: enCrm, transactions: enTransactions, dashboard: enDashboard },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'properties', 'requests', 'crm', 'transactions', 'dashboard'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

export default i18n;
