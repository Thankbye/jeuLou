import { Scene } from '@/lib/gameData';
import { useEffect, useRef, useState } from 'react';

interface DialogueSceneProps {
  scene: Scene;
  onNext: () => void;
  onChoice?: (nextScene: string) => void;
}

const SPEAKER_COLORS: Record<string, string> = {
  Lou: '#c084fc',
  Ladybug: '#f472b6',
  'Médusa': '#818cf8',
  Medusa: '#818cf8',
  'Ombre Spectrale': '#6b7280',
  'Hawk Moth': '#a78bfa',
  Guillaume: '#f97316',
  Ugo: '#34d399',
};

const TYPING_SPEED = 18;

function CharacterImage({
  src, alt, style, entering, isActive,
}: { src: string; alt: string; style: React.CSSProperties; entering: boolean; isActive: boolean; }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        ...style,
        transition: 'filter 0.35s ease',
        filter: isActive
          ? `drop-shadow(0 12px 32px rgba(0,0,0,0.9)) brightness(1.05)`
          : `drop-shadow(0 12px 32px rgba(0,0,0,0.9)) brightness(0.58) saturate(0.5)`,
      }}
    />
  );
}

export default function DialogueScene({ scene, onNext, onChoice }: DialogueSceneProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [charsVisible, setCharsVisible] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [bgFading, setBgFading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBgRef = useRef<string>(scene.background);
  const prevSceneRef = useRef<string>(scene.id);

  // Background crossfade
  useEffect(() => {
    if (prevSceneRef.current !== scene.id && prevBgRef.current !== scene.background) {
      setPrevBg(prevBgRef.current);
      setBgFading(true);
      const t = setTimeout(() => { setBgFading(false); setPrevBg(null); }, 700);
      prevBgRef.current = scene.background;
      prevSceneRef.current = scene.id;
      return () => clearTimeout(t);
    }
    prevBgRef.current = scene.background;
    prevSceneRef.current = scene.id;
  }, [scene.id]);

  // Preload bg
  useEffect(() => {
    setBgLoaded(false);
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true);
    img.src = scene.background;
  }, [scene.background]);

  // Entrance animation
  useEffect(() => {
    setSceneVisible(false);
    setCharsVisible(false);
    setChoicesVisible(false);
    const t1 = setTimeout(() => setSceneVisible(true), 50);
    const t2 = setTimeout(() => setCharsVisible(true), 150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [scene.id]);

  // Typewriter
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!scene.dialogue) { setDisplayedText(''); setIsTyping(false); return; }
    setDisplayedText('');
    setIsTyping(true);
    setChoicesVisible(false);
    let index = 0;
    intervalRef.current = setInterval(() => {
      index++;
      setDisplayedText(scene.dialogue!.substring(0, index));
      if (index >= scene.dialogue!.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsTyping(false);
        if (scene.dialogueOptions?.length) setTimeout(() => setChoicesVisible(true), 180);
      }
    }, TYPING_SPEED);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [scene.id]);

  const handleSceneClick = () => {
    if (hasChoices) return;
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayedText(scene.dialogue || '');
      setIsTyping(false);
      if (scene.dialogueOptions?.length) setTimeout(() => setChoicesVisible(true), 180);
    } else {
      onNext();
    }
  };

  const speakerColor = scene.speaker ? (SPEAKER_COLORS[scene.speaker] || '#e2e8f0') : '#e2e8f0';
  const hasChoices = !isTyping && scene.dialogueOptions && scene.dialogueOptions.length > 0;
  const leftChars = scene.characters.filter(c => c.position === 'left' || c.position === 'center');
  const rightChars = scene.characters.filter(c => c.position === 'right');
  const isActiveSpeaker = (name: string) => !scene.speaker || scene.speaker === name;

  return (
    <div
      className="relative w-full h-screen flex flex-col justify-between items-center overflow-hidden"
      onClick={handleSceneClick}
      style={{ cursor: hasChoices ? 'default' : 'pointer' }}
    >
      {/* Prev BG crossfade */}
      {prevBg && (
        <div className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${prevBg})`, opacity: bgFading ? 1 : 0, transition: 'opacity 0.7s ease' }} />
      )}

      {/* Current BG */}
      <div className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${scene.background})`,
          opacity: bgLoaded ? 1 : 0,
          transform: sceneVisible ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 0.5s ease, transform 0.8s ease-out',
        }} />

      {/* Vignette overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Title */}
      <div className="relative z-10 pt-5 text-center px-4"
        style={{
          opacity: sceneVisible ? 1 : 0,
          transform: sceneVisible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}>
        <h1 className="text-xl font-bold text-white tracking-widest uppercase"
          style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95)', letterSpacing: 3 }}>
          {scene.title}
        </h1>
      </div>

      {/* Characters */}
      <div className="relative z-10 flex-1 flex items-end w-full px-4 pb-0 pointer-events-none">
        <div className="flex-1 flex justify-start items-end">
          {leftChars.map((char) => (
            <div key={char.id} style={{
              position: 'relative',
              opacity: charsVisible ? 1 : 0,
              transform: charsVisible ? 'translateX(0) scale(1)' : 'translateX(-24px) scale(0.96)',
              transition: 'opacity 0.5s ease 0.12s, transform 0.5s ease 0.12s',
            }}>
              <CharacterImage src={char.image} alt={char.name} entering={!charsVisible} isActive={isActiveSpeaker(char.name)}
                style={{ height: '68vh', maxHeight: 560, width: 'auto', objectFit: 'contain', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.72)', borderRadius: 99, padding: '2px 10px',
                fontSize: 11, fontWeight: 700, color: SPEAKER_COLORS[char.name] || '#e2e8f0',
                whiteSpace: 'nowrap', border: `1px solid ${SPEAKER_COLORS[char.name] || '#ffffff33'}55`,
                backdropFilter: 'blur(4px)',
              }}>{char.name}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex justify-end items-end">
          {rightChars.map((char) => (
            <div key={char.id} style={{
              position: 'relative',
              opacity: charsVisible ? 1 : 0,
              transform: charsVisible ? 'translateX(0) scale(1)' : 'translateX(24px) scale(0.96)',
              transition: 'opacity 0.5s ease 0.18s, transform 0.5s ease 0.18s',
            }}>
              <CharacterImage src={char.image} alt={char.name} entering={!charsVisible} isActive={isActiveSpeaker(char.name)}
                style={{ height: '68vh', maxHeight: 560, width: 'auto', objectFit: 'contain', transform: 'scaleX(-1)', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%) scaleX(-1)',
                background: 'rgba(0,0,0,0.72)', borderRadius: 99, padding: '2px 10px',
                fontSize: 11, fontWeight: 700, color: SPEAKER_COLORS[char.name] || '#e2e8f0',
                whiteSpace: 'nowrap', border: `1px solid ${SPEAKER_COLORS[char.name] || '#ffffff33'}55`,
                backdropFilter: 'blur(4px)',
              }}>{char.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="relative z-10 w-full"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(10,5,20,0.93) 100%)',
          borderTop: `2px solid ${speakerColor}55`,
          backdropFilter: 'blur(12px)',
          opacity: sceneVisible ? 1 : 0,
          transform: sceneVisible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s, border-top-color 0.35s ease',
        }}>
        <div className="max-w-4xl mx-auto px-6 pt-4 pb-5">

          {/* Speaker */}
          {scene.speaker && (
            <div className="mb-2 flex items-center gap-2">
              <div style={{
                width: 3, height: 18, borderRadius: 99, background: speakerColor,
                boxShadow: `0 0 8px ${speakerColor}88`, transition: 'background 0.3s ease',
              }} />
              <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded"
                style={{
                  color: speakerColor, background: `${speakerColor}12`,
                  border: `1px solid ${speakerColor}44`, transition: 'all 0.3s ease',
                }}>
                {scene.speaker}
              </span>
              {isTyping && (
                <span className="text-xs" style={{ color: `${speakerColor}77`, letterSpacing: 1, animation: 'fadePulse 1.2s ease infinite' }}>
                  ◆ cliquer pour passer
                </span>
              )}
            </div>
          )}

          {/* Text */}
          <div style={{ minHeight: 72 }}>
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontFamily: 'Georgia, serif' }}>
              {displayedText}
              {isTyping && (
                <span style={{
                  display: 'inline-block', width: 2, height: '1em',
                  background: speakerColor, marginLeft: 2, verticalAlign: 'text-bottom',
                  animation: 'cursorBlink 0.65s step-end infinite', borderRadius: 1,
                }} />
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-3">
            {hasChoices ? (
              <div className="flex flex-col gap-2">
                {scene.dialogueOptions!.map((option, i) => (
                  <button key={i}
                    onClick={e => { e.stopPropagation(); onChoice?.(option.nextScene); }}
                    className="text-left w-full px-4 py-3 rounded-lg text-white text-sm font-medium"
                    style={{
                      background: 'rgba(167,139,250,0.07)',
                      border: '1px solid rgba(167,139,250,0.28)',
                      backdropFilter: 'blur(4px)',
                      opacity: choicesVisible ? 1 : 0,
                      transform: choicesVisible ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `opacity 0.3s ease ${i * 0.09}s, transform 0.3s ease ${i * 0.09}s, background 0.15s, border-color 0.15s`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(167,139,250,0.2)';
                      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.55)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(167,139,250,0.07)';
                      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.28)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ opacity: 0.45, marginRight: 8 }}>▸</span>
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
                  {isTyping ? '[ cliquer pour compléter ]' : '[ cliquer pour continuer ]'}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); handleSceneClick(); }}
                  className="font-bold px-6 py-2 rounded-full text-white text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                    border: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.4)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.4)'; }}
                >
                  {isTyping ? 'Passer ▶' : 'Suivant ▶'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadePulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
