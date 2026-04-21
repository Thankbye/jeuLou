import { Link } from "wouter";
import { useEffect, useState } from "react";

const PATHS = [
  { icon: '🗣️', label: 'La Force des Mots', desc: 'Refuse les pouvoirs et affronte Guillaume avec tes seuls mots.' },
  { icon: '🐞', label: 'Lou Ladybug', desc: 'Reçois le Miraculous Coccinelle et vis la transformation ultime.' },
  { icon: '🌑', label: "L'Ombre de Médusa", desc: 'Rejoins Hawk Moth... ou résiste à la tentation.' },
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: "url('/assets/game_start_page_final_v6.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { x: 20, y: 15, size: 350, color: 'rgba(124,58,237,0.18)' },
          { x: 75, y: 60, size: 280, color: 'rgba(6,182,212,0.12)' },
          { x: 50, y: 85, size: 220, color: 'rgba(236,72,153,0.12)' },
        ].map((o, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              left: `${o.x}%`, top: `${o.y}%`,
              width: o.size, height: o.size,
              background: o.color, filter: 'blur(70px)',
              transform: 'translate(-50%,-50%)',
              animation: `ambientFloat ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }} />
        ))}
      </div>

      <div
        className="relative z-10 text-center px-6 max-w-3xl w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Badge */}
        <div
          className="inline-block mb-6 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#ddd6fe',
            backdropFilter: 'blur(8px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          ✦ Jeu narratif interactif ✦
        </div>

        {/* Title */}
        <h1
          className="text-7xl font-black text-white mb-2"
          style={{
            textShadow: '0 0 60px rgba(124,58,237,0.7), 0 4px 20px rgba(0,0,0,0.8)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}
        >
          Miraculous
        </h1>
        <h2
          className="text-5xl font-black mb-6"
          style={{
            background: 'linear-gradient(135deg, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          }}
        >
          Lou
        </h2>

        <p
          className="text-base mb-10 max-w-xl mx-auto"
          style={{
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.88)',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            fontFamily: 'Georgia, serif',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
          }}
        >
          Lou, lycéenne passionnée de code, se retrouve au cœur d'une attaque d'Akuma.
          Ses choix détermineront le destin de Paris — et le sien.
        </p>

        {/* CTA */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
            transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
          }}
        >
          <Link href="/game">
            <button
              className="font-black px-14 py-5 text-xl rounded-full text-white mb-12"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #f174f5)',
                border: 'none',
                boxShadow: '0 0 40px rgba(124,58,237,0.55), 0 8px 32px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(124,58,237,0.75), 0 12px 40px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.55), 0 8px 32px rgba(0,0,0,0.4)';
              }}
            >
              Commencer l'aventure ▶
            </button>
          </Link>
        </div>

        {/* Paths */}
        <div
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s',
          }}
        >
        </div>
      </div>

      <style>{`
        @keyframes ambientFloat {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50% { transform: translate(-50%,-50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
