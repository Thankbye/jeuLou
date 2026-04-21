import { BattleState } from '@/lib/gameData';
import { useEffect, useRef, useState } from 'react';

interface BattleScreenProps {
  onBattleEnd: (winner: 'player' | 'enemy') => void;
}

const ATTACKS = [
  { id: 'tentacule_fouet', name: 'Tentacule Fouet', description: 'Frappe physique rapide', damage: 15, type: 'physical', color: '#ef4444', icon: '🌊', maxUses: 5, effect: null, effectChance: 0, healing: 0 },
  { id: 'regard_petrifiant', name: 'Regard Pétrifiant', description: "Paralyse l'ennemi 1 tour", damage: 12, type: 'special', color: '#a855f7', icon: '👁️', maxUses: 3, effect: 'stun', effectChance: 0.65, healing: 0 },
  { id: 'barriere_lumineuse', name: 'Barrière Lumineuse', description: 'Soin + bouclier ce tour', damage: 0, type: 'defense', color: '#3b82f6', icon: '🛡️', maxUses: 3, effect: 'shield', effectChance: 1, healing: 18 },
  { id: 'fuite_aquatique', name: 'Fuite Aquatique', description: 'Frappe + esquive garantie', damage: 10, type: 'utility', color: '#10b981', icon: '💨', maxUses: 3, effect: 'dodge', effectChance: 1, healing: 0 },
  { id: 'colere_medusa', name: 'Colère de Médusa', description: 'Pouvoir ultime dévastateur', damage: 45, type: 'ultimate', color: '#f59e0b', icon: '⚡', maxUses: 1, effect: null, effectChance: 0, healing: 0 },
];

const ENEMY_ATTACKS = [
  { name: 'Griffes Spectrales', damage: [10, 16] as [number,number], isCharge: false, isDrain: false },
  { name: "Vague d'Ombre", damage: [14, 22] as [number,number], isCharge: false, isDrain: false },
  { name: 'Rugissement Obscur', damage: [0, 0] as [number,number], isCharge: true, isDrain: false },
  { name: 'Frappe Chargée', damage: [28, 36] as [number,number], isCharge: false, isDrain: false },
  { name: 'Drain Vital', damage: [8, 14] as [number,number], isCharge: false, isDrain: true },
];

type StatusEffect = 'stun' | 'shield' | 'dodge' | null;
type FloatMsg = { id: string; text: string; x: number; y: number; color: string; size?: number };

