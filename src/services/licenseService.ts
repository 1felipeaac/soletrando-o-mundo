export interface LicensePayload {
  email: string;
  plan: 'SINGLE_ROOM' | 'FULL_HOUSE';
  unlockedRoomIds: number[];
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface LicenseData {
  isFullHouse: boolean;
  unlockedRoomIds: number[];
  email?: string;
  token?: string;
  activatedAt?: string;
}

const LICENSE_STORAGE_KEY = 'soletrando_license_v1';

// Salas gratuitas por padrão (Degustação inicial: Quarto e Cozinha)
export const FREE_ROOM_IDS = [1, 2];
export const ALL_ROOM_IDS = [1, 2, 3, 4, 5, 6];

class LicenseService {
  /**
   * Decodifica a parte do payload de um JWT sem depender de bibliotecas externas no cliente
   */
  private decodeJwtPayload(token: string): LicensePayload | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  public getLicense(): LicenseData {
    if (typeof window === 'undefined') {
      return { isFullHouse: false, unlockedRoomIds: [...FREE_ROOM_IDS] };
    }

    try {
      const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (!raw) {
        return { isFullHouse: false, unlockedRoomIds: [...FREE_ROOM_IDS] };
      }

      const parsed = JSON.parse(raw);
      if (parsed.token) {
        const payload = this.decodeJwtPayload(parsed.token);
        if (payload) {
          const isFull = payload.plan === 'FULL_HOUSE';
          return {
            isFullHouse: isFull,
            unlockedRoomIds: isFull ? ALL_ROOM_IDS : (payload.unlockedRoomIds || [...FREE_ROOM_IDS]),
            email: payload.email,
            token: parsed.token,
            activatedAt: parsed.activatedAt,
          };
        }
      }

      return {
        isFullHouse: !!parsed.isFullHouse,
        unlockedRoomIds: parsed.unlockedRoomIds || [...FREE_ROOM_IDS],
        email: parsed.email,
        token: parsed.token,
        activatedAt: parsed.activatedAt,
      };
    } catch {
      return { isFullHouse: false, unlockedRoomIds: [...FREE_ROOM_IDS] };
    }
  }

  /**
   * Salva e valida um token JWT emitido pelo backend
   */
  public saveLicenseToken(token: string): LicenseData {
    const current = this.getLicense();
    const payload = this.decodeJwtPayload(token);
    const isFull = payload?.plan === 'FULL_HOUSE' || current.isFullHouse;
    const unlocked = isFull
      ? ALL_ROOM_IDS
      : Array.from(new Set([...FREE_ROOM_IDS, ...current.unlockedRoomIds, ...(payload?.unlockedRoomIds || [])]));

    const licenseData: LicenseData = {
      isFullHouse: isFull,
      unlockedRoomIds: unlocked,
      email: payload?.email || current.email,
      token,
      activatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(licenseData));
    }

    return licenseData;
  }

  /**
   * Checa se determinado cômodo está liberado para jogar
   */
  public isRoomUnlocked(roomId: number, isRoomFree?: boolean): boolean {
    if (isRoomFree || FREE_ROOM_IDS.includes(roomId)) {
      return true;
    }
    const lic = this.getLicense();
    if (lic.isFullHouse) {
      return true;
    }
    return lic.unlockedRoomIds.includes(roomId);
  }

  /**
   * Indica se o usuário comprou pelo menos 1 cômodo avulso (para oferecer upgrade a R$ 10,00)
   */
  public canUpgradeToFullHouse(): boolean {
    const lic = this.getLicense();
    if (lic.isFullHouse) return false;
    // Se possui algum cômodo além dos gratuitos 1 e 2
    return lic.unlockedRoomIds.some((id) => !FREE_ROOM_IDS.includes(id));
  }
}

export const licenseService = new LicenseService();
