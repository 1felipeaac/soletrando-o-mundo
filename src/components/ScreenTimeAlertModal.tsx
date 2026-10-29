import React from 'react';
import { Heart, Droplets, Sparkles, X } from 'lucide-react';
import { soundService } from '../services/soundService';

interface ScreenTimeAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesPlayed: number;
  onSnooze5Min: () => void;
}

export const ScreenTimeAlertModal: React.FC<ScreenTimeAlertModalProps> = ({
  isOpen,
  onClose,
  minutesPlayed,
  onSnooze5Min,
}) => {
  if (!isOpen) return null;

  const handlePauseNow = () => {
    soundService.playSnap();
    onClose();
  };

  const handleSnooze = () => {
    soundService.playWoodClick();
    onSnooze5Min();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-gradient-to-b from-sky-50 via-white to-amber-50 rounded-3xl border-4 border-sky-300 p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl relative animate-pop-in">
        <button
          onClick={handlePauseNow}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border border-slate-200"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto border-2 border-sky-300 shadow-inner mb-3">
          <span className="text-3xl" role="img" aria-label="Sol Sorridente">🌤️</span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-sky-600" />
          <span>Hora da Pausa Saudável</span>
        </div>

        <h3 className="text-xl font-black text-slate-800 leading-tight">
          Descanso para os Olhinhos!
        </h3>

        <p className="text-xs font-bold text-slate-600 mt-2 leading-relaxed">
          Você já brincou por <strong>{minutesPlayed} minutos</strong>! Que tal agora descansar um pouquinho os olhinhos, tomar uma água fresquinha e dar um abraço bem gostoso na família?
        </p>

        <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3 my-4 flex items-center justify-center gap-3 text-amber-950 text-xs font-extrabold">
          <span className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            Tomar Água
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Abraçar a Família
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handlePauseNow}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white font-black py-3 px-4 rounded-2xl shadow-md border border-sky-600 cursor-pointer text-xs sm:text-sm uppercase tracking-wider transition-all"
          >
            Vou fazer uma pausa agora! 🌤️
          </button>

          <button
            onClick={handleSnooze}
            className="w-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold py-2.5 px-4 rounded-2xl border border-slate-300 cursor-pointer text-xs transition-all"
          >
            Mais 5 minutinhos
          </button>
        </div>
      </div>
    </div>
  );
};
