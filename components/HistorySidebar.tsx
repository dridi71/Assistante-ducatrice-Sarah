import React, { useState } from 'react';
import { useChatHistory } from '../hooks/useChatHistory';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatConversation } from '../types';

interface HistorySidebarProps {
  history: ReturnType<typeof useChatHistory>;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onSelectCorpus: () => void;
  onSelectQuizCreator: () => void;
  activeId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onNewChat, onSelectConversation, onSelectCorpus, onSelectQuizCreator, activeId, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  const handleRenameStart = (conversation: ChatConversation) => {
    setRenamingId(conversation.id);
    setTempTitle(conversation.title);
  };
  
  const handleRenameConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (renamingId && tempTitle.trim()) {
      history.renameConversation(renamingId, tempTitle.trim());
    }
    setRenamingId(null);
  };

  return (
    <aside className={`w-72 bg-gray-100 border-e border-gray-200 flex flex-col p-3 transform transition-transform duration-300 ease-in-out md:transform-none md:relative md:translate-x-0 fixed inset-y-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-2 md:hidden">
            <h2 className="text-sm font-bold text-gray-600 uppercase p-2 tracking-wider">{t('appTitle')}</h2>
            <button onClick={onClose} className="p-2 -m-2 text-gray-600 hover:text-indigo-600" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2.5 p-2.5 mb-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {t('newChatButton')}
      </button>

      <div className="flex-grow overflow-y-auto -mx-1 px-1">
        <h2 className="text-xs font-bold text-gray-500 uppercase p-2 tracking-wider md:block hidden">{t('historyTitle')}</h2>
        <nav className="space-y-1">
          {history.conversations.map((convo) => (
            <div key={convo.id} className="group relative">
                {renamingId === convo.id ? (
                     <form onSubmit={handleRenameConfirm} className="w-full">
                        <input
                            type="text"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={handleRenameConfirm}
                            autoFocus
                            className="w-full p-2.5 text-sm bg-white border border-indigo-500 rounded-lg"
                        />
                     </form>
                ) : (
                    <button
                        onClick={() => onSelectConversation(convo.id)}
                        className={`w-full text-start p-2.5 text-sm rounded-lg truncate ${
                            activeId === convo.id ? 'bg-indigo-200 text-indigo-900 font-semibold' : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {convo.title}
                    </button>
                )}
               
                {renamingId !== convo.id && (
                    <div className="absolute end-1.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-inherit">
                       <button onClick={() => handleRenameStart(convo)} className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md" aria-label={t('renameConversationLabel')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                       </button>
                       <button onClick={() => history.deleteConversation(convo.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md" aria-label={t('deleteConversationLabel')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                               <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                       </button>
                    </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 mt-auto pt-3 space-y-1">
         <button 
             onClick={onSelectQuizCreator}
             className={`w-full flex items-center gap-3 p-2.5 text-sm rounded-lg ${
                 activeId === 'quiz' ? 'bg-indigo-200 text-indigo-900 font-semibold' : 'text-gray-700 hover:bg-gray-200'
             }`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
            </svg>
            {t('createQuizButton')}
         </button>
         <button 
             onClick={onSelectCorpus}
             className={`w-full flex items-center gap-3 p-2.5 text-sm rounded-lg ${
                 activeId === 'corpus' ? 'bg-indigo-200 text-indigo-900 font-semibold' : 'text-gray-700 hover:bg-gray-200'
             }`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            {t('manageCorpusButton')}
         </button>
      </div>
    </aside>
  );
};

export default HistorySidebar;