interface Quote {
  text: string;
  author: string;
}

export const stoicService = {
    async getQuotes(lang: 'en' | 'pt-br' = 'en'): Promise<Quote[]> {
        const res = await fetch(`/content/stoic/quotes-${lang}.json`);
        const data = await res.json();
        return data.quotes;
    },

    getDailyQuotes(quotes: Quote[]): Quote[] {
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const start = seed % (quotes.length - 3);
        return quotes.slice(start, start + 3);
    }
};
