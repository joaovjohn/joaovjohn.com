import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';

export interface Book {
    title: string;
    author: string;
    description: string;
    image: string;
    category: string[];
    url: string;
}

const getBooks = cache(async (lang: 'en' | 'pt-br' = 'pt-br'): Promise<Book[]> => {
    const filePath = path.join(process.cwd(), `public/content/book/books-${lang}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.books || [];
});

export const bookService = {
    getBooks,

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
