import fs from 'fs/promises';
import path from 'path';

export interface Quote {
    text: string;
    author: string;
}

export const stoicService = {
    async getQuotes(lang: 'en' | 'pt-br' = 'en'): Promise<Quote[]> {
        const filePath = path.join(process.cwd(), `public/content/stoic/quotes-${lang}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data.quotes;
    },

    getDailyQuotes(quotes: Quote[]): Quote[] {
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const start = seed % (quotes.length - 3);
        return quotes.slice(start, start + 3);
    }
};
