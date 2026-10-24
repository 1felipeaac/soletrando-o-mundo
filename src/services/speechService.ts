// Serviço de áudio 100% natural neural (pt-BR Francisca Neural gravado de estúdio)
// Respeito ao ritmo infantil: sem sintetizadores robóticos do navegador, sem sobreposições e com cancelamento instantâneo.

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isManuallyCancelled = false;

  public cancel() {
    this.isManuallyCancelled = true;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
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
        resolve(false);
      };

      audio.play().catch((err: unknown) => {
        const isAbort = (err as Error)?.name === 'AbortError' || this.isManuallyCancelled;
        resolve(isAbort);
      });
    });
  }

  // Toca a sílaba com a voz neural natural acolhedora
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
      console.warn(`[Áudio] Sílaba neural não encontrada: ${clean}`);
    }
  }

  // Toca o nome do objeto com cadência natural (ex: "Cá... má! Cama!")
  public async speakItemName(itemId: string, syllables: string[]) {
    const clean = itemId.trim().toLowerCase();
    const ok = await this.playAudioClip(`/audio/items/${clean}.mp3`);
    if (!ok && !this.isManuallyCancelled) {
      // Encadeia as sílabas naturais locais com ritmo calmo
      for (const s of syllables) {
        if (this.isManuallyCancelled) break;
        await this.playAudioClip(`/audio/syllables/${s.toUpperCase()}.mp3`);
        await new Promise((r) => setTimeout(r, 220));
      }
    }
  }

  // Feedback com humor para sílabas invertidas com áudio neural
  public async speakInverted(_formed?: string, _targetName?: string) {
    await this.playAudioClip('/audio/feedback/inverted.mp3');
  }

  // Fala da dica descritiva do objeto (áudio neural gravado de estúdio)
  public async speakHint(itemId: string, _fallbackHint?: string) {
    const clean = itemId.trim().toLowerCase();
    const ok = await this.playAudioClip(`/audio/hints/${clean}.mp3`);
    if (!ok && !this.isManuallyCancelled) {
      console.warn(`[Áudio] Dica neural não encontrada para: ${clean}`);
    }
  }
}

export const speechService = new SpeechService();

