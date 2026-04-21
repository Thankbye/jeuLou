import { useEffect, useRef, useState } from 'react';
import { Scene } from '@/lib/gameData';

interface Props {
  scene: Scene;
  onComplete: (success: boolean) => void;
}

interface DebugChallenge {
  title: string;
  description: string;
  code: string[];
  bugLine: number;
  options: string[];
  correctOption: number;
  explanation: string;
}

const CHALLENGES: DebugChallenge[] = [
  {
    title: "Erreur dans le systeme de detection d'Akuma",
    description: "Le code qui detecte les Akumas ne fonctionne plus. Trouve la ligne bugguee !",
    code: [
      'function detectAkuma(signal: number): boolean {',
      '  const threshold = 100;',
      '  if (signal = threshold) {',
      '    return true;',
      '  }',
      '  return false;',
      '}',
    ],
    bugLine: 2,
    options: [
      "Ligne 1 : le type de retour est faux",
      "Ligne 3 : utilise == au lieu de =",
      "Ligne 5 : return true devrait etre return false",
      "Ligne 6 : return false est inutile",
    ],
    correctOption: 1,
    explanation: "= est une affectation, pas une comparaison. Il faut === pour comparer en TypeScript !",
  },
  {
    title: "Le tracker de Papillon plante",
    description: "L'app qui traque Papillon boucle a l'infini. Trouve le bug !",
    code: [
      'function trackPapillon(positions: string[]) {',
      '  let i = 0;',
      '  while (i < positions.length) {',
      '    console.log(positions[i]);',
      '    // i++;',
      '  }',
      '}',
    ],
    bugLine: 4,
    options: [
      "Ligne 1 : le parametre devrait etre un objet",
      "Ligne 2 : i devrait commencer a 1",
      "Ligne 3 : la condition est inversee",
      "Ligne 5 : le increment est commente, boucle infinie !",
    ],
    correctOption: 3,
    explanation: "i++ est en commentaire ! Sans increment, la condition i < positions.length reste toujours vraie.",
  },
  {
    title: "Systeme de communication Kwami hors ligne",
    description: "Lou ne peut plus parler a son Kwami. Trouve l'erreur dans l'API !",
    code: [
      'async function callKwami(message: string) {',
      '  const response = await fetch("/api/kwami", {',
      '    method: "POST",',
      '    body: message,',
      '  });',
      '  return response.json();',
      '}',
    ],
    bugLine: 3,
    options: [
      "Ligne 1 : la fonction ne devrait pas etre async",
      "Ligne 2 : l'URL est incorrecte",
      "Ligne 4 : body doit etre JSON.stringify(message)",
      "Ligne 6 : il faut await response.json()",
    ],
    correctOption: 2,
    explanation: "fetch avec method POST attend un body serialise en JSON. Sans JSON.stringify, le serveur recoit du texte brut !",
  },
];

export default function MinigameDebug({ scene, onComplete }: Props) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const challenge = CHALLENGES[challengeIdx];

  useEffect(() => {
    if (done || selected !== null) return;
    setTimeLeft(20);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          handleSelect(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [challengeIdx, done]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(idx);

    const correct = idx === challenge.correctOption;
    if (correct) setScore(s => s + 1);
    setShowExplanation(true);

    setTimeout(() => {
      setShowExplanation(false);
      setSelected(null);
      if (challengeIdx + 1 >= CHALLENGES.length) {
        setDone(true);
        setTimeout(() => onComplete(score + (correct ? 1 : 0) >= 2), 2000);
      } else {
        setChallengeIdx(c => c + 1);
      }
    }, 2500);
  };

  const timerPct = (timeLeft / 20) * 100;

  const getBackgroundStyle = () => {
    const customBackground = '/assets/minigame_debug_bg.png';
    
    return {
      backgroundImage: `url(${customBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4 relative"
      style={getBackgroundStyle()}>

      {/* Overlay pour la lisibilité */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: '#60a5fa', textShadow: '0 0 20px #3b82f6' }}>
            🖥️ Debug Session
          </h1>
          <p className="text-blue-300 text-sm">Lou, trouve le bug avant que Papillon ne prenne l'avantage !</p>
          <div className="flex gap-2 justify-center mt-2">
            {CHALLENGES.map((_, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i < challengeIdx ? '#10b981' : i === challengeIdx ? '#3b82f6' : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>
        </div>

        {!done ? (
          <div style={{ maxWidth: 700, width: '100%', margin: '0 auto' }}>
            {/* Timer */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${timerPct}%`, borderRadius: 99, transition: 'width 1s linear',
                background: timerPct > 50 ? '#3b82f6' : timerPct > 25 ? '#f59e0b' : '#ef4444' }} />
            </div>

            {/* Challenge info */}
            <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
              <p className="font-bold text-blue-300 text-sm mb-1">{challenge.title}</p>
              <p className="text-slate-300 text-xs">{challenge.description}</p>
            </div>

            {/* Code block */}
            <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', marginBottom: 16, fontFamily: 'monospace', fontSize: 13 }}>
              {challenge.code.map((line, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12,
                  background: i === challenge.bugLine ? 'rgba(239,68,68,0.15)' : 'transparent',
                  borderLeft: i === challenge.bugLine && selected !== null ? '3px solid #ef4444' : '3px solid transparent',
                  padding: '2px 8px', borderRadius: 4,
                }}>
                  <span style={{ color: 'rgba(148,163,184,0.5)', minWidth: 20, textAlign: 'right', userSelect: 'none' }}>{i + 1}</span>
                  <span style={{ color: '#e2e8f0', whiteSpace: 'pre' }}>{line}</span>
                </div>
              ))}
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {challenge.options.map((opt, i) => {
                let bg = 'rgba(0,0,0,0.6)';
                let border = '1px solid rgba(255,255,255,0.1)';
                let color = '#e2e8f0';
                if (selected !== null) {
                  if (i === challenge.correctOption) { bg = 'rgba(16,185,129,0.3)'; border = '1px solid #10b981'; color = '#34d399'; }
                  else if (i === selected && i !== challenge.correctOption) { bg = 'rgba(239,68,68,0.3)'; border = '1px solid #ef4444'; color = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                    style={{ background: bg, border, borderRadius: 10, padding: '12px 14px', cursor: selected !== null ? 'default' : 'pointer', textAlign: 'left', color, fontSize: 12, lineHeight: 1.4, transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (selected === null) (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.25)'; }}
                    onMouseLeave={e => { if (selected === null) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.6)'; }}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div style={{ marginTop: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '10px 14px' }}>
                <p className="text-emerald-300 text-xs">{challenge.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">{score >= 2 ? '💻' : '🐛'}</div>
            <p className="text-2xl font-black text-white mb-2">
              {score >= 2 ? 'Bug corrige ! Systeme operationnel.' : 'Des bugs restent... mais Lou persiste !'}
            </p>
            <p className="text-blue-300">{score}/3 bugs trouves</p>
          </div>
        )}
      </div>
    </div>
  );
}