import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, MessageRole, FeedbackState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Quiz from './Quiz';
import mermaid from 'mermaid';
import katex from 'katex/dist/katex.mjs';

interface MessageProps {
  message: ChatMessage;
  conversationId: string;
  updateMessageFeedback: (conversationId: string, messageId: string, feedback: FeedbackState) => void;
}

const UserAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 flex-shrink-0">
        U
    </div>
);

const AssistantAvatar = () => (
     <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
        S
    </div>
);

const DocumentCard = ({ name }: { name: string }) => {
    const { t } = useLanguage();
    return (
        <div className="p-3 mb-2 bg-gray-200/50 rounded-lg flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className='truncate'>
                <p className="text-xs font-semibold text-gray-600">{t('fileCardTitle')}</p>
                <p className="text-sm text-gray-800 truncate font-medium">{name}</p>
            </div>
        </div>
    )
}

const CodeBlock = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [isRendered, setIsRendered] = useState(false);
  const codeRef = React.useRef<HTMLElement>(null);
  const lang = className?.replace('language-', '');
  const codeContent = String(children).trim();

  useEffect(() => {
    if (codeRef.current && !isRendered) {
      if (lang === 'mermaid') {
        mermaid.run({ nodes: [codeRef.current] });
        setIsRendered(true);
      } else if (lang === 'katex') {
        katex.render(codeContent, codeRef.current, { throwOnError: false });
        setIsRendered(true);
      }
    }
  }, [lang, codeContent, isRendered]);
  
  if (lang === 'mermaid' || lang === 'katex') {
    return <code ref={codeRef} className={`language-${lang}`}>{codeContent}</code>;
  }
  
  return <code className={className}>{children}</code>;
};


const Message: React.FC<MessageProps> = ({ message, conversationId, updateMessageFeedback }) => {
    const { language, t } = useLanguage();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const isUser = message.role === MessageRole.User;
    const suggestionKeyword = t('suggestionKeyword');

    useEffect(() => {
        mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    }, []);

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.lang = language === 'ar' ? 'ar-SA' : 'fr-FR';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    return (
        <div className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && <AssistantAvatar />}
            <div 
                className={`max-w-2xl p-4 rounded-2xl relative group ${isUser ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                {message.attachment?.type === 'image' && (
                  <img src={message.attachment.previewUrl!} alt="User upload preview" className="mb-2 rounded-lg max-w-full h-auto" style={{maxHeight: '300px'}} />
                )}
                {message.attachment?.type === 'document' && (
                    <DocumentCard name={message.attachment.name} />
                )}
                
                {message.quiz ? (
                    <Quiz quizData={message.quiz} />
                ) : message.content && (
                  <div className="prose prose-slate max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                        p: ({node, children, ...props}) => {
                             const textContent = React.Children.toArray(children).join('');
                             if(textContent.includes(suggestionKeyword)){
                                 return <div className="mt-3 pt-3 border-t border-gray-200/80"><p className="text-sm font-semibold text-indigo-700" {...props}>{children}</p></div>
                             }
                             return <p className={isUser ? 'text-white' : ''} {...props}>{children}</p>
                        },
                        code: CodeBlock,
                        strong: ({node, ...props}) => <strong className={isUser ? 'text-white' : ''} {...props} />,
                        em: ({node, ...props}) => <em className={isUser ? 'text-white' : ''} {...props} />,
                        h1: ({node, ...props}) => <h1 className={isUser ? 'text-white' : ''} {...props} />,
                        h2: ({node, ...props}) => <h2 className={isUser ? 'text-white' : ''} {...props} />,
                        h3: ({node, ...props}) => <h3 className={isUser ? 'text-white' : ''} {...props} />,
                        li: ({node, ...props}) => <li className={isUser ? 'text-white' : ''} {...props} />,
                      }}>
                          {message.content}
                      </ReactMarkdown>
                  </div>
                )}
                
                {!isUser && (message.content || message.quiz) && (
                  <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateMessageFeedback(conversationId, message.id, FeedbackState.Liked)}
                      className={`p-1 rounded-full hover:bg-gray-200 ${message.feedback === FeedbackState.Liked ? 'text-indigo-600' : 'text-gray-400'}`}
                      aria-label="Like response"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.226l-1.396-4.188A1 1 0 0012.382 11H9V6.5a1.5 1.5 0 00-3 0v3.833z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => updateMessageFeedback(conversationId, message.id, FeedbackState.Disliked)}
                      className={`p-1 rounded-full hover:bg-gray-200 ${message.feedback === FeedbackState.Disliked ? 'text-red-500' : 'text-gray-400'}`}
                      aria-label="Dislike response"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                         <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.242a1 1 0 00-.97 1.226l1.396 4.188A1 1 0 007.618 9H11v4.5a1.5 1.5 0 003 0V9.667z" />
                      </svg>
                    </button>
                  </div>
                )}

                {!isUser && message.content && (
                    <button 
                        onClick={handleSpeak}
                        className="absolute top-2.5 end-2.5 bg-black/5 text-gray-600 rounded-full p-1.5 hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={t('speakLabel')}
                    >
                         {isSpeaking ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                         ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6v1.454a6.013 6.013 0 00-1.5 3.933.5.5 0 00.5.515h14a.5.5 0 00.5-.515A6.013 6.013 0 0016 9.454V8a6 6 0 00-6-6zM3.5 15.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z" />
                            </svg>
                         )}
                    </button>
                )}
            </div>
             {isUser && <UserAvatar />}
        </div>
    );
};

export default Message;