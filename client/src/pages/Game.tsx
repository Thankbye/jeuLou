import BattleScreen from '@/components/BattleScreen';
import DialogueScene from '@/components/DialogueScene';
import TransformationScene from '@/components/TransformationScene';
import MinigameMemory from '@/components/MinigameMemory';
import MinigameQTE from '@/components/MinigameQTE';
import MinigameDebug from '@/components/MinigameDebug';
import { scenes } from '@/lib/gameData';
import { useEffect, useState } from 'react';

type SceneType = string;

export default function Game() {
  const [currentSceneId, setCurrentSceneId] = useState<SceneType>('intro');
  const [prevSceneId, setPrevSceneId] = useState<SceneType | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [endingTitle, setEndingTitle] = useState('');
  const [gameFlags, setGameFlags] = useState<Record<string, boolean>>({});
  const [endVisible, setEndVisible] = useState(false);

  const currentScene = scenes[currentSceneId];

  const setFlag = (flag: string) => setGameFlags(prev => ({ ...prev, [flag]: true }));

  // Smooth scene transitions
  const goToScene = (id: string) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setPrevSceneId(currentSceneId);
      setCurrentSceneId(id);
      setTransitioning(false);
    }, 0); // Instant — DialogueScene handles its own entrance
  };

  const handleNextScene = () => {
    if (currentScene.nextScene) goToScene(currentScene.nextScene);
  };

  const handleChoice = (nextScene: string) => {
    goToScene(nextScene);
  };

  const handleBattleEnd = (winner: 'player' | 'enemy') => {
    if (winner === 'player') {
      goToScene(gameFlags.ugo_hostage_mid ? 'post_battle_ugo_hurt' : 'post_battle_ugo_free');
    } else {
      goToScene('battle_defeat');
    }
  };

  const handleGameEnd = () => {
    setEndingTitle(currentScene?.title || 'Fin');
    setGameEnded(true);
  };

  const handleMinigameResult = (success: boolean) => {
    const scene = currentScene;
    if (success) {
      setFlag(`minigame_${scene.id}_success`);
      if (scene.nextScene) goToScene(scene.nextScene);
    } else {
      if (scene.failScene) goToScene(scene.failScene);
      else if (scene.nextScene) goToScene(scene.nextScene);
    }
  };

  // Ending animation
  useEffect(() => {
    if (gameEnded) {
      setEndVisible(false);
      const t = setTimeout(() => setEndVisible(true), 100);
      return () => clearTimeout(t);
    }
  }, [gameEnded, endingTitle]);

  const endingColors: Record<string, { from: string; to: string }> = {
    'FIN - Lou Ladybug': { from: '#dc2626', to: '#ec4899' },
    "FIN SOMBRE - L'Ombre de Medusa": { from: '#1e1b4b', to: '#312e81' },
    'FIN - La Force des Mots': { from: '#0f766e', to: '#0891b2' },
    'FIN - Incorruptible': { from: '#7c3aed', to: '#0891b2' },
    'Medusa, la Gardienne de Paris': { from: '#7c3aed', to: '#ec4899' },
    'FIN - Le Prix de la Victoire': { from: '#b45309', to: '#dc2626' },
    'FIN - Alliance Parfaite': { from: '#0891b2', to: '#7c3aed' },
    'FIN - Identite Secrete': { from: '#059669', to: '#7c3aed' },
    'FIN - Code et Courage': { from: '#2563eb', to: '#7c3aed' },
    'FIN - Infiltration': { from: '#1e1b4b', to: '#065f46' },
  };

  const ec = endingColors[endingTitle] || { from: '#7c3aed', to: '#0891b2' };

  if (gameEnded) {
    return (
      <div
        className="w-full h-screen flex flex-col justify-center items-center overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${ec.from}, #0a0514, ${ec.to})` }}
      >
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'white',
                opacity: 0.3 + Math.random() * 0.5,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div
          className="relative z-10 text-center px-8 max-w-2xl"
          style={{
            opacity: endVisible ? 1 : 0,
            transform: endVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>🎉</div>
          <h1 className="text-4xl font-black text-white mb-4"
            style={{ textShadow: '0 0 30px rgba(167,139,250,0.8)' }}>
            {endingTitle}
          </h1>
          <p className="text-xl text-purple-200 mb-10">Merci d'avoir joué à Miraculous Lou !</p>
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => { setCurrentSceneId('intro'); setGameEnded(false); setGameFlags({}); }}
              className="font-bold px-10 py-3 rounded-full text-white text-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                border: 'none',
                boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              🔄 Rejouer depuis le début
            </button>
            <button
              onClick={() => { setCurrentSceneId('miraculous_offer'); setGameEnded(false); setGameFlags({}); }}
              className="font-bold px-10 py-3 rounded-full text-white text-sm"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              🔀 Essayer un autre chemin
            </button>
          </div>
        </div>

        <style>{`
          @keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        `}</style>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <p className="text-white text-2xl">Scene introuvable : {currentSceneId}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {currentScene.type === 'transformation' ? (
        <TransformationScene onComplete={handleNextScene} isLadybug={false} />
      ) : currentScene.type === 'transformation_ladybug' ? (
        <TransformationScene onComplete={handleNextScene} isLadybug={true} />
      ) : currentScene.type === 'battle' ? (
        <BattleScreen onBattleEnd={handleBattleEnd} />
      ) : currentScene.type === 'minigame_memory' ? (
        <MinigameMemory scene={currentScene} onComplete={handleMinigameResult} />
      ) : currentScene.type === 'minigame_qte' ? (
        <MinigameQTE scene={currentScene} onComplete={handleMinigameResult} />
      ) : currentScene.type === 'minigame_debug' ? (
        <MinigameDebug scene={currentScene} onComplete={handleMinigameResult} />
      ) : currentScene.type === 'ending' ? (
        <DialogueScene scene={currentScene} onNext={handleGameEnd} onChoice={handleChoice} />
      ) : (
        <DialogueScene scene={currentScene} onNext={handleNextScene} onChoice={handleChoice} />
      )}
    </div>
  );
}
