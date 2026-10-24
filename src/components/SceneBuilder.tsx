import type { ItemStage, WorldRoom } from '../types/game';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ItemIllustration } from './ItemIllustration';

interface SceneBuilderProps {
  world: WorldRoom;
  completedItemIds: Record<string, boolean>;
  activeItemId: string;
  onSelectItem: (item: ItemStage) => void;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  world,
  completedItemIds,
  activeItemId,
  onSelectItem,
}) => {
  const { items } = world;
  const completedCount = items.filter((i) => completedItemIds[i.id]).length;
  const isRoomFinished = completedCount === items.length;

  const headerTitle = isRoomFinished
    ? (world.completedTitle || `${world.shortName} Completo! 🏆`)
    : (world.shortName || world.title);

  const headerSubtitle = world.sceneSubtitle || 'Toque nas sombras misteriosas para soletrar e mobiliar o quarto';
  const successBanner = world.completedBanner || `${world.shortName} 100% Montado!`;
  
  // Imagem base: Cenário Sombreado durante o jogo, Foto Completa ao finalizar 100%
  const currentSceneImage = isRoomFinished
    ? (world.sceneImage || '/images/bedroom_scene.jpg')
    : (world.shadowedSceneImage || '/images/bedroom_scene_shadowed.jpg');

  return (
    <div className="w-full max-w-2xl lg:max-w-none mx-auto px-2 xs:px-3 sm:px-4 select-none">
      {/* Moldura do Cenário Isométrico Vivo (Como no Mockup de Alta Fidelidade) */}
      <div className="bg-white rounded-3xl border-3 border-sky-200 p-3 xs:p-3.5 sm:p-4 shadow-sm relative overflow-hidden space-y-3">
        {/* Cabeçalho do Cenário */}
        <div className="flex items-center justify-between bg-sky-50/80 px-3.5 py-2 rounded-2xl border border-sky-100">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={world.shortName}>
              {world.icon}
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide leading-tight">
                {headerTitle}
              </h2>
              <span className="text-[10px] sm:text-xs font-bold text-sky-700">
                {headerSubtitle}
              </span>
            </div>
          </div>

          <span className="bg-white text-slate-800 text-xs font-black px-3 py-1 rounded-xl border border-sky-200 shadow-2xs">
            {completedCount}/{items.length} Concluídos
          </span>
        </div>

        {/* Banner Comemorativo 100% Concluído (Posicionado ACIMA do Cenário para deixar o quarto 100% visível!) */}
        {isRoomFinished && (
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-400 shadow-sm flex items-center justify-between gap-2 animate-pop-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/95 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 fill-amber-400 animate-spin" />
              </div>
              <div>
                <h3 className="font-black text-amber-950 text-xs sm:text-sm uppercase tracking-wide leading-tight">
                  {successBanner}
                </h3>
                <p className="text-[10px] sm:text-xs font-extrabold text-amber-900/90 leading-tight">
                  Tudo no lugar! O ambiente está decorado e pronto para brincar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-xl shrink-0 border border-amber-300 shadow-2xs">
              <span className="text-base sm:text-lg">🏆</span>
              <span className="text-xs font-black text-amber-950">100%</span>
            </div>
          </div>
        )}

        {/* Vista Isométrica: Sombreada durante o progresso (com stickers dos acertos) e Completa ao finalizar */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-100 shadow-inner bg-sky-50 aspect-4/3 sm:aspect-16/10 max-h-[260px] sm:max-h-[320px] lg:max-h-[340px]">
          <img
            key={currentSceneImage}
            src={currentSceneImage}
            alt={world.title}
            className="w-full h-full object-cover object-center select-none transition-all duration-700"
            draggable={false}
          />

          {/* Camada de Stickers sobre as Sombras (Apenas enquanto o quarto estiver sendo montado) */}
          {!isRoomFinished &&
            items.map((item) => {
              const isCompleted = !!completedItemIds[item.id];
              const isCurrent = item.id === activeItemId;
              const { x = 50, y = 50, size = 48 } = item.roomPlacement || {};
              const stickerSrc = item.stickerImage || `/images/stickers/${item.id}.png`;

              return (
                <button
                  key={`hotspot-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                    isCurrent ? 'scale-110 z-20' : 'z-10 hover:scale-105'
                  }`}
                  title={isCompleted ? item.displayName : `Descubra este objeto: ${item.displayName}`}
                  aria-label={isCompleted ? item.displayName : `Objeto misterioso`}
                >
                  {isCompleted ? (
                    // Objeto Concluído: Sticker Nítido e Colorido Sobrepondo a Sombra com Perfeição
                    <div className="w-full h-full relative drop-shadow-md animate-pop-in">
                      <img
                        src={stickerSrc}
                        alt={item.displayName}
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-pulse pointer-events-none" />
                      )}
                    </div>
                  ) : (
                    // Objeto Misterioso (Sombra): Indicador Interativo Suave com '?'
                    <div
                      className={`w-full h-full relative flex items-center justify-center rounded-2xl transition-all ${
                        isCurrent
                          ? 'border-2 border-amber-400 bg-amber-400/20 ring-2 ring-amber-300 shadow-sm'
                          : 'hover:bg-amber-400/10'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shadow-xs transition-transform ${
                          isCurrent
                            ? 'bg-amber-400 text-amber-950 scale-110 animate-bounce'
                            : 'bg-sky-200/90 text-sky-800 hover:scale-105'
                        }`}
                      >
                        ?
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
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

                {/* Nome do Objeto */}
                <span
                  className={`text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-wider truncate w-full text-center ${
                    isCompleted
                      ? 'text-emerald-950 font-extrabold'
                      : isCurrent
                      ? 'text-amber-950 font-black'
                      : 'text-stone-400 font-extrabold tracking-widest'
                  }`}
                >
                  {isCompleted ? item.displayName : isCurrent ? item.displayName : '???'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
