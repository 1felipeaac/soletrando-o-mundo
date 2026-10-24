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
    <header className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b-2 border-amber-200 px-3 sm:px-5 py-2.5 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Voltar ao Mapa ou Logo */}
        <div className="flex items-center gap-2 min-w-0">
          {currentView !== 'map' ? (
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center gap-1.5 bg-white hover:bg-amber-100 text-amber-900 font-extrabold px-3 py-1.5 rounded-2xl shadow-xs border-2 border-amber-200 transition-transform active:scale-95 text-xs sm:text-sm cursor-pointer shrink-0"
              title="Voltar ao Mapa"
            >
              <ArrowLeft className="w-4 h-4 text-amber-800" />
              <span>Mapa</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink min-w-0">
              <span className="text-2xl animate-float-gentle shrink-0">🏡</span>
              <div className="text-left min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-amber-950 tracking-tight uppercase leading-none truncate">
                  Soletrando
                </h1>
                <span className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wider block">
                  o Mundo
                </span>
              </div>
            </div>
          )}

          {currentWorldTitle && currentView === 'room' && (
            <span className="bg-white/80 text-amber-900 font-bold px-2.5 py-1 rounded-xl text-xs border border-amber-200 truncate max-w-[130px] sm:max-w-[220px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{currentWorldTitle}</span>
            </span>
          )}
        </div>

        {/* Lado Direito: Estrelas + Trava Parental */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Contador de Estrelas / Itens */}
          <div className="flex items-center gap-1.5 bg-amber-100/80 px-3 py-1.5 rounded-2xl border border-amber-300 shadow-2xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-black text-amber-950">
              {starsCount} / {totalItems}
            </span>
          </div>

          {/* Botão de Trava Parental */}
          <button
            onClick={onOpenParentalGate}
            className="p-2 rounded-2xl bg-white hover:bg-amber-100 text-amber-800 border-2 border-amber-200 shadow-2xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            title="Área dos Pais (Trava Matemática)"
            aria-label="Área dos Pais"
          >
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold hidden sm:inline">Pais</span>
          </button>
        </div>
      </div>
    </header>
  );
};
