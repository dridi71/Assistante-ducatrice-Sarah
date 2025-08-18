import React, { useState } from 'react';
import { QuizData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface QuizProps {
  quizData: QuizData;
}

const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== undefined;
  
  let score = 0;
  if(showResults) {
      quizData.questions.forEach((q, index) => {
          if(selectedAnswers[index] === q.correctAnswer) {
              score++;
          }
      });
  }

  if (showResults) {
    return (
      <div className="p-4 bg-white rounded-lg text-slate-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h3 className="text-lg font-bold mb-2">{t('quizResults')}</h3>
        <p className="text-xl font-bold mb-4">{t('quizScore')}: {score} / {quizData.questions.length}</p>
        <div className="space-y-4 max-h-60 overflow-y-auto pe-2">
          {quizData.questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.correctAnswer;
            return (
              <div key={index} className={`p-3 rounded-md ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-l-4`}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <p className={`mt-1 text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? `${t('quizCorrect')} ` : `${t('quizIncorrect')} `}
                    {t('quizExplanation')} {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
        <button onClick={handleRestart} className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            {t('quizRestart')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 text-slate-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold mb-1">{quizData.title}</h3>
      <p className="text-sm text-slate-600 mb-4">{t('quizQuestion')} {currentQuestionIndex + 1}/{quizData.questions.length}</p>
      
      <p className="font-semibold mb-4">{currentQuestion.question}</p>
      
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = currentQuestion.correctAnswer === option;
          let buttonClass = 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700';
          if (isAnswered) {
              if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-200 border-red-400 text-red-800';
              } else if (isCorrect) {
                  buttonClass = 'bg-green-200 border-green-400 text-green-800';
              }
          } else if (isSelected) {
              buttonClass = 'bg-indigo-200 border-indigo-400 text-indigo-800';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full text-start p-3 border rounded-lg transition-colors text-sm ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      
      {isAnswered && (
          <div className="mt-3 p-2 bg-slate-50 rounded-md">
              <p className={`font-semibold text-sm ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? t('quizCorrect') : t('quizIncorrect')}
              </p>
              <p className="text-xs text-slate-600 mt-1">{currentQuestion.explanation}</p>
          </div>
      )}

      <button
        onClick={handleNext}
        disabled={!isAnswered}
        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
      >
        {currentQuestionIndex < quizData.questions.length - 1 ? t('quizNext') : t('quizResults')}
      </button>
    </div>
  );
};

export default Quiz;