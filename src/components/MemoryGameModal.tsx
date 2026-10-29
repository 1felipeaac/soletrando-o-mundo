import React, { useState, useEffect, useCallback } from 'react';
import type { WorldRoom, MemoryCard } from '../types/game';
import { ItemIllustration } from './ItemIllustration';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { X, RotateCcw, Sparkles, Volume2, Trophy, Lock, ArrowRight } from 'lucide-react';

interface MemoryGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  world: WorldRoom;
  completedLevel?: number; // Nível máximo já vencido (0..4)
  onCompletedMemoryLevel?: (worldId: number, level: number) => void;
}

// Configuração dos 4 Níveis Progressivos de Dificuldade por Cômodo
// Respeita a carga cognitiva infantil (3 a 6 pares) para maior aproveitamento dos 8 itens
const LEVEL_CONFIG: Record<number, { pairs: number; title: string; subtitle: string }> = {
  1: { pairs: 3, title: 'Nível 1', subtitle: '3 pares (6 cartas)' },
  2: { pairs: 4, title: 'Nível 2', subtitle: '4 pares (8 cartas)' },
  3: { pairs: 5, title: 'Nível 3', subtitle: '5 pares (10 cartas)' },
  4: { pairs: 6, title: 'Nível 4', subtitle: '6 pares (12 cartas)' },
};

