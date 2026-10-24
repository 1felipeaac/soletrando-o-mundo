import { ArrowLeft, Star, ShieldCheck, MapPin } from 'lucide-react';

interface NavbarProps {
  currentView: 'map' | 'room';
  onNavigate: (view: 'map' | 'room') => void;
  starsCount: number;
  totalItems: number;
  currentWorldTitle?: string;
  onOpenParentalGate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  starsCount,
  totalItems,
  currentWorldTitle,
  onOpenParentalGate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#e8f4fc]/95 backdrop-blur-md border-b-2 border-sky-200/80 px-3 sm:px-6 py-2.5 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Lado Esquerdo: Voltar ao Mapa ou Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {currentView !== 'map' ? (
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center gap-1.5 bg-white hover:bg-sky-50 text-sky-900 font-black px-3.5 py-2 rounded-2xl shadow-xs border-2 border-sky-200 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer shrink-0"
              title="Voltar ao Mapa"
            >
              <ArrowLeft className="w-4 h-4 text-sky-700" />
              <span>Mapa</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink min-w-0">
              <span className="text-2xl animate-float-gentle shrink-0" role="img" aria-label="Casa">🏡</span>
              <div className="text-left min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-none truncate">
                  Soletrando o Mundo
                </h1>
                <span className="text-[10px] sm:text-xs font-bold text-sky-700 tracking-wide block">
                  Alfabetização Serena
                </span>
              </div>
            </div>
          )}

          {currentWorldTitle && currentView === 'room' && (
            <span className="bg-white/90 text-sky-900 font-bold px-3 py-1.5 rounded-xl text-xs border border-sky-200 truncate max-w-[140px] sm:max-w-[240px] flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{currentWorldTitle}</span>
            </span>
          )}
        </div>

        {/* Lado Direito: Estrelas + Trava Parental */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Badge de Estrelas / Pontuação */}
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-sky-200 shadow-xs">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 drop-shadow-2xs" />
            <span className="text-xs sm:text-sm font-black text-slate-800">
              {starsCount * 40 || starsCount} <span className="text-slate-400 font-semibold text-[11px]">({starsCount}/{totalItems})</span>
            </span>
          </div>

          {/* Botão de Trava Parental (Área dos Pais) */}
          <button
            onClick={onOpenParentalGate}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-600 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Área dos Pais (Trava Matemática)"
            aria-label="Área dos Pais"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-xs font-black hidden sm:inline">Pais</span>
          </button>
        </div>
      </div>
    </header>
  );
};
