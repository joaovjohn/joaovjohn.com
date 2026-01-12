'use client';

import ButtonDefault from '@/components/ButtonDefault';

export default function ButtonExample() {
    return (
        <div className="min-h-screen bg-page flex items-center justify-center p-8">
            <div className="flex flex-col gap-12 items-start">
                <ButtonDefault onClick={() => alert('Button 1 clicked!')}>
                    Click Me
                </ButtonDefault>

                <ButtonDefault onClick={() => console.log('Button 2 clicked')}>
                    Another Button
                </ButtonDefault>

                <ButtonDefault onClick={() => alert('Long text button')}>
                    Button With Longer Text
                </ButtonDefault>

                <ButtonDefault disabled>
                    Disabled Button
                </ButtonDefault>
            </div>
        </div>
    );
}
