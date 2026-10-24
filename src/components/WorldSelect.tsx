import type { WorldRoom } from '../types/game';
import { Star, ChevronRight, Sparkles, Lock } from 'lucide-react';

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
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 select-none space-y-4 sm:space-y-5">
      {/* Título de Boas-Vindas */}
      <div className="text-center space-y-1 mb-2">
        <span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 font-extrabold text-xs px-3.5 py-1 rounded-full border border-sky-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Mapa da Aventura</span>
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Escolha um Mundo para Brincar
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Soletre palavras do cotidiano e monte cada cantinho!
        </p>
      </div>

      {/* Trilha Orgânica de Ilhas (Conforme Mockup de Alta Fidelidade) */}
      <div className="relative flex flex-col items-center gap-4 py-2">
        {worlds.map((world, index) => {
          const completedCount = world.items.filter((i) => completedItemIds[i.id]).length;
          const isFinished = completedCount === world.items.length;
          const isFirst = index === 0;

          return (
            <div key={world.id} className="w-full flex flex-col items-center">
              {/* Conector de Ponte de Madeira entre as ilhas */}
              {index > 0 && (
                <div className="w-16 h-8 my-1 flex flex-col items-center justify-center relative">
                  {/* Pranchas de Madeira */}
                  <div className="w-8 h-full bg-[#B45309] border-x-2 border-[#78350F] rounded-xs shadow-inner flex flex-col justify-around py-0.5">
                    <div className="w-full h-0.5 bg-[#D97706]" />
                    <div className="w-full h-0.5 bg-[#D97706]" />
                    <div className="w-full h-0.5 bg-[#D97706]" />
                  </div>
                </div>
              )}

              {/* Card / Ilha do Mundo */}
              <div
                onClick={() => onSelectWorld(world.id)}
                className={`w-full rounded-3xl p-4 sm:p-5 shadow-sm border-3 transition-all cursor-pointer active:scale-98 group relative overflow-hidden ${
                  isFirst
                    ? 'bg-gradient-to-br from-sky-50 via-white to-blue-50 border-sky-300 hover:border-sky-400'
                    : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300 hover:border-emerald-400'
                }`}
              >
                {/* Pin Flutuante de Estrela (como no mockup) */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="inline-flex items-center gap-1.5 bg-sky-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Mundo {world.id}</span>
                  </div>

                  <span className="bg-white/90 text-slate-800 text-xs font-black px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    ⭐ {completedCount} de {world.items.length} estrelas
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Ícone 3D / Ilustração da Ilha: Sombreada durante a montagem e Completa quando 100% decorada */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white flex items-center justify-center text-4xl border-2 border-slate-200 shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                    {world.sceneImage ? (
                      <img
                        src={world.sceneImage}
                        alt={world.shortName}
                        className={`w-full h-full object-cover object-center rounded-xl mx-auto block transition-all duration-500 ${
                          isFinished ? 'filter-none scale-100' : 'blur-[2px] scale-105'
                        }`}
                      />
                    ) : (
                      <span role="img" aria-label={world.shortName}>
                        {world.icon}
                      </span>
                    )}
                  </div>

                  {/* Informações do Mundo */}
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 truncate leading-snug">
                      {world.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                      {world.description}
                    </p>

                    {/* Barra de Progresso Acessível */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex-1 max-w-[140px] bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFirst ? 'bg-sky-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${(completedCount / world.items.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-black text-slate-700">
                        {Math.round((completedCount / world.items.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Botão de Entrada */}
                  <div className="shrink-0 flex items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-2xs group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-600 flex items-center justify-center text-slate-700 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Selo de Concluído */}
                {isFinished && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-800">
                    <span>🏆 Mundo 100% Decorado!</span>
                    <span>Toque para rever</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Próximo Mundo Futuro (Ilha Bloqueada - Mundo 3) */}
        <div className="w-full flex flex-col items-center opacity-75">
          {/* Ponte */}
          <div className="w-8 h-8 my-1 bg-[#B45309] border-x-2 border-[#78350F] rounded-xs shadow-inner flex flex-col justify-around py-0.5">
            <div className="w-full h-0.5 bg-[#D97706]" />
            <div className="w-full h-0.5 bg-[#D97706]" />
          </div>

          <div className="w-full rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-dashed border-amber-300 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-200/60 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                <Lock className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
                  Mundo 3 • Em Breve
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-800">
                  A Floresta Encantada
                </h4>
                <p className="text-xs text-slate-500">
                  Complete os cômodos para desbloquear novos animais!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
