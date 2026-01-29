import { cn } from '@/lib/utils';

interface DesignElement {
    id: string;
    type: 'image' | 'text';
    content: string;
    x: number; // 0 to 100
    y: number; // 0 to 100
    scale: number;
    rotate: number;
    side: 'front' | 'back';
    fontFamily?: string;
    color?: string;
}

interface CustomHoodieThumbnailProps {
    colorHex: string;
    frontImage?: string;
    backImage?: string;
    designState?: DesignElement[];
    className?: string;
    showBack?: boolean;
}

export function CustomHoodieThumbnail({
    colorHex,
    frontImage,
    backImage,
    designState = [],
    className,
    showBack = false
}: CustomHoodieThumbnailProps) {
    const activeSide = showBack ? 'back' : 'front';
    const activeDesigns = designState.filter(d => d.side === activeSide);

    return (
        <div className={cn("relative w-full aspect-square bg-black/5 rounded-sm overflow-hidden flex items-center justify-center", className)}>
            <div
                className="w-full h-full flex items-center justify-center relative p-[8%] transition-colors duration-500"
                style={{ color: colorHex }}
            >
                {/* Hoodie Shape SVG - Using Cropped ViewBox for Centering */}
                <svg
                    viewBox="0 25 200 215"
                    className="w-full h-full drop-shadow-2xl"
                >
                    <defs>
                        <linearGradient id="thumb-fabric-shade-v6" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="black" stopOpacity="0" />
                            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Main Body Shape */}
                    <path
                        d="M40,65 C25,65 15,75 5,120 L25,145 L40,125 L40,230 C40,235 45,240 50,240 L150,240 C155,240 160,235 160,230 L160,125 L175,145 L195,120 C185,75 175,65 160,65 L140,70 L60,70 L40,65 Z"
                        fill="currentColor"
                    />
                    <path
                        d="M40,65 C25,65 15,75 5,120 L25,145 L40,125 L40,230 C40,235 45,240 50,240 L150,240 C155,240 160,235 160,230 L160,125 L175,145 L195,120 C185,75 175,65 160,65 L140,70 L60,70 L40,65 Z"
                        fill="url(#thumb-fabric-shade-v6)"
                    />

                    {!showBack ? (
                        <>
                            <path d="M60,70 C60,25 140,25 140,70 C140,85 125,95 100,95 C75,95 60,85 60,70 Z" fill="black" fillOpacity="0.15" />
                            <path d="M55,160 C55,155 60,150 65,150 L135,150 C140,150 145,155 145,160 L155,210 C155,215 150,220 145,220 L55,220 C50,220 45,215 45,210 L55,160 Z" fill="black" fillOpacity="0.08" />
                        </>
                    ) : (
                        <path d="M50,70 C50,20 150,20 150,70 C150,110 130,140 100,140 C70,140 50,110 50,70 Z" fill="black" fillOpacity="0.15" />
                    )}
                </svg>

                {/* Overlaid Design Area (Synchronized with Studio) */}
                <div className="absolute inset-[8%] flex items-center justify-center pointer-events-none" style={{ containerType: 'size' }}>
                    <div className="relative w-full h-full">
                        {activeDesigns.map((design) => (
                            <div
                                key={design.id}
                                style={{
                                    position: 'absolute',
                                    left: `${Math.max(0, Math.min(100, design.x))}%`,
                                    top: `${Math.max(0, Math.min(100, design.y))}%`,
                                    transform: `translate(-50%, -50%) scale(${design.scale}) rotate(${design.rotate}deg)`,
                                    zIndex: 10
                                }}
                            >
                                {design.type === 'image' ? (
                                    <img
                                        src={design.content}
                                        className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
                                        alt=""
                                    />
                                ) : (
                                    <div
                                        className={cn("whitespace-nowrap font-black tracking-tighter drop-shadow-2xl select-none", design.fontFamily)}
                                        style={{ color: design.color, fontSize: '15cqw', lineHeight: 1 }}
                                    >
                                        {design.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
