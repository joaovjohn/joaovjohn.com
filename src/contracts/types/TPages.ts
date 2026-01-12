export type TPage = 'menu' | 'home' | 'about' | 'resume' | 'projects' | 'stoic' | 'contact';

export const pages: { [key in TPage]: key } = {
    menu: 'menu',
    home: 'home',
    about: 'about',
    resume: 'resume',
    projects: 'projects',
    stoic: 'stoic',
    contact: 'contact',
};