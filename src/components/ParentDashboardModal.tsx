import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  X,
  CheckCircle2,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { WORLDS_DATA } from '../data/worldsData';
import type { PlayerProgress, ParentSettings } from '../types/game';

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onConfirmReset: () => void;
  onOpenPrivacyTerms: (initialTab: 'privacy' | 'terms') => void;
  sessionElapsedMinutes: number;
  onUpdateSettings?: (settings: ParentSettings) => void;
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
  onOpenPrivacyTerms,
  sessionElapsedMinutes,
  onUpdateSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'bncc' | 'time' | 'privacy' | 'manage'>('bncc');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(() => {
    return progress.parentSettings?.screenTimeLimitMinutes ?? 20;
  });
  const [expandedRoomId, setExpandedRoomId] = useState<number | null>(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-amber-300 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 px-5 py-4 border-b-2 border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  Área da Família & Educador
                </h3>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Autorizado
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-amber-900/80">
                Acompanhamento pedagógico, tempo de tela e privacidade
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playWoodClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer transition-colors shadow-xs"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passo 1: Desafio Matemático de Trava Parental */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 text-center space-y-4 max-w-sm mx-auto my-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Trava Parental Obrigatória
              </span>
              <h4 className="text-xl font-black text-slate-800 mt-2">
                Confirme que você é um adulto
              </h4>
              <p className="text-xs font-bold text-slate-500 mt-1">
                Para proteger as configurações e o progresso da criança, resolva o cálculo:
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 shadow-inner">
              <span className="text-xs font-black text-amber-800 uppercase block mb-1">
                Quanto é:
              </span>
              <span className="text-3xl font-black text-amber-950 tracking-wider">
                {problem.num1} {problem.operator} {problem.num2} = ?
              </span>
            </div>

            {errorMessage && (
              <div className="text-xs font-black text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {problem.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-black text-xl border-2 border-amber-300 shadow-xs transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 block mx-auto pt-2 cursor-pointer"
            >
              Cancelar e voltar ao jogo
            </button>
          </div>
        ) : (
          /* Passo 2: O Dashboard Completo dos Pais */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Seletor de Abas */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('bncc');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'bncc'
                    ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Relatório Pedagógico (BNCC)</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('time');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'time'
                    ? 'bg-white text-sky-950 border-t-2 border-x-2 border-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Tempo de Tela (SBP)</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('privacy');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-white text-emerald-950 border-t-2 border-x-2 border-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacidade & Segurança</span>
              </button>

              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('manage');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'manage'
                    ? 'bg-white text-rose-950 border-t-2 border-x-2 border-rose-300 shadow-xs'
                    : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50/70'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Zerar / Gerenciar</span>
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* ABA 1: Relatório Pedagógico BNCC */}
              {activeTab === 'bncc' && (
                <div className="space-y-4">
                  {/* Cards de Métricas Principais */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
                      <div className="text-xl sm:text-2xl font-black text-amber-900">
                        {progress.starsCount} <span className="text-xs font-normal">/ {totalWordsCount}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mt-0.5">
                        ⭐ Estrelas
                      </div>
                    </div>

                    <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center">
                      <div className="text-xl sm:text-2xl font-black text-sky-900">
                        {completedWordsCount} <span className="text-xs font-normal">/ {totalWordsCount}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-sky-800 uppercase tracking-wider mt-0.5">
                        📖 Palavras
                      </div>
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
                      <div className="text-xl sm:text-2xl font-black text-emerald-900">
                        {completedRoomsCount} <span className="text-xs font-normal">/ {WORLDS_DATA.length}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                        🏆 Cômodos
                      </div>
                    </div>
                  </div>

                  {/* Análise de Habilidades BNCC */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Habilidades BNCC Conquistadas</span>
                    </div>

                    {/* BNCC EF01LP06 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
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
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Capacidade de segmentar a palavra em pedacinhos sonoros e associar a letra ao fonema correto (ex: CA-MA, BO-LO, SA-PO).
                      </p>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${bncc06Items.length > 0 ? (bncc06Completed / bncc06Items.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* BNCC EF01LP08 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
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
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Diferenciação auditiva fina: o som de Z do S intervocálico (ME-SA), o R brando tremido [ɾ] (MU-RO, ÁR-VO-RE) e timbres abertos /ɔ/ (BÓ-LA).
                      </p>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${bncc08Items.length > 0 ? (bncc08Completed / bncc08Items.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detalhamento por Cômodo */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Palavras Conquistadas por Cômodo</span>
                    </div>

                    <div className="space-y-2">
                      {WORLDS_DATA.map((world) => {
                        const isExpanded = expandedRoomId === world.id;
                        const roomDone = world.items.filter((i) => !!progress.completedItems[i.id]).length;
                        const isAllDone = roomDone === world.items.length;

                        return (
                          <div
                            key={world.id}
                            className={`border rounded-2xl transition-all ${
                              isAllDone
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <button
                              onClick={() => {
                                soundService.playWoodClick();
                                setExpandedRoomId(isExpanded ? null : world.id);
                              }}
                              className="w-full p-3 flex items-center justify-between text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{world.icon}</span>
                                <div>
                                  <div className="font-black text-xs sm:text-sm text-slate-900">
                                    {world.shortName}
                                  </div>
                                  <div className="text-[10px] font-bold text-slate-500">
                                    {roomDone} de {world.items.length} palavras completadas
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isAllDone && (
                                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    100% Montado!
                                  </span>
                                )}
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="p-3 pt-0 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {world.items.map((item) => {
                                  const done = !!progress.completedItems[item.id];
                                  return (
                                    <div
                                      key={item.id}
                                      className={`p-2 rounded-xl border text-center transition-all ${
                                        done
                                          ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-black'
                                          : 'bg-slate-50 border-slate-200 text-slate-400 font-bold'
                                      }`}
                                    >
                                      <div className="text-sm">{item.icon}</div>
                                      <div className="text-[11px] truncate uppercase mt-0.5">
                                        {item.displayName}
                                      </div>
                                      <div className="text-[9px] mt-0.5">
                                        {done ? '⭐ Dominado' : 'A descobrir'}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: Tempo de Tela & Saúde (SBP) */}
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

              {/* ABA 3: Privacidade & Segurança */}
              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-emerald-950">
                    <div className="flex items-center gap-2 font-black text-sm mb-1 text-emerald-900">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Proteção Integral e Zero Rastreamento</span>
                    </div>
                    <p className="text-xs leading-relaxed text-emerald-900/90">
                      O Soletrando o Mundo cumpre todas as exigências da <strong>LGPD (Art. 14)</strong>, <strong>COPPA</strong> e o programa <strong>Google Play Families</strong>. Não comercializamos dados, não rastreamos localização e não exibimos propagandas de terceiros.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        soundService.playWoodClick();
                        onOpenPrivacyTerms('privacy');
                      }}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-black text-xs sm:text-sm text-slate-900">
                            Política de Privacidade Completa
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Veja detalhes sobre armazenamento local e direitos dos responsáveis
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-sky-700">Ler &rarr;</span>
                    </button>

                    <button
                      onClick={() => {
                        soundService.playWoodClick();
                        onOpenPrivacyTerms('terms');
                      }}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-sky-600" />
                        <div>
                          <div className="font-black text-xs sm:text-sm text-slate-900">
                            Termos de Uso do Aplicativo
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Condições pedagógicas, licença de uso e supervisão
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-sky-700">Ler &rarr;</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 text-center pt-2">
                    Encarregado pelo Tratamento de Dados (DPO): Felipe Coelho • privacidade.soletrando@gmail.com
                  </div>
                </div>
              )}

              {/* ABA 4: Gerenciar Dados (Reset Seguro) */}
              {activeTab === 'manage' && (
                <div className="space-y-4">
                  {!showResetConfirm ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-rose-700 font-black text-sm">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reiniciar Progresso da Criança</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Caso deseje começar toda a aventura do zero (apagando as palavras soletradas e estrelas para uma nova criança jogar), utilize o botão abaixo.
                      </p>
                      <button
                        onClick={() => {
                          soundService.playWoodClick();
                          setShowResetConfirm(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 font-black text-xs cursor-pointer transition-colors shadow-xs"
                      >
                        Desejo reiniciar o progresso...
                      </button>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 space-y-4 animate-pop-in">
                      <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
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
                </div>
              )}
            </div>

            {/* Rodapé com Fechar e Atalho para Zerar */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundService.playWoodClick();
                  setActiveTab('manage');
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
