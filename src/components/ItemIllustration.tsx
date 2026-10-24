// Ilustrações vetoriais acessíveis, amigáveis e não-hiperestimulantes
// Garante representação inequívoca de cada objeto do mundo infantil.

interface ItemIllustrationProps {
  itemId: string;
  fallbackIcon?: string;
  className?: string;
}

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  itemId,
  fallbackIcon,
  className = 'w-14 h-14',
}) => {
  switch (itemId.toLowerCase()) {
    case 'mesa':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="22" y="10" width="56" height="80" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          <rect x="28" y="18" width="44" height="30" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <rect x="28" y="54" width="44" height="30" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="34" cy="52" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'tapete':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="50" cy="50" rx="46" ry="24" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="36" ry="18" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <ellipse cx="50" cy="50" rx="24" ry="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'bola':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="50" cy="88" rx="28" ry="6" fill="#E2E8F0" />
          <circle cx="50" cy="50" r="36" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
          <path d="M26 30C36 40 40 60 30 72" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M74 30C64 40 60 60 70 72" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="50" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );

    case 'urso':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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

    default:
      return (
        <span className="text-4xl flex items-center justify-center select-none" role="img" aria-label={itemId}>
          {fallbackIcon || '⭐'}
        </span>
      );
  }
};
