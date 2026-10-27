import type { ItemStage, WorldRoom } from '../types/game';
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { ItemIllustration } from './ItemIllustration';

interface SceneBuilderProps {
  world: WorldRoom;
  completedItemIds: Record<string, boolean>;
  activeItemId: string;
  onSelectItem: (item: ItemStage) => void;
  onPrevWorld?: () => void;
  onNextWorld?: () => void;
  hasPrevWorld?: boolean;
  hasNextWorld?: boolean;
  prevWorldName?: string;
  nextWorldName?: string;
  isNextWorldLocked?: boolean;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  world,
  completedItemIds,
  activeItemId,
  onSelectItem,
  onPrevWorld,
  onNextWorld,
  hasPrevWorld,
  hasNextWorld,
  prevWorldName,
  nextWorldName,
  isNextWorldLocked,
}) => {
  const { items } = world;
  const completedCount = items.filter((i) => completedItemIds[i.id]).length;
  const isRoomFinished = completedCount === items.length;

  const headerTitle = isRoomFinished
    ? (world.completedTitle || `${world.shortName} Completo! 🏆`)
    : (world.shortName || world.title);

  const headerSubtitle = isRoomFinished
    ? 'O ambiente está completo e pronto para brincar!'
    : (world.sceneSubtitle || 'Descubra os objetos abaixo para revelar o cômodo');
  const successBanner = world.completedBanner || `${world.shortName} 100% Montado!`;

  return (
    <div className="w-full max-w-2xl lg:max-w-none mx-auto px-2 xs:px-3 sm:px-4 select-none">
      {/* Moldura do Cenário Isométrico Vivo (Como no Mockup de Alta Fidelidade) */}
      <div className="bg-white rounded-3xl border-3 border-sky-200 p-3 xs:p-3.5 sm:p-4 shadow-sm relative overflow-hidden space-y-3">
        {/* Cabeçalho do Cenário com Navegação Sequencial de Cômodos */}
        <div className="flex items-center justify-between bg-sky-50/80 px-2.5 xs:px-3 sm:px-3.5 py-2 rounded-2xl border border-sky-100 gap-2">
          {/* Seta para o Cômodo Anterior */}
          {onPrevWorld && (
            <button
              onClick={onPrevWorld}
              disabled={!hasPrevWorld}
              className="flex items-center gap-1 bg-white hover:bg-sky-50 disabled:opacity-25 disabled:hover:bg-white text-sky-950 font-black px-2.5 py-1.5 rounded-xl border border-sky-200 shadow-2xs text-[11px] sm:text-xs cursor-pointer active:scale-95 transition-all shrink-0"
              title={prevWorldName ? `Ir para ${prevWorldName}` : 'Sem cômodo anterior'}
              aria-label="Ir para cômodo anterior"
            >
              <ChevronLeft className="w-4 h-4 text-sky-700 shrink-0" />
              <span className="hidden sm:inline">{prevWorldName || 'Anterior'}</span>
            </button>
          )}

          {/* Identificação Central do Cômodo */}
          <div className="flex items-center gap-2 min-w-0 text-center justify-center flex-1">
            <span className="text-xl sm:text-2xl shrink-0" role="img" aria-label={world.shortName}>
              {world.icon}
            </span>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide leading-tight truncate">
                {headerTitle}
              </h2>
              <span className="text-[10px] sm:text-xs font-bold text-sky-700 block truncate">
                {headerSubtitle}
              </span>
            </div>
          </div>

          {/* Seta para o Próximo Cômodo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden md:inline-block bg-white text-slate-800 text-xs font-black px-2.5 py-1 rounded-xl border border-sky-200 shadow-2xs">
              {completedCount}/{items.length}
            </span>

            {onNextWorld && (
              <button
                onClick={onNextWorld}
                disabled={!hasNextWorld}
                className="flex items-center gap-1 bg-white hover:bg-sky-50 disabled:opacity-25 disabled:hover:bg-white text-sky-950 font-black px-2.5 py-1.5 rounded-xl border border-sky-200 shadow-2xs text-[11px] sm:text-xs cursor-pointer active:scale-95 transition-all shrink-0"
                title={
                  isNextWorldLocked
                    ? `Próximo: ${nextWorldName} (Bloqueado)`
                    : nextWorldName
                    ? `Ir para ${nextWorldName}`
                    : 'Sem próximo cômodo'
                }
                aria-label="Ir para próximo cômodo"
              >
                <span className="hidden sm:inline">{nextWorldName || 'Próximo'}</span>
                {isNextWorldLocked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-sky-700 shrink-0" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Banner Comemorativo 100% Concluído com Atalho para Próximo Cômodo */}
        {isRoomFinished && (
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-400 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-pop-in">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/95 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 fill-amber-400 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-amber-950 text-xs sm:text-sm uppercase tracking-wide leading-tight truncate">
                  {successBanner}
                </h3>
                <p className="text-[10px] sm:text-xs font-extrabold text-amber-900/90 leading-tight">
                  Tudo no lugar! O ambiente foi revelado e está pronto para brincar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-xl shrink-0 border border-amber-300 shadow-2xs">
                <span className="text-base sm:text-lg">🏆</span>
                <span className="text-xs font-black text-amber-950">100%</span>
              </div>

              {hasNextWorld && onNextWorld && (
                <button
                  onClick={onNextWorld}
                  className="flex items-center gap-1.5 bg-amber-900 hover:bg-amber-950 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <span>{nextWorldName || 'Próximo Cômodo'}</span>
                  <ChevronRight className="w-4 h-4 text-amber-200" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Vista Isométrica: Em Blur durante o progresso, e Nítida ao finalizar 100% */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-100 shadow-inner bg-sky-50 aspect-4/3 sm:aspect-16/10 max-h-[260px] sm:max-h-[320px] lg:max-h-[340px]">
          <img
            src={world.sceneImage || '/images/bedroom_scene.jpg?v=2'}
            alt={world.title}
            className={`w-full h-full object-cover object-center select-none transition-all duration-700 ${
              isRoomFinished
                ? 'filter-none scale-100'
                : 'blur-md scale-105'
            }`}
            draggable={false}
          />

          {/* Overlay suave informativo enquanto o cômodo estiver em Blur */}
          {!isRoomFinished && (
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center p-3 pointer-events-none">
              <div className="bg-white/90 text-slate-800 font-extrabold text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-xs flex items-center gap-1.5 animate-pulse">
                <span>✨</span>
                <span>Descubra todos os objetos abaixo para revelar o cômodo!</span>
              </div>
            </div>
          )}
        </div>

        {/* Esteira Seletora de Móveis e Brinquedos (8 Itens Táteis) */}
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-2.5 pt-1">
          {items.map((item) => {
            const isCompleted = !!completedItemIds[item.id];
            const isCurrent = item.id === activeItemId;

            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`relative flex flex-col items-center justify-between p-1.5 xs:p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                  isCurrent
                    ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-400 scale-[1.02]'
                    : isCompleted
                    ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-2xs'
                    : 'bg-stone-100/80 border-dashed border-stone-300 opacity-80 hover:opacity-100'
                }`}
                title={isCompleted ? item.displayName : 'Objeto Misterioso'}
                aria-label={isCompleted ? `Objeto ${item.displayName}` : `Objeto misterioso`}
              >
                {/* Selo de Concluído */}
                {isCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-2xs z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Selo de Mistério (Não Concluído) */}
                {!isCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-400 text-white rounded-full w-4 h-4 text-[10px] font-black flex items-center justify-center shadow-2xs z-10">
                    ?
                  </span>
                )}

                {/* Ilustração: Colorida se concluído, Sombreada no mistério */}
                <div
                  className={`w-9 h-9 xs:w-11 xs:h-11 sm:w-13 sm:h-13 my-0.5 transition-transform flex items-center justify-center mx-auto ${
                    isCompleted
                      ? 'scale-100'
                      : isCurrent
                      ? 'scale-105 brightness-0 opacity-40'
                      : 'brightness-0 opacity-30'
                  }`}
                >
                  <ItemIllustration itemId={item.id} fallbackIcon={item.icon} className="w-full h-full object-contain" />
                </div>

                {/* Nome do Objeto (Só revelado após o acerto) */}
                <span
                  className={`text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-wider truncate w-full text-center ${
                    isCompleted
                      ? 'text-emerald-950 font-extrabold'
                      : isCurrent
                      ? 'text-amber-900 font-extrabold tracking-widest'
                      : 'text-stone-400 font-extrabold tracking-widest'
                  }`}
                >
                  {isCompleted ? item.displayName : '???'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
