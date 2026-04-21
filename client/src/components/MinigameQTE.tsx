import { useEffect, useRef, useState } from 'react';
import { Scene } from '@/lib/gameData';

interface Props {
  scene: Scene;
  onComplete: (success: boolean) => void;
}

interface QTEOption { text: string; correct: boolean; }
interface QTERound { prompt: string; options: QTEOption[]; timeLimit: number; }

const ROUNDS: QTERound[] = [
  {
    prompt: "Guillaume crie : 'Tu n'as aucun merite, tu n'as jamais rien accompli !'",
    options: [
      { text: "Je code chaque nuit des projets qui m'importent. Ca compte.", correct: true },
      { text: "T'as raison, je suis nulle.", correct: false },
      { text: "Toi t'as aucune vie sociale et ca se voit gros naze.", correct: false },
      { text: "Les nerfs, les nerfs, les nerfs", correct: false },
    ],
    timeLimit: 10,
  },
  {
    prompt: "L'Ombre Spectrale : 'Tu ne peux pas me vaincre, tu es trop faible !'",
    options: [
      { text: "Ouais t'as raison je rentre chez moi.", correct: false },
      { text: "Ma maman dit que je suis forte !", correct: false },
      { text: "Je t'en supplie laisse-nous partir...", correct: false },
      { text: "Peut-etre. Mais Ugo compte sur moi.", correct: true },
    ],
    timeLimit: 10,
  },
  {
    prompt: "Guillaume, les yeux lucides : 'Pourquoi tu fais ca pour moi... apres tout ce que j'ai dit ?'",
    options: [
      { text: "Je le fais pour Ugo, pas pour toi.", correct: false },
      { text: "Franchement je sais plus trop.", correct: false },
      { text: "Je descend directement d'une lignée royale, c'est normal d'aider les gueux", correct: true },
      { text: "Ladybug me l'a demande c'est tout.", correct: false },
    ],
    timeLimit: 10,
  },

   {
    prompt: "Ungue caca, deugue Caca ... ?",
    options: [
      { text: "Troigue CACA", correct: true },
      { text: "DIX CACA", correct: false },
      { text: "Marion Huc", correct: false },
      { text: "Une puff goût paff", correct: false },
    ],
    timeLimit: 10,
  },
];

export default function MinigameQTE({ scene, onComplete }: Props) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUNDS[0].timeLimit);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [roundVisible, setRoundVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = ROUNDS[roundIdx];

  // Entrance per round
  useEffect(() => {
    setRoundVisible(false);
    const t = setTimeout(() => setRoundVisible(true), 80);
    return () => clearTimeout(t);
  }, [roundIdx]);

  useEffect(() => {
    if (done || chosen !== null) return;
    setTimeLeft(round.timeLimit);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current!); handleAnswer(-1); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [roundIdx, done]);

  const handleAnswer = (idx: number) => {
    if (chosen !== null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setChosen(idx);
    const correct = idx >= 0 && round.options[idx].correct;
    if (correct) { setScore(s => s + 1); setFeedback('✅ Bonne réponse !'); }
    else if (idx === -1) { setFeedback('⏰ Trop lent ! Le moment est passé...'); }
    else { setFeedback('❌ Mauvaise réponse...'); }

    setTimeout(() => {
      setFeedback(null);
      setChosen(null);
      if (roundIdx + 1 >= ROUNDS.length) {
        setDone(true);
        setTimeout(() => onComplete(score + (correct ? 1 : 0) >= 2), 2000);
      } else {
        setRoundIdx(r => r + 1);
      }
    }, 1500);
  };

  const timerPct = (timeLeft / round.timeLimit) * 100;
  const timerColor = timerPct > 60 ? '#10b981' : timerPct > 30 ? '#f59e0b' : '#ef4444';
  const urgency = timerPct < 30;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6 relative"
      style={{ backgroundImage: "url('/assets/minigame_qte_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="absolute inset-0 bg-black/52 pointer-events-none" />
      {urgency && !done && chosen === null && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 80px rgba(239,68,68,0.35)', animation: 'urgencyPulse 0.8s ease-in-out infinite' }} />
      )}

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6"
          style={{ opacity: roundVisible ? 1 : 0, transform: roundVisible ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
          <h1 className="text-2xl font-black text-white mb-1" style={{ textShadow: '0 0 20px #06b6d4' }}>
            Dialogue Crucial
          </h1>
          <p className="text-cyan-400 text-sm">Réponds avant que le temps ne s'écoule !</p>
          <div className="flex gap-2 justify-center mt-3">
            {ROUNDS.map((_, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i < roundIdx ? '#10b981' : i === roundIdx ? '#06b6d4' : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s ease',
                boxShadow: i === roundIdx ? '0 0 8px #06b6d4' : 'none',
              }} />
            ))}
          </div>
        </div>

        {!done ? (
          <div style={{ opacity: roundVisible ? 1 : 0, transform: roundVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s' }}>
            {/* Timer */}
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: 99,
                transition: 'width 1s linear, background 0.3s',
                boxShadow: urgency ? `0 0 8px ${timerColor}` : 'none',
              }} />
            </div>

            {/* Timer number */}
            <div className="text-center mb-4">
              <span style={{
                fontSize: urgency ? 28 : 20, fontWeight: 900, color: timerColor,
                textShadow: urgency ? `0 0 20px ${timerColor}` : 'none',
                transition: 'all 0.3s ease',
                animation: urgency ? 'countPulse 1s ease infinite' : 'none',
              }}>
                {timeLeft}s
              </span>
            </div>

            {/* Prompt */}
            <div style={{
              background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: 16, padding: '20px 28px', marginBottom: 24, textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <p className="text-white text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {round.prompt}
              </p>
            </div>

            {/* Options grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              {round.options.map((opt, i) => {
                let bg = 'rgba(0,0,0,0.55)';
                let border = '1px solid rgba(255,255,255,0.1)';
                let glow = 'none';
                if (chosen !== null) {
                  if (opt.correct) { bg = 'rgba(16,185,129,0.28)'; border = '1px solid #10b981'; glow = '0 0 16px rgba(16,185,129,0.4)'; }
                  else if (i === chosen) { bg = 'rgba(239,68,68,0.28)'; border = '1px solid #ef4444'; glow = '0 0 16px rgba(239,68,68,0.4)'; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={chosen !== null}
                    style={{
                      background: bg, border, borderRadius: 12, padding: '14px 16px',
                      cursor: chosen !== null ? 'default' : 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease', color: '#f1f5f9', fontSize: 13, lineHeight: 1.4,
                      backdropFilter: 'blur(6px)', boxShadow: glow,
                      opacity: chosen !== null && !opt.correct && i !== chosen ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (chosen === null) { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { if (chosen === null) { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.55)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; } }}>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="mt-5 text-center text-xl font-bold"
                style={{
                  color: feedback.startsWith('✅') ? '#10b981' : '#ef4444',
                  animation: 'feedbackIn 0.3s ease',
                  textShadow: feedback.startsWith('✅') ? '0 0 16px #10b981' : '0 0 16px #ef4444',
                }}>
                {feedback}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" style={{ animation: 'feedbackIn 0.5s ease' }}>
            <div className="text-6xl mb-4">{score >= 3 ? '🎯' : '💬'}</div>
            <p className="text-2xl font-black text-white mb-2">
              {score >= 2 ? "Brillant ! Guillaume hésiterait à t'affronter." : 'Tu as tenu bon malgré tout !'}
            </p>
            <p className="text-purple-300">{score}/3 bonnes réponses</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes urgencyPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes countPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes feedbackIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
