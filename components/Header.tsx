import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-md z-10">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
           <button 
              onClick={onToggleSidebar} 
              className="md:hidden me-3 p-1 text-slate-600 hover:text-indigo-600"
              aria-label="Toggle navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600 me-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375V9.75A6.375 6.375 0 0 0 12 3.375Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.375a6.375 6.375 0 0 0-6.375 6.375v2.25A6.375 6.375 0 0 0 12 18.375Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-2.25a1.125 1.125 0 0 0-1.125 1.125v2.25Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375v.008c.044.541.499 1.117 1.226 1.503a14.28 14.28 0 0 0 5.148 1.482c.02.003.039.006.059.009L12 12.375l-6.433 9.007a.997.997 0 0 0 .06.009c1.774-.33 3.52-1.023 5.147-1.482.727-.386 1.182-.962 1.227-1.503v-.008Z" />
          </svg>

          <h1 className="text-xl md:text-3xl font-bold text-slate-900">
            {t('appTitle')}
          </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;