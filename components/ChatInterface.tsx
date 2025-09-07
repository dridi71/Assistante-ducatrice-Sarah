import React, { useRef, useEffect } from 'react';
import { ChatConversation, MessageRole, QuizData, Attachment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Message from './Message';
import ChatInput from './ChatInput';
import QuickActionButton from './QuickActionButton';
import { solveExerciseStream, explainImageStream, generateQuiz } from '../services/geminiService';
import { useCorpus } from '../hooks/useCorpus';
import { useChatHistory } from '../hooks/useChatHistory';

interface ChatInterfaceProps {
  conversation: ChatConversation;
  addMessage: ReturnType<typeof useChatHistory>['addMessage'];
  updateMessage: ReturnType<typeof useChatHistory>['updateMessage'];
  updateLastMessage: ReturnType<typeof useChatHistory>['updateLastMessage'];
  renameConversation: (id: string, newTitle: string) => void;
  updateMessageFeedback: ReturnType<typeof useChatHistory>['updateMessageFeedback'];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversation, addMessage, updateMessage, updateLastMessage, renameConversation, updateMessageFeedback }) => {
  const { language, t, setIsStreaming } = useLanguage();
  const { documents } = useCorpus();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation.messages]);

  const handleSendMessage = async (message: string, attachment: Attachment | null) => {
    if (!message.trim() && !attachment) return;

    setIsStreaming(true);

    try {
        const corpusContent = documents.length > 0
            ? documents.map(doc => `--- Document : ${doc.name} ---\n${doc.content}`).join('\n\n')
            : undefined;
        
        const fileContent = attachment?.type === 'document' ? attachment.content : undefined;

        addMessage(conversation.id, MessageRole.User, message, attachment || undefined);
        addMessage(conversation.id, MessageRole.Assistant, '');

        if (attachment?.type === 'image') {
            const stream = explainImageStream(message, attachment.content, 'image/webp', language, corpusContent, fileContent);
            for await (const chunk of stream) {
                updateMessage(conversation.id, chunk);
            }
        } else {
            const stream = solveExerciseStream(message, language, corpusContent, fileContent);
            for await (const chunk of stream) {
                updateMessage(conversation.id, chunk);
            }
        }
      
        if (conversation.messages.length <= 1) { // Auto-rename on first user message
            let newTitle = '';
            if (message.trim()) {
                newTitle = message.length > 40 ? message.substring(0, 40) + '...' : message;
            } else if (attachment) {
                newTitle = attachment.name.length > 40 ? attachment.name.substring(0, 40) + '...' : attachment.name;
            }
            if (newTitle) {
                renameConversation(conversation.id, newTitle);
            }
        }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      updateLastMessage(conversation.id, { content: `**${t('errorTitle')}:** ${errorMessage}` });
    } finally {
      setIsStreaming(false);
    }
  };


  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {conversation.messages.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center h-full">
                <QuickActionButton onSend={(prompt) => handleSendMessage(prompt, null)} />
            </div>
        ) : (
            conversation.messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg}
                  conversationId={conversation.id}
                  updateMessageFeedback={updateMessageFeedback}
                />
            ))
        )}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;