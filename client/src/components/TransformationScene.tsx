import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TransformationSceneProps {
  onComplete: () => void;
  isLadybug?: boolean;
}

const MEDUSA_NORMAL = '/assets/fille_blonde_miraculous.png';
const MEDUSA_TRANSFORMED = '/assets/fille_meduse_heroine.png';
const LOU_LADYBUG = '/assets/fille_blonde_ladybug_costume.png';

function useRemoveBg(src: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        if (d.data[i] > 200 && d.data[i + 1] > 200 && d.data[i + 2] > 200)
          d.data[i + 3] = 0;
      }
      ctx.putImageData(d, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.onerror = () => setDataUrl(src);
    img.src = src;
  }, [src]);
  return dataUrl;
}

// Composant pour les particules orbitales
function OrbitalParticles({ color, count = 8 }: { color: string; count?: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 12px ${color}`,
            }}
            animate={{
              x: Math.cos(angle) * 180,
              y: Math.sin(angle) * 180,
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}

// Composant pour les traînées de lumière
function LightTrails({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    >
      <defs>
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.path
          key={i}
          d={`M ${50 + i * 10} 20 Q ${60 + i * 15} 50 ${50 + i * 10} 80`}
          stroke="url(#trailGradient)"
          strokeWidth="2"
          fill="none"
          animate={{
            opacity: [0, 0.6, 0],
            pathLength: [0, 1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </svg>
  );
}

// Composant pour l'effet de glitch du texte
function GlitchText({ text, color }: { text: string; color: string }) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="text-5xl font-black text-white"
        style={{ textShadow: `0 0 30px ${color}, 0 4px 16px rgba(0,0,0,0.9)` }}
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          opacity: [0, 1, 1, 1, 1, 1],
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.1, 0.2, 0.3, 0.4, 1],
        }}
      >
        {text}
      </motion.div>
      {/* Glitch effect layers */}
      <motion.div
        className="absolute inset-0 text-5xl font-black"
        style={{
          color: color,
          textShadow: `0 0 20px ${color}`,
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
        }}
        animate={{
          x: [0, 4, -2, 0],
          opacity: [0, 0.7, 0.3, 0],
        }}
        transition={{
          duration: 0.4,
          delay: 0.1,
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}

export default function TransformationScene({
  onComplete,
  isLadybug = false,
}: TransformationSceneProps) {
  const [stage, setStage] = useState<
    'start' | 'calling' | 'flash' | 'reveal' | 'complete'
  >('start');
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      isPrimary: boolean;
    }>
  >([]);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const normalSrc = MEDUSA_NORMAL;
  const transformedSrc = isLadybug ? LOU_LADYBUG : MEDUSA_TRANSFORMED;

  const phrase = isLadybug ? 'Tikki, transforme-moi !' : 'Médusa, transforme-moi !';
  const heroName = isLadybug ? 'Ladybug' : 'Médusa';
  const primaryColor = isLadybug ? '#dc2626' : '#7c3aed';
  const secondaryColor = isLadybug ? '#ec4899' : '#06b6d4';
  const accentColor = isLadybug ? '#fbbf24' : '#a855f7';

  // Initialiser les particules et la timeline
  useEffect(() => {
    const pts = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 55 + 15,
      delay: Math.random() * 2.5,
      isPrimary: Math.random() > 0.5,
    }));
    setParticles(pts);

    const t1 = setTimeout(() => setStage('calling'), 800);
    const t2 = setTimeout(() => {
      setStage('flash');
      setShakeIntensity(1);
    }, 2500);
    const t3 = setTimeout(() => {
      setStage('reveal');
      setShakeIntensity(0);
    }, 3200);
    const t4 = setTimeout(() => setStage('complete'), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Animation des particules explosives au moment du flash
  useEffect(() => {
    if (stage !== 'flash' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const explosionParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }> = [];

    // Créer les particules d'explosion
    for (let i = 0; i < 120; i++) {
      const angle = (i / 120) * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      explosionParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color:
          Math.random() > 0.5
            ? primaryColor
            : Math.random() > 0.5
              ? secondaryColor
              : accentColor,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const p = explosionParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravité
        p.life -= 0.02;

        if (p.life <= 0) {
          explosionParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color + Math.round(p.life * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = p.color + '80';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + Math.random() * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (explosionParticles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [stage, primaryColor, secondaryColor, accentColor]);

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}33 0%, #0a0514 50%, ${secondaryColor}33 100%)`,
      }}
      animate={{
        x: shakeIntensity > 0 ? [0, -8, 8, -8, 8, 0] : 0,
        y: shakeIntensity > 0 ? [0, -6, 6, -6, 6, 0] : 0,
      }}
      transition={{
        duration: 0.4,
        repeat: shakeIntensity > 0 ? 1 : 0,
      }}
    >
      {/* Canvas pour les particules d'explosion */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: stage === 'flash' ? 'block' : 'none' }}
      />

      {/* Particules de fond animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.isPrimary ? `${primaryColor}40` : `${secondaryColor}40`,
              boxShadow: `0 0 ${p.size / 2}px ${p.isPrimary ? primaryColor : secondaryColor}`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + p.delay,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Traînées de lumière pendant l'appel */}
      {(stage === 'calling' || stage === 'flash') && (
        <LightTrails color={primaryColor} />
      )}

      {/* Particules flottantes Ladybug */}
      {isLadybug && (stage === 'reveal' || stage === 'complete') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 20 + Math.random() * 20,
                height: 20 + Math.random() * 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: '#111',
                opacity: 0.6,
                boxShadow: `0 0 12px ${primaryColor}`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 1.5 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay flash avec effet de chroma aberration */}
      {stage === 'flash' && (
        <>
          <motion.div
            className="absolute inset-0 z-30"
            style={{
              background: isLadybug
                ? `radial-gradient(circle, #ef4444, #ec4899)`
                : 'white',
            }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          {/* Chroma aberration effect */}
          <motion.div
            className="absolute inset-0 z-29"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}40 0%, transparent 50%, ${secondaryColor}40 100%)`,
            }}
            animate={{
              x: [0, 10, -10, 0],
              opacity: [0.8, 0.4, 0.4, 0],
            }}
            transition={{ duration: 0.7 }}
          />
        </>
      )}

      {/* Anneaux tournants avec particules orbitales */}
      {(stage === 'calling' || stage === 'flash') && (
        <>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="rounded-full"
              style={{
                width: 360,
                height: 360,
                border: `4px solid transparent`,
                borderTopColor: primaryColor,
                borderRightColor: secondaryColor,
                boxShadow: `0 0 30px ${primaryColor}88, inset 0 0 30px ${secondaryColor}44`,
              }}
            />
          </motion.div>

          {isLadybug && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 300,
                  height: 300,
                  border: `2px solid transparent`,
                  borderBottomColor: accentColor,
                  borderLeftColor: primaryColor,
                  boxShadow: `0 0 20px ${accentColor}66`,
                }}
              />
            </motion.div>
          )}

          {/* Particules orbitales */}
          <OrbitalParticles color={primaryColor} count={8} />
        </>
      )}

      {/* Personnage */}
      <div className="relative z-10 flex justify-center items-end" style={{ height: '55vh' }}>
        {stage === 'start' || stage === 'calling' ? (
          normalSrc && (
            <motion.img
              src={normalSrc}
              alt="Lou"
              style={{
                height: '50vh',
                maxHeight: 420,
                width: 'auto',
                objectFit: 'contain',
                filter: `drop-shadow(0 12px 32px rgba(0,0,0,0.9))`,
              }}
              animate={
                stage === 'calling'
                  ? {
                      scale: [1, 1.05, 1],
                      filter: [
                        `drop-shadow(0 12px 32px rgba(0,0,0,0.9)) brightness(1)`,
                        `drop-shadow(0 0 40px ${primaryColor}cc) brightness(1.3)`,
                        `drop-shadow(0 12px 32px rgba(0,0,0,0.9)) brightness(1)`,
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 0.4,
                repeat: stage === 'calling' ? Infinity : 0,
              }}
            />
          )
        ) : stage === 'reveal' || stage === 'complete' ? (
          transformedSrc && (
            <motion.div style={{ position: 'relative' }}>
              <motion.img
                src={transformedSrc}
                alt={heroName}
                style={{
                  height: '50vh',
                  maxHeight: 420,
                  width: 'auto',
                  objectFit: 'contain',
                }}
                animate={{
                  opacity: [0, 1],
                  scale: [0.7, 1],
                  y: [30, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />

              {/* Effet de costume pour Ladybug */}
              {isLadybug && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 40%, ${primaryColor}55, transparent 70%)`,
                    mixBlendMode: 'normal',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: [0.8, 0.4, 0.8] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Aura de transformation */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: -40,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${primaryColor}40, transparent 70%)`,
                  pointerEvents: 'none',
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          )
        ) : null}
      </div>

      {/* Texte et CTA */}
      <div className="relative z-10 text-center mt-6 px-8">
        {stage === 'start' && (
          <motion.p
            className="text-white text-2xl font-bold"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
          >
            ...
          </motion.p>
        )}

        {stage === 'calling' && (
          <motion.p
            className="text-white text-3xl font-bold"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: `0 0 20px ${primaryColor}, 0 2px 12px rgba(0,0,0,0.8)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                `0 0 20px ${primaryColor}, 0 2px 12px rgba(0,0,0,0.8)`,
                `0 0 40px ${primaryColor}, 0 0 60px ${secondaryColor}, 0 2px 12px rgba(0,0,0,0.8)`,
                `0 0 20px ${primaryColor}, 0 2px 12px rgba(0,0,0,0.8)`,
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            « {phrase} »
          </motion.p>
        )}

        {(stage === 'reveal' || stage === 'complete') && (
          <motion.div
            animate={{ opacity: [0, 1], y: [20, 0] }}
            transition={{ duration: 0.5 }}
          >
            <GlitchText text={`${heroName} !`} color={primaryColor} />

            <motion.p
              className="text-lg mb-6 mt-4"
              style={{
                color: secondaryColor,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isLadybug
                ? 'Lou porte les boucles de Ladybug pour sauver Paris !'
                : 'Lou a obtenu le pouvoir de Médusa !'}
            </motion.p>

            {stage === 'complete' && (
              <motion.div
                animate={{ scale: [0.8, 1], opacity: [0, 1] }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  onClick={onComplete}
                  className="font-bold px-10 py-4 text-lg text-white rounded-full hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    border: 'none',
                    boxShadow: `0 0 24px ${primaryColor}88, 0 0 48px ${secondaryColor}44`,
                  }}
                >
                  {isLadybug ? 'Lancer le Charme Miraculeux ✨' : 'Au combat ! ⚡'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes floatPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes spinRing {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes flashOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes glowPulse {
          from {
            filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.9)) brightness(1);
          }
          to {
            filter: drop-shadow(0 0 40px ${primaryColor}cc) drop-shadow(0 12px 32px rgba(0, 0, 0, 0.9)) brightness(1.2);
          }
        }

        @keyframes revealHero {
          from {
            opacity: 0;
            transform: scale(0.7) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes textGlow {
          from {
            text-shadow: 0 0 20px ${primaryColor}, 0 2px 12px rgba(0, 0, 0, 0.8);
          }
          to {
            text-shadow: 0 0 40px ${primaryColor}, 0 0 60px ${secondaryColor}, 0 2px 12px rgba(0, 0, 0, 0.8);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </motion.div>
  );
}
