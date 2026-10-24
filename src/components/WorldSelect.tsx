import type { WorldRoom } from '../types/game';
import { Star, ChevronRight, Sparkles } from 'lucide-react';

interface WorldSelectProps {
  worlds: WorldRoom[];
  completedItemIds: Record<string, boolean>;
  onSelectWorld: (worldId: number) => void;
}

export const WorldSelect: React.FC<WorldSelectProps> = ({
  worlds,
  completedItemIds,
  onSelectWorld,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-5 select-none space-y-4">
      <div className="text-center space-y-1 mb-5">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Escolha um Lugar para Decorar</span>
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-amber-950 uppercase tracking-tight">
          Mundos do Cotidiano
        </h2>
        <p className="text-xs font-bold text-stone-600">
          Aprenda a soletrar construindo os cômodos e pratos favoritos!
        </p>
      </div>

      <div className="space-y-3.5">
        {worlds.map((world) => {
          const completedCount = world.items.filter((i) => completedItemIds[i.id]).length;
          const isFinished = completedCount === world.items.length;

          return (
            <div
              key={world.id}
              onClick={() => onSelectWorld(world.id)}
              className="bg-white hover:bg-amber-50/60 rounded-3xl border-3 border-amber-200 p-4 sm:p-5 shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Ícone Redondo */}
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border-2 border-amber-300 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {world.icon}
                </div>

                <div className="min-w-0 text-left">
                  <h3 className="text-base sm:text-lg font-black text-amber-950 truncate">
                    {world.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                    {world.description}
                  </p>

                  {/* Barra de Progresso Suave */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-24 bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{
                          width: `${(completedCount / world.items.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-amber-900 flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      {completedCount}/{world.items.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Direito */}
              <div className="shrink-0 flex items-center gap-1.5">
                {isFinished && (
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                    Concluído!
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-amber-800 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
