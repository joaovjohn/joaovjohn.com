import { getTranslations } from 'next-intl/server';
import ButtonBack from '@/components/ButtonBack';

interface UnderConstructionProps {
    titleKey: string;
}

export default async function UnderConstruction({ titleKey }: UnderConstructionProps) {
    const t = await getTranslations();

    return (
        <div className="min-h-screen bg-page flex flex-col items-center justify-center p-8 gap-8">
            {/* Botão Voltar - canto superior esquerdo */}
            <div className="absolute top-10 left-10 z-20">
                <ButtonBack />
            </div>

            {/* Conteúdo central */}
            <div className="text-center max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-cor-1 mb-4">
                    {t(titleKey)}
                </h1>

                <p className="text-lg text-cor-2">
                    {t('underConstruction')}
                </p>
            </div>
        </div>
    );
}
