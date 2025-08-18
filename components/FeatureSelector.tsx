import React from 'react';
import { Feature } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FeatureSelectorProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ activeFeature, setActiveFeature }) => {
  const { t } = useLanguage();
  
  const features = [
    { id: Feature.Solve, label: t('featureSolve'), icon: '🔍' },
    { id: Feature.Generate, label: t('featureGenerate'), icon: '✏️' },
    { id: Feature.Create, label: t('featureCreate'), icon: '🎓' },
    { id: Feature.ExplainImage, label: t('featureExplainImage'), icon: '🖼️' },
    { id: Feature.Corpus, label: t('featureCorpus'), icon: '📚' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => setActiveFeature(feature.id)}
          className={`
            flex items-center justify-center text-center p-3 rounded-lg font-semibold text-sm md:text-base
            transition-all duration-200 ease-in-out transform
            ${
              activeFeature === feature.id
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200'
            }
          `}
        >
          <span className="me-2 text-xl">{feature.icon}</span>
          <span>{feature.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FeatureSelector;