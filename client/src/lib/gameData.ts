export interface Character {
  id: string;
  name: string;
  image: string;
  position?: 'left' | 'right' | 'center';
}

export interface DialogueOption {
  text: string;
  nextScene: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  background: string;
  characters: Character[];
  dialogue?: string;
  speaker?: string;
  dialogueOptions?: DialogueOption[];
  nextScene?: string;
  failScene?: string;
  type?: 'dialogue' | 'battle' | 'transformation' | 'transformation_ladybug' | 'ending' | 'minigame_memory' | 'minigame_qte' | 'minigame_debug';
}

export interface BattleState {
  louHP: number;
  louMaxHP: number;
  guillaumeHP: number;
  guillaumeMaxHP: number;
  currentTurn: 'player' | 'enemy';
  battleLog: string[];
  gameOver: boolean;
  winner?: 'player' | 'enemy';
}

const BG_LYCEE_COULOIR  = '/assets/01_couloir_lycee_rouge_bleu.png';
const BG_LYCEE_GRAND    = '/assets/02_grand_couloir_casiers_jaunes_bleus.png';
const BG_PARIS_EIFFEL   = '/assets/paris_eiffel_tower.png';
const BG_ARC_TRIOMPHE   = '/assets/paris_arc_de_triomphe.png';
const BG_RUE_PARISIENNE = '/assets/07_rue_parisienne_pavee.png';
const BG_EXPLOSION      = '/assets/paris_explosion.png';
const BG_TERRAIN_VAGUE  = '/assets/paris_in_ruins.png';
const BG_TRANSFORMATION = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663573674135/4jpuqEYjVFzkG8vVxEprJF/transformation-bg-QdyxuQuofnERupwd8tCqN8.webp';
const BG_BATTLE         = '/assets/scene_combat_miraculous_style_final.png';
const BG_MIRACULOUS     = '/assets/paris_notre_dame.png';
const BG_MEMORY         = '/assets/minigame_memory_bg_corrigé.png';
const BG_HACK_PAPILLON  = '/assets/minigame_debug_bg.png';
const BG_QTE_GUILLAUME  = '/assets/minigame_qte_bg.png';

const IMG_LOU           = '/assets/fille_blonde_miraculous.png';
const IMG_LOU_MEDUSA    = '/assets/fille_meduse_heroine.png';
const IMG_LOU_MEDUSA_BCK= '/assets/medusa_malefique_transparent.png';
const IMG_LOU_LADYBUG   = '/assets/fille_blonde_ladybug_costume.png';
const IMG_LADYBUG       = '/assets/ladybug_miraculous.png';
const IMG_UGO           = '/assets/garcon_blond_cheveux_courts_miraculous.png';
const IMG_GUILLAUME     = '/assets/garcon_chatain_vicieux.png';
const IMG_SHADOW        = '/assets/spectre_noir_gobelin.png';
const IMG_KWAMI_MEDUSE  = '/assets/meduse_kwami.png';
const IMG_KWAMI_TIKKI   = '/assets/tikki_kwami.png';

const LOU    = { id: 'lou',    name: 'Lou',    image: IMG_LOU,    position: 'left'  } as Character;
const MEDUSA = { id: 'med',    name: 'Medusa', image: IMG_LOU_MEDUSA, position: 'left' } as Character;
const UGO    = { id: 'ugo',    name: 'Ugo',    image: IMG_UGO,    position: 'right' } as Character;
const GUILL  = { id: 'guill',  name: 'Guillaume', image: IMG_GUILLAUME, position: 'right' } as Character;
const SHADOW = { id: 'shadow', name: 'Ombre Spectrale', image: IMG_SHADOW, position: 'right' } as Character;
const LADY   = { id: 'lady',   name: 'Ladybug', image: IMG_LADYBUG, position: 'right' } as Character;
const KWAMI_M= { id: 'km',     name: 'Medusa', image: IMG_KWAMI_MEDUSE, position: 'right' } as Character;
const KWAMI_T= { id: 'kt',     name: 'Tikki',  image: IMG_KWAMI_TIKKI,  position: 'right' } as Character;
const LOU_LB = { id: 'loulb',  name: 'Ladybug', image: IMG_LOU_LADYBUG, position: 'left' } as Character;
const MED_BCK= { id: 'medbck', name: 'Medusa', image: IMG_LOU_MEDUSA_BCK, position: 'right' } as Character;

export const characters: Record<string, Character> = {
  lou: LOU, louMedusa: MEDUSA, louMedusaBack: MED_BCK, louLadybug: LOU_LB,
  ladybug: LADY, ugo: UGO, guillaume: GUILL, shadowSpecter: SHADOW,
  kwami_meduse: KWAMI_M, kwami_tikki: KWAMI_T,
};

