import React from 'react';
import { SearchResultItem, ConversationSearchResult, CorpusSearchResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  onResultClick: (item: SearchResultItem) => void;
}

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-indigo-200 text-indigo-800 rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};


const SearchResults: React.FC<SearchResultsProps> = ({ query, results, onResultClick }) => {
  const { t } = useLanguage();

  const conversationResults = results.filter(r => r.type === 'conversation') as ConversationSearchResult[];
  const corpusResults = results.filter(r => r.type === 'corpus') as CorpusSearchResult[];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {t('searchResultsTitle')} <span className="text-indigo-600">"{query}"</span>
      </h2>

      {results.length === 0 ? (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-slate-500">{t('noResultsFound')}</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {conversationResults.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">{t('conversationsSection')}</h3>
              <div className="space-y-4">
                {conversationResults.map(item => (
                  <button
                    key={item.message.id}
                    onClick={() => onResultClick(item)}
                    className="w-full text-left p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-md transition-all"
                  >
                    <p className="font-semibold text-indigo-700 truncate">{item.conversationTitle}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      <HighlightedText text={item.message.content} highlight={query} />
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {corpusResults.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">{t('corpusSection')}</h3>
              <div className="space-y-4">
                {corpusResults.map(item => (
                  <button
                    key={item.document.id}
                    onClick={() => onResultClick(item)}
                    className="w-full text-left p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-md transition-all"
                  >
                     <p className="font-semibold text-indigo-700 truncate">{item.document.name}</p>
                     <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                       <HighlightedText text={item.document.content} highlight={query} />
                     </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;