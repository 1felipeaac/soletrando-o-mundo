// Serviço de áudio neural e síntese de voz (pt-BR Francisca Neural)
// Respeito ao ritmo infantil: sem sobreposições e com cancelamento instantâneo.

class SpeechService {
  private ptVoice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isManuallyCancelled = false;

  constructor() {
    this.initVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoices = voices.filter(
      (v) => v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.lang.startsWith('pt')
    );

    this.ptVoice =
      ptBrVoices.find((v) =>
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('luciana') ||
        v.name.toLowerCase().includes('maria')
      ) ||
      ptBrVoices[0] ||
      null;
  }

  public cancel() {
    this.isManuallyCancelled = true;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private playAudioClip(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.cancel();
      this.isManuallyCancelled = false;
      const audio = new Audio(src);
      this.currentAudio = audio;
      audio.volume = 1.0;

      audio.onended = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(true);
      };

      audio.onerror = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(this.isManuallyCancelled);
      };

      audio.play().catch((err: unknown) => {
        const isAbort = (err as Error)?.name === 'AbortError' || this.isManuallyCancelled;
        resolve(isAbort);
      });
    });
  }

  // Toca a sílaba com voz acolhedora
  public async speakSyllable(syllable: string) {
    const clean = syllable.trim().toUpperCase();
    let ok = await this.playAudioClip(`/audio/syllables/${clean}.mp3`);
    if (!ok && !this.isManuallyCancelled) {
      // Tenta versão sem acento se houver
      const normalized = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized !== clean) {
        ok = await this.playAudioClip(`/audio/syllables/${normalized}.mp3`);
      }
    }
    if (!ok && !this.isManuallyCancelled) {
      this.speakSyllableFallback(syllable);
    }
  }

  // Toca o nome do objeto (ex: Cama, Mesa) com cadência calma
  public async speakItemName(itemId: string, syllables: string[]) {
    const clean = itemId.trim().toLowerCase();
    const ok = await this.playAudioClip(`/audio/items/${clean}.mp3`);
    if (!ok && !this.isManuallyCancelled) {
      // Encadeia as sílabas com ritmo calmo
      for (const s of syllables) {
        if (this.isManuallyCancelled) break;
        await this.playAudioClip(`/audio/syllables/${s.toUpperCase()}.mp3`);
        await new Promise((r) => setTimeout(r, 220));
      }
    }
  }

  // Feedback com humor para sílabas invertidas
  public async speakInverted(formed: string, targetName: string) {
    const ok = await this.playAudioClip('/audio/feedback/inverted.mp3');
    if (!ok && !this.isManuallyCancelled) {
      const phrase = `${formed}! Ih, virou ${formed}! Que engraçado! Vamos trocar para formar ${targetName}?`;
      this.speakFallbackUtterance(phrase);
    }
  }

  // Fala da dica descritiva do objeto (áudio neural gravado de estúdio)
  public async speakHint(itemId: string, fallbackHint?: string) {
    const clean = itemId.trim().toLowerCase();
    const ok = await this.playAudioClip(`/audio/hints/${clean}.mp3`);
    if (!ok && !this.isManuallyCancelled && fallbackHint) {
      this.speakFallbackUtterance(fallbackHint);
    }
  }

  // --- Fallbacks Web Speech API ---
  private static readonly PHONETIC_MAP: Record<string, string> = {
    UR: 'Úr',
    POR: 'Pór',
    JUR: 'Júr',
    ÇÃ: 'Sã',
    GAR: 'Gár',
    FO: 'Fó',
    LO: 'Lô',
    SO: 'Só',
    FA: 'Fá',
    FÁ: 'Fá',
  };

  private speakSyllableFallback(syllable: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const clean = syllable.trim().toUpperCase();
    const spokenText = SpeechService.PHONETIC_MAP[clean] || syllable;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }

  private speakFallbackUtterance(phrase: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    if (this.ptVoice) utterance.voice = this.ptVoice;
    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechService();
