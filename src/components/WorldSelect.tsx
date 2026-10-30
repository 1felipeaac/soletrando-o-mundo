import { useState } from 'react';
import type { WorldRoom } from '../types/game';
import { Star, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { soundService } from '../services/soundService';
import { PRICING } from '../config/pricing';

interface WorldSelectProps {
  worlds: WorldRoom[];
  completedItemIds: Record<string, boolean>;
  onSelectWorld: (worldId: number) => void;
  isRoomLicensed?: (roomId: number, isFree?: boolean) => boolean;
  onOpenPaywall?: (room: WorldRoom) => void;
}

export const WorldSelect: React.FC<WorldSelectProps> = ({
  worlds,
  completedItemIds,
  onSelectWorld,
  isRoomLicensed,
  onOpenPaywall,
}) => {
  const [lockedNoticeId, setLockedNoticeId] = useState<number | null>(null);

  // Total de estrelas conquistadas pelo jogador (1 por item completado)
  const totalStarsEarned = Object.keys(completedItemIds).filter((id) => completedItemIds[id]).length;

  const handleCardClick = (world: WorldRoom, isLocked: boolean, isPaymentLocked: boolean) => {
    if (isPaymentLocked) {
      soundService.playBoing();
      if (onOpenPaywall) {
        onOpenPaywall(world);
      }
      return;
    }

    if (isLocked) {
      soundService.playBoing();
      setLockedNoticeId(world.id);
      setTimeout(() => {
        setLockedNoticeId((curr) => (curr === world.id ? null : curr));
      }, 4000);
      return;
    }

    soundService.playWoodClick();
    onSelectWorld(world.id);
  };

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

          // Checagem de Licença Paga (se não for gratuito e não tiver licença)
          const isLicensed = isRoomLicensed ? isRoomLicensed(world.id, world.isFree) : true;
          const isPaymentLocked = !isLicensed;

          // Parâmetro de Desbloqueio por Estrelas (Threshold Progressivo)
          const requiredStars = world.requiredStars ?? 0;
          const isLocked = totalStarsEarned < requiredStars;
          const missingStars = Math.max(0, requiredStars - totalStarsEarned);

          // Paletas de cores suaves por tema
          const THEME_STYLES: Record<string, { card: string; pin: string; bar: string }> = {
            casa: {
              card: 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-300 hover:border-amber-400',
              pin: 'bg-amber-500',
              bar: 'bg-amber-500',
            },
            comida: {
              card: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300 hover:border-emerald-400',
              pin: 'bg-emerald-600',
              bar: 'bg-emerald-500',
            },
            sala: {
              card: 'bg-gradient-to-br from-violet-50 via-white to-purple-50 border-violet-300 hover:border-violet-400',
              pin: 'bg-violet-600',
              bar: 'bg-violet-500',
            },
            banheiro: {
              card: 'bg-gradient-to-br from-cyan-50 via-white to-sky-50 border-cyan-300 hover:border-cyan-400',
              pin: 'bg-cyan-600',
              bar: 'bg-cyan-500',
            },
            jardim: {
              card: 'bg-gradient-to-br from-lime-50 via-white to-green-50 border-lime-300 hover:border-lime-400',
              pin: 'bg-lime-600',
              bar: 'bg-lime-500',
            },
            bonus: {
              card: 'bg-gradient-to-br from-rose-50 via-white to-pink-50 border-rose-300 hover:border-rose-400',
              pin: 'bg-rose-500',
              bar: 'bg-rose-500',
            },
          };

          const style = THEME_STYLES[world.theme] || {
            card: 'bg-gradient-to-br from-sky-50 via-white to-blue-50 border-sky-300 hover:border-sky-400',
            pin: 'bg-sky-500',
            bar: 'bg-sky-500',
          };

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
                onClick={() => handleCardClick(world, isLocked, isPaymentLocked)}
                className={`w-full rounded-3xl p-4 sm:p-5 border-3 transition-all cursor-pointer relative overflow-hidden ${
                  isPaymentLocked
                    ? 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border-amber-300 hover:border-amber-400 shadow-xs'
                    : isLocked
                    ? 'bg-gradient-to-br from-slate-50 via-white to-amber-50/40 border-dashed border-amber-300 hover:border-amber-400 opacity-90 shadow-xs'
                    : `${style.card} shadow-sm active:scale-98 group`
                }`}
              >
                {/* Pin Flutuante de Estrela (como no mockup) */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {isPaymentLocked ? (
                    <div className="inline-flex items-center gap-1.5 bg-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-200" />
                      <span>Mundo {world.id}</span>
                    </div>
                  ) : isLocked ? (
                    <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mundo {world.id}</span>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-1.5 ${style.pin} text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0`}>
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Mundo {world.id}</span>
                    </div>
                  )}

                  {isPaymentLocked ? (
                    <span className="bg-amber-100 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl border border-amber-300 shadow-2xs flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Desbloquear (R$ {PRICING.SINGLE_ROOM.price})</span>
                    </span>
                  ) : isLocked ? (
                    <span className="bg-amber-100/90 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Falta{missingStars > 1 ? 'm' : ''} {missingStars} ⭐</span>
                    </span>
                  ) : completedCount === world.items.length ? (
                    <span className="bg-emerald-50 text-emerald-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1 whitespace-nowrap shrink-0">
                      <span>🧩</span>
                      <span>100% • Memória</span>
                    </span>
                  ) : (
                    <span className="bg-white/90 text-slate-800 text-xs font-black px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs whitespace-nowrap shrink-0">
                      ⭐ {completedCount}/{world.items.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Ícone 3D / Ilustração da Ilha */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white flex items-center justify-center text-4xl border-2 border-slate-200 shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden relative">
                    {world.sceneImage ? (
                      <img
                        src={world.sceneImage}
                        alt={world.shortName}
                        className={`w-full h-full object-cover object-center rounded-xl mx-auto block transition-all duration-500 ${
                          isLocked
                            ? 'blur-[3px] opacity-60 scale-105'
                            : isFinished
                            ? 'filter-none scale-100'
                            : 'blur-[2px] scale-105'
                        }`}
                      />
                    ) : (
                      <span role="img" aria-label={world.shortName} className={isLocked ? 'opacity-40' : ''}>
                        {world.icon}
                      </span>
                    )}

                    {isLocked && (
                      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-amber-400 border border-amber-500 shadow-xs flex items-center justify-center">
                          <Lock className="w-4 h-4 text-amber-950" />
                        </div>
                      </div>
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

                    {/* Barra de Progresso ou Indicador de Desbloqueio */}
                    {isLocked ? (
                      <div className="flex items-center gap-1.5 mt-2.5 text-amber-800 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Colete mais {missingStars} estrelinha{missingStars > 1 ? 's' : ''} para liberar!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex-1 max-w-[140px] bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                          <div
                            className={`h-full rounded-full transition-all ${style.bar}`}
                            style={{
                              width: `${(completedCount / world.items.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-black text-slate-700">
                          {Math.round((completedCount / world.items.length) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botão de Entrada ou Cadeado */}
                  <div className="shrink-0 flex items-center">
                    {isLocked ? (
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 shadow-2xs flex items-center justify-center text-amber-800">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-2xs group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-600 flex items-center justify-center text-slate-700 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Selo de Concluído */}
                {isFinished && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-800">
                    <span>🏆 Mundo 100% Decorado!</span>
                    <span>Toque para rever</span>
                  </div>
                )}

                {/* Aviso Acolhedor se Clicar em Mundo Bloqueado */}
                {isLocked && lockedNoticeId === world.id && (
                  <div className="mt-3 p-2.5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 text-amber-950 text-xs font-black flex items-center gap-2 animate-bounce-gentle">
                    <span className="text-base shrink-0">✨</span>
                    <span>
                      Quase lá! Conquiste mais {missingStars} {missingStars === 1 ? 'estrelinha' : 'estrelinhas'} nos cômodos anteriores para abrir {world.shortName}!
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Próximo Mundo Futuro (Ilha Bloqueada - Mundo 7) */}
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
                  Mundo 7 • Em Breve
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-800">
                  A Floresta Encantada
                </h4>
                <p className="text-xs text-slate-500">
                  Complete todos os cômodos da casa para desbloquear a aventura na floresta!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
