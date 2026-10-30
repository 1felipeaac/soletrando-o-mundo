import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Download,
  Share,
  PlusSquare,
  MoreVertical,
  Laptop,
  Maximize2,
  WifiOff,
  Zap,
  Sparkles,
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { pwaService, type DevicePlatform } from '../services/pwaService';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<DevicePlatform>(() => pwaService.getPlatform());
  const [canInstall, setCanInstall] = useState<boolean>(() => pwaService.canInstall());
  const [isStandalone, setIsStandalone] = useState<boolean>(() => pwaService.isStandalone());
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPlatform(pwaService.getPlatform());
      setCanInstall(pwaService.canInstall());
      setIsStandalone(pwaService.isStandalone());
    }
  }, [isOpen]);

  useEffect(() => {
    return pwaService.subscribe(() => {
      setCanInstall(pwaService.canInstall());
      setIsStandalone(pwaService.isStandalone());
    });
  }, []);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    soundService.playSnap();
    const accepted = await pwaService.install();
    if (accepted) {
      soundService.playFanfare();
      setJustInstalled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-amber-300 w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 px-4 sm:px-6 py-3.5 border-b-2 border-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-700 flex items-center justify-center border-2 border-amber-300 shadow-xs shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  Soletrando na Tela Inicial
                </h3>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 border border-amber-300 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-800" />
                  App Gratuito
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-amber-900/80">
                Experiência de tela cheia, sem distrações e 100% offline
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playWoodClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer transition-colors shadow-xs shrink-0"
            title="Fechar"
            aria-label="Fechar modal de instalação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Alerta de aplicativo já instalado */}
          {isStandalone || justInstalled ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-900 animate-pop-in shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong className="block font-black text-emerald-950">
                  Parabéns! O Soletrando já está instalado no seu dispositivo.
                </strong>
                <span>
                  Você já aproveita a experiência completa de tela cheia sem barras de navegador.
                </span>
              </div>
            </div>
          ) : null}

          {/* Botão de Instalação Direta (quando suportado pelo navegador, ex: Android Chrome) */}
          {canInstall && !isStandalone && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-md border-2 border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight">
                  Instalação Rápida com 1 Toque
                </h4>
                <p className="text-xs text-amber-950/90 font-semibold mt-0.5">
                  Seu navegador permite instalar o ícone agora mesmo!
                </p>
              </div>
              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-amber-300 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Instalar Agora</span>
              </button>
            </div>
          )}

          {/* Seletor de Plataforma */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
              Escolha seu dispositivo para ver o passo a passo:
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setPlatform('android');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                  platform === 'android'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setPlatform('ios');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                  platform === 'ios'
                    ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setPlatform('desktop');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                  platform === 'desktop'
                    ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Laptop className="w-4 h-4 text-purple-600" />
                <span>Computador</span>
              </button>
            </div>
          </div>

          {/* Guias Passo a Passo */}
          <div className="bg-slate-50/80 rounded-2xl border-2 border-slate-200 p-3.5 sm:p-4 space-y-3">
            {platform === 'android' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    No <strong>Google Chrome</strong>, toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito da tela.
                  </p>
                  <MoreVertical className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Selecione a opção <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
                  </p>
                  <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Toque em <strong>&ldquo;Instalar&rdquo;</strong> para confirmar. O ícone da casinha 🏡 aparecerá na sua tela de início!
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            )}

            {platform === 'ios' && (
              <div className="space-y-3">
                <div className="bg-sky-100/60 border border-sky-300 rounded-xl p-2.5 text-[11px] text-sky-900 font-medium">
                  💡 <strong>No Safari do iPhone/iPad:</strong> A Apple exige que a instalação seja feita pelo menu de Compartilhamento em apenas 3 toques:
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    No navegador <strong>Safari</strong>, toque no botão de <strong>Compartilhar</strong> (quadradinho com seta para cima na barra inferior).
                  </p>
                  <Share className="w-4 h-4 text-sky-600 shrink-0" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Role a folha de opções para cima e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
                  </p>
                  <PlusSquare className="w-4 h-4 text-sky-600 shrink-0" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Toque em <strong>&ldquo;Adicionar&rdquo;</strong> no canto superior direito. Pronto! O app fica na tela com os outros joguinhos.
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                </div>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    No <strong>Chrome</strong> ou <strong>Edge</strong>, olhe para a barra de endereços (onde fica o link do jogo).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Clique no ícone de <strong>Instalar</strong> (monitor com setinha para baixo, ao lado do botão de favoritos).
                  </p>
                  <Download className="w-4 h-4 text-purple-600 shrink-0" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">
                    Clique em <strong>&ldquo;Instalar&rdquo;</strong>. O jogo abrirá em tela exclusiva e criará um atalho na sua Área de Trabalho!
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Vantagens para Pais e Crianças (Design Calmo e Confortável) */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3.5 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Por que vale a pena colocar na tela inicial?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
              <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                <Maximize2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-slate-800">Tela Cheia Imersiva</strong>
                  <span className="text-slate-600">A criança não fecha abas nem clica na barra de busca sem querer.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-slate-800">Acesso em 1 Toque</strong>
                  <span className="text-slate-600">Abre direto com o ícone da casinha, sem precisar digitar nada.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-slate-800">100% Offline</strong>
                  <span className="text-slate-600">Sons e fases funcionam mesmo no carro ou sem sinal de Wi-Fi.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-slate-800">Super Leve e Seguro</strong>
                  <span className="text-slate-600">Não ocupa gigabytes do aparelho nem instala vírus ou anúncios.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={() => {
              soundService.playWoodClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-black text-xs sm:text-sm cursor-pointer transition-all shadow-xs"
          >
            Entendido, obrigado!
          </button>
        </div>
      </div>
    </div>
  );
};
