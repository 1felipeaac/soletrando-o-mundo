import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Home,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { licenseService } from '../services/licenseService';
import { PRICING } from '../config/pricing';
import type { WorldRoom } from '../types/game';

interface ParentPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoom?: WorldRoom;
  onSuccessUnlock: () => void;
}

export const ParentPaywallModal: React.FC<ParentPaywallModalProps> = ({
  isOpen,
  onClose,
  targetRoom,
  onSuccessUnlock,
}) => {
  const canUpgrade = licenseService.canUpgradeToFullHouse();
  const [selectedPlanId, setSelectedPlanId] = useState<'SINGLE_ROOM' | 'FULL_HOUSE' | 'UPGRADE_HOUSE'>(
    canUpgrade ? 'UPGRADE_HOUSE' : 'FULL_HOUSE'
  );

  const [step, setStep] = useState<'choose-plan' | 'form' | 'pix' | 'restore' | 'success'>('choose-plan');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PIX State
  const [pixData, setPixData] = useState<{
    paymentId: string;
    encodedImage: string;
    payload: string;
    value: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Formatar CPF enquanto o usuário digita
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 9) {
      val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (val.length > 6) {
      val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (val.length > 3) {
      val = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(val);
  };

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCpf = cpf.replace(/\D/g, '');
    if (!name.trim() || name.trim().length < 3) {
      setFormError('Por favor, informe o nome completo do responsável.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Por favor, informe um e-mail válido para receber o comprovante.');
      return;
    }
    if (cleanCpf.length !== 11) {
      setFormError('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }

    setIsSubmitting(true);
    soundService.playWoodClick();

    try {
      const res = await fetch('/.netlify/functions/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          cpfCnpj: cleanCpf,
          plan: selectedPlanId,
          targetRoomId: targetRoom?.id || 3,
          roomName: targetRoom?.shortName || 'Cômodo',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível gerar o PIX no momento.');
      }

      setPixData({
        paymentId: data.paymentId,
        encodedImage: data.encodedImage,
        payload: data.payload,
        value: data.value,
      });

      setStep('pix');
      startPollingPayment(data.paymentId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar pagamento.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPollingPayment = (paymentId: string) => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

    checkIntervalRef.current = setInterval(async () => {
      await verifyPaymentStatus(paymentId);
    }, 3000);
  };

  const verifyPaymentStatus = async (paymentId: string) => {
    try {
      setIsChecking(true);
      const res = await fetch(`/.netlify/functions/check-payment?id=${paymentId}`);
      const data = await res.json();

      if (data.paid && data.token) {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        licenseService.saveLicenseToken(data.token);

        soundService.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FBBF24', '#38BDF8', '#34D399', '#FB7185'],
        });

        setStep('success');
      }
    } catch {
      // Ignorar erros temporários de conexão durante o polling
    } finally {
      setIsChecking(false);
    }
  };

  const handleRestoreLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setFormError('Por favor, informe o CPF cadastrado no momento da compra.');
      return;
    }

    setIsSubmitting(true);
    soundService.playWoodClick();

    try {
      const res = await fetch('/.netlify/functions/restore-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), cpfCnpj: cleanCpf }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || 'Nenhuma compra foi localizada para este CPF.');
      }

      licenseService.saveLicenseToken(data.token);
      soundService.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#38BDF8', '#34D399', '#FB7185'],
      });
      setStep('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao restaurar compra.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData?.payload) return;
    navigator.clipboard.writeText(pixData.payload);
    setCopied(true);
    soundService.playSnap();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinish = () => {
    soundService.playWoodClick();
    onSuccessUnlock();
    onClose();
  };

  const currentPrice =
    selectedPlanId === 'FULL_HOUSE'
      ? PRICING.FULL_HOUSE.price
      : selectedPlanId === 'UPGRADE_HOUSE'
      ? PRICING.UPGRADE_HOUSE.price
      : PRICING.SINGLE_ROOM.price;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-amber-300 w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 px-5 py-4 border-b-2 border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-xs">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                {step === 'success'
                  ? 'Conteúdo Desbloqueado! 🎉'
                  : 'Desbloquear Cômodos da Casa'}
              </h3>
              <p className="text-xs font-bold text-amber-900/80">
                Pagamento seguro via PIX • Liberação Imediata
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playWoodClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer transition-colors shadow-xs"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-700 text-xs sm:text-sm">
          {/* PASSO 1: ESCOLHER O PLANO */}
          {step === 'choose-plan' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Sem Mensalidades • Compra Única
                </span>
                <h4 className="text-lg font-black text-slate-900 pt-1">
                  Escolha como deseja desbloquear
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Valores promocionais de lançamento para o Mundo da Casa.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Opção 1: Casa Completa (Destaque Ouro) */}
                {!canUpgrade && (
                  <button
                    onClick={() => {
                      soundService.playWoodClick();
                      setSelectedPlanId('FULL_HOUSE');
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      selectedPlanId === 'FULL_HOUSE'
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Mais Escolhido pelos Pais
                    </span>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-amber-700" />
                          <span className="font-black text-sm text-slate-900">
                            {PRICING.FULL_HOUSE.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {PRICING.FULL_HOUSE.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="text-[10px] text-slate-400 line-through font-bold">
                          De R$ {PRICING.FULL_HOUSE.originalPrice?.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-xl font-black text-amber-950">
                          R$ {PRICING.FULL_HOUSE.price.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[9px] font-extrabold text-emerald-700 uppercase">
                          Desconto de {Math.round((1 - PRICING.FULL_HOUSE.price / (PRICING.FULL_HOUSE.originalPrice || 20)) * 100)}%
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Opção 2: Upgrade para Casa Completa (Se já comprou 1 cômodo) */}
                {canUpgrade && (
                  <button
                    onClick={() => {
                      soundService.playWoodClick();
                      setSelectedPlanId('UPGRADE_HOUSE');
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      selectedPlanId === 'UPGRADE_HOUSE'
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      Desconto de Upgrade
                    </span>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-emerald-700" />
                          <span className="font-black text-sm text-slate-900">
                            {PRICING.UPGRADE_HOUSE.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {PRICING.UPGRADE_HOUSE.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <div className="text-xl font-black text-emerald-950">
                          R$ {PRICING.UPGRADE_HOUSE.price.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500">
                          Pague só a diferença
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Opção 3: Cômodo Avulso */}
                <button
                  onClick={() => {
                    soundService.playWoodClick();
                    setSelectedPlanId('SINGLE_ROOM');
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedPlanId === 'SINGLE_ROOM'
                      ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-black text-sm text-slate-900">
                        {PRICING.SINGLE_ROOM.label}:{' '}
                        <span className="text-sky-800">
                          {targetRoom?.shortName || 'Este Cômodo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {PRICING.SINGLE_ROOM.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <div className="text-xl font-black text-slate-900">
                        R$ {PRICING.SINGLE_ROOM.price.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase">
                        Compra Única
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    soundService.playSnap();
                    setStep('form');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 px-4 rounded-2xl shadow-md border border-amber-600 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-95 transition-all"
                >
                  <span>Continuar com PIX (R$ {currentPrice.toFixed(2).replace('.', ',')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playWoodClick();
                    setFormError(null);
                    setStep('restore');
                  }}
                  className="text-xs font-black text-sky-800 hover:text-sky-950 underline cursor-pointer"
                >
                  Já comprou em outro celular ou tablet? Ativar neste aparelho
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: FORMULÁRIO DE DADOS (NOME, EMAIL, CPF) */}
          {step === 'form' && (
            <form onSubmit={handleGeneratePix} className="space-y-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playWoodClick();
                    setStep('choose-plan');
                  }}
                  className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                >
                  &larr; Voltar e trocar plano
                </button>
                <h4 className="text-lg font-black text-slate-900">
                  Dados do Responsável para o PIX
                </h4>
                <p className="text-[11px] text-slate-500">
                  O Banco Central exige CPF para identificação da cobrança PIX.
                </p>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Nome Completo do Adulto:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mariana Silva"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    E-mail do Responsável:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: seuemail@gmail.com"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Usado para enviar seu comprovante e liberar outros celulares/tablets da casa.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    CPF do Responsável:
                  </label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black py-3 px-4 rounded-2xl shadow-md border border-amber-600 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando QR Code PIX...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Gerar PIX de R$ {currentPrice.toFixed(2).replace('.', ',')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* PASSO 3: EXIBIÇÃO DO QR CODE E CÓDIGO PIX */}
          {step === 'pix' && pixData && (
            <div className="space-y-4 text-center">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  PIX Gerado com Sucesso!
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1.5">
                  Valor: R$ {pixData.value.toFixed(2).replace('.', ',')}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Abra o aplicativo do seu banco e escaneie o QR Code ou use o Copia e Cola:
                </p>
              </div>

              {/* Imagem do QR Code */}
              <div className="bg-white p-3 border-2 border-amber-300 rounded-2xl inline-block shadow-inner mx-auto">
                <img
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code PIX Asaas"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                />
              </div>

              {/* Botão Copia e Cola */}
              <div className="space-y-2">
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm cursor-pointer transition-all border flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Código PIX Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copiar Código PIX (Copia e Cola)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-amber-900 font-extrabold bg-amber-50 py-2 px-3 rounded-xl border border-amber-200 animate-pulse">
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-amber-600 ${
                      isChecking ? 'animate-spin' : ''
                    }`}
                  />
                  <span>Identificando pagamento automaticamente em tempo real...</span>
                </div>
              </div>
            </div>
          )}

          {/* PASSO: RESTAURAR COMPRA EM OUTRO APARELHO */}
          {step === 'restore' && (
            <form onSubmit={handleRestoreLicense} className="space-y-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playWoodClick();
                    setStep('choose-plan');
                  }}
                  className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                >
                  &larr; Voltar para as opções de compra
                </button>
                <h4 className="text-lg font-black text-slate-900">
                  Ativar Compra neste Aparelho
                </h4>
                <p className="text-[11px] text-slate-500">
                  Informe o CPF e E-mail utilizados na hora do pagamento para liberar este dispositivo.
                </p>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    CPF do Responsável (utilizado no PIX):
                  </label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    E-mail do Responsável:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@gmail.com"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 text-white font-black py-3 px-4 rounded-2xl shadow-md border border-sky-600 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verificando compra no Asaas...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Localizar e Ativar Compra</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* PASSO 4: SUCESSO E CELEBRAÇÃO */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-4 animate-pop-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Pagamento Confirmado!
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  Tudo Liberado! 🏆
                </h4>
                <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto mt-1">
                  O conteúdo foi desbloqueado com sucesso neste dispositivo e já está disponível para a criança brincar offline.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleFinish}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 px-6 rounded-2xl shadow-lg border border-emerald-600 text-sm uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  Começar a Brincar Agora! 🌟
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Selos de Confiança */}
        {step !== 'success' && (
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-bold">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Ambiente Seguro Asaas
            </span>
            <span>Sem mensalidades</span>
          </div>
        )}
      </div>
    </div>
  );
};
