import { useState } from 'react';
import { ShieldCheck, RotateCcw, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { soundService } from '../services/soundService';

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
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

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [step, setStep] = useState<'math' | 'confirm'>('math');
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (selected: number) => {
    if (selected === problem.answer) {
      soundService.playSnap();
      setErrorMessage(null);
      setStep('confirm');
    } else {
      soundService.playBoing();
      setErrorMessage('Ops! Resposta incorreta. Tente este novo desafio:');
      setProblem(generateMathProblem());
    }
  };

  const handleExecuteReset = () => {
    soundService.playFanfare();
    onConfirmReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 max-w-sm w-full text-center shadow-2xl relative animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'math' ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Trava Parental
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                Área dos Pais
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                Para proteger as conquistas da criança, resolva o desafio matemático:
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-300 shadow-inner">
              <span className="text-xs font-black text-amber-800 uppercase block mb-1">
                Quanto é:
              </span>
              <span className="text-3xl font-black text-amber-950 tracking-wider">
                {problem.num1} {problem.operator} {problem.num2} = ?
              </span>
            </div>

            {errorMessage && (
              <div className="text-xs font-black text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200 animate-wiggle-soft">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {problem.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-black text-xl border-2 border-amber-300 shadow-sm transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 block mx-auto pt-2 cursor-pointer"
            >
              Cancelar e voltar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-300">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Desafio Correto!
              </span>
              <h3 className="text-xl font-black text-rose-950 mt-2">
                Zerar progresso?
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Isso apagará os móveis e estrelas conquistados para começar uma nova jornada do zero.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleExecuteReset}
                className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black py-3 px-4 rounded-2xl shadow-md border border-rose-600 active:scale-95 cursor-pointer uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Sim, Apagar Dados</span>
              </button>
              <button
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2.5 px-4 rounded-2xl border border-slate-300 active:scale-95 cursor-pointer text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
