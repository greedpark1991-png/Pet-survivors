(() => {
  'use strict';

  const CHARACTERS = {
    jjigae: {
      name: '찌개', species: '갈색 말티푸', main: 0x8d5f3e, dark: 0x5f3d29, light: 0xc89a72,
      weapon: '앙앙 소리탄', role:'소리탄 특화', projectile: 'bark', description: '짖는 소리 파동이 가장 가까운 적을 향해 날아간다.',
      passive: { name:'왕성한 성량', desc:'앙앙 소리탄의 크기와 판정이 10% 커진다.' }
    },
    mandu: {
      name: '만두', species: '하얀 말티푸', main: 0xf0ede5, dark: 0xbcb6ad, light: 0xffffff,
      weapon: '콧물탄', role:'튼튼한 생존', projectile: 'snot', description: '초록빛 콧물 덩어리를 툭 발사한다.',
      passive: { name:'튼튼한 위장', desc:'시작 최대 HP가 8% 높다.' }
    },
    gamja: {
      name: '감자', species: '크림 토이푸들', main: 0xf0d49a, dark: 0xb88950, light: 0xffefc4,
      weapon: '오줌빔', role:'기동력 특화', projectile: 'pee', description: '가늘고 빠른 노란 일직선 탄을 쏜다.',
      passive: { name:'쪼꼬미 질주', desc:'시작 이동속도가 6% 빠르다.' }
    },
    gucci: {
      name: '구찌', species: '하양+주황 코숏', main: 0xf8f3e8, dark: 0xdd7b34, light: 0xffffff,
      weapon: '털뭉치', role:'기본 공격 특화', projectile: 'hairball', description: '뭉친 털공을 가장 가까운 적에게 날린다.',
      passive: { name:'사냥꾼의 털뭉치', desc:'기본 공격 피해가 5% 증가한다.' }
    }
  };

  const PLAYER_SPRITES = {
    gamja: { src: '/assets/players/gamja.png', previewSize: 42, worldScale: 1, shadow: { w:24,h:7,oy:13 }, hitbox: { w: 14, h: 14, ox: 10, oy: 12 } },
    gucci: { src: '/assets/players/gucci.png', previewSize: 46, worldScale: 1, shadow: { w:29,h:8,oy:15 }, hitbox: { w: 14, h: 14, ox: 10, oy: 12 } },
    mandu: { src: '/assets/players/mandu.png', previewSize: 44, worldScale: 1, shadow: { w:28,h:8,oy:15 }, hitbox: { w: 13, h: 13, ox: 10, oy: 12 } },
    jjigae: { src: '/assets/players/jjigae.png', previewSize: 46, worldScale: 1, shadow: { w:25,h:7,oy:13 }, hitbox: { w: 14, h: 14, ox: 10, oy: 12 } }
  };

  const LEVEL_UPGRADES = [
    { id: 'damage', icon: '⚔', title: '공격력 증가', desc: '모든 공격 피해량이 7% 증가한다.' },
    { id: 'speed', icon: '➜', title: '이동속도 증가', desc: '이동 속도가 3.5% 증가한다.' },
    { id: 'health', icon: '♥', title: '최대 체력 회복', desc: '최대 HP가 14 증가하고 최대 HP의 45%를 회복한다.' },
    { id: 'xpGain', icon: '✦', title: '경험치 증가', desc: '경험치 획득량이 12% 증가한다.' },
    { id: 'attackSpeed', icon: '⚡', title: '공속 증가', desc: '기본 공격 속도가 4% 빨라진다.' }
  ];

  const SKILLS = [
    { id: 'magicMissile', icon: '✦', title: '마법미사일', desc: '5초마다 마법미사일 3개가 플레이어 주위를 회전한 뒤 적을 추적한다.' },
    { id: 'shrinkRay', icon: '⌁', title: '축소 광선', desc: '기본 투사체가 적을 작게 만들고 3초 동안 그 적의 접촉 피해를 15% 감소시킨다.' },
    { id: 'juiceBox', icon: '▣', title: '마도사의 주스 상자', desc: '기본 투사체가 적중할 때마다 최대 HP의 5%를 회복한다.' },
    { id: 'veil', icon: '◯', title: '감시의 장막', desc: '30초마다 한 번, 다음 적의 공격을 무효화하는 주문 보호막을 생성한다.' },
    { id: 'sword', icon: '†', title: '검을 뽑아라', desc: '3초마다 플레이어의 위·아래를 동시에 크게 베어낸다.' },
    { id: 'hellConductor', icon: '♨', title: '지옥의 전도체', desc: '주기적으로 플레이어 둘레에 원형 불기둥을 터뜨린다.' },
    { id: 'bulletBarrage', icon: '•', title: '탄환 세례', desc: '4초마다 한 적에게 탄환 5발을 연속으로 퍼붓는다.' }
  ];


  const MILESTONE_AUGMENTS = [
    { id: 'goodDeal', icon: '✚', title: '개이득', desc: '기본 투사체를 1발 더 발사한다. 추가 탄환은 기본 공격력의 65% 피해를 주며 반복 획득할 수 있다.' },
    { id: 'hunterInstinct', icon: '⚡', title: '사냥 본능', desc: '기본 공격 속도가 14% 빨라지고 공격력이 7% 증가한다.' },
    { id: 'sniffer', icon: '✧', title: '자석 코', desc: '경험치 보석을 끌어당기는 범위가 75px 넓어진다.' },
    { id: 'ironStomach', icon: '♥', title: '튼튼한 배', desc: '최대 HP가 28 증가하고 체력을 60% 회복하며 받는 피해가 7% 감소한다.' },
    { id: 'zoomies', icon: '➤', title: '우다다!', desc: '이동속도가 12% 증가하고 기본 공격 속도가 6% 빨라진다.' }
  ];


  // 기존 특별 증강 5종은 그대로 유지하고, 이후 캐릭터 전용 증강을 쉽게 추가할 수 있도록 별도 데이터로 분리한다.
  // Lv.5 이상 특별 증강 때 35% 확률로 전용 후보 1개가 '추가 선택지'로 붙으므로 기존 3개 글로벌 후보 확률은 보존된다.
  const CHARACTER_AUGMENTS = [
    { id:'vocalBurst', character:'jjigae', icon:'◉', title:'목청 폭발', desc:'소리탄 적중 시 일정 확률로 작은 충격파가 터진다.' },
    { id:'stickySnot', character:'mandu', icon:'≈', title:'끈적한 콧물', desc:'콧물탄에 맞은 적이 잠시 느려진다.' },
    { id:'highPressurePee', character:'gamja', icon:'⇢', title:'초고압 오줌', desc:'오줌빔의 탄속과 관통 횟수가 증가한다.' },
    { id:'sheddingSeason', character:'gucci', icon:'✺', title:'털갈이 시즌', desc:'기본 공격 시 일정 확률로 추가 털뭉치를 발사한다.' }
  ];


  const MAJOR_AUGMENTS = [
    { id: 'poopOrbit', icon: '●', title: '똥강아지', desc: '캐릭터 주변을 똥이 회전하며 닿는 적을 갉아먹고 밀어낸다. 레벨마다 똥 +1.' },
    { id: 'discThrow', icon: '◉', title: '원반 던지기', desc: '바라보는 방향·위·아래로 강한 원반을 주기적으로 던진다. 초반엔 피해가 오르고 Lv.4부터 관통한다.' },
    { id: 'barkRoar', icon: ')))', title: '댕자후', desc: '일정 주기마다 주변에 소음 폭격을 퍼붓는다. 레벨이 오를수록 폭격 범위가 넓어진다.' },
    { id: 'yellowGas', icon: '☁', title: '멍가스', desc: '이동한 자리에 노란 가스 구름을 남긴다. 구름에 닿은 적은 지속 피해를 입는다.' },
    { id: 'yawnWave', icon: '≋', title: '음파 하품', desc: '전방 부채꼴에 낮은 피해의 하품 파동을 쏘고 맞은 적을 느려지게 한다.' },
    { id: 'territoryMark', icon: '◎', title: '영역표시', desc: '주기적으로 고유 장판을 생성한다. 장판의 적은 지속 피해를 받고 받는 피해가 증가한다.' },
    { id: 'squeakyToy', icon: '★', title: '마성의 뾱뾱이 인형', desc: '주기적으로 화면 내 무작위 적의 머리 위에 뾱뾱이 인형을 떨어뜨려 큰 피해를 준다.' }
  ];

  const FOOD_ENEMIES = {
    grape:       { name:'포도',       texture:'enemy_grape',       hp:16, speed:60,  damage:9,  xp:1 },
    greenGrape:  { name:'청포도',     texture:'enemy_greenGrape',  hp:18, speed:62,  damage:9,  xp:1 },
    raisin:      { name:'건포도',     texture:'enemy_raisin',      hp:12, speed:78,  damage:8,  xp:1 },
    shineMuscat: { name:'샤인머스캣', texture:'enemy_shineMuscat', hp:30, speed:56,  damage:11, xp:2 },
    chocolate:   { name:'초콜릿',     texture:'enemy_chocolate',   hp:28, speed:54,  damage:12, xp:2 },
    coffee:      { name:'커피',       texture:'enemy_coffee',      hp:16, speed:108, damage:9,  xp:2 },
    greenTea:    { name:'녹차',       texture:'enemy_greenTea',    hp:18, speed:98,  damage:9,  xp:2 },
    onion:       { name:'양파',       texture:'enemy_onion',       hp:20, speed:58,  damage:11, xp:1 },
    garlic:      { name:'마늘',       texture:'enemy_garlic',      hp:18, speed:64,  damage:10, xp:1 },
    scallion:    { name:'파',         texture:'enemy_scallion',    hp:18, speed:82,  damage:9,  xp:1 },
    chive:       { name:'부추',       texture:'enemy_chive',       hp:16, speed:88,  damage:9,  xp:1 },
    gum:         { name:'껌',         texture:'enemy_gum',         hp:28, speed:50,  damage:10, xp:2 },
    candy:       { name:'사탕',       texture:'enemy_candy',       hp:16, speed:92,  damage:9,  xp:2 },
    alcohol:     { name:'술',         texture:'enemy_alcohol',     hp:34, speed:60,  damage:14, xp:2 },
    nuts:        { name:'견과류',     texture:'enemy_nuts',        hp:36, speed:52,  damage:13, xp:2 }
  };
  const FOOD_NORMAL_EARLY = ['grape','greenGrape','raisin','onion','garlic','chocolate'];
  const FOOD_NORMAL_MID   = ['grape','greenGrape','raisin','onion','garlic','chocolate','shineMuscat','scallion','chive','nuts'];
  const FOOD_FAST         = ['coffee','greenTea','candy','gum'];
  const FOOD_ALL          = Object.keys(FOOD_ENEMIES);

  const ELITE_MUTATIONS = {
    swift:   { name:'신속', icon:'≫', color:0x7edbff, hpMult:0.82, speedMult:1.34, damageMult:0.92, shotMult:0.82 },
    armored: { name:'중장갑', icon:'◆', color:0xffc56f, hpMult:1.65, speedMult:0.72, damageMult:1.12, shotMult:1.08 },
    splitter:{ name:'분열', icon:'✣', color:0xf29ad4, hpMult:1.05, speedMult:0.98, damageMult:0.98, shotMult:1.00 },
    support: { name:'지원', icon:'✚', color:0x8fe29d, hpMult:0.92, speedMult:0.90, damageMult:0.90, shotMult:0.95 }
  };

  const TRUE_BOSS_NAMES = ['거대 포도', '거대 초콜릿', '거대 양파'];

  // TRUE BOSS 패턴은 메타데이터 + 실행 키로 관리한다.
  // 향후 패턴을 추가할 때 기존 AI 분기를 크게 건드리지 않아도 된다.
  const TRUE_BOSS_PATTERNS = {
    grape: [
      { id:'grapeSpiralRing', phase:1, weight:4, cooldown:1550, minDistance:0, condition:'any', execute:'grapeSpiralRing' },
      { id:'grapePredictFan', phase:1, weight:3, cooldown:1650, minDistance:120, condition:'any', execute:'grapePredictFan' },
      { id:'grapeStaggeredRings', phase:1, weight:3, cooldown:1850, minDistance:0, condition:'any', execute:'grapeStaggeredRings' },
      { id:'grapeRingPredict', phase:2, weight:4, cooldown:1600, minDistance:0, condition:'any', execute:'grapeRingPredict' },
      { id:'grapeDashBurst', phase:2, weight:3, cooldown:1900, minDistance:120, condition:'canRush', execute:'grapeDashBurst' },
      { id:'grapeShiftedGap', phase:2, weight:3, cooldown:1700, minDistance:0, condition:'any', execute:'grapeShiftedGap' }
    ],
    choco: [
      { id:'chocoFan', phase:1, weight:4, cooldown:1500, minDistance:0, condition:'any', execute:'chocoFan' },
      { id:'chocoSideClamp', phase:1, weight:3, cooldown:1700, minDistance:0, condition:'any', execute:'chocoSideClamp' },
      { id:'chocoDelayedLock', phase:1, weight:3, cooldown:1850, minDistance:100, condition:'any', execute:'chocoDelayedLock' },
      { id:'chocoSweep', phase:2, weight:4, cooldown:1650, minDistance:0, condition:'any', execute:'chocoSweep' },
      { id:'chocoCrossfire', phase:2, weight:3, cooldown:1800, minDistance:80, condition:'any', execute:'chocoCrossfire' },
      { id:'chocoBurstPair', phase:2, weight:3, cooldown:1700, minDistance:0, condition:'any', execute:'chocoBurstPair' }
    ],
    onion: [
      { id:'onionSpiral', phase:1, weight:4, cooldown:1550, minDistance:0, condition:'any', execute:'onionSpiral' },
      { id:'onionReverse', phase:1, weight:3, cooldown:1650, minDistance:0, condition:'any', execute:'onionReverse' },
      { id:'onionPulse', phase:1, weight:3, cooldown:1850, minDistance:0, condition:'any', execute:'onionPulse' },
      { id:'onionTriSpeed', phase:2, weight:4, cooldown:1600, minDistance:0, condition:'any', execute:'onionTriSpeed' },
      { id:'onionReverseDouble', phase:2, weight:3, cooldown:1850, minDistance:0, condition:'any', execute:'onionReverseDouble' },
      { id:'onionGapShift', phase:2, weight:3, cooldown:1750, minDistance:0, condition:'any', execute:'onionGapShift' }
    ]
  };

  const HEALING = {
    snackPct:0.20,
    levelUpPct:0.03,
    eliteSnackChance:0.10,
    cleanupXpRatio:0.50
  };

  let selectedCharacter = 'jjigae';
  let game = null;
  let activeScene = null;

  const socket = window.io ? window.io({ transports:['websocket'], upgrade:false, reconnection:true }) : null;
  const coop = { active:false, room:null, myId:null, isHost:false };
  const blankMoveInput = () => ({ left:false, right:false, up:false, down:false });
  const BUILD_KEYS = [
    'attackPower','moveSpeed','maxHp','hp','levelUpgradeCounts','xpGainMult','basicCooldown','extraBasicShots',
    'basicPierce','basicExplosion','basicRicochet','basicSizeMult','basicDamageMult','basicProjectileScale','shockwaveLevel','shockwaveTimer','majorLevels',
    'majorTimers','poopOrbiters','gasClouds','territoryZones','discDirectionIndex','facingAngle','gemMagnetRange',
    'playerDamageMult','augments','characterAugmentLevels','basicTimer','playerInvulnUntil','shieldCharges','skillLevels','skillTimers','shieldVisual',
    'juiceComboUntil','juiceComboHits','reviveProgress','reviveNeedMs','deathCount'
  ];

  function characterStartStats(key) {
    const stats = { attackPower:20, moveSpeed:190, maxHp:100, hp:100, basicDamageMult:1, basicProjectileScale:1 };
    if (key === 'mandu') { stats.maxHp = 108; stats.hp = 108; }
    if (key === 'gamja') stats.moveSpeed *= 1.06;
    if (key === 'gucci') stats.basicDamageMult = 1.05;
    if (key === 'jjigae') stats.basicProjectileScale = 1.10;
    return stats;
  }

  function characterAugmentFor(key) { return CHARACTER_AUGMENTS.find(a => a.character === key) || null; }

  function characterAugmentDescription(id, nextLevel = 1) {
    const lv = Math.max(1, nextLevel || 1);
    if (id === 'vocalBurst') {
      const chance = Math.min(35, 15 + (lv - 1) * 5);
      const damage = Math.round((0.34 + lv * 0.04) * 100);
      const radius = 52 + lv * 5;
      return `소리탄 적중 시 ${chance}% 확률로 작은 충격파 · 피해 ${damage}% · 반경 ${radius}px.`;
    }
    if (id === 'stickySnot') {
      const slow = Math.round((1 - Math.max(0.68, 0.86 - lv * 0.04)) * 100);
      const duration = Math.round((1200 + lv * 180) / 100) / 10;
      return `콧물탄 적중 시 ${duration}초 동안 이동속도 ${slow}% 감소.`;
    }
    if (id === 'highPressurePee') {
      return `오줌빔 관통 +${lv} · 탄속 +${lv * 38} · 사거리 소폭 증가.`;
    }
    if (id === 'sheddingSeason') {
      const chance = Math.min(35, 15 + (lv - 1) * 5);
      return `기본 공격 시 ${chance}% 확률로 피해 60%의 추가 털뭉치 1발.`;
    }
    return CHARACTER_AUGMENTS.find(a => a.id === id)?.desc || '';
  }

  function treasureSkillStats(id, level) {
    const lv = Math.max(1, level || 1);
    if (id === 'magicMissile') return { interval:Math.max(2500,5000-(lv-1)*350), count:3+Math.floor((lv-1)/2), damageMult:0.8+lv*0.12 };
    if (id === 'shrinkRay') return { stepScale:Math.max(0.84,0.90-(lv-1)*0.01), minScale:Math.max(0.44,0.66-lv*0.04), contactDamageMult:Math.max(0.65,0.85-(lv-1)*0.04), duration:Math.min(6000,3000+(lv-1)*500) };
    if (id === 'juiceBox') return { healPct:Math.min(0.07,0.05+Math.min(2,lv-1)*0.005+Math.max(0,lv-3)*0.0025), repeatFactor:Math.min(0.50,0.35+(lv-1)*0.03), comboWindow:220 };
    if (id === 'veil') return { interval:Math.max(18000,30000-(lv-1)*1800), maxCharges:1+Math.floor((lv-1)/3) };
    if (id === 'sword') return { interval:Math.max(1700,3000-(lv-1)*180), damageMult:1.7+lv*0.18 };
    if (id === 'hellConductor') return { interval:Math.max(2600,4500-(lv-1)*250), count:8+Math.min(4,lv-1), radius:105+lv*4, damageMult:1.25+lv*0.16 };
    if (id === 'bulletBarrage') return { interval:Math.max(2400,4000-(lv-1)*220), count:5, damageMult:0.45+lv*0.05 };
    return {};
  }

  function treasureSkillDescription(id, level) {
    const lv=Math.max(1,level||1), st=treasureSkillStats(id,lv);
    if(id==='magicMissile')return `Lv.${lv}: ${Math.round(st.interval/100)/10}초마다 ${st.count}발 · 1발 피해 ${Math.round(st.damageMult*100)}%.`;
    if(id==='shrinkRay')return `Lv.${lv}: 최소 크기 ${Math.round(st.minScale*100)}% · 접촉 피해 ${Math.round((1-st.contactDamageMult)*100)}% 감소 · ${Math.round(st.duration/100)/10}초 유지.`;
    if(id==='juiceBox')return `Lv.${lv}: 첫 적중 최대 HP ${Math.round(st.healPct*1000)/10}% 회복 · 연속 다발탄은 ${Math.round(st.repeatFactor*100)}% 효율로 추가 회복.`;
    if(id==='veil')return `Lv.${lv}: 약 ${Math.round(st.interval/100)/10}초마다 장막 생성 · 최대 ${st.maxCharges}개 저장.`;
    if(id==='sword')return `Lv.${lv}: 약 ${Math.round(st.interval/100)/10}초마다 위·아래 베기 · 피해 ${Math.round(st.damageMult*100)}%.`;
    if(id==='hellConductor')return `Lv.${lv}: 약 ${Math.round(st.interval/100)/10}초마다 불기둥 ${st.count}개 · 피해 ${Math.round(st.damageMult*100)}%.`;
    if(id==='bulletBarrage')return `Lv.${lv}: 약 ${Math.round(st.interval/100)/10}초마다 ${st.count}연사 · 1발 피해 ${Math.round(st.damageMult*100)}%.`;
    return SKILLS.find(s=>s.id===id)?.desc||'';
  }

  let audioCtx = null;
  let bgmIndex = 0;
  let bgmVolume = Number(localStorage.getItem('petSurvivorsBgm') || 0.22);
  let sfxVolume = Number(localStorage.getItem('petSurvivorsSfx') || 0.72);
  const bgmTracks = [
    new Audio('/audio/01_Paws_Against_The_Horde.mp3'),
    new Audio('/audio/02_Victory_Pose.mp3'),
    new Audio('/audio/03_Thousand_Blade_Ascent.mp3')
  ];
  bgmTracks.forEach((track, i) => {
    track.preload = 'auto';
    track.loop = false;
    track.volume = bgmVolume;
    track.addEventListener('ended', () => {
      if (bgmTracks[bgmIndex] !== track) return;
      bgmIndex = (i + 1) % bgmTracks.length;
      playCurrentBgm();
    });
  });

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx?.state === 'suspended') audioCtx.resume();
  }

  function playCurrentBgm(reset = false) {
    if (!bgmTracks.length) return;
    bgmTracks.forEach((t, i) => { if (i !== bgmIndex) t.pause(); });
    const t = bgmTracks[bgmIndex];
    t.volume = bgmVolume;
    if (reset) t.currentTime = 0;
    t.play().catch(() => {});
  }

  function startBgmPlaylist() {
    ensureAudio();
    bgmTracks.forEach(t => { t.pause(); t.currentTime = 0; });
    bgmIndex = 0;
    playCurrentBgm(true);
  }

  function stopBgm() {
    bgmTracks.forEach(t => { t.pause(); t.currentTime = 0; });
    bgmIndex = 0;
  }

  function tone(freq, dur = 0.06, type = 'square', vol = 0.08, endFreq = null) {
    if (!audioCtx || sfxVolume <= 0) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * sfxVolume), t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function noise(dur = 0.07, vol = 0.08, cutoff = 700) {
    if (!audioCtx || sfxVolume <= 0) return;
    const len = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = cutoff;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol * sfxVolume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    src.connect(filter).connect(gain).connect(audioCtx.destination);
    src.start();
  }

  function playShotSfx(kind) {
    ensureAudio();
    if (kind === 'bark') { tone(240, 0.07, 'square', 0.07, 170); tone(360, 0.045, 'triangle', 0.035, 260); }
    else if (kind === 'snot') { tone(120, 0.09, 'sine', 0.07, 82); noise(0.04, 0.035, 350); }
    else if (kind === 'pee') { noise(0.08, 0.04, 1200); tone(720, 0.05, 'triangle', 0.025, 520); }
    else { noise(0.06, 0.045, 700); tone(170, 0.06, 'triangle', 0.04, 115); }
  }

  function playHitSfx(strong = false) {
    ensureAudio();
    noise(strong ? 0.11 : 0.07, strong ? 0.09 : 0.055, strong ? 320 : 520);
    tone(strong ? 92 : 135, strong ? 0.12 : 0.075, 'square', strong ? 0.07 : 0.045, strong ? 50 : 82);
  }

  function playEnemyShotSfx(strong = false) {
    ensureAudio();
    tone(strong ? 105 : 170, strong ? 0.12 : 0.07, 'sawtooth', strong ? 0.055 : 0.025, strong ? 62 : 115);
  }

  function playPlayerHurtSfx() {
    ensureAudio();
    tone(330, 0.07, 'square', 0.075, 155);
    tone(175, 0.12, 'triangle', 0.06, 90);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  function colorHex(num) {
    return `#${num.toString(16).padStart(6, '0')}`;
  }

  function drawPreview(target, key) {
    if (!target) return;
    const cfg = PLAYER_SPRITES[key];
    const src = cfg?.src || '';
    if (target.tagName === 'IMG') {
      target.src = src;
      target.alt = CHARACTERS[key]?.name || '캐릭터';
      return;
    }
    // 구버전 canvas 마크업과도 호환하되 원본 비율을 절대 변형하지 않는다.
    if (typeof target.getContext !== 'function') return;
    const c = target.getContext('2d');
    if (!c) return;
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, target.width, target.height);
    const img = new Image();
    img.onload = () => {
      c.imageSmoothingEnabled = false;
      c.clearRect(0, 0, target.width, target.height);
      const maxW = target.width - 8, maxH = target.height - 8;
      const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
      const w = Math.max(1, Math.floor(img.naturalWidth * ratio));
      const h = Math.max(1, Math.floor(img.naturalHeight * ratio));
      c.drawImage(img, Math.floor((target.width-w)/2), Math.floor(target.height-h-2), w, h);
    };
    img.src = src;
  }

  function updateSelectedCharacterUI(key) {
    const data = CHARACTERS[key] || CHARACTERS.jjigae;
    const canvas = document.querySelector('#selected-char-preview');
    drawPreview(canvas, key);
    const pairs = [
      ['#selected-char-name', data.name],
      ['#selected-char-role', data.role || '반려동물 생존자'],
      ['#selected-char-weapon', `${data.species} · ${data.weapon}`],
      ['#selected-passive-name', data.passive?.name || '-'],
      ['#selected-passive-desc', data.passive?.desc || '']
    ];
    pairs.forEach(([selector,value]) => { const el=document.querySelector(selector); if(el) el.textContent=value; });
  }

  function choiceTypeFor(kind, id, exclusive=false) {
    if (exclusive) return 'exclusive';
    if (kind === 'major') return 'major';
    if (kind === 'chest') return 'treasure';
    if (kind === 'minor') return 'special';
    if (id === 'health') return 'survival';
    if (id === 'xpGain') return 'growth';
    if (id === 'speed') return 'mobility';
    if (id === 'attackSpeed' || id === 'damage') return 'offense';
    return 'projectile';
  }

  function choiceTagFor(kind, exclusive=false) {
    if (exclusive) return '캐릭터 전용';
    if (kind === 'major') return '전투 증강';
    if (kind === 'chest') return '보물상자';
    if (kind === 'minor') return '특별 증강';
    return '기본 강화';
  }

  function choiceSummaryFor(kind, id, desc='') {
    const map = {
      damage:'모든 공격 피해 +7%', speed:'이동속도 +3.5%', health:'최대 HP +14 · 즉시 회복', xpGain:'경험치 획득 +12%', attackSpeed:'기본 공격속도 +4%',
      goodDeal:'기본 투사체 +1', hunterInstinct:'공속 +14% · 공격력 +7%', sniffer:'보석 흡입범위 +75px', ironStomach:'HP·회복·피해감소 동시 강화', zoomies:'이속 +12% · 공속 +6%',
      vocalBurst:'소리탄 충격파 확률 추가', stickySnot:'콧물탄 적중 시 둔화', highPressurePee:'오줌빔 관통·탄속 강화', sheddingSeason:'추가 털뭉치 발사 확률',
      poopOrbit:'주변 회전 공격체 +1', discThrow:'강한 원반 자동 투척', barkRoar:'주기적 주변 광역 폭격', yellowGas:'이동 경로에 지속피해 가스', yawnWave:'전방 광역 둔화 파동', territoryMark:'피해 증폭 장판 생성', squeakyToy:'무작위 적에게 고화력 낙하 공격',
      magicMissile:'추적 미사일 자동 발사', shrinkRay:'적 축소 + 접촉피해 약화', juiceBox:'기본탄 적중 시 HP 회복', veil:'주기적으로 1회 방어', sword:'위·아래 자동 베기', hellConductor:'주변 불기둥 광역 공격', bulletBarrage:'한 적에게 5연사 집중 공격'
    };
    return map[id] || String(desc).split(/[.。]/)[0] || '빌드를 강화한다';
  }

  function choiceCardMarkup(option, kind) {
    const exclusive=!!option.exclusive;
    const type=choiceTypeFor(kind, option.id, exclusive);
    const tag=choiceTagFor(kind, exclusive);
    const summary=choiceSummaryFor(kind, option.id, option.desc);
    const lv=Number.isFinite(option.level)
      ? `<span class="level">${exclusive?'전용 · ':''}현재 Lv.${option.level} → Lv.${option.level+1}</span>`
      : '';
    return { type, html:`<div class="choice-top"><span class="icon">${option.icon||'✦'}</span><span class="choice-tag">${tag}</span></div><b>${option.title}</b><p class="choice-summary">${summary}</p><p class="choice-detail">${option.desc||''}</p>${lv}` };
  }

  function decorateChoiceButton(button, option, kind) {
    const card=choiceCardMarkup(option,kind);
    button.dataset.type=card.type;
    button.dataset.rarity=option.exclusive?'exclusive':kind;
    button.className='choice-card'+(kind==='major'?' major-choice':'')+(option.exclusive?' exclusive-choice':'');
    button.innerHTML=card.html;
  }

  function showBossWarningUi(name, subtitle='탄막 패턴을 주의하세요!') {
    const root=document.querySelector('#boss-warning-ui');
    if(!root)return;
    const title=document.querySelector('#boss-warning-title');
    const boss=document.querySelector('#boss-warning-name');
    const sub=document.querySelector('#boss-warning-sub');
    if(title)title.textContent='위험 음식 출현!';
    if(boss)boss.textContent=name||'TRUE BOSS';
    if(sub)sub.textContent=subtitle||'';
    root.classList.remove('show');
    void root.offsetWidth;
    root.classList.add('show');
    root.setAttribute('aria-hidden','false');
    setTimeout(()=>{root.classList.remove('show');root.setAttribute('aria-hidden','true');},1450);
  }

  document.querySelectorAll('.char-card').forEach(card => {
    const key = card.dataset.char;
    drawPreview(card.querySelector('.char-thumb, canvas'), key);
    card.addEventListener('click', () => {
      selectedCharacter = key;
      document.querySelectorAll('.char-card').forEach(x => x.classList.toggle('selected', x === card));
      updateSelectedCharacterUI(key);
      card.animate?.([{transform:'translateY(-2px) scale(1)'},{transform:'translateY(-2px) scale(1.025)'},{transform:'translateY(-2px) scale(1)'}],{duration:180,easing:'ease-out'});
      if (socket && coop.room && !coop.room.started) socket.emit('coopCharacter', { character:key });
    });
  });
  updateSelectedCharacterUI(selectedCharacter);


  function setCoopStatus(message, bad=false) {
    const el=document.querySelector('#coop-status'); if(!el)return;
    el.textContent=message; el.style.color=bad?'#ff9c92':'#aaa1ae';
  }
  function renderCoopRoom(room) {
    coop.room=room;
    const panel=document.querySelector('#coop-room-panel');
    if(!room){panel?.classList.add('hidden');return;}
    coop.isHost=room.hostId===coop.myId;
    panel?.classList.remove('hidden');
    const code=document.querySelector('#coop-room-code'); if(code)code.textContent=room.code;
    const list=document.querySelector('#coop-player-list');
    if(list) list.innerHTML=room.players.map(p=>{
      const c=CHARACTERS[p.character]||CHARACTERS.jjigae;
      const cls=['coop-player',p.id===coop.myId?'me':'',p.id===room.hostId?'host':''].filter(Boolean).join(' ');
      return `<div class="${cls}">P${p.slot} · ${c.name}${p.id===coop.myId?' · 나':''}</div>`;
    }).join('');
    const start=document.querySelector('#coop-start-btn');
    if(start)start.classList.toggle('hidden',!(coop.isHost&&room.players.length===2&&!room.started));
    setCoopStatus(room.players.length<2?'친구가 들어오길 기다리는 중…':'2명 준비 완료. 방장이 시작하면 돼.');
  }
  if(socket){
    socket.on('connect',()=>{coop.myId=socket.id;});
    socket.on('coopRoom',room=>{coop.myId=socket.id;renderCoopRoom(room);});
    socket.on('coopHostChanged',data=>{if(coop.room){coop.room.hostId=data.hostId;renderCoopRoom(coop.room);}setCoopStatus('방장이 바뀌었어.');});
    socket.on('coopPartnerLeft',()=>{setCoopStatus('상대가 방을 나갔어.',true);activeScene?.handleCoopPartnerLeft?.();});
    socket.on('coopRemoteInput',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='host')activeScene.setRemoteInput?.(payload.id,payload.input||{});});
    socket.on('coopSnapshot',snapshot=>{if(activeScene?.coopMode&&activeScene.networkRole==='guest')activeScene.applyNetworkSnapshot?.(snapshot);});
    socket.on('coopChoicePrompt',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='guest')activeScene.showGuestChoicePrompt?.(payload||{});});
    socket.on('coopChoicePick',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='host')activeScene.handleCoopChoicePick?.(payload?.playerId,payload?.choiceId,payload?.kind);});
    socket.on('coopChoiceState',payload=>{
      if(!activeScene?.coopMode||activeScene.networkRole!=='guest')return;
      if(payload?.open)activeScene.showCoopWait?.(payload.title||'상대 플레이어 선택 중',payload.text||'잠시 기다려줘.');
      else activeScene.hideCoopWait?.();
    });
    socket.on('coopChoiceResume',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='guest'){activeScene.closeGuestChoiceUi?.();if(payload?.levelUp)activeScene.playLevelUpFx?.();}});
    socket.on('coopPauseRequest',()=>{if(activeScene?.coopMode&&activeScene.networkRole==='host')activeScene.toggleCoopPauseFromRequest?.();});
    socket.on('coopPauseState',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='guest')activeScene.applyRemotePauseState?.(payload||{});});
    socket.on('coopGameOver',payload=>{if(activeScene?.coopMode&&activeScene.networkRole==='guest')activeScene.showRemoteGameOver?.(payload||{});});
    socket.on('coopReturnedLobby',room=>{
      coop.active=false; renderCoopRoom(room);
      document.querySelector('#coop-wait-screen')?.classList.remove('show');
      document.querySelector('#game-shell')?.classList.remove('game-running');
      document.querySelector('#combat-hud')?.setAttribute('aria-hidden','true');
      document.querySelector('#start-screen')?.classList.add('show');
      if(game?.scene?.isActive('SurvivorScene')||game?.scene?.isPaused('SurvivorScene'))game.scene.stop('SurvivorScene');
      stopBgm();
    });
    socket.on('coopStarted',room=>{
      coop.room=room; coop.active=true; coop.myId=socket.id; coop.isHost=room.hostId===socket.id;
      const mine=room.players.find(p=>p.id===socket.id); if(mine)selectedCharacter=mine.character;
      startGame({coop:true,networkRole:coop.isHost?'host':'guest',players:room.players,localId:socket.id,roomCode:room.code});
    });
  }
  document.querySelector('#coop-create-btn')?.addEventListener('click',()=>{
    if(!socket)return setCoopStatus('온라인 연결 기능을 사용할 수 없어.',true);
    ensureAudio(); socket.emit('coopCreate',{character:selectedCharacter},res=>{if(!res?.ok)return setCoopStatus(res?.error||'방 만들기 실패',true);coop.myId=res.myId||socket.id;renderCoopRoom(res.room);});
  });
  document.querySelector('#coop-join-btn')?.addEventListener('click',()=>{
    if(!socket)return setCoopStatus('온라인 연결 기능을 사용할 수 없어.',true);
    const code=(document.querySelector('#coop-code-input')?.value||'').trim().toUpperCase();
    if(code.length!==5)return setCoopStatus('방 코드 5자리를 입력해줘.',true);
    ensureAudio(); socket.emit('coopJoin',{code,character:selectedCharacter},res=>{if(!res?.ok)return setCoopStatus(res?.error||'방 입장 실패',true);coop.myId=res.myId||socket.id;renderCoopRoom(res.room);});
  });
  document.querySelector('#coop-copy-btn')?.addEventListener('click',async()=>{
    if(!coop.room?.code)return; try{await navigator.clipboard.writeText(coop.room.code);setCoopStatus(`방 코드 ${coop.room.code} 복사됨.`);}catch{setCoopStatus(`방 코드: ${coop.room.code}`);}
  });
  document.querySelector('#coop-start-btn')?.addEventListener('click',()=>socket?.emit('coopStart',{},res=>{if(!res?.ok)setCoopStatus(res?.error||'게임 시작 실패',true);}));
  document.querySelector('#coop-leave-btn')?.addEventListener('click',()=>{socket?.emit('coopLeave');coop.room=null;coop.active=false;renderCoopRoom(null);setCoopStatus('방에서 나왔어.');});

  class SurvivorScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SurvivorScene', active: false });
      this.worldSize = 6000;
      this.runTimeMs = 0;
      this.isGameOver = false;
      this.isChoiceOpen = false;
      this.manualPause = false;
    }

    init(data) {
      this.coopMode = !!data.coop;
      this.networkRole = data.networkRole || 'solo';
      this.localId = data.localId || null;
      this.roomCode = data.roomCode || null;
      this.coopPlayers = Array.isArray(data.players) ? data.players : [];
      this.localPlayerInfo = this.coopPlayers.find(p => p.id === this.localId) || null;
      this.remotePlayerInfo = this.coopPlayers.find(p => p.id !== this.localId) || null;
      this.characterKey = this.localPlayerInfo?.character || data.character || 'jjigae';
      this.remoteCharacterKey = this.remotePlayerInfo?.character || 'mandu';
      this.remoteInput = blankMoveInput();
      this.snapshotTimer = 0;
      this.guestSendTimer = 0;
      this.lastSentInputKey = '';
      this.lastInputSendAt = 0;
      this.hudUpdateTimer = 0;
      this.netEnemyMap = new Map(); this.netProjectileMap = new Map(); this.netEnemyBulletMap = new Map(); this.netGemMap = new Map(); this.netItemMap = new Map(); this.netExtraMap = new Map();
      this.charData = CHARACTERS[this.characterKey];
      this.remoteCharData = CHARACTERS[this.remoteCharacterKey] || CHARACTERS.mandu;
      this.runTimeMs = 0;
      this.isGameOver = false;
      this.isChoiceOpen = false;
      this.manualPause = false;
      this.kills = 0;
      this.level = 1;
      this.xp = 0;
      this.xpNeed = 2;
      const startStats = characterStartStats(this.characterKey);
      this.attackPower = startStats.attackPower;
      this.moveSpeed = startStats.moveSpeed;
      this.maxHp = startStats.maxHp;
      this.levelUpgradeCounts = { damage:0, speed:0, health:0, xpGain:0, attackSpeed:0 };
      this.hp = startStats.hp;
      this.xpGainMult = 1;
      this.basicCooldown = 1500;
      this.extraBasicShots = 0;
      this.basicPierce = 0;
      this.basicExplosion = 0;
      this.basicRicochet = 0;
      this.basicSizeMult = 1;
      this.basicDamageMult = startStats.basicDamageMult;
      this.basicProjectileScale = startStats.basicProjectileScale;
      this.shockwaveLevel = 0;
      this.shockwaveTimer = 0;
      this.majorLevels = {};
      this.majorTimers = { poopOrbit:0, discThrow:0, barkRoar:0, yellowGas:0, yawnWave:0, territoryMark:0, squeakyToy:0 };
      this.poopOrbiters = [];
      this.gasClouds = [];
      this.territoryZones = [];
      this.discDirectionIndex = 0;
      this.facingAngle = 0;
      this.gemMagnetRange = 135;
      this.playerDamageMult = 1;
      this.augments = [];
      this.characterAugmentLevels = {};
      this.pendingAugmentType = null;
      this.basicTimer = 350;
      this.zombieTimer = 0;
      this.batTimer = 0;
      this.eliteTimer = 0;
      this.event180Done = false;
      this.nextPressureEventAt = 480;
      this.nextBossAt = 300;
      this.regularBossCount = 0;
      this.lastRegularBossSpawnAt = -999999;
      this.lastTrueBossEndedAt = -999999;
      this.nextRaidWave = 35;
      this.pendingTrueBoss = null;
      this.trueBossFinishWindowMs = 24000;
      this.trueBossMinBossGapMs = 60000;
      this.raidPendingSeq = 0;
      this.lastNetRaidPendingSeq = 0;
      this.raidBossActive = false;
      this.raidBossTransition = false;
      this.raidBossCount = 0;
      this.raidBossName = '';
      this.raidShotPhase = 0;
      this.raidIntroSeq = 0;
      this.raidPhaseSeq = 0;
      this.lastNetRaidIntroSeq = 0;
      this.lastNetRaidPhaseSeq = 0;
      this.raidTelegraphs = [];
      this.pendingCleanupProgression = false;
      this.magnetUntil = 0;
      this.playerInvulnUntil = 0;
      this.shieldCharges = 0;
      this.juiceComboUntil = 0;
      this.juiceComboHits = 0;
      this.reviveProgress = 0;
      this.reviveNeedMs = 4800;
      this.deathCount = 0;
      this.skillLevels = {};
      this.skillTimers = {
        magicMissile: 0,
        veil: 0,
        sword: 0,
        hellConductor: 0,
        bulletBarrage: 0
      };
    }

    preload() {
      Object.entries(PLAYER_SPRITES).forEach(([key, data]) => {
        this.load.image(`player_${key}`, data.src);
      });
    }

    create() {
      activeScene = this;
      this.createTextures();
      Object.keys(PLAYER_SPRITES).forEach(key=>{
        const tex=this.textures.get(`player_${key}`);
        tex?.setFilter?.(Phaser.Textures.FilterMode.NEAREST);
      });
      this.createWorld();
      this.createGroups();
      this.createPlayer();
      if (this.coopMode) this.setupCoopBuilds();
      this.createInput();
      this.createHud();
      this.createPhysics();
      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.cameras.main.setZoom(1);
      this.cameras.main.setRoundPixels(true);
      this.cameras.main.fadeIn(300, 14, 12, 17);
      this.showBanner(`${this.charData.name} 출격!`, this.charData.weapon);
      this.time.delayedCall(120, () => {
        if (this.isGameOver) return;
        if (this.coopMode) {
          if (this.networkRole === 'host') this.beginCoopChoice('minor');
        } else {
          this.openMilestoneAugment();
        }
      });
    }

    createTextures() {
      const create = (key, w, h, drawFn) => {
        if (this.textures.exists(key)) return;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        drawFn(g);
        g.generateTexture(key, w, h);
        g.destroy();
      };

      create('grassTile', 256, 256, g => {
        // 큰 반복 주기를 가진 저대비 잔디. 64px 체크 패턴이 보이지 않도록 256px 한 장 안에 분산한다.
        g.fillStyle(0x63a86b, 1); g.fillRect(0, 0, 256, 256);
        const tones=[0x5b9f64,0x6caf72,0x73b579,0x579760];
        for(let i=0;i<72;i++){
          const x=(17+i*73+(i%5)*11)%250, y=(29+i*131+(i%7)*9)%250;
          g.fillStyle(tones[i%tones.length], i%4===0?0.34:0.22);
          if(i%3===0){g.fillRect(x,y,2,5);g.fillRect(x+2,y+2,2,3);}
          else g.fillRect(x,y,3,2);
        }
        g.fillStyle(0x78b97d,0.16);
        for(let i=0;i<22;i++){const x=(41+i*97)%248,y=(13+i*61)%248;g.fillRect(x,y,5,3);}
      });
      create('dirtPatch', 48, 32, g => {
        g.fillStyle(0xb78b54, 1); g.fillRect(4, 4, 40, 24);
        g.fillStyle(0xc59c64, 1); g.fillRect(9, 2, 27, 28);
        g.fillStyle(0x9f7447, 1); g.fillRect(12, 20, 6, 3); g.fillRect(31, 8, 5, 4);
      });
      create('rock', 18, 14, g => {
        g.fillStyle(0x5e6d68, 1); g.fillRect(2, 5, 14, 7);
        g.fillStyle(0x7b8983, 1); g.fillRect(5, 2, 8, 7);
        g.fillStyle(0x3e4d49, 1); g.fillRect(4, 10, 10, 3);
      });
      create('flower', 12, 12, g => {
        g.fillStyle(0x3c824d, 1); g.fillRect(5, 5, 2, 6);
        g.fillStyle(0xf1df67, 1); g.fillRect(4, 2, 4, 4);
        g.fillStyle(0xf4f0bd, 1); g.fillRect(2, 4, 3, 3); g.fillRect(7, 4, 3, 3);
      });

      create('grassPatchLight', 96, 72, g => {
        g.fillStyle(0x77b879,0.22);
        [[8,12,28,16],[35,8,34,20],[62,24,26,18],[18,36,40,22],[55,46,30,16]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
        g.fillStyle(0x8ac589,0.18);[[18,18],[49,14],[70,34],[31,50]].forEach(([x,y])=>g.fillRect(x,y,12,8));
      });
      create('grassPatchDark', 96, 72, g => {
        g.fillStyle(0x3f8651,0.18);
        [[7,16,34,18],[38,8,28,16],[58,30,30,20],[17,42,44,18]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
        g.fillStyle(0x347647,0.12);[[20,18],[48,42],[70,22]].forEach(([x,y])=>g.fillRect(x,y,14,9));
      });
      create('parkPond', 220, 144, g => {
        const edge=0x355f56,water=0x529393,light=0x72ada8;
        g.fillStyle(edge,0.72);g.fillRect(38,10,144,124);g.fillRect(20,28,180,88);g.fillRect(12,48,196,48);
        g.fillStyle(water,0.90);g.fillRect(44,18,132,108);g.fillRect(26,34,168,76);g.fillRect(20,52,180,40);
        g.fillStyle(light,0.58);g.fillRect(56,31,64,4);g.fillRect(126,45,40,3);g.fillRect(74,77,86,4);g.fillRect(42,99,52,3);
        g.fillStyle(0x4d8a59,0.62);g.fillRect(17,57,10,8);g.fillRect(193,76,10,9);g.fillRect(145,122,13,8);
        g.fillStyle(0xe4cf73,0.72);g.fillRect(20,56,4,4);g.fillRect(196,78,4,4);
      });
      create('parkTree', 48, 64, g => {
        g.fillStyle(0x2f4433,0.82);g.fillRect(19,33,11,27);
        g.fillStyle(0x6a4b32,0.92);g.fillRect(22,34,6,23);g.fillStyle(0x382f2c,0.55);g.fillRect(22,49,6,5);
        g.fillStyle(0x315f40,0.94);g.fillRect(8,13,32,29);g.fillRect(14,7,22,35);g.fillRect(5,22,38,14);
        g.fillStyle(0x4f8653,0.94);g.fillRect(12,11,20,12);g.fillRect(9,24,17,12);g.fillStyle(0x6ba168,0.62);g.fillRect(17,10,10,6);g.fillRect(28,24,7,7);
      });
      create('parkBench', 48, 26, g => {
        g.fillStyle(0x352d2b,0.92);g.fillRect(5,7,38,6);g.fillRect(8,15,32,6);g.fillRect(9,20,5,5);g.fillRect(34,20,5,5);
        g.fillStyle(0x76553d,0.96);g.fillRect(7,6,34,4);g.fillRect(9,14,30,4);g.fillStyle(0x9b7350,0.58);g.fillRect(10,6,12,2);g.fillRect(12,14,9,2);
      });
      create('parkLamp', 18, 48, g => {
        g.fillStyle(0x302f34,0.96);g.fillRect(7,12,5,31);g.fillRect(4,42,11,4);g.fillRect(3,4,13,10);
        g.fillStyle(0x5c5551,0.92);g.fillRect(8,14,3,27);g.fillStyle(0xe9d77c,0.82);g.fillRect(5,6,9,6);g.fillStyle(0xffedaa,0.52);g.fillRect(7,7,5,3);
      });
      create('parkSign', 36, 38, g => {
        g.fillStyle(0x3a302b,0.92);g.fillRect(15,19,6,18);g.fillRect(2,3,32,21);
        g.fillStyle(0xb69668,0.96);g.fillRect(4,5,28,17);g.fillStyle(0xd8c493,0.74);g.fillRect(6,7,24,3);
        g.fillStyle(0x4d8359,0.82);g.fillRect(8,13,7,5);g.fillRect(20,12,7,6);
      });
      create('parkFence', 48, 18, g => {
        g.fillStyle(0x514b43,0.55);g.fillRect(0,7,48,4);g.fillRect(0,14,48,3);
        g.fillStyle(0xc8b58e,0.76);g.fillRect(0,6,48,3);g.fillRect(0,13,48,2);for(let x=5;x<48;x+=12){g.fillRect(x,2,4,15);g.fillRect(x+1,1,2,2);}
      });
      create('flowerBed', 108, 58, g => {
        g.fillStyle(0x315f3d,0.44);g.fillRect(7,11,94,36);g.fillStyle(0x47794c,0.30);g.fillRect(3,17,102,24);
        const colors=[0xe6ca69,0xdc91a7,0xe8e0cf,0x9fbad5];for(let i=0;i<18;i++){const x=11+(i*19)%86,y=14+((i*17)%27);g.fillStyle(colors[i%colors.length],0.78);g.fillRect(x,y,3,3);g.fillStyle(0x356d45,0.72);g.fillRect(x+1,y+3,1,4);}
      });
      create('dogParkSet', 120, 72, g => {
        g.fillStyle(0x3e7148,0.16);g.fillRect(8,13,104,50);
        g.fillStyle(0x51463a,0.82);g.fillRect(17,40,33,6);g.fillRect(19,26,5,20);g.fillRect(43,26,5,20);
        g.fillStyle(0xc99a55,0.84);g.fillRect(19,39,29,4);g.fillStyle(0x486775,0.85);g.fillRect(70,24,8,34);g.fillRect(94,24,8,34);g.fillRect(76,29,20,5);
        g.fillStyle(0x879fac,0.60);g.fillRect(77,30,18,2);g.fillStyle(0xc86f68,0.76);g.fillRect(78,49,17,5);
      });
      create('playerFxStar', 8, 8, g => {g.fillStyle(0xffe88a,1);g.fillRect(3,0,2,8);g.fillRect(0,3,8,2);g.fillStyle(0xffffff,1);g.fillRect(3,3,2,2);});
      create('playerFxHeal', 10, 10, g => {g.fillStyle(0x89e5a4,1);g.fillRect(4,1,2,8);g.fillRect(1,4,8,2);g.fillStyle(0xe6ffe8,1);g.fillRect(4,4,2,2);});

      Object.keys(CHARACTERS).forEach(key => create(`player_${key}`, 32, 32, g => this.drawPetTexture(g, key)));

      create('enemy_grape', 30, 30, g => {
        g.fillStyle(0x6f4aa0,1); [[8,7],[14,6],[11,12],[17,11],[8,16],[14,17],[18,16],[12,22]].forEach(([x,y])=>g.fillCircle(x,y,4));
        g.fillStyle(0x4b8b47,1); g.fillRect(13,2,3,5); g.fillRect(16,2,5,3);
        g.fillStyle(0x17141a,1); g.fillRect(9,13,2,3); g.fillRect(17,13,2,3);
      });
      create('enemy_greenGrape', 30, 30, g => {
        g.fillStyle(0x9bc85b,1); [[8,7],[14,6],[11,12],[17,11],[8,16],[14,17],[18,16],[12,22]].forEach(([x,y])=>g.fillCircle(x,y,4));
        g.fillStyle(0x4b8b47,1); g.fillRect(13,2,3,5); g.fillRect(16,2,5,3);
        g.fillStyle(0x17141a,1); g.fillRect(9,13,2,3); g.fillRect(17,13,2,3);
      });
      create('enemy_raisin', 24, 24, g => {
        g.fillStyle(0x493248,1); g.fillRect(4,6,16,13); g.fillRect(6,3,11,18); g.fillStyle(0x6b4a68,1); g.fillRect(6,7,4,3); g.fillRect(13,13,4,3);
        g.fillStyle(0x151318,1); g.fillRect(7,10,2,3); g.fillRect(14,10,2,3);
      });
      create('enemy_shineMuscat', 32, 32, g => {
        g.fillStyle(0xb7df69,1); [[8,7],[15,6],[11,13],[18,12],[8,18],[15,19],[20,18],[13,25]].forEach(([x,y])=>g.fillCircle(x,y,5));
        g.fillStyle(0x58a553,1); g.fillRect(14,1,3,6); g.fillRect(17,2,7,3); g.fillStyle(0x17141a,1); g.fillRect(10,14,2,3); g.fillRect(19,14,2,3);
      });
      create('enemy_chocolate', 30, 30, g => {
        g.fillStyle(0x6a3d2d,1); g.fillRect(5,4,20,22); g.fillStyle(0x9b5d3d,1);
        for(let yy=7;yy<23;yy+=7) for(let xx=8;xx<22;xx+=7) g.fillRect(xx,yy,5,5);
        g.fillStyle(0x17141a,1); g.fillRect(9,11,2,3); g.fillRect(18,11,2,3); g.fillRect(12,18,6,2);
      });
      create('enemy_coffee', 30, 30, g => {
        g.fillStyle(0xf1e1c9,1); g.fillRect(5,9,17,14); g.fillStyle(0x8a5138,1); g.fillRect(7,11,13,8); g.fillStyle(0xf1e1c9,1); g.fillRect(22,12,5,8); g.fillRect(24,14,3,4);
        g.fillStyle(0x9b9b9b,1); g.fillRect(9,3,2,5); g.fillRect(15,2,2,6); g.fillStyle(0x17141a,1); g.fillRect(9,14,2,3); g.fillRect(16,14,2,3);
      });
      create('enemy_greenTea', 30, 30, g => {
        g.fillStyle(0xe8e0c8,1); g.fillRect(5,9,17,14); g.fillStyle(0x6fa65f,1); g.fillRect(7,11,13,8); g.fillStyle(0xe8e0c8,1); g.fillRect(22,12,5,8); g.fillRect(24,14,3,4);
        g.fillStyle(0x6b8f5b,1); g.fillRect(10,3,2,6); g.fillRect(16,3,2,6); g.fillStyle(0x17141a,1); g.fillRect(9,14,2,3); g.fillRect(16,14,2,3);
      });
      create('enemy_onion', 30, 30, g => {
        g.fillStyle(0xe7d7c6,1); g.fillCircle(15,17,10); g.fillStyle(0xb58ca9,1); g.fillRect(8,14,14,3); g.fillRect(10,20,10,3); g.fillStyle(0x7d9950,1); g.fillRect(13,3,4,6); g.fillRect(10,5,3,4);
        g.fillStyle(0x17141a,1); g.fillRect(10,15,2,3); g.fillRect(18,15,2,3);
      });
      create('enemy_garlic', 30, 30, g => {
        g.fillStyle(0xf1ead9,1); g.fillCircle(15,17,10); g.fillCircle(9,18,6); g.fillCircle(21,18,6); g.fillStyle(0xcbbd9f,1); g.fillRect(13,3,4,7);
        g.fillStyle(0x17141a,1); g.fillRect(10,15,2,3); g.fillRect(18,15,2,3);
      });
      create('enemy_scallion', 24, 34, g => {
        g.fillStyle(0xf4f0d9,1); g.fillRect(8,19,8,12); g.fillStyle(0x58a84f,1); g.fillRect(7,5,4,17); g.fillRect(13,2,4,20); g.fillRect(10,8,4,14);
        g.fillStyle(0x17141a,1); g.fillRect(9,22,2,3); g.fillRect(14,22,2,3);
      });
      create('enemy_chive', 24, 34, g => {
        g.fillStyle(0x3d8e47,1); g.fillRect(5,6,3,24); g.fillRect(9,2,3,28); g.fillRect(13,5,3,25); g.fillRect(17,1,3,29); g.fillStyle(0x7ec568,1); g.fillRect(7,24,11,6);
        g.fillStyle(0x17141a,1); g.fillRect(9,25,2,3); g.fillRect(15,25,2,3);
      });
      create('enemy_gum', 30, 24, g => {
        g.fillStyle(0xf38bb2,1); g.fillRect(5,5,20,14); g.fillStyle(0xffc1d7,1); g.fillRect(8,7,14,10); g.fillStyle(0xd65f8d,1); g.fillRect(2,8,5,8); g.fillRect(23,8,5,8);
        g.fillStyle(0x17141a,1); g.fillRect(10,10,2,3); g.fillRect(18,10,2,3);
      });
      create('enemy_candy', 30, 24, g => {
        g.fillStyle(0xe95568,1); g.fillRect(8,5,14,14); g.fillStyle(0xffd35f,1); g.fillRect(11,7,8,10); g.fillStyle(0xf6a6b4,1); g.fillTriangle(1,12,8,6,8,18); g.fillTriangle(29,12,22,6,22,18);
        g.fillStyle(0x17141a,1); g.fillRect(11,10,2,3); g.fillRect(17,10,2,3);
      });
      create('enemy_alcohol', 26, 34, g => {
        g.fillStyle(0x8e6b3d,1); g.fillRect(8,8,10,23); g.fillRect(10,3,6,7); g.fillStyle(0xe6d3a2,1); g.fillRect(9,15,8,8); g.fillStyle(0x6d91bb,1); g.fillRect(10,17,6,4);
        g.fillStyle(0x17141a,1); g.fillRect(10,12,2,3); g.fillRect(15,12,2,3);
      });
      create('enemy_nuts', 30, 30, g => {
        g.fillStyle(0x9b6c42,1); g.fillEllipse(15,16,20,24); g.fillStyle(0xc28a56,1); g.fillRect(9,8,12,3); g.fillRect(8,15,14,3); g.fillRect(10,22,10,3);
        g.fillStyle(0x17141a,1); g.fillRect(10,12,2,3); g.fillRect(18,12,2,3);
      });
      create('enemy_boss', 48, 48, g => {
        g.fillStyle(0x4b2c24,1); g.fillRect(6,5,36,38); g.fillStyle(0x7c4934,1);
        for(let yy=10;yy<36;yy+=10) for(let xx=11;xx<35;xx+=10) g.fillRect(xx,yy,8,8);
        g.fillStyle(0xf0c85d,1); g.fillRect(4,3,40,5); g.fillRect(4,40,40,5);
        g.fillStyle(0x17141a,1); g.fillRect(13,18,5,6); g.fillRect(30,18,5,6); g.fillRect(17,31,15,4);
      });

      create('enemy_raid_grape', 72, 72, g => {
        g.fillStyle(0x3a1f45,1); [[18,15],[31,12],[45,16],[24,28],[38,27],[51,31],[18,42],[32,44],[46,46],[31,57]].forEach(([x,y])=>g.fillCircle(x,y,11));
        g.fillStyle(0x8751a8,1); [[17,14],[31,11],[45,15],[24,27],[38,26],[51,30],[18,41],[32,43],[46,45],[31,56]].forEach(([x,y])=>g.fillCircle(x,y,7));
        g.fillStyle(0x5ba34b,1); g.fillRect(31,1,7,13); g.fillRect(38,4,15,6);
        g.fillStyle(0xff5d5d,1); g.fillRect(20,30,6,5); g.fillRect(45,31,6,5); g.fillStyle(0x17141a,1); g.fillRect(22,31,2,3); g.fillRect(47,32,2,3);
        g.fillStyle(0xd8b4e8,1); g.fillRect(27,47,18,5); g.fillStyle(0x17141a,1); g.fillRect(30,49,3,4); g.fillRect(39,49,3,4);
      });
      create('enemy_raid_choco', 72, 72, g => {
        g.fillStyle(0x3d211d,1); g.fillRect(10,8,52,56); g.fillStyle(0x7b4430,1);
        for(let yy=14;yy<58;yy+=14) for(let xx=16;xx<56;xx+=14) g.fillRect(xx,yy,10,10);
        g.fillStyle(0xd0473d,1); g.fillRect(15,23,10,7); g.fillRect(47,23,10,7); g.fillStyle(0x17141a,1); g.fillRect(18,25,4,3); g.fillRect(50,25,4,3);
        g.fillStyle(0xffbf58,1); g.fillRect(7,5,58,5); g.fillRect(7,61,58,5); g.fillStyle(0x17141a,1); g.fillRect(24,45,24,5); g.fillRect(28,50,4,7); g.fillRect(40,50,4,7);
      });
      create('enemy_raid_onion', 72, 72, g => {
        g.fillStyle(0xe6d6c7,1); g.fillEllipse(36,40,50,48); g.fillStyle(0xb889a5,1); g.lineStyle(5,0xa66c92,1); g.strokeEllipse(36,40,39,37); g.strokeEllipse(36,40,24,24);
        g.fillStyle(0x6fae63,1); g.fillTriangle(27,18,34,2,38,20); g.fillTriangle(35,18,45,1,43,21);
        g.fillStyle(0xff5f61,1); g.fillRect(20,34,8,6); g.fillRect(44,34,8,6); g.fillStyle(0x17141a,1); g.fillRect(23,36,3,3); g.fillRect(47,36,3,3);
        g.fillStyle(0x6c334f,1); g.fillRect(27,49,18,6); g.fillStyle(0xffffff,1); g.fillRect(30,49,3,4); g.fillRect(39,49,3,4);
      });
      create('eliteFace', 36, 36, g => {
        g.fillStyle(0xff4545,1); g.fillRect(8,12,5,4); g.fillRect(23,12,5,4);
        g.fillStyle(0x17141a,1); g.fillRect(10,13,2,2); g.fillRect(24,13,2,2);
        g.fillStyle(0xf1e4d2,1); g.fillTriangle(12,24,16,18,18,25); g.fillTriangle(19,25,22,18,25,24);
        g.fillStyle(0x7c2345,1); g.fillRect(15,25,7,5); g.fillStyle(0xb4d8d2,1); g.fillRect(22,27,3,6);
      });
      create('enemyBullet', 12, 12, g => {
        g.fillStyle(0x1a0c12,1); g.fillCircle(6,6,5); g.fillStyle(0xf0445e,1); g.fillCircle(6,6,4); g.fillStyle(0xfff2cf,1); g.fillCircle(6,6,2);
      });
      create('bossBullet', 16, 16, g => {
        g.fillStyle(0x160d22,1); g.fillCircle(8,8,7); g.fillStyle(0xb13fe5,1); g.fillCircle(8,8,5); g.fillStyle(0xffffff,1); g.fillCircle(8,8,2);
      });
      create('raidBullet', 18, 18, g => {
        g.fillStyle(0x21090a,1); g.fillCircle(9,9,8); g.fillStyle(0xff3d33,1); g.fillCircle(9,9,6); g.fillStyle(0xffdf51,1); g.fillCircle(9,9,4); g.fillStyle(0xffffff,1); g.fillCircle(9,9,2);
      });
      create('shockwave', 56, 56, g => {
        g.lineStyle(5,0xffefb2,0.95); g.strokeCircle(28,28,22); g.lineStyle(2,0x87e7ff,0.9); g.strokeCircle(28,28,27);
      });

      create('poopOrbit', 18, 18, g => {
        g.fillStyle(0x6f4728,1); g.fillCircle(9,12,5); g.fillCircle(8,8,4); g.fillCircle(10,5,3);
        g.fillStyle(0xa06b39,1); g.fillRect(7,5,3,2);
      });
      create('disc', 20, 20, g => {
        g.fillStyle(0xf2d56d,1); g.fillCircle(10,10,9); g.fillStyle(0xc96f55,1); g.fillCircle(10,10,5); g.fillStyle(0xfff1b2,1); g.fillCircle(8,7,2);
      });
      create('squeakyToy', 24, 30, g => {
        g.fillStyle(0xf17bb0,1); g.fillCircle(12,11,8); g.fillStyle(0xffd465,1); g.fillRect(8,18,8,8); g.fillStyle(0xffffff,1); g.fillCircle(9,9,2); g.fillCircle(15,9,2); g.fillStyle(0x332432,1); g.fillCircle(9,9,1); g.fillCircle(15,9,1);
      });

      create('xpGem', 12, 14, g => {
        g.fillStyle(0x1c6d60, 1); g.fillRect(4, 1, 4, 2);
        g.fillStyle(0x43d5b4, 1); g.fillRect(2, 3, 8, 7);
        g.fillStyle(0x91f0d7, 1); g.fillRect(4, 3, 3, 5);
        g.fillStyle(0x177b6c, 1); g.fillRect(4, 10, 4, 3);
      });
      create('magnetItem', 20, 20, g => {
        g.fillStyle(0xd9d7d1, 1); g.fillRect(3, 3, 5, 12); g.fillRect(12, 3, 5, 12);
        g.fillStyle(0xe55b4f, 1); g.fillRect(3, 3, 5, 5); g.fillRect(12, 3, 5, 5);
        g.fillStyle(0x343039, 1); g.fillRect(6, 13, 8, 4);
      });
      create('treasureChest', 28, 22, g => {
        g.fillStyle(0x4f2f25, 1); g.fillRect(2, 8, 24, 12);
        g.fillStyle(0x9a5b33, 1); g.fillRect(3, 4, 22, 8);
        g.fillStyle(0xf0ca5f, 1); g.fillRect(3, 10, 22, 3); g.fillRect(12, 8, 4, 9);
        g.fillStyle(0x2c1b19, 1); g.fillRect(13, 10, 2, 3);
      });
      create('snackItem', 22, 16, g => {
        g.fillStyle(0x2b1d1a,1); g.fillRect(3,5,16,7);
        g.fillStyle(0xd59a57,1); g.fillRect(4,4,14,8); g.fillRect(1,5,5,6); g.fillRect(16,5,5,6);
        g.fillStyle(0xf0c77a,1); g.fillRect(6,6,10,4); g.fillStyle(0xffedb2,1); g.fillRect(8,6,3,2);
      });
      create('rushWarning', 220, 14, g => {
        g.fillStyle(0x3a0a0d,0.28); g.fillRect(0,3,220,8);
        g.fillStyle(0xff3d33,0.62); g.fillRect(0,5,202,4);
        g.fillStyle(0xffdf51,0.9); g.fillTriangle(202,1,220,7,202,13);
      });

      create('proj_bark', 22, 14, g => {
        g.lineStyle(3, 0xf8f0d5, 1); g.strokeCircle(8, 7, 5); g.lineStyle(2, 0xe7c96e, 1); g.strokeCircle(14, 7, 5);
      });
      create('proj_snot', 16, 12, g => {
        g.fillStyle(0x72cf75, 1); g.fillRect(3, 3, 10, 7); g.fillStyle(0xb1ee9c, 1); g.fillRect(5, 2, 5, 4); g.fillStyle(0x419e59, 1); g.fillRect(9, 7, 4, 3);
      });
      create('proj_pee', 28, 6, g => {
        g.fillStyle(0xffdc43, 1); g.fillRect(1, 2, 26, 2); g.fillStyle(0xfff18a, 1); g.fillRect(5, 1, 18, 1);
      });
      create('proj_hairball', 14, 14, g => {
        g.fillStyle(0x72645b, 1); g.fillRect(3, 2, 8, 10); g.fillStyle(0x94877d, 1); g.fillRect(1, 5, 12, 5); g.fillStyle(0x4f4642, 1); g.fillRect(4, 4, 3, 3);
      });
      create('magicMissile', 12, 12, g => {
        g.fillStyle(0x7be3f3, 1); g.fillRect(5, 0, 2, 12); g.fillRect(0, 5, 12, 2);
        g.fillStyle(0xffffff, 1); g.fillRect(4, 4, 4, 4);
      });
      create('bullet', 8, 4, g => { g.fillStyle(0xf7e6a5, 1); g.fillRect(0, 1, 7, 2); });
      create('firePillar', 18, 36, g => {
        g.fillStyle(0xe34f32, 1); g.fillRect(5, 12, 9, 22);
        g.fillStyle(0xff9f3d, 1); g.fillRect(3, 17, 13, 14);
        g.fillStyle(0xffdf70, 1); g.fillRect(7, 5, 5, 22); g.fillRect(9, 1, 3, 6);
      });
      create('slash', 20, 68, g => {
        g.fillStyle(0xffffff, 0.9); g.fillRect(8, 0, 4, 68);
        g.fillStyle(0x91dff5, 0.8); g.fillRect(4, 8, 4, 50);
        g.fillStyle(0xd9f5ff, 0.8); g.fillRect(12, 12, 3, 42);
      });
    }

    drawPetTexture(g, key) {
      const p = CHARACTERS[key];
      const main = p.main, dark = p.dark, light = p.light;
      if (key === 'gucci') {
        g.fillStyle(light, 1); g.fillRect(8, 6, 16, 14); g.fillRect(6, 18, 20, 10);
        g.fillStyle(dark, 1); g.fillRect(8, 2, 5, 6); g.fillRect(20, 2, 5, 6); g.fillRect(14, 6, 7, 5); g.fillRect(20, 18, 6, 5); g.fillRect(6, 21, 5, 4);
        g.fillRect(2, 21, 6, 3); g.fillRect(0, 23, 4, 3);
      } else if (key === 'mandu') {
        g.fillStyle(main, 1); g.fillRect(8, 6, 16, 14); g.fillRect(6, 18, 20, 10);
        g.fillRect(7, 2, 6, 6); g.fillRect(12, 1, 8, 7); g.fillRect(19, 2, 6, 6);
        g.fillRect(4, 8, 5, 10); g.fillRect(23, 8, 5, 10);
      } else if (key === 'gamja') {
        g.fillStyle(main, 1); g.fillRect(8, 6, 16, 14); g.fillRect(7, 18, 18, 9);
        g.fillRect(7, 2, 6, 6); g.fillRect(12, 1, 8, 7); g.fillRect(19, 2, 6, 6);
        g.fillRect(4, 9, 5, 9); g.fillRect(23, 9, 5, 9);
      } else {
        g.fillStyle(main, 1); g.fillRect(8, 6, 16, 14); g.fillRect(6, 18, 20, 10);
        g.fillStyle(dark, 1); g.fillRect(4, 8, 5, 11); g.fillRect(23, 8, 5, 11);
        g.fillStyle(main, 1); g.fillRect(23, 12, 5, 5); g.fillRect(2, 21, 5, 4);
      }
      g.fillStyle(0x17141a, 1); g.fillRect(11, 11, 3, 4); g.fillRect(19, 11, 3, 4); g.fillRect(15, 16, 3, 3);
      g.fillStyle(main, 1); g.fillRect(9, 27, 5, 4); g.fillRect(20, 27, 5, 4);
    }

    createWorld() {
      const W = this.worldSize;
      this.physics.world.setBounds(0, 0, W, W);
      this.cameras.main.setBounds(0, 0, W, W);
      this.worldDecorCount=0;
      const addDecor=(key,x,y,depth=-17,scale=1,alpha=1,rotation=0)=>{
        const obj=this.add.image(Math.round(x),Math.round(y),key).setDepth(depth).setScale(scale).setAlpha(alpha).setRotation(rotation);
        this.worldDecorCount+=1;
        return obj;
      };
      this.add.tileSprite(W / 2, W / 2, W, W, 'grassTile').setDepth(-24).setScrollFactor(1);

      const rand = new Phaser.Math.RandomDataGenerator(['pet-survivors-park-v161']);
      const pathRand = new Phaser.Math.RandomDataGenerator(['pet-survivors-park-v161-path']);
      const snap4=v=>Math.round(v/4)*4;

      // v1.16의 반복 직사각형 길 대신 하나의 연속된 픽셀 리본을 그린다.
      // 물리/충돌 객체가 아니며 Graphics 1개만 사용한다.
      const ground=this.add.graphics().setDepth(-22);
      const drawHorizontalPath=(outerHalf=43,innerHalf=34)=>{
        const samples=[];
        for(let x=300;x<=W-300;x+=64){
          const y=snap4(3000+Math.sin(x/650)*108+Math.sin(x/245)*16);
          const edgeJitter=snap4(pathRand.between(-5,5));
          samples.push({x:snap4(x),y,edgeJitter});
        }
        const polygon=(half,extra=0)=>[
          ...samples.map(p=>new Phaser.Geom.Point(p.x,snap4(p.y-half-p.edgeJitter-extra))),
          ...samples.slice().reverse().map(p=>new Phaser.Geom.Point(p.x,snap4(p.y+half+p.edgeJitter+extra)))
        ];
        ground.fillStyle(0x806b53,0.66);ground.fillPoints(polygon(outerHalf,3),true);
        ground.fillStyle(0xaa916f,0.79);ground.fillPoints(polygon(innerHalf,0),true);
        ground.fillStyle(0xc0a781,0.14);
        for(let i=1;i<samples.length-1;i+=3){const p=samples[i];ground.fillRect(p.x-11,p.y-15+(i%4)*9,22,3);}
        ground.fillStyle(0x5d9f65,0.55);
        for(let i=2;i<samples.length-2;i+=5){const p=samples[i];ground.fillRect(p.x-5,p.y-outerHalf-2,8,5);ground.fillRect(p.x+6,p.y+outerHalf-3,6,5);}
      };
      const drawVerticalPath=(outerHalf=42,innerHalf=33)=>{
        const samples=[];
        for(let y=360;y<=W-360;y+=64){
          const x=snap4(3000+Math.sin(y/720+1.15)*84+Math.sin(y/270)*13);
          const edgeJitter=snap4(pathRand.between(-5,5));
          samples.push({x,y:snap4(y),edgeJitter});
        }
        const polygon=(half,extra=0)=>[
          ...samples.map(p=>new Phaser.Geom.Point(snap4(p.x-half-p.edgeJitter-extra),p.y)),
          ...samples.slice().reverse().map(p=>new Phaser.Geom.Point(snap4(p.x+half+p.edgeJitter+extra),p.y))
        ];
        ground.fillStyle(0x806b53,0.66);ground.fillPoints(polygon(outerHalf,3),true);
        ground.fillStyle(0xaa916f,0.79);ground.fillPoints(polygon(innerHalf,0),true);
        ground.fillStyle(0xc0a781,0.14);
        for(let i=1;i<samples.length-1;i+=3){const p=samples[i];ground.fillRect(p.x-15+(i%4)*9,p.y-11,3,22);}
        ground.fillStyle(0x5d9f65,0.55);
        for(let i=2;i<samples.length-2;i+=5){const p=samples[i];ground.fillRect(p.x-outerHalf-2,p.y-5,5,8);ground.fillRect(p.x+outerHalf-3,p.y+6,5,6);}
      };
      drawHorizontalPath();
      drawVerticalPath();

      // 중앙 광장은 작고 낮은 대비의 팔각형으로 바꾸고 발바닥 문양만 넣는다.
      const cx=3000,cy=3000;
      const oct=(rx,ry)=>[[-rx,-Math.round(ry*.55)],[-Math.round(rx*.58),-ry],[Math.round(rx*.58),-ry],[rx,-Math.round(ry*.55)],[rx,Math.round(ry*.55)],[Math.round(rx*.58),ry],[-Math.round(rx*.58),ry],[-rx,Math.round(ry*.55)]].map(([x,y])=>new Phaser.Geom.Point(cx+x,cy+y));
      ground.fillStyle(0x796650,0.66);ground.fillPoints(oct(88,68),true);
      ground.fillStyle(0xa48d6d,0.80);ground.fillPoints(oct(78,58),true);
      ground.fillStyle(0xb8a07c,0.16);ground.fillRect(cx-34,cy-2,68,4);ground.fillRect(cx-2,cy-26,4,52);
      ground.fillStyle(0x806d55,0.28);
      ground.fillRect(cx-10,cy+4,20,12);ground.fillRect(cx-20,cy-14,7,7);ground.fillRect(cx-8,cy-20,7,7);ground.fillRect(cx+6,cy-19,7,7);ground.fillRect(cx+17,cy-12,7,7);

      // 넓은 잔디 톤 변화는 저밀도, 저대비로만 사용한다.
      for(let i=0;i<52;i++){
        addDecor(i%4===0?'grassPatchDark':'grassPatchLight',rand.between(100,W-100),rand.between(100,W-100),-23,rand.realInRange(1.0,1.8),rand.realInRange(0.34,0.58),rand.realInRange(-0.12,0.12));
      }

      // 고정 랜드마크. 수보다 공간 구분과 아트 통일을 우선한다.
      addDecor('parkPond',1550,1550,-20,1.14,0.84);
      addDecor('flowerBed',4440,1435,-19,1.34,0.78);
      addDecor('flowerBed',4310,1530,-19,1.05,0.72);
      addDecor('dogParkSet',4460,4340,-19,1.34,0.76);
      addDecor('parkSign',4335,4248,-17,1.0,0.80);
      addDecor('parkSign',1685,1655,-17,0.95,0.78);

      // 휴식 포인트는 짝을 맞춰 배치하고 무작위처럼 흩뿌리지 않는다.
      [[1380,4350,0],[1650,4430,0],[2815,2830,0],[3185,3170,Math.PI],[1450,1830,0],[4290,1710,0]].forEach(([x,y,r])=>addDecor('parkBench',x,y,-17,1.0,0.78,r));
      [[1285,4270],[1730,4510],[3180,2820],[2820,3180],[1745,1450],[4680,1325]].forEach(([x,y])=>addDecor('parkLamp',x,y,-17,0.96,0.74));

      // 놀이터의 울타리도 장식일 뿐 실제 충돌은 없다.
      [[4210,4175,0],[4370,4175,0],[4530,4175,0],[4690,4175,0],
       [4210,4510,0],[4370,4510,0],[4530,4510,0],[4690,4510,0],
       [4150,4260,Math.PI/2],[4150,4420,Math.PI/2],[4750,4260,Math.PI/2],[4750,4420,Math.PI/2]].forEach(([x,y,r])=>addDecor('parkFence',x,y,-18,1.0,0.62,r));

      const treeClusters=[[1320,1290],[1820,1320],[1260,1780],[1830,1790],[4200,1220],[4760,1260],[4180,1740],[4780,1700],[1190,4140],[1850,4700],[4110,4700],[4860,4660]];
      treeClusters.forEach(([tx,ty],idx)=>{
        for(let j=0;j<2;j++){const a=(idx*.61+j*2.4);addDecor('parkTree',tx+Math.cos(a)*(34+j*24),ty+Math.sin(a)*(31+j*21),-16,rand.realInRange(0.92,1.08),0.78);}
      });

      // 소형 디테일은 150개로 제한. 큰 흙 패치는 드물게, 꽃/돌 위주로 사용한다.
      for(let i=0;i<150;i++){
        const x=rand.between(70,W-70),y=rand.between(70,W-70),r=rand.frac();
        if(r<0.18)addDecor('dirtPatch',x,y,-19,rand.realInRange(0.45,0.78),rand.realInRange(0.28,0.48));
        else if(r<0.46)addDecor('rock',x,y,-17,rand.realInRange(0.58,0.88),0.58);
        else addDecor('flower',x,y,-17,rand.realInRange(0.66,0.92),0.72);
      }
    }

    createGroups() {
      this.enemies = this.physics.add.group({ allowGravity: false });
      this.projectiles = this.physics.add.group({ allowGravity: false });
      this.enemyProjectiles = this.physics.add.group({ allowGravity: false });
      this.gems = this.physics.add.group({ allowGravity: false });
      this.items = this.physics.add.group({ allowGravity: false });
      this.skillHitboxes = this.physics.add.group({ allowGravity: false });
    }

    createPlayer() {
      const center = this.worldSize / 2;
      const localX = this.coopMode ? center - 34 : center;
      const spriteCfg = PLAYER_SPRITES[this.characterKey] || { worldScale: 1, shadow:{w:26,h:7,oy:14}, hitbox: { w: 14, h: 14, ox: 10, oy: 12 } };
      this.player = this.physics.add.sprite(localX, center, `player_${this.characterKey}`);
      this.player.setScale(spriteCfg.worldScale ?? 1).setDepth(10).setCollideWorldBounds(true);
      const hb = spriteCfg.hitbox || { w: 14, h: 14, ox: 10, oy: 12 };
      this.player.body.setSize(hb.w, hb.h).setOffset(hb.ox, hb.oy);
      this.player.setDrag(900, 900); this.player.setMaxVelocity(420, 420); this.player.netPlayerId = this.localId || 'solo';
      const sh=spriteCfg.shadow||{w:26,h:7,oy:14};
      this.shadow = this.add.ellipse(localX, center + sh.oy, sh.w, sh.h, 0x0b120d, 0.16).setDepth(4);
      this.localMarker=this.add.ellipse(localX,center+sh.oy-1,sh.w+5,sh.h+4,0xffe58b,0.02).setDepth(5).setStrokeStyle(1,0xffe58b,0.38);
      this.localGuard=this.add.ellipse(localX,center,43,28,0x8ff0bc,0.025).setDepth(7).setStrokeStyle(2,0xb7ffd3,0.72).setVisible(false);
      this.localNameTag=this.coopMode?this.add.text(localX,center-31,`나 · ${this.charData.name}`,{fontFamily:'monospace',fontSize:'9px',fontStyle:'bold',color:'#fff1b0',stroke:'#162018',strokeThickness:3}).setOrigin(0.5).setDepth(13):null;
      if (this.coopMode && this.remotePlayerInfo) {
        const remoteCfg = PLAYER_SPRITES[this.remoteCharacterKey] || spriteCfg;
        this.ally = this.physics.add.sprite(center + 34, center, `player_${this.remoteCharacterKey}`);
        this.ally.setScale(remoteCfg.worldScale ?? 1).setDepth(10).setCollideWorldBounds(true);
        const ahb = remoteCfg.hitbox || hb;
        this.ally.body.setSize(ahb.w, ahb.h).setOffset(ahb.ox, ahb.oy);
        this.ally.setDrag(900,900); this.ally.setMaxVelocity(420,420); this.ally.netPlayerId = this.remotePlayerInfo.id;
        const ash=remoteCfg.shadow||{w:26,h:7,oy:14};
        this.allyShadow = this.add.ellipse(center + 34, center + ash.oy, ash.w, ash.h, 0x0b120d, 0.16).setDepth(4);
        this.allyMarker=this.add.ellipse(center+34,center+ash.oy-1,ash.w+5,ash.h+4,0x82d8ad,0.02).setDepth(5).setStrokeStyle(1,0x82d8ad,0.36);
        this.allyGuard=this.add.ellipse(center+34,center,43,28,0x8ff0bc,0.025).setDepth(7).setStrokeStyle(2,0xb7ffd3,0.72).setVisible(false);
        this.allyNameTag=this.add.text(center+34,center-31,`P${this.remotePlayerInfo.slot||2} · ${this.remoteCharData.name}`,{fontFamily:'monospace',fontSize:'9px',fontStyle:'bold',color:'#bdebd3',stroke:'#162018',strokeThickness:3}).setOrigin(0.5).setDepth(13);
      }
    }

    makePlayerBuild(id, characterKey, sprite, shadow, marker=null, guard=null, nameTag=null) {
      const start=characterStartStats(characterKey);
      return {
        id, characterKey, charData:CHARACTERS[characterKey]||CHARACTERS.jjigae, sprite, shadow, marker, guard, nameTag,
        attackPower:start.attackPower, moveSpeed:start.moveSpeed, maxHp:start.maxHp, hp:start.hp,
        levelUpgradeCounts:{damage:0,speed:0,health:0,xpGain:0,attackSpeed:0}, xpGainMult:1, basicCooldown:1500,
        extraBasicShots:0,basicPierce:0,basicExplosion:0,basicRicochet:0,basicSizeMult:1,basicDamageMult:start.basicDamageMult,basicProjectileScale:start.basicProjectileScale,shockwaveLevel:0,shockwaveTimer:0,
        majorLevels:{},majorTimers:{poopOrbit:0,discThrow:0,barkRoar:0,yellowGas:0,yawnWave:0,territoryMark:0,squeakyToy:0},
        poopOrbiters:[],gasClouds:[],territoryZones:[],discDirectionIndex:0,facingAngle:0,gemMagnetRange:135,playerDamageMult:1,
        augments:[],characterAugmentLevels:{},basicTimer:350,playerInvulnUntil:0,shieldCharges:0,skillLevels:{},juiceComboUntil:0,juiceComboHits:0,
        skillTimers:{magicMissile:0,veil:0,sword:0,hellConductor:0,bulletBarrage:0},shieldVisual:null,down:false,reviveProgress:0,reviveNeedMs:4800,deathCount:0,reviveUi:null
      };
    }
    setupCoopBuilds() {
      this.builds=new Map();
      const local=this.makePlayerBuild(this.localId,this.characterKey,this.player,this.shadow,this.localMarker,this.localGuard,this.localNameTag);this.builds.set(local.id,local);
      if(this.remotePlayerInfo&&this.ally){const remote=this.makePlayerBuild(this.remotePlayerInfo.id,this.remoteCharacterKey,this.ally,this.allyShadow,this.allyMarker,this.allyGuard,this.allyNameTag);this.builds.set(remote.id,remote);}
      this.currentBuildId=this.localId;this.loadBuild(local);this.coopChoice=null;this.netIdCounter=1;
      if(this.networkRole==='guest')this.physics.world.pause();
    }
    saveBuild(build){if(!build)return;BUILD_KEYS.forEach(k=>build[k]=this[k]);build.characterKey=this.characterKey;build.charData=this.charData;build.sprite=this.player;build.shadow=this.shadow;build.down=!!this.playerDown;}
    loadBuild(build){if(!build)return;this.currentBuildId=build.id;this.characterKey=build.characterKey;this.charData=build.charData||CHARACTERS[build.characterKey];this.player=build.sprite;this.shadow=build.shadow;BUILD_KEYS.forEach(k=>this[k]=build[k]);this.playerDown=!!build.down;}
    withBuild(buildOrId,fn){if(!this.coopMode||!this.builds)return fn();const target=typeof buildOrId==='string'?this.builds.get(buildOrId):buildOrId;if(!target)return fn();const prev=this.builds.get(this.currentBuildId);if(prev)this.saveBuild(prev);this.loadBuild(target);let r;try{r=fn();}finally{this.saveBuild(target);if(prev&&prev!==target)this.loadBuild(prev);}return r;}
    getBuild(id){return this.builds?.get(id)||null;} getLocalBuild(){return this.getBuild(this.localId);} getRemoteBuild(){return this.remotePlayerInfo?this.getBuild(this.remotePlayerInfo.id):null;}

    updateBuildPresentation(build){
      if(!build?.sprite?.active)return;
      const x=build.sprite.x,y=build.sprite.y,down=!!build.down;
      const psh=PLAYER_SPRITES[build.characterKey]?.shadow||{oy:14};
      build.shadow?.setPosition?.(x,y+psh.oy)?.setAlpha?.(down?0.05:0.16);
      build.marker?.setPosition?.(x,y+psh.oy-1)?.setAlpha?.(down?0.05:0.34);
      build.nameTag?.setPosition?.(x,y-31)?.setAlpha?.(down?0.42:0.92);
      const inv=(build.playerInvulnUntil||0)>this.runTimeMs&&!down;
      build.guard?.setPosition?.(x,y)?.setVisible?.(inv)?.setAlpha?.(inv?(0.48+Math.sin(this.runTimeMs/80)*0.18):0);
    }
    updateSoloPresentation(){
      if(!this.player?.active)return;
      const psh=PLAYER_SPRITES[this.characterKey]?.shadow||{oy:14};
      this.shadow?.setPosition(this.player.x,this.player.y+psh.oy).setAlpha(this.playerDown?0.05:0.16);
      this.localMarker?.setPosition(this.player.x,this.player.y+psh.oy-1).setAlpha(this.playerDown?0.05:0.34);
      const inv=(this.playerInvulnUntil||0)>this.runTimeMs&&!this.playerDown;
      this.localGuard?.setPosition(this.player.x,this.player.y).setVisible(inv).setAlpha(inv?(0.48+Math.sin(this.runTimeMs/80)*0.18):0);
    }
    flashPlayerSprite(sprite=this.player){
      if(!sprite?.active||typeof sprite.setTintFill!=='function')return;
      sprite.setTintFill(0xffffff);
      this.time?.delayedCall?.(72,()=>{if(sprite?.active)sprite.clearTint?.();});
    }
    playHealFx(sprite=this.player){
      if(!sprite?.active||!this.add?.image)return;
      for(let i=0;i<3;i++){
        const fx=this.add.image(sprite.x+(i-1)*8,sprite.y-12-i*3,'playerFxHeal').setDepth(18).setScale(0.9+i*0.08).setAlpha(0.9);
        this.tweens?.add?.({targets:fx,y:fx.y-22-Math.abs(i-1)*4,alpha:0,scale:1.15,duration:520+i*70,ease:'Quad.easeOut',onComplete:()=>fx.destroy?.()});
      }
    }
    playLevelUpFx(){
      const targets=this.coopMode&&this.builds?[...this.builds.values()].filter(b=>!b.down&&b.sprite?.active).map(b=>b.sprite):[this.player].filter(Boolean);
      targets.forEach(sprite=>{
        const ring=this.add.ellipse(sprite.x,sprite.y,26,16,0xffe58b,0).setDepth(17).setStrokeStyle(2,0xffe58b,0.86);
        this.tweens?.add?.({targets:ring,scaleX:2.2,scaleY:2.2,alpha:0,duration:460,ease:'Quad.easeOut',onComplete:()=>ring.destroy?.()});
        for(let i=0;i<6;i++){
          const a=(Math.PI*2*i)/6;const fx=this.add.image(sprite.x,sprite.y-4,'playerFxStar').setDepth(18).setAlpha(0.9);
          this.tweens?.add?.({targets:fx,x:sprite.x+Math.cos(a)*30,y:sprite.y-4+Math.sin(a)*22,alpha:0,duration:420+i*24,ease:'Quad.easeOut',onComplete:()=>fx.destroy?.()});
        }
      });
    }
    buildSummary(b){return b?{id:b.id,characterKey:b.characterKey,hp:b.hp,maxHp:b.maxHp,down:!!b.down,attackPower:b.attackPower,moveSpeed:b.moveSpeed,basicCooldown:b.basicCooldown,extraBasicShots:b.extraBasicShots||0,basicDamageMult:b.basicDamageMult||1,xpGainMult:b.xpGainMult,gemMagnetRange:b.gemMagnetRange,playerDamageMult:b.playerDamageMult,levelUpgradeCounts:b.levelUpgradeCounts,augments:b.augments,characterAugmentLevels:b.characterAugmentLevels,majorLevels:b.majorLevels,skillLevels:b.skillLevels,shieldCharges:b.shieldCharges,reviveProgress:b.reviveProgress||0,reviveNeedMs:b.reviveNeedMs||4800,deathCount:b.deathCount||0,invulnLeft:Math.max(0,(b.playerInvulnUntil||0)-this.runTimeMs)}:null;}

    milestoneChoicesForBuild(build){
      const picks=shuffle(MILESTONE_AUGMENTS).slice(0,3).map(x=>({...x,exclusive:false}));
      const exclusive=characterAugmentFor(build?.characterKey||this.characterKey);
      if(exclusive && this.level>=5 && Math.random()<0.35){
        const current=build?.characterAugmentLevels?.[exclusive.id]||0;
        picks.push({...exclusive,desc:characterAugmentDescription(exclusive.id,current+1),exclusive:true,level:current});
      }
      return picks;
    }
    choiceOptions(kind, playerId){
      const b=this.getBuild(playerId);
      if(kind==='minor')return this.milestoneChoicesForBuild(b).map(x=>({id:x.id,icon:x.icon,title:x.title,desc:x.desc,level:x.exclusive?(x.level||0):null,exclusive:!!x.exclusive}));
      const list=kind==='base'?LEVEL_UPGRADES:kind==='major'?MAJOR_AUGMENTS:SKILLS;
      return shuffle(list).slice(0,3).map(x=>{
        const current=kind==='major'?(b?.majorLevels?.[x.id]||0):kind==='chest'?(b?.skillLevels?.[x.id]||0):null;
        const desc=kind==='chest'?treasureSkillDescription(x.id,(current||0)+1):x.desc;
        return {id:x.id,icon:x.icon,title:x.title,desc,level:current};
      });
    }
    showCoopWait(title='상대 플레이어 선택 대기 중',text='둘 다 선택하면 게임이 다시 시작돼.'){const w=document.querySelector('#coop-wait-screen'),t=document.querySelector('#coop-wait-title'),d=document.querySelector('#coop-wait-text');if(t)t.textContent=title;if(d)d.textContent=text;w?.classList.add('show');}
    hideCoopWait(){document.querySelector('#coop-wait-screen')?.classList.remove('show');}
    beginCoopChoice(kind,targetIds=null){
      if(!this.coopMode||this.networkRole!=='host'||this.isGameOver)return;
      const ids=targetIds||[...this.builds.keys()]; this.isChoiceOpen=true; this.scene.pause();
      const pending=new Set(ids),optionsById=new Map(); ids.forEach(id=>optionsById.set(id,this.choiceOptions(kind,id))); this.coopChoice={kind,pending,optionsById};
      const guestId=this.remotePlayerInfo?.id;if(guestId&&!pending.has(guestId))socket?.emit('coopChoiceState',{open:true,title:'상대 플레이어 선택 중',text:'상대가 보물상자 스킬을 고르고 있어.'});
      ids.forEach(id=>{const opts=optionsById.get(id)||[];if(id===this.localId)this.showLocalCoopChoice(kind,opts);else socket?.emit('coopChoicePrompt',{targetId:id,kind,level:this.level,options:opts,eyebrow:kind==='base'?'LEVEL UP!':kind==='minor'?(this.level===1?'START AUGMENT!':`LEVEL ${this.level} AUGMENT!`):kind==='major'?`LEVEL ${this.level} MAJOR AUGMENT!`:'TREASURE CHEST',title:kind==='base'?`Lv.${this.level} 내 강화 하나를 선택해`:kind==='minor'?(this.level===1?'시작 특별 증강 하나를 선택해':'내 특별 증강 하나를 선택해'):kind==='major'?'내 10레벨 전투 증강 하나를 선택해':'내 보물상자 스킬 하나를 선택해'});});
      if(!pending.has(this.localId))this.showCoopWait('상대 플레이어 선택 중','상대가 보물상자 스킬을 고르고 있어.');
    }
    showLocalCoopChoice(kind,options){
      const screen=document.querySelector(kind==='chest'?'#chest-screen':'#levelup-screen'),root=document.querySelector(kind==='chest'?'#chest-choices':'#levelup-choices');if(!screen||!root)return;this.hideCoopWait();
      if(kind!=='chest'){const e=document.querySelector('#levelup-eyebrow'),tt=document.querySelector('#levelup-title');if(e)e.textContent=kind==='base'?'LEVEL UP!':kind==='minor'?(this.level===1?'START AUGMENT!':`LEVEL ${this.level} AUGMENT!`):`LEVEL ${this.level} MAJOR AUGMENT!`;if(tt)tt.textContent=kind==='base'?`Lv.${this.level} 내 강화 하나를 선택해`:kind==='minor'?(this.level===1?'시작 특별 증강 하나를 선택해':'내 특별 증강 하나를 선택해'):'내 10레벨 전투 증강 하나를 선택해';}
      root.innerHTML='';options.forEach(o=>{const b=document.createElement('button');decorateChoiceButton(b,o,kind);b.onclick=()=>this.handleCoopChoicePick(this.localId,o.id,kind);root.appendChild(b);});screen.classList.add('show');
    }
    showGuestChoicePrompt(payload){
      if(this.networkRole!=='guest')return;this.isChoiceOpen=true;const kind=payload.kind||'base',screen=document.querySelector(kind==='chest'?'#chest-screen':'#levelup-screen'),root=document.querySelector(kind==='chest'?'#chest-choices':'#levelup-choices');this.hideCoopWait();if(kind!=='chest'){const e=document.querySelector('#levelup-eyebrow'),tt=document.querySelector('#levelup-title');if(e)e.textContent=payload.eyebrow||'LEVEL UP!';if(tt)tt.textContent=payload.title||'내 강화 하나를 선택해';}if(!screen||!root)return;root.innerHTML='';(payload.options||[]).forEach(o=>{const b=document.createElement('button');decorateChoiceButton(b,o,kind);b.onclick=()=>{socket?.emit('coopChoicePick',{choiceId:o.id,kind});screen.classList.remove('show');this.showCoopWait('상대 플레이어 선택 대기 중','내 선택 완료. 상대가 고르면 게임이 계속돼.');};root.appendChild(b);});screen.classList.add('show');
    }
    closeGuestChoiceUi(){this.isChoiceOpen=false;document.querySelector('#levelup-screen')?.classList.remove('show');document.querySelector('#chest-screen')?.classList.remove('show');this.hideCoopWait();}
    handleCoopChoicePick(playerId,choiceId,kind){
      if(!this.coopChoice||this.coopChoice.kind!==kind||!this.coopChoice.pending.has(playerId))return;const opts=this.coopChoice.optionsById.get(playerId)||[];if(!opts.some(o=>o.id===choiceId))return;const b=this.getBuild(playerId);if(!b)return;
      this.withBuild(b,()=>{if(kind==='base')this.applyLevelUpgrade(choiceId);else if(kind==='minor')this.applyMilestoneAugment(choiceId);else if(kind==='major')this.applyMajorAugment(choiceId);else this.acquireSkill(choiceId);});this.coopChoice.pending.delete(playerId);
      if(playerId===this.localId){document.querySelector(kind==='chest'?'#chest-screen':'#levelup-screen')?.classList.remove('show');if(this.coopChoice.pending.size)this.showCoopWait('상대 플레이어 선택 대기 중','내 선택 완료. 상대가 고르면 게임이 계속돼.');}
      if(this.coopChoice.pending.size===0)this.finishCoopChoiceStage(kind);
    }
    finishCoopChoiceStage(kind){this.hideCoopWait();document.querySelector('#levelup-screen')?.classList.remove('show');document.querySelector('#chest-screen')?.classList.remove('show');this.coopChoice=null;socket?.emit('coopChoiceState',{open:false});if(kind==='base'&&this.level%10===0)return this.beginCoopChoice('major');if(kind==='base'&&this.level%5===0)return this.beginCoopChoice('minor');this.isChoiceOpen=false;this.scene.resume();if(kind!=='chest')this.playLevelUpFx?.();socket?.emit('coopChoiceResume',{kind,levelUp:kind!=='chest'});this.checkLevelProgression();}
    renderPauseMenu() {
      const summary = document.querySelector('#pause-run-summary');
      const statGrid = document.querySelector('#pause-stat-grid');
      const basicRoot = document.querySelector('#pause-basic-upgrades');
      const specialRoot = document.querySelector('#pause-special-list');
      const majorRoot = document.querySelector('#pause-major-list');
      const skillRoot = document.querySelector('#pause-skill-list');
      if (!summary || !statGrid || !basicRoot) return;

      const sec = this.runTimeMs / 1000;
      const threat=this.getScaling?.()||{hp:1,speed:1,damage:1};
      summary.textContent = `${this.charData.weapon}
생존 ${formatTime(sec)} · WAVE ${this.getWave()} · Lv.${this.level} · 처치 ${this.kills}
위협도 HP×${threat.hp.toFixed(1)} · SPD×${threat.speed.toFixed(2)} · DMG×${threat.damage.toFixed(2)}`;
      const pauseName=document.querySelector('#pause-char-name');if(pauseName)pauseName.textContent=this.charData.name;
      const pausePassive=document.querySelector('#pause-char-passive');if(pausePassive)pausePassive.textContent=`${this.charData.passive?.name||'-'} · ${this.charData.passive?.desc||''}`;
      drawPreview(document.querySelector('#pause-char-preview'),this.characterKey);

      const shotsPerSec = 1000 / this.basicCooldown;
      const damageReduction = Math.max(0, (1 - this.playerDamageMult) * 100);
      const stats = [
        ['공격력', this.attackPower.toFixed(1)],
        ['이동속도', this.moveSpeed.toFixed(1)],
        ['공격속도', `${shotsPerSec.toFixed(2)}/초`],
        ['기본 투사체', `${1 + (this.extraBasicShots || 0)}발`],
        ['HP', `${Math.ceil(this.hp)} / ${Math.ceil(this.maxHp)}`],
        ['경험치 획득', `+${((this.xpGainMult - 1) * 100).toFixed(0)}%`],
        ['보석 흡입범위', `${Math.round(this.gemMagnetRange)}px`],
        ['피해 감소', `${damageReduction.toFixed(0)}%`]
      ];
      statGrid.innerHTML = stats.map(([k,v]) => `<div class="pause-stat"><small>${k}</small><b>${v}</b></div>`).join('');

      basicRoot.innerHTML = LEVEL_UPGRADES.map(u => {
        const count = this.levelUpgradeCounts?.[u.id] || 0;
        return `<span class="pause-chip">${u.icon} ${u.title} ×${count}</span>`;
      }).join('');

      const card=(title,detail)=>`<div class="pause-augment-item"><b>${title}</b><small>${detail}</small></div>`;
      const special=[];
      special.push(card(`🐾 ${this.charData.passive?.name||'고유 특성'}`,this.charData.passive?.desc||''));
      const counts=new Map();(this.augments||[]).forEach(name=>counts.set(name,(counts.get(name)||0)+1));
      counts.forEach((count,name)=>{const d=MILESTONE_AUGMENTS.find(a=>a.title===name);special.push(card(`${d?.icon||'✦'} ${name}${count>1?` ×${count}`:''}`,'특별 증강'));});
      CHARACTER_AUGMENTS.filter(a=>a.character===this.characterKey).forEach(a=>{const lv=this.characterAugmentLevels?.[a.id]||0;if(lv>0)special.push(card(`${a.icon} ${a.title} Lv.${lv}`,'캐릭터 전용 특별 증강'));});
      const majors=[];MAJOR_AUGMENTS.forEach(a=>{const lv=this.majorLevels?.[a.id]||0;if(lv>0)majors.push(card(`${a.icon} ${a.title} Lv.${lv}`,'10레벨 전투 증강'));});
      const skills=[];SKILLS.forEach(sk=>{const lv=this.skillLevels?.[sk.id]||0;if(lv>0)skills.push(card(`${sk.icon} ${sk.title} Lv.${lv}`,'보물상자 스킬'));});
      if(specialRoot)specialRoot.innerHTML=special.length?special.join(''):'<div class="pause-empty">아직 특별 증강이 없어.</div>';
      if(majorRoot)majorRoot.innerHTML=majors.length?majors.join(''):'<div class="pause-empty">아직 Lv.10 전투 증강이 없어.</div>';
      if(skillRoot)skillRoot.innerHTML=skills.length?skills.join(''):'<div class="pause-empty">아직 보물상자 스킬이 없어.</div>';
    }

    openManualPause() {
      if (this.isGameOver || this.isChoiceOpen || this.manualPause) return;
      if (this.coopMode && this.networkRole === 'guest') { socket?.emit('coopPauseRequest'); return; }
      this.manualPause = true;
      this.renderPauseMenu();
      document.querySelector('#pause-screen').classList.add('show');
      this.physics.world.pause();
      this.time.paused = true;
      if (this.coopMode && this.networkRole === 'host') socket?.emit('coopPauseState',{paused:true});
    }

    closeManualPause() {
      if (!this.manualPause) return;
      if (this.coopMode && this.networkRole === 'guest') { socket?.emit('coopPauseRequest'); return; }
      this.manualPause = false;
      document.querySelector('#pause-screen').classList.remove('show');
      this.time.paused = false;
      this.physics.world.resume();
      if (this.coopMode && this.networkRole === 'host') socket?.emit('coopPauseState',{paused:false});
    }
    toggleCoopPauseFromRequest(){if(!this.coopMode||this.networkRole!=='host'||this.isChoiceOpen)return;if(this.manualPause)this.closeManualPause();else this.openManualPause();}
    applyRemotePauseState(payload){if(this.networkRole!=='guest')return;this.manualPause=!!payload.paused;if(this.manualPause){this.renderPauseMenu();document.querySelector('#pause-screen')?.classList.add('show');}else document.querySelector('#pause-screen')?.classList.remove('show');}

    returnToLobby() {
      this.manualPause = false;
      document.querySelector('#pause-screen').classList.remove('show');
      document.querySelector('#levelup-screen').classList.remove('show');
      document.querySelector('#chest-screen').classList.remove('show');
      document.querySelector('#coop-wait-screen')?.classList.remove('show');
      this.time.paused = false; this.physics.world.resume(); stopBgm();
      if(this.coopMode){if(this.networkRole==='host')socket?.emit('coopBackLobby');else{socket?.emit('coopLeave');coop.room=null;coop.active=false;renderCoopRoom(null);}}
      this.scene.stop(); activeScene = null; document.querySelector('#game-shell')?.classList.remove('game-running'); document.querySelector('#combat-hud')?.setAttribute('aria-hidden','true'); document.querySelector('#start-screen').classList.add('show');
    }
    handleCoopPartnerLeft(){if(!this.coopMode)return;this.showBanner('파트너 연결 종료','로비로 돌아가 다시 방을 만들어줘.');this.time.delayedCall(500,()=>this.returnToLobby());}

    createInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC
      });
      this._escHandler = () => {
        if (this.isGameOver || this.isChoiceOpen) return;
        if (this.manualPause) this.closeManualPause();
        else this.openManualPause();
      };
      this.input.keyboard.on('keydown-ESC', this._escHandler);
      this.events.once('shutdown', () => {
        if (this._escHandler) this.input?.keyboard?.off('keydown-ESC', this._escHandler);
        if (this.builds) [...this.builds.values()].forEach(b => this.clearReviveUi?.(b));
        if (activeScene === this) activeScene = null;
        this.hudDom=null;
      });
      const resumeBtn = document.querySelector('#pause-resume-btn');
      const lobbyBtn = document.querySelector('#pause-lobby-btn');
      if (resumeBtn) resumeBtn.onclick = () => this.closeManualPause();
      if (lobbyBtn) lobbyBtn.onclick = () => this.returnToLobby();
    }

    createHud() {
      const cam=this.cameras.main;
      const fixed=obj=>obj.setScrollFactor(0).setDepth(1000);
      this.hudDom={
        root:document.querySelector('#combat-hud'),
        portrait:document.querySelector('#combat-player-portrait'),
        name:document.querySelector('#combat-player-name'),
        level:document.querySelector('#combat-player-level'),
        hpFill:document.querySelector('#combat-hp-fill'),hpText:document.querySelector('#combat-hp-text'),
        xpFill:document.querySelector('#combat-xp-fill'),xpText:document.querySelector('#combat-xp-text'),passive:document.querySelector('#combat-passive'),
        partner:document.querySelector('#combat-partner-hud'),partnerName:document.querySelector('#combat-partner-name'),partnerFill:document.querySelector('#combat-partner-hp-fill'),partnerText:document.querySelector('#combat-partner-hp-text'),
        time:document.querySelector('#combat-time'),wave:document.querySelector('#combat-wave'),kill:document.querySelector('#combat-kill'),pending:document.querySelector('#combat-pending'),
        boss:document.querySelector('#combat-boss-hud'),bossKind:document.querySelector('#combat-boss-kind'),bossName:document.querySelector('#combat-boss-name'),bossHpText:document.querySelector('#combat-boss-hp-text'),bossFill:document.querySelector('#combat-boss-fill'),
        buildSlots:document.querySelector('#combat-build-slots')
      };
      if(this.hudDom.root){this.hudDom.root.setAttribute('aria-hidden','false');}
      this.buildHudSignature='';
      // 움직이는 월드와 같은 Canvas에 고정 텍스트를 그리면 FIT 배율에서 번질 수 있어 HUD 텍스트는 DOM으로 분리한다.
      // Phaser에는 전투 배너만 남긴다.
      this.banner=fixed(this.add.text(Math.round(cam.width/2),112,'',{fontFamily:'monospace',fontSize:'21px',fontStyle:'bold',align:'center',color:'#fff2b6',stroke:'#201922',strokeThickness:5,resolution:2}).setOrigin(0.5));
      this.banner.setAlpha(0);
      this.updateHud();
    }

    getBuildHudItems(){
      const items=[];
      if(this.shieldCharges>0)items.push({icon:'◈',name:'감시의 장막',level:this.shieldCharges,kind:'shield'});
      const counts=new Map();(this.augments||[]).forEach(name=>counts.set(name,(counts.get(name)||0)+1));
      counts.forEach((count,name)=>{const d=MILESTONE_AUGMENTS.find(a=>a.title===name);items.push({icon:d?.icon||'✦',name,level:count,kind:'special'});});
      CHARACTER_AUGMENTS.filter(a=>a.character===this.characterKey).forEach(a=>{const lv=this.characterAugmentLevels?.[a.id]||0;if(lv>0)items.push({icon:a.icon,name:a.title,level:lv,kind:'exclusive'});});
      MAJOR_AUGMENTS.forEach(a=>{const lv=this.majorLevels?.[a.id]||0;if(lv>0)items.push({icon:a.icon,name:a.title,level:lv,kind:'major'});});
      SKILLS.forEach(sk=>{const lv=this.skillLevels?.[sk.id]||0;if(lv>0)items.push({icon:sk.icon,name:sk.title,level:lv,kind:'skill'});});
      return items;
    }
    refreshBuildHud(){
      const root=this.hudDom?.buildSlots;if(!root)return;
      const all=this.getBuildHudItems();
      const signature=all.map(x=>`${x.kind}:${x.name}:${x.level}`).join('|');
      if(signature===this.buildHudSignature)return;
      this.buildHudSignature=signature;
      const shown=all.slice(0,10),palette={shield:'#78b8d8',special:'#d2ad5b',exclusive:'#77d0a4',major:'#c58d5c',skill:'#8ebbcf'};
      if(!shown.length){root.innerHTML='<span class="combat-build-empty">아직 비어 있음</span>';return;}
      root.innerHTML=shown.map(it=>`<span class="combat-build-slot" style="--slot:${palette[it.kind]||'#756b79'}" data-tooltip="${it.name} · Lv.${it.level}" aria-label="${it.name} Lv.${it.level}"><span>${it.icon}</span><b>${it.level}</b></span>`).join('')+(all.length>shown.length?`<span class="combat-build-slot" style="--slot:#756b79" data-tooltip="추가 빌드 ${all.length-shown.length}개"><span>+${all.length-shown.length}</span></span>`:'');
    }

    createPhysics() {
      this.physics.add.overlap(this.projectiles, this.enemies, this.onProjectileHit, null, this);
      this.physics.add.overlap(this.skillHitboxes, this.enemies, this.onSkillHit, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemyContact, null, this);
      this.physics.add.overlap(this.player, this.enemyProjectiles, this.onEnemyProjectileHit, null, this);
      this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
      this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
      if(this.coopMode&&this.ally){
        this.physics.add.overlap(this.ally,this.enemies,this.onPlayerEnemyContact,null,this);
        this.physics.add.overlap(this.ally,this.enemyProjectiles,this.onEnemyProjectileHit,null,this);
        this.physics.add.overlap(this.ally,this.gems,this.collectGem,null,this);
        this.physics.add.overlap(this.ally,this.items,this.collectItem,null,this);
      }
    }

    showBanner(title, subtitle = '') {
      this.banner.setText(subtitle ? `${title}\n${subtitle}` : title).setAlpha(1).setScale(0.9);
      this.tweens.killTweensOf(this.banner);
      this.tweens.add({ targets: this.banner, alpha: 0, scale: 1.05, duration: 1800, ease: 'Quad.easeOut', delay: 500 });
    }

    getScaling() {
      const minutes = Math.max(0, this.runTimeMs / 60000);
      // 초반 0~3분의 체감은 기존과 비슷하게 유지하고, 후반 HP/속도는 컨트롤 가능한 선에서 완만하게 제한한다.
      const hp = Math.min(12, 1 + minutes * 0.298 + minutes * minutes * 0.0246);
      const speed = Math.min(1.42, 1 + minutes * 0.028);
      // 0~3분은 기존 접촉 피해를 그대로 두고, 그 이후에만 완만하게 오른다.
      const damage = Math.min(1.40, 1 + Math.max(0, minutes - 3) * 0.025);
      return { minutes, hp, speed, damage, tier:Math.floor(minutes / 5) };
    }

    getBossEscalation(index = Math.max(1, this.regularBossCount || 1)) {
      const bossIndex=Math.max(1,index),k=bossIndex-1;
      return {
        bossIndex,
        hp:1 + k * 0.48,
        damage:1 + k * 0.08,
        speed:1 + Math.min(0.18,k * 0.035),
        shotInterval:Math.max(0.68,1 - k * 0.075),
        shotSpeed:1 + Math.min(0.25,k * 0.045),
        fanBonus:Math.min(4,k),
        ringBonus:Math.min(6,k * 2)
      };
    }

    getWave() {
      return Math.floor(this.runTimeMs / 10000) + 1;
    }

    getSpawnPhase() {
      const sec = this.runTimeMs / 1000;
      if (sec < 60) return 1;
      if (sec < 180) return 2;
      return 3;
    }

    pickFoodEnemy(poolKind = 'normal') {
      const sec = this.runTimeMs / 1000;
      let pool = FOOD_NORMAL_EARLY;
      if (poolKind === 'fast') pool = FOOD_FAST;
      else if (poolKind === 'all') pool = FOOD_ALL;
      else if (sec >= 60) pool = FOOD_NORMAL_MID;
      return Phaser.Utils.Array.GetRandom(pool);
    }

    spawnOutsideView(type = 'normal', count = 1) {
      const view = this.cameras.main.worldView;
      for (let i = 0; i < count; i++) {
        const margin = Phaser.Math.Between(90, 190);
        const edge = Phaser.Math.Between(0, 3);
        let x, y;
        if (edge === 0) { x = Phaser.Math.Between(view.left - margin, view.right + margin); y = view.top - margin; }
        else if (edge === 1) { x = view.right + margin; y = Phaser.Math.Between(view.top - margin, view.bottom + margin); }
        else if (edge === 2) { x = Phaser.Math.Between(view.left - margin, view.right + margin); y = view.bottom + margin; }
        else { x = view.left - margin; y = Phaser.Math.Between(view.top - margin, view.bottom + margin); }
        x = Phaser.Math.Clamp(x, 40, this.worldSize - 40);
        y = Phaser.Math.Clamp(y, 40, this.worldSize - 40);
        if (type === 'elite') this.spawnEnemy(this.pickFoodEnemy('all'), x, y, { elite: true });
        else {
          const actualType = (type === 'normal' || type === 'fast' || type === 'all') ? this.pickFoodEnemy(type) : type;
          this.spawnEnemy(actualType, x, y);
        }
      }
    }

    spawnEnemy(type, x, y, opts = {}) {
      const scaling = this.getScaling();
      const isElite = !!opts.elite;
      const isBoss = type === 'boss';
      const isRaid = type === 'raidBoss';
      let texture = 'enemy_boss', baseHp = 300, baseSpeed = 50, damage = 20, xp = 0, spriteScale = 1;
      let role = 'normal', mutationKey = null, bossStats = null;

      if (isRaid) {
        const raidTextures = ['enemy_raid_grape', 'enemy_raid_choco', 'enemy_raid_onion'];
        texture = raidTextures[Math.max(0, this.raidBossCount - 1) % raidTextures.length];
        baseHp = 6500 + this.raidBossCount * 1800;
        baseSpeed = 60 + Math.min(24, this.raidBossCount * 3);
        damage = 34 + this.raidBossCount * 4;
        xp = 0;
        spriteScale = 3.05;
        role = 'raidBoss';
      } else if (isBoss) {
        bossStats=this.getBossEscalation(opts.bossIndex || this.regularBossCount || 1);
        texture = 'enemy_boss';
        baseHp = 520 * bossStats.hp;
        baseSpeed = 54 * bossStats.speed;
        damage = 22 * bossStats.damage;
        xp = 0;
        spriteScale = 2.65;
        role = 'boss';
      } else {
        const data = FOOD_ENEMIES[type] || FOOD_ENEMIES.grape;
        texture = data.texture;
        baseHp = data.hp;
        baseSpeed = data.speed;
        damage = data.damage * scaling.damage;
        xp = data.xp;
        if (isElite) {
          baseHp *= 4.2;
          baseSpeed *= 0.92;
          damage *= 1.45;
          xp = Math.max(4, xp * 4);
          spriteScale = 1.65;
          role = 'elite';
          const minutes=scaling.minutes;
          const mutationChance=minutes<5?0:minutes<10?0.45:minutes<15?0.72:1;
          if(!opts.noMutation && Math.random()<mutationChance){
            mutationKey=opts.mutation || Phaser.Utils.Array.GetRandom(Object.keys(ELITE_MUTATIONS));
            const mut=ELITE_MUTATIONS[mutationKey];
            if(mut){baseHp*=mut.hpMult;baseSpeed*=mut.speedMult;damage*=mut.damageMult;}
          }
        }
      }

      if(this.coopMode){
        if(role==='boss'){baseHp*=3.0;damage*=1.32;spriteScale*=1.10;}
        if(role==='raidBoss'){baseHp*=3.5;damage*=1.38;spriteScale*=1.10;}
      }
      const e = this.enemies.create(x, y, texture);
      e.setScale(spriteScale).setDepth(8);
      e.enemyType = type;
      e.enemyRole = role;
      e.eliteMutation = mutationKey;
      e.bossIndex = bossStats?.bossIndex || 0;
      e.bossShotIntervalMult = bossStats?.shotInterval || 1;
      e.bossShotSpeedMult = bossStats?.shotSpeed || 1;
      e.bossFanCount = role==='boss' ? (this.coopMode ? 9 + (bossStats?.fanBonus||0) : 3 + (bossStats?.fanBonus||0)) : 0;
      e.bossRingCount = role==='boss' ? (this.coopMode ? 12 + (bossStats?.ringBonus||0) : (e.bossIndex>=3 ? 4 + Math.min(6,(e.bossIndex-2)*2) : 0)) : 0;
      const usesTimeScaling = role === 'normal' || role === 'elite';
      e.maxHp = baseHp * (usesTimeScaling ? scaling.hp : 1);
      e.hp = e.maxHp;
      e.speed = baseSpeed * (usesTimeScaling ? scaling.speed : 1);
      e.contactDamage = damage;
      e.contactDamageMult = 1;
      e.shrinkUntil = 0;
      e.xpValue = xp;
      e.nextTouchAt = 0;
      e.hitFlashUntil = 0;
      e.baseDisplayScale = spriteScale;
      const mutationShotMult=mutationKey?(ELITE_MUTATIONS[mutationKey]?.shotMult||1):1;
      e.eliteShotMult=mutationShotMult;
      e.nextShotAt = this.runTimeMs + Phaser.Math.Between(role === 'elite' ? 1300 : 900, role === 'elite' ? 2500 : 1700) * mutationShotMult;
      e.shotPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
      e.nextRushAt = this.runTimeMs + Phaser.Math.Between(3000, 5200);
      e.rushUntil = 0;
      e.raidPhase2 = false;
      e.setData('dead', false);

      if (role === 'raidBoss') e.body.setCircle(25, 11, 11);
      else if (role === 'boss') e.body.setCircle(18, 6, 6);
      else if (role === 'elite') e.body.setCircle(13, 3, 3);
      else e.body.setCircle(10, 5, 5);

      if (role === 'elite') {
        e.eliteFace = this.add.image(x, y, 'eliteFace').setDepth(9).setScale(spriteScale * 0.9);
        e.setTint(0xc8a5a5);
        if(mutationKey){
          const mut=ELITE_MUTATIONS[mutationKey];
          e.eliteMutationText=this.add.text(x,y-24,`${mut.icon}${mut.name}`,{fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:`#${mut.color.toString(16).padStart(6,'0')}`,stroke:'#18131b',strokeThickness:3}).setOrigin(0.5).setDepth(17);
        }
      }
      if (role === 'boss') e.setTint(0xe6b26f);
      if (role === 'raidBoss') {
        e.raidName=this.raidBossName || TRUE_BOSS_NAMES[Math.max(0,this.raidBossCount-1)%TRUE_BOSS_NAMES.length];
        e.setTint(0xffffff);
        this.tweens.add({ targets: e, scaleX: spriteScale * 1.05, scaleY: spriteScale * 1.05, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      if(opts.offspring){
        e.isOffspring=true;e.maxHp*=0.42;e.hp=e.maxHp;e.speed*=1.12;e.contactDamage*=0.72;e.xpValue=0;e.setScale(spriteScale*0.72);e.baseDisplayScale=spriteScale*0.72;
      }
      return e;
    }

    destroyEnemyDecorations(e) {
      if(!e)return;
      if(e.eliteFace?.active)e.eliteFace.destroy();
      if(e.eliteMutationText?.active)e.eliteMutationText.destroy();
      if(e.netMutationMarker?.active)e.netMutationMarker.destroy();
      if(e.raidTelegraph?.active)e.raidTelegraph.destroy();
      e.raidTelegraph=null;
    }

    spawnSplitterChildren(enemy) {
      if(!enemy || enemy.eliteMutation!=='splitter')return;
      const childType=FOOD_ENEMIES[enemy.enemyType]?enemy.enemyType:this.pickFoodEnemy('all');
      for(let i=0;i<3;i++){
        const a=(Math.PI*2*i)/3+Phaser.Math.FloatBetween(-0.25,0.25);
        const child=this.spawnEnemy(childType,enemy.x+Math.cos(a)*24,enemy.y+Math.sin(a)*24,{offspring:true,noMutation:true});
        if(child)child.setTint(0xeab2d7);
      }
    }

    spawnRingEvent() {
      if (this.raidBossActive || this.pendingTrueBoss) return;
      const cx = this.player.x, cy = this.player.y;
      const radius = Math.max(this.cameras.main.width, this.cameras.main.height) * 0.72;
      for (let i = 0; i < 50; i++) {
        const a = (Math.PI * 2 * i) / 50;
        const r = radius + Phaser.Math.Between(-35, 35);
        this.spawnEnemy(this.pickFoodEnemy('all'), cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      this.showBanner('포위 이벤트!', '위험 음식 50마리 전방위 습격');
      this.cameras.main.shake(450, 0.004);
    }

    spawnPressureEvent() {
      if(this.raidBossActive || this.pendingTrueBoss)return;
      const minutes=this.runTimeMs/60000;
      const count=Math.min(44,24+Math.floor(minutes/5)*4);
      const eliteCount=Math.min(4,1+Math.floor(minutes/7));
      this.spawnOutsideView('all',count);
      this.spawnOutsideView('elite',eliteCount);
      this.showBanner('위험식품 폭주!',`혼합 습격 ${count}마리 · 변이 정예 ${eliteCount}마리`);
      this.cameras.main.shake(320,0.003);
    }

    spawnBoss() {
      if (this.raidBossActive || this.pendingTrueBoss) return;
      this.regularBossCount += 1;
      this.lastRegularBossSpawnAt = this.runTimeMs;
      const view = this.cameras.main.worldView;
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Math.max(view.width, view.height) * 0.72;
      const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * r, 80, this.worldSize - 80);
      const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * r, 80, this.worldSize - 80);
      const boss=this.spawnEnemy('boss', x, y,{bossIndex:this.regularBossCount});
      this.showBanner(`BOSS ${this.regularBossCount} 출현!`, `거대 초콜릿 · HP ${Math.ceil(boss?.maxHp||0)}`);
      this.cameras.main.flash(250, 80, 20, 90);
    }

    spawnElite(count = 1, announce = true) {
      if (this.raidBossActive || this.pendingTrueBoss) return;
      this.spawnOutsideView('elite', count);
      if(announce)this.showBanner('정예 위험식품!', '후반에는 정예마다 한 가지 변이가 붙을 수 있다');
    }

    getActiveRegularBoss() {
      return this.enemies.getChildren().find(e=>e.active&&!e.getData('dead')&&e.enemyRole==='boss') || null;
    }

    queueTrueBossEncounter(triggerWave=this.getWave()) {
      if(this.raidBossActive||this.raidBossTransition||this.pendingTrueBoss)return;
      const boss=this.getActiveRegularBoss();
      const earliestStartAt=Math.max(this.runTimeMs,(this.lastRegularBossSpawnAt||-999999)+this.trueBossMinBossGapMs);
      this.pendingTrueBoss={
        triggerWave,
        queuedAt:this.runTimeMs,
        deadlineAt:this.runTimeMs+this.trueBossFinishWindowMs,
        earliestStartAt,
        resolvedAt:boss?null:this.runTimeMs,
        blockSpawns:!!boss
      };
      this.raidPendingSeq+=1;
      this.zombieTimer=0;this.batTimer=0;this.eliteTimer=0;
      const waitSec=Math.max(0,Math.ceil((earliestStartAt-this.runTimeMs)/1000));
      if(boss)this.showBanner('TRUE BOSS 접근 중...','현재 보스를 마무리하세요! · 신규 적 스폰 중지');
      else this.showBanner('TRUE BOSS 접근 중...',waitSec>0?`전장 정리 중 · 약 ${waitSec}초 후 출현`:'전장 정리 후 곧 출현');
    }

    forceResolveRegularBossForRaid(boss) {
      if(!boss?.active||boss.getData('dead'))return;
      const x=boss.x,y=boss.y;
      boss.setData('dead',true);
      this.destroyEnemyDecorations(boss);
      this.dropRegularBossRewards(x,y,true);
      boss.destroy();
      this.showBanner('보스 마무리 시간 종료','전투 보상 1세트를 보장하고 TRUE BOSS를 준비한다');
    }

    updatePendingTrueBoss() {
      const pending=this.pendingTrueBoss;
      if(!pending||this.raidBossActive||this.raidBossTransition)return true;
      let boss=this.getActiveRegularBoss();
      if(boss && this.runTimeMs>=pending.deadlineAt){
        this.forceResolveRegularBossForRaid(boss);
        boss=null;
        pending.resolvedAt=this.runTimeMs;
      }
      if(boss)return true;
      if(!Number.isFinite(pending.resolvedAt))pending.resolvedAt=this.runTimeMs;
      const readyAt=Math.max(pending.earliestStartAt,pending.resolvedAt+1000);
      if(this.runTimeMs>=readyAt){this.startRaidBossEncounter();return true;}
      // 실제 일반 보스를 마무리하는 중이었다면 전장을 비워 주고,
      // 보스가 이미 없던 경우에는 최소 간격을 기다리는 동안 일반 웨이브를 유지한다.
      return !!pending.blockSpawns;
    }

    clearBattlefieldForRaid() {
      let rawXp=0,removed=0;
      [...this.enemies.getChildren()].forEach(e => {
        if(!e?.active)return;
        const role=e.enemyRole||'normal';
        if(role==='normal'||role==='elite'){
          rawXp+=Math.max(0,e.xpValue||0);
          removed+=1;
        }else if(role==='boss'){
          // 예약 로직이 놓친 보스가 있어도 보상 없이 삭제하지 않는 최종 안전장치.
          this.dropRegularBossRewards(e.x,e.y,true);
        }
        this.destroyEnemyDecorations(e);
        e.destroy();
      });
      this.enemyProjectiles.clear(true, true);
      const cleanupXp=Math.max(0,Math.floor(rawXp*HEALING.cleanupXpRatio));
      if(cleanupXp>0){
        this.xp+=cleanupXp;
        this.pendingCleanupProgression=true;
      }
      return { cleanupXp, removed };
    }

    startRaidBossEncounter() {
      if(this.raidBossActive||this.raidBossTransition)return;
      const stillBoss=this.getActiveRegularBoss();
      if(stillBoss){
        if(!this.pendingTrueBoss)this.queueTrueBossEncounter(this.getWave());
        return;
      }
      this.pendingTrueBoss=null;
      this.raidBossActive = true;
      this.raidBossTransition = true;
      const cleanup=this.clearBattlefieldForRaid();
      this.raidBossCount += 1;
      this.raidBossName=TRUE_BOSS_NAMES[(this.raidBossCount-1)%TRUE_BOSS_NAMES.length];
      this.raidIntroSeq += 1;
      const cleanupText=cleanup.cleanupXp>0?` · 전장 정리 XP +${cleanup.cleanupXp}`:'';
      this.showBanner('⚠ TRUE BOSS 경고 ⚠', `${this.raidBossName} 출현 감지${cleanupText}`);
      showBossWarningUi(this.raidBossName, `탄막전 시작 · 패턴을 보고 피하세요${cleanupText}`);
      this.cameras.main.flash(420,255,80,55);
      playEnemyShotSfx(true);
      this.time.delayedCall(1250,()=>{
        if(this.isGameOver||!this.raidBossActive)return;
        this.spawnRaidBossNow();
      });
    }

    spawnRaidBossNow() {
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Math.max(this.cameras.main.width, this.cameras.main.height) * 0.55;
      const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * r, 140, this.worldSize - 140);
      const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * r, 140, this.worldSize - 140);
      const boss = this.spawnEnemy('raidBoss', x, y);
      boss.raidIndex = this.raidBossCount - 1;
      boss.raidName=this.raidBossName;
      boss.raidPatternHistory=[];
      boss.raidPatternId='';
      boss.rushTelegraphUntil=0;boss.rushUntil=0;boss.rushAngle=0;boss.rushPostDone=true;
      this.raidBossTransition=false;
      this.showBanner(this.raidBossName, `WAVE ${this.getWave()} · 탄막전 시작!`);
      this.cameras.main.flash(500, 255, 60, 35);
      this.cameras.main.shake(650, 0.012);
      playEnemyShotSfx(true);
      if(this.pendingCleanupProgression){
        this.pendingCleanupProgression=false;
        this.updateHud();
        this.checkLevelProgression();
      }
    }

    updateWaveSpawns(delta) {
      const sec = this.runTimeMs / 1000;
      const minutes=sec/60;
      const wave = this.getWave();

      if (!this.raidBossActive && !this.pendingTrueBoss && wave >= this.nextRaidWave) {
        this.queueTrueBossEncounter(this.nextRaidWave);
        this.nextRaidWave += 35;
      }
      if (this.pendingTrueBoss) {
        const blockSpawns=this.updatePendingTrueBoss();
        if(blockSpawns||this.raidBossActive||this.raidBossTransition)return;
      }
      if (this.raidBossActive) return;

      const phase = this.getSpawnPhase();
      let normalInterval = 2000, normalCount = 3;
      let fastEnabled = false, fastInterval = 5000, fastCount = 2;
      if (phase === 2) { normalInterval = 1000; normalCount = 3; fastEnabled = true; }
      if (phase === 3) {
        fastEnabled=true;
        if(minutes<5){normalInterval=800;normalCount=4;fastInterval=4000;fastCount=3;}
        else if(minutes<10){normalInterval=760;normalCount=4;fastInterval=3800;fastCount=3;}
        else if(minutes<15){normalInterval=700;normalCount=5;fastInterval=3400;fastCount=3;}
        else if(minutes<20){normalInterval=620;normalCount=5;fastInterval=3000;fastCount=4;}
        else {const extra=Math.floor((minutes-20)/5);normalInterval=Math.max(480,560-extra*25);normalCount=6;fastInterval=Math.max(2200,2700-extra*100);fastCount=4;}
      }

      let activeNonBoss=this.enemies.getChildren().filter(e=>e.active&&!e.getData('dead')&&e.enemyRole!=='boss'&&e.enemyRole!=='raidBoss').length;
      const activeCap=this.coopMode?180:155;
      this.zombieTimer += delta;
      while (this.zombieTimer >= normalInterval) {
        this.zombieTimer -= normalInterval;
        if(activeNonBoss < activeCap){this.spawnOutsideView('normal', normalCount);activeNonBoss+=normalCount;}
      }

      if (fastEnabled) {
        this.batTimer += delta;
        while (this.batTimer >= fastInterval) {
          this.batTimer -= fastInterval;
          if(activeNonBoss < activeCap){this.spawnOutsideView('fast', fastCount);activeNonBoss+=fastCount;}
        }
      } else this.batTimer = 0;

      if (sec >= 45) {
        this.eliteTimer += delta;
        let eliteInterval=18000,eliteCount=1;
        if(minutes>=5){eliteInterval=12500;eliteCount=2;}
        if(minutes>=10){eliteInterval=9500;eliteCount=2;}
        if(minutes>=15){eliteInterval=7600;eliteCount=3;}
        if(minutes>=20){eliteInterval=6500;eliteCount=4;}
        if (this.eliteTimer >= eliteInterval) {
          this.eliteTimer = 0;
          this.spawnElite(eliteCount,minutes<6);
        }
      }

      if (sec >= 180 && !this.event180Done) {
        this.event180Done = true;
        this.spawnRingEvent();
      }
      while(sec>=this.nextPressureEventAt){
        this.spawnPressureEvent();
        this.nextPressureEventAt+=300;
      }
      while (sec >= this.nextBossAt) {
        // TRUE BOSS 직후에는 일반 보스를 바로 겹쳐 내보내지 않는다.
        // 해당 5분 보스 1회만 건너뛰고 다음 정규 5분 주기는 유지한다.
        if(this.runTimeMs-(this.lastTrueBossEndedAt||-999999)<this.trueBossMinBossGapMs){
          this.nextBossAt += 300;
          continue;
        }
        this.spawnBoss();
        this.nextBossAt += 300;
      }
    }

    nearestEnemy(x = this.player.x, y = this.player.y, maxDist = Infinity) {
      let best = null, bestD = maxDist * maxDist;
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        const d = Phaser.Math.Distance.Squared(x, y, e.x, e.y);
        if (d < bestD) { bestD = d; best = e; }
      });
      return best;
    }

    fireBasicProjectile() {
      const target = this.nearestEnemy();
      if (!target) return;
      const shotCount = 1 + (this.extraBasicShots || 0);
      const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
      for (let i = 0; i < shotCount; i++) {
        const spread = shotCount === 1 ? 0 : (i - (shotCount - 1) / 2) * 0.13;
        const damageMult = i === 0 ? 1 : 0.65;
        this.spawnBasicProjectile(baseAngle + spread, damageMult);
      }
      const sheddingLv=this.characterAugmentLevels?.sheddingSeason||0;
      if(this.characterKey==='gucci'&&sheddingLv>0){
        const chance=Math.min(0.35,0.15+(sheddingLv-1)*0.05);
        if(Math.random()<chance)this.spawnBasicProjectile(baseAngle+Phaser.Math.FloatBetween(-0.09,0.09),0.60);
      }
      playShotSfx(this.charData.projectile);
      this.player.setFlipX(target.x < this.player.x);
    }

    spawnBasicProjectile(angle, damageMult = 1) {
      const kind = this.charData.projectile;
      const texture = `proj_${kind}`;
      const p = this.projectiles.create(this.player.x, this.player.y, texture);
      p.setDepth(12);
      p.ownerId = this.currentBuildId || this.localId || 'solo';
      p.kind = 'basic';
      p.damage = this.attackPower * (1 + (this.basicSizeMult - 1) * 0.52) * (this.basicDamageMult || 1) * damageMult;
      p.hitSet = new Set();
      const pressureLv=this.characterAugmentLevels?.highPressurePee||0;
      p.pierceLeft = (this.basicPierce || 0) + (kind==='pee'?pressureLv:0);
      p.ricochetLeft = this.basicRicochet || 0;
      p.spawnAt = this.runTimeMs; p.lifeMs = kind === 'pee' ? 1100 + pressureLv*120 : 1600;
      const speed = kind === 'pee' ? 440 + pressureLv*38 : 310;
      p.setRotation(angle);
      this.physics.velocityFromRotation(angle, speed, p.body.velocity);
      const sizeMult = (this.basicSizeMult || 1) * (this.basicProjectileScale || 1);
      if (kind === 'bark') p.setScale(1.15 * sizeMult);
      else p.setScale(sizeMult);
      if (kind === 'pee') p.body.setSize(25 * sizeMult, 4 * sizeMult);
      else p.body.setCircle(6 * sizeMult, 1, 1);
    }

    explodeAt(x, y, damage, radius = 78, exclude = null) {
      const ring = this.add.image(x, y, 'shockwave').setDepth(18).setScale(0.35).setAlpha(0.9);
      this.tweens.add({ targets: ring, scale: radius / 28, alpha: 0, duration: 240, onComplete: () => ring.destroy() });
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead') || e === exclude) return;
        if (Phaser.Math.Distance.Between(x, y, e.x, e.y) <= radius) this.damageEnemy(e, damage, 'explosion');
      });
    }

    ricochetProjectile(projectile, fromEnemy) {
      if (!projectile.ricochetLeft || projectile.ricochetLeft <= 0) return false;
      let best = null, bestD = 260 * 260;
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead') || e === fromEnemy || projectile.hitSet?.has(e)) return;
        const d = Phaser.Math.Distance.Squared(fromEnemy.x, fromEnemy.y, e.x, e.y);
        if (d < bestD) { bestD = d; best = e; }
      });
      if (!best) return false;
      projectile.ricochetLeft -= 1;
      const a = Phaser.Math.Angle.Between(projectile.x, projectile.y, best.x, best.y);
      const speed = Math.max(300, Math.hypot(projectile.body.velocity.x, projectile.body.velocity.y));
      projectile.setRotation(a);
      this.physics.velocityFromRotation(a, speed, projectile.body.velocity);
      return true;
    }

    onProjectileHit(projectile, enemy) {
      if(this.coopMode&&this.networkRole==='host'&&projectile?.ownerId&&this.currentBuildId!==projectile.ownerId){const b=this.getBuild(projectile.ownerId);if(b)return this.withBuild(b,()=>this.onProjectileHit(projectile,enemy));}
      if (!projectile.active || !enemy.active || enemy.getData('dead')) return;
      if (projectile.hitSet && projectile.hitSet.has(enemy)) return;
      if (projectile.hitSet) projectile.hitSet.add(enemy);
      this.damageEnemy(enemy, projectile.damage || this.attackPower, projectile.kind || 'basic');

      if (projectile.kind === 'disc') {
        if (projectile.pierceLeft > 0) {
          projectile.pierceLeft -= 1;
          return;
        }
        projectile.destroy();
        return;
      }

      if (projectile.kind === 'basic') {
        const shrinkLv=this.skillLevels.shrinkRay||0;
        if (shrinkLv && enemy.enemyRole !== 'raidBoss') {
          const st=treasureSkillStats('shrinkRay',shrinkLv);
          const nextScale = Math.max(enemy.baseDisplayScale * st.minScale, enemy.scaleX * st.stepScale);
          enemy.setScale(nextScale);
          enemy.contactDamageMult = st.contactDamageMult;
          enemy.shrinkUntil = this.runTimeMs + st.duration;
        }
        const juiceLv=this.skillLevels.juiceBox||0;
        if (juiceLv) {
          const st=treasureSkillStats('juiceBox',juiceLv);
          if(this.runTimeMs>(this.juiceComboUntil||0))this.juiceComboHits=0;
          const repeat=(this.juiceComboHits||0)>0;
          this.heal(this.maxHp * st.healPct * (repeat?st.repeatFactor:1));
          this.juiceComboHits=(this.juiceComboHits||0)+1;
          this.juiceComboUntil=this.runTimeMs+st.comboWindow;
        }
        const vocalLv=this.characterAugmentLevels?.vocalBurst||0;
        if(this.characterKey==='jjigae'&&vocalLv>0){
          const chance=Math.min(0.35,0.15+(vocalLv-1)*0.05);
          if(Math.random()<chance)this.explodeAt(enemy.x,enemy.y,projectile.damage*(0.34+vocalLv*0.04),52+vocalLv*5,enemy);
        }
        const stickyLv=this.characterAugmentLevels?.stickySnot||0;
        if(this.characterKey==='mandu'&&stickyLv>0){
          enemy.slowUntil=Math.max(enemy.slowUntil||0,this.runTimeMs+1200+stickyLv*180);
          enemy.slowMult=Math.min(enemy.slowMult||1,Math.max(0.68,0.86-stickyLv*0.04));
        }
        if (this.basicExplosion > 0) this.explodeAt(enemy.x, enemy.y, this.attackPower * (0.55 + this.basicExplosion * 0.10), 78 + this.basicExplosion * 8, enemy);

        if (projectile.pierceLeft > 0) {
          projectile.pierceLeft -= 1;
          return;
        }
        if (this.ricochetProjectile(projectile, enemy)) return;
      }

      if (projectile.kind !== 'magicMissilePierce') projectile.destroy();
    }

    onSkillHit(hitbox, enemy) {
      if(this.coopMode&&this.networkRole==='host'&&hitbox?.ownerId&&this.currentBuildId!==hitbox.ownerId){const b=this.getBuild(hitbox.ownerId);if(b)return this.withBuild(b,()=>this.onSkillHit(hitbox,enemy));}
      if (!hitbox.active || !enemy.active || enemy.getData('dead')) return;
      if (!hitbox.hitSet) hitbox.hitSet = new Set();
      if (hitbox.hitSet.has(enemy)) return;
      hitbox.hitSet.add(enemy);
      this.damageEnemy(enemy, hitbox.damage || this.attackPower, hitbox.skillKind || 'skill');
    }

    damageEnemy(enemy, amount, source) {
      if (!enemy.active || enemy.getData('dead')) return;
      const vuln = this.runTimeMs < (enemy.vulnerableUntil || 0) ? (enemy.vulnerableMult || 1) : 1;
      const effectiveAmount = amount * vuln;
      enemy.hp -= effectiveAmount;
      enemy.hitFlashUntil = this.runTimeMs + 90;
      enemy.setTint(0xffffff);
      this.time.delayedCall(80, () => {
        if (!enemy.active) return;
        enemy.clearTint();
        if (enemy.enemyRole === 'elite') enemy.setTint(0xc8a5a5);
        else if (enemy.enemyRole === 'boss') enemy.setTint(0xe6b26f);
      });
      this.spawnDamageText(enemy.x, enemy.y - 18, Math.round(effectiveAmount));
      if (this.runTimeMs - (this.lastHitSfxAt || 0) > 45) {
        this.lastHitSfxAt = this.runTimeMs;
        playHitSfx(enemy.enemyRole === 'boss' || enemy.enemyRole === 'raidBoss');
      }
      if(enemy.enemyRole==='raidBoss' && enemy.hp>0 && !enemy.raidPhase2 && enemy.hp<=enemy.maxHp*0.5)this.activateRaidPhase2(enemy);
      if (enemy.hp <= 0) this.killEnemy(enemy, source);
    }

    activateRaidPhase2(enemy){
      if(!enemy?.active||enemy.raidPhase2)return;
      enemy.raidPhase2=true;
      enemy.raidPatternHistory=[];
      enemy.nextShotAt=Math.max(enemy.nextShotAt||0,this.runTimeMs+520);
      this.raidPhaseSeq+=1;
      this.showBanner(`${enemy.raidName||this.raidBossName} 2 PHASE`,'패턴이 변한다!');
      this.cameras.main.flash(300,255,120,70);
      this.cameras.main.shake(260,0.007);
      playEnemyShotSfx(true);
    }

    killEnemy(enemy) {
      if (!enemy.active || enemy.getData('dead')) return;
      enemy.setData('dead', true);
      const x = enemy.x, y = enemy.y, role = enemy.enemyRole || 'normal';
      this.kills += 1;
      if(role==='elite'&&enemy.eliteMutation==='splitter')this.spawnSplitterChildren(enemy);
      this.destroyEnemyDecorations(enemy);
      this.cameras.main.shake(role === 'raidBoss' ? 520 : role === 'boss' ? 280 : role === 'elite' ? 120 : 55, role === 'raidBoss' ? 0.015 : role === 'boss' ? 0.007 : role === 'elite' ? 0.003 : 0.0015);
      if (role === 'raidBoss') {
        this.raidBossActive = false;
        this.raidBossTransition = false;
        this.lastTrueBossEndedAt = this.runTimeMs;
        this.dropMagnet(x - 42, y);
        this.dropChest(x + 42, y);
        this.dropChest(x, y + 36);
        this.dropSnack(x - 22, y + 40);
        this.dropSnack(x + 22, y + 40);
        this.showBanner('TRUE BOSS 격파!', '잡몹 웨이브 재개 · 보물상자 2 · 간식 2');
        this.cameras.main.flash(420, 255, 224, 100);
      } else if (role === 'boss') {
        this.dropRegularBossRewards(x,y,false);
      } else {
        if ((enemy.xpValue ?? 1) > 0) this.dropGem(x, y, enemy.xpValue ?? 1);
        if (role === 'elite' && Math.random() < 0.18) this.dropChest(x + 14, y);
        if (role === 'elite' && Math.random() < HEALING.eliteSnackChance) this.dropSnack(x - 14, y + 8);
      }
      enemy.destroy();
    }

    spawnDamageText(x, y, amount) {
      const t = this.add.text(x, y, `${amount}`, { fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#fff4c1', stroke: '#2a1720', strokeThickness: 3 }).setDepth(40).setOrigin(0.5);
      this.tweens.add({ targets: t, y: y - 24, alpha: 0, duration: 450, onComplete: () => t.destroy() });
    }

    dropGem(x, y, value) {
      const g = this.gems.create(x + Phaser.Math.Between(-6, 6), y + Phaser.Math.Between(-6, 6), 'xpGem');
      g.setDepth(6); g.xpValue = value; g.magnetized = false;
      g.body.setCircle(5, 1, 2);
    }

    dropMagnet(x, y) {
      const item = this.items.create(x, y, 'magnetItem').setDepth(7).setScale(1.2);
      item.itemType = 'magnet';
    }

    dropChest(x, y) {
      const item = this.items.create(x, y, 'treasureChest').setDepth(7).setScale(1.25);
      item.itemType = 'chest';
      this.tweens.add({ targets: item, y: y - 5, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    dropSnack(x,y) {
      const item=this.items.create(x,y,'snackItem').setDepth(7).setScale(1.15);
      item.itemType='snack';
      this.tweens.add({targets:item,y:y-4,duration:520,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      return item;
    }

    dropRegularBossRewards(x,y,forced=false) {
      if(Math.random()<0.5)this.dropMagnet(x-16,y);
      else this.dropChest(x-16,y);
      this.dropSnack(x+18,y+8);
      if(forced)this.cameras.main.flash(180,240,180,90);
    }

    xpRequirement(level) {
      const early = { 1:2, 2:3, 3:4, 4:6, 5:8, 6:11, 7:15, 8:20, 9:26, 10:33 };
      if (early[level]) return early[level];
      const late = Math.ceil(33 * Math.pow(1.16, level - 10) + (level - 10) * 3);
      return Math.max(36, late);
    }

    collectGem(picker, gem) {
      if (!gem.active) return;
      const val = gem.xpValue || 1;
      gem.destroy();
      if(this.coopMode){
        if(this.networkRole!=='host')return;
        const build=this.getBuild(picker?.netPlayerId)||this.getLocalBuild();
        this.xp += val * (build?.xpGainMult || 1);
      } else this.xp += val * (this.xpGainMult || 1);
      this.checkLevelProgression(); this.updateHud();
    }

    checkLevelProgression() {
      if (this.isChoiceOpen || this.isGameOver) return;
      if (this.xp < this.xpNeed) return;
      this.xp -= this.xpNeed; this.level += 1; this.xpNeed = this.xpRequirement(this.level);
      this.applyLevelUpRecovery();
      this.updateHud();
      if(this.coopMode){if(this.networkRole==='host')this.beginCoopChoice('base');return;}
      this.pendingAugmentType = this.level % 10 === 0 ? 'major' : (this.level % 5 === 0 ? 'minor' : null);
      this.openLevelUp();
    }

    applyLevelUpRecovery() {
      if(this.coopMode){
        if(this.networkRole!=='host'||!this.builds)return;
        const cur=this.getBuild(this.currentBuildId);if(cur)this.saveBuild(cur);
        this.builds.forEach(b=>{if(!b.down&&b.hp>0)b.hp=Math.min(b.maxHp,b.hp+b.maxHp*HEALING.levelUpPct);});
        const local=this.getLocalBuild();if(local)this.loadBuild(local);
        return;
      }
      if(!this.playerDown&&this.hp>0)this.hp=Math.min(this.maxHp,this.hp+this.maxHp*HEALING.levelUpPct);
    }

    collectItem(picker, item) {
      if (!item.active) return;
      const type = item.itemType; item.destroy();
      if (type === 'magnet') {
        this.magnetUntil = this.runTimeMs + 5000;
        this.gems.getChildren().forEach(g => { if (g.active) g.magnetized = true; });
        this.showBanner('자석 획득!', '모든 경험치 보석 흡수');
      } else if (type === 'chest') {
        if(this.coopMode){if(this.networkRole==='host')this.beginCoopChoice('chest',[picker?.netPlayerId||this.localId]);}
        else this.openChest();
      } else if (type === 'snack') {
        if(this.coopMode){
          if(this.networkRole!=='host')return;
          const build=this.getBuild(picker?.netPlayerId)||this.getLocalBuild();
          if(build&&!build.down)this.withBuild(build,()=>this.heal(this.maxHp*HEALING.snackPct));
        }else this.heal(this.maxHp*HEALING.snackPct);
      }
    }

    openLevelUp() {
      if (this.isChoiceOpen || this.isGameOver) return;
      this.isChoiceOpen = true;
      this.scene.pause();
      const screen = document.querySelector('#levelup-screen');
      const root = document.querySelector('#levelup-choices');
      document.querySelector('#levelup-eyebrow').textContent = 'LEVEL UP!';
      document.querySelector('#levelup-title').textContent = `Lv.${this.level} 강화 하나를 선택해`;
      root.innerHTML = '';
      shuffle(LEVEL_UPGRADES).slice(0, 3).forEach(u => {
        const b = document.createElement('button');
        decorateChoiceButton(b,{...u,level:null},'base');
        b.onclick = () => {
          this.applyLevelUpgrade(u.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          const pending = this.pendingAugmentType;
          this.pendingAugmentType = null;
          if (pending === 'major') this.openMajorAugment();
          else if (pending === 'minor') this.openMilestoneAugment();
          else {
            this.scene.resume();
            this.playLevelUpFx?.();
            this.checkLevelProgression();
          }
        };
        root.appendChild(b);
      });
      screen.classList.add('show');
    }

    openMilestoneAugment() {
      if (this.isChoiceOpen || this.isGameOver) return;
      this.isChoiceOpen = true;
      this.scene.pause();
      const screen = document.querySelector('#levelup-screen');
      const root = document.querySelector('#levelup-choices');
      document.querySelector('#levelup-eyebrow').textContent = this.level === 1 ? 'START AUGMENT!' : `LEVEL ${this.level} AUGMENT!`;
      document.querySelector('#levelup-title').textContent = this.level === 1 ? '시작 특별 증강 하나를 선택해' : '특별 증강 하나를 선택해';
      root.innerHTML = '';
      const tempBuild={characterKey:this.characterKey,characterAugmentLevels:this.characterAugmentLevels||{}};
      const picks=this.level===1?shuffle(MILESTONE_AUGMENTS).slice(0,3):this.milestoneChoicesForBuild(tempBuild);
      picks.forEach(a => {
        const b = document.createElement('button');
        const exclusiveLevel=a.exclusive?(this.characterAugmentLevels?.[a.id]||0):null;
        const displayOption={...a,level:a.exclusive?exclusiveLevel:null};
        decorateChoiceButton(b,displayOption,'minor');
        if(!a.exclusive){const lv=b.querySelector?.('.level');if(!lv){const badge=document.createElement('span');badge.className='level';badge.textContent=this.level===1?'시작 특별 증강':'특별 증강';b.appendChild(badge);}}
        b.onclick = () => {
          this.applyMilestoneAugment(a.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          this.scene.resume();
          this.playLevelUpFx?.();
          this.checkLevelProgression();
        };
        root.appendChild(b);
      });
      screen.classList.add('show');
    }

    openMajorAugment() {
      if (this.isChoiceOpen || this.isGameOver) return;
      this.isChoiceOpen = true;
      const screen = document.querySelector('#levelup-screen');
      const root = document.querySelector('#levelup-choices');
      document.querySelector('#levelup-eyebrow').textContent = `LEVEL ${this.level} MAJOR AUGMENT!`;
      document.querySelector('#levelup-title').textContent = '10레벨 전투 증강 하나를 선택해';
      root.innerHTML = '';
      const picks = shuffle(MAJOR_AUGMENTS).slice(0, 3);
      picks.forEach(a => {
        const b = document.createElement('button');
        const current = this.majorLevels[a.id] || 0;
        decorateChoiceButton(b,{...a,level:current},'major');
        b.onclick = () => {
          this.applyMajorAugment(a.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          this.scene.resume();
          this.playLevelUpFx?.();
          this.checkLevelProgression();
        };
        root.appendChild(b);
      });
      screen.classList.add('show');
    }

    applyLevelUpgrade(id) {
      if (this.levelUpgradeCounts && Object.prototype.hasOwnProperty.call(this.levelUpgradeCounts, id)) this.levelUpgradeCounts[id] += 1;
      if (id === 'damage') this.attackPower *= 1.07;
      if (id === 'speed') this.moveSpeed *= 1.035;
      if (id === 'health') {
        this.maxHp += 14;
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.45);
      }
      if (id === 'xpGain') this.xpGainMult *= 1.12;
      if (id === 'attackSpeed') this.basicCooldown = Math.max(520, this.basicCooldown * 0.96);
      this.updateHud();
    }

    applyMilestoneAugment(id) {
      const globalData = MILESTONE_AUGMENTS.find(a => a.id === id);
      const exclusiveData = CHARACTER_AUGMENTS.find(a => a.id === id && a.character === this.characterKey);
      const data = globalData || exclusiveData;
      if (id === 'goodDeal') this.extraBasicShots += 1;
      if (id === 'hunterInstinct') {
        this.basicCooldown = Math.max(520, this.basicCooldown * 0.86);
        this.attackPower *= 1.07;
      }
      if (id === 'sniffer') this.gemMagnetRange += 75;
      if (id === 'ironStomach') {
        this.maxHp += 28;
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.60);
        this.playerDamageMult *= 0.93;
      }
      if (id === 'zoomies') {
        this.moveSpeed *= 1.12;
        this.basicCooldown = Math.max(520, this.basicCooldown * 0.94);
      }
      if (exclusiveData) {
        this.characterAugmentLevels[id] = (this.characterAugmentLevels[id] || 0) + 1;
      } else if (data) {
        this.augments.push(data.title);
      }
      const lv=exclusiveData?` Lv.${this.characterAugmentLevels[id]}`:'';
      this.showBanner(`${data?.title || '증강 획득!'}${lv}`, exclusiveData?'캐릭터 전용 특별 증강':`Lv.${this.level} 특별 증강`);
      this.updateHud();
    }

    applyMajorAugment(id) {
      const data = MAJOR_AUGMENTS.find(a => a.id === id);
      this.majorLevels[id] = (this.majorLevels[id] || 0) + 1;
      if (id === 'poopOrbit') this.rebuildPoopOrbiters();
      if (data) this.showBanner(`${data.title} Lv.${this.majorLevels[id]}`, `Lv.${this.level} 10레벨 증강`);
      this.updateHud();
    }

    rebuildPoopOrbiters() {
      (this.poopOrbiters || []).forEach(o => { if (o?.active) o.destroy(); });
      this.poopOrbiters = [];
      const count = this.majorLevels.poopOrbit || 0;
      for (let i = 0; i < count; i++) {
        const o = this.add.image(this.player.x, this.player.y, 'poopOrbit').setDepth(14).setScale(1.42);
        this.poopOrbiters.push(o);
      }
    }

    castDisc(level) {
      const dirs = [this.facingAngle || 0, -Math.PI / 2, Math.PI / 2];
      const angle = dirs[this.discDirectionIndex % dirs.length];
      this.discDirectionIndex += 1;
      const p = this.projectiles.create(this.player.x, this.player.y, 'disc').setDepth(14);
      p.ownerId = this.currentBuildId || this.localId || 'solo';
      p.kind = 'disc';
      p.damage = this.attackPower * (1.95 + Math.min(2, level - 1) * 0.60);
      p.pierceLeft = Math.max(0, level - 3);
      p.hitSet = new Set();
      p.spawnAt = this.runTimeMs; p.lifeMs = 2600;
      p.setRotation(angle);
      this.physics.velocityFromRotation(angle, 425 + Math.min(120, level * 14), p.body.velocity);
      noise(0.045, 0.025, 900); tone(260, 0.05, 'triangle', 0.018, 180);
    }

    castBarkRoar(level) {
      const radius = 170 + (level - 1) * 40;
      const damage = this.attackPower * (0.92 + level * 0.12);
      const ring = this.add.image(this.player.x, this.player.y, 'shockwave').setDepth(16).setScale(0.35).setAlpha(0.9);
      this.tweens.add({ targets: ring, scale: radius / 28, alpha: 0, duration: 420, onComplete: () => ring.destroy() });
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
        if (d > radius) return;
        this.damageEnemy(e, damage, 'barkRoar');
        if (e.enemyRole !== 'raidBoss') {
          const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
          const push = e.enemyRole === 'boss' ? 5 : e.enemyRole === 'elite' ? 9 : 14;
          e.x += Math.cos(a) * push; e.y += Math.sin(a) * push;
        }
      });
      noise(0.12, 0.055, 420); tone(115, 0.15, 'sawtooth', 0.035, 75);
    }

    spawnGasCloud(level) {
      const radius = 44 + Math.min(30, level * 5);
      const obj = this.add.circle(this.player.x, this.player.y + 8, radius, 0xe7d84d, 0.10).setStrokeStyle(2, 0xbda934, 0.22).setDepth(3);
      this.gasClouds.push({ obj, x:this.player.x, y:this.player.y + 8, radius, level, expire:this.runTimeMs + 4500 + level * 300, nextTick:this.runTimeMs });
      this.tweens.add({ targets: obj, alpha: 0.04, scale: 1.18, duration: 3200 + level * 220 });
    }

    castYawnWave(level) {
      const range = 230 + (level - 1) * 26;
      const halfAngle = 0.57 + Math.min(0.26, (level - 1) * 0.040);
      const damage = this.attackPower * (0.50 + level * 0.055);
      const spread = Math.tan(halfAngle) * range;
      const tri = this.add.triangle(this.player.x, this.player.y, 0, 0, range, -spread, range, spread, 0xaee9ff, 0.12).setOrigin(0, 0.5).setRotation(this.facingAngle || 0).setDepth(6);
      this.tweens.add({ targets: tri, alpha: 0, scaleX: 1.08, duration: 420, onComplete: () => tri.destroy() });
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
        if (d > range) return;
        const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
        if (Math.abs(Phaser.Math.Angle.Wrap(a - (this.facingAngle || 0))) > halfAngle) return;
        this.damageEnemy(e, damage, 'yawnWave');
        e.slowUntil = this.runTimeMs + 3000 + level * 150;
        e.slowMult = Math.max(0.42, 0.63 - level * 0.028);
      });
      noise(0.10, 0.025, 350); tone(165, 0.18, 'sine', 0.025, 95);
    }

    spawnTerritoryZone(level) {
      const radius = 80 + Math.min(36, level * 6);
      const obj = this.add.circle(this.player.x, this.player.y + 7, radius, 0xe8ce48, 0.13).setStrokeStyle(3, 0xd4aa38, 0.42).setDepth(2);
      this.territoryZones.push({ obj, x:this.player.x, y:this.player.y + 7, radius, level, expire:this.runTimeMs + 2700 + level * 320, nextTick:this.runTimeMs });
      this.tweens.add({ targets: obj, alpha: { from:0.18, to:0.08 }, duration:700, yoyo:true, repeat:-1 });
    }

    dropSqueakyToy(level) {
      const view = this.cameras.main.worldView;
      const candidates = this.enemies.getChildren().filter(e => e.active && !e.getData('dead') && view.contains(e.x, e.y));
      const target = candidates.length ? Phaser.Utils.Array.GetRandom(candidates) : this.nearestEnemy();
      if (!target) return;
      const ownerId=this.currentBuildId||this.localId||'solo';
      const attackAtCast=this.attackPower;
      const toy = this.add.image(target.x, target.y - 105, 'squeakyToy').setDepth(30).setScale(1.05);
      const tx = target.x, ty = target.y;
      this.tweens.add({ targets: toy, y:ty, angle:Phaser.Math.Between(-35,35), duration:430, ease:'Quad.easeIn', onComplete:() => {
        const hit=()=>{
          if (target.active && !target.getData('dead')) {
            this.damageEnemy(target, attackAtCast * (2.15 + level * 0.32), 'squeakyToy');
            target.stunUntil = this.runTimeMs + 320 + level * 35;
            this.explodeAt(tx, ty, attackAtCast * (0.36 + level * 0.05), 36 + level * 2, target);
          }
        };
        if(this.coopMode&&this.networkRole==='host'&&this.getBuild(ownerId))this.withBuild(ownerId,hit);else hit();
        noise(0.07,0.04,650); tone(420,0.06,'square',0.025,250);
        toy.destroy();
      }});
    }

    updatePersistentMajorZones() {
      const now = this.runTimeMs;
      this.gasClouds = (this.gasClouds || []).filter(z => {
        if (!z.obj?.active || now >= z.expire) { if (z.obj?.active) z.obj.destroy(); return false; }
        if (now >= z.nextTick) {
          z.nextTick = now + 500;
          this.enemies.getChildren().forEach(e => {
            if (!e.active || e.getData('dead')) return;
            if (Phaser.Math.Distance.Between(z.x,z.y,e.x,e.y) <= z.radius) this.damageEnemy(e, this.attackPower * (0.125 + z.level * 0.035), 'yellowGas');
          });
        }
        return true;
      });
      this.territoryZones = (this.territoryZones || []).filter(z => {
        if (!z.obj?.active || now >= z.expire) { if (z.obj?.active) z.obj.destroy(); return false; }
        if (now >= z.nextTick) {
          z.nextTick = now + 500;
          this.enemies.getChildren().forEach(e => {
            if (!e.active || e.getData('dead')) return;
            if (Phaser.Math.Distance.Between(z.x,z.y,e.x,e.y) <= z.radius) {
              e.vulnerableUntil = now + 750;
              e.vulnerableMult = 1.18 + z.level * 0.035;
              this.damageEnemy(e, this.attackPower * (0.12 + z.level * 0.033), 'territoryMark');
            }
          });
        }
        return true;
      });
    }

    updateMajorAugments(delta, moving) {
      const lv = this.majorLevels || {};
      if (lv.poopOrbit) {
        if (this.poopOrbiters.length !== lv.poopOrbit) this.rebuildPoopOrbiters();
        const count = this.poopOrbiters.length;
        const radius = 82 + Math.min(32, lv.poopOrbit * 5);
        this.poopOrbiters.forEach((o,i) => {
          const a = this.runTimeMs * 0.0032 + (Math.PI * 2 * i) / count;
          o.setPosition(this.player.x + Math.cos(a) * radius, this.player.y + Math.sin(a) * radius);
          this.enemies.getChildren().forEach(e => {
            const poopOwner=this.currentBuildId||'solo';
            e.poopHitReadyBy=e.poopHitReadyBy||{};
            if (!e.active || e.getData('dead') || this.runTimeMs < (e.poopHitReadyBy[poopOwner] || 0)) return;
            if (Phaser.Math.Distance.Between(o.x,o.y,e.x,e.y) <= 32) {
              e.poopHitReadyBy[poopOwner] = this.runTimeMs + 380;
              this.damageEnemy(e, this.attackPower * (0.40 + lv.poopOrbit * 0.060), 'poopOrbit');
              if (e.enemyRole !== 'raidBoss') {
                const pa = Phaser.Math.Angle.Between(this.player.x,this.player.y,e.x,e.y);
                e.x += Math.cos(pa) * 14; e.y += Math.sin(pa) * 14;
              }
            }
          });
        });
      }
      if (lv.discThrow) {
        this.majorTimers.discThrow += delta;
        const interval = Math.max(1550, 2800 - (lv.discThrow - 1) * 200);
        if (this.majorTimers.discThrow >= interval) { this.majorTimers.discThrow = 0; this.castDisc(lv.discThrow); }
      }
      if (lv.barkRoar) {
        this.majorTimers.barkRoar += delta;
        if (this.majorTimers.barkRoar >= 5000) { this.majorTimers.barkRoar = 0; this.castBarkRoar(lv.barkRoar); }
      }
      if (lv.yellowGas && moving) {
        this.majorTimers.yellowGas += delta;
        const interval = Math.max(450, 780 - lv.yellowGas * 45);
        if (this.majorTimers.yellowGas >= interval) { this.majorTimers.yellowGas = 0; this.spawnGasCloud(lv.yellowGas); }
      }
      if (lv.yawnWave) {
        this.majorTimers.yawnWave += delta;
        if (this.majorTimers.yawnWave >= 4600) { this.majorTimers.yawnWave = 0; this.castYawnWave(lv.yawnWave); }
      }
      if (lv.territoryMark) {
        this.majorTimers.territoryMark += delta;
        if (this.majorTimers.territoryMark >= 5300) { this.majorTimers.territoryMark = 0; this.spawnTerritoryZone(lv.territoryMark); }
      }
      if (lv.squeakyToy) {
        this.majorTimers.squeakyToy += delta;
        const interval = Math.max(2200, 4100 - (lv.squeakyToy - 1) * 200);
        if (this.majorTimers.squeakyToy >= interval) { this.majorTimers.squeakyToy = 0; this.dropSqueakyToy(lv.squeakyToy); }
      }
      this.updatePersistentMajorZones();
    }

    openChest() {
      if (this.isChoiceOpen || this.isGameOver) return;
      this.isChoiceOpen = true;
      this.scene.pause();
      const screen = document.querySelector('#chest-screen');
      const root = document.querySelector('#chest-choices');
      root.innerHTML = '';
      const picks = shuffle(SKILLS).slice(0, 3);
      picks.forEach(s => {
        const level = this.skillLevels[s.id] || 0;
        const b = document.createElement('button');
        decorateChoiceButton(b,{...s,desc:treasureSkillDescription(s.id,level+1),level},'chest');
        b.onclick = () => {
          this.acquireSkill(s.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          this.scene.resume();
        };
        root.appendChild(b);
      });
      screen.classList.add('show');
    }

    acquireSkill(id) {
      this.skillLevels[id] = (this.skillLevels[id] || 0) + 1;
      if (id === 'veil' && this.shieldCharges <= 0) this.shieldCharges = 1;
      this.showBanner(SKILLS.find(s => s.id === id)?.title || '스킬 획득!', `Lv.${this.skillLevels[id]}`);
      this.updateHud();
    }

    heal(amount) {
      if (this.playerDown || !Number.isFinite(amount) || amount <= 0) return;
      const before=this.hp;
      this.hp = Math.min(this.maxHp, this.hp + amount);
      const gained=this.hp-before;
      if(gained>0.5 && this.player?.active){
        const last=this.player._lastHealFxAt||-9999;
        if(this.runTimeMs-last>=420){this.player._lastHealFxAt=this.runTimeMs;this.playHealFx(this.player);}
      }
      this.updateHud();
    }

    applyPlayerDamage(amount, sourceX, sourceY, invulnMs = 300) {
      if (this.isGameOver || this.playerDown || this.runTimeMs < this.playerInvulnUntil) return false;
      this.playerInvulnUntil = this.runTimeMs + invulnMs;
      if (this.shieldCharges > 0) {
        this.shieldCharges -= 1; this.showBanner('장막 방어!', '공격 1회 무효');
        if(!this.coopMode||this.currentBuildId===this.localId)this.cameras.main.flash(90,130,210,255); this.updateHud(); return false;
      }
      const dmg = amount * (this.playerDamageMult || 1); this.hp -= dmg;
      this.flashPlayerSprite(this.player);
      if (Number.isFinite(sourceX) && Number.isFinite(sourceY) && this.player?.body?.enable) {
        const angle=Phaser.Math.Angle.Between(sourceX,sourceY,this.player.x,this.player.y);this.player.body.velocity.x+=Math.cos(angle)*130;this.player.body.velocity.y+=Math.sin(angle)*130;
      }
      if(!this.coopMode||this.currentBuildId===this.localId){playPlayerHurtSfx();this.cameras.main.shake(110,0.004);this.cameras.main.flash(80,180,35,35);}
      if(this.hp<=0){this.hp=0;if(this.coopMode)this.downCurrentPlayer();else this.gameOver();}
      this.updateHud(); return true;
    }
    downCurrentPlayer(){
      if(!this.coopMode||!this.player)return;
      this.playerDown=true;
      this.deathCount=(this.deathCount||0)+1;
      this.reviveProgress=0;
      this.reviveNeedMs=Math.min(6750,4800+Math.max(0,this.deathCount-1)*650);
      this.player.setAlpha(0.38);
      if(this.player.body){this.player.body.setVelocity(0,0);this.player.body.enable=false;}
      (this.poopOrbiters||[]).forEach(o=>{if(o?.active)o.destroy();});
      this.poopOrbiters=[];
      if(this.shieldVisual?.active)this.shieldVisual.setVisible(false);
      const b=this.getBuild(this.currentBuildId);
      if(b){b.down=true;b.hp=0;b.deathCount=this.deathCount;b.reviveProgress=0;b.reviveNeedMs=this.reviveNeedMs;}
      this.showBanner(`${this.charData.name} 쓰러짐!`,'파트너가 가까이 버티면 부활시킬 수 있어!');
      if(![...this.builds.values()].some(x=>!x.down&&x.hp>0))this.gameOver();
    }

    ensureReviveUi(build){
      if(!build?.sprite)return null;
      if(!build.reviveUi){
        const ring=this.add.circle(build.sprite.x,build.sprite.y,84,0x75e4ae,0.035).setStrokeStyle(2,0x75e4ae,0.28).setDepth(5);
        const bg=this.add.rectangle(build.sprite.x,build.sprite.y-34,68,8,0x1a131b,0.92).setDepth(45).setStrokeStyle(1,0xffffff,0.35);
        const bar=this.add.rectangle(build.sprite.x-33,build.sprite.y-34,0,6,0x75e4ae,1).setOrigin(0,0.5).setDepth(46);
        const text=this.add.text(build.sprite.x,build.sprite.y-48,'DOWN',{fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:'#fff0d1',stroke:'#24151c',strokeThickness:3}).setOrigin(0.5).setDepth(47);
        build.reviveUi={ring,bg,bar,text};
      }
      return build.reviveUi;
    }
    clearReviveUi(build){
      if(!build?.reviveUi)return;
      Object.values(build.reviveUi).forEach(o=>o?.destroy?.());build.reviveUi=null;
    }
    updateReviveUi(build){
      if(!build?.down){this.clearReviveUi(build);return;}
      const ui=this.ensureReviveUi(build);if(!ui)return;
      const pct=Phaser.Math.Clamp((build.reviveProgress||0)/(build.reviveNeedMs||4800),0,1);
      ui.ring?.setPosition(build.sprite.x,build.sprite.y).setAlpha(pct>0?0.10:0.045);
      ui.bg.setPosition(build.sprite.x,build.sprite.y-34);
      ui.bar.setPosition(build.sprite.x-33,build.sprite.y-34).setSize(66*pct,6);
      ui.text.setPosition(build.sprite.x,build.sprite.y-48).setText(pct>0?`구조 ${Math.round(pct*100)}%`:'DOWN · 초록 범위 안에서 구조');
    }
    reviveBuild(build){
      if(!build?.down||!build.sprite?.active)return;
      build.down=false;build.hp=Math.max(1,build.maxHp*0.50);build.reviveProgress=0;build.playerInvulnUntil=this.runTimeMs+2000;
      build.sprite.setAlpha(1);if(build.sprite.body){build.sprite.body.enable=true;build.sprite.body.setVelocity(0,0);}
      build.shadow?.setAlpha(0.20);this.clearReviveUi(build);this.updateBuildPresentation(build);this.playHealFx(build.sprite);
      if((build.majorLevels?.poopOrbit||0)>0)this.withBuild(build,()=>this.rebuildPoopOrbiters());
      this.tweens.add({targets:build.sprite,alpha:{from:0.45,to:1},duration:170,yoyo:true,repeat:5,onComplete:()=>{if(build.sprite?.active)build.sprite.setAlpha(1);}});
      this.showBanner(`${build.charData?.name||'동료'} 부활!`,build.deathCount>1?`HP 50% · 2초 무적 · 다음 구조 ${Math.round((build.reviveNeedMs||4800)/100)/10}초`:'HP 50% · 2초 무적');
    }
    updateRevives(delta){
      if(!this.coopMode||this.networkRole!=='host'||!this.builds||this.isGameOver)return;
      const builds=[...this.builds.values()];
      for(const down of builds.filter(b=>b.down)){
        const rescuers=builds.filter(b=>!b.down&&b.hp>0&&b.sprite?.active);
        let inRange=false;
        for(const rescuer of rescuers){
          if(Phaser.Math.Distance.Between(rescuer.sprite.x,rescuer.sprite.y,down.sprite.x,down.sprite.y)<=84){inRange=true;break;}
        }
        if(inRange)down.reviveProgress=Math.min(down.reviveNeedMs||4800,(down.reviveProgress||0)+delta);
        else down.reviveProgress=Math.max(0,(down.reviveProgress||0)-delta*0.45);
        this.updateReviveUi(down);
        if((down.reviveProgress||0)>=(down.reviveNeedMs||4800))this.reviveBuild(down);
      }
      builds.filter(b=>!b.down).forEach(b=>this.clearReviveUi(b));
      const local=this.getLocalBuild();if(local)this.loadBuild(local);
    }
    onPlayerEnemyContact(targetPlayer, enemy) {
      if (!enemy.active || enemy.getData('dead') || this.isGameOver) return;
      if(this.coopMode){if(this.networkRole!=='host')return;const id=targetPlayer?.netPlayerId,b=this.getBuild(id);if(!b||b.down)return;enemy.nextTouchBy=enemy.nextTouchBy||{};if(this.runTimeMs<(enemy.nextTouchBy[id]||0))return;enemy.nextTouchBy[id]=this.runTimeMs+650;const dmg=enemy.contactDamage*(enemy.contactDamageMult||1);return this.withBuild(b,()=>this.applyPlayerDamage(dmg,enemy.x,enemy.y,380));}
      if (this.runTimeMs < enemy.nextTouchAt) return; enemy.nextTouchAt=this.runTimeMs+650; this.applyPlayerDamage(enemy.contactDamage*(enemy.contactDamageMult||1),enemy.x,enemy.y,380);
    }
    onEnemyProjectileHit(targetPlayer, bullet) {
      if (!bullet.active || this.isGameOver) return;
      if(this.coopMode){if(this.networkRole!=='host')return;const b=this.getBuild(targetPlayer?.netPlayerId);if(!b||b.down)return;return this.withBuild(b,()=>{const hit=this.applyPlayerDamage(bullet.damage||10,bullet.x,bullet.y,bullet.strong?250:180);if(hit||this.shieldCharges>=0)bullet.destroy();});}
      const hit=this.applyPlayerDamage(bullet.damage||10,bullet.x,bullet.y,bullet.strong?250:180);if(hit||this.shieldCharges>=0)bullet.destroy();
    }

    spawnEnemyBullet(x, y, angle, speed, damage, kind = 'enemy', lifeMs = 4200) {
      const texture = kind === 'raid' ? 'raidBullet' : kind === 'boss' ? 'bossBullet' : 'enemyBullet';
      const b = this.enemyProjectiles.create(x, y, texture).setDepth(kind === 'raid' ? 29 : kind === 'boss' ? 28 : 27);
      b.damage = damage;
      b.kind = kind;
      b.strong = kind === 'boss' || kind === 'raid';
      b.spawnAt = this.runTimeMs;
      b.lifeMs = lifeMs;
      b.setRotation(angle);
      this.physics.velocityFromRotation(angle, speed, b.body.velocity);
      if (kind === 'raid') b.body.setCircle(6, 3, 3);
      else if(kind === 'boss') b.body.setCircle(5, 3, 3);
      else b.body.setCircle(4, 2, 2);
      return b;
    }

    nearestActivePlayerTo(x,y){if(!this.coopMode||!this.builds)return this.player;let best=null,bestD=Infinity;this.builds.forEach(b=>{if(b.down||!b.sprite?.active)return;const d=Phaser.Math.Distance.Squared(x,y,b.sprite.x,b.sprite.y);if(d<bestD){bestD=d;best=b.sprite;}});return best||this.player;}
    fireEliteShot(enemy,targetPlayer=null) {
      const target=targetPlayer||this.nearestActivePlayerTo(enemy.x,enemy.y)||this.player;
      const a = Phaser.Math.Angle.Between(enemy.x, enemy.y, target.x, target.y);
      if(enemy.enemyRole==='elite'){
        const minutes=this.runTimeMs/60000,mut=enemy.eliteMutation;
        let count=minutes>=15?2:1,spreadStep=0.11,speed=185,damageMult=0.72;
        if(mut==='swift'){count=2;spreadStep=0.085;speed=220;damageMult=0.62;}
        if(mut==='armored'){count=1;speed=160;damageMult=0.82;}
        if(mut==='support'){count=3;spreadStep=0.18;speed=170;damageMult=0.56;}
        for(let i=0;i<count;i++){
          const spread=count===1?0:(i-(count-1)/2)*spreadStep;
          this.spawnEnemyBullet(enemy.x,enemy.y,a+spread,speed,enemy.contactDamage*damageMult,'enemy');
        }
        playEnemyShotSfx(false);return;
      }
      const count=enemy.bossFanCount || (this.coopMode?9:3);
      const speed=225*(enemy.bossShotSpeedMult||1);
      for (let i = 0; i < count; i++) {
        const spread = count === 1 ? 0 : (i - (count - 1) / 2) * (this.coopMode ? 0.105 : 0.145);
        this.spawnEnemyBullet(enemy.x, enemy.y, a + spread, speed, enemy.contactDamage * 0.72, 'boss');
      }
      const ringCount=enemy.bossRingCount||0;
      if(ringCount>0){
        enemy.shotPhase=(enemy.shotPhase||0)+0.22;
        for(let i=0;i<ringCount;i++){
          const ra=enemy.shotPhase+(Math.PI*2*i)/ringCount;
          this.spawnEnemyBullet(enemy.x,enemy.y,ra,150*(enemy.bossShotSpeedMult||1),enemy.contactDamage*0.50,'boss',5200);
        }
      }
      playEnemyShotSfx(true);
    }

    activeRaidTargets() {
      if(this.coopMode&&this.builds)return [...this.builds.values()].filter(b=>!b.down&&b.hp>0&&b.sprite?.active).map(b=>b.sprite);
      return this.playerDown||!this.player?.active?[]:[this.player];
    }

    raidBossKind(enemy) {
      return ['grape','choco','onion'][Math.max(0,enemy?.raidIndex||0)%3];
    }

    predictedAimAngle(enemy,target,leadMs=450,leadFactor=0.68) {
      if(!target)return 0;
      const vx=target.body?.velocity?.x||0,vy=target.body?.velocity?.y||0;
      const dt=(leadMs/1000)*leadFactor;
      const px=target.x+vx*dt,py=target.y+vy*dt;
      return Phaser.Math.Angle.Between(enemy.x,enemy.y,px,py);
    }

    scheduleRaidAction(enemy,delay,fn) {
      const phaseAtSchedule=!!enemy?.raidPhase2;
      this.time.delayedCall(delay,()=>{
        if(this.isGameOver||!this.raidBossActive||!enemy?.active||enemy.getData('dead'))return;
        if(!!enemy.raidPhase2!==phaseAtSchedule)return;
        fn();
      });
    }

    spawnRaidRing(enemy,{count=16,speed=180,damage=12,offset=0,gapCenter=null,gapWidth=0,lifeMs=5400,speedPattern=null}={}) {
      if(!enemy?.active)return;
      for(let i=0;i<count;i++){
        const a=offset+(Math.PI*2*i)/count;
        if(Number.isFinite(gapCenter)&&gapWidth>0){
          const diff=Math.abs(Phaser.Math.Angle.Wrap(a-gapCenter));
          if(diff<gapWidth*0.5)continue;
        }
        const sp=Array.isArray(speedPattern)&&speedPattern.length?speedPattern[i%speedPattern.length]:speed;
        this.spawnEnemyBullet(enemy.x,enemy.y,a,sp,damage,'raid',lifeMs);
      }
    }

    fireRaidFanAt(enemy,target,{count=5,spread=0.09,speed=260,damage=12,predictMs=0,angleOffset=0}={}) {
      if(!enemy?.active||!target?.active)return;
      const base=(predictMs>0?this.predictedAimAngle(enemy,target,predictMs):Phaser.Math.Angle.Between(enemy.x,enemy.y,target.x,target.y))+angleOffset;
      for(let i=0;i<count;i++){
        const a=base+(i-(count-1)/2)*spread;
        this.spawnEnemyBullet(enemy.x,enemy.y,a,speed,damage,'raid',4500);
      }
    }

    selectRaidPattern(enemy) {
      const kind=this.raidBossKind(enemy),phase=enemy.raidPhase2?2:1;
      const target=this.nearestActivePlayerTo(enemy.x,enemy.y)||this.player;
      const dist=target?Phaser.Math.Distance.Between(enemy.x,enemy.y,target.x,target.y):999;
      const all=(TRUE_BOSS_PATTERNS[kind]||[]).filter(p=>p.phase===phase);
      let candidates=all.filter(p=>dist>=(p.minDistance||0)&&(p.condition!=='canRush'||(!(enemy.rushTelegraphUntil>this.runTimeMs)&&!(enemy.rushUntil>this.runTimeMs))));
      if(!candidates.length)candidates=all.slice();
      const history=enemy.raidPatternHistory||[];
      const recent=new Set(history.slice(-2));
      const fresh=candidates.filter(p=>!recent.has(p.id));
      if(fresh.length)candidates=fresh;
      else if(candidates.length>1){
        const last=history[history.length-1];
        const noLast=candidates.filter(p=>p.id!==last);
        if(noLast.length)candidates=noLast;
      }
      let total=candidates.reduce((n,p)=>n+(p.weight||1),0),roll=Math.random()*Math.max(1,total),chosen=candidates[0];
      for(const p of candidates){roll-=p.weight||1;if(roll<=0){chosen=p;break;}}
      enemy.raidPatternHistory=[...history,chosen?.id].filter(Boolean).slice(-4);
      enemy.raidPatternId=chosen?.id||'';
      return chosen;
    }

    executeRaidPattern(enemy,def) {
      const targets=this.activeRaidTargets();
      const target=this.nearestActivePlayerTo(enemy.x,enemy.y)||targets[0]||this.player;
      const base=target?Phaser.Math.Angle.Between(enemy.x,enemy.y,target.x,target.y):0;
      const bossDmg=11+this.raidBossCount*1.45;
      this.raidShotPhase+=enemy.raidPhase2?0.41:0.29;
      const coop=this.coopMode;
      const fireTargets=(fn)=>{(targets.length?targets:[target]).filter(Boolean).forEach(fn);};

      switch(def?.execute){
        // ===== 거대 포도 =====
        case 'grapeSpiralRing': {
          const gap=base+(Math.sin(this.raidShotPhase)>=0?0.62:-0.62);
          this.spawnRaidRing(enemy,{count:coop?22:18,speed:185,damage:bossDmg,offset:this.raidShotPhase,gapCenter:gap,gapWidth:0.50});
          break;
        }
        case 'grapePredictFan': {
          fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:coop?5:5,spread:0.085,speed:268,damage:bossDmg+1.5,predictMs:520}));
          break;
        }
        case 'grapeStaggeredRings': {
          const gap1=base-0.55,gap2=base+0.62;
          this.spawnRaidRing(enemy,{count:coop?18:14,speed:138,damage:bossDmg-1,offset:this.raidShotPhase,gapCenter:gap1,gapWidth:0.58,lifeMs:5800});
          this.scheduleRaidAction(enemy,720,()=>this.spawnRaidRing(enemy,{count:coop?16:12,speed:232,damage:bossDmg+0.5,offset:this.raidShotPhase+0.27,gapCenter:gap2,gapWidth:0.52,lifeMs:4800}));
          break;
        }
        case 'grapeRingPredict': {
          this.spawnRaidRing(enemy,{count:coop?20:16,speed:150,damage:bossDmg,offset:this.raidShotPhase,gapCenter:base-0.48,gapWidth:0.48,lifeMs:5800});
          this.scheduleRaidAction(enemy,650,()=>fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:coop?5:5,spread:0.08,speed:286,damage:bossDmg+1.8,predictMs:470})));
          break;
        }
        case 'grapeDashBurst': {
          if(!this.beginRaidRushTelegraph(enemy,target,true))fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:5,spread:0.08,speed:282,damage:bossDmg+1.5,predictMs:420}));
          break;
        }
        case 'grapeShiftedGap': {
          this.spawnRaidRing(enemy,{count:coop?20:16,speed:172,damage:bossDmg,offset:this.raidShotPhase,gapCenter:base-0.72,gapWidth:0.46});
          this.scheduleRaidAction(enemy,620,()=>{
            const t=this.nearestActivePlayerTo(enemy.x,enemy.y)||target;
            const b=t?Phaser.Math.Angle.Between(enemy.x,enemy.y,t.x,t.y):base;
            this.spawnRaidRing(enemy,{count:coop?18:14,speed:238,damage:bossDmg+1,offset:-this.raidShotPhase*0.7,gapCenter:b+0.72,gapWidth:0.46,lifeMs:4700});
          });
          break;
        }

        // ===== 거대 초콜릿 =====
        case 'chocoFan': {
          fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:coop?7:9,spread:coop?0.10:0.115,speed:248,damage:bossDmg+2,predictMs:170}));
          break;
        }
        case 'chocoSideClamp': {
          const lobes=coop?4:3;
          for(const side of [-1,1])for(let i=0;i<lobes;i++){
            const a=base+side*(0.52+i*0.10);
            this.spawnEnemyBullet(enemy.x,enemy.y,a,205,bossDmg+0.5,'raid',5000);
          }
          break;
        }
        case 'chocoDelayedLock': {
          fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:5,spread:0.075,speed:240,damage:bossDmg+1,predictMs:280}));
          this.scheduleRaidAction(enemy,540,()=>fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:5,spread:0.072,speed:292,damage:bossDmg+1.8,predictMs:500})));
          break;
        }
        case 'chocoSweep': {
          [-0.20,0,0.20].forEach((off,idx)=>this.scheduleRaidAction(enemy,idx*230,()=>fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:5,spread:0.075,speed:266+idx*9,damage:bossDmg+1.5,predictMs:320,angleOffset:off}))));
          break;
        }
        case 'chocoCrossfire': {
          const lobes=coop?4:3;
          for(const side of [-1,1])for(let i=0;i<lobes;i++)this.spawnEnemyBullet(enemy.x,enemy.y,base+side*(0.48+i*0.11),218,bossDmg+1,'raid',5000);
          this.scheduleRaidAction(enemy,600,()=>fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:coop?5:7,spread:0.08,speed:298,damage:bossDmg+2,predictMs:480})));
          break;
        }
        case 'chocoBurstPair': {
          fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:coop?6:7,spread:0.095,speed:254,damage:bossDmg+1.4,predictMs:220}));
          this.scheduleRaidAction(enemy,470,()=>fireTargets(t=>this.fireRaidFanAt(enemy,t,{count:5,spread:0.07,speed:305,damage:bossDmg+2.2,predictMs:500})));
          break;
        }

        // ===== 거대 양파 =====
        case 'onionSpiral': {
          this.spawnRaidRing(enemy,{count:coop?16:12,damage:bossDmg,offset:this.raidShotPhase,speedPattern:[150,215],lifeMs:5600});
          break;
        }
        case 'onionReverse': {
          this.spawnRaidRing(enemy,{count:coop?18:14,speed:188,damage:bossDmg+0.5,offset:-this.raidShotPhase*0.9,gapCenter:base+0.52,gapWidth:0.38});
          break;
        }
        case 'onionPulse': {
          this.spawnRaidRing(enemy,{count:coop?14:10,speed:132,damage:bossDmg-0.5,offset:this.raidShotPhase,lifeMs:6000});
          this.scheduleRaidAction(enemy,760,()=>this.spawnRaidRing(enemy,{count:coop?14:10,speed:246,damage:bossDmg+1.3,offset:this.raidShotPhase+Math.PI/(coop?14:10),lifeMs:4700}));
          break;
        }
        case 'onionTriSpeed': {
          this.spawnRaidRing(enemy,{count:coop?20:15,damage:bossDmg+0.6,offset:this.raidShotPhase,gapCenter:base-0.45,gapWidth:0.34,speedPattern:[128,192,252],lifeMs:5800});
          break;
        }
        case 'onionReverseDouble': {
          this.spawnRaidRing(enemy,{count:coop?16:12,speed:148,damage:bossDmg,offset:this.raidShotPhase,gapCenter:base-0.55,gapWidth:0.40,lifeMs:6100});
          this.scheduleRaidAction(enemy,660,()=>this.spawnRaidRing(enemy,{count:coop?16:12,speed:238,damage:bossDmg+1.5,offset:-this.raidShotPhase*0.85,gapCenter:base+0.58,gapWidth:0.40,lifeMs:5000}));
          break;
        }
        case 'onionGapShift': {
          this.spawnRaidRing(enemy,{count:coop?18:14,speed:170,damage:bossDmg,offset:this.raidShotPhase,gapCenter:base-0.78,gapWidth:0.52});
          this.scheduleRaidAction(enemy,600,()=>{
            const t=this.nearestActivePlayerTo(enemy.x,enemy.y)||target;
            const b=t?Phaser.Math.Angle.Between(enemy.x,enemy.y,t.x,t.y):base;
            this.spawnRaidRing(enemy,{count:coop?18:14,speed:228,damage:bossDmg+1.2,offset:this.raidShotPhase+0.22,gapCenter:b+0.78,gapWidth:0.52});
          });
          break;
        }
        default:
          this.spawnRaidRing(enemy,{count:12,speed:180,damage:bossDmg,offset:this.raidShotPhase});
      }
    }

    fireRaidPattern(enemy) {
      if (!enemy?.active || enemy.getData('dead')) return 1500;
      const def=this.selectRaidPattern(enemy);
      this.executeRaidPattern(enemy,def);
      playEnemyShotSfx(true);
      this.cameras.main.shake(55,0.002);
      const escalation=Math.max(0.82,1-Math.max(0,this.raidBossCount-1)*0.025);
      const coopMult=this.coopMode?0.92:1;
      return Math.max(900,(def?.cooldown||1500)*escalation*coopMult);
    }

    destroyRaidRushTelegraph(enemy) {
      if(enemy?.raidTelegraph?.active)enemy.raidTelegraph.destroy();
      if(enemy)enemy.raidTelegraph=null;
    }

    beginRaidRushTelegraph(enemy,target=null,forced=false) {
      if(!enemy?.active||enemy.getData('dead'))return false;
      if((enemy.rushTelegraphUntil||0)>this.runTimeMs||(enemy.rushUntil||0)>this.runTimeMs)return false;
      const t=target||this.nearestActivePlayerTo(enemy.x,enemy.y)||this.player;
      if(!t)return false;
      enemy.rushAngle=this.predictedAimAngle(enemy,t,forced?260:120,0.45);
      enemy.rushTelegraphUntil=this.runTimeMs+(enemy.raidPhase2?560:640);
      enemy.rushPostDone=false;
      const distance=176;
      const w=this.add.image(enemy.x+Math.cos(enemy.rushAngle)*distance,enemy.y+Math.sin(enemy.rushAngle)*distance,'rushWarning').setDepth(25).setRotation(enemy.rushAngle).setScale(1.6,1).setAlpha(0.8);
      enemy.raidTelegraph=w;
      this.showBanner('돌진 예고!','붉은 선을 보고 방향을 바꿔!');
      return true;
    }

    finishRaidRush(enemy) {
      if(!enemy?.active||enemy.rushPostDone)return;
      enemy.rushPostDone=true;
      this.destroyRaidRushTelegraph(enemy);
      const target=this.nearestActivePlayerTo(enemy.x,enemy.y)||this.player;
      const base=target?Phaser.Math.Angle.Between(enemy.x,enemy.y,target.x,target.y):enemy.rushAngle||0;
      this.spawnRaidRing(enemy,{count:this.coopMode?12:10,speed:178,damage:10+this.raidBossCount*1.35,offset:(enemy.rushAngle||0)+0.18,gapCenter:base,gapWidth:0.55,lifeMs:4800});
      const minRush=this.coopMode?3000:3600,maxRush=this.coopMode?4500:5400;
      const phaseCut=enemy.raidPhase2?500:0;
      enemy.nextRushAt=this.runTimeMs+Phaser.Math.Between(Math.max(2200,minRush-phaseCut),Math.max(3200,maxRush-phaseCut));
      enemy.nextShotAt=Math.max(enemy.nextShotAt||0,this.runTimeMs+550);
    }

    updateRaidRushState(enemy,targetPlayer,baseSpeed) {
      if(!enemy?.active)return false;
      if((enemy.rushTelegraphUntil||0)>0){
        if(this.runTimeMs<enemy.rushTelegraphUntil){
          enemy.body.setVelocity(0,0);
          const distance=176;
          enemy.raidTelegraph?.setPosition(enemy.x+Math.cos(enemy.rushAngle||0)*distance,enemy.y+Math.sin(enemy.rushAngle||0)*distance).setRotation(enemy.rushAngle||0);
          return true;
        }
        enemy.rushTelegraphUntil=0;
        this.destroyRaidRushTelegraph(enemy);
        enemy.rushUntil=this.runTimeMs+(enemy.raidPhase2?900:820);
      }
      if((enemy.rushUntil||0)>0){
        if(this.runTimeMs<enemy.rushUntil){
          const mult=enemy.raidPhase2?3.0:2.85;
          enemy.body.setVelocity(Math.cos(enemy.rushAngle||0)*baseSpeed*mult,Math.sin(enemy.rushAngle||0)*baseSpeed*mult);
          return true;
        }
        enemy.rushUntil=0;
        this.finishRaidRush(enemy);
      }
      if(this.runTimeMs>=(enemy.nextRushAt||Infinity)){
        this.beginRaidRushTelegraph(enemy,targetPlayer,false);
        return true;
      }
      return false;
    }

    updateEnemyAI() {
      const activeEnemies=this.enemies.getChildren().filter(e=>e.active&&!e.getData('dead'));
      const supportElites=activeEnemies.filter(e=>e.enemyRole==='elite'&&e.eliteMutation==='support');
      const minutes=this.runTimeMs/60000;
      activeEnemies.forEach(e => {
        if (e.shrinkUntil && this.runTimeMs >= e.shrinkUntil) {
          e.contactDamageMult = 1;
          e.shrinkUntil = 0;
          e.setScale(e.baseDisplayScale || 1);
        }

        if (e.eliteFace?.active) {
          e.eliteFace.setPosition(e.x, e.y);
          e.eliteFace.setFlipX(e.flipX);
        }
        if(e.eliteMutationText?.active)e.eliteMutationText.setPosition(e.x,e.y-24);

        const targetPlayer=this.nearestActivePlayerTo(e.x,e.y)||this.player;
        const a = Phaser.Math.Angle.Between(e.x, e.y, targetPlayer.x, targetPlayer.y);
        let speed = e.speed;
        if(e.enemyRole==='normal'&&supportElites.some(s=>Phaser.Math.Distance.Squared(e.x,e.y,s.x,s.y)<=180*180))speed*=1.12;
        if (this.runTimeMs < (e.stunUntil || 0)) speed = 0;
        else if (this.runTimeMs < (e.slowUntil || 0)) speed *= (e.slowMult || 0.65);
        let raidBusy=false;
        if (e.enemyRole === 'raidBoss') {
          raidBusy=this.updateRaidRushState(e,targetPlayer,speed);
          if(!raidBusy){
            const d = Phaser.Math.Distance.Between(e.x, e.y, targetPlayer.x, targetPlayer.y);
            if (d > 360) speed *= 1.55;
            if (d < 190) speed *= 0.55;
            e.body.setVelocity(Math.cos(a) * speed, Math.sin(a) * speed);
          }
        } else {
          e.body.setVelocity(Math.cos(a) * speed, Math.sin(a) * speed);
        }
        e.setFlipX(targetPlayer.x < e.x);

        if ((e.enemyRole === 'elite' || e.enemyRole === 'boss' || e.enemyRole === 'raidBoss') && this.runTimeMs >= e.nextShotAt) {
          if (e.enemyRole === 'raidBoss') {
            if(!raidBusy){
              const cooldown=this.fireRaidPattern(e);
              e.nextShotAt = this.runTimeMs + cooldown;
            }
          } else if(e.enemyRole==='boss') {
            this.fireEliteShot(e,targetPlayer);
            const mult=e.bossShotIntervalMult||1;
            const min=(this.coopMode?950:1500)*mult,max=(this.coopMode?1450:2300)*mult;
            e.nextShotAt=this.runTimeMs+Phaser.Math.Between(Math.round(min),Math.round(max));
          } else {
            this.fireEliteShot(e,targetPlayer);
            const pressure=Math.max(0.66,1-minutes*0.018);
            const mult=(e.eliteShotMult||1)*pressure;
            e.nextShotAt=this.runTimeMs+Phaser.Math.Between(Math.round(2200*mult),Math.round(3400*mult));
          }
        }
      });
    }

    updateGems() {
      if(this.coopMode&&this.networkRole==='host'&&this.builds){
        this.gems.getChildren().forEach(g=>{if(!g.active)return;const globalMagnet=this.runTimeMs<this.magnetUntil;let best=null,bestDist=Infinity,bestRange=135;this.builds.forEach(b=>{if(b.down||!b.sprite?.active)return;const d=Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,g.x,g.y),r=b.gemMagnetRange||135;if((globalMagnet||g.magnetized||d<r)&&d<bestDist){best=b;bestDist=d;bestRange=r;}});if(best){g.magnetized=true;const a=Phaser.Math.Angle.Between(g.x,g.y,best.sprite.x,best.sprite.y),sp=globalMagnet?520:Phaser.Math.Clamp(190+(bestRange-Math.min(bestRange,bestDist))*2.2,190,460);g.body.setVelocity(Math.cos(a)*sp,Math.sin(a)*sp);}else g.body.setVelocity(0,0);});return;
      }
      const px = this.player.x, py = this.player.y;
      this.gems.getChildren().forEach(g => {
        if (!g.active) return;
        const dist = Phaser.Math.Distance.Between(px, py, g.x, g.y);
        const globalMagnet = this.runTimeMs < this.magnetUntil;
        const range = this.gemMagnetRange || 135;
        if (globalMagnet || g.magnetized || dist < range) {
          g.magnetized = true;
          const a = Phaser.Math.Angle.Between(g.x, g.y, px, py);
          const sp = globalMagnet ? 520 : Phaser.Math.Clamp(190 + (range - Math.min(range, dist)) * 2.2, 190, 460);
          g.body.setVelocity(Math.cos(a) * sp, Math.sin(a) * sp);
        } else g.body.setVelocity(0, 0);
      });
    }

    updateProjectiles() {
      this.projectiles.getChildren().forEach(p => {
        if (!p.active) return;
        if (p.kind === 'magicMissile') {
          const target = this.nearestEnemy(p.x, p.y, 900);
          if (target) {
            const a = Phaser.Math.Angle.Between(p.x, p.y, target.x, target.y);
            const speed = 260 + (p.skillLevel || 1) * 18;
            p.body.velocity.x = Phaser.Math.Linear(p.body.velocity.x, Math.cos(a) * speed, 0.08);
            p.body.velocity.y = Phaser.Math.Linear(p.body.velocity.y, Math.sin(a) * speed, 0.08);
            p.rotation = Math.atan2(p.body.velocity.y, p.body.velocity.x);
          }
        }
        if (this.runTimeMs - (p.spawnAt || 0) > (p.lifeMs || 1800)) p.destroy();
      });
      this.enemyProjectiles.getChildren().forEach(p => {
        if (!p.active) return;
        if (this.runTimeMs - (p.spawnAt || 0) > (p.lifeMs || 4200)) p.destroy();
      });
    }

    updateSkills(delta) {
      const lv = this.skillLevels;
      if (lv.magicMissile) {
        this.skillTimers.magicMissile += delta;
        const st=treasureSkillStats('magicMissile',lv.magicMissile);
        if (this.skillTimers.magicMissile >= st.interval) {
          this.skillTimers.magicMissile = 0;
          this.castMagicMissiles(lv.magicMissile);
        }
      }
      if (lv.veil) {
        this.skillTimers.veil += delta;
        const st=treasureSkillStats('veil',lv.veil);
        if (this.skillTimers.veil >= st.interval) {
          this.skillTimers.veil = 0;
          this.shieldCharges = Math.min(st.maxCharges, this.shieldCharges + 1);
          this.updateHud();
        }
      }
      if (lv.sword) {
        this.skillTimers.sword += delta;
        const st=treasureSkillStats('sword',lv.sword);
        if (this.skillTimers.sword >= st.interval) {
          this.skillTimers.sword = 0;
          this.castSword(lv.sword);
        }
      }
      if (lv.hellConductor) {
        this.skillTimers.hellConductor += delta;
        const st=treasureSkillStats('hellConductor',lv.hellConductor);
        if (this.skillTimers.hellConductor >= st.interval) {
          this.skillTimers.hellConductor = 0;
          this.castFireRing(lv.hellConductor);
        }
      }
      if (lv.bulletBarrage) {
        this.skillTimers.bulletBarrage += delta;
        const st=treasureSkillStats('bulletBarrage',lv.bulletBarrage);
        if (this.skillTimers.bulletBarrage >= st.interval) {
          this.skillTimers.bulletBarrage = 0;
          this.castBulletBarrage(lv.bulletBarrage);
        }
      }
      if (this.shockwaveLevel > 0) {
        this.shockwaveTimer += delta;
        const interval = Math.max(4200, 8000 - (this.shockwaveLevel - 1) * 650);
        if (this.shockwaveTimer >= interval) {
          this.shockwaveTimer = 0;
          this.castAugmentShockwave();
        }
      }
    }

    castAugmentShockwave() {
      const level = Math.max(1, this.shockwaveLevel || 1);
      const radius = 125 + level * 18;
      const damage = this.attackPower * (1.0 + level * 0.18);
      const ring = this.add.image(this.player.x, this.player.y, 'shockwave').setDepth(16).setScale(0.5).setAlpha(0.9);
      this.tweens.add({ targets: ring, scale: radius / 28, alpha: 0, duration: 360, onComplete: () => ring.destroy() });
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) <= radius) this.damageEnemy(e, damage, 'augmentShockwave');
      });
      noise(0.10, 0.05, 480); tone(110, 0.11, 'triangle', 0.04, 65);
    }

    castMagicMissiles(level) {
      const st=treasureSkillStats('magicMissile',level),count=st.count;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const p = this.projectiles.create(this.player.x + Math.cos(a) * 24, this.player.y + Math.sin(a) * 24, 'magicMissile');
        p.ownerId = this.currentBuildId || this.localId || 'solo'; p.skillLevel = level;
        p.kind = 'magicMissile'; p.damage = this.attackPower * st.damageMult; p.hitSet = new Set();
        p.spawnAt = this.runTimeMs; p.lifeMs = 3500; p.setDepth(13);
        p.body.setVelocity(Math.cos(a) * 160, Math.sin(a) * 160);
      }
    }

    castSword(level) {
      const damage = this.attackPower * treasureSkillStats('sword',level).damageMult;
      [-48, 48].forEach(offset => {
        const s = this.skillHitboxes.create(this.player.x, this.player.y + offset, 'slash').setDepth(15);
        s.ownerId = this.currentBuildId || this.localId || 'solo';
        s.damage = damage; s.skillKind = 'sword'; s.hitSet = new Set();
        s.body.setSize(18, 64);
        this.tweens.add({ targets: s, alpha: 0, scaleY: 1.15, duration: 230, onComplete: () => s.destroy() });
      });
    }

    castFireRing(level) {
      const st=treasureSkillStats('hellConductor',level),count=st.count,radius=st.radius;
      const damage = this.attackPower * st.damageMult;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const f = this.skillHitboxes.create(this.player.x + Math.cos(a) * radius, this.player.y + Math.sin(a) * radius, 'firePillar').setDepth(14);
        f.ownerId = this.currentBuildId || this.localId || 'solo';
        f.damage = damage; f.skillKind = 'fire'; f.hitSet = new Set();
        f.body.setSize(18, 30);
        f.setScale(0.8);
        this.tweens.add({ targets: f, scale: 1.3, alpha: 0, duration: 520, ease: 'Quad.easeOut', onComplete: () => f.destroy() });
      }
    }

    castBulletBarrage(level) {
      const target = this.nearestEnemy();
      if (!target) return;
      const st=treasureSkillStats('bulletBarrage',level);
      const ownerId=this.currentBuildId||this.localId||'solo'; const ownerSprite=this.player; const damage=this.attackPower*st.damageMult;
      for (let i = 0; i < st.count; i++) {
        this.time.delayedCall(i * 90, () => {
          if (!target.active || target.getData('dead') || !ownerSprite?.active) return;
          const p = this.projectiles.create(ownerSprite.x, ownerSprite.y, 'bullet').setDepth(13);
          p.ownerId=ownerId; p.kind='bullet'; p.damage=damage; p.hitSet=new Set(); p.spawnAt=this.runTimeMs; p.lifeMs=1400;
          const a=Phaser.Math.Angle.Between(ownerSprite.x,ownerSprite.y,target.x,target.y); p.rotation=a; this.physics.velocityFromRotation(a,480,p.body.velocity);
        });
      }
    }

    updateShieldVisual() {
      if (this.shieldCharges > 0) {
        if (!this.shieldVisual || !this.shieldVisual.active) {
          this.shieldVisual = this.add.circle(this.player.x, this.player.y, 28, 0x83d7f0, 0.12).setStrokeStyle(2, 0xa9efff, 0.8).setDepth(11);
          this.tweens.add({ targets: this.shieldVisual, alpha: { from: 0.35, to: 0.12 }, duration: 650, yoyo: true, repeat: -1 });
        }
        this.shieldVisual.setVisible(true).setPosition(this.player.x, this.player.y);
      } else if (this.shieldVisual) {
        this.shieldVisual.destroy(); this.shieldVisual = null;
      }
    }

    readLocalMoveInput(){return{left:!!(this.cursors?.left?.isDown||this.keys?.left?.isDown),right:!!(this.cursors?.right?.isDown||this.keys?.right?.isDown),up:!!(this.cursors?.up?.isDown||this.keys?.up?.isDown),down:!!(this.cursors?.down?.isDown||this.keys?.down?.isDown)};}
    setRemoteInput(playerId,input){if(this.networkRole!=='host'||!this.getBuild(playerId))return;this.remoteInput={left:!!input.left,right:!!input.right,up:!!input.up,down:!!input.down};}
    runPlayerBuildTick(build,input,delta){
      if(!build||!build.sprite?.active)return;
      if(build.down){
        this.withBuild(build,()=>{this.updatePersistentMajorZones();if(this.shieldVisual?.active)this.shieldVisual.setVisible(false);});
        this.updateBuildPresentation(build);
        return;
      }
      this.withBuild(build,()=>{let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);const len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;const moving=Math.abs(dx)+Math.abs(dy)>0.01;if(moving)this.facingAngle=Math.atan2(dy,dx);if(this.player.body?.enable)this.player.body.setVelocity(dx*this.moveSpeed,dy*this.moveSpeed);if(dx!==0)this.player.setFlipX(dx<0);this.updateSkills(delta);this.updateMajorAugments(delta,moving);this.updateShieldVisual();this.basicTimer+=delta;if(this.basicTimer>=this.basicCooldown){this.basicTimer=0;this.fireBasicProjectile();}});
      this.updateBuildPresentation(build);
    }
    entityNetId(o,prefix='e'){if(!o.netId)o.netId=`${prefix}${this.netIdCounter++}`;return o.netId;}
    networkInterestPoints(){
      if(!this.coopMode||!this.builds)return this.player?[{x:this.player.x,y:this.player.y}]:[];
      return [...this.builds.values()].filter(b=>!b.down&&b.sprite?.active).map(b=>({x:b.sprite.x,y:b.sprite.y}));
    }
    isNetworkRelevantPoint(x,y,radius=1050){
      const r2=radius*radius;
      const points=this._netInterestPoints||this.networkInterestPoints();
      if(!points.length)return true;
      return points.some(p=>Phaser.Math.Distance.Squared(x,y,p.x,p.y)<=r2);
    }
    serializeGroup(group,prefix,kind='generic',radius=1050){
      const out=[];
      group.getChildren().forEach(o=>{
        if(!o.active)return;
        const force=kind==='enemy'&&(o.enemyRole==='boss'||o.enemyRole==='raidBoss');
        if(!force&&!this.isNetworkRelevantPoint(o.x,o.y,radius))return;
        const d={i:this.entityNetId(o,prefix),x:Math.round(o.x),y:Math.round(o.y),t:o.texture?.key||null};
        const rot=o.rotation||0;if(Math.abs(rot)>0.001)d.r=Math.round(rot*100)/100;
        const sx=o.scaleX||1,sy=o.scaleY||sx;if(Math.abs(sx-1)>0.001)d.sx=Math.round(sx*100)/100;if(Math.abs(sy-sx)>0.001)d.sy=Math.round(sy*100)/100;
        if(o.flipX)d.f=1;
        if(kind==='enemy'){
          if(o.enemyRole)d.ro=o.enemyRole;
          if(o.eliteMutation)d.mu=o.eliteMutation;
          if(o.enemyRole==='boss'||o.enemyRole==='raidBoss'){d.h=Math.round(o.hp||0);d.m=Math.round(o.maxHp||0);}
          if(o.enemyRole==='boss'&&o.bossIndex)d.bi=o.bossIndex;
          if(o.enemyRole==='raidBoss'){if(o.raidName)d.rn=o.raidName;if(o.raidPhase2)d.p2=1;}
        }
        if(kind==='item'&&o.itemType)d.it=o.itemType;
        return out.push(d);
      });
      return out;
    }
    buildNetworkSnapshot(){
      if(!this.coopMode||this.networkRole!=='host')return null;
      const cur=this.getBuild(this.currentBuildId);if(cur)this.saveBuild(cur);
      this._netInterestPoints=this.networkInterestPoints();
      const players=[...this.builds.values()].map(b=>({...this.buildSummary(b),x:Math.round(b.sprite?.x||0),y:Math.round(b.sprite?.y||0),flipX:!!b.sprite?.flipX,alpha:b.sprite?.alpha??1}));
      const extras=[];
      this.builds.forEach(b=>{
        (b.poopOrbiters||[]).forEach((o,i)=>{if(o?.active&&this.isNetworkRelevantPoint(o.x,o.y,900))extras.push({id:`poop-${b.id}-${i}`,kind:'image',texture:'poopOrbit',x:Math.round(o.x),y:Math.round(o.y),scale:Math.round((o.scaleX||1)*100)/100,alpha:o.alpha??1});});
        (b.gasClouds||[]).forEach((z,i)=>{if(z.obj?.active&&this.isNetworkRelevantPoint(z.x,z.y,900))extras.push({id:`gas-${b.id}-${i}`,kind:'circle',x:Math.round(z.x),y:Math.round(z.y),radius:Math.round(z.radius),color:0xe7d84d,alpha:z.obj.alpha??0.12});});
        (b.territoryZones||[]).forEach((z,i)=>{if(z.obj?.active&&this.isNetworkRelevantPoint(z.x,z.y,900))extras.push({id:`zone-${b.id}-${i}`,kind:'circle',x:Math.round(z.x),y:Math.round(z.y),radius:Math.round(z.radius),color:0xe8ce48,alpha:z.obj.alpha??0.13});});
      });
      this.enemies.getChildren().forEach(e=>{
        if(e?.active&&e.enemyRole==='raidBoss'&&e.raidTelegraph?.active){
          extras.push({id:`rush-${this.entityNetId(e,'e')}`,kind:'image',texture:'rushWarning',x:Math.round(e.raidTelegraph.x),y:Math.round(e.raidTelegraph.y),rotation:Math.round((e.raidTelegraph.rotation||0)*100)/100,scaleX:Math.round((e.raidTelegraph.scaleX||1)*100)/100,scaleY:Math.round((e.raidTelegraph.scaleY||1)*100)/100,alpha:e.raidTelegraph.alpha??0.8});
        }
      });
      const boss=this.enemies.getChildren().find(e=>e.active&&!e.getData('dead')&&(e.enemyRole==='raidBoss'||e.enemyRole==='boss'));
      const snapshot={
        t:Math.round(this.runTimeMs),level:this.level,xp:Math.round(this.xp*100)/100,xpNeed:this.xpNeed,kills:this.kills,wave:this.getWave(),players,
        enemies:this.serializeGroup(this.enemies,'e','enemy',1150),
        projectiles:this.serializeGroup(this.projectiles,'p','projectile',1000),
        enemyBullets:this.serializeGroup(this.enemyProjectiles,'b','bullet',1050),
        gems:this.serializeGroup(this.gems,'g','gem',900),
        items:this.serializeGroup(this.items,'i','item',900),extras,
        raidPendingSeq:this.raidPendingSeq||0,raidPendingActive:!!this.pendingTrueBoss,
        raidIntroSeq:this.raidIntroSeq||0,raidIntroActive:!!this.raidBossTransition,raidBossName:this.raidBossName||'',raidPhaseSeq:this.raidPhaseSeq||0,
        boss:boss?{role:boss.enemyRole,hp:Math.round(boss.hp),maxHp:Math.round(boss.maxHp),name:boss.raidName||'',phase2:!!boss.raidPhase2,bossIndex:boss.bossIndex||0}:null
      };
      this._netInterestPoints=null;
      return snapshot;
    }
    syncNetworkGroup(map,list,group,depth=8){
      const keep=new Set();
      (list||[]).forEach(d=>{
        const id=d.i||d.id;if(!id)return;keep.add(id);
        const tx=d.x||0,ty=d.y||0,texture=d.t||d.texture||'xpGem';
        let o=map.get(id),fresh=!o||!o.active;
        if(fresh){o=group.create(tx,ty,texture);map.set(id,o);o.netTargetX=tx;o.netTargetY=ty;}
        if(texture&&o.texture?.key!==texture)o.setTexture(texture);
        o.netTargetX=tx;o.netTargetY=ty;
        if(!fresh&&Phaser.Math.Distance.Between(o.x,o.y,tx,ty)>260)o.setPosition(tx,ty);
        o.setRotation(d.r??d.rotation??0);
        const sx=d.sx??d.scaleX??1,sy=d.sy??d.scaleY??sx;o.setScale(sx,sy);
        o.setFlipX(!!(d.f??d.flipX));o.setAlpha(d.a??d.alpha??1);o.setDepth(depth);
        o.enemyRole=d.ro??d.role??null;o.eliteMutation=d.mu??null;o.raidName=d.rn??'';o.raidPhase2=!!d.p2;o.bossIndex=d.bi??0;
        if(Number.isFinite(d.h??d.hp))o.hp=d.h??d.hp;if(Number.isFinite(d.m??d.maxHp))o.maxHp=d.m??d.maxHp;
        o.itemType=d.it??d.itemType??null;
        if(o.enemyRole==='elite'){
          o.setTint(0xc8a5a5);
          if(o.eliteMutation){const mut=ELITE_MUTATIONS[o.eliteMutation];if(mut&&!o.netMutationMarker?.active)o.netMutationMarker=this.add.text(o.x,o.y-24,`${mut.icon}${mut.name}`,{fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:`#${mut.color.toString(16).padStart(6,'0')}`,stroke:'#18131b',strokeThickness:3}).setOrigin(0.5).setDepth(17);}
          else if(o.netMutationMarker?.active){o.netMutationMarker.destroy();o.netMutationMarker=null;}
        }else{if(o.netMutationMarker?.active){o.netMutationMarker.destroy();o.netMutationMarker=null;}if(o.enemyRole==='boss')o.setTint(0xe6b26f);else o.clearTint?.();}
      });
      for(const[id,o]of map){if(!keep.has(id)){if(o?.netMutationMarker?.active)o.netMutationMarker.destroy();if(o?.active)o.destroy();map.delete(id);}}
    }
    interpolateNetworkMap(map,delta,tau=70){
      const f=1-Math.exp(-Math.max(1,delta)/tau);
      for(const o of map.values()){
        if(!o?.active||!Number.isFinite(o.netTargetX)||!Number.isFinite(o.netTargetY))continue;
        o.x=Phaser.Math.Linear(o.x,o.netTargetX,f);o.y=Phaser.Math.Linear(o.y,o.netTargetY,f);
        if(o.netMutationMarker?.active)o.netMutationMarker.setPosition(o.x,o.y-24);
      }
    }
    syncNetworkExtras(extras){
      const keep=new Set();(extras||[]).forEach(d=>{keep.add(d.id);let o=this.netExtraMap.get(d.id);if(!o?.active){o=d.kind==='circle'?this.add.circle(d.x,d.y,d.radius||30,d.color||0xffffff,d.alpha??0.12).setDepth(3):this.add.image(d.x,d.y,d.texture||'poopOrbit').setDepth(d.texture==='rushWarning'?25:14);this.netExtraMap.set(d.id,o);}o.netTargetX=d.x;o.netTargetY=d.y;if(Phaser.Math.Distance.Between(o.x,o.y,d.x,d.y)>220)o.setPosition(d.x,d.y);if(d.kind==='circle'){o.setRadius?.(d.radius||30);o.setFillStyle?.(d.color||0xffffff,d.alpha??0.12);}else{const sx=d.scaleX??d.scale??1,sy=d.scaleY??d.scale??sx;o.setScale(sx,sy);o.setRotation(d.rotation||0);o.setAlpha(d.alpha??1);o.setDepth(d.texture==='rushWarning'?25:14);}});for(const[id,o]of this.netExtraMap){if(!keep.has(id)){o?.destroy();this.netExtraMap.delete(id);}}
    }
    applyNetworkSnapshot(s){
      if(!this.coopMode||this.networkRole!=='guest'||!s)return;
      this.runTimeMs=s.t||0;this.level=s.level||1;this.xp=s.xp||0;this.xpNeed=s.xpNeed||2;this.kills=s.kills||0;
      (s.players||[]).forEach(ps=>{
        const b=this.getBuild(ps.id);if(!b)return;
        const prevHp=Number.isFinite(b.hp)?b.hp:ps.hp;
        Object.assign(b,ps);b.charData=CHARACTERS[b.characterKey]||b.charData;b.down=!!ps.down;b.netX=ps.x;b.netY=ps.y;b.playerInvulnUntil=this.runTimeMs+(ps.invulnLeft||0);
        if(b.sprite?.active&&!ps.down&&Number.isFinite(ps.hp)){
          if(ps.hp<prevHp-0.25)this.flashPlayerSprite(b.sprite);
          else if(ps.hp>prevHp+1){const last=b.sprite._lastHealFxAt||-9999;if(this.runTimeMs-last>=420){b.sprite._lastHealFxAt=this.runTimeMs;this.playHealFx(b.sprite);}}
        }
        if(b.sprite){
          const first=!b.netReady;b.netReady=true;
          if(first||Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,ps.x,ps.y)>260)b.sprite.setPosition(ps.x,ps.y);
          b.sprite.setFlipX(!!ps.flipX).setAlpha(ps.down?0.38:(ps.alpha??1));if(b.sprite.body)b.sprite.body.enable=false;
        }
        b.shadow?.setAlpha(ps.down?0.08:0.22);
        this.updateReviveUi(b);
      });
      const lb=this.getLocalBuild();if(lb)this.loadBuild(lb);
      if((s.raidPendingSeq||0)>this.lastNetRaidPendingSeq){this.lastNetRaidPendingSeq=s.raidPendingSeq||0;this.showBanner('TRUE BOSS 접근 중...','현재 전투를 마무리하세요! · 신규 적 스폰 억제');}
      if((s.raidIntroSeq||0)>this.lastNetRaidIntroSeq){this.lastNetRaidIntroSeq=s.raidIntroSeq||0;this.showBanner('⚠ TRUE BOSS 경고 ⚠',`${s.raidBossName||'위험 개체'} 출현 감지`);showBossWarningUi(s.raidBossName||'TRUE BOSS','탄막전 시작 · 패턴을 보고 피하세요');}
      if((s.raidPhaseSeq||0)>this.lastNetRaidPhaseSeq){this.lastNetRaidPhaseSeq=s.raidPhaseSeq||0;this.showBanner(`${s.raidBossName||'TRUE BOSS'} 2 PHASE`,'패턴이 변한다!');}
      this.syncNetworkGroup(this.netEnemyMap,s.enemies,this.enemies,8);
      this.syncNetworkGroup(this.netProjectileMap,s.projectiles,this.projectiles,12);
      this.syncNetworkGroup(this.netEnemyBulletMap,s.enemyBullets,this.enemyProjectiles,27);
      this.syncNetworkGroup(this.netGemMap,s.gems,this.gems,6);
      this.syncNetworkGroup(this.netItemMap,s.items,this.items,7);
      this.syncNetworkExtras(s.extras);
      this.updateHud();
    }
    updateCoopGuest(delta){
      if(this.isGameOver)return;
      const input=this.readLocalMoveInput();
      this.guestSendTimer=(this.guestSendTimer||0)+delta;
      const inputKey=`${+input.left}${+input.right}${+input.up}${+input.down}`;
      const changed=inputKey!==this.lastSentInputKey;
      if(!this.isChoiceOpen&&!this.manualPause&&(changed||this.guestSendTimer>=110)){
        this.guestSendTimer=0;this.lastSentInputKey=inputKey;(socket?.volatile||socket)?.emit?.('coopInput',{input});
      }
      const lb=this.getLocalBuild();
      if(lb?.sprite){
        if(!lb.down&&!this.isChoiceOpen&&!this.manualPause){
          let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);const len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;
          const dt=Math.min(delta,40)/1000;lb.sprite.x=Phaser.Math.Clamp(lb.sprite.x+dx*(lb.moveSpeed||190)*dt,0,this.worldSize);lb.sprite.y=Phaser.Math.Clamp(lb.sprite.y+dy*(lb.moveSpeed||190)*dt,0,this.worldSize);if(dx!==0)lb.sprite.setFlipX(dx<0);
        }
        if(Number.isFinite(lb.netX)&&Number.isFinite(lb.netY)){
          const d=Phaser.Math.Distance.Between(lb.sprite.x,lb.sprite.y,lb.netX,lb.netY);const f=d>150?0.28:(1-Math.exp(-Math.max(1,delta)/260));lb.sprite.x=Phaser.Math.Linear(lb.sprite.x,lb.netX,f);lb.sprite.y=Phaser.Math.Linear(lb.sprite.y,lb.netY,f);
        }
        this.updateBuildPresentation(lb);
      }
      const rb=this.getRemoteBuild();if(rb?.sprite&&Number.isFinite(rb.netX)&&Number.isFinite(rb.netY)){const f=1-Math.exp(-Math.max(1,delta)/70);rb.sprite.x=Phaser.Math.Linear(rb.sprite.x,rb.netX,f);rb.sprite.y=Phaser.Math.Linear(rb.sprite.y,rb.netY,f);this.updateBuildPresentation(rb);}
      this.interpolateNetworkMap(this.netEnemyMap,delta,78);this.interpolateNetworkMap(this.netProjectileMap,delta,42);this.interpolateNetworkMap(this.netEnemyBulletMap,delta,38);this.interpolateNetworkMap(this.netGemMap,delta,80);this.interpolateNetworkMap(this.netItemMap,delta,90);this.interpolateNetworkMap(this.netExtraMap,delta,90);
    }
    updateCoopHost(delta){
      if(this.isGameOver||this.manualPause||this.isChoiceOpen)return;
      this.runTimeMs+=delta;const local=this.getLocalBuild(),remote=this.getRemoteBuild();this.runPlayerBuildTick(local,this.readLocalMoveInput(),delta);if(remote)this.runPlayerBuildTick(remote,this.remoteInput||blankMoveInput(),delta);if(local)this.loadBuild(local);
      this.updateRevives(delta);
      this.updateWaveSpawns(delta);this.updateEnemyAI();this.updateGems();this.updateProjectiles();
      this.hudUpdateTimer=(this.hudUpdateTimer||0)+delta;if(this.hudUpdateTimer>=100){this.hudUpdateTimer=0;this.updateHud();}
      this.snapshotTimer=(this.snapshotTimer||0)+delta;if(this.snapshotTimer>=110){this.snapshotTimer=0;(socket?.volatile||socket)?.emit?.('coopSnapshot',this.buildNetworkSnapshot());}
    }
    updateHud() {
      const d=this.hudDom;if(!d)return;
      const hpPct=Phaser.Math.Clamp(this.hp/Math.max(1,this.maxHp),0,1);
      const xpPct=Phaser.Math.Clamp(this.xp/Math.max(1,this.xpNeed),0,1);
      if(d.portrait){const src=PLAYER_SPRITES[this.characterKey]?.src||'';if(d.portrait.getAttribute('src')!==src)d.portrait.src=src;}
      if(d.name)d.name.textContent=this.charData.name;
      if(d.level)d.level.textContent=`Lv.${this.level}${this.coopMode?' · TEAM':''}`;
      if(d.hpFill)d.hpFill.style.width=`${Math.round(hpPct*1000)/10}%`;
      if(d.hpText)d.hpText.textContent=`${Math.ceil(this.hp)}/${Math.ceil(this.maxHp)}`;
      if(d.xpFill)d.xpFill.style.width=`${Math.round(xpPct*1000)/10}%`;
      if(d.xpText)d.xpText.textContent=`${Math.floor(this.xp)}/${this.xpNeed}`;
      if(d.passive)d.passive.textContent=this.charData.passive?.name||'';
      if(d.time)d.time.textContent=formatTime(this.runTimeMs/1000);
      if(d.wave)d.wave.textContent=`WAVE ${this.getWave()}`;
      if(d.kill)d.kill.textContent=`${this.coopMode?'TEAM ':''}KILL ${this.kills}`;
      if(d.pending)d.pending.hidden=!this.pendingTrueBoss;if(d.pending&&!d.pending.hidden)d.pending.textContent='TRUE BOSS 접근';

      if(this.coopMode&&this.builds){
        const partner=[...this.builds.values()].find(b=>b.id!==this.currentBuildId);
        const pp=partner?Phaser.Math.Clamp((partner.hp||0)/Math.max(1,partner.maxHp||1),0,1):0;
        if(d.partner)d.partner.hidden=false;
        if(d.partnerName)d.partnerName.textContent=partner?`${partner.charData?.name||'파트너'}${partner.down?' · DOWN':''}`:'파트너';
        if(d.partnerFill){d.partnerFill.style.width=`${Math.round(pp*1000)/10}%`;d.partnerFill.style.background=partner?.down?'#98616a':'#79cda4';}
        if(d.partnerText)d.partnerText.textContent=partner?(partner.down?'구조 필요':`${Math.ceil(partner.hp)}/${Math.ceil(partner.maxHp)}`):'-';
      }else if(d.partner)d.partner.hidden=true;

      const boss=this.enemies?.getChildren().find(e=>e.active&&!e.getData('dead')&&(e.enemyRole==='raidBoss'||e.enemyRole==='boss'));
      if(boss&&d.boss){
        const raid=boss.enemyRole==='raidBoss',pct=Phaser.Math.Clamp(boss.hp/Math.max(1,boss.maxHp),0,1);
        d.boss.hidden=false;d.boss.classList.toggle('raid',raid);
        if(d.bossKind)d.bossKind.textContent=raid?'TRUE BOSS':'BOSS';
        if(d.bossName)d.bossName.textContent=raid?`${boss.raidName||this.raidBossName||'TRUE BOSS'}${boss.raidPhase2?' · 2 PHASE':''}`:`위험 음식 ${boss.bossIndex||this.regularBossCount||1}`;
        if(d.bossHpText)d.bossHpText.textContent=`${Math.ceil(boss.hp)} / ${Math.ceil(boss.maxHp)}`;
        if(d.bossFill)d.bossFill.style.width=`${Math.round(pct*1000)/10}%`;
      }else if(d.boss)d.boss.hidden=true;
      this.refreshBuildHud();
    }

    gameOver() {
      if (this.isGameOver) return; this.isGameOver=true; stopBgm(); this.physics.world.pause(); this.time.paused=true;
      const sec=this.runTimeMs/1000,text=`생존 ${formatTime(sec)} · Lv.${this.level} · 처치 ${this.kills}`;
      document.querySelector('#gameover-stats').textContent=text;
      const restart=document.querySelector('#restart-btn'); if(restart)restart.textContent=this.coopMode?'협동 로비로':'다시 시작';
      document.querySelector('#gameover-screen').classList.add('show');if(this.coopMode&&this.networkRole==='host')socket?.emit('coopGameOver',{text});
    }
    showRemoteGameOver(payload){this.isGameOver=true;stopBgm();this.closeGuestChoiceUi();document.querySelector('#gameover-stats').textContent=payload.text||'2인 협동 종료';const restart=document.querySelector('#restart-btn');if(restart)restart.textContent='협동 로비로';document.querySelector('#gameover-screen').classList.add('show');}

    update(_time, delta) {
      if(this.coopMode){if(this.networkRole==='guest')return this.updateCoopGuest(delta);if(this.networkRole==='host')return this.updateCoopHost(delta);}
      if (this.isGameOver || this.manualPause) return;
      this.runTimeMs += delta;
      const sec = this.runTimeMs / 1000;

      let dx = 0, dy = 0;
      if (this.cursors.left.isDown || this.keys.left.isDown) dx -= 1;
      if (this.cursors.right.isDown || this.keys.right.isDown) dx += 1;
      if (this.cursors.up.isDown || this.keys.up.isDown) dy -= 1;
      if (this.cursors.down.isDown || this.keys.down.isDown) dy += 1;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const moving = Math.abs(dx) + Math.abs(dy) > 0.01;
      if (moving) this.facingAngle = Math.atan2(dy, dx);
      this.player.body.setVelocity(dx * this.moveSpeed, dy * this.moveSpeed);
      if (dx !== 0) this.player.setFlipX(dx < 0);
      this.updateSoloPresentation();

      this.updateWaveSpawns(delta);
      this.updateEnemyAI();
      this.updateGems();
      this.updateProjectiles();
      this.updateSkills(delta);
      this.updateMajorAugments(delta, moving);
      this.updateShieldVisual();

      this.basicTimer += delta;
      if (this.basicTimer >= this.basicCooldown) {
        this.basicTimer = 0;
        this.fireBasicProjectile();
      }

      this.hudUpdateTimer=(this.hudUpdateTimer||0)+delta;
      if(this.hudUpdateTimer>=100){this.hudUpdateTimer=0;this.updateHud();}
    }
  }

  function startGame(options = {}) {
    const restart=document.querySelector('#restart-btn'); if(restart)restart.textContent=options.coop?'협동 로비로':'다시 시작';
    ensureAudio();
    startBgmPlaylist();
    document.querySelector('#start-screen').classList.remove('show');
    document.querySelector('#gameover-screen').classList.remove('show');
    document.querySelector('#levelup-screen').classList.remove('show');
    document.querySelector('#chest-screen').classList.remove('show');
    document.querySelector('#pause-screen').classList.remove('show');
    document.querySelector('#coop-wait-screen')?.classList.remove('show');
    document.querySelector('#boss-warning-ui')?.classList.remove('show');
    document.querySelector('#audio-widget')?.classList.remove('open');
    document.querySelector('#audio-toggle-btn')?.setAttribute('aria-expanded','false');
    document.querySelector('#audio-controls')?.setAttribute('aria-hidden','true');
    document.querySelector('#game-shell')?.classList.add('game-running');
    document.querySelector('#combat-hud')?.setAttribute('aria-hidden','false');

    if (!game) {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 960,
        height: 540,
        backgroundColor: '#17151d',
        pixelArt: true,
        antialias: false,
        roundPixels: true,
        physics: {
          default: 'arcade',
          arcade: { gravity: { x: 0, y: 0 }, debug: false }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true
        }
      });
      game.scene.add('SurvivorScene', SurvivorScene, false);
    }
    if (game.scene.isActive('SurvivorScene') || game.scene.isPaused('SurvivorScene')) {
      game.scene.stop('SurvivorScene');
    }
    game.scene.start('SurvivorScene', { character: selectedCharacter, ...options });
  }

  const bgmSlider = document.querySelector('#bgm-volume');
  const sfxSlider = document.querySelector('#sfx-volume');
  if (bgmSlider) {
    bgmSlider.value = Math.round(bgmVolume * 100);
    bgmSlider.addEventListener('input', () => {
      bgmVolume = Number(bgmSlider.value) / 100;
      localStorage.setItem('petSurvivorsBgm', String(bgmVolume));
      bgmTracks.forEach(t => t.volume = bgmVolume);
    });
  }
  if (sfxSlider) {
    sfxSlider.value = Math.round(sfxVolume * 100);
    sfxSlider.addEventListener('input', () => {
      sfxVolume = Number(sfxSlider.value) / 100;
      localStorage.setItem('petSurvivorsSfx', String(sfxVolume));
    });
  }

  const audioWidget=document.querySelector('#audio-widget');
  const audioToggle=document.querySelector('#audio-toggle-btn');
  if(audioWidget&&audioToggle){
    audioToggle.addEventListener('click',()=>{
      const open=!audioWidget.classList.contains('open');
      audioWidget.classList.toggle('open',open);
      audioToggle.setAttribute('aria-expanded',String(open));
      document.querySelector('#audio-controls')?.setAttribute('aria-hidden',String(!open));
    });
  }

  document.querySelector('#start-btn').addEventListener('click', () => startGame({}));
  document.querySelector('#restart-btn').addEventListener('click', () => {
    if(activeScene?.coopMode){activeScene.returnToLobby?.();return;}
    if (activeScene) {
      activeScene.time.paused = false;
      activeScene.physics.world.resume();
    }
    startGame({});
  });
})();
