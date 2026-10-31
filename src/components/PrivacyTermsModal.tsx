import React, { useState } from 'react';
import { X, ShieldCheck, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { soundService } from '../services/soundService';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'privacy' | 'terms') => {
    soundService.playWoodClick();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-sky-300 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in">
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-sky-100 to-amber-50 px-5 py-4 border-b-2 border-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-sky-700 flex items-center justify-center border-2 border-sky-300 shadow-xs">
              {activeTab === 'privacy' ? <ShieldCheck className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                Transparência e Segurança Infantil
              </h3>
              <p className="text-xs font-bold text-sky-800">
                Diretrizes de Proteção à Primeira Infância (LGPD & BNCC)
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

        {/* Seletor de Abas */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2">
          <button
            onClick={() => handleTabChange('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-sky-900 border-t-2 border-x-2 border-sky-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Política de Privacidade</span>
          </button>
          <button
            onClick={() => handleTabChange('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-sky-900 border-t-2 border-x-2 border-sky-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Termos de Uso</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4">
          {activeTab === 'privacy' ? (
            <div className="space-y-4">
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
                  Todas as áreas de gerenciamento, configurações ou links externos são bloqueados por desafios matemáticos. Os pais podem apagar todos os dados a qualquer momento pelo botão de reset na Área dos Pais.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600">
                <strong>Canal do Encarregado de Dados (DPO):</strong> Felipe Coelho •{' '}
                <span className="font-bold text-sky-700">soletrandoomundo@gmail.com</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-sky-950">
                <div className="font-black text-sm mb-1 text-sky-900">
                  <span>📜</span> Finalidade Educacional e Alinhamento BNCC
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
            </div>
          )}
        </div>

        {/* Rodapé com link para página pública externa */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={activeTab === 'privacy' ? '/privacidade.html' : '/termos.html'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-black underline cursor-pointer"
          >
            <span>Ver versão completa em página web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              soundService.playWoodClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-xl cursor-pointer transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
