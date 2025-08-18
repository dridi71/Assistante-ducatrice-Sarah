import { useState, useEffect, useCallback } from 'react';
import { CorpusDocument } from '../types';

const STORAGE_KEY = 'educational-ai-corpus';

export const useCorpus = () => {
  const [documents, setDocuments] = useState<CorpusDocument[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setDocuments(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to load documents from local storage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      } catch (error) {
        console.error('Failed to save documents to local storage:', error);
      }
    }
  }, [documents, isLoaded]);

  const addDocument = useCallback((name: string, content: string) => {
    const newDocument: CorpusDocument = {
      id: new Date().toISOString(),
      name,
      content,
    };
    setDocuments(prevDocs => [...prevDocs, newDocument]);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
  }, []);

  return { documents, addDocument, deleteDocument, isLoaded };
};
