import React, { useState, useMemo } from 'react';
import { solveExerciseStream } from '../services/geminiService';
import { Subject, Level } from '../types';
import SelectInput from './common/SelectInput';
import TextArea from './common/TextArea';
import Button from './common/Button';
import ResultDisplay from './common/ResultDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';

const SolveExercise: React.FC = () => {
  const { language, t } = useLanguage();
  const { documents } = useCorpus();
  const [subject, setSubject] = useState<Subject>(Subject.Maths);
  const [level, setLevel] = useState<Level>(Level.M7);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
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
    if (!question.trim()) {
      setError(t('errorEnterQuestion'));
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const subjectLabel = t(`subject${subject}`);
      const levelLabel = t(`level${level}`);
      const corpusContent = documents.length > 0
        ? documents.map(doc => `--- Document : ${doc.name} ---\n${doc.content}`).join('\n\n')
        : undefined;
      
      const fullQuestion = language === 'ar'
        ? `المادة: ${subjectLabel}\nالمستوى: ${levelLabel}\n\n${question}`
        : `Matière: ${subjectLabel}\nNiveau: ${levelLabel}\n\n${question}`;
      
      const stream = solveExerciseStream(fullQuestion, language, corpusContent);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setResult(fullResponse);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-800">{t('solveExerciseTitle')}</h2>
      <p className="text-slate-600 mb-6">{t('solveExerciseDescription')}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <TextArea
          label={t('questionLabel')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('solveExercisePlaceholder')}
          rows={5}
        />
        <Button type="submit" loading={loading} disabled={loading}>
          {t('getExplanationButton')}
        </Button>
      </form>
      <ResultDisplay result={result} loading={loading} error={error} />
    </div>
  );
};

export default SolveExercise;