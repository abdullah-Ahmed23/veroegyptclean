import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Upload, Trash2, Check, ArrowRight, Info, AlertTriangle, Plus, Type, Maximize2, RotateCw, Layers, Edit3, Move } from 'lucide-react';
import { useUIStore, useCartStore, formatPrice } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const COLORS = [
    { id: 'black', nameKey: 'customStudio.colors.black', hex: '#000000' },
    { id: 'darkTeal', nameKey: 'customStudio.colors.darkTeal', hex: '#045D5D' },
    { id: 'offWhite', nameKey: 'customStudio.colors.offWhite', hex: '#FAF9F6' },
    { id: 'white', nameKey: 'customStudio.colors.white', hex: '#FFFFFF' },
    { id: 'lightRose', nameKey: 'customStudio.colors.lightRose', hex: '#F4D4D6' },
];

const FONTS = [
    { name: 'Modern', class: 'font-display' },
    { name: 'Street', class: 'font-black' },
    { name: 'Classic', class: 'font-serif' },
    { name: 'Mono', class: 'font-mono' },
];

const SIZES = ['1X', '2X', '3X'];

interface DesignElement {
    id: string;
    type: 'image' | 'text';
    content: string;
    x: number;
    y: number;
    scale: number;
    rotate: number;
    side: 'front' | 'back';
    fontFamily?: string;
    color?: string;
}

