import { useState } from 'react';

// Ilustrações vetoriais acessíveis, amigáveis e não-hiperestimulantes
// Garante representação inequívoca de cada objeto do mundo infantil.

interface ItemIllustrationProps {
  itemId: string;
  fallbackIcon?: string;
  className?: string;
}

const IMAGE_MAP: Record<string, string> = {
  // Quarto Mágico (8 itens)
  cama: '/images/cama.jpg',
  mesa: '/images/mesa.jpg',
  pufe: '/images/pufe.jpg',
  bola: '/images/bola.jpg',
  urso: '/images/urso.jpg',
  porta: '/images/porta.jpg',
  tapete: '/images/tapete.jpg',
  abajur: '/images/abajur.jpg',

  // A Cozinha (8 itens)
  bolo: '/images/bolo.jpg',
  suco: '/images/suco.jpg',
  sopa: '/images/sopa.jpg',
  maca: '/images/maca.jpg',
  copo: '/images/copo.jpg',
  prato: '/images/prato.jpg',
  garfo: '/images/garfo.jpg',
  banana: '/images/banana.jpg',

  // A Sala de Estar (8 itens)
  vaso: '/images/vaso.jpg',
  foto: '/images/foto.jpg',
  sofa: '/images/sofa.jpg',
  janela: '/images/janela.jpg',
  relogio: '/images/relogio.jpg',
  almofada: '/images/almofada.jpg',
  cortina: '/images/cortina.jpg',
  radio: '/images/radio.jpg',
  // Legados sala
  livro: '/images/livro.jpg',
  quadro: '/images/quadro.jpg',
  planta: '/images/planta.jpg',

  // O Banheiro (8 itens)
  pia: '/images/pia.jpg',
  pato: '/images/pato.jpg',
  sabao: '/images/sabao.jpg',
  pote: '/images/pote.jpg',
  papel: '/images/papel.jpg',
  escova: '/images/escova.jpg',
  pente: '/images/pente.jpg',
  bacia: '/images/bacia.jpg',
  // Legados banheiro
  tubo: '/images/tubo.jpg',
  toalha: '/images/toalha.jpg',
  espelho: '/images/espelho.jpg',
  banheira: '/images/banheira.jpg',

  // O Jardim (8 itens)
  rosa: '/images/rosa.jpg',
  gato: '/images/gato.jpg',
  muro: '/images/muro.jpg',
  sapo: '/images/sapo.jpg',
  arvore: '/images/arvore.jpg',
  regador: '/images/regador.jpg',
  balanco: '/images/balanco.jpg',
  cerca: '/images/cerca.jpg',
  // Legados jardim
  grama: '/images/grama.jpg',
  passaro: '/images/passaro.jpg',
  borboleta: '/images/borboleta.jpg',

  // Bônus da Casa (8 itens)
  sapato: '/images/sapato.jpg',
  bota: '/images/bota.jpg',
  laco: '/images/laco.jpg',
  sacola: '/images/sacola.jpg',
  bone: '/images/bone.jpg',
  casaco: '/images/casaco.jpg',
  meia: '/images/meia.jpg',
  chave: '/images/chave.jpg',
  // Legados bônus
  vassoura: '/images/vassoura.jpg',
  balde: '/images/balde.jpg',
  mochila: '/images/mochila.jpg',
};

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  itemId,
  fallbackIcon,
  className = 'w-14 h-14',
}) => {
  const [hasError, setHasError] = useState(false);
  const cleanId = itemId.trim().toLowerCase();
  const imageSrc = IMAGE_MAP[cleanId];
  const combinedClassName = `${className} object-contain object-center mx-auto block`;

  if (imageSrc && !hasError) {
    return (
      <img
        src={imageSrc}
        alt={itemId}
        onError={() => setHasError(true)}
        className={`${combinedClassName} rounded-2xl select-none`}
        loading="lazy"
        draggable={false}
      />
    );
  }

  switch (cleanId) {
    case 'mesa':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          {/* Sombra no chão */}
          <ellipse cx="50" cy="88" rx="42" ry="6" fill="#E2E8F0" />
          {/* Pernas traseiras */}
          <rect x="23" y="44" width="6" height="40" rx="2" fill="#B45309" />
          <rect x="71" y="44" width="6" height="40" rx="2" fill="#B45309" />
          {/* Gaveteiro central */}
          <rect x="22" y="44" width="56" height="17" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <rect x="27" y="48" width="46" height="9" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
          <rect x="46" y="51" width="8" height="3" rx="1.5" fill="#78350F" />
          {/* Pernas dianteiras */}
          <rect x="15" y="42" width="7" height="44" rx="2.5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <rect x="78" y="42" width="7" height="44" rx="2.5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          {/* Tampo da Mesa */}
          <path d="M7 42L17 26H83L93 42H7Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M7 42H93V46C93 47.5 91.5 48.5 90 48.5H10C8.5 48.5 7 47.5 7 46V42Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          {/* Livro de desenho na mesa */}
          <path d="M30 33L39 31L47 33L39 35L30 33Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M47 33L55 31L63 33L55 35L47 33Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          {/* Porta-lápis colorido */}
          <rect x="67" y="24" width="8" height="11" rx="2" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
          <line x1="70" y1="20" x2="71.5" y2="25" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <line x1="73" y1="19" x2="73" y2="25" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'cama':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="86" rx="42" ry="6" fill="#E2E8F0" />
          {/* Cabeceira alta de madeira */}
          <rect x="12" y="20" width="12" height="66" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          <rect x="18" y="26" width="6" height="30" rx="2" fill="#D97706" />
          {/* Peseira baixa */}
          <rect x="80" y="46" width="10" height="40" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          {/* Estrutura do colchão */}
          <rect x="22" y="56" width="60" height="24" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          {/* Colcha macia colorida */}
          <path d="M36 54H82V76C82 78 80.5 79 78.5 79H36V54Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          {/* Travesseiro fofinho */}
          <rect x="22" y="46" width="16" height="16" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );

    case 'sofa':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="86" rx="40" ry="6" fill="#E2E8F0" />
          {/* Encosto acolchoado */}
          <rect x="16" y="28" width="68" height="36" rx="10" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
          {/* Braço esquerdo */}
          <rect x="10" y="44" width="16" height="36" rx="8" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" />
          {/* Braço direito */}
          <rect x="74" y="44" width="16" height="36" rx="8" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" />
          {/* Assento macio */}
          <rect x="22" y="52" width="56" height="26" rx="8" fill="#FDBA74" stroke="#C2410C" strokeWidth="2.5" />
          {/* Almofadinha */}
          <circle cx="34" cy="54" r="8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Pés de madeira */}
          <rect x="20" y="80" width="6" height="8" rx="2" fill="#78350F" />
          <rect x="74" y="80" width="6" height="8" rx="2" fill="#78350F" />
        </svg>
      );

    case 'abajur':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="24" ry="5" fill="#E2E8F0" />
          {/* Base e haste */}
          <ellipse cx="50" cy="86" rx="16" ry="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="47" y="48" width="6" height="38" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          {/* Cúpula do abajur */}
          <path d="M30 48L38 20H62L70 48H30Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Brilho da luz aconchegante */}
          <circle cx="50" cy="49" r="6" fill="#FEF08A" opacity="0.8" />
          <line x1="32" y1="60" x2="26" y2="72" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="68" y1="60" x2="74" y2="72" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'porta':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <rect x="22" y="10" width="56" height="80" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          <rect x="28" y="18" width="44" height="30" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <rect x="28" y="54" width="44" height="30" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="34" cy="52" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'tapete':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="50" rx="46" ry="24" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="36" ry="18" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <ellipse cx="50" cy="50" rx="24" ry="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'bola':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="28" ry="6" fill="#E2E8F0" />
          <circle cx="50" cy="50" r="36" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
          <path d="M26 30C36 40 40 60 30 72" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M74 30C64 40 60 60 70 72" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="50" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );

    case 'urso':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="30" ry="6" fill="#E2E8F0" />
          {/* Orelhas */}
          <circle cx="28" cy="28" r="12" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="28" cy="28" r="6" fill="#FDE68A" />
          <circle cx="72" cy="28" r="12" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="72" cy="28" r="6" fill="#FDE68A" />
          {/* Cabeça */}
          <circle cx="50" cy="46" r="28" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
          {/* Focinho */}
          <ellipse cx="50" cy="52" rx="14" ry="10" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
          <ellipse cx="50" cy="48" rx="5" ry="3.5" fill="#78350F" />
          {/* Olhinhos */}
          <circle cx="39" cy="40" r="3.5" fill="#1E293B" />
          <circle cx="61" cy="40" r="3.5" fill="#1E293B" />
          <circle cx="40" cy="39" r="1" fill="#FFFFFF" />
          <circle cx="62" cy="39" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'sopa':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="36" ry="6" fill="#E2E8F0" />
          {/* Tigela de cerâmica */}
          <path d="M16 46C16 72 30 84 50 84C70 84 84 72 84 46H16Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          {/* Borda superior da tigela */}
          <ellipse cx="50" cy="46" rx="34" ry="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          {/* Superfície da sopa fumegante */}
          <ellipse cx="50" cy="47" rx="30" ry="10" fill="#F59E0B" />
          {/* Leguminhos na sopa */}
          <circle cx="42" cy="46" r="2.5" fill="#EF4444" />
          <circle cx="56" cy="48" r="2" fill="#10B981" />
          <circle cx="49" cy="44" r="2" fill="#FEF08A" />
          {/* Fumacinha suave subindo */}
          <path d="M42 32C40 26 44 22 42 16" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 30C52 24 56 20 54 14" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'maca':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="28" ry="6" fill="#E2E8F0" />
          {/* Cabinho */}
          <path d="M50 28C51 20 56 16 60 14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          {/* Folha */}
          <path d="M54 22C62 20 68 24 66 30C58 32 54 26 54 22Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Corpo da maçã */}
          <path
            d="M50 32C42 22 20 25 20 48C20 70 38 84 50 84C62 84 80 70 80 48C80 25 58 22 50 32Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="2.5"
          />
          {/* Brilho da maçã */}
          <path
            d="M30 36C26 42 26 52 30 60"
            stroke="#FCA5A5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="34" cy="36" r="2.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'copo':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="26" ry="6" fill="#E2E8F0" />
          {/* Vidro do copo */}
          <path d="M26 22L34 84C34 86 36 88 38 88H62C64 88 66 86 66 84L74 22H26Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          {/* Nível de água azul cristalino */}
          <path d="M30 40L35 83C35 85 36.5 86 38.5 86H61.5C63.5 86 65 85 65 83L70 40C64 42 56 42 50 40C44 38 36 38 30 40Z" fill="#38BDF8" opacity="0.8" />
          {/* Reflexo no vidro */}
          <path d="M34 26L40 78" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="56" cy="56" r="2" fill="#FFFFFF" opacity="0.7" />
          <circle cx="48" cy="68" r="1.5" fill="#FFFFFF" opacity="0.6" />
        </svg>
      );

    case 'prato':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="42" ry="6" fill="#E2E8F0" />
          {/* Prato cerâmico externo */}
          <ellipse cx="50" cy="54" rx="44" ry="26" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="3" />
          {/* Borda decorativa colorida */}
          <ellipse cx="50" cy="54" rx="40" ry="23" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          {/* Centro fundo do prato */}
          <ellipse cx="50" cy="56" rx="28" ry="15" fill="#FFFFFF" stroke="#FCD34D" strokeWidth="1.5" />
          {/* Detalhe suave de brilho */}
          <path d="M22 50C26 44 36 40 50 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'garfo':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="90" rx="16" ry="4" fill="#E2E8F0" />
          {/* Cabo ergonômico com ponta arredondada */}
          <path d="M47 48L46 84C46 87 48 89 50 89C52 89 54 87 54 84L53 48H47Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          {/* Base metálica dos dentes */}
          <path d="M42 48H58V36C58 42 42 42 42 36V48Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          {/* Dentes do garfo */}
          <rect x="40" y="16" width="3.5" height="24" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="46" y="14" width="3.5" height="26" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="51" y="14" width="3.5" height="26" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="57" y="16" width="3.5" height="24" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          {/* Brilho metálico */}
          <line x1="48" y1="18" x2="48" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'banana':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="36" ry="6" fill="#E2E8F0" />
          {/* Banana descascada fofa */}
          <path
            d="M20 74C32 82 66 84 82 50C84 46 82 42 78 44C66 68 38 72 26 66L20 74Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2.5"
          />
          {/* Ponta da base */}
          <circle cx="21" cy="71" r="3" fill="#78350F" />
          {/* Fruta exposta suave */}
          <path
            d="M58 48C64 36 70 24 74 16C75 14 77 15 76 17C73 28 68 40 62 50L58 48Z"
            fill="#FEF3C7"
            stroke="#FDE68A"
            strokeWidth="2"
          />
          {/* Casca aberta (pétalas) */}
          <path d="M58 50C54 44 50 40 44 42C48 48 54 52 58 50Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <path d="M68 44C74 40 80 38 84 42C80 46 74 48 68 44Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          {/* Detalhe de textura */}
          <path d="M34 71C46 76 64 74 74 58" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'pufe':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="86" rx="36" ry="7" fill="#E2E8F0" />
          {/* Corpo do Pufe redondo em massinha */}
          <ellipse cx="50" cy="58" rx="36" ry="24" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="34" ry="20" fill="#FBBF24" />
          {/* Gomos e costuras do pufe */}
          <path d="M50 30C42 42 42 58 50 70" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M26 40C34 46 38 54 36 66" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M74 40C66 46 62 54 64 66" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          {/* Botão central do pufe */}
          <circle cx="50" cy="48" r="4.5" fill="#B45309" />
          <circle cx="50" cy="48" r="2.5" fill="#FEF3C7" />
        </svg>
      );

    case 'papel':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="28" ry="6" fill="#E2E8F0" />
          {/* Rolo de papel higiênico branco e fofinho */}
          <rect x="30" y="26" width="40" height="50" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Folha soltando suavemente */}
          <path d="M70 34V68C70 72 64 74 60 74H48" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 2" fill="none" />
          <path d="M30 60V78C30 82 36 84 42 84H56V66" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          {/* Topo do rolo */}
          <ellipse cx="50" cy="26" rx="20" ry="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Tubo de papelão central */}
          <ellipse cx="50" cy="26" rx="7" ry="3" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
        </svg>
      );

    case 'arvore':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="36" ry="6" fill="#E2E8F0" />
          <rect x="42" y="52" width="16" height="34" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="28" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
          <circle cx="36" cy="46" r="18" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          <circle cx="64" cy="46" r="18" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          <circle cx="50" cy="30" r="18" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
        </svg>
      );

    case 'regador':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="34" ry="6" fill="#E2E8F0" />
          <rect x="30" y="44" width="38" height="40" rx="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M30 52C20 52 14 62 14 70C14 78 20 80 30 80" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 56L84 46" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="85" cy="45" rx="5" ry="8" fill="#0284C7" />
        </svg>
      );

    case 'balanco':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="36" ry="6" fill="#E2E8F0" />
          <line x1="28" y1="14" x2="32" y2="70" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="14" x2="68" y2="70" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="22" y="70" width="56" height="9" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        </svg>
      );

    case 'cerca':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={combinedClassName}>
          <ellipse cx="50" cy="88" rx="38" ry="6" fill="#E2E8F0" />
          <rect x="16" y="44" width="68" height="7" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <rect x="16" y="64" width="68" height="7" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <path d="M22 84V28L28 22L34 28V84H22Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <path d="M44 84V28L50 22L56 28V84H44Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <path d="M66 84V28L72 22L78 28V84H66Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <div className={`${combinedClassName} flex items-center justify-center rounded-2xl bg-amber-50/60 border border-dashed border-amber-200/80 p-1 shadow-xs select-none`}>
          <span className="text-3xl filter drop-shadow-xs" role="img" aria-label={itemId}>
            {fallbackIcon || '⭐'}
          </span>
        </div>
      );
  }
};
