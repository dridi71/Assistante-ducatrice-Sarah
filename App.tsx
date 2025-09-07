import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useChatHistory } from './hooks/useChatHistory';
import { useCorpus } from './hooks/useCorpus';
import HistorySidebar from './components/HistorySidebar';
import ChatInterface from './components/ChatInterface';
import ManageCorpus from './components/ManageCorpus';
import CreateQuiz from './components/CreateQuiz';
import SearchResults from './components/SearchResults';
import { QuizData, MessageRole, SearchResultItem } from './types';
import Tutorial from './components/Tutorial';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const chatHistory = useChatHistory();
  const { documents } = useCorpus();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(chatHistory.conversations[0]?.id || null);
  const [activeView, setActiveView] = useState<'chat' | 'corpus' | 'quiz' | 'search'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Show tutorial only if the flag is not set in local storage
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleFinishTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };


  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveView('chat');
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    const newId = chatHistory.createConversation();
    setActiveConversationId(newId);
    setActiveView('chat');
    setIsSidebarOpen(false);
  };
  
  const handleSelectCorpus = () => {
    setActiveView('corpus');
    setActiveConversationId(null);
    setIsSidebarOpen(false);
  }

  const handleSelectQuizCreator = () => {
    setActiveView('quiz');
    setActiveConversationId(null);
    setIsSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('search');
    setActiveConversationId(null);
  };

  const handleSearchResultClick = (item: SearchResultItem) => {
    if (item.type === 'conversation') {
      setActiveConversationId(item.conversationId);
      setActiveView('chat');
    } else if (item.type === 'corpus') {
      setActiveView('corpus');
    }
  };

  const handleQuizCreated = (quizData: QuizData, title: string) => {
    const newId = chatHistory.createConversation();
    // Use a truncated title for the conversation list
    const conversationTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
    chatHistory.renameConversation(newId, conversationTitle);
    // Add a user message that represents the request, using the full title
    chatHistory.addMessage(newId, MessageRole.User, title);
    // Add the assistant's response with the quiz data
    chatHistory.addMessage(newId, MessageRole.Assistant, '', undefined);
    chatHistory.updateLastMessage(newId, { content: '', quiz: quizData });

    setActiveConversationId(newId);
    setActiveView('chat');
  };

  const activeConversation = chatHistory.conversations.find(c => c.id === activeConversationId);

  const getActiveSidebarId = () => {
    switch (activeView) {
      case 'corpus': return 'corpus';
      case 'quiz': return 'quiz';
      case 'chat': return activeConversationId;
      case 'search': return null;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans">
      {showTutorial && <Tutorial onFinish={handleFinishTutorial} />}
      <Header onSearch={handleSearch} onMenuToggle={() => setIsSidebarOpen(true)} />
      <div className="flex-grow flex overflow-hidden">
        {isSidebarOpen && (
            <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                aria-hidden="true"
            ></div>
        )}
        <HistorySidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          history={chatHistory}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onSelectCorpus={handleSelectCorpus}
          onSelectQuizCreator={handleSelectQuizCreator}
          activeId={getActiveSidebarId()}
        />
        <main data-tutorial-id="main-chat-area" className="flex-1 flex flex-col overflow-hidden">
          {activeView === 'search' ? (
            <SearchResults query={searchQuery} results={searchResults} onResultClick={handleSearchResultClick} />
          ) : activeView === 'chat' && activeConversation ? (
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
          ) : activeView === 'quiz' ? (
            <CreateQuiz onQuizCreated={handleQuizCreated} />
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{t('welcomeTitle')}</h2>
                  <p className="text-gray-600 mt-2 max-w-md mx-auto">{t('welcomeMessage')}</p>
                  <button onClick={handleNewChat} className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105">
                    {t('startConversationButton')}
                  </button>
                </div>
            </div>
          )}
        </main>
      </div>
       <footer className="text-center p-3 bg-gray-100 border-t border-gray-200 text-xs text-gray-500">
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