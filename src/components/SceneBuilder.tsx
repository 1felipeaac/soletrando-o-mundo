import type { ItemStage } from '../types/game';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SceneBuilderProps {
  items: ItemStage[];
  completedItemIds: Record<string, boolean>;
  activeItemId: string;
  onSelectItem: (item: ItemStage) => void;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  items,
  completedItemIds,
  activeItemId,
  onSelectItem,
}) => {
  const completedCount = items.filter((i) => completedItemIds[i.id]).length;
  const isRoomFinished = completedCount === items.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 select-none">
      {/* Moldura do Cômodo / Cenário Quente e Aconchegante */}
      <div className="bg-gradient-to-b from-amber-100/70 via-amber-50 to-orange-50/50 rounded-3xl border-4 border-amber-300 p-4 sm:p-5 shadow-sm relative overflow-hidden">
        {/* Faixa Superior: Progresso de Decoração do Cômodo */}
        <div className="flex items-center justify-between mb-3 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
              {isRoomFinished ? 'Quarto Concluído! 🏆' : 'Montando o Quarto'}
            </span>
          </div>

          <span className="bg-amber-200/90 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl">
            {completedCount} de {items.length} objetos
          </span>
        </div>

        {/* Grade Visual dos Móveis e Objetos do Quarto */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-2">
          {items.map((item) => {
            const isCompleted = !!completedItemIds[item.id];
            const isCurrent = item.id === activeItemId;

            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                  isCurrent
                    ? 'bg-amber-200/90 border-amber-500 shadow-md ring-2 ring-amber-400'
                    : isCompleted
                    ? 'bg-white border-amber-300 hover:border-amber-400 shadow-2xs'
                    : 'bg-stone-100/70 border-stone-300 opacity-60 hover:opacity-80'
                }`}
                title={item.displayName}
              >
                {/* Selo de Concluído */}
                {isCompleted && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Ícone Grande do Objeto */}
                <span
                  className={`text-3xl sm:text-4xl my-1 transition-transform ${
                    isCompleted ? 'scale-105' : 'grayscale opacity-50'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Nome do Objeto */}
                <span
                  className={`text-[11px] sm:text-xs font-black uppercase tracking-wider truncate w-full text-center ${
                    isCompleted ? 'text-amber-950' : 'text-stone-500'
                  }`}
                >
                  {isCompleted ? item.displayName : '???'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mensagem Aconchegante */}
        <div className="mt-3 text-center text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {isRoomFinished
              ? 'Parabéns! Você montou todo o quartinho!'
              : 'Toque em um objeto para soletrar e colocar no quarto!'}
          </span>
        </div>
      </div>
    </div>
  );
};
