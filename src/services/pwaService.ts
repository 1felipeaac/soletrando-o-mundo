// Gerenciamento de instalação PWA e status offline
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type DevicePlatform = 'ios' | 'android' | 'desktop';

class PwaService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.notify();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.notify();
      });
    }
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const isAndroidApp = typeof document !== 'undefined' && document.referrer.includes('android-app://');
    return isStandaloneDisplay || isIOSStandalone || isAndroidApp;
  }

  public getPlatform(): DevicePlatform {
    if (typeof window === 'undefined') return 'desktop';
    const ua = window.navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      return 'ios';
    }
    if (/android/i.test(ua)) {
      return 'android';
    }
    return 'desktop';
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.notify();
    return outcome === 'accepted';
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const pwaService = new PwaService();
