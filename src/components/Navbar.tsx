import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShieldCheck, MapPin, Download, Sparkles } from 'lucide-react';
import { pwaService } from '../services/pwaService';

interface NavbarProps {
  currentView: 'map' | 'room';
  onNavigate: (view: 'map' | 'room') => void;
  starsCount: number;
  totalItems: number;
  currentWorldTitle?: string;
  onOpenParentalGate: () => void;
  onOpenPaywall?: () => void;
  isFullHouseUnlocked?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  starsCount,
  totalItems,
  currentWorldTitle,
  onOpenParentalGate,
  onOpenPaywall,
  isFullHouseUnlocked,
}) => {
  const [canInstall, setCanInstall] = useState(pwaService.canInstall());

  useEffect(() => {
    return pwaService.subscribe(() => {
      setCanInstall(pwaService.canInstall());
    });
  }, []);

  const handleInstallClick = async () => {
    await pwaService.install();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#e8f4fc]/95 backdrop-blur-md border-b-2 border-sky-200/80 px-3 sm:px-6 lg:px-8 py-2.5 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
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

        {/* Lado Direito: PWA Install + Desbloquear Casa + Estrelas + Trava Parental */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Botão de Desbloqueio da Casa Completa */}
          {!isFullHouseUnlocked && onOpenPaywall && (
            <button
              onClick={onOpenPaywall}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-2xl border border-amber-400 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
              title="Desbloquear todos os cômodos da casa (R$ 15)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950" />
              <span>Desbloquear Casa (R$ 15)</span>
            </button>
          )}

          {/* Botão de Instalação PWA */}
          {canInstall && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black px-2.5 sm:px-3.5 py-1.5 rounded-2xl border border-amber-500 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
              title="Instalar Aplicativo no Dispositivo"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950" />
              <span className="hidden xs:inline">Instalar App</span>
            </button>
          )}

          {/* Badge de Estrelas / Pontuação 1:1 */}
          <div
            className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3.5 py-1.5 rounded-full border border-sky-200 shadow-xs"
            title={`${starsCount} de ${totalItems} estrelas conquistadas`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 drop-shadow-2xs" />
            <span className="text-xs sm:text-sm font-black text-slate-800">
              {starsCount} <span className="text-slate-400 font-semibold text-[10px] sm:text-[11px]">/ {totalItems}</span>
            </span>
          </div>

          {/* Botão de Trava Parental (Área dos Pais) */}
          <button
            onClick={onOpenParentalGate}
            className="p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-600 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
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
