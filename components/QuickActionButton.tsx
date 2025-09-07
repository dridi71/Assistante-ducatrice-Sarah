import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuickActionButtonProps {
    onSend: (message: string) => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ onSend }) => {
  const { t } = useLanguage();

  const actions = [
    { icon: '🔍', title: t('actionSolveTitle'), prompt: t('actionSolvePrompt') },
    { icon: '✏️', title: t('actionGenerateTitle'), prompt: t('actionGeneratePrompt') },
    { icon: '🎓', title: t('actionCreateTitle'), prompt: t('actionCreatePrompt') },
    { icon: '🧐', title: t('actionQuizTitle'), prompt: t('actionQuizPrompt') },
  ];

  return (
    <div className='max-w-xl mx-auto'>
        <p className="text-center text-gray-600 mb-6">{t('quickActionsTitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map(action => (
            <button 
                key={action.title} 
                onClick={() => onSend(action.prompt)}
                className="text-start p-5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
            >
                <div className="flex items-center gap-4">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                        <p className="font-semibold text-gray-800">{action.title}</p>
                        <p className="text-sm text-gray-500">{action.prompt}...</p>
                    </div>
                </div>
            </button>
        ))}
        </div>
    </div>
  );
};

export default QuickActionButton;