// Algoritmo Fisher-Yates para embaralhamento justo
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const MemoryGameModal: React.FC<MemoryGameModalProps> = ({
  isOpen,
  onClose,
  world,
  completedLevel = 0,
  onCompletedMemoryLevel,
}) => {
  // O nível máximo desbloqueado é o nível concluído + 1 (mínimo nível 1, máximo nível 4)
  const maxUnlockedLevel = Math.min(4, Math.max(1, completedLevel + 1));

  // Inicializa o jogo no próximo nível a ser conquistado (ou no nível 1)
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return completedLevel >= 4 ? 4 : maxUnlockedLevel;
  });

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const pairCount = LEVEL_CONFIG[currentLevel]?.pairs || 3;

  // Inicializa ou reinicia o baralho com pares de Imagem ↔ Palavra para o nível atual
  const initializeGame = useCallback(() => {
    setSelectedCardIds([]);
    setIsBusy(false);
    setMatchedCount(0);
    setIsGameFinished(false);

    // Sorteia aleatoriamente `pairCount` itens dentre os 8 disponíveis no cômodo
    const shuffledItems = shuffleArray(world.items);
    const chosenItems = shuffledItems.slice(0, pairCount);

    const deck: MemoryCard[] = [];

    chosenItems.forEach((item) => {
      // Carta A: Imagem 3D do objeto em massinha
      deck.push({
        id: `${item.id}-image`,
        itemId: item.id,
        type: 'image',
        label: item.name,
        imageSrc: item.image,
        fallbackIcon: item.icon,
        isFlipped: false,
        isMatched: false,
      });

      // Carta B: Palavra Escrita em Caixa Alta
      deck.push({
        id: `${item.id}-word`,
        itemId: item.id,
        type: 'word',
        label: item.name.toUpperCase(),
        fallbackIcon: item.icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleArray(deck));
  }, [world.items, pairCount]);

  // Ao abrir o modal ou trocar de nível, inicia a partida
  useEffect(() => {
    if (isOpen) {
      initializeGame();
    }
  }, [isOpen, currentLevel, initializeGame]);

  if (!isOpen) return null;

  const handleSelectLevel = (lvl: number) => {
    if (lvl > maxUnlockedLevel) {
      soundService.playBoing();
      return;
    }
    if (lvl !== currentLevel) {
      soundService.playWoodClick();
      setCurrentLevel(lvl);
    }
  };

  const handleAdvanceNextLevel = () => {
    if (currentLevel < 4) {
      soundService.playWoodClick();
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handleCardClick = (clickedCard: MemoryCard) => {
    if (isBusy || clickedCard.isFlipped || clickedCard.isMatched) return;
    if (selectedCardIds.includes(clickedCard.id)) return;

    soundService.playCardFlip();

    // Revela a carta clicada
    const newCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newSelected = [...selectedCardIds, clickedCard.id];
    setSelectedCardIds(newSelected);

    if (newSelected.length === 1) {
      // Primeira carta virada: pronuncia a palavra com a voz neural
      speechService.speakWord(clickedCard.itemId);
    } else if (newSelected.length === 2) {
      const firstCard = newCards.find((c) => c.id === newSelected[0])!;
      const secondCard = newCards.find((c) => c.id === newSelected[1])!;

      // Critério de Par: Mesmo itemId e tipos complementares (Imagem + Palavra)
      const isMatch =
        firstCard.itemId === secondCard.itemId && firstCard.type !== secondCard.type;

      if (isMatch) {
        soundService.playSnap();
        const updated = newCards.map((c) =>
          c.itemId === firstCard.itemId ? { ...c, isMatched: true, isFlipped: true } : c
        );
        setCards(updated);
        setSelectedCardIds([]);

        const nextMatchedCount = matchedCount + 1;
        setMatchedCount(nextMatchedCount);

        if (nextMatchedCount === pairCount) {
          // Vitória do Nível Atual: pronúncia limpa da palavra seguida de parabenização acolhedora
          setIsGameFinished(true);
          soundService.playFanfare();
          speechService.speakSuccess(firstCard.itemId);

          if (onCompletedMemoryLevel) {
            onCompletedMemoryLevel(world.id, currentLevel);
          }
        } else {
          // Par intermediário: reforça a palavra confirmando o acerto
          speechService.speakWord(firstCard.itemId);
        }
      } else {
        // Carta diferente: pronuncia a segunda para a criança aprender o que virou
        speechService.speakWord(clickedCard.itemId);

        // Pausa acolhedora de 1.2s para memorização visual (sem som de erro)
        setIsBusy(true);
        setTimeout(() => {
          soundService.playWoodClick();
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCardIds([]);
          setIsBusy(false);
        }, 1200);
      }
    }
  };

  // Dinâmica de colunas responsivas segundo o número de cartas
  const getGridColsClass = () => {
    const totalCards = pairCount * 2;
    if (totalCards === 6) return 'grid-cols-3 max-w-sm sm:max-w-md'; // 3x2 (Nível 1)
    if (totalCards === 8) return 'grid-cols-4 max-w-md sm:max-w-lg'; // 4x2 (Nível 2)
    if (totalCards === 10) return 'grid-cols-5 max-w-lg sm:max-w-xl'; // 5x2 (Nível 3)
    return 'grid-cols-4 max-w-md sm:max-w-xl'; // 12 cartas -> 4x3 (Nível 4)
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Jogo da Memória do ${world.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-[#FAF8F5] rounded-3xl border-4 border-amber-300 shadow-2xl p-3.5 sm:p-6 flex flex-col max-h-[94vh] overflow-y-auto">
        {/* Cabeçalho Acolhedor */}
        <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b-2 border-amber-200/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-2xl sm:text-3xl shrink-0" aria-hidden="true">
              🧩
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 leading-tight truncate">
                Memória: {world.shortName || world.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold truncate">
                Ligue a imagem à palavra escrita
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300 font-black text-xs flex items-center gap-1 shadow-2xs whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                {matchedCount}/{pairCount} pares
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar jogo da memória"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-transform active:scale-90 shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Seletor dos 4 Níveis Progressivos do Cômodo */}
        <div className="pt-2.5 pb-1 flex items-center justify-center gap-2 sm:gap-3 w-full shrink-0 flex-wrap sm:flex-nowrap">
          {[1, 2, 3, 4].map((lvl) => {
            const isUnlocked = lvl <= maxUnlockedLevel;
            const isCompleted = lvl <= (completedLevel || 0);
            const isActive = lvl === currentLevel;

            return (
              <button
                key={lvl}
                onClick={() => handleSelectLevel(lvl)}
                disabled={!isUnlocked}
                aria-label={`Nível ${lvl}: ${LEVEL_CONFIG[lvl].subtitle}${!isUnlocked ? ' (Bloqueado)' : ''}`}
                className={`flex-1 sm:flex-1 min-w-[76px] sm:min-w-[130px] max-w-[165px] py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 transition-all select-none whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-2 border-amber-600 shadow-xs scale-102 font-black'
                    : isUnlocked
                    ? 'bg-amber-100/80 text-amber-900 border border-amber-300/80 hover:bg-amber-200/90 cursor-pointer active:scale-95'
                    : 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <span>Nível {lvl}</span>
                  {isCompleted ? (
                    <span className="text-[11px] sm:text-xs">⭐</span>
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  ) : null}
                </div>
                <span className="text-[9px] sm:text-xs opacity-75 font-extrabold whitespace-nowrap">
                  {LEVEL_CONFIG[lvl].pairs} pares
                </span>
              </button>
            );
          })}
        </div>

        {/* Área Central: Grade de Cartas ou Tela de Vitória */}
        <div className="py-2.5 sm:py-4 flex-1 flex flex-col items-center justify-center">
          {isGameFinished ? (
            <div className="w-full text-center py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center gap-3.5 sm:gap-4 animate-pop-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-950" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-2xl font-black text-slate-800">
                  {currentLevel === 4
                    ? 'Mestre da Memória! 🏆'
                    : `Nível ${currentLevel} Concluído! 🎉`}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {currentLevel === 4
                    ? `Parabéns! Você dominou todos os 4 níveis de memória do ${world.shortName || world.title}!`
                    : `Você encontrou todos os ${pairCount} pares do Nível ${currentLevel}! O Nível ${currentLevel + 1} já está desbloqueado.`}
                </p>
              </div>

              {/* Botões de Ação na Conclusão do Nível */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 w-full max-w-xs sm:max-w-md pt-2">
                {currentLevel < 4 && (
                  <button
                    onClick={handleAdvanceNextLevel}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-4 py-3 rounded-2xl shadow-md border-2 border-emerald-500 cursor-pointer active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap"
                  >
                    <span>Ir para o Nível {currentLevel + 1}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}

                <button
                  onClick={initializeGame}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-3 rounded-2xl shadow-md border-2 border-amber-600 cursor-pointer active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Jogar Novamente</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-4 py-3 rounded-2xl shadow-sm border border-slate-300 cursor-pointer active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  <span>Voltar ao Cômodo</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`grid ${getGridColsClass()} gap-2 sm:gap-3 w-full mx-auto justify-center`}
            >
              {cards.map((card) => {
                const isRevealed = card.isFlipped || card.isMatched;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isBusy || card.isMatched || card.isFlipped}
                    aria-label={
                      isRevealed
                        ? `${card.type === 'image' ? 'Imagem de' : 'Palavra'} ${card.label}`
                        : 'Carta virada para baixo'
                    }
                    className={`relative aspect-square min-w-[58px] min-h-[58px] sm:min-w-[76px] sm:min-h-[76px] rounded-2xl sm:rounded-3xl cursor-pointer select-none transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300/50 ${
                      card.isMatched
                        ? 'bg-emerald-50 border-3 border-emerald-400 shadow-xs opacity-90 scale-95'
                        : isRevealed
                        ? 'bg-white border-3 border-amber-400 shadow-md ring-2 ring-amber-300/50'
                        : 'bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border-3 border-amber-400 hover:border-amber-500 shadow-sm'
                    }`}
                  >
                    {isRevealed ? (
                      <div className="w-full h-full p-1.5 sm:p-2 flex flex-col items-center justify-center animate-fade-in">
                        {card.type === 'image' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <ItemIllustration
                              itemId={card.itemId}
                              fallbackIcon={card.fallbackIcon}
                              className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-xs"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center px-0.5 sm:px-1">
                            <span className="font-black text-xs sm:text-base md:text-lg text-slate-800 tracking-wider text-center uppercase break-words leading-tight">
                              {card.label}
                            </span>
                            <span className="mt-0.5 sm:mt-1 flex items-center gap-0.5 text-[8px] sm:text-[9px] text-amber-700 font-extrabold uppercase">
                              <Volume2 className="w-2.5 h-2.5" />
                              Ouvir
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Verso da Carta: Madeira e Massinha Acolhedora
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-400/50 flex items-center justify-center border-2 border-amber-400/60 shadow-inner">
                          <span className="text-amber-800 font-black text-sm sm:text-base">
                            ?
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé Sereno com Ações de Apoio (Oculto na Vitória) */}
        {!isGameFinished && (
          <div className="pt-2 sm:pt-2.5 border-t-2 border-amber-200/60 flex flex-col xs:flex-row items-center justify-between gap-1 sm:gap-2 shrink-0 text-xs font-bold text-slate-500 text-center xs:text-left">
            <button
              onClick={initializeGame}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reembaralhar {LEVEL_CONFIG[currentLevel].title}</span>
            </button>

            <span className="text-[11px] text-slate-600">
              Toque na carta para ouvir o som 🌿
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
