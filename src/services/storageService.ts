import type { PlayerProgress, ParentSettings } from '../types/game';

const STORAGE_KEY = 'soletrando_o_mundo_progress_v1';

export const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  screenTimeLimitMinutes: 20, // Padrão recomendado pela Sociedade Brasileira de Pediatria (SBP)
  enableSoundEffects: true,
};

const DEFAULT_PROGRESS: PlayerProgress = {
  completedItems: {},
  completedRooms: {},
  starsCount: 0,
  activeWorldId: 1,
  parentSettings: DEFAULT_PARENT_SETTINGS,
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
        parentSettings: {
          ...DEFAULT_PARENT_SETTINGS,
          ...(parsed.parentSettings || {}),
        },
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

  public getParentSettings(): ParentSettings {
    const progress = this.getProgress();
    return progress.parentSettings || DEFAULT_PARENT_SETTINGS;
  }

  public saveParentSettings(settings: Partial<ParentSettings>): ParentSettings {
    const progress = this.getProgress();
    const updatedSettings: ParentSettings = {
      ...(progress.parentSettings || DEFAULT_PARENT_SETTINGS),
      ...settings,
    };
    const updatedProgress: PlayerProgress = {
      ...progress,
      parentSettings: updatedSettings,
    };
    this.saveProgress(updatedProgress);
    return updatedSettings;
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

  public registerMemoryGameCompletion(worldId: number): PlayerProgress {
    return this.registerMemoryLevelCompletion(worldId, 1);
  }

  public registerMemoryLevelCompletion(worldId: number, level: number): PlayerProgress {
    const current = this.getProgress();
    const prevMax = current.completedMemoryLevels?.[worldId] || 0;
    const newMax = Math.max(prevMax, level);

    const updated: PlayerProgress = {
      ...current,
      completedMemoryRooms: {
        ...(current.completedMemoryRooms || {}),
        [worldId]: true,
      },
      completedMemoryLevels: {
        ...(current.completedMemoryLevels || {}),
        [worldId]: newMax,
      },
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
