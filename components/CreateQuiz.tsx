import React, { useState, useMemo } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Subject, Level, QuizData } from '../types';
import SelectInput from './common/SelectInput';
import TextInput from './common/TextInput';
import Button from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';

interface CreateQuizProps {
  onQuizCreated: (quizData: QuizData, title: string) => void;
}

const CreateQuiz: React.FC<CreateQuizProps> = ({ onQuizCreated }) => {
  const { language, t } = useLanguage();
  const { documents } = useCorpus();
  const [subject, setSubject] = useState<Subject>(Subject.Maths);
  const [level, setLevel] = useState<Level>(Level.M7);
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjectOptions = useMemo(() =>
    Object.values(Subject).map(key => ({ value: key, label: t(`subject${key}`) })),
    [t]
  );

  const levelOptions = useMemo(() =>
    Object.values(Level).map(key => ({ value: key, label: t(`level${key}`) })),
    [t]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError(t('errorEnterQuizTopic'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const subjectLabel = t(`subject${subject}`);
      const levelLabel = t(`level${level}`);
      const fullTopic = `${subjectLabel}: ${topic}`;
      const corpusContent = documents.length > 0
        ? documents.map(doc => `--- Document : ${doc.name} ---\n${doc.content}`).join('\n\n')
        : undefined;
        
      const quizData = await generateQuiz(fullTopic, levelLabel, parseInt(numQuestions, 10), language, corpusContent);
      
      const conversationTitle = language === 'ar' 
        ? `اختبار عن ${topic}`
        : `Quiz sur ${topic}`;

      onQuizCreated(quizData, conversationTitle);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto h-full overflow-y-auto bg-white">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">{t('createQuizTitle')}</h2>
      <p className="text-gray-600 mb-8">{t('createQuizDescription')}</p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label={t('subjectLabel')}
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            options={subjectOptions}
          />
          <SelectInput
            label={t('levelLabel')}
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            options={levelOptions}
          />
        </div>
        <TextInput
          label={t('quizTopicLabel')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('quizTopicPlaceholder')}
        />
        <TextInput
          label={t('numQuestionsLabel')}
          type="number"
          value={numQuestions}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val > 0 && val <= 10) {
                 setNumQuestions(e.target.value);
            } else if (e.target.value === '') {
                 setNumQuestions('');
            }
          }}
          placeholder="Ex: 5"
        />
        <Button type="submit" loading={loading} disabled={loading}>
          {t('generateQuizButton')}
        </Button>
        {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <h3 className="font-bold">{t('errorTitle')}</h3>
                <p>{error}</p>
            </div>
        )}
      </form>
    </div>
  );
};

export default CreateQuiz;