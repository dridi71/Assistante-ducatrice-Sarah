import React, { useState, useMemo } from 'react';
import { explainImageStream } from '../services/geminiService';
import { Subject, Level } from '../types';
import SelectInput from './common/SelectInput';
import TextArea from './common/TextArea';
import Button from './common/Button';
import ResultDisplay from './common/ResultDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const ExplainImage: React.FC = () => {
    const { language, t } = useLanguage();
    const { documents } = useCorpus();
    const [subject, setSubject] = useState<Subject>(Subject.Maths);
    const [level, setLevel] = useState<Level>(Level.M7);
    const [question, setQuestion] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const subjectOptions = useMemo(() =>
        Object.values(Subject).map(key => ({ value: key, label: t(`subject${key}`) })),
        [t]
    );

    const levelOptions = useMemo(() =>
        Object.values(Level).map(key => ({ value: key, label: t(`level${key}`) })),
        [t]
    );

    const processFile = (file: File | undefined) => {
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError(t('errorImageSize'));
                return;
            }
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
                setError(t('errorImageFormat'));
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFile(e.target.files?.[0]);
        e.target.value = ''; // Reset input to allow re-uploading the same file
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFile(e.dataTransfer.files?.[0]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            setError(t('errorUploadImage'));
            return;
        }
        if (!question.trim()) {
            setError(t('errorEnterQuestionOnImage'));
            return;
        }
        setError('');
        setLoading(true);
        setResult('');
        try {
            const imageBase64 = await fileToBase64(imageFile);
            const subjectLabel = t(`subject${subject}`);
            const levelLabel = t(`level${level}`);
            const corpusContent = documents.length > 0
                ? documents.map(doc => `--- Document : ${doc.name} ---\n${doc.content}`).join('\n\n')
                : undefined;
            
            const fullQuestion = language === 'ar'
                ? `المادة: ${subjectLabel}\nالمستوى: ${levelLabel}\n\n${question}`
                : `Matière: ${subjectLabel}\nNiveau: ${levelLabel}\n\n${question}`;

            const stream = explainImageStream(fullQuestion, imageBase64, imageFile.type, language, corpusContent);
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
            <h2 className="text-xl font-bold mb-4 text-slate-800">{t('explainImageTitle')}</h2>
            <p className="text-slate-600 mb-6">{t('explainImageDescription')}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {imagePreview ? (
                    <div className="relative group">
                        <img src={imagePreview} alt={t('imagePreviewAlt')} className="w-full rounded-lg max-h-80 object-contain border border-slate-300 bg-slate-50" />
                        <button 
                            type="button" 
                            onClick={removeImage} 
                            className="absolute top-2 end-2 bg-slate-800/60 text-white rounded-full p-1.5 hover:bg-slate-900/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label={t('removeImageLabel')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('exerciseImageLabel')}</label>
                        <div 
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-slate-300'} border-dashed rounded-md transition-colors`}
                        >
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-slate-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>{t('uploadFile')}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                                </label>
                                <p className="ps-1">{t('dragAndDrop')}</p>
                                </div>
                                <p className="text-xs text-slate-500">{t('imageFormatHint')}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                    label={t('questionOnImageLabel')}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('explainImagePlaceholder')}
                    rows={3}
                />
                <Button type="submit" loading={loading} disabled={loading || !imageFile}>
                    {t('getExplanationButton')}
                </Button>
            </form>
            <ResultDisplay result={result} loading={loading} error={error} />
        </div>
    );
};

export default ExplainImage;