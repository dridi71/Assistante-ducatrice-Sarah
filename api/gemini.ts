// Copyright (c) 2024 Mohamed Dridi. All rights reserved.

import { GoogleGenAI, Type } from "@google/genai";

// This file acts as a secure backend endpoint.
// It should be deployed as a serverless function (e.g., on Vercel, Netlify).

// Configure the function to run on the Edge runtime for streaming support
export const config = {
  runtime: 'edge',
};

// Initialize the Google AI client with the API key from server-side environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const model = 'gemini-2.5-flash';

// Define a type for the expected request body from the frontend
interface ApiRequest {
    action: 'solve' | 'explainImage' | 'generateQuiz';
    language: 'fr' | 'ar';
    prompt: string;
    corpusContent?: string;
    fileContent?: string;
    // For image explanation
    imageBase64?: string;
    mimeType?: string;
    // For quizzes
    level?: string;
    numQuestions?: number;
}


// Reusable prompt generation logic, now living securely on the backend
const getBasePrompt = (language: 'fr' | 'ar', corpusContent?: string, fileContent?: string) => {
    const isArabic = language === 'ar';

    const corpusInstruction = corpusContent
        ? isArabic
            ? `**سياق صارم (قاعدة المعرفة):** يجب أن تبني إجابتك **حصريًا** على الوثائق التالية المقدمة من وزارة التربية التونسية. لا تستشر أي مصدر آخر.\n\n--- بداية الوثائق ---\n${corpusContent}\n--- نهاية الوثائق ---\n\n`
            : `**CONTEXTE STRICT (Base de Connaissances):** Tu DOIS baser ta réponse EXCLUSIVEMENT sur les documents suivants fournis par le Ministère de l'Éducation Tunisien. Ne consulte aucune autre source.\n\n--- DÉBUT DES DOCUMENTS ---\n${corpusContent}\n--- FIN DES DOCUMENTS ---\n\n`
        : '';
    
    const fileInstruction = fileContent
        ? isArabic
            ? `**محتوى الملف المرفق:** لقد أرفق المستخدم ملفًا. يجب أن تستخدم محتواه كمصدر أساسي للحقيقة للإجابة على سؤاله.\n\n--- بداية محتوى الملف ---\n${fileContent}\n--- نهاية محتوى الملف ---\n\n`
            : `**CONTENU DU FICHIER JOINT :** L'utilisateur a joint un fichier. Tu dois utiliser son contenu comme source de vérité principale pour répondre à sa question.\n\n--- DÉBUT CONTENU FICHIER ---\n${fileContent}\n--- FIN CONTENU FICHIER ---\n\n`
        : '';

    const persona = isArabic
        ? `أنتِ سارة، مساعدة تعليمية خبيرة متخصصة في **النظام التعليمي التونسي**. أنتِ أيضًا سباقة. إذا لاحظتِ فجوة في معرفة الطالب، اقترحي بلطف سؤال متابعة أو اختبارًا قصيرًا لمساعدته على التحسن. ابدئي اقتراحاتك بـ '**اقتراح:**'.
        يجب أن تكون جميع إجاباتك وأمثلتك وتوضيحاتك متوافقة مع **البرنامج الرسمي التونسي** للمستوى المحدد.
        عندما تطلب منك إنشاء رسم بياني، استخدم صيغة Mermaid.js في كتلة تعليمات برمجية \`\`\`mermaid.
        عندما تكتب معادلات كيميائية أو رياضية، استخدم صيغة KaTeX (محاطة بـ $ أو $$).`
        : `Tu es Sarah, une tutrice IA experte, spécialisée dans le **système éducatif tunisien**. Tu es également proactive. Si tu remarques une lacune dans les connaissances de l'élève, suggère poliment une question de suivi ou un petit quiz pour l'aider à s'améliorer. Commence tes suggestions par '**Suggestion :**'.
        Toutes tes réponses, exemples et explications doivent être conformes au **programme officiel tunisien** pour le niveau spécifié.
        Lorsque l'on te demande de créer un diagramme, génère la syntaxe Mermaid.js dans un bloc de code \`\`\`mermaid.
        Lorsque tu écris des équations chimiques ou mathématiques, utilise la syntaxe KaTeX (entourée par $ ou $$).`;

    return `${corpusInstruction}${fileInstruction}${persona}\n\n`;
};


// The main serverless function handler
export async function POST(req: Request) {
    if (!process.env.API_KEY) {
        return new Response('API key not configured on the server.', { status: 500 });
    }
    
    try {
        const body: ApiRequest = await req.json();
        const { action, language, prompt, corpusContent, fileContent } = body;

        const basePrompt = getBasePrompt(language, corpusContent, fileContent);
        let finalPrompt = '';
        let contents: any;

        switch(action) {
            case 'solve':
                finalPrompt = language === 'ar'
                    ? `${basePrompt}سؤال المستخدم: "${prompt}"\n\nالتعليمات: أجب على السؤال أو قم بحل المشكلة خطوة بخطوة بناءً على السياق المقدم.`
                    : `${basePrompt}Question de l'utilisateur: "${prompt}"\n\nInstructions : Réponds à la question ou résous le problème étape par étape en te basant sur le contexte fourni.`;
                contents = finalPrompt;
                break;

            case 'explainImage':
                if (!body.imageBase64 || !body.mimeType) {
                    throw new Error('Image data is missing for explainImage action.');
                }
                finalPrompt = language === 'ar'
                    ? `${basePrompt}قدم المستخدم صورة وسؤالاً.\nسؤال المستخدم: "${prompt}"\n\nالتعليمات: حلل الصورة وأجب على السؤال.`
                    : `${basePrompt}L'utilisateur a fourni une image et une question.\nQuestion de l'utilisateur: "${prompt}"\n\nInstructions : Analyse l'image et réponds à la question.`;
                
                const imagePart = {
                    inlineData: { data: body.imageBase64, mimeType: body.mimeType },
                };
                contents = { parts: [imagePart, { text: finalPrompt }] };
                break;

            case 'generateQuiz':
                 finalPrompt = language === 'ar'
                    ? `${basePrompt}الموضوع: ${prompt}\nالمستوى: ${body.level}\nعدد الأسئلة: ${body.numQuestions}\nالتعليمات: قم بإنشاء اختبار قصير حول الموضوع المحدد، متوافق مع البرنامج التونسي.`
                    : `${basePrompt}Sujet : ${prompt}\nNiveau : ${body.level}\nNombre de questions : ${body.numQuestions}\nInstructions : Crée un quiz court sur le sujet spécifié, conforme au programme tunisien.`;
                
                const quizSchema = {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correctAnswer: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                },
                                required: ['question', 'options', 'correctAnswer', 'explanation'],
                            },
                        },
                    },
                    required: ['title', 'questions'],
                };

                const response = await ai.models.generateContent({
                    model: model,
                    contents: finalPrompt,
                    config: { responseMimeType: 'application/json', responseSchema: quizSchema }
                });

                return new Response(response.text, {
                    headers: { 'Content-Type': 'application/json' },
                });

            default:
                throw new Error('Invalid action specified.');
        }
        
        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: contents,
        });

        // Pipe the stream from Gemini API to the client
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of responseStream) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}