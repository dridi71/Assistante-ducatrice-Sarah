import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { Attachment } from '../types';

// Set worker path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs`;


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const extractTextFromTxt = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ');
    }
    return textContent;
};

const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const extractTextFromXlsx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let fullText = '';
    workbook.SheetNames.forEach(sheetName => {
        fullText += `\n--- Sheet: ${sheetName} ---\n`;
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 0) {
            // Simple markdown table conversion
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];
            fullText += `| ${headers.join(' | ')} |\n`;
            fullText += `| ${headers.map(() => '---').join(' | ')} |\n`;
            rows.forEach(row => {
                 fullText += `| ${row.join(' | ')} |\n`;
            });
        }
    });
    return fullText;
};


export const processFile = async (file: File): Promise<Attachment> => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 4MB limit.');
    }

    const fileType = file.type;
    const attachment: Partial<Attachment> = { name: file.name };

    if (['image/png', 'image/jpeg', 'image/webp'].includes(fileType)) {
        const dataUrl = await fileToDataURL(file);
        attachment.type = 'image';
        attachment.previewUrl = dataUrl;
        attachment.content = dataUrl.split(',')[1]; // Base64 content
    } else {
        attachment.type = 'document';
        attachment.previewUrl = null;
        try {
            if (fileType === 'application/pdf') {
                attachment.content = await extractTextFromPdf(file);
            } else if (file.name.endsWith('.docx')) {
                attachment.content = await extractTextFromDocx(file);
            } else if (file.name.endsWith('.xlsx')) {
                attachment.content = await extractTextFromXlsx(file);
            } else if (fileType === 'text/plain') {
                attachment.content = await extractTextFromTxt(file);
            } else {
                throw new Error('Unsupported file format.');
            }
        } catch (error) {
            console.error("Error processing file:", error);
            throw new Error('Failed to read file content.');
        }
    }
    
    if(!attachment.content){
        throw new Error('Could not extract content from the file.');
    }

    return attachment as Attachment;
};