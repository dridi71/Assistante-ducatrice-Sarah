import { Language, QuizData } from '../types';

// This file is now a secure client-side service.
// It sends requests to our OWN backend endpoint (/api/gemini),
// which then securely communicates with the Google Gemini API.

const API_ENDPOINT = '/api/gemini';

/**
 * A generic function to handle streaming requests to our backend.
 * @param body The request payload to send to the backend.
 * @returns An async generator that yields text chunks from the stream.
 */
async function* postStreamRequest(body: object): AsyncGenerator<string> {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok || !response.body) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            yield decoder.decode(value, { stream: true });
        }
    } catch (error) {
        console.error("API service stream call failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(errorMessage);
    }
}

/**
 * Handles a standard text-based conversation request.
 */
export const solveExerciseStream = (
    prompt: string, 
    language: Language, 
    corpusContent?: string, 
    fileContent?: string
): AsyncGenerator<string> => {
    return postStreamRequest({
        action: 'solve',
        prompt,
        language,
        corpusContent,
        fileContent,
    });
};

/**
 * Handles a request to explain an image.
 */
export const explainImageStream = (
    prompt: string,
    imageBase64: string,
    mimeType: string,
    language: Language,
    corpusContent?: string,
    fileContent?: string,
): AsyncGenerator<string> => {
    return postStreamRequest({
        action: 'explainImage',
        prompt,
        imageBase64,
        mimeType,
        language,
        corpusContent,
        fileContent,
    });
};

/**
 * Handles a request to generate an interactive quiz. This is NOT a streaming function.
 */
export const generateQuiz = async (
    topic: string, 
    level: string, 
    numQuestions: number, 
    language: Language, 
    corpusContent?: string
): Promise<QuizData> => {
     try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generateQuiz',
                prompt: topic,
                level,
                numQuestions,
                language,
                corpusContent,
            }),
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API service quiz generation failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(errorMessage);
    }
};
