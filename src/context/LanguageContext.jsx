import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    pets: 'Pets',
    ai: 'AI Assistant',
    vaccinations: 'Vaccinations',
    subscriptions: 'Subscriptions',
    donations: 'Donations',
    products: 'Products',
    routine: 'Routine',
    care: 'Care',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    add: 'Add',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  hi: {
    welcome: 'स्वागत है',
    dashboard: 'डैशबोर्ड',
    pets: 'पालतू जानवर',
    ai: 'AI सहायक',
    vaccinations: 'टीकाकरण',
    subscriptions: 'सदस्यता',
    donations: 'दान',
    products: 'उत्पाद',
    routine: 'दिनचर्या',
    care: 'देखभाल',
    profile: 'प्रोफ़ाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    add: 'जोड़ें',
    edit: 'संपादित करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pawcare_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pawcare_language', language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}