import Image from 'next/image';

interface LoadingScreenProps {
    backgroundSrc: string;
}

export default function LoadingScreen({ backgroundSrc }: LoadingScreenProps) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background - priority para exibição imediata */}
            <div className="fixed inset-0 z-0">
                <Image 
                    src={backgroundSrc}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </div>
            
            {/* Overlay escuro */}
            <div className="fixed inset-0 bg-black/40 z-[1]" />
            
            {/* Personagem correndo - canto inferior esquerdo */}
            <div className="fixed bottom-12 left-24 z-10">
                <Image 
                    src="/img/loading.GIF"
                    alt="Loading..."
                    width={130}
                    height={130}
                    className="mix-blend-screen"
                    unoptimized
                    priority
                />
            </div>
        </div>
    );
}