export const scenes: Record<string, Scene> = {

  // ══════════════════════════════════════════════════
  // ACTE 1 — Paris ordinaire
  // ══════════════════════════════════════════════════

  intro: {
    id: 'intro', title: 'Paris, un mardi comme les autres', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU],
    dialogue: "Encore un mardi ordinaire a Paris... Le lycee, les devoirs, le code. Franchement, ma vie est plutot tranquille — un peu trop, parfois. Bon, OK, je suis brillante, mais ce n'est pas de ma faute si les autres mettent du temps a suivre.",
    speaker: 'Lou', nextScene: 'school_day',
  },

  school_day: {
    id: 'school_day', title: 'Au lycee', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, GUILL],
    dialogue: "En cours de maths, le prof a rendu les copies. Guillaume a eu un 18. Moi, un 9. Et bien sur, il n'a pas pu s'empecher de soupirer bruyamment. Tellement previsible. Il fait ca tout le temps, comme si c'etait une surprise que je sois meilleure en code qu'en equations.",
    speaker: 'Lou', nextScene: 'meet_ugo',
  },

  meet_ugo: {
    id: 'meet_ugo', title: 'Une rencontre dans le couloir', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, UGO],
    dialogue: "Dans le couloir, j'ai bouscule quelqu'un en tournant le coin. Des cahiers partout. Un garcon blond me regardait avec un grand sourire.",
    speaker: 'Lou', nextScene: 'meet_ugo_2',
  },

  meet_ugo_2: {
    id: 'meet_ugo_2', title: 'Une rencontre', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, UGO],
    dialogue: "C'est rien, t'inquiete ! Je m'appelle Ugo. Tu fais quoi comme projets perso toi ?",
    speaker: 'Ugo', nextScene: 'meet_ugo_3',
  },

  meet_ugo_3: {
    id: 'meet_ugo_3', title: 'Une rencontre', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, UGO],
    dialogue: "Je lui ai parle de mes projets de code. Il a ecarquille les yeux. Enfin quelqu'un qui appreciait mon genie a sa juste valeur. Pour la premiere fois depuis longtemps, quelqu'un m'ecoutait vraiment — comme c'est rafraichissant.",
    speaker: 'Lou', nextScene: 'guillaume_intro',
  },

  guillaume_intro: {
    id: 'guillaume_intro', title: 'Guillaume', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, GUILL],
    dialogue: "Guillaume est premier de la classe. Depuis toujours. Il supporte mal que les autres ne bossent pas comme lui. Surtout moi, qui prefere coder ses propres projets aux equations imposees. Son petit coeur fragile n'encaisse pas qu'on puisse reussir autrement que par le par coeur.",
    speaker: 'Lou', nextScene: 'hallway_confrontation',
  },

  hallway_confrontation: {
    id: 'hallway_confrontation', title: 'Dans le couloir', description: '',
    background: BG_LYCEE_GRAND, characters: [LOU, GUILL],
    dialogue: "T'as encore rate ton controle. Si tu bossais la moitie autant que tu codes tes trucs inutiles, tu aurais peut-etre une chance... enfin, c'est ce que j'aimerais croire.",
    speaker: 'Guillaume',
    dialogueOptions: [
      { text: '👊 Repondre cash', nextScene: 'lou_responds_cash' },
      { text: '🤐 Ignorer et garder son calme', nextScene: 'lou_ignores' },
      { text: '😢 En parler a Ugo apres', nextScene: 'lou_tells_ugo' },
    ],
  },

  // ── Branche A : Repondre cash ─────────────────────────────────────────
  lou_responds_cash: {
    id: 'lou_responds_cash', title: 'Dans le couloir', description: '',
    background: BG_LYCEE_GRAND, characters: [LOU, GUILL],
    dialogue: "Mes projets inutiles ? J'ai deploye une API REST en production a 16 ans, mon cher. Toi, t'as juste memorise des formules que tu oublieras dans trois mois. Ce n'est pas pareil, mais je ne m'attends pas a ce que tu comprennes la nuance.",
    speaker: 'Lou', nextScene: 'lou_responds_cash_2',
  },

  lou_responds_cash_2: {
    id: 'lou_responds_cash_2', title: 'Dans le couloir', description: '',
    background: BG_LYCEE_GRAND, characters: [LOU, GUILL],
    dialogue: "Guillaume a blemi. Ses yeux se sont durcis. J'avais touche quelque chose. Pas de la fierte — de la rage. Comme c'est interessant de voir un petit ver luisant s'enflammer...",
    speaker: 'Lou', nextScene: 'explosion',
  },

  // ── Branche B : Ignorer ──────────────────────────────────────────────
  lou_ignores: {
    id: 'lou_ignores', title: 'Dans le couloir', description: '',
    background: BG_LYCEE_GRAND, characters: [LOU],
    dialogue: "J'ai mis mes ecouteurs. La musique, le code, et le fait que Guillaume n'existe pas. Parfois le meilleur debug c'est d'ignorer le bug. Et laissons les petits esprits bouillonnent dans leur jus, hein.",
    speaker: 'Lou', nextScene: 'explosion',
  },

  // ── Branche C : En parler a Ugo ──────────────────────────────────────
  lou_tells_ugo: {
    id: 'lou_tells_ugo', title: 'Avec Ugo', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, UGO],
    dialogue: "J'ai retrouve Ugo a la cafet. Je lui ai tout raconte, avec tout le talent de narration que je possede — ce qui n'est pas rien. Il a pose son sandwich et m'a regarde serieusement. Enfin quelqu'un qui prend mes dramas au serieux.",
    speaker: 'Lou', nextScene: 'lou_tells_ugo_2',
  },

  lou_tells_ugo_2: {
    id: 'lou_tells_ugo_2', title: 'Avec Ugo', description: '',
    background: BG_LYCEE_COULOIR, characters: [LOU, UGO],
    dialogue: "Il te fait peur parce qu'il voit quelque chose en toi qu'il n'a pas. Ce genre de gars... c'est pas de la haine. C'est de l'envie. Meme si, avoue, tu aimes un peu qu'il te jalouse.",
    speaker: 'Ugo', nextScene: 'explosion',
  },

  // ══════════════════════════════════════════════════
  // ACTE 2 — L'Akuma
  // ══════════════════════════════════════════════════

  explosion: {
    id: 'explosion', title: "L'Explosion !", description: '',
    background: BG_EXPLOSION, characters: [],
    dialogue: "Dehors, c'etait le chaos. Une silhouette sombre planait au-dessus du boulevard — gigantesque, enveloppee d'une brume noire et violette. J'ai reconnu la forme d'un Akuma. Enfin, un peu d'action dans cette ville si tranquille...",
    speaker: 'Lou', nextScene: 'akuma_reveal',
  },

  akuma_reveal: {
    id: 'akuma_reveal', title: "L'Ombre Spectrale", description: '',
    background: BG_TERRAIN_VAGUE, characters: [SHADOW],
    dialogue: "Vous ne meritez pas vos vies ! Vous gachez tout — votre jeunesse, vos opportunites ! JE VAIS VOUS APPRENDRE CE QUE VAUT L'EFFORT !",
    speaker: 'Ombre Spectrale', nextScene: 'ugo_captured',
  },

  ugo_captured: {
    id: 'ugo_captured', title: 'Ugo en danger !', description: '',
    background: BG_TERRAIN_VAGUE, characters: [LOU, SHADOW],
    dialogue: "Dans la panique, j'ai cherche Ugo des yeux. Et je l'ai vu — suspendu dans les airs, prisonnier d'un tentacule d'ombre. Mon coeur s'est arrete.",
    speaker: 'Lou', nextScene: 'ugo_captured_2',
  },

  ugo_captured_2: {
    id: 'ugo_captured_2', title: 'Ugo en danger !', description: '',
    background: BG_TERRAIN_VAGUE, characters: [UGO, SHADOW],
    dialogue: "Lou ! Lou, aide-moi ! Et s'il te plait, evite les remarques sur le fait que je sois en detresse...",
    speaker: 'Ugo', nextScene: 'lou_recognizes',
  },

  lou_recognizes: {
    id: 'lou_recognizes', title: "Une voix familiere", description: '',
    background: BG_TERRAIN_VAGUE, characters: [LOU],
    dialogue: "J'ai reconnu cette voix. C'etait Guillaume. Papillon l'avait transforme en Akuma en amplifiant sa frustration. Et maintenant il retenait Ugo en otage. Guillaume, toujours a vouloir etre le centre de l'attention... meme en devenant mechant, c'est pour se faire remarquer.",
    speaker: 'Lou', nextScene: 'miraculous_offer',
  },

  // ══════════════════════════════════════════════════
  // ACTE 3 — Le choix du Miraculous
  // ══════════════════════════════════════════════════

  miraculous_offer: {
    id: 'miraculous_offer', title: 'Le Miraculous de Medusa', description: '',
    background: BG_MIRACULOUS, characters: [LOU, LADY],
    dialogue: "Ladybug a atterri devant moi, son yoyo encore en mouvement. Un pendentif dore brillait dans sa paume.\n\nLou. J'ai besoin de toi. Deviens Medusa. Tu es la seule qui peut atteindre Guillaume.",
    speaker: 'Ladybug',
    dialogueOptions: [
      { text: '✨ Accepter directement', nextScene: 'accept_miraculous' },
      { text: '❓ Demander comment ca marche', nextScene: 'ask_powers' },
      { text: '🤚 Refuser — lui parler sans pouvoirs', nextScene: 'refuse_miraculous' },
    ],
  },

  // ── Nouvelle branche : demander les pouvoirs ──────────────────────────
  ask_powers: {
    id: 'ask_powers', title: 'Comment ca marche ?', description: '',
    background: BG_MIRACULOUS, characters: [LOU, LADY],
    dialogue: "Attends, attendez. Je suis developpeuse. Avant de deployer quoi que ce soit, j'ai besoin de comprendre comment ca fonctionnera. Je ne vais pas appuyer sur 'run' sans lire la doc, n'est-ce pas ?",
    speaker: 'Lou', nextScene: 'ask_powers_2',
  },

  ask_powers_2: {
    id: 'ask_powers_2', title: 'Comment ca marche ?', description: '',
    background: BG_MIRACULOUS, characters: [LOU, LADY],
    dialogue: "Ladybug a souri. — Sage, pour une fois que quelqu'un ne fonce pas tete baissee. Le Miraculous amplifie tes capacites naturelles. Tes instincts de resolution de problemes deviennent des pouvoirs. Tu as cinq capacites — mais tu dois les memoriser pour les maitriser.",
    speaker: 'Ladybug', nextScene: 'minigame_memory_pre',
  },

  minigame_memory_pre: {
    id: 'minigame_memory_pre', title: 'Memorise tes pouvoirs !', description: '',
    background: BG_MIRACULOUS, characters: [LOU, KWAMI_M],
    dialogue: "Le kwami Medusa est apparu du pendentif, les yeux brillants.\n\nJe vais t'apprendre la sequence de tes pouvoirs. Memorise-la bien — en combat, l'ordre compte !",
    speaker: 'Medusa', nextScene: 'minigame_memory_scene',
  },

  minigame_memory_scene: {
    id: 'minigame_memory_scene', title: 'Memorise tes pouvoirs !', description: '',
    background: BG_MEMORY, characters: [],
    type: 'minigame_memory',
    nextScene: 'memory_success',
    failScene: 'memory_fail',
  },

  memory_success: {
    id: 'memory_success', title: 'Impressionnant !', description: '',
    background: BG_MIRACULOUS, characters: [LOU, KWAMI_M],
    dialogue: "Parfait ! Tu as les pouvoirs en tete, meme si on sent bien que tu te prends un peu pour la reine des castings. En combat tu auras un avantage — la premiere attaque te donnera un bonus de precision.",
    speaker: 'Medusa', nextScene: 'accept_miraculous',
  },

  memory_fail: {
    id: 'memory_fail', title: 'On reessaie !', description: '',
    background: BG_MIRACULOUS, characters: [LOU, KWAMI_M],
    dialogue: "Hmm... Tu as presque reussi. Ca viendra avec la pratique ! En combat, fais confiance a ton instinct.",
    speaker: 'Medusa', nextScene: 'accept_miraculous',
  },

  // ── Branche refus ────────────────────────────────────────────────────
  refuse_miraculous: {
    id: 'refuse_miraculous', title: 'Le Courage sans pouvoirs', description: '',
    background: BG_ARC_TRIOMPHE, characters: [LOU],
    dialogue: "Je ne veux pas de pouvoirs. C'est Guillaume. Je le connais. Laissez-moi lui dire deux ou trois verites bien senties. Une bonne pique verbale, ca vaut tous les superpouvoirs du monde.",
    speaker: 'Lou', nextScene: 'refuse_ladybug_response',
  },

  refuse_ladybug_response: {
    id: 'refuse_ladybug_response', title: 'Le Courage sans pouvoirs', description: '',
    background: BG_ARC_TRIOMPHE, characters: [LOU, LADY],
    dialogue: "Ladybug a semble surprise. Puis, lentement, elle a hoche la tete.\n\nD'accord, Miss Je-sais-tout. Mais sois prudente, Lou. Ton arrogance pourrait te jouer des tours.",
    speaker: 'Ladybug', nextScene: 'qte_dialogue_pre',
  },

  qte_dialogue_pre: {
    id: 'qte_dialogue_pre', title: 'Face a Guillaume', description: '',
    background: BG_ARC_TRIOMPHE, characters: [LOU, SHADOW],
    dialogue: "Je me suis avancee vers l'Ombre Spectrale. Pas de pouvoirs. Juste moi, mes mots, et ce que je connais de Guillaume. C'est un test de QI emotionnel — et franchement, je le reussis haut la main.",
    speaker: 'Lou', nextScene: 'minigame_qte_scene',
  },

  minigame_qte_scene: {
    id: 'minigame_qte_scene', title: 'Dialogue Crucial', description: '',
    background: BG_QTE_GUILLAUME, characters: [],
    type: 'minigame_qte',
    nextScene: 'qte_success',
    failScene: 'qte_fail',
  },

  qte_success: {
    id: 'qte_success', title: 'Les mots ont porte', description: '',
    background: BG_ARC_TRIOMPHE, characters: [LOU, SHADOW],
    dialogue: "L'aura sombre autour de Guillaume a vacille. Mes mots ont touche quelque chose d'humain en lui — comme toujours quand on sait les trouver. L'emprise de Papillon s'est relachee. Vous voyez, pas besoin de superpouvoirs quand on a du style.",
    speaker: 'Lou', nextScene: 'diplomacy_ugo_freed',
  },

  qte_fail: {
    id: 'qte_fail', title: 'Pas assez...', description: '',
    background: BG_ARC_TRIOMPHE, characters: [LOU, SHADOW],
    dialogue: "Guillaume n'a pas cede. L'Ombre Spectrale s'est renforcee. Ladybug m'a attrapee par le bras.\n\n— Il faut quand meme ce Miraculous, Lou.",
    speaker: 'Ladybug', nextScene: 'accept_miraculous',
  },

  diplomacy_ugo_freed: {
    id: 'diplomacy_ugo_freed', title: 'Libere !', description: '',
    background: BG_ARC_TRIOMPHE, characters: [UGO, SHADOW],
    dialogue: "L'emprise sur Ugo s'est relachee. Il est tombe sur ses pieds, hors d'haleine. L'aura sombre autour de Guillaume a completement vacille.",
    speaker: 'Lou', nextScene: 'ending_diplomacy',
  },

  ending_diplomacy: {
    id: 'ending_diplomacy', title: 'FIN - La Force des Mots', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU, UGO],
    dialogue: "Le papillon noir s'est echappe, purifie par Ladybug. Guillaume etait a genoux sur le trottoir, epuise.\n\nIl a leve les yeux : — Je... je ne savais pas.\n\nUgo s'est approche : — T'es completement folle, Lou. Merci.\n\nPas besoin d'un Miraculous. Juste d'un peu d'esprit.",
    speaker: 'Lou', type: 'ending',
  },

    // ══════════════════════════════════════════════════
  // ACTE 4 — Transformation & Combat
  // ══════════════════════════════════════════════════

  accept_miraculous: {
    id: 'accept_miraculous', title: 'Le Choix de Lou', description: '',
    background: BG_MIRACULOUS, characters: [LOU],
    dialogue: "J'ai pris le pendentif. Il etait chaud. Presque vivant.\n\n— D'accord. Je le fais. Apres tout, quelqu'un doit montrer a Paris comment fait une vraie heroine.",
    speaker: 'Lou', nextScene: 'kwami_appears',
  },

  kwami_appears: {
    id: 'kwami_appears', title: 'Medusa !', description: '',
    background: BG_MIRACULOUS, characters: [LOU, KWAMI_M],
    dialogue: "Une petite creature lumineuse a jailli du pendentif — une meduse minuscule aux grands yeux violets.",
    speaker: 'Lou', nextScene: 'kwami_speaks',
  },

  kwami_speaks: {
    id: 'kwami_speaks', title: 'Medusa !', description: '',
    background: BG_MIRACULOUS, characters: [LOU, KWAMI_M],
    dialogue: "Bonjour Lou ! Je m'appelle Medusa, je suis ton Kwami. Je t'attendais depuis longtemps — et je vois que tu as deja un sacre caractere. Tu es prete ?",
    speaker: 'Medusa', nextScene: 'guillaume_backstory',
  },

  guillaume_backstory: {
    id: 'guillaume_backstory', title: 'La Verite sur Guillaume', description: '',
    background: BG_RUE_PARISIENNE, characters: [LOU, LADY],
    dialogue: "Guillaume a grandi en croyant que la valeur d'une personne se mesure a ses resultats. Papillon a amplifie sa frustration. Il ne deteste pas les gens — il a peur d'avoir sacrifie sa vie pour rien.",
    speaker: 'Ladybug', nextScene: 'lou_understands',
  },

  lou_understands: {
    id: 'lou_understands', title: 'La Verite sur Guillaume', description: '',
    background: BG_RUE_PARISIENNE, characters: [LOU],
    dialogue: "Je comprenais mieux maintenant. Guillaume n'etait pas mechant — il etait juste con. Et moi, j'allais devoir l'affronter. Un peu de compassion ne fait pas de mal, meme quand on est aussi geniale que moi.",
    speaker: 'Lou', nextScene: 'transformation_scene',
  },

  transformation_scene: {
    id: 'transformation_scene', title: 'Medusa, transforme-moi !', description: '',
    background: BG_TRANSFORMATION, characters: [], type: 'transformation', nextScene: 'strategy_scene',
  },

  strategy_scene: {
    id: 'strategy_scene', title: 'Prete au Combat', description: '',
    background: BG_ARC_TRIOMPHE, characters: [MEDUSA],
    dialogue: "Une puissance etrange circulait dans mes veines. Mes cheveux flottaient — effet de style garanti. La-haut, Ugo me regardait avec des yeux ecarquilles. Normal, c'est moi.",
    speaker: 'Medusa', nextScene: 'strategy_scene_2',
  },

  strategy_scene_2: {
    id: 'strategy_scene_2', title: 'Prete au Combat', description: '',
    background: BG_ARC_TRIOMPHE, characters: [MEDUSA, UGO],
    dialogue: "Wow, c'est qui cette héroine trop canon !!.",
    speaker: 'Ugo', nextScene: 'strategy_scene_3',
  },

  strategy_scene_3: {
    id: 'strategy_scene_3', title: 'Prete au Combat', description: '',
    background: BG_ARC_TRIOMPHE, characters: [MEDUSA],
    dialogue: "Accroche-toi, Ugo. Je viens te chercher. Et ne t'inquiete pas — je suis aussi douee en sauvetage qu'en code.",
    speaker: 'Medusa', nextScene: 'battle',
  },

  battle: {
    id: 'battle', title: "Combat contre l'Ombre Spectrale", description: '',
    background: BG_BATTLE, characters: [], type: 'battle', nextScene: 'post_battle_ugo_free',
  },

  // ══════════════════════════════════════════════════
  // POST COMBAT — Bifurcations
  // ══════════════════════════════════════════════════

  post_battle_ugo_free: {
    id: 'post_battle_ugo_free', title: 'Ugo est libre !', description: '',
    background: BG_ARC_TRIOMPHE, characters: [MEDUSA, UGO],
    dialogue: "TIENG Guillaume !! \nL'Ombre Spectrale s'est dissous. Guillaume est tombe a genoux, libere de l'Akuma. L'emprise sur Ugo a disparu — il a atterri sur ses pieds, stupefait. Normal, j'ai ce genre d'effet sur les gens.",
    speaker: 'Lou', nextScene: 'post_battle_ugo_free_2',
  },

  post_battle_ugo_free_2: {
    id: 'post_battle_ugo_free_2', title: 'Ugo est libre !', description: '',
    background: BG_ARC_TRIOMPHE, characters: [MEDUSA, UGO],
    dialogue: "T'es... incroyable. Vraiment. Meme si tu le sais deja, je te le dis quand meme.",
    speaker: 'Ugo', nextScene: 'post_battle_choice',
  },

  post_battle_ugo_hurt: {
    id: 'post_battle_ugo_hurt', title: 'Le prix de la victoire', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA, UGO],
    dialogue: "Ugo est tombe lors de l'attaque finale. Il s'est releve, mais j'ai vu dans ses yeux qu'il avait ete blesse. Ma victoire avait un gout amer. Bon, j'aurais peut-etre du faire attention... mais c'est tellement rare que je perde mon sang-froid.",
    speaker: 'Lou', nextScene: 'post_battle_ugo_hurt_2',
  },

  post_battle_ugo_hurt_2: {
    id: 'post_battle_ugo_hurt_2', title: 'Le prix de la victoire', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA, UGO],
    dialogue: "Ca va... je suis vivant. Mais Lou — la prochaine fois, assure-toi qu'il n'y a pas de dommages collateraux. Et peut-etre evite les poses triomphales pendant que je suis par terre.",
    speaker: 'Ugo', nextScene: 'ending_prix_victoire',
  },

  ending_prix_victoire: {
    id: 'ending_prix_victoire', title: 'FIN - Le Prix de la Victoire', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA],
    dialogue: "J'ai gagne le combat. Mais j'ai appris quelque chose d'important ce soir-la. Les superpouvoirs sans responsabilite ne valent rien. La prochaine fois, je serais plus prudente. Enfin, un peu. Je ne vais pas non plus devenir paranoiaque.",
    speaker: 'Lou', type: 'ending',
  },

  post_battle_choice: {
    id: 'post_battle_choice', title: 'Un dernier choix', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Ladybug purifiait le papillon noir... mais elle a chancele. Son Miraculous clignotait dangereusement.\n\nMedusa... j'ai besoin d'aide. Je n'ai plus assez d'energie pour le Charme Miraculeux. Meme si ca me gene de l'admettre...",
    speaker: 'Ladybug',
    dialogueOptions: [
      { text: '🐞 Prendre le Miraculous Coccinelle', nextScene: 'ladybug_handoff' },
      { text: '🦸 Rester Medusa, defendre Ladybug', nextScene: 'battle_victory' },
      { text: '💛 Reveler mon identite a Ugo', nextScene: 'reveal_identity' },
      { text: '🌑 Papillon me contacte en secret...', nextScene: 'hawk_moth_contact' },
      { text: '💻 Hacker le systeme de Papillon', nextScene: 'hack_papillon_pre' },
    ],
  },

    // ── Nouvelle branche : Reveler son identite ───────────────────────────
  reveal_identity: {
    id: 'reveal_identity', title: 'La Verite', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU, UGO],
    dialogue: "J'ai enleve mon masque devant Ugo. Juste pour lui — c'est un honneur, il devrait en etre conscient. Ses yeux se sont ecarquilles. Enfin, la revelation tant attendue.",
    speaker: 'Lou', nextScene: 'reveal_identity_2',
  },

  reveal_identity_2: {
    id: 'reveal_identity_2', title: 'La Verite', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU, UGO],
    dialogue: "Lou... C'etait toi depuis le debut ? Tu m'as sauve la vie. Et tu m'as laisse croire que c'etait une inconnue... C'est tres toi, ca. L'humilite, tout ca.",
    speaker: 'Ugo', nextScene: 'reveal_identity_3',
  },

  reveal_identity_3: {
    id: 'reveal_identity_3', title: 'La Verite', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU, UGO],
    dialogue: "Il a ri doucement. — T'aurais pu me le dire, tu sais. Je t'aurais quand meme trouve incroyable.\n\nJ'ai remis mon masque. Mais cette fois, je souriais vraiment. Et si je suis honnete, c'est agreable d'etre admiree pour ce que je suis vraiment.",
    speaker: 'Lou', nextScene: 'ending_identite',
  },

  ending_identite: {
    id: 'ending_identite', title: 'FIN - Identite Secrete', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, UGO],
    dialogue: "On a aide Ladybug a lancer le Charme Miraculeux ensemble. Guillaume redevenait lui-meme. Et Ugo... Ugo savait qui j'etais. Ca faisait une difference enorme. Enfin, surtout pour lui — moi, je suis toujours aussi geniale, qu'on le sache ou pas.",
    speaker: 'Lou', type: 'ending',
  },

  // ── Nouvelle branche : Hacker Papillon ───────────────────────────────
  hack_papillon_pre: {
    id: 'hack_papillon_pre', title: 'Plan B', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA],
    dialogue: "Une idee folle m'a traversee — enfin, folle pour les esprits ordinaires. Papillon utilise un reseau de communication pour controler ses Akumas. Si je pouvais trouver une faille et couper le signal... Ce serait tellement plus elegant qu'un combat.",
    speaker: 'Lou', nextScene: 'hack_papillon_2',
  },

  hack_papillon_2: {
    id: 'hack_papillon_2', title: 'Plan B', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Ladybug m'a regardee, incrédule.\n\n— T'es serieuse ? Tu vas hacker Papillon avec... tes pouvoirs de superheroine ?\n\n— Non. Avec mon laptop. C'est plus fiable. Et puis, la classe, ca ne s'achete pas.",
    speaker: 'Medusa', nextScene: 'minigame_debug_pre',
  },

  minigame_debug_pre: {
    id: 'minigame_debug_pre', title: 'Debug Session', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA],
    dialogue: "J'ai sorti mon laptop du sac — oui, je l'avais, toujours prete. J'ai localise le signal de Papillon. Son code de controle avait des bugs. Je devais les exploiter. C'est un peu comme corriger une copie de Guillaume, finalement.",
    speaker: 'Lou', nextScene: 'minigame_debug_scene',
  },

  minigame_debug_scene: {
    id: 'minigame_debug_scene', title: 'Debug Session', description: '',
    background: BG_HACK_PAPILLON, characters: [],
    type: 'minigame_debug',
    nextScene: 'hack_success',
    failScene: 'hack_fail',
  },

  hack_success: {
    id: 'hack_success', title: 'Systeme infiltre !', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Le signal de Papillon s'est coupe. Guillaume a chancele, lucide soudainement. Ladybug m'a regarde avec des yeux ronds.\n\n— T'as vraiment hacke Papillon avec un laptop... Je ne sais pas si c'est du genie ou de l'audace.",
    speaker: 'Ladybug', nextScene: 'hack_success_2',
  },

  hack_success_2: {
    id: 'hack_success_2', title: 'Systeme infiltre !', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA],
    dialogue: "— Pas exactement. J'ai juste trouve comment contourner son systeme de controle. C'est du code des annees 90. Franchement, Papillon, un peu de mise a jour ne ferait pas de mal, TIENG.\n\nOn a ri. Meme en plein chaos, je garde mon humour.",
    speaker: 'Medusa', nextScene: 'ending_code_courage',
  },

  hack_fail: {
    id: 'hack_fail', title: 'Bug non resolu...', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Le code etait trop bien protege. Le signal est reste actif. Ladybug a pose une main sur mon epaule.\n\n— Bonne idee. Mauvais timing. Meme les genies ont leurs limites, apparemment. On fait le classique.",
    speaker: 'Ladybug', nextScene: 'battle_victory',
  },

  ending_code_courage: {
    id: 'ending_code_courage', title: 'FIN - Code et Courage', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, UGO],
    dialogue: "Guillaume redevenait lui-meme. Ladybug avait lance son Charme. Et moi j'avais prouve que les superpouvoirs c'est bien... mais un bon algo c'est mieux.\n\nUgo m'a serre dans ses bras. — T'es vraiment un autre niveau, Lou.\n\n— Je sais, merci.",
    speaker: 'Lou', type: 'ending',
  },

  // ── Branche victoire classique ────────────────────────────────────────
  battle_victory: {
    id: 'battle_victory', title: 'Medusa, la Gardienne de Paris', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, UGO],
    dialogue: "J'ai protege Ladybug le temps qu'elle recupere. Ensemble, nous avons repousse la derniere vague. Guillaume nous regardait, les yeux clairs. Enfin, quelqu'un qui reconnait ma superiorite sans discuter.",
    speaker: 'Lou', nextScene: 'battle_victory_end',
  },

  battle_victory_end: {
    id: 'battle_victory_end', title: 'Medusa, la Gardienne de Paris', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Tu reviens demain ? Meme si ton ego a failli faire exploser Paris, tu t'en es bien sortie.",
    speaker: 'Ladybug', nextScene: 'battle_victory_final',
  },

  battle_victory_final: {
    id: 'battle_victory_final', title: 'Medusa, la Gardienne de Paris', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, UGO],
    dialogue: "J'ai souri sous mon masque. — Toujours. Paris a besoin de quelqu'un de competent, apres tout.\n\nUgo m'a regardee longtemps. Il ne savait pas encore. Mais il souriait quand meme. Il finira bien par comprendre qui est la vraie heroine.",
    speaker: 'Medusa', type: 'ending',
  },

  // ── Branche Ladybug ───────────────────────────────────────────────────
  ladybug_handoff: {
    id: 'ladybug_handoff', title: 'Le Passage de Temoin', description: '',
    background: BG_MIRACULOUS, characters: [MEDUSA, LADY],
    dialogue: "Ladybug a detache ses boucles d'oreilles avec un tremblement.\n\nParis a besoin de Ladybug. Et ce soir... c'est toi, Ladybug. Mais tu touches pas a un cheveu de Chat Noir, vilaine ! Je te surveille !",
    speaker: 'Ladybug', nextScene: 'ladybug_handoff_lou',
  },

  ladybug_handoff_lou: {
    id: 'ladybug_handoff_lou', title: 'Le Passage de Temoin', description: '',
    background: BG_MIRACULOUS, characters: [MEDUSA],
    dialogue: "Mes mains tremblaient. Mais j'ai pris les boucles. Evidemment que je vais pecho Chat Noir, EHEHEHEH ! Et j'ai murmure les mots que je n'aurais jamais imagine prononcer. Enfin, sauf que je les avais deja imagines, hein.",
    speaker: 'Lou', nextScene: 'tikki_appears',
  },

  tikki_appears: {
    id: 'tikki_appears', title: 'Tikki !', description: '',
    background: BG_MIRACULOUS, characters: [MEDUSA, KWAMI_T],
    dialogue: "Une petite creature rouge et noire a jailli des boucles — Tikki ! Elle m'a regardee avec ses grands yeux bleus. Encore un kwami qui va me dire a quel point je suis speciale... j'adore deja.",
    speaker: 'Lou', nextScene: 'tikki_speaks',
  },

  tikki_speaks: {
    id: 'tikki_speaks', title: 'Tikki !', description: '',
    background: BG_MIRACULOUS, characters: [MEDUSA, KWAMI_T],
    dialogue: "Lou ! Je savais que tu ferais le bon choix — meme si tu as mis un point d'honneur a nous faire attendre. Paris a besoin de toi ce soir. Prete ?",
    speaker: 'Tikki', nextScene: 'transformation_ladybug',
  },

  transformation_ladybug: {
    id: 'transformation_ladybug', title: 'Tikki, transforme-moi !', description: '',
    background: BG_TRANSFORMATION, characters: [], type: 'transformation_ladybug', nextScene: 'ending_ladybug',
  },

  ending_ladybug: {
    id: 'ending_ladybug', title: 'FIN - Lou Ladybug', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU_LB],
    dialogue: "Le yoyo rouge tourbillonnait dans mes mains. J'ai lance le Charme Miraculeux — des milliers de points de lumiere ont tout repare. Un petit geste pour une fille, un grand geste pour... bon, d'accord, j'arrete les references.",
    speaker: 'Lou', nextScene: 'ending_ladybug_2',
  },

  ending_ladybug_2: {
    id: 'ending_ladybug_2', title: 'FIN - Lou Ladybug', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU_LB, UGO],
    dialogue: "Guillaume redevenait lui-meme. Je repris mon Miraculous avec un sourire epuise.\n\nMerci, Lou. Tu es vraiment quelqu'un d'exceptionnel en plus d'etre super super belle et de descendre de Josephine de Beauharnais. Mais surtout, arrete de te la raconter.",
    speaker: 'Ladybug', nextScene: 'ending_ladybug_3',
  },

  ending_ladybug_3: {
    id: 'ending_ladybug_3', title: 'FIN - Lou Ladybug', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU_LB, UGO],
    dialogue: "Ugo me regardait depuis le trottoir. Il ne savait pas que c'etait moi. Mais quand nos regards se sont croises, il a souri — ce grand sourire maladroit du couloir. Les mecs, toujours les derniers a comprendre.",
    speaker: 'Lou', nextScene: 'ending_ladybug_4',
  },

  ending_ladybug_4: {
    id: 'ending_ladybug_4', title: 'FIN - Lou Ladybug', description: '',
    background: BG_PARIS_EIFFEL, characters: [LOU_LB],
    dialogue: "Ce soir-la, en rentrant chez moi, j'ai compris. On n'a pas besoin d'etre ne heros. Il suffit d'etre prete quand le moment arrive. Et accessoirement, d'etre brillante, talentueuse, et un peu impertinente. Ca aide.",
    speaker: 'Lou', type: 'ending',
  },

  // ── Branche Papillon ─────────────────────────────────────────────────
  hawk_moth_contact: {
    id: 'hawk_moth_contact', title: "Une Voix dans l'Ombre", description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA],
    dialogue: "Impressionnant, Medusa. Tu es bien plus puissante que Ladybug ne le croit. Rejoins-moi. Pourquoi obeir, quand tu peux regner ?",
    speaker: 'Papillon',
    dialogueOptions: [
      { text: '😈 Rejoindre Papillon', nextScene: 'ending_dark' },
      { text: '💪 Resister et le repousser', nextScene: 'ending_resist' },
      { text: '🕵️ Faire semblant d\'accepter pour l\'infiltrer', nextScene: 'infiltrate_papillon' },
    ],
  },

  // ── Nouvelle branche : Infiltrer Papillon ─────────────────────────────
  infiltrate_papillon: {
    id: 'infiltrate_papillon', title: 'Double jeu', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA],
    dialogue: "Oui. Je suis avec toi. — J'ai dit ca avec le plus grand calme du monde. Mais dans ma tete, je codais deja le plan de contre-offensive. Papillon pense m'avoir... pauvre papillon.",
    speaker: 'Lou', nextScene: 'infiltrate_2',
  },

  infiltrate_2: {
    id: 'infiltrate_2', title: 'Double jeu', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA, LADY],
    dialogue: "J'ai envoye un message code a Ladybug via mon appli de communication cryptee. — Je suis en infiltration. 10 minutes. Ne m'attaque pas. Et evite de faire ta drama queen habituelle.",
    speaker: 'Lou', nextScene: 'infiltrate_3',
  },

  infiltrate_3: {
    id: 'infiltrate_3', title: 'Double jeu', description: '',
    background: BG_TERRAIN_VAGUE, characters: [MEDUSA],
    dialogue: "Papillon m'a donne des informations sur ses prochaines cibles. Sa position. Son identite presque. Il est vraiment trop confiant. Puis j'ai coupe la connexion et retourne vers Ladybug, en tournant les talons avec style.",
    speaker: 'Lou', nextScene: 'infiltrate_4',
  },

  infiltrate_4: {
    id: 'infiltrate_4', title: 'Double jeu', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "— T'as joue un sacre jeu de poker, Lou.\n\n— Non. J'ai juste execute un social engineering parfait. Avec un peu de cryptographie. Rien de bien complique pour quelqu'un de mon niveau.",
    speaker: 'Ladybug', nextScene: 'ending_infiltration',
  },

  ending_infiltration: {
    id: 'ending_infiltration', title: 'FIN - Infiltration', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA],
    dialogue: "Ce soir-la, Papillon pensait avoir recrute une alliee. En realite, il venait de donner toutes les informations dont Ladybug avait besoin. Parfois, les meilleurs bugs sont ceux qu'on laisse croire fonctionner. Et les meilleurs agents secrets sont ceux qui ne se prennent pas trop au serieux — enfin, moi je me prends un peu au serieux, mais c'est merite.",
    speaker: 'Lou', type: 'ending',
  },

  // ── Fins sombre et incorruptible ─────────────────────────────────────
  ending_dark: {
    id: 'ending_dark', title: "FIN SOMBRE - L'Ombre de Medusa", description: '',
    background: BG_TERRAIN_VAGUE, characters: [MED_BCK],
    dialogue: "J'ai dit oui. Dans l'instant, quelque chose s'est brise en moi — ou peut-etre libere. Apres tout, pourquoi se limiter a etre une heroine quand on peut etre une legende ?",
    speaker: 'Lou', nextScene: 'ending_dark_2',
  },

  ending_dark_2: {
    id: 'ending_dark_2', title: "FIN SOMBRE - L'Ombre de Medusa", description: '',
    background: BG_TERRAIN_VAGUE, characters: [MED_BCK, LADY],
    dialogue: "Lou... non. Tu n'es pas comme ca.",
    speaker: 'Ladybug', nextScene: 'ending_dark_3',
  },

  ending_dark_3: {
    id: 'ending_dark_3', title: "FIN SOMBRE - L'Ombre de Medusa", description: '',
    background: BG_TERRAIN_VAGUE, characters: [MED_BCK],
    dialogue: "Mais je me retournais deja. Medusa ne servait plus Paris ce soir. Medusa avait ses propres ambitions.\n\n... Cette histoire n'est pas terminee. Et franchement, c'est beaucoup plus excitant comme ca.",
    speaker: 'Lou', type: 'ending',
  },

  ending_resist: {
    id: 'ending_resist', title: 'FIN - Incorruptible', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA],
    dialogue: "Non.\n\nUn seul mot. Mais dit avec toute la certitude du monde — et une petite pointe de condescendance bien placee.\n\nJe ne suis pas une arme. Je ne suis pas une reine. Je suis Lou. Et Lou protege les gens qu'elle aime. Et accessoirement, Lou est beaucoup trop intelligente pour se faire manipuler.",
    speaker: 'Medusa', nextScene: 'ending_resist_2',
  },

  ending_resist_2: {
    id: 'ending_resist_2', title: 'FIN - Incorruptible', description: '',
    background: BG_PARIS_EIFFEL, characters: [MEDUSA, LADY],
    dialogue: "Tu viens de faire le choix le plus difficile qui soit. Et tu l'as fait sans hesiter. Je suis fiere de toi — meme si ton ego risque de devenir un jour un akuma a lui tout seul.",
    speaker: 'Ladybug', type: 'ending',
  },

    // ── Defaite ───────────────────────────────────────────────────────────
  battle_defeat: {
    id: 'battle_defeat', title: 'Defaite...', description: '',
    background: BG_TERRAIN_VAGUE, characters: [LOU],
    dialogue: "L'Ombre Spectrale m'a submergee. Je suis tombee sous les fesses puantes de Guillaume — vraiment, il n'a meme pas la classe d'etre un mechant propre —, le Miraculous clignotant. Ladybug a du intervenir pour me couvrir. Humiliant.",
    speaker: 'Lou', nextScene: 'battle_defeat_2',
  },

  battle_defeat_2: {
    id: 'battle_defeat_2', title: 'Defaite...', description: '',
    background: BG_TERRAIN_VAGUE, characters: [LOU, LADY],
    dialogue: "Tu veux reessayer ? Cette fois, essaye de moins te la raconter et de plus te concentrer.",
    speaker: 'Ladybug', nextScene: 'battle_defeat_3',
  },

  battle_defeat_3: {
    id: 'battle_defeat_3', title: 'Defaite...', description: '',
    background: BG_TERRAIN_VAGUE, characters: [LOU],
    dialogue: "J'ai serre les dents. Oui. Les heros ne s'arretent pas a la premiere defaite. Meme quand cette defaite est vraiment, vraiment bete. La prochaine fois, je ne sous-estimerai pas l'adversaire. Ni ses fesses.",
    speaker: 'Lou', type: 'ending',
  },
};

export const attacks = [
  { id: 'tentacule_fouet',   name: 'Tentacule Fouet',   description: 'Attaque physique de fouet', damage: 15, type: 'physical', color: '#FF4444' },
  { id: 'regard_petrifiant', name: 'Regard Petrifiant', description: 'Regard special petrifiant', damage: 20, type: 'special',  color: '#9933FF' },
  { id: 'barriere_lumineuse',name: 'Barriere Lumineuse',description: 'Barriere defensive',        damage: 0,  type: 'defense',  color: '#3399FF', healing: 10 },
  { id: 'fuite_aquatique',   name: 'Fuite Aquatique',   description: 'Frappe et esquive',         damage: 5,  type: 'utility',  color: '#00DD99' },
  { id: 'colere_medusa',     name: 'Colere de Medusa',  description: 'Pouvoir ultime !',          damage: 35, type: 'ultimate', color: '#FFDD00' },
];

export const initialBattleState: BattleState = {
  louHP: 100, louMaxHP: 100, guillaumeHP: 80, guillaumeMaxHP: 80,
  currentTurn: 'player',
  battleLog: ["Le combat a commence ! Medusa vs Ombre Spectrale !"],
  gameOver: false,
};