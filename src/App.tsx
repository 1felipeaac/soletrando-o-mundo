import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WorldSelect } from './components/WorldSelect';
import { SceneBuilder } from './components/SceneBuilder';
import { WordArena } from './components/WordArena';
import { Footer } from './components/Footer';
import { ParentalGateModal } from './components/ParentalGateModal';
import { WORLDS_DATA } from './data/worldsData';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import type { PlayerProgress, ItemStage } from './types/game';

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => storageService.getProgress());
  const [currentView, setCurrentView] = useState<'map' | 'room'>('map');
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [isParentalGateOpen, setIsParentalGateOpen] = useState(false);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const activeWorld = WORLDS_DATA.find((w) => w.id === activeWorldId) || WORLDS_DATA[0];
  const [activeItemId, setActiveItemId] = useState<string>(activeWorld.items[0].id);

  const activeItem =
    activeWorld.items.find((i) => i.id === activeItemId) || activeWorld.items[0];
  const activeItemIndex = activeWorld.items.findIndex((i) => i.id === activeItem.id);

  const totalItemsCount = WORLDS_DATA.reduce((acc, w) => acc + w.items.length, 0);

  // Mapeamento booleano de itens concluídos
  const completedItemIds: Record<string, boolean> = {};
  Object.keys(progress.completedItems).forEach((id) => {
    completedItemIds[id] = true;
  });

  // Navegação Sequencial de Cômodos (Passagem Direta sem voltar ao mapa)
  const activeWorldIndex = WORLDS_DATA.findIndex((w) => w.id === activeWorldId);
  const hasPrevWorld = activeWorldIndex > 0;
  const hasNextWorld = activeWorldIndex < WORLDS_DATA.length - 1;
  const prevWorld = hasPrevWorld ? WORLDS_DATA[activeWorldIndex - 1] : null;
  const nextWorld = hasNextWorld ? WORLDS_DATA[activeWorldIndex + 1] : null;
  const isNextWorldLocked = nextWorld?.requiredStars ? progress.starsCount < nextWorld.requiredStars : false;

  const scrollToArenaIfIncomplete = (world: typeof activeWorld) => {
    const isCompleted = world.items.every((i) => !!progress.completedItems[i.id]);
    if (!isCompleted) {
      setTimeout(() => {
        const el = document.getElementById('spelling-arena');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  const handleSelectWorld = (worldId: number) => {
    const world = WORLDS_DATA.find((w) => w.id === worldId) || WORLDS_DATA[0];
    if (world.requiredStars && progress.starsCount < world.requiredStars) {
      return;
    }
    setActiveWorldId(worldId);
    // Prioriza o primeiro item pendente de soletração daquele cômodo
    const firstIncomplete = world.items.find((i) => !progress.completedItems[i.id]) || world.items[0];
    setActiveItemId(firstIncomplete.id);
    setCurrentView('room');
    scrollToArenaIfIncomplete(world);
  };

  const handlePrevWorld = () => {
    if (hasPrevWorld && prevWorld) {
      soundService.playWoodClick();
      handleSelectWorld(prevWorld.id);
    }
  };

  const handleNextWorld = () => {
    if (!hasNextWorld || !nextWorld) return;
    if (isNextWorldLocked) {
      soundService.playBoing();
      const missing = (nextWorld.requiredStars ?? 0) - progress.starsCount;
      setLockedNotice(`Faltam ${missing} ⭐ para abrir ${nextWorld.title}!`);
      setTimeout(() => setLockedNotice(null), 3500);
      return;
    }
    soundService.playWoodClick();
    handleSelectWorld(nextWorld.id);
  };

  const handleSelectItem = (item: ItemStage) => {
    setActiveItemId(item.id);
    setTimeout(() => {
      const el = document.getElementById('spelling-arena');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleCompleteItem = (itemId: string) => {
    const updated = storageService.registerItemCompletion(itemId, activeWorldId);
    setProgress(updated);
  };

  const handlePrevItem = () => {
    if (activeItemIndex > 0) {
      setActiveItemId(activeWorld.items[activeItemIndex - 1].id);
    }
  };

  const handleNextItem = () => {
    if (activeItemIndex < activeWorld.items.length - 1) {
      setActiveItemId(activeWorld.items[activeItemIndex + 1].id);
    }
  };

  const handleResetProgress = () => {
    const reset = storageService.resetProgress();
    setProgress(reset);
    setCurrentView('map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f4fc] via-[#f1f7fc] to-[#faf8f5] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        starsCount={progress.starsCount}
        totalItems={totalItemsCount}
        currentWorldTitle={currentView === 'room' ? activeWorld.title : undefined}
        onOpenParentalGate={() => setIsParentalGateOpen(true)}
      />

      <main className="flex-1 w-full pb-10">
        {currentView === 'map' && (
          <WorldSelect
            worlds={WORLDS_DATA}
            completedItemIds={completedItemIds}
            onSelectWorld={handleSelectWorld}
          />
        )}

        {currentView === 'room' && (
          <div className="max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
              {/* Montador Visual do Cômodo (Scene Builder com Navegação Sequencial) */}
              <div className="lg:col-span-6 xl:col-span-6">
                <SceneBuilder
                  world={activeWorld}
                  completedItemIds={completedItemIds}
                  activeItemId={activeItem.id}
                  onSelectItem={handleSelectItem}
                  onPrevWorld={handlePrevWorld}
                  onNextWorld={handleNextWorld}
                  hasPrevWorld={hasPrevWorld}
                  hasNextWorld={hasNextWorld}
                  prevWorldName={prevWorld?.shortName}
                  nextWorldName={nextWorld?.shortName}
                  isNextWorldLocked={isNextWorldLocked}
                />
              </div>

              {/* Arena de Soletração do Objeto em Foco */}
              <div className="lg:col-span-6 xl:col-span-6">
                <WordArena
                  key={activeItem.id}
                  item={activeItem}
                  worldTitle={activeWorld.title}
                  placementLabel={activeWorld.placementLabel}
                  isItemCompleted={!!completedItemIds[activeItem.id]}
                  onComplete={handleCompleteItem}
                  onPrevItem={handlePrevItem}
                  onNextItem={handleNextItem}
                  hasPrev={activeItemIndex > 0}
                  hasNext={activeItemIndex < activeWorld.items.length - 1}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Aviso Acolhedor de Cômodo Bloqueado */}
      {lockedNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-lg border-2 border-amber-600 animate-pop-in flex items-center gap-2 text-xs sm:text-sm">
          <span>⭐</span>
          <span>{lockedNotice}</span>
        </div>
      )}

      {/* Trava Parental */}
      {isParentalGateOpen && (
        <ParentalGateModal
          isOpen={isParentalGateOpen}
          onClose={() => setIsParentalGateOpen(false)}
          onConfirmReset={handleResetProgress}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
