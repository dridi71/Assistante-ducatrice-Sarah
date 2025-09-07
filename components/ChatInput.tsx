import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Attachment } from '../types';
import { processFile } from '../utils/fileProcessor';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSend: (message: string, attachment: Attachment | null) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const { t, isStreaming, language } = useLanguage();
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Proactive permission check for microphone
  useEffect(() => {
      if ('permissions' in navigator) {
          navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
              setMicPermission(permissionStatus.state);
              permissionStatus.onchange = () => {
                  setMicPermission(permissionStatus.state);
              };
          });
      }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ar' ? 'ar-TN' : 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
            setError(t('errorSpeechNotAllowed'));
            setMicPermission('denied');
        }
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, t]);


  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);
  
  const removeFile = () => {
      setAttachment(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setError('');
        setIsProcessingFile(true);
        try {
            const processedAttachment = await processFile(selectedFile);
            setAttachment(processedAttachment);
        } catch(err: any) {
            setError(err.message);
            removeFile();
        } finally {
            setIsProcessingFile(false);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isStreaming) return;
    onSend(input, attachment);
    setInput('');
    removeFile();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const toggleListening = () => {
    setError('');
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
        setIsListening(true);
    }
  };


  return (
    <div className='w-full'>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      
      {isProcessingFile && <p className="text-gray-600 text-sm mb-2 animate-pulse">{t('processingFile')}</p>}

      {attachment && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg relative w-fit max-w-sm">
              {attachment.type === 'image' ? (
                <img src={attachment.previewUrl!} alt={attachment.name} className="h-24 w-auto rounded-md" />
              ) : (
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-800 truncate">{attachment.name}</p>
                </div>
              )}
              <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-0 end-0 -translate-y-1/2 translate-x-1/2 bg-gray-600 text-white rounded-full p-0.5 hover:bg-gray-800 transition-colors"
                  aria-label={t('removeFileLabel')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || isProcessingFile}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300 transition-colors"
          aria-label={t('attachFileLabel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
          </svg>
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png,image/jpeg,image/webp,.pdf,.txt,.docx,.xlsx"
            disabled={isStreaming || isProcessingFile}
        />

        <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? t('listening') : t('chatPlaceholder')}
              className="w-full p-2.5 pe-12 border border-gray-300 bg-white rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              rows={1}
              disabled={isStreaming || isProcessingFile}
              style={{ maxHeight: '150px' }}
            />
            <div className="absolute end-2.5 bottom-2.5 group">
                 <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isStreaming || !recognitionRef.current || isProcessingFile || micPermission === 'denied'}
                    className={`text-gray-500 hover:text-indigo-600 disabled:text-gray-300 disabled:cursor-not-allowed ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 7.5v-1.5a6 6 0 0 0-6-6v-1.5a6 6 0 0 0-6 6v1.5m6 7.5h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Z" />
                    </svg>
                </button>
                {micPermission === 'denied' && (
                     <div className="absolute bottom-full mb-2 end-0 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {t('errorSpeechNotAllowed')}
                    </div>
                )}
            </div>
        </div>

        <button
          type="submit"
          disabled={isStreaming || isProcessingFile || (!input.trim() && !attachment)}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:bg-indigo-300 transition-colors"
          aria-label={t('sendMessageLabel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;