function HPBar({ name, icon, hp, maxHP, pct, color, status, shake, phase, isCharging }:
  { name: string; icon: string; hp: number; maxHP: number; pct: number; color: 'purple'|'red'; status: StatusEffect; shake: boolean; phase: number|null; isCharging: boolean }) {

  const barBg = color === 'purple'
    ? pct > 50 ? 'linear-gradient(90deg,#7c3aed,#c084fc)' : pct > 25 ? 'linear-gradient(90deg,#d97706,#fbbf24)' : 'linear-gradient(90deg,#dc2626,#f87171)'
    : pct > 50 ? 'linear-gradient(90deg,#dc2626,#f87171)' : pct > 25 ? 'linear-gradient(90deg,#b45309,#fbbf24)' : 'linear-gradient(90deg,#7f1d1d,#ef4444)';

  const borderCol = color === 'purple' ? 'rgba(192,132,252,0.4)' : phase === 2 ? 'rgba(239,68,68,0.7)' : 'rgba(239,68,68,0.4)';
  const glowCol   = color === 'purple' ? 'rgba(124,58,237,0.25)' : phase === 2 ? 'rgba(239,68,68,0.4)' : 'rgba(220,38,38,0.2)';

  return (
    <div style={{ background:'rgba(5,2,14,0.85)', border:`1px solid ${borderCol}`, borderRadius:14, padding:'10px 14px', minWidth:190, boxShadow:`0 4px 24px ${glowCol}`, animation: shake ? (color==='purple'?'shakeL 0.5s ease':'shakeR 0.5s ease') : (phase===2?'flicker 2s infinite':'none') }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <span style={{ fontWeight:700, color:'#f1f5f9', fontSize:12, flex:1 }}>{name}</span>
        {phase===2 && <span style={{ fontSize:9, fontWeight:700, color:'#ef4444', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:99, padding:'1px 6px' }}>RAGE</span>}
        {isCharging && <span style={{ fontSize:9, fontWeight:700, color:'#fbbf24', background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.4)', borderRadius:99, padding:'1px 6px', animation:'flicker 0.5s infinite' }}>⚡CHARGE</span>}
        <span style={{ fontSize:11, fontFamily:'monospace', color: color==='purple'?'#c084fc':'#f87171' }}>{hp}<span style={{ opacity:0.4 }}>/{maxHP}</span></span>
      </div>
      <div style={{ height:7, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden', marginBottom: status ? 6 : 0 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:barBg, borderRadius:99, transition:'width 0.4s ease' }} />
      </div>
      {status && (
        <div style={{ marginTop:4 }}>
          <span style={{ fontSize:9, fontWeight:700, borderRadius:99, padding:'1px 7px',
            background: status==='stun'?'rgba(251,191,36,0.15)':status==='shield'?'rgba(59,130,246,0.15)':'rgba(16,185,129,0.15)',
            border:`1px solid ${status==='stun'?'rgba(251,191,36,0.5)':status==='shield'?'rgba(59,130,246,0.5)':'rgba(16,185,129,0.5)'}`,
            color: status==='stun'?'#fbbf24':status==='shield'?'#60a5fa':'#34d399',
          }}>
            {status==='stun'?'⚡ Paralysé':status==='shield'?'🛡️ Bouclier':'💨 Esquive'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function BattleScreen({ onBattleEnd }: BattleScreenProps) {
  const [louHP, setLouHP]           = useState(100);
  const [guillaumeHP, setGuilHP]    = useState(100);
  const louMaxHP = 100; const guilMaxHP = 100;

  const [uses, setUses] = useState<Record<string,number>>(Object.fromEntries(ATTACKS.map(a=>[a.id,a.maxUses])));
  const [playerStatus, setPlayerStatus] = useState<StatusEffect>(null);
  const [enemyStatus,  setEnemyStatus]  = useState<StatusEffect>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [enemyPhase, setEnemyPhase] = useState(1);

  const [currentTurn, setCurrentTurn] = useState<'player'|'enemy'>('player');
  const [gameOver, setGameOver]     = useState(false);
  const [winner, setWinner]         = useState<'player'|'enemy'|null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedId, setSelectedId] = useState<string|null>(null);

  const [log, setLog]     = useState<string[]>(["⚔️ Le combat commence ! Médusa affronte l'Ombre Spectrale !"]);
  const [floats, setFloats] = useState<FloatMsg[]>([]);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake]   = useState(false);
  const [flashColor, setFlashColor]   = useState<string|null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  // Enemy rage phase
  useEffect(() => {
    if (guillaumeHP / guilMaxHP < 0.5 && enemyPhase === 1) {
      setEnemyPhase(2);
      addLog("💢 L'Ombre Spectrale entre en RAGE !");
      spawn({ text:'ENRAGÉ !', x:55, y:28, color:'#ef4444', size:22 });
    }
  }, [guillaumeHP]);

  const addLog = (msg: string) => setLog(p => [...p.slice(-9), msg]);

  const spawn = ({ text, x, y, color, size }: Omit<FloatMsg,'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloats(p => [...p, { id, text, x, y, color, size }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 1600);
  };

  const doShake = (t: 'player'|'enemy') => {
    if (t==='player') { setPlayerShake(true); setTimeout(()=>setPlayerShake(false),500); }
    else              { setEnemyShake(true);  setTimeout(()=>setEnemyShake(false),500); }
  };

  const doFlash = (col: string, ms=350) => { setFlashColor(col); setTimeout(()=>setFlashColor(null),ms); };

  const endGame = (w: 'player'|'enemy') => {
    setGameOver(true); setWinner(w);
    setTimeout(() => onBattleEnd(w), 2500);
  };

  // ── Player action ──────────────────────────────────────────────────────────
  const handleAttack = (attackId: string) => {
    if (currentTurn!=='player' || gameOver || isAnimating || uses[attackId]<=0) return;
    const atk = ATTACKS.find(a=>a.id===attackId)!;
    setSelectedId(attackId);
    setIsAnimating(true);
    setUses(p=>({...p,[attackId]:p[attackId]-1}));
    doFlash(atk.color+'99', 400);

    setTimeout(() => {
      let dmg = atk.damage;

      if (dmg > 0) {
        if (enemyStatus==='stun') { dmg=Math.floor(dmg*1.5); addLog('💥 Ennemi paralysé — dégâts ×1.5 !'); setEnemyStatus(null); }
        if (atk.type==='ultimate') doFlash('#f59e0b88', 600);
        doShake('enemy');
        setGuilHP(p => { 
          const n=Math.max(0,p-dmg); 
          if(n<=0 && !gameOver) endGame('player'); 
          return n; 
        });
        spawn({ text:`-${dmg}`, x:60+Math.random()*10, y:28+Math.random()*10, color:atk.color });
        addLog(`Médusa → ${atk.name} : ${dmg} dégâts !`);
      }
      if (atk.healing) {
        setLouHP(p=>Math.min(louMaxHP,p+atk.healing));
        spawn({ text:`+${atk.healing} ♥`, x:10+Math.random()*8, y:35, color:'#34d399' });
        addLog(`Soin de ${atk.healing} PV !`);
      }
      if (atk.effect && Math.random()<atk.effectChance) {
        if (atk.effect==='stun')   { setEnemyStatus('stun');  addLog("👁️ L'Ombre Spectrale est paralysée !"); }
        if (atk.effect==='shield') { setPlayerStatus('shield'); addLog('🛡️ Bouclier activé !'); }
        if (atk.effect==='dodge')  { setPlayerStatus('dodge');  addLog('💨 Esquive prête !'); }
      }

      setTimeout(() => {
        if (!gameOver) runEnemyTurn();
      }, 900);
    }, 400);
  };

  // ── Enemy AI ───────────────────────────────────────────────────────────────
  const runEnemyTurn = () => {
    setCurrentTurn('enemy');
    setTimeout(() => {
      // ✅ Vérification si le jeu est déjà terminé
      if (gameOver) { 
        setIsAnimating(false); 
        setCurrentTurn('player');
        setSelectedId(null);
        return; 
      }

      if (enemyStatus==='stun') {
        addLog("⏸️ L'Ombre Spectrale perd son tour !");
        setEnemyStatus(null);
        setCurrentTurn('player'); setSelectedId(null); setIsAnimating(false);
        return;
      }

      const hpRatio = guillaumeHP / guilMaxHP;
      let chosen;
      const roll = Math.random();

      if (isCharging) {
        chosen = ENEMY_ATTACKS[3]; setIsCharging(false);
      } else if (hpRatio < 0.4 && roll < 0.25) {
        chosen = ENEMY_ATTACKS[2]; setIsCharging(true);
      } else if (hpRatio < 0.5 && roll < 0.35) {
        chosen = ENEMY_ATTACKS[4];
      } else if (roll < 0.45) {
        chosen = ENEMY_ATTACKS[0];
      } else {
        chosen = ENEMY_ATTACKS[1];
      }

      if (chosen.isCharge) {
        addLog("💀 L'Ombre Spectrale se concentre… une frappe dévastatrice arrive !");
        spawn({ text:'CHARGEMENT…', x:50, y:22, color:'#f87171' });
        setCurrentTurn('player'); setSelectedId(null); setIsAnimating(false);
        return;
      }

      const boost = enemyPhase===2 ? 1.4 : 1;
      let dmg = Math.floor((Math.random()*(chosen.damage[1]-chosen.damage[0]+1)+chosen.damage[0])*boost);

      if (playerStatus==='dodge') {
        addLog('💨 Médusa esquive complètement !');
        spawn({ text:'ESQUIVE!', x:8, y:30, color:'#34d399' });
        setPlayerStatus(null); dmg=0;
      } else if (playerStatus==='shield') {
        const blk = Math.floor(dmg*0.6);
        dmg -= blk;
        addLog(`🛡️ Bouclier absorbe ${blk} dégâts !`);
        setPlayerStatus(null);
      }

      if (dmg > 0) {
        doFlash('#ef444455', 300);
        doShake('player');
        setLouHP(p => { 
          const n=Math.max(0,p-dmg); 
          if(n<=0 && !gameOver) endGame('enemy'); 
          return n; 
        });
        spawn({ text:`-${dmg}`, x:10+Math.random()*8, y:30, color:'#f87171' });

        if (chosen.isDrain) {
          const heal = Math.floor(dmg*0.5);
          setGuilHP(p=>Math.min(guilMaxHP,p+heal));
          spawn({ text:`+${heal}`, x:62, y:48, color:'#a78bfa' });
          addLog(`💀 ${chosen.name} : ${dmg} dégâts + absorbe ${heal} PV !`);
        } else {
          addLog(`💀 ${chosen.name} : ${dmg} dégâts${enemyPhase===2?' ⚡':''}!`);
        }
      }

      setCurrentTurn('player'); setSelectedId(null); setIsAnimating(false);
    }, 900);
  };

  const isPlayerTurn = currentTurn==='player' && !gameOver;
  const louPct  = (louHP/louMaxHP)*100;
  const guilPct = (guillaumeHP/guilMaxHP)*100;

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden"
      style={{ backgroundImage:'url(/assets/scene_combat_miraculous_style_final.png)', backgroundSize:'cover', backgroundPosition:'center' }}>

      {/* Screen flash */}
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none" style={{ background:flashColor }} />}

      {/* Floating numbers */}
      {floats.map(f=>(
        <div key={f.id} className="absolute z-40 pointer-events-none font-black"
          style={{ left:`${f.x}%`, top:`${f.y}%`, color:f.color, fontSize:f.size??28, textShadow:'0 2px 8px rgba(0,0,0,0.95)', animation:'floatUp 1.6s ease-out forwards' }}>
          {f.text}
        </div>
      ))}

      {/* HP Bars */}
      <div className="relative z-10 p-4 flex justify-between items-start gap-4">
        <HPBar name="Médusa" icon="🦸‍♀️" hp={louHP} maxHP={louMaxHP} pct={louPct} color="purple" status={playerStatus} shake={playerShake} phase={null} isCharging={false} />
        <div className="flex flex-col items-center gap-1 self-center">
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:10, fontWeight:700, letterSpacing:3 }}>VS</div>
          <div style={{ width:6, height:6, borderRadius:'50%', background:isPlayerTurn?'#a78bfa':'#f87171', boxShadow:isPlayerTurn?'0 0 10px #7c3aed':'0 0 10px #dc2626', animation:'pulse 1s infinite' }} />
        </div>
        <HPBar name="Ombre Spectrale" icon={enemyPhase===2?'💀':'👁️'} hp={guillaumeHP} maxHP={guilMaxHP} pct={guilPct} color="red" status={enemyStatus} shake={enemyShake} phase={enemyPhase} isCharging={isCharging} />
      </div>

      <div className="flex-1" />

      {/* Battle log */}
      <div ref={logRef} className="relative z-10 overflow-y-auto"
        style={{ maxHeight:68, background:'linear-gradient(to top,rgba(3,1,10,0.98),rgba(3,1,10,0.72))', borderTop:'1px solid rgba(124,58,237,0.25)', padding:'8px 20px' }}>
        {log.map((l,i)=>(
          <p key={i} className="text-xs font-mono" style={{ color:i===log.length-1?'#e2e8f0':'rgba(148,163,184,0.4)', lineHeight:1.7 }}>
            <span style={{ color:'#6d28d9', marginRight:5 }}>›</span>{l}
          </p>
        ))}
      </div>

      {/* Action panel */}
      <div className="relative z-10" style={{ background:'linear-gradient(to top,rgba(3,1,10,1),rgba(8,3,22,0.97))', borderTop:'1px solid rgba(124,58,237,0.18)', padding:'12px 16px 16px' }}>

        {/* Turn indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width:6, height:6, borderRadius:'50%', background:isPlayerTurn?'#a78bfa':'#f87171', animation:'pulse 1s infinite' }} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:isPlayerTurn?'#c084fc':'#f87171', textTransform:'uppercase' }}>
            {isPlayerTurn ? '▶ Ton tour — choisis une attaque' : "⏳ L'ennemi agit…"}
          </span>
          {isCharging && (
            <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:'#fbbf24', background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.4)', borderRadius:99, padding:'1px 8px', animation:'flicker 0.6s infinite' }}>
              ⚡ Frappe chargée imminente !
            </span>
          )}
        </div>

        {/* Attack cards */}
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${ATTACKS.length},1fr)`, gap:8 }}>
          {ATTACKS.map(atk => {
            const rem = uses[atk.id];
            const empty = rem <= 0;
            const isSel = selectedId===atk.id;
            const dis = !isPlayerTurn || empty || isAnimating;

            return (
              <button key={atk.id} onClick={()=>handleAttack(atk.id)} disabled={dis}
                style={{
                  position:'relative', overflow:'hidden', outline:'none', textAlign:'center',
                  background: isSel ? `linear-gradient(160deg,${atk.color}44,${atk.color}18)` : empty ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                  border: isSel ? `1.5px solid ${atk.color}` : empty ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${atk.color}44`,
                  borderRadius:12, padding:'12px 8px 10px',
                  cursor: dis ? 'not-allowed' : 'pointer',
                  opacity: empty ? 0.28 : dis && !empty ? 0.5 : 1,
                  transition:'all 0.15s ease',
                }}
                onMouseEnter={e=>{ if(!dis){ const el=e.currentTarget as HTMLElement; el.style.background=`linear-gradient(160deg,${atk.color}30,${atk.color}10)`; el.style.transform='translateY(-3px)'; el.style.boxShadow=`0 8px 22px ${atk.color}44`; }}}
                onMouseLeave={e=>{ if(!dis){ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.05)'; el.style.transform='translateY(0)'; el.style.boxShadow='none'; }}}
              >
                {/* Top line */}
                <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:2, borderRadius:99, background: empty ? 'rgba(255,255,255,0.05)' : atk.color, opacity: isSel?1:0.55 }} />
                {/* Radial glow */}
                {!empty && <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 0%,${atk.color}18 0%,transparent 65%)`, pointerEvents:'none' }} />}

                <div style={{ fontSize:20, marginBottom:5, filter:empty?'grayscale(1) opacity(0.4)':'none' }}>{atk.icon}</div>
                <div style={{ fontSize:10, fontWeight:700, color:empty?'rgba(148,163,184,0.35)':'#f1f5f9', letterSpacing:0.3, marginBottom:3, lineHeight:1.3 }}>{atk.name}</div>
                <div style={{ fontSize:9, color:'rgba(148,163,184,0.5)', marginBottom:7, lineHeight:1.4 }}>{atk.description}</div>

                {/* Stats pills */}
                <div style={{ display:'flex', gap:3, justifyContent:'center', flexWrap:'wrap', marginBottom:7 }}>
                  {atk.damage>0 && <span style={{ background:`${atk.color}22`, border:`1px solid ${atk.color}55`, color:atk.color, borderRadius:99, fontSize:9, fontWeight:700, padding:'1px 6px' }}>⚔ {atk.damage}</span>}
                  {atk.healing>0 && <span style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.4)', color:'#34d399', borderRadius:99, fontSize:9, fontWeight:700, padding:'1px 6px' }}>♥ {atk.healing}</span>}
                  {atk.effect && <span style={{ background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.3)', color:'#c084fc', borderRadius:99, fontSize:9, fontWeight:700, padding:'1px 6px' }}>
                    {atk.effect==='stun'?'⚡stun':atk.effect==='shield'?'🛡️':atk.effect==='dodge'?'💨':''}
                  </span>}
                </div>

                {/* Uses dots */}
                <div style={{ display:'flex', gap:3, justifyContent:'center' }}>
                  {Array.from({length:atk.maxUses}).map((_,i)=>(
                    <div key={i} style={{ width:atk.maxUses===1?18:8, height:4, borderRadius:99, background:i<rem?atk.color:'rgba(255,255,255,0.1)', transition:'background 0.3s', boxShadow:i<rem?`0 0 5px ${atk.color}88`:'none' }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Game over */}
        {gameOver && (
          <div className="mt-4 text-center" style={{ animation:'fadeInUp 0.5s ease-out' }}>
            <p style={{ fontSize:28, fontWeight:900, color:winner==='player'?'#fbbf24':'#f87171', textShadow:winner==='player'?'0 0 30px #d97706':'0 0 30px #dc2626' }}>
              {winner==='player'?'✦ VICTOIRE ✦':'✦ DÉFAITE ✦'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp { 0%{opacity:1;transform:translateY(0) scale(1)} 25%{opacity:1;transform:translateY(-18px) scale(1.15)} 100%{opacity:0;transform:translateY(-55px) scale(0.8)} }
        @keyframes shakeL  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(2px)} }
        @keyframes shakeR  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(9px)}  40%{transform:translateX(-7px)} 60%{transform:translateX(4px)} 80%{transform:translateX(-2px)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeInUp{ from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}