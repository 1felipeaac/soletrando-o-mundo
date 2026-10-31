import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  X,
  CheckCircle2,
  CheckCircle,
  BookOpen,
  Clock,
  Sparkles,
  Heart,
  FileText,
  ExternalLink,
  Lightbulb,
  Smartphone,
  Download,
  Share,
  PlusSquare,
  MoreVertical,
  Laptop,
  Maximize2,
  WifiOff,
  Zap,
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { WORLDS_DATA } from '../data/worldsData';
import { pwaService, type DevicePlatform } from '../services/pwaService';
import type { PlayerProgress, ParentSettings } from '../types/game';

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onConfirmReset: () => void;
  onOpenPrivacyTerms?: (initialTab: 'privacy' | 'terms') => void;
  sessionElapsedMinutes: number;
  onUpdateSettings?: (settings: ParentSettings) => void;
  initialTab?: 'report' | 'time' | 'privacy' | 'terms' | 'install';
}

interface MathProblem {
  num1: number;
  operator: string;
  num2: number;
  answer: number;
  options: number[];
}

function generateMathProblem(): MathProblem {
  const isAddition = Math.random() > 0.4;
  if (isAddition) {
    const num1 = Math.floor(Math.random() * 8) + 4; // 4 a 11
    const num2 = Math.floor(Math.random() * 7) + 3; // 3 a 9
    const answer = num1 + num2;
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const candidate = answer + offset;
      if (candidate > 0 && candidate !== answer) {
        distractors.add(candidate);
      }
    }
    const options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    return { num1, operator: '+', num2, answer, options };
  } else {
    const num1 = Math.floor(Math.random() * 9) + 10; // 10 a 18
    const num2 = Math.floor(Math.random() * 6) + 3;  // 3 a 8
    const answer = num1 - num2;
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const candidate = answer + offset;
      if (candidate > 0 && candidate !== answer) {
        distractors.add(candidate);
      }
    }
    const options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    return { num1, operator: '-', num2, answer, options };
  }
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({
  isOpen,
  onClose,
  progress,
  onConfirmReset,
  sessionElapsedMinutes,
  onUpdateSettings,
  initialTab = 'report',
}) => {
  // Se abrir diretamente para ler privacidade, termos ou instalar app, dispensa a trava matemática
  const isPublicLegalTab = initialTab === 'privacy' || initialTab === 'terms' || initialTab === 'install';
  const [isAuthenticated, setIsAuthenticated] = useState(isPublicLegalTab);
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'report' | 'time' | 'privacy' | 'terms' | 'install'>(initialTab);
  const [reportSubView, setReportSubView] = useState<'bncc' | 'rooms'>('bncc');
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(() => {
    return progress.parentSettings?.screenTimeLimitMinutes ?? 20;
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Estados de Instalação PWA
  const [installPlatform, setInstallPlatform] = useState<DevicePlatform>(() => pwaService.getPlatform());
  const [installCanInstall, setInstallCanInstall] = useState<boolean>(() => pwaService.canInstall());
  const [installIsStandalone, setInstallIsStandalone] = useState<boolean>(() => pwaService.isStandalone());
  const [installJustInstalled, setInstallJustInstalled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInstallPlatform(pwaService.getPlatform());
      setInstallCanInstall(pwaService.canInstall());
      setInstallIsStandalone(pwaService.isStandalone());
    }
  }, [isOpen]);

  useEffect(() => {
    return pwaService.subscribe(() => {
      setInstallCanInstall(pwaService.canInstall());
      setInstallIsStandalone(pwaService.isStandalone());
    });
  }, []);

  const totalWordsCount = WORLDS_DATA.reduce((acc, w) => acc + w.items.length, 0);
  const completedWordsCount = Object.keys(progress.completedItems).length;
  const completedRoomsCount = WORLDS_DATA.filter((w) =>
    w.items.every((item) => !!progress.completedItems[item.id])
  ).length;

  const bncc06Items = WORLDS_DATA.flatMap((w) => w.items).filter((i) => i.bnccCode === 'EF01LP06');
  const bncc06Completed = bncc06Items.filter((i) => !!progress.completedItems[i.id]).length;

  const bncc08Items = WORLDS_DATA.flatMap((w) => w.items).filter((i) => i.bnccCode === 'EF01LP08');
  const bncc08Completed = bncc08Items.filter((i) => !!progress.completedItems[i.id]).length;

  if (!isOpen) return null;

  const handleSelectOption = (selected: number) => {
    if (selected === problem.answer) {
      soundService.playSnap();
      setErrorMessage(null);
      setIsAuthenticated(true);
    } else {
      soundService.playBoing();
      setErrorMessage('Ops! Resposta incorreta. Tente este novo cálculo:');
      setProblem(generateMathProblem());
    }
  };

  const handleSaveScreenTime = (limitMinutes: number) => {
    soundService.playSnap();
    setSelectedTimeLimit(limitMinutes);
    const updated = storageService.saveParentSettings({
      screenTimeLimitMinutes: limitMinutes,
    });
    if (onUpdateSettings) {
      onUpdateSettings(updated);
    }
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  const handleExecuteReset = () => {
    soundService.playFanfare();
    onConfirmReset();
    setShowResetConfirm(false);
    onClose();
  };

  const handleDirectInstall = async () => {
    soundService.playSnap();
    const accepted = await pwaService.install();
    if (accepted) {
      soundService.playFanfare();
      setInstallJustInstalled(true);
    }
  };

  const selectedRoom = WORLDS_DATA.find((w) => w.id === selectedRoomId) || WORLDS_DATA[0];
  const selectedRoomDone = selectedRoom.items.filter((i) => !!progress.completedItems[i.id]).length;
  const isSelectedRoomAllDone = selectedRoomDone === selectedRoom.items.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in">
      <div className={`bg-white rounded-3xl border-4 border-amber-300 w-full ${!isAuthenticated ? 'max-w-md' : 'max-w-2xl'} max-h-[90vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in transition-all duration-300`}>
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 px-4 sm:px-6 py-3 sm:py-3.5 border-b-2 border-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white text-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 leading-tight">
                  Área da Família & Educador
                </h3>
                {isAuthenticated && (
                  <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Autorizado
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-900/80">
                Acompanhamento pedagógico, saúde digital e transparência
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
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passo 1: Desafio Matemático de Trava Parental */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5">
            <div className="max-w-sm mx-auto text-center space-y-2.5 sm:space-y-3 pt-1 pb-2">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-700" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                  Trava Parental Obrigatória
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-800 mt-1">
                  Confirme que você é um adulto
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Para proteger o progresso da criança, resolva o cálculo:
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-2.5 sm:p-3 border-2 border-amber-300 shadow-inner">
                <span className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase block mb-0.5">
                  Quanto é:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-950 tracking-wider">
                  {problem.num1} {problem.operator} {problem.num2} = ?
                </span>
              </div>

              {errorMessage && (
                <div className="text-xs font-black text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
                {problem.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-black text-lg sm:text-xl border-2 border-amber-300 shadow-xs transition-all cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 block mx-auto pt-1 cursor-pointer"
              >
                Cancelar e voltar ao jogo
              </button>
            </div>
          </div>
        ) : (
          /* Passo 2: O Dashboard Completo dos Pais com Abas Arejadas */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Seletor de Abas Principais */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-4 pt-2.5 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('report');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'report'
                    ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Relatório</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('time');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'time'
                    ? 'bg-white text-sky-950 border-t-2 border-x-2 border-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Tempo de Tela</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('install');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'install'
                    ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Instalar App</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('privacy');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'privacy'
                    ? 'bg-white text-emerald-950 border-t-2 border-x-2 border-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Privacidade</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('terms');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'terms'
                    ? 'bg-white text-sky-950 border-t-2 border-x-2 border-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Termos de Uso</span>
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* ABA 1: Relatório Pedagógico Arejado */}
              {activeTab === 'report' && (
                <div className="space-y-4">
                  {/* Banner Convite para Instalação no Celular */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 shrink-0">
                        <Smartphone className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h5 className="font-black text-xs sm:text-sm text-slate-800">
                          Jogue em Tela Cheia no Celular ou Tablet
                        </h5>
                        <p className="text-[11px] text-slate-600 font-medium">
                          Evita que a criança feche abas por engano e funciona 100% offline.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        soundService.playWoodClick();
                        setActiveTab('install');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl border border-amber-600 shadow-2xs cursor-pointer transition-all shrink-0"
                    >
                      Como Instalar
                    </button>
                  </div>

                  {/* Cards de Métricas Principais */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center shadow-2xs">
                      <div className="text-xl sm:text-2xl font-black text-amber-900">
                        {progress.starsCount} <span className="text-xs font-normal">/ {totalWordsCount}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mt-0.5">
                        ⭐ Estrelas (1:1)
                      </div>
                    </div>

                    <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center shadow-2xs">
                      <div className="text-xl sm:text-2xl font-black text-sky-900">
                        {completedWordsCount} <span className="text-xs font-normal">/ {totalWordsCount}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-sky-800 uppercase tracking-wider mt-0.5">
                        📖 Palavras
                      </div>
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center shadow-2xs">
                      <div className="text-xl sm:text-2xl font-black text-emerald-900">
                        {completedRoomsCount} <span className="text-xs font-normal">/ {WORLDS_DATA.length}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                        🏆 Cômodos
                      </div>
                    </div>
                  </div>

                  {/* Seletor Arejado de Sub-Visão do Relatório */}
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5">
                    <button
                      onClick={() => {
                        soundService.playWoodClick();
                        setReportSubView('bncc');
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        reportSubView === 'bncc'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Habilidades BNCC</span>
                    </button>

                    <button
                      onClick={() => {
                        soundService.playWoodClick();
                        setReportSubView('rooms');
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        reportSubView === 'rooms'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <span>🏠 Vocabulário por Cômodo</span>
                    </button>
                  </div>

                  {/* Sub-Visão 1: Habilidades BNCC */}
                  {reportSubView === 'bncc' && (
                    <div className="space-y-3 animate-fade-in">
                      {/* BNCC EF01LP06 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                              EF01LP06
                            </span>
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                              Consciência Fonológica e Sílabas Simples (C-V)
                            </span>
                          </div>
                          <span className="text-xs font-black text-blue-700">
                            {bncc06Completed} / {bncc06Items.length}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                          Capacidade de segmentar a palavra em pedacinhos sonoros e associar cada letra ao fonema correto (ex: CA-MA, BO-LO, SA-PO).
                        </p>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                            style={{
                              width: `${bncc06Items.length > 0 ? (bncc06Completed / bncc06Items.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-start gap-1.5 text-[11px] text-blue-900/80 bg-blue-50/70 p-2 rounded-xl">
                          <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>Dica pedagógica: Brinque de bater palmas para cada pedacinho da palavra durante momentos da rotina!</span>
                        </div>
                      </div>

                      {/* BNCC EF01LP08 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                              EF01LP08
                            </span>
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                              Regularidades Fonotáticas e Sons Contextuais
                            </span>
                          </div>
                          <span className="text-xs font-black text-purple-700">
                            {bncc08Completed} / {bncc08Items.length}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                          Diferenciação auditiva fina: o som de Z do S intervocálico (ME-SA), o R brando tremido [ɾ] (MU-RO, ÁR-VO-RE) e timbres abertos /ɔ/ (BÓ-LA).
                        </p>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                            style={{
                              width: `${bncc08Items.length > 0 ? (bncc08Completed / bncc08Items.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-start gap-1.5 text-[11px] text-purple-900/80 bg-purple-50/70 p-2 rounded-xl">
                          <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>Dica pedagógica: Destaque o som suave das letrinhas e o ritmo da fala sem pressa ou correções ríspidas.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Visão 2: Vocabulário por Cômodo */}
                  {reportSubView === 'rooms' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {WORLDS_DATA.map((w) => {
                          const isSelected = selectedRoomId === w.id;
                          const roomDone = w.items.filter((i) => !!progress.completedItems[i.id]).length;
                          const isDone = roomDone === w.items.length;

                          return (
                            <button
                              key={w.id}
                              onClick={() => {
                                soundService.playWoodClick();
                                setSelectedRoomId(w.id);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                                isSelected
                                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                                  : isDone
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span>{w.icon}</span>
                              <span>{w.shortName}</span>
                              <span className="text-[10px] font-bold opacity-80">
                                ({roomDone}/{w.items.length})
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{selectedRoom.icon}</span>
                            <div>
                              <div className="font-black text-sm text-slate-900">
                                {selectedRoom.title}
                              </div>
                              <div className="text-xs text-slate-500 font-bold">
                                {selectedRoomDone} de {selectedRoom.items.length} palavras dominadas
                              </div>
                            </div>
                          </div>
                          {isSelectedRoomAllDone && (
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                              ⭐ 100% Montado!
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {selectedRoom.items.map((item) => {
                            const done = !!progress.completedItems[item.id];
                            return (
                              <div
                                key={item.id}
                                className={`p-2.5 rounded-2xl border text-center transition-all ${
                                  done
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black shadow-2xs'
                                    : 'bg-white border-slate-200 text-slate-400 font-bold'
                                }`}
                              >
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-xs truncate uppercase font-black">
                                  {item.displayName}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {item.syllables.join(' - ')}
                                </div>
                                <div className="text-[10px] font-black mt-1">
                                  {done ? (
                                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                                      ⭐ Dominado
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">A descobrir</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 2: Tempo de Tela & Saúde Digital (SBP) */}
              {activeTab === 'time' && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-sky-950">
                    <div className="flex items-center gap-2 font-black text-sm mb-1 text-sky-900">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Diretriz da Sociedade Brasileira de Pediatria (SBP)</span>
                    </div>
                    <p className="text-xs leading-relaxed text-sky-900/90">
                      A SBP recomenda que crianças na primeira infância (4 a 6 anos) tenham momentos de tela limitados a <strong>no máximo 1 hora diária</strong>, sempre intercalados com pausas saudáveis a cada <strong>15 a 20 minutos</strong> para descanso visual e relaxamento motor.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Definir Limite de Sessão por Alerta Afetuoso:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { limit: 15, label: '15 minutos', sub: 'Recomendado para 4 anos' },
                        { limit: 20, label: '20 minutos', sub: 'Recomendado para 5 a 6 anos (Padrão)' },
                        { limit: 30, label: '30 minutos', sub: 'Uso compartilhado em família' },
                        { limit: 0, label: 'Livre', sub: 'Sem avisos de pausa' },
                      ].map((opt) => {
                        const isSelected = selectedTimeLimit === opt.limit;
                        return (
                          <button
                            key={opt.limit}
                            onClick={() => handleSaveScreenTime(opt.limit)}
                            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-sky-100 border-sky-500 text-sky-950 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-black text-xs sm:text-sm">
                                {opt.label}
                              </div>
                              <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                                {opt.sub}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {savedSettingsNotice && (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-xl border border-emerald-300 text-center animate-pop-in">
                        Configuração de tempo salva com sucesso!
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">
                        Tempo na sessão atual:
                      </div>
                      <div className="text-base sm:text-lg font-black text-slate-800">
                        ⏱️ {sessionElapsedMinutes} minuto{sessionElapsedMinutes === 1 ? '' : 's'}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                      Monitoramento Ativo
                    </span>
                  </div>
                </div>
              )}

              {/* ABA 3: Instalar App na Tela Inicial */}
              {activeTab === 'install' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Status Standalone */}
                  {installIsStandalone || installJustInstalled ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-900 shadow-xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div className="text-xs sm:text-sm">
                        <strong className="block font-black text-emerald-950">
                          O Soletrando já está instalado no seu aparelho!
                        </strong>
                        <span>
                          Você já está aproveitando a experiência completa de tela cheia sem barras de navegador.
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* Botão de Instalação Direta */}
                  {installCanInstall && !installIsStandalone && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-md border-2 border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <h4 className="font-black text-sm sm:text-base text-slate-950 leading-tight">
                          Instalar com 1 Toque
                        </h4>
                        <p className="text-xs text-amber-950/90 font-semibold mt-0.5">
                          Seu navegador suporta a instalação direta agora mesmo!
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
                      Instruções específicas para o seu dispositivo:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <button
                        onClick={() => {
                          soundService.playWoodClick();
                          setInstallPlatform('android');
                        }}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                          installPlatform === 'android'
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
                          setInstallPlatform('ios');
                        }}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                          installPlatform === 'ios'
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
                          setInstallPlatform('desktop');
                        }}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                          installPlatform === 'desktop'
                            ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Laptop className="w-4 h-4 text-purple-600" />
                        <span>Computador</span>
                      </button>
                    </div>
                  </div>

                  {/* Instruções */}
                  <div className="bg-slate-50/80 rounded-2xl border-2 border-slate-200 p-3.5 sm:p-4 space-y-3">
                    {installPlatform === 'android' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                            1
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            No <strong>Google Chrome</strong>, toque nos <strong>três pontinhos (⋮)</strong> no topo à direita.
                          </p>
                          <MoreVertical className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                            2
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            Selecione <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
                          </p>
                          <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                            3
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            Toque em <strong>&ldquo;Instalar&rdquo;</strong>. O ícone da casinha 🏡 aparecerá na sua tela de início!
                          </p>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                      </div>
                    )}

                    {installPlatform === 'ios' && (
                      <div className="space-y-3">
                        <div className="bg-sky-100/60 border border-sky-300 rounded-xl p-2.5 text-[11px] text-sky-900 font-medium">
                          💡 <strong>No Safari do iPhone/iPad:</strong> A Apple exige a instalação pelo menu de Compartilhamento em 3 passos simples:
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

                    {installPlatform === 'desktop' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                            1
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            No <strong>Chrome</strong> ou <strong>Edge</strong>, olhe para a barra de endereços (ao lado da estrelinha de favoritos).
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                            2
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            Clique no ícone de <strong>Instalar</strong> (monitor com setinha para baixo).
                          </p>
                          <Download className="w-4 h-4 text-purple-600 shrink-0" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                            3
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 font-bold">
                            Clique em <strong>&ldquo;Instalar&rdquo;</strong>. O jogo abrirá em tela exclusiva e criará um atalho na Área de Trabalho!
                          </p>
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vantagens */}
                  <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3.5 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Benefícios da instalação:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                      <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                        <Maximize2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-black text-slate-800">Tela Cheia Sem Distrações</strong>
                          <span className="text-slate-600">A criança não fecha abas nem clica na barra de busca sem querer.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                        <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-black text-slate-800">Acesso em 1 Toque</strong>
                          <span className="text-slate-600">Abre direto com o ícone da casinha, sem precisar digitar endereço.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                        <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-black text-slate-800">100% Offline</strong>
                          <span className="text-slate-600">Áudios e fases funcionam mesmo no carro ou sem sinal de Wi-Fi.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-amber-200/80">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-black text-slate-800">Super Leve e Seguro</strong>
                          <span className="text-slate-600">Não ocupa a memória pesada do celular nem pede permissões invasivas.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: Privacidade & Segurança */}
              {activeTab === 'privacy' && (
                <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-emerald-950">
                    <div className="flex items-center gap-2 font-black text-sm mb-1 text-emerald-900">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Compromisso Inegociável com a Criança</span>
                    </div>
                    <p className="text-xs leading-normal">
                      O <strong>Soletrando o Mundo</strong> opera sob o princípio de <strong>Privacidade por Padrão</strong>. Não solicitamos nem coletamos nenhum dado identificador de crianças. Todo o progresso de palavras e estrelas reside <strong>exclusivamente dentro do seu dispositivo</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      1. Alinhamento à LGPD (Art. 14) e COPPA
                    </h4>
                    <p>
                      Cumprimos rigorosamente o Artigo 14 da Lei Geral de Proteção de Dados (Lei 13.709/2018), que exige que o tratamento de dados de menores ocorra em seu melhor interesse. Também seguimos a legislação norte-americana COPPA e as regras da Google Play Families e Apple Kids Category.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      2. Armazenamento 100% Local (Offline-first)
                    </h4>
                    <p>
                      As informações de fases desbloqueadas e estrelas são salvas apenas no armazenamento interno (LocalStorage) do aparelho. Não há transmissão para servidores remotos nem criação de perfis comportamentais.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      3. Zero Publicidade e Zero Rastreamento
                    </h4>
                    <p>
                      Não utilizamos anúncios comerciais, redes de publicidade direcionada nem identificadores de anúncios (como GAID ou IDFA). O ambiente sonoro e visual é estritamente voltado à tranquilidade cognitiva da criança.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      4. Trava Parental e Direitos dos Pais
                    </h4>
                    <p>
                      Todas as áreas de gerenciamento, configurações ou links externos são protegidos por desafios matemáticos. Os pais podem apagar todos os dados a qualquer momento pelo botão de reset no rodapé desta tela.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600">
                    <strong>Canal do Encarregado de Dados (DPO):</strong> Felipe Coelho •{' '}
                    <span className="font-bold text-sky-700">privacidade.soletrando@gmail.com</span>
                  </div>

                  <div className="pt-1">
                    <a
                      href="/privacidade.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-black underline cursor-pointer text-xs"
                    >
                      <span>Abrir página pública de Política de Privacidade</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* ABA 5: Termos de Uso */}
              {activeTab === 'terms' && (
                <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-sky-950">
                    <div className="font-black text-sm mb-1 text-sky-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>Finalidade Educacional e Alinhamento BNCC</span>
                    </div>
                    <p className="text-xs leading-normal">
                      O Soletrando o Mundo é um recurso complementar de alfabetização fônica fundamentado na Base Nacional Comum Curricular (EF01LP06 e EF01LP08), desenhado para momentos de diversão tranquila entre pais e filhos.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      1. Uso Supervisionado e Saúde Digital
                    </h4>
                    <p>
                      Incentivamos que o uso do aplicativo seja mediado pela família. Disponibilizamos controle de tempo de tela baseado nas recomendações da Sociedade Brasileira de Pediatria (SBP) para evitar excessos.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      2. Propriedade Intelectual e Autoria
                    </h4>
                    <p>
                      Todo o design isométrico de massinha 3D, efeitos sonoros sintetizados, marcas e estruturas metodológicas são de propriedade exclusiva do projeto Soletrando o Mundo. É vedada a reprodução comercial desautorizada.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">
                      3. Limitação de Responsabilidade
                    </h4>
                    <p>
                      O aplicativo é disponibilizado sem garantias de funcionamento ininterrupto em todas as plataformas legadas, operando primordialmente no modo offline após a primeira carga.
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href="/termos.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-black underline cursor-pointer text-xs"
                    >
                      <span>Abrir página pública de Termos de Uso</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmação Segura de Reset */}
            {showResetConfirm && (
              <div className="bg-rose-50 border-t-2 border-rose-300 p-4 space-y-3 animate-pop-in">
                <div className="flex items-center gap-2 text-rose-900 font-black text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Atenção: Ação Irreversível!</span>
                </div>
                <p className="text-xs text-rose-950 font-bold leading-relaxed">
                  Tem certeza que deseja apagar todas as {completedWordsCount} palavras soletradas e as {progress.starsCount} estrelas conquistadas?
                </p>
                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleExecuteReset}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sim, Apagar Tudo</span>
                  </button>
                  <button
                    onClick={() => {
                      soundService.playWoodClick();
                      setShowResetConfirm(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-black text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Rodapé Arejado com Ações Claras */}
            <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setShowResetConfirm(true);
                }}
                className="inline-flex items-center gap-1.5 text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer py-1.5 px-2.5 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                title="Zerar o progresso do jogo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zerar Progresso</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  onClose();
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer transition-all shadow-xs"
              >
                Voltar ao Jogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
