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

interface TileItem {
  id: string;
  syllable: string;
  color: string;
  isUsed: boolean;
}

// Paleta de alto contraste, serena e inclusiva (WCAG AAA)
const TILE_COLORS = [
  'bg-amber-300 text-amber-950 border-amber-500 shadow-amber-200',
  'bg-sky-300 text-sky-950 border-sky-500 shadow-sky-200',
  'bg-emerald-300 text-emerald-950 border-emerald-500 shadow-emerald-200',
  'bg-orange-300 text-orange-950 border-orange-500 shadow-orange-200',
  'bg-rose-300 text-rose-950 border-rose-500 shadow-rose-200',
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
      color: TILE_COLORS[i % TILE_COLORS.length],
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
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col items-center select-none">
      {/* Navegação entre Itens do Cômodo */}
      <div className="w-full flex items-center justify-between gap-2 mb-3">
        <button
          onClick={onPrevItem}
          disabled={!hasPrev}
          className="flex items-center gap-1 bg-white hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-white text-amber-950 font-black px-3 py-1.5 rounded-xl border-2 border-amber-300 shadow-2xs text-xs cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="font-extrabold text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full text-xs tracking-wide">
          Soletrando: <strong className="text-amber-950 uppercase">{item.displayName}</strong>
        </span>

        <button
          onClick={onNextItem}
          disabled={!hasNext}
          className="flex items-center gap-1 bg-white hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-white text-amber-950 font-black px-3 py-1.5 rounded-xl border-2 border-amber-300 shadow-2xs text-xs cursor-pointer active:scale-95"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Card do Objeto Atual */}
      <div className="w-full bg-white rounded-3xl border-4 border-amber-300 p-4 sm:p-5 shadow-sm text-center relative">
        {/* Selo de Concluído */}
        {isItemCompleted && (
          <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 mb-2">
            <Check className="w-3.5 h-3.5" />
            <span>Colocado no Quarto!</span>
          </div>
        )}

        {/* Ilustração Grande do Objeto */}
        <div className="py-2 flex justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 animate-float-gentle drop-shadow-xs flex items-center justify-center">
            <ItemIllustration itemId={item.id} fallbackIcon={item.icon} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Pílula Pedagógica com Regra Fonética e BNCC */}
        {item.phoneticRule && (
          <div className="my-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
              <span>{item.phoneticRule}</span>
            </span>
          </div>
        )}

        {/* Botões de Ouvir Nome e Dica (Altura Uniforme h-11) */}
        <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-xs mx-auto">
          <button
            onClick={() => {
              speechService.cancel();
              soundService.playWoodClick();
              speechService.speakItemName(item.id, item.syllables);
            }}
            className="flex-1 h-11 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-3 rounded-2xl border-2 border-amber-500 transition-transform active:scale-95 cursor-pointer text-xs uppercase tracking-wider whitespace-nowrap shadow-2xs"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span>Ouvir Nome</span>
          </button>

          <button
            onClick={() => {
              speechService.cancel();
              soundService.playWoodClick();
              speechService.speakHint(item.id, item.hint);
              setFunnyFeedback(item.hint);
            }}
            className="h-11 flex items-center justify-center gap-1.5 bg-sky-100 hover:bg-sky-200 text-sky-950 font-extrabold px-3.5 rounded-2xl border-2 border-sky-300 transition-transform active:scale-95 cursor-pointer text-xs whitespace-nowrap shrink-0 shadow-2xs"
            title="Dica"
          >
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <span>Dica</span>
          </button>
        </div>

        {/* Mensagem Divertida / Erro Construtivo */}
        {funnyFeedback && (
          <div className="mt-3 bg-amber-200/90 text-amber-950 font-black text-xs px-3.5 py-2 rounded-2xl border border-amber-300 animate-wiggle-soft">
            {funnyFeedback}
          </div>
        )}
      </div>

      {/* CASINHAS / SLOTS DE ENCAIXE */}
      <div className="w-full my-5">
        <p className="text-center text-xs font-black text-amber-900 uppercase tracking-widest mb-2">
          Encaixe as sílabas na ordem:
        </p>

        <div className="flex items-center justify-center gap-3">
          {slots.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveTile(idx)}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                tile
                  ? `${tile.color} active:scale-95 shadow-md`
                  : 'bg-stone-100/80 border-dashed border-stone-300 shadow-inner hover:border-amber-400'
              } ${isWiggling ? 'animate-wiggle-soft border-rose-400' : ''}`}
            >
              {tile ? (
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                  {tile.syllable}
                </span>
              ) : (
                <span className="text-sm font-black text-stone-400">
                  {idx + 1}º
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* BANDEJA DE SÍLABAS TÁTEIS (ÁREA DE TOQUE 72px) */}
      <div className="w-full bg-white/70 backdrop-blur-xs rounded-3xl border-2 border-amber-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
            Toque nas sílabas:
          </span>
          <button
            onClick={handleResetSlots}
            className="text-xs font-extrabold text-stone-500 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {trayTiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.isUsed}
              onClick={() => handlePlaceTile(tile)}
              className={`min-w-[70px] sm:min-w-[76px] h-17 sm:h-18 px-3 rounded-2xl border-4 font-black text-2xl sm:text-3xl shadow-sm transition-all active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center ${
                tile.color
              } ${
                tile.isUsed
                  ? 'opacity-20 scale-95 cursor-not-allowed border-stone-300 bg-stone-200'
                  : 'hover:-translate-y-0.5 hover:shadow-md'
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
