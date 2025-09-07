import { Language } from './types';

type Translations = {
  [key: string]: { [lang in Language]: string };
};

export const translations: Translations = {
  // App General
  appTitle: {
    fr: 'Assistante Éducatrice Sarah',
    ar: 'المساعدة التعليمية سارة',
  },
  copyright: {
    fr: '© 2024 Mohamed Dridi. Tous droits réservés.',
    ar: '© 2024 محمد دريدي. جميع الحقوق محفوظة.',
  },
  
  // Welcome Screen
  welcomeTitle: {
    fr: 'Bienvenue sur Sarah !',
    ar: 'مرحباً بك في سارة!',
  },
  welcomeMessage: {
    fr: 'Votre assistante éducative personnelle. Commencez une nouvelle conversation pour explorer.',
    ar: 'مساعدتك التعليمية الشخصية. ابدأ محادثة جديدة للاستكشاف.',
  },
  startConversationButton: {
    fr: 'Commencer une nouvelle conversation',
    ar: 'ابدأ محادثة جديدة',
  },

  // Chat Interface
  chatPlaceholder: {
    fr: 'Posez une question à Sarah...',
    ar: 'اطرح سؤالاً على سارة...',
  },
  sendMessageLabel: {
    fr: 'Envoyer le message',
    ar: 'إرسال الرسالة',
  },
  quickActionsTitle: {
    fr: 'Ou commencez avec une action rapide :',
    ar: 'أو ابدأ بإجراء سريع:',
  },
  attachFileLabel: {
    fr: 'Attacher un fichier',
    ar: 'إرفاق ملف',
  },
  removeFileLabel: {
    fr: 'Supprimer le fichier',
    ar: 'إزالة الملف',
  },
  speakLabel: {
    fr: 'Lire la réponse',
    ar: 'قراءة الإجابة',
  },
  dictateLabel: {
      fr: "Dicter un message (l'accès au micro a été refusé)",
      ar: "إملاء رسالة (تم رفض الوصول إلى الميكروفون)",
  },
  listening: {
    fr: 'Écoute en cours...',
    ar: 'الاستماع جاري...',
  },
  fileCardTitle: {
    fr: 'Fichier joint',
    ar: 'ملف مرفق',
  },

  // Quick Actions
  actionSolveTitle: { fr: 'Résoudre un Exercice', ar: 'حل تمرين' },
  actionSolvePrompt: { fr: "J'ai besoin d'aide pour résoudre un exercice", ar: 'أحتاج مساعدة في حل تمرين' },
  actionGenerateTitle: { fr: 'Générer un Exercice', ar: 'إنشاء تمرين' },
  actionGeneratePrompt: { fr: 'Peux-tu me générer un exercice', ar: 'هل يمكنك إنشاء تمرين' },
  actionCreateTitle: { fr: 'Créer un Cours', ar: 'إنشاء درس' },
  actionCreatePrompt: { fr: 'Je voudrais un plan de cours sur', ar: 'أريد خطة درس حول' },
  actionExplainTitle: { fr: 'Expliquer une Image', ar: 'شرح صورة' },
  actionExplainPrompt: { fr: "Voici une image, peux-tu m'expliquer", ar: 'هذه صورة، هل يمكنك أن تشرح لي' },
  actionQuizTitle: { fr: 'Générer un Quiz', ar: 'إنشاء اختبار' },
  actionQuizPrompt: { fr: 'Crée-moi un quiz sur', ar: 'أنشئ لي اختبارًا حول' },

  // History Sidebar
  newChatButton: { fr: 'Nouvelle Conversation', ar: 'محادثة جديدة' },
  historyTitle: { fr: 'Historique', ar: 'سجل المحادثات' },
  deleteConversationLabel: { fr: 'Supprimer la conversation', ar: 'حذف المحادثة' },
  renameConversationLabel: { fr: 'Renommer la conversation', ar: 'إعادة تسمية المحادثة' },
  confirmRename: { fr: 'Confirmer', ar: 'تأكيد' },
  cancelRename: { fr: 'Annuler', ar: 'إلغاء' },
  defaultConversationTitle: { fr: 'Nouvelle Conversation', ar: 'محادثة جديدة' },
  manageCorpusButton: { fr: 'Base de Connaissances', ar: 'قاعدة المعرفة' },
  createQuizButton: { fr: 'Créer un Quiz', ar: 'إنشاء اختبار' },
  
  // Search
  searchPlaceholder: { fr: 'Rechercher dans les chats et documents...', ar: 'ابحث في المحادثات والمستندات...' },
  searchResultsTitle: { fr: 'Résultats de recherche pour', ar: 'نتائج البحث عن' },
  conversationsSection: { fr: 'Conversations', ar: 'المحادثات' },
  corpusSection: { fr: 'Base de Connaissances', ar: 'قاعدة المعرفة' },
  noResultsFound: { fr: 'Aucun résultat trouvé.', ar: 'لم يتم العثور على نتائج.' },

  // Corpus
  corpusTitle: { fr: 'Gérer la Base de Connaissances', ar: 'إدارة قاعدة المعرفة' },
  corpusDescription: { fr: "Ajoutez des documents officiels (programmes, manuels...) pour que Sarah base ses réponses exclusivement sur ces sources.", ar: 'أضف وثائق رسمية (برامج، كتب مدرسية...) لكي تبني سارة إجاباتها على هذه المصادر حصراً.' },
  addDocumentButton: { fr: 'Ajouter le document', ar: 'إضافة الوثيقة' },
  documentNameLabel: { fr: 'Nom du document', ar: 'اسم الوثيقة' },
  documentNamePlaceholder: { fr: 'Ex: Programme Maths 7ème, Chapitre 5 Histoire...', ar: 'مثال: برنامج رياضيات سابعة أساسي، الفصل 5 تاريخ...' },
  documentContentLabel: { fr: 'Contenu du document', ar: 'محتوى الوثيقة' },
  documentContentPlaceholder: { fr: 'Copiez-collez ici le contenu du document...', ar: 'انسخ وألصق محتوى الوثيقة هنا...' },
  corpusEmptyState: { fr: 'Votre base de connaissances est vide. Ajoutez un document pour commencer.', ar: 'قاعدة المعرفة فارغة. أضف وثيقة للبدء.' },
  deleteDocumentLabel: { fr: 'Supprimer le document', ar: 'حذف الوثيقة' },
  existingDocuments: { fr: 'Documents existants', ar: 'الوثائق الموجودة' },
  
  // Create Quiz
  createQuizTitle: { fr: 'Générer un Quiz Interactif', ar: 'إنشاء اختبار تفاعلي' },
  createQuizDescription: { fr: 'Sélectionnez une matière, un niveau et un thème pour créer un quiz personnalisé pour les élèves.', ar: 'اختر مادة ومستوى وموضوعًا لإنشاء اختبار مخصص للطلاب.' },
  quizTopicLabel: { fr: 'Thème du quiz', ar: 'موضوع الاختبار' },
  quizTopicPlaceholder: { fr: 'Ex: Les fractions, la révolution tunisienne...', ar: 'مثال: الكسور، الثورة التونسية...' },
  numQuestionsLabel: { fr: 'Nombre de questions', ar: 'عدد الأسئلة' },
  generateQuizButton: { fr: 'Générer le Quiz', ar: 'إنشاء الاختبار' },
  errorEnterQuizTopic: { fr: 'Veuillez entrer un thème pour le quiz.', ar: 'الرجاء إدخال موضوع للاستفتاء.' },
  quizRequestTitle: { fr: 'Demande de quiz', ar: 'طلب اختبار' },

  // Tutorial
  tutorialSkip: { fr: 'Passer', ar: 'تخطّ' },
  tutorialPrev: { fr: 'Précédent', ar: 'السابق' },
  tutorialNext: { fr: 'Suivant', ar: 'التالي' },
  tutorialFinish: { fr: 'Terminer', ar: 'إنهاء' },
  tutorialWelcomeTitle: { fr: 'Bienvenue sur Sarah AI !', ar: 'مرحباً بك في سارة!' },
  tutorialWelcomeDesc: { fr: "Prenons un instant pour découvrir les fonctionnalités principales. C'est très rapide !", ar: 'لنأخذ لحظة لاكتشاف الميزات الرئيسية. الأمر سريع جداً!' },
  tutorialChatTitle: { fr: 'Zone de Conversation', ar: 'منطقة المحادثة' },
  tutorialChatDesc: { fr: "C'est ici que vous interagirez avec Sarah. Posez des questions, attachez des fichiers et obtenez des réponses instantanées.", ar: 'هنا ستتفاعل مع سارة. اطرح الأسئلة، أرفق الملفات، واحصل على إجابات فورية.' },
  tutorialNewChatTitle: { fr: 'Nouvelle Conversation', ar: 'محادثة جديدة' },
  tutorialNewChatDesc: { fr: "Cliquez ici pour démarrer une nouvelle conversation. Toutes vos discussions sont sauvegardées automatiquement.", ar: 'انقر هنا لبدء محادثة جديدة. يتم حفظ جميع مناقشاتك تلقائيًا.' },
  tutorialCorpusTitle: { fr: 'Base de Connaissances', ar: 'قاعدة المعرفة' },
  tutorialCorpusDesc: { fr: 'Ajoutez vos propres documents ici. Sarah utilisera ces informations pour vous fournir des réponses encore plus précises et personnalisées.', ar: 'أضف وثائقك الخاصة هنا. ستستخدم سارة هذه المعلومات لتزويدك بإجابات أكثر دقة وتخصيصًا.' },
  tutorialQuizTitle: { fr: 'Générateur de Quiz', ar: 'مولّد الاختبارات' },
  tutorialQuizDesc: { fr: 'Créez des quiz interactifs pour vos élèves en quelques clics. Idéal pour réviser et évaluer les connaissances.', ar: 'أنشئ اختبارات تفاعلية لطلابك ببضع نقرات. مثالي للمراجعة وتقييم المعرفة.' },
  tutorialLangTitle: { fr: 'Changer de Langue', ar: 'تغيير اللغة' },
  tutorialLangDesc: { fr: "Basculez entre le français et l'arabe à tout moment pour une expérience entièrement localisée.", ar: 'بدّل بين الفرنسية والعربية في أي وقت لتجربة مترجمة بالكامل.' },
  tutorialEndTitle: { fr: "Vous êtes prêt !", ar: 'أنت جاهز!' },
  tutorialEndDesc: { fr: "Vous connaissez maintenant les bases. N'hésitez pas à explorer et à découvrir tout ce que Sarah peut faire pour vous.", ar: 'أنت الآن تعرف الأساسيات. لا تتردد في الاستكشاف واكتشاف كل ما يمكن لسارة أن تقدمه لك.' },


  // Status Messages
  loadingMessage: { fr: "Sarah réfléchit...", ar: "سارة تفكّر..." },
  loadingQuiz: { fr: "Sarah prépare votre quiz...", ar: "سارة تحضّر اختبارك..." },
  processingFile: { fr: 'Analyse du fichier en cours...', ar: 'جاري تحليل الملف...' },
  errorTitle: { fr: 'Une erreur est survenue', ar: 'حدث خطأ' },
  errorDocumentName: { fr: 'Veuillez donner un nom au document.', ar: 'الرجاء إعطاء اسم للوثيقة.' },
  errorDocumentContent: { fr: 'Veuillez ajouter du contenu au document.', ar: 'الرجاء إضافة محتوى للوثيقة.' },
  errorFileSize: { fr: "Le fichier est trop grand (max 4MB).", ar: 'الملف كبير جدًا (الحد الأقصى 4 ميغابايت).' },
  errorFileFormat: { fr: 'Format de fichier non supporté.', ar: 'تنسيق ملف غير مدعوم.' },
  errorFileRead: { fr: "Erreur lors de la lecture du fichier.", ar: 'خطأ أثناء قراءة الملف.' },
  errorSpeechNotAllowed: { fr: "L'accès au microphone a été refusé. Veuillez l'autoriser dans les paramètres de votre navigateur.", ar: "تم رفض الوصول إلى الميكروفون. يرجى السماح به في إعدادات متصفحك." },
  
  // Keywords
  suggestionKeyword: { fr: '**Suggestion :**', ar: '**اقتراح:**' },
  
  // Quiz Component
  quizQuestion: { fr: 'Question', ar: 'السؤال' },
  quizSubmit: { fr: 'Valider mes réponses', ar: 'تأكيد إجاباتي' },
  quizNext: { fr: 'Question suivante', ar: 'السؤال التالي' },
  quizResults: { fr: 'Voir les résultats', ar: 'عرض النتائج' },
  quizScore: { fr: 'Votre score', ar: 'نتيجتك' },
  quizCorrect: { fr: 'Correct !', ar: 'صحيح!' },
  quizIncorrect: { fr: 'Incorrect.', ar: 'خطأ.' },
  quizExplanation: { fr: 'Explication :', ar: 'الشرح:' },
  quizRestart: { fr: 'Recommencer le quiz', ar: 'إعادة الاختبار' },

  // Subjects
  subjectMaths: { fr: 'Mathématiques', ar: 'الرياضيات' },
  subjectArabe: { fr: 'Arabe', ar: 'اللغة العربية' },
  subjectFrench: { fr: 'Français', ar: 'اللغة الفرنسية' },
  subjectAnglais: { fr: 'Anglais', ar: 'اللغة الأنجليزية' },
  subjectSVT: { fr: 'SVT', ar: 'علوم الحياة والأرض' },
  subjectPhysiqueChimie: { fr: 'Sciences Physiques & Chimie', ar: 'الفيزياء و الكيمياء' },
  subjectHistory: { fr: 'Histoire', ar: 'التاريخ' },
  subjectGeography: { fr: 'Géographie', ar: 'الجغرافيا' },
  subjectEducationIslamique: { fr: 'Éducation Islamique', ar: 'التربية الإسلامية' },
  subjectEducationCivique: { fr: 'Éducation Civique', ar: 'التربية المدنية' },
  subjectTechnologie: { fr: 'Technologie', ar: 'التربية التكنولوجية' },

  // Levels
  levelP1: { fr: '1ère Année Primaire', ar: 'السنة الأولى ابتدائي' },
  levelP2: { fr: '2ème Année Primaire', ar: 'السنة الثانية ابتدائي' },
  levelP3: { fr: '3ème Année Primaire', ar: 'السنة الثالثة ابتدائي' },
  levelP4: { fr: '4ème Année Primaire', ar: 'السنة الرابعة ابتدائي' },
  levelP5: { fr: '5ème Année Primaire', ar: 'السنة الخامسة ابتدائي' },
  levelP6: { fr: '6ème Année Primaire', ar: 'السنة السادسة ابتدائي' },
  levelM7: { fr: '7ème Année de Base', ar: 'السنة السابعة أساسي' },
  levelM8: { fr: '8ème Année de Base', ar: 'السنة الثامنة أساسي' },
  levelM9: { fr: '9ème Année de Base', ar: 'السنة التاسعة أساسي' },
  levelS1: { fr: '1ère Année Secondaire', ar: 'السنة الأولى ثانوي' },
  levelS2: { fr: '2ème Année Secondaire', ar: 'السنة الثانية ثانوي' },
  levelS3: { fr: '3ème Année Secondaire', ar: 'السنة الثالثة ثانوي' },
  levelS4: { fr: '4ème Année Secondaire (Bac)', ar: 'السنة الرابعة ثانوي (باكالوريا)' },
  
  // Difficulties
  difficultyEasy: { fr: 'Facile', ar: 'سهل' },
  difficultyMedium: { fr: 'Moyen', ar: 'متوسط' },
  difficultyHard: { fr: 'Difficile', ar: 'صعب' },
};