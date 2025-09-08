import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TutorialProps {
    onFinish: () => void;
}

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const Tutorial: React.FC<TutorialProps> = ({ onFinish }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [highlightedRect, setHighlightedRect] = useState<Rect | null>(null);

    const tutorialSteps = useMemo(() => [
        { selector: null, title: 'tutorialWelcomeTitle', description: 'tutorialWelcomeDesc' },
        { selector: '[data-tutorial-id="main-chat-area"]', title: 'tutorialChatTitle', description: 'tutorialChatDesc' },
        { selector: '[data-tutorial-id="new-chat"]', title: 'tutorialNewChatTitle', description: 'tutorialNewChatDesc' },
        { selector: '[data-tutorial-id="manage-corpus"]', title: 'tutorialCorpusTitle', description: 'tutorialCorpusDesc' },
        { selector: '[data-tutorial-id="create-quiz"]', title: 'tutorialQuizTitle', description: 'tutorialQuizDesc' },
        { selector: '[data-tutorial-id="lang-switcher"]', title: 'tutorialLangTitle', description: 'tutorialLangDesc' },
        { selector: null, title: 'tutorialEndTitle', description: 'tutorialEndDesc' },
    ], [t]);
    
    useEffect(() => {
        const { selector } = tutorialSteps[step];
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setHighlightedRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                });
            } else {
                 setHighlightedRect(null);
            }
        } else {
            setHighlightedRect(null);
        }
    }, [step, tutorialSteps]);

    const handleNext = () => {
        if (step < tutorialSteps.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };
    
    const isFirstStep = step === 0;
    const isLastStep = step === tutorialSteps.length - 1;
    const currentStepData = tutorialSteps[step];
    
    const textBoxStyle: React.CSSProperties = {};
    if (highlightedRect) {
         if (highlightedRect.top > window.innerHeight / 2) {
             textBoxStyle.bottom = `${window.innerHeight - highlightedRect.top + 16}px`;
         } else {
             textBoxStyle.top = `${highlightedRect.top + highlightedRect.height + 16}px`;
         }
         textBoxStyle.left = `${highlightedRect.left}px`;
         textBoxStyle.maxWidth = `320px`;

    } else {
        // Center for welcome/end screens
        textBoxStyle.top = '50%';
        textBoxStyle.left = '50%';
        textBoxStyle.transform = 'translate(-50%, -50%)';
    }


    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            {/* Highlighter */}
            {highlightedRect && (
                <div
                    className="absolute bg-transparent rounded-lg border-2 border-white shadow-2xl transition-all duration-300"
                    style={{
                        top: highlightedRect.top - 4,
                        left: highlightedRect.left - 4,
                        width: highlightedRect.width + 8,
                        height: highlightedRect.height + 8,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                    }}
                ></div>
            )}
            
            {/* Text Box */}
            <div
                className="absolute bg-white p-6 rounded-lg shadow-xl w-80 transition-all duration-300"
                style={textBoxStyle}
            >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(currentStepData.title)}</h3>
                <p className="text-gray-600 text-sm mb-6">{t(currentStepData.description)}</p>

                <div className="flex justify-between items-center">
                    <button onClick={onFinish} className="text-sm font-medium text-gray-500 hover:text-gray-800">
                        {t('tutorialSkip')}
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {!isFirstStep && (
                            <button onClick={handlePrev} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                {t('tutorialPrev')}
                            </button>
                        )}
                        <button onClick={handleNext} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            {isLastStep ? t('tutorialFinish') : t('tutorialNext')}
                        </button>
                    </div>
                </div>
                 <div className="flex justify-center gap-2 mt-5">
                    {tutorialSteps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full ${index === step ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tutorial;