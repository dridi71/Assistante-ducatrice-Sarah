import { useState, useEffect, useCallback } from 'react';
import { ChatConversation, ChatMessage, MessageRole, Attachment, FeedbackState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'sarah-chat-history';

export const useChatHistory = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const createConversation = useCallback((): string => {
    const newConversation: ChatConversation = {
      id: new Date().toISOString(),
      title: t('defaultConversationTitle'),
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  }, [t]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setConversations(JSON.parse(storedItems));
      } else {
        // Start with one empty conversation if history is empty
        createConversation();
      }
    } catch (error) {
      console.error('Failed to load chat history from local storage:', error);
      createConversation(); // Start fresh if loading fails
    } finally {
      setIsLoaded(true);
    }
    // This effect should only run once on mount to initialize the history.
    // The `createConversation` dependency is intentionally omitted to prevent re-initialization on language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save chat history to local storage:', error);
      }
    }
  }, [conversations, isLoaded]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  }, []);

  const renameConversation = useCallback((id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
  }, []);

  const addMessage = useCallback((conversationId: string, role: MessageRole, content: string, attachment?: Attachment) => {
    const newMessage: ChatMessage = {
      id: `${new Date().toISOString()}-${Math.random()}`,
      role,
      content,
      attachment,
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
  }, []);

  const updateMessage = useCallback((conversationId: string, contentChunk: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const newMessages = [...c.messages];
          const lastMessageIndex = newMessages.length - 1;
          if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === MessageRole.Assistant) {
            newMessages[lastMessageIndex].content += contentChunk;
            return { ...c, messages: newMessages };
          }
        }
        return c;
      })
    );
  }, []);

  const updateLastMessage = useCallback((conversationId: string, payload: Partial<ChatMessage>) => {
    setConversations(prev =>
        prev.map(c => {
            if (c.id === conversationId) {
                const newMessages = [...c.messages];
                const lastMessageIndex = newMessages.length - 1;
                if (lastMessageIndex >= 0) {
                    newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], ...payload };
                }
                return { ...c, messages: newMessages };
            }
            return c;
        })
    );
  }, []);

  const updateMessageFeedback = useCallback((conversationId: string, messageId: string, feedback: FeedbackState) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const newMessages = c.messages.map(msg => {
            if (msg.id === messageId) {
              const newFeedback = msg.feedback === feedback ? null : feedback;
              return { ...msg, feedback: newFeedback };
            }
            return msg;
          });
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
  }, []);

  return { conversations, isLoaded, createConversation, deleteConversation, renameConversation, addMessage, updateMessage, updateLastMessage, updateMessageFeedback };
};
