import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
    onSearch: (query: string) => void;
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onMenuToggle }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          onSearch(searchQuery.trim());
      }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-30">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center">
           <button onClick={onMenuToggle} className="md:hidden me-3 p-2 -m-2 text-gray-600 hover:text-indigo-600" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 me-3">
            <path d="M150 70 C100 70 80 120 150 160 C220 120 200 70 150 70Z" fill="#7DCEA0"/>
            <path d="M150 160 C80 200 70 240 150 240 C230 240 220 200 150 160Z" fill="#7DCEA0"/>
            <circle cx="150" cy="150" r="30" fill="#3498DB"/>
            <path d="M150 180 C130 180 110 210 150 210 C190 210 170 180 150 180Z" fill="#3498DB"/>
          </svg>
          <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-gray-900">
            {t('appTitle')}
          </h1>
        </div>
        
        <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full ps-10 pe-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </form>
        </div>
        <div data-tutorial-id="lang-switcher">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;