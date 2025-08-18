import React, { useState } from 'react';
import Header from './components/Header';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useChatHistory } from './hooks/useChatHistory';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import ManageCorpus from './components/ManageCorpus';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const chatHistory = useChatHistory();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(chatHistory.conversations[0]?.id || null);
  const [activeView, setActiveView] = useState<'chat' | 'corpus'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveView('chat');
    closeSidebar();
  };

  const handleNewChat = () => {
    const newId = chatHistory.createConversation();
    setActiveConversationId(newId);
    setActiveView('chat');
    closeSidebar();
  };
  
  const handleSelectCorpus = () => {
    setActiveView('corpus');
    setActiveConversationId(null); // Deselect any conversation
    closeSidebar();
  }

  const activeConversation = chatHistory.conversations.find(c => c.id === activeConversationId);

  return (
    <div className="h-screen flex flex-col font-sans">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex-grow flex overflow-hidden relative">
        <HistorySidebar
          history={chatHistory}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onSelectCorpus={handleSelectCorpus}
          activeId={activeView === 'corpus' ? 'corpus' : activeConversationId}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
         {isSidebarOpen && (
            <div 
              onClick={closeSidebar} 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              aria-hidden="true"
            ></div>
          )}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeView === 'chat' && activeConversation ? (
            <ChatInterface
              key={activeConversation.id}
              conversation={activeConversation}
              updateMessage={chatHistory.updateMessage}
              addMessage={chatHistory.addMessage}
              updateLastMessage={chatHistory.updateLastMessage}
              renameConversation={chatHistory.renameConversation}
              updateMessageFeedback={chatHistory.updateMessageFeedback}
            />
          ) : activeView === 'corpus' ? (
            <ManageCorpus />
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-indigo-300 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-slate-800">{t('welcomeTitle')}</h2>
                  <p className="text-slate-600 mt-2">{t('welcomeMessage')}</p>
                  <button onClick={handleNewChat} className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    {t('startConversationButton')}
                  </button>
                </div>
            </div>
          )}
        </main>
      </div>
       <footer className="text-center p-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-500">
          {t('copyright')}
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;