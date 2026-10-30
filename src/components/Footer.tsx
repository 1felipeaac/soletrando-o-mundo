import React from 'react';
import { Heart, ShieldCheck, FileText, Lock, Smartphone } from 'lucide-react';
import { soundService } from '../services/soundService';

interface FooterProps {
  onOpenPrivacyTerms?: (tab: 'privacy' | 'terms') => void;
  onOpenParentalGate?: () => void;
  onOpenInstallHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyTerms,
  onOpenParentalGate,
  onOpenInstallHelp,
}) => {
  return (
    <footer className="w-full bg-amber-100/50 border-t-2 border-amber-200 mt-auto py-6 px-4 select-none text-center">
      <div className="max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-white text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Alfabetização Serena, Afetiva e Inclusiva</span>
        </div>

        <p className="text-xs text-stone-600 font-medium">
          Fundamentado na <strong>BNCC</strong> (Habilidades EF01LP06 e EF01LP08), método fônico e design não-hiperestimulante (SBP).
        </p>

        {/* Botão de Destaque: Instalação no Celular / Tablet */}
        {onOpenInstallHelp && (
          <div className="pt-0.5">
            <button
              onClick={() => {
                soundService.playWoodClick();
                onOpenInstallHelp();
              }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-2xl border border-amber-500 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Como colocar o Soletrando na tela inicial do seu celular ou tablet"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-950" />
              <span>Como instalar no celular / tablet</span>
            </button>
          </div>
        )}

        {/* Links de Segurança e Conformidade Jurídica */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-stone-600 font-semibold pt-1">
          <button
            onClick={() => {
              soundService.playWoodClick();
              onOpenPrivacyTerms?.('privacy');
            }}
            className="hover:text-sky-800 underline cursor-pointer inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Privacidade (LGPD)</span>
          </button>
          <span>•</span>
          <button
            onClick={() => {
              soundService.playWoodClick();
              onOpenPrivacyTerms?.('terms');
            }}
            className="hover:text-sky-800 underline cursor-pointer inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-sky-600" />
            <span>Termos de Uso</span>
          </button>
          <span>•</span>
          <button
            onClick={() => {
              soundService.playWoodClick();
              onOpenParentalGate?.();
            }}
            className="hover:text-amber-900 font-bold text-amber-800 underline cursor-pointer inline-flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Área dos Pais</span>
          </button>
        </div>

        <div className="text-[10px] text-stone-500 space-x-2 pt-1">
          <span>Acessibilidade WCAG 2.2 / LBI</span>
          <span>•</span>
          <span>100% Offline</span>
          <span>•</span>
          <span>Zero Anúncios Invasivos</span>
        </div>

        <p className="text-[10px] text-stone-400">
          Desenvolvido com carinho por Felipe Coelho © 2026 Soletrando o Mundo.
        </p>
      </div>
    </footer>
  );
};
