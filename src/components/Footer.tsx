import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-amber-100/50 border-t-2 border-amber-200 mt-auto py-6 px-4 select-none text-center">
      <div className="max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-white text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Alfabetização Serena, Afetiva e Inclusiva</span>
        </div>

        <p className="text-xs text-stone-600 font-medium">
          Fundamentado na <strong>BNCC</strong> (Habilidades EF01LP06 e EF01LP08), método fônico e design não-hiperestimulante.
        </p>

        <div className="text-[11px] text-stone-500 space-x-2">
          <span>Acessibilidade WCAG 2.2 / LBI</span>
          <span>•</span>
          <span>Zero Anúncios Invasivos</span>
          <span>•</span>
          <span className="inline-flex items-center gap-0.5 text-amber-800 font-bold">
            <ShieldCheck className="w-3 h-3" />
            Trava Parental
          </span>
        </div>

        <p className="text-[10px] text-stone-400">
          Desenvolvido com carinho por Felipe Coelho © 2026 Soletrando o Mundo.
        </p>
      </div>
    </footer>
  );
};
