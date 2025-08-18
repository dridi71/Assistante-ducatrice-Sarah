import React, { useState, useMemo } from 'react';
import { solveExerciseStream } from '../services/geminiService';
import { Subject, Level, Difficulty } from '../types';
import SelectInput from './common/SelectInput';
import TextInput from './common/TextInput';
import Button from './common/Button';
import ResultDisplay from './common/ResultDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';

const GenerateExercise: React.FC = () => {
  const { language, t } = useLanguage();
  const { documents } = useCorpus();
  const [subject, setSubject] = useState<Subject>(Subject.Maths);
  const [level, setLevel] = useState<Level>(Level.M7);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [topic, setTopic] = useState('');
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

  const difficultyOptions = useMemo(() =>
    Object.values(Difficulty).map(key => ({ value: key, label: t(`difficulty${key}`) })),
    [t]
  );


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError(t('errorEnterTopic'));
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const subjectLabel = t(`subject${subject}`);
      const levelLabel = t(`level${level}`);
      const difficultyLabel = t(`difficulty${difficulty}`);
      const corpusContent = documents.length > 0
        ? documents.map(doc => `--- Document : ${doc.name} ---\n${doc.content}`).join('\n\n')
        : undefined;

      const prompt = language === 'ar'
        ? `أنشئ تمرينًا للمادة: ${subjectLabel}، للمستوى: ${levelLabel}، حول الموضوع: "${topic}"، بمستوى صعوبة: ${difficultyLabel}. يرجى تقديم الحل أيضًا.`
        : `Génère un exercice pour la matière: ${subjectLabel}, niveau: ${levelLabel}, sur le sujet: "${topic}", avec une difficulté: ${difficultyLabel}. Merci de fournir également la solution.`;
      
      const stream = solveExerciseStream(prompt, language, corpusContent);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setResult(fullResponse);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errorTitle'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-800">{t('generateExerciseTitle')}</h2>
      <p className="text-slate-600 mb-6">{t('generateExerciseDescription')}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <SelectInput
            label={t('difficultyLabel')}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={difficultyOptions}
          />
        </div>
        <TextInput
          label={t('exerciseTopicLabel')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('generateExercisePlaceholder')}
        />
        <Button type="submit" loading={loading} disabled={loading}>
          {t('generateExerciseButton')}
        </Button>
      </form>
      <ResultDisplay result={result} loading={loading} error={error} />
    </div>
  );
};

export default GenerateExercise;