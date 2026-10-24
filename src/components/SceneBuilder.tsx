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

  const headerSubtitle = world.sceneSubtitle || 'Toque nos itens para soletrar e montar';
  const successBanner = world.completedBanner || `${world.shortName} 100% Montado!`;
  const sceneImageSrc = world.sceneImage || '/images/bedroom_scene.jpg';

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 select-none">
      {/* Moldura do Cenário Isométrico Vivo (Como no Mockup de Alta Fidelidade) */}
      <div className="bg-white rounded-3xl border-3 border-sky-200 p-3 sm:p-4 shadow-sm relative overflow-hidden space-y-3">
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

        {/* Vista Isométrica em Alta Resolução */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-100 shadow-inner bg-sky-50 aspect-4/3 sm:aspect-16/10 max-h-[220px] sm:max-h-[280px]">
          <img
            src={sceneImageSrc}
            alt={world.title}
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />

          {/* Overlay de Brilho / Conclusão */}
          {isRoomFinished && (
            <div className="absolute inset-0 bg-amber-400/20 backdrop-blur-[1px] flex items-center justify-center p-4">
              <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-400 flex items-center gap-2 animate-pop-in">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin" />
                <span className="font-black text-amber-950 text-sm uppercase">
                  {successBanner}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Esteira Seletora de Móveis e Brinquedos (8 Itens Táteis) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 pt-1">
          {items.map((item) => {
            const isCompleted = !!completedItemIds[item.id];
            const isCurrent = item.id === activeItemId;

            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                  isCurrent
                    ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-400 scale-[1.02]'
                    : isCompleted
                    ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-70 hover:opacity-90'
                }`}
                title={item.displayName}
                aria-label={`Objeto ${item.displayName}`}
              >
                {/* Selo de Concluído */}
                {isCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-2xs z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Ilustração 3D Nítida do Objeto */}
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 my-0.5 transition-transform flex items-center justify-center ${
                    isCompleted ? 'scale-100' : isCurrent ? 'scale-105' : 'grayscale opacity-60'
                  }`}
                >
                  <ItemIllustration itemId={item.id} fallbackIcon={item.icon} className="w-full h-full object-contain" />
                </div>

                {/* Nome do Objeto */}
                <span
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider truncate w-full text-center ${
                    isCurrent
                      ? 'text-amber-950 font-black'
                      : isCompleted
                      ? 'text-emerald-950 font-extrabold'
                      : 'text-stone-500'
                  }`}
                >
                  {isCompleted || isCurrent ? item.displayName : '???'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