export default function CustomStudio() {
    const { t } = useTranslation();
    const { language } = useUIStore();
    const { addItem } = useCartStore();
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedSize, setSelectedSize] = useState('1X');
    const [designs, setDesigns] = useState<DesignElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const safeZoneRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragData = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

    // Coordinate Repair / Migration logic
    useEffect(() => {
        const needsRepair = designs.some(d => d.x < 0 || d.x > 100 || d.y < 0 || d.y > 100);
        if (needsRepair) {
            setDesigns(prev => prev.map(d => ({
                ...d,
                x: d.x < 0 || d.x > 100 ? 50 : d.x, // Reset to center if out of bounds
                y: d.y < 0 || d.y > 100 ? 50 : d.y
            })));
        }
    }, [designs.length]);

    // Interaction Handlers
    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file, index) => {
            // Validate file type strictly
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(language === 'ar' ? 'نوع الملف غير مدعوم' : 'File type not supported');
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error(language === 'ar'
                    ? `الملف ${file.name} كبير جداً (الحد الأقصى 2 ميجابايت)`
                    : `File ${file.name} is too large (max 2MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const newDesign: DesignElement = {
                    id: `img-${Date.now()}-${index}`,
                    type: 'image',
                    content: event.target?.result as string,
                    x: 50, // Center X (percentage)
                    y: 50, // Center Y (percentage)
                    scale: 1,
                    rotate: 0,
                    side: activeSide,
                };
                setDesigns(prev => {
                    const updated = [...prev, newDesign];
                    if (index === files.length - 1) {
                        setSelectedElementId(newDesign.id);
                    }
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });

        // Clear input value to allow re-uploading the same file
        e.target.value = '';
    };

    const addText = () => {
        const newDesign: DesignElement = {
            id: `txt-${Date.now()}`,
            type: 'text',
            content: t('customStudio.editor.placeholder'),
            x: 50,
            y: 50,
            scale: 1,
            rotate: 0,
            side: activeSide,
            fontFamily: FONTS[0].class,
            color: '#FFFFFF'
        };
        setDesigns([...designs, newDesign]);
        setSelectedElementId(newDesign.id);

        // Focus text input after a short delay
        setTimeout(() => textInputRef.current?.focus(), 100);
    };

    const updateElement = (id: string, updates: Partial<DesignElement>) => {
        setDesigns(designs.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const removeElement = (id: string) => {
        setDesigns(designs.filter(d => d.id !== id));
        setSelectedElementId(null);
    };

    const handlePointerDown = (e: React.PointerEvent, design: DesignElement) => {
        // Prevent drag when clicking on control buttons
        if ((e.target as HTMLElement).closest('button')) return;

        e.preventDefault();
        setDraggingId(design.id);
        setSelectedElementId(design.id);

        dragData.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: design.x,
            initialY: design.y
        };

        const onPointerMove = (moveEv: PointerEvent) => {
            if (!safeZoneRef.current) return;
            const rect = safeZoneRef.current.getBoundingClientRect();

            // Calculate pixel movement
            const dx = moveEv.clientX - dragData.current.startX;
            const dy = moveEv.clientY - dragData.current.startY;

            // Convert to percentage
            const movePctX = (dx / rect.width) * 100;
            const movePctY = (dy / rect.height) * 100;

            const newX = Math.max(0, Math.min(100, dragData.current.initialX + movePctX));
            const newY = Math.max(0, Math.min(100, dragData.current.initialY + movePctY));

            setDesigns(prev => prev.map(d => d.id === design.id ? { ...d, x: newX, y: newY } : d));
        };

        const onPointerUp = () => {
            setDraggingId(null);
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    const handleAddToCart = async () => {
        if (designs.length === 0) {
            toast.error(t('customStudio.errors.atLeastOne'));
            return;
        }

        // Check if cart has standard items
        const hasStandardItems = useCartStore.getState().items.some(i => i.price > 0);
        if (hasStandardItems) {
            toast.error(t('customStudio.errors.clearStandard'));
            return;
        }

        setIsUploading(true);
        try {
            const customItemId = `custom-${Math.random().toString(36).substring(7)}`;

            addItem({
                productId: 'custom-hoodie',
                variantId: customItemId,
                title: t('customStudio.title'),
                image: designs.find(d => d.side === 'front')?.content || '/placeholder.svg',
                backImage: designs.find(d => d.side === 'back')?.content || null,
                size: selectedSize,
                color: t(selectedColor.nameKey),
                colorHex: selectedColor.hex,
                price: 0,
                quantity: 1,
                customDesigns: designs
            });

            toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart successfully');
        } catch (error) {
            toast.error(t('customStudio.errors.uploadFailed'));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-background text-foreground px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"
                        >
                            {t('customStudio.title')}
                        </motion.h1>
                        <p className="text-muted-foreground max-w-xl">
                            {t('customStudio.subtitle')}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-wider">
                                {t('customStudio.previewNotice')}
                            </span>
                        </div>
                    </div>
                    <div className="bg-vero-gold/10 px-6 py-3 rounded-2xl border border-vero-gold/20 flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vero-gold">{t('customStudio.estPrice')}</span>
                        <span className="text-2xl font-black text-vero-gold leading-none">{t('customStudio.tbd')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Toolbar - Left */}
                    <div className="lg:col-span-1 flex lg:flex-col gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-14 h-14 flex flex-col items-center justify-center rounded-2xl bg-card border border-border hover:border-vero-gold transition-all text-muted-foreground hover:text-vero-gold group shadow-lg"
                            title="Upload Image"
                        >
                            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">Image</span>
                        </button>
                        <button
                            onClick={addText}
                            className="w-14 h-14 flex flex-col items-center justify-center rounded-2xl bg-card border border-border hover:border-vero-gold transition-all text-muted-foreground hover:text-vero-gold group shadow-lg"
                            title="Add Text"
                        >
                            <Type className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">Text</span>
                        </button>
                        <div className="w-[1px] lg:w-full h-full lg:h-[1px] bg-border my-2 opacity-30" />
                        <button
                            onClick={() => setDesigns([])}
                            className="w-14 h-14 flex flex-col items-center justify-center rounded-2xl bg-card border border-border hover:bg-red-500/10 hover:border-red-500/30 transition-all text-muted-foreground hover:text-red-500 group shadow-lg"
                            title={t('customStudio.tools.clear')}
                        >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">{t('customStudio.tools.clear')}</span>
                        </button>
                        <input type="file" hidden ref={fileInputRef} onChange={addImage} accept="image/*" multiple />
                    </div>

                    {/* Designer Canvas - Middle */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-square rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 border border-border dark:border-white/5 flex flex-col items-center justify-center group shadow-2xl overflow-hidden">
                            {/* Side Toggle Tabs */}
                            <div className="absolute top-8 left-8 flex gap-1 bg-background/60 dark:bg-black/60 backdrop-blur-2xl p-1.5 rounded-full border border-border dark:border-white/10 z-50">
                                {(['front', 'back'] as const).map(side => (
                                    <button
                                        key={side}
                                        onClick={() => {
                                            setActiveSide(side);
                                            setSelectedElementId(null);
                                        }}
                                        className={cn(
                                            "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeSide === side ? "bg-foreground text-background shadow-xl scale-105" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {t(`customStudio.sides.${side}`)}
                                    </button>
                                ))}
                            </div>

                            {/* Canvas Wrapper */}
                            <div className="relative w-full h-full flex items-center justify-center p-[8%] overflow-hidden">
                                {/* Hoodie SVG Background */}
                                <svg
                                    viewBox="0 25 200 215"
                                    className="w-full h-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] pointer-events-none transition-colors duration-500"
                                    style={{ color: selectedColor.hex }}
                                >
                                    <path
                                        d="M40,65 C25,65 15,75 5,120 L25,145 L40,125 L40,230 C40,235 45,240 50,240 L150,240 C155,240 160,235 160,230 L160,125 L175,145 L195,120 C185,75 175,65 160,65 L140,70 L60,70 L40,65 Z"
                                        fill="currentColor"
                                    />
                                    {activeSide === 'front' ? (
                                        <>
                                            <path d="M60,70 C60,25 140,25 140,70 C140,85 125,95 100,95 C75,95 60,85 60,70 Z" fill="currentColor" fillOpacity="0.15" />
                                            <path d="M55,160 C55,155 60,150 65,150 L135,150 C140,150 145,155 145,160 L155,210 C155,215 150,220 145,220 L55,220 C50,220 45,215 45,210 L55,160 Z" fill="currentColor" fillOpacity="0.08" />
                                        </>
                                    ) : (
                                        <path d="M50,70 C50,20 150,20 150,70 C150,110 130,140 100,140 C70,140 50,110 50,70 Z" fill="currentColor" fillOpacity="0.15" />
                                    )}
                                </svg>

                                {/* Interactive Design Layer - Expanded and Borderless for "Free" feel */}
                                <div className="absolute inset-[8%] flex items-center justify-center pointer-events-none" style={{ containerType: 'size' }}>
                                    <div
                                        ref={safeZoneRef}
                                        className="relative w-full h-full pointer-events-auto"
                                    >

                                        <AnimatePresence>
                                            {designs.filter(d => d.side === activeSide).map((design) => (
                                                <div
                                                    key={design.id}
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${design.x}%`,
                                                        top: `${design.y}%`,
                                                        zIndex: (selectedElementId === design.id || draggingId === design.id) ? 50 : 10,
                                                        cursor: draggingId === design.id ? 'grabbing' : 'grab',
                                                        touchAction: 'none',
                                                        userSelect: 'none'
                                                    }}
                                                    onPointerDown={(e) => handlePointerDown(e, design)}
                                                    className="transition-transform duration-75"
                                                    id={design.id}
                                                >
                                                    <div
                                                        className={cn(
                                                            "relative -translate-x-1/2 -translate-y-1/2 transition-shadow",
                                                            draggingId === design.id && "scale-[1.02]"
                                                        )}
                                                        style={{
                                                            transform: `translate(-50%, -50%) scale(${design.scale}) rotate(${design.rotate}deg)`
                                                        }}
                                                    >
                                                        {/* Boundary Box & Handles */}
                                                        {selectedElementId === design.id && (
                                                            <div className="absolute -inset-6 border-2 border-vero-gold rounded-xl pointer-events-none shadow-[0_0_20px_rgba(73,215,126,0.3)] z-50">
                                                                <div
                                                                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto bg-card border border-border dark:border-white/20 p-2 rounded-2xl shadow-2xl"
                                                                    onPointerDown={(e) => e.stopPropagation()}
                                                                >
                                                                    <button onClick={(e) => { e.stopPropagation(); updateElement(design.id, { scale: Math.max(0.3, design.scale - 0.1) }) }} className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"><Maximize2 className="w-3.5 h-3.5 rotate-180" /></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); updateElement(design.id, { scale: Math.min(3, design.scale + 0.1) }) }} className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); updateElement(design.id, { rotate: design.rotate + 15 }) }} className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"><RotateCw className="w-3.5 h-3.5" /></button>
                                                                    <div className="w-[1px] h-4 bg-border dark:bg-white/20 self-center mx-1" />
                                                                    <button onClick={(e) => { e.stopPropagation(); removeElement(design.id) }} className="p-1.5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-vero-gold rounded-full" />
                                                            </div>
                                                        )}

                                                        <div className="pointer-events-auto">
                                                            {design.type === 'image' ? (
                                                                <img
                                                                    src={design.content}
                                                                    className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl select-none"
                                                                    alt=""
                                                                    draggable={false}
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
                                                    </div>
                                                </div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Content Editor - Sticky Bottom */}
                        <AnimatePresence>
                            {selectedElementId && designs.find(d => d.id === selectedElementId)?.type === 'text' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-zinc-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                                >
                                    <div className="absolute -top-3 left-8 bg-vero-gold text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{t('customStudio.editor.active')}</div>
                                    <div className="space-y-8">
                                        <div className="relative group">
                                            <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-vero-gold transition-colors" />
                                            <input
                                                ref={textInputRef}
                                                value={designs.find(d => d.id === selectedElementId)?.content}
                                                onChange={(e) => updateElement(selectedElementId, { content: e.target.value })}
                                                placeholder={t('customStudio.editor.placeholder')}
                                                className="w-full bg-background/40 border border-border dark:border-white/10 pl-12 pr-6 py-5 rounded-2xl text-xl font-bold focus:outline-none focus:border-vero-gold/50 focus:ring-4 ring-vero-gold/5 transition-all text-foreground"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('customStudio.editor.fontFamily')}</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {FONTS.map(f => (
                                                        <button
                                                            key={f.name}
                                                            onClick={() => updateElement(selectedElementId, { fontFamily: f.class })}
                                                            className={cn(
                                                                "px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all",
                                                                designs.find(d => d.id === selectedElementId)?.fontFamily === f.class ? "bg-white text-black border-white shadow-lg scale-105" : "bg-black/20 border-white/5 text-white/40 hover:text-white"
                                                            )}
                                                        >
                                                            {f.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t('customStudio.editor.textColor')}</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['#FFFFFF', '#000000', '#49d77e', '#FF0000', '#49d77e', '#60a5fa'].map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => updateElement(selectedElementId, { color: c })}
                                                            className={cn(
                                                                "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                                                                designs.find(d => d.id === selectedElementId)?.color === c ? "border-vero-gold scale-110 shadow-lg" : "border-white/5 hover:border-white/20"
                                                            )}
                                                        >
                                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: c }} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Panel - Configuration */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-card p-10 rounded-[2.5rem] border border-border dark:border-white/5 space-y-10 shadow-2xl">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                                    <Layers className="w-3.5 h-3.5" /> 01. {t('customStudio.baseStyle')}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                                                selectedColor.id === color.id ? "bg-foreground text-background border-foreground shadow-xl scale-105" : "bg-background/40 border-border dark:border-white/5 hover:border-border/50"
                                            )}
                                        >
                                            <div className="w-7 h-7 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }} />
                                            <span className="text-[9px] font-black uppercase">{t(color.nameKey)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                                    <Maximize2 className="w-3.5 h-3.5" /> 02. {t('customStudio.sizing')}
                                </h3>
                                <div className="flex gap-3">
                                    {SIZES.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "w-14 h-14 flex items-center justify-center rounded-2xl border text-sm font-black transition-all",
                                                selectedSize === size ? "bg-white text-black border-white shadow-xl scale-105" : "bg-black/40 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isUploading}
                                className="w-full h-20 bg-vero-gold text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-[0_25px_50px_rgba(212,175,55,0.25)] hover:shadow-vero-gold/40 hover:-translate-y-1"
                            >
                                {isUploading ? (
                                    <span className="animate-pulse">{t('checkout.processing')}</span>
                                ) : (
                                    <>
                                        {t('customStudio.confirm')} <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </section>

                        <div className="p-8 rounded-[2rem] bg-card border border-border dark:border-white/5 flex gap-5 items-start">
                            <div className="p-3 bg-vero-gold/10 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-vero-gold" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] font-black uppercase tracking-widest text-vero-gold">{t('customStudio.workflowTitle')}</p>
                                <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
                                    {t('customStudio.workflowDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
