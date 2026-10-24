import type { PlayerProgress } from '../types/game';

const STORAGE_KEY = 'soletrando_o_mundo_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  completedItems: {},
  completedRooms: {},
  starsCount: 0,
  activeWorldId: 1,
};

class StorageService {
  public getProgress(): PlayerProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }

  public saveProgress(progress: PlayerProgress): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }

  public registerItemCompletion(itemId: string, worldId: number): PlayerProgress {
    const current = this.getProgress();
    const isNew = !current.completedItems[itemId];

    const updated: PlayerProgress = {
      ...current,
      completedItems: {
        ...current.completedItems,
        [itemId]: {
          completedAt: new Date().toISOString(),
          stars: 1,
        },
      },
      starsCount: isNew ? current.starsCount + 1 : current.starsCount,
      activeWorldId: worldId,
    };

    this.saveProgress(updated);
    return updated;
  }

  public resetProgress(): PlayerProgress {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        if (window.indexedDB && window.indexedDB.databases) {
          window.indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
          }).catch(() => {});
        }
      } catch {}
    }
    return DEFAULT_PROGRESS;
  }
}

export const storageService = new StorageService();
