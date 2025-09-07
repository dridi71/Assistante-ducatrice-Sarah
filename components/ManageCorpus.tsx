import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCorpus } from '../hooks/useCorpus';
import TextInput from './common/TextInput';
import TextArea from './common/TextArea';
import Button from './common/Button';

const ManageCorpus: React.FC = () => {
    const { t } = useLanguage();
    const { documents, addDocument, deleteDocument } = useCorpus();
    const [docName, setDocName] = useState('');
    const [docContent, setDocContent] = useState('');
    const [error, setError] = useState('');

    const handleAddDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docName.trim()) {
            setError(t('errorDocumentName'));
            return;
        }
        if (!docContent.trim()) {
            setError(t('errorDocumentContent'));
            return;
        }
        addDocument(docName, docContent);
        setDocName('');
        setDocContent('');
        setError('');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800">{t('corpusTitle')}</h2>
            <p className="text-slate-600 mb-6">{t('corpusDescription')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div>
                    <form onSubmit={handleAddDocument} className="space-y-6 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-slate-700">{t('addDocumentButton')}</h3>
                        <TextInput
                            label={t('documentNameLabel')}
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            placeholder={t('documentNamePlaceholder')}
                        />
                        <TextArea
                            label={t('documentContentLabel')}
                            value={docContent}
                            onChange={(e) => setDocContent(e.target.value)}
                            placeholder={t('documentContentPlaceholder')}
                            rows={10}
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" loading={false} disabled={false}>
                            {t('addDocumentButton')}
                        </Button>
                    </form>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700">Documents existants</h3>
                    {documents.length > 0 ? (
                        <div className="max-h-[500px] overflow-y-auto space-y-3 pe-2">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex justify-between items-start">
                                    <div className="w-full overflow-hidden">
                                        <p className="font-semibold text-indigo-700 truncate">{doc.name}</p>
                                        <p className="text-sm text-slate-500 mt-1 truncate">{doc.content}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteDocument(doc.id)}
                                        className="ms-4 p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                                        aria-label={t('deleteDocumentLabel')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg">
                            <p className="text-slate-500">{t('corpusEmptyState')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCorpus;
