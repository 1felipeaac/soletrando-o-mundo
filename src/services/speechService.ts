// Serviço de áudio 100% natural neural (pt-BR Francisca Neural gravado de estúdio)
// Respeito ao ritmo infantil: sem sintetizadores robóticos do navegador, sem sobreposições e com cancelamento instantâneo.

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSequenceId = 0;

  // Interrompe imediatamente qualquer áudio ou sequência de soletração em andamento
  public cancel() {
    this.currentSequenceId++;
    this.stopAudio();
  }

  // Para o elemento de áudio em execução sem abortar a sequência
  private stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
  }

  private playAudioClip(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.stopAudio();
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

      audio.play().catch(() => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(false);
      });
    });
  }

  // Toca a sílaba com a voz neural natural acolhedora
  // Diferenciação fonética (BNCC): S inicial tem som de Ç (/s/), S intervocálico tem som de Z (/z/)
  public async speakSyllable(syllable: string, contextItemId?: string): Promise<boolean> {
    const clean = syllable.trim().toUpperCase();
    const encoded = encodeURIComponent(clean);

    // Caso de S intervocálico em palavras específicas (som de Z: ME-ZA, VA-ZO, RO-ZA, CA-ZA-CO)
    const isIntervocalicZ = contextItemId && ['mesa', 'vaso', 'rosa', 'casaco'].includes(contextItemId.trim().toLowerCase());
    if (isIntervocalicZ && (clean === 'SA' || clean === 'SO')) {
      const okZ = await this.playAudioClip(`/audio/syllables/${clean}_Z.mp3`);
      if (okZ) return true;
    }

    // 1. Tenta o arquivo direto (ex: /audio/syllables/CA.mp3, SA.mp3 com som de Ç)
    let ok = await this.playAudioClip(`/audio/syllables/${clean}.mp3`);

    // 2. Tenta versão com codificação de URI
    if (!ok && encoded !== clean) {
      ok = await this.playAudioClip(`/audio/syllables/${encoded}.mp3`);
    }

    // 3. Caso especial para ÇÃ (som nasal de Sã, salvo como SA_TIL)
    if (!ok && clean === 'ÇÃ') {
      ok = await this.playAudioClip('/audio/syllables/SA_TIL.mp3');
    }

    // 4. Fallback: versão normalizada sem acentos (ex: LÓ -> LO, FÁ -> FA)
    if (!ok && clean !== 'ÇÃ') {
      const normalized = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized !== clean) {
        ok = await this.playAudioClip(`/audio/syllables/${normalized}.mp3`);
      }
    }

    if (!ok) {
      console.warn(`[Áudio] Sílaba neural não encontrada: ${clean}`);
    }
    return ok;
  }

  // Soletra o objeto pausadamente (sílaba por sílaba com intervalo calmo) e conclui com a palavra
  public async speakItemName(itemId: string, syllables: string[]) {
    // Inicia uma nova sequência exclusiva (cancela sequências anteriores)
    this.cancel();
    const seqId = this.currentSequenceId;
    const clean = itemId.trim().toLowerCase();

    // 1. Toca cada sílaba individualmente com pausa pedagógica compassada (700ms)
    for (let i = 0; i < syllables.length; i++) {
      if (this.currentSequenceId !== seqId) return;
      await this.speakSyllable(syllables[i], clean);
      if (this.currentSequenceId !== seqId) return;

      // Pausa respiratória clara entre as sílabas para a criança assimilar
      await new Promise((r) => setTimeout(r, 700));
    }

    if (this.currentSequenceId !== seqId) return;

    // 2. Pausa suave antes da síntese da palavra completa
    await new Promise((r) => setTimeout(r, 250));
    if (this.currentSequenceId !== seqId) return;

    // 3. Toca a palavra inteira acolhedora (ex: "Cama.")
    let ok = await this.playAudioClip(`/audio/words/${clean}.mp3`);
    if (!ok && this.currentSequenceId === seqId) {
      ok = await this.playAudioClip(`/audio/items/${clean}.mp3`);
    }
  }

  // Feedback com humor para sílabas invertidas com áudio neural
  public async speakInverted(_formed?: string, _targetName?: string) {
    this.cancel();
    await this.playAudioClip('/audio/feedback/inverted.mp3');
  }

  // Fala da dica descritiva do objeto (áudio neural gravado de estúdio)
  public async speakHint(itemId: string, _fallbackHint?: string) {
    this.cancel();
    const clean = itemId.trim().toLowerCase();
    const ok = await this.playAudioClip(`/audio/hints/${clean}.mp3`);
    if (!ok) {
      console.warn(`[Áudio] Dica neural não encontrada para: ${clean}`);
    }
  }
}

export const speechService = new SpeechService();

