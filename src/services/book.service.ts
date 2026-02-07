export interface Book {
    title: string;
    author: string;
    description: string;
    image: string;
    category: string[];
    url: string;
}

export const bookService = {
    async getBooks(lang: 'en' | 'pt-br' = 'pt-br'): Promise<Book[]> {
        const cacheKey = `books-${lang}`;
        
        // Check sessionStorage cache
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }

        const res = await fetch(`/content/book/books-${lang}.json`);
        const data = await res.json();
        const books = data.books || [];
        
        // Cache in sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(cacheKey, JSON.stringify(books));
        }
        
        return books;
    },

    searchBooks(books: Book[], query: string): Book[] {
        if (!query.trim()) return books;
        
        const lowercaseQuery = query.toLowerCase();
        return books.filter(book => 
            book.title.toLowerCase().includes(lowercaseQuery) ||
            book.author.toLowerCase().includes(lowercaseQuery) ||
            book.description.toLowerCase().includes(lowercaseQuery) ||
            book.category.some(cat => cat.toLowerCase().includes(lowercaseQuery))
        );
    },

    filterByCategory(books: Book[], category: string): Book[] {
        if (!category || category === 'all') return books;
        return books.filter(book => book.category.includes(category));
    },

    getCategories(books: Book[]): string[] {
        const categories = new Set<string>();
        books.forEach(book => book.category.forEach(cat => categories.add(cat)));
        return Array.from(categories).sort();
    },

    filterBooks(books: Book[], category: string, query: string): Book[] {
        let filtered = this.filterByCategory(books, category);
        filtered = this.searchBooks(filtered, query);
        return filtered;
    }
};
