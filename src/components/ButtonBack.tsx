'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import ButtonDefault from '@/components/ButtonDefault';

export default function ButtonBack() {
    const router = useRouter();
    const t = useTranslations();

    const handleClick = () => {
        router.push('/');
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
