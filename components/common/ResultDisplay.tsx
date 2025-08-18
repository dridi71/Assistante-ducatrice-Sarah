import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

interface ResultDisplayProps {
  result: string;
  loading: boolean;
  error: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading, error }) => {
  const { t, language } = useLanguage();

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-200 min-h-[200px]">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 font-medium">{t('loadingMessage')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <h3 className="font-bold">{t('errorTitle')}</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
      <div 
        className="prose prose-slate max-w-none" 
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        dangerouslySetInnerHTML={{ __html: formatResult(result) }} 
      />
    </div>
  );
};

// Basic markdown to HTML converter to avoid external libraries
const formatResult = (text: string) => {
  let html = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
    .replace(/`{1,3}(.*?)`{1,3}/g, '<code class="bg-slate-200 rounded px-1 py-0.5 text-sm">$1</code>') // Inline code
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^\* (.*$)/gim, '<ul class="list-disc ps-5"><li>$1</li></ul>') // Basic lists with logical padding
    .replace(/^1\. (.*$)/gim, '<ol class="list-decimal ps-5"><li>$1</li></ol>') // Basic ordered lists with logical padding
    .replace(/\n/g, '<br />'); // Newlines
    
  // Consolidate list items
  html = html.replace(/<\/ul><br \/><ul>/g, '');
  html = html.replace(/<\/ol><br \/>(<ol>|<li>)/g, '$1');

  return html;
};

export default ResultDisplay;