import { useEffect, useState } from 'react';
import { Scene } from '@/lib/gameData';

interface Props {
  scene: Scene;
  onComplete: (success: boolean) => void;
}

const ATTACKS = [
  { id: 'tentacule', name: 'Tentacule Fouet', icon: '🌊', color: '#ef4444' },
  { id: 'regard',    name: 'Regard Petrifiant', icon: '👁️', color: '#a855f7' },
  { id: 'barriere',  name: 'Barriere Lumineuse', icon: '🛡️', color: '#3b82f6' },
  { id: 'fuite',     name: 'Fuite Aquatique', icon: '💨', color: '#10b981' },
  { id: 'colere',    name: 'Colere de Medusa', icon: '⚡', color: '#f59e0b' },
];

type Phase = 'intro' | 'show' | 'input' | 'result';

export default function MinigameMemory({ scene, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sequence, setSequence] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [imageError, setImageError] = useState(false);

  // Generate sequence on mount
  useEffect(() => {
    const seq = Array.from({ length: 4 }, () => ATTACKS[Math.floor(Math.random() * ATTACKS.length)].id);
    setSequence(seq);
  }, []);

  // Countdown before showing
  useEffect(() => {
    if (phase !== 'intro') return;
    if (countdown <= 0) { setPhase('show'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Show sequence with highlights
  useEffect(() => {
    if (phase !== 'show' || sequence.length === 0) return;
    let i = 0;
    const showNext = () => {
      if (i >= sequence.length) { setTimeout(() => setPhase('input'), 600); return; }
      setHighlighted(sequence[i]);
      setTimeout(() => { setHighlighted(null); setTimeout(showNext, 400); i++; }, 700);
    };
    setTimeout(showNext, 500);
  }, [phase, sequence]);

  const handleClick = (id: string) => {
    if (phase !== 'input') return;
    const next = [...playerInput, id];
    setPlayerInput(next);
    setHighlighted(id);
    setTimeout(() => setHighlighted(null), 300);

    if (next.length === sequence.length) {
      const ok = next.every((v, i) => v === sequence[i]);
      setSuccess(ok);
      setPhase('result');
      setTimeout(() => onComplete(ok), 2000);
    }
  };

  const getBackgroundStyle = () => {
    const customBackground = '/assets/minigame_memory_bg_corrigé.png';
    
    // Retourne le style avec ton image personnalisée
    return {
      backgroundImage: `url(${customBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  };

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={getBackgroundStyle()}
    >
      {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      
      {/* Contenu principal - tout le reste reste identique */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8 px-6">
          <h1 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 20px #7c3aed' }}>
            Memorise les pouvoirs de Medusa !
          </h1>
          <p className="text-purple-300 text-sm">Reproduis la sequence dans le bon ordre</p>
        </div>

        {/* Phase intro */}
        {phase === 'intro' && (
          <div className="text-center">
            <div className="text-8xl font-black text-white mb-4" style={{ textShadow: '0 0 40px #7c3aed' }}>
              {countdown > 0 ? countdown : '!'}
            </div>
            <p className="text-purple-300">Prepare-toi...</p>
          </div>
        )}

        {/* Attack grid */}
        {(phase === 'show' || phase === 'input') && (
          <div className="grid grid-cols-5 gap-4 mb-8 px-6">
            {ATTACKS.map(atk => (
              <button key={atk.id} onClick={() => handleClick(atk.id)}
                disabled={phase !== 'input'}
                style={{
                  background: highlighted === atk.id ? atk.color : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${highlighted === atk.id ? atk.color : atk.color + '44'}`,
                  borderRadius: 16,
                  padding: '20px 12px',
                  cursor: phase === 'input' ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  transform: highlighted === atk.id ? 'scale(1.12)' : 'scale(1)',
                  boxShadow: highlighted === atk.id ? `0 0 30px ${atk.color}88` : 'none',
                }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{atk.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#f1f5f9', textAlign: 'center', lineHeight: 1.3 }}>
                  {atk.name}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Progress dots */}
        {phase === 'input' && (
          <div className="flex gap-3 mb-6 justify-center">
            {sequence.map((_, i) => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: '50%',
                background: i < playerInput.length ? '#a855f7' : 'rgba(255,255,255,0.15)',
                boxShadow: i < playerInput.length ? '0 0 10px #a855f7' : 'none',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
        )}

        {/* Show phase label */}
        {phase === 'show' && (
          <p className="text-purple-300 text-lg font-bold animate-pulse text-center">Observe bien...</p>
        )}
        {phase === 'input' && (
          <p className="text-cyan-300 text-lg font-bold text-center">A toi ! ({playerInput.length}/{sequence.length})</p>
        )}

        {/* Result */}
        {phase === 'result' && (
          <div className="text-center">
            <div className="text-6xl mb-4">{success ? '✅' : '❌'}</div>
            <p className="text-2xl font-black text-white">
              {success ? 'Parfait ! Tu connais tes pouvoirs !' : 'Sequence incorrecte... Mais on continue !'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}