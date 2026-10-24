import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WorldSelect } from './components/WorldSelect';
import { SceneBuilder } from './components/SceneBuilder';
import { WordArena } from './components/WordArena';
import { Footer } from './components/Footer';
import { ParentalGateModal } from './components/ParentalGateModal';
import { WORLDS_DATA } from './data/worldsData';
import { storageService } from './services/storageService';
import type { PlayerProgress, ItemStage } from './types/game';

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => storageService.getProgress());
  const [currentView, setCurrentView] = useState<'map' | 'room'>('map');
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [isParentalGateOpen, setIsParentalGateOpen] = useState(false);

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

  const handleSelectWorld = (worldId: number) => {
    const world = WORLDS_DATA.find((w) => w.id === worldId) || WORLDS_DATA[0];
    setActiveWorldId(worldId);
    setActiveItemId(world.items[0].id);
    setCurrentView('room');
  };

  const handleSelectItem = (item: ItemStage) => {
    setActiveItemId(item.id);
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
          <div className="space-y-4">
            {/* Montador Visual do Cômodo (Scene Builder) */}
            <SceneBuilder
              items={activeWorld.items}
              completedItemIds={completedItemIds}
              activeItemId={activeItem.id}
              onSelectItem={handleSelectItem}
            />

            {/* Arena de Soletração do Objeto em Foco */}
            <WordArena
              key={activeItem.id}
              item={activeItem}
              isItemCompleted={!!completedItemIds[activeItem.id]}
              onComplete={handleCompleteItem}
              onPrevItem={handlePrevItem}
              onNextItem={handleNextItem}
              hasPrev={activeItemIndex > 0}
              hasNext={activeItemIndex < activeWorld.items.length - 1}
            />
          </div>
        )}
      </main>

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
