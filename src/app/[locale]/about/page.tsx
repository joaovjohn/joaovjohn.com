import { getTranslations } from 'next-intl/server';
import ButtonDefault from '@/components/ButtonDefault';

export default async function AboutPage() {
    const t = await getTranslations();

    return (
        <div className="min-h-screen bg-page p-6">
            <ButtonDefault
                className="mb-6"
            >
                ← {t('back')}
            </ButtonDefault>
            
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-cor-1 mb-8">
                    {t('about')}
                </h1>
            </div>
        </div>
    );
}
