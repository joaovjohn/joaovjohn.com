import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ProjectsPage() {
    const t = await getTranslations();

    return (
        <div className="min-h-screen bg-page p-8">
            <Link 
                href="/" 
                className="text-cor-1 hover:underline mb-8 inline-block"
            >
                ← {t('back')}
            </Link>
            
            <h1 className="text-4xl font-bold text-cor-1 mb-4">
                {t('menu.projects')}
            </h1>
            
            <p className="text-cor-2">
                Em breve...
            </p>
        </div>
    );
}
