export enum Language {
  FR = 'fr',
  AR = 'ar',
}

export enum Feature {
  Solve = 'solve',
  Generate = 'generate',
  Create = 'create',
  ExplainImage = 'explainImage',
  Corpus = 'corpus',
}

export interface CorpusDocument {
  id: string;
  name: string;
  content: string;
}

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

export enum FeedbackState {
  Liked = 'liked',
  Disliked = 'disliked',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface Attachment {
  name: string;
  type: 'image' | 'document';
  previewUrl?: string | null;
  content: string; // Base64 for images, extracted text for docs
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  attachment?: Attachment;
  quiz?: QuizData;
  feedback?: FeedbackState | null;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export enum Subject {
  Maths = 'Maths',
  Arabe = 'Arabe',
  French = 'French',
  Anglais = 'Anglais',
  SVT = 'SVT',
  PhysiqueChimie = 'PhysiqueChimie',
  History = 'History',
  Geography = 'Geography',
  EducationIslamique = 'EducationIslamique',
  EducationCivique = 'EducationCivique',
  Technologie = 'Technologie',
}

export enum Level {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6',
  M7 = 'M7',
  M8 = 'M8',
  M9 = 'M9',
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3',
  S4 = 'S4',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}