import React, { useState, useMemo } from 'react';
import { solveExerciseStream } from '../services/geminiService';
import { Subject, Level } from '../types';
import SelectInput from './common/SelectInput';
import TextInput from './common/TextInput';
import Button from './common/Button';
import ResultDisplay from './common/ResultDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';

const CreateCourse: React.FC = () => {
  const { language, t } = useLanguage();
  const { documents } = useCorpus();
  const [subject, setSubject] = useState<Subject>(Subject.History);
  const [level, setLevel] = useState<Level>(Level.M7);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('45');
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
    if (!topic.trim()) {
      setError(t('errorEnterCourseTopic'));
      return;
    }
    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      setError(t('errorEnterValidDuration'));
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
        
      const prompt = language === 'ar'
        ? `أنشئ خطة درس للمادة: ${subjectLabel}، للمستوى: ${levelLabel}، حول الموضوع: "${topic}"، لمدة ${duration} دقيقة.`
        : `Crée un plan de cours pour la matière: ${subjectLabel}, niveau: ${levelLabel}, sur le sujet: "${topic}", pour une durée de ${duration} minutes.`;

      const stream = solveExerciseStream(prompt, language, corpusContent);
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
      <h2 className="text-xl font-bold mb-4 text-slate-800">{t('createCourseTitle')}</h2>
      <p className="text-slate-600 mb-6">{t('createCourseDescription')}</p>
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
        <TextInput
          label={t('courseTopicLabel')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('createCoursePlaceholder')}
        />
        <TextInput
          label={t('courseDurationLabel')}
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ex: 45"
        />
        <Button type="submit" loading={loading} disabled={loading}>
          {t('createCourseButton')}
        </Button>
      </form>
      <ResultDisplay result={result} loading={loading} error={error} />
    </div>
  );
};

export default CreateCourse;