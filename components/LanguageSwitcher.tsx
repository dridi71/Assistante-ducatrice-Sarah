import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const buttonClasses = (lang: Language) => `
    px-3 py-1 text-sm font-semibold rounded-md transition-colors
    ${language === lang ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
  `;

  return (
    <div className="flex items-center space-s-2 bg-slate-100 p-1 rounded-lg">
      <button onClick={() => setLanguage(Language.FR)} className={buttonClasses(Language.FR)}>
        FR
      </button>
      <button onClick={() => setLanguage(Language.AR)} className={buttonClasses(Language.AR)}>
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
