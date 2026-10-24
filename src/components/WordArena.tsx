import { useState, useEffect, useRef } from 'react';
import type { ItemStage } from '../types/game';
import { Volume2, Lightbulb, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { ItemIllustration } from './ItemIllustration';
import confetti from 'canvas-confetti';

interface WordArenaProps {
  item: ItemStage;
  isItemCompleted: boolean;
  onComplete: (itemId: string) => void;
  onPrevItem: () => void;
  onNextItem: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

interface TileTheme {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  shadowActive: string;
}

interface TileItem {
  id: string;
  syllable: string;
  colorTheme: TileTheme;
  isUsed: boolean;
}

// Cores táteis com profundidade 3D (WCAG 2.2 AAA e AA)
const TILE_THEMES: TileTheme[] = [
  // Amarelo Sol (Contraste 9.2:1 AAA com Grafite Escuro)
  {
    bg: 'bg-[#F59E0B]',
    text: 'text-slate-900',
    border: 'border-[#D97706]',
    shadow: 'shadow-[0_8px_0_#B45309]',
    shadowActive: 'active:shadow-[0_2px_0_#B45309]',
  },
  // Azul Céu Vivo (5.4:1 AA com Branco Puro)
  {
    bg: 'bg-[#0284C7]',
    text: 'text-white',
    border: 'border-[#0369A1]',
    shadow: 'shadow-[0_8px_0_#075985]',
    shadowActive: 'active:shadow-[0_2px_0_#075985]',
  },
  // Verde Esmeralda (5.1:1 AA com Branco Puro)
  {
    bg: 'bg-[#059669]',
    text: 'text-white',
    border: 'border-[#047857]',
    shadow: 'shadow-[0_8px_0_#065F46]',
    shadowActive: 'active:shadow-[0_2px_0_#065F46]',
  },
  // Laranja Coral (4.8:1 AA com Branco Puro)
  {
    bg: 'bg-[#EA580C]',
    text: 'text-white',
    border: 'border-[#C2410C]',
    shadow: 'shadow-[0_8px_0_#9A3412]',
    shadowActive: 'active:shadow-[0_2px_0_#9A3412]',
  },
];

export const WordArena: React.FC<WordArenaProps> = ({
  item,
  isItemCompleted,
  onComplete,
  onPrevItem,
  onNextItem,
  hasPrev,
  hasNext,
}) => {
  const [slots, setSlots] = useState<(TileItem | null)[]>([]);
  const [trayTiles, setTrayTiles] = useState<TileItem[]>([]);
  const [funnyFeedback, setFunnyFeedback] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const hasFinishedRef = useRef(false);

  // Inicializa o estágio do item
  useEffect(() => {
    hasFinishedRef.current = false;
    setSlots(new Array(item.syllables.length).fill(null));
    setFunnyFeedback(null);
    setIsWiggling(false);

    // Mistura sílabas corretas com distratores
    const combined = [...item.syllables, ...item.distractors];
    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    const tiles: TileItem[] = shuffled.map((syl, i) => ({
      id: `tile-${item.id}-${i}-${syl}`,
      syllable: syl,
      colorTheme: TILE_THEMES[i % TILE_THEMES.length],
      isUsed: false,
    }));

    setTrayTiles(tiles);

    return () => {
      speechService.cancel();
    };
  }, [item]);

  // Validação dos slots
  useEffect(() => {
    if (hasFinishedRef.current || slots.length === 0) return;

    const allFilled = slots.every((s) => s !== null);
    if (!allFilled) {
      setFunnyFeedback(null);
      return;
    }

    const filledSyllables = slots.map((s) => s!.syllable);
    const targetSyllables = item.syllables;

    const isMatch = filledSyllables.every((s, i) => s === targetSyllables[i]);

    if (isMatch) {
      hasFinishedRef.current = true;
      // Permite que o áudio da última sílaba termine de tocar com a voz natural
      const timer = setTimeout(() => {
        soundService.playSnap();
        soundService.playFanfare();

        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
          });
        } catch {}

        onComplete(item.id);
      }, 450);

      return () => clearTimeout(timer);
    } else {
      // Inverteu as sílabas
      const invertedTarget = [...targetSyllables].reverse().join('');
      const formedWord = filledSyllables.join('');

      if (formedWord === invertedTarget) {
        setFunnyFeedback(`Ih, virou ${filledSyllables.join('-')}! 😂 Vamos trocar de lugar?`);
        speechService.speakInverted(filledSyllables.join('-'), item.displayName);
      } else {
        setIsWiggling(true);
        soundService.playBoing();
        setFunnyFeedback(`Quase lá! Ouça a dica: ${item.hint}`);
        speechService.speakHint(item.id, item.hint);
        setTimeout(() => setIsWiggling(false), 500);
      }
    }
  }, [slots, item, onComplete]);

  // Coloca sílaba no primeiro slot livre
  const handlePlaceTile = (tile: TileItem) => {
    if (tile.isUsed) return;

    speechService.cancel();
    soundService.playWoodClick();
    speechService.speakSyllable(tile.syllable);

    setSlots((prev) => {
      const next = [...prev];
      const emptyIndex = next.findIndex((s) => s === null);
      if (emptyIndex === -1) return prev;
      next[emptyIndex] = tile;
      return next;
    });

    setTrayTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );
  };

  // Remove sílaba do slot
  const handleRemoveTile = (index: number) => {
    const tile = slots[index];
    if (!tile) return;

    soundService.playBoing();

    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    setTrayTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: false } : t))
    );

    setFunnyFeedback(null);
  };

  // Limpa todos os slots
  const handleResetSlots = () => {
    soundService.playBoing();
    setSlots(new Array(item.syllables.length).fill(null));
    setTrayTiles((prev) => prev.map((t) => ({ ...t, isUsed: false })));
    setFunnyFeedback(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center select-none space-y-3 sm:space-y-4">
      {/* Navegação Rápida entre Itens */}
      <div className="w-full flex items-center justify-between gap-2 px-1">
        <button
          onClick={onPrevItem}
          disabled={!hasPrev}
          className="flex items-center gap-1 bg-white hover:bg-sky-50 disabled:opacity-30 disabled:hover:bg-white text-slate-800 font-black px-3 py-1.5 rounded-xl border border-sky-200 shadow-2xs text-xs cursor-pointer active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-sky-700" />
          <span>Anterior</span>
        </button>

        <span className="font-extrabold text-slate-700 bg-white px-3.5 py-1 rounded-full text-xs tracking-wide border border-sky-200 shadow-2xs">
          Palavra: <strong className="text-slate-900 uppercase">{item.displayName}</strong>
        </span>

        <button
          onClick={onNextItem}
          disabled={!hasNext}
          className="flex items-center gap-1 bg-white hover:bg-sky-50 disabled:opacity-30 disabled:hover:bg-white text-slate-800 font-black px-3 py-1.5 rounded-xl border border-sky-200 shadow-2xs text-xs cursor-pointer active:scale-95 transition-all"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4 text-sky-700" />
        </button>
      </div>

      {/* CARD CENTRAL DE APRESENTAÇÃO DO OBJETO (Idêntico ao Mockup de Alta Fidelidade) */}
      <div className="w-full bg-white rounded-3xl border-2 border-sky-100 p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        {/* Título do Cômodo no Topo do Card */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
            Quarto da Criança
          </span>
          {isItemCompleted && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 animate-pop-in">
              <Check className="w-3.5 h-3.5" />
              <span>Concluído!</span>
            </span>
          )}
        </div>

        {/* Linha Central: Botão DICA (Amarelo) + Ilustração 3D Central + Botão SOM (Laranja) */}
        <div className="flex items-center justify-between gap-3 py-1">
          {/* Botão DICA (Amarelo 3D, conforme mockup) */}
          <button
            onClick={() => {
              speechService.cancel();
              soundService.playWoodClick();
              speechService.speakHint(item.id, item.hint);
              setFunnyFeedback(item.hint);
            }}
            className="w-16 sm:w-20 h-20 sm:h-24 bg-[#F59E0B] hover:bg-amber-500 rounded-3xl flex flex-col items-center justify-center border-2 border-[#D97706] shadow-[0_4px_0_#B45309] active:shadow-none active:translate-y-1 transition-all text-slate-900 cursor-pointer shrink-0"
            title="Ouvir Dica"
            aria-label="Ouvir Dica"
          >
            <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-amber-950 fill-amber-300 shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase mt-1">Dica</span>
          </button>

          {/* Ilustração 3D em Alta Fidelidade no Centro */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center animate-float-gentle">
              <ItemIllustration
                itemId={item.id}
                fallbackIcon={item.icon}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Botão SOM (Laranja 3D, conforme mockup) */}
          <button
            onClick={() => {
              speechService.cancel();
              soundService.playWoodClick();
              speechService.speakItemName(item.id, item.syllables);
            }}
            className="w-16 sm:w-20 h-20 sm:h-24 bg-[#EA580C] hover:bg-orange-600 rounded-3xl flex flex-col items-center justify-center border-2 border-[#C2410C] shadow-[0_4px_0_#9A3412] active:shadow-none active:translate-y-1 transition-all text-white cursor-pointer shrink-0"
            title="Ouvir Nome e Sílabas"
            aria-label="Ouvir Nome e Sílabas"
          >
            <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 text-white shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase mt-1">Som</span>
          </button>
        </div>

        {/* Pílula Pedagógica com Regra Fonética / BNCC */}
        {item.phoneticRule && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-950 text-xs font-extrabold px-3 py-1 rounded-full border border-sky-200">
              <span>{item.phoneticRule}</span>
            </span>
          </div>
        )}

        {/* Feedback Divertido / Construtivo */}
        {funnyFeedback && (
          <div className="mt-2 bg-amber-100 text-amber-950 font-black text-xs px-3.5 py-2 rounded-2xl border border-amber-300 animate-wiggle-soft">
            {funnyFeedback}
          </div>
        )}
      </div>

      {/* CASINHAS / SLOTS DE ENCAIXE (Grandes e Acessíveis) */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {slots.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveTile(idx)}
              aria-label={tile ? `Slot ${idx + 1} ocupado por ${tile.syllable}` : `Slot ${idx + 1} vazio`}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
                tile
                  ? `${tile.colorTheme.bg} ${tile.colorTheme.text} ${tile.colorTheme.border} ${tile.colorTheme.shadow} active:scale-95`
                  : 'bg-sky-100/70 border-sky-300 text-sky-400 shadow-inner hover:border-sky-400 hover:bg-sky-100'
              } ${isWiggling ? 'animate-wiggle-soft border-rose-400' : ''}`}
            >
              {tile ? (
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                  {tile.syllable}
                </span>
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-sky-400">
                  {idx + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* BANDEJA DE SÍLABAS TÁTEIS 3D (Área de Toque Excepcional 76px-88px, WCAG AAA) */}
      <div className="w-full bg-white rounded-3xl border-2 border-sky-100 p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Toque nas sílabas para montar:
          </span>
          <button
            onClick={handleResetSlots}
            className="text-xs font-extrabold text-slate-500 hover:text-sky-800 flex items-center gap-1 cursor-pointer transition-colors"
            title="Limpar todos os slots"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {trayTiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.isUsed}
              onClick={() => handlePlaceTile(tile)}
              aria-label={`Sílaba ${tile.syllable}`}
              className={`min-w-[76px] sm:min-w-[88px] h-20 sm:h-22 px-4 rounded-3xl border-3 font-black text-2xl sm:text-3xl transition-all uppercase tracking-wider flex items-center justify-center select-none ${
                tile.colorTheme.bg
              } ${tile.colorTheme.text} ${tile.colorTheme.border} ${
                tile.isUsed
                  ? 'opacity-20 scale-95 cursor-not-allowed border-stone-200 bg-stone-200 shadow-none'
                  : `${tile.colorTheme.shadow} ${tile.colorTheme.shadowActive} active:translate-y-1.5 hover:-translate-y-0.5 cursor-pointer`
              }`}
            >
              {tile.syllable}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
