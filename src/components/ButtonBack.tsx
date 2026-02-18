'use client';

import { useTranslations } from 'next-intl';
import ButtonDefault from '@/components/ButtonDefault';
import { useNavigationLoader } from '@/contexts/NavigationLoaderContext';

export default function ButtonBack() {
    const { navigateTo } = useNavigationLoader();
    const t = useTranslations();

    const handleClick = () => {
        navigateTo('/');
    };

    return (
        <ButtonDefault
            size="md"
            variant="back"
            onClick={handleClick}
            aria-label={t('back')}
        >
            {t('back')}
        </ButtonDefault>
    );
}
