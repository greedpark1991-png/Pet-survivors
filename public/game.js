(() => {
  'use strict';

  const CHARACTERS = {
    jjigae: {
      name: '찌개', species: '갈색 말티푸', main: 0x8d5f3e, dark: 0x5f3d29, light: 0xc89a72,
      weapon: '앙앙 소리탄', projectile: 'bark', description: '짖는 소리 파동이 가장 가까운 적을 향해 날아간다.'
    },
    mandu: {
      name: '만두', species: '하얀 말티푸', main: 0xf0ede5, dark: 0xbcb6ad, light: 0xffffff,
      weapon: '콧물탄', projectile: 'snot', description: '초록빛 콧물 덩어리를 툭 발사한다.'
    },
    gamja: {
      name: '감자', species: '크림 토이푸들', main: 0xf0d49a, dark: 0xb88950, light: 0xffefc4,
      weapon: '오줌빔', projectile: 'pee', description: '가늘고 빠른 노란 일직선 탄을 쏜다.'
    },
    gucci: {
      name: '구찌', species: '하양+주황 코숏', main: 0xf8f3e8, dark: 0xdd7b34, light: 0xffffff,
      weapon: '털뭉치', projectile: 'hairball', description: '뭉친 털공을 가장 가까운 적에게 날린다.'
    }
  };

  const PLAYER_SPRITES = {
    gamja: { src: '/assets/players/gamja.png', previewSize: 56, worldScale: 1.4 },
    gucci: { src: '/assets/players/gucci.png', previewSize: 62, worldScale: 1.4 },
    mandu: { src: '/assets/players/mandu.png', previewSize: 62, worldScale: 1.4 },
    jjigae: { src: '/assets/players/jjigae.png', previewSize: 62, worldScale: 1.4 }
  };

  const LEVEL_UPGRADES = [
    { id: 'damage', icon: '⚔', title: '공격력 증가', desc: '모든 공격 피해량이 5% 증가한다.' },
    { id: 'speed', icon: '➜', title: '이동속도 증가', desc: '이동 속도가 2% 증가한다.' },
    { id: 'health', icon: '♥', title: '최대 체력 회복', desc: '최대 HP가 10 증가하고 최대 HP의 35%를 회복한다.' },
    { id: 'xpGain', icon: '✦', title: '경험치 증가', desc: '경험치 획득량이 8% 증가한다.' },
    { id: 'attackSpeed', icon: '⚡', title: '공속 증가', desc: '기본 공격 속도가 2% 빨라진다.' }
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
    { id: 'hunterInstinct', icon: '⚡', title: '사냥 본능', desc: '기본 공격 속도가 10% 빨라지고 공격력이 5% 증가한다.' },
    { id: 'sniffer', icon: '✧', title: '자석 코', desc: '경험치 보석을 끌어당기는 범위가 55px 넓어진다.' },
    { id: 'ironStomach', icon: '♥', title: '튼튼한 배', desc: '최대 HP가 20 증가하고 체력을 절반 회복하며 받는 피해가 5% 감소한다.' },
    { id: 'zoomies', icon: '➤', title: '우다다!', desc: '이동속도가 9% 증가하고 기본 공격 속도가 4% 빨라진다.' }
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

  let selectedCharacter = 'jjigae';
  let game = null;
  let activeScene = null;

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

  function drawPreview(canvas, key) {
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#15131a';
    c.fillRect(0, 0, canvas.width, canvas.height);
    const cfg = PLAYER_SPRITES[key];
    const img = new Image();
    img.onload = () => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = '#15131a';
      c.fillRect(0, 0, canvas.width, canvas.height);
      const size = cfg?.previewSize || 62;
      const x = Math.floor((canvas.width - size) / 2);
      const y = Math.floor(canvas.height - size - 6);
      c.drawImage(img, x, y, size, size);
    };
    img.src = cfg?.src || '';
  }

  document.querySelectorAll('.char-card').forEach(card => {
    const key = card.dataset.char;
    drawPreview(card.querySelector('canvas'), key);
    card.addEventListener('click', () => {
      selectedCharacter = key;
      document.querySelectorAll('.char-card').forEach(x => x.classList.toggle('selected', x === card));
    });
  });

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
      this.characterKey = data.character || 'jjigae';
      this.charData = CHARACTERS[this.characterKey];
      this.runTimeMs = 0;
      this.isGameOver = false;
      this.isChoiceOpen = false;
      this.manualPause = false;
      this.kills = 0;
      this.level = 1;
      this.xp = 0;
      this.xpNeed = 2;
      this.attackPower = 20;
      this.moveSpeed = 190;
      this.maxHp = 100;
      this.hp = 100;
      this.xpGainMult = 1;
      this.basicCooldown = 1500;
      this.extraBasicShots = 0;
      this.basicPierce = 0;
      this.basicExplosion = 0;
      this.basicRicochet = 0;
      this.basicSizeMult = 1;
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
      this.pendingAugmentType = null;
      this.basicTimer = 350;
      this.zombieTimer = 0;
      this.batTimer = 0;
      this.eliteTimer = 0;
      this.event180Done = false;
      this.nextBossAt = 300;
      this.nextRaidWave = 35;
      this.raidBossActive = false;
      this.raidBossCount = 0;
      this.raidShotPhase = 0;
      this.magnetUntil = 0;
      this.playerInvulnUntil = 0;
      this.shieldCharges = 0;
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
      this.createWorld();
      this.createGroups();
      this.createPlayer();
      this.createInput();
      this.createHud();
      this.createPhysics();
      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.cameras.main.setZoom(1);
      this.cameras.main.setRoundPixels(true);
      this.cameras.main.fadeIn(300, 14, 12, 17);
      this.showBanner(`${this.charData.name} 출격!`, this.charData.weapon);
    }

    createTextures() {
      const create = (key, w, h, drawFn) => {
        if (this.textures.exists(key)) return;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        drawFn(g);
        g.generateTexture(key, w, h);
        g.destroy();
      };

      create('grassTile', 64, 64, g => {
        g.fillStyle(0x5ca66b, 1); g.fillRect(0, 0, 64, 64);
        g.fillStyle(0x4b8f59, 1);
        [[6,8],[28,20],[52,11],[14,47],[42,50],[58,35]].forEach(([x,y]) => g.fillRect(x,y,3,3));
        g.fillStyle(0x73b979, 1);
        [[19,6],[36,35],[7,33],[51,56]].forEach(([x,y]) => { g.fillRect(x,y,2,4); g.fillRect(x+2,y+1,2,2); });
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
      create('enemyBullet', 10, 10, g => {
        g.fillStyle(0xd84a62,1); g.fillCircle(5,5,4); g.fillStyle(0xffd06f,1); g.fillCircle(5,5,2);
      });
      create('bossBullet', 14, 14, g => {
        g.fillStyle(0x8c4ad5,1); g.fillCircle(7,7,6); g.fillStyle(0xf4d4ff,1); g.fillCircle(7,7,3);
      });
      create('raidBullet', 16, 16, g => {
        g.fillStyle(0xff5a4f,1); g.fillCircle(8,8,7); g.fillStyle(0xffe06d,1); g.fillCircle(8,8,4); g.fillStyle(0xffffff,1); g.fillCircle(8,8,2);
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
      const tile = this.add.tileSprite(W / 2, W / 2, W, W, 'grassTile').setDepth(-20);
      tile.setScrollFactor(1);
      const rand = new Phaser.Math.RandomDataGenerator(['pet-survivors']);
      for (let i = 0; i < 360; i++) {
        const x = rand.between(60, W - 60), y = rand.between(60, W - 60);
        const r = rand.frac();
        if (r < 0.45) this.add.image(x, y, 'dirtPatch').setDepth(-18).setAlpha(0.9).setScale(rand.realInRange(0.8, 1.8));
        else if (r < 0.7) this.add.image(x, y, 'rock').setDepth(-17).setScale(rand.realInRange(0.7, 1.25));
        else this.add.image(x, y, 'flower').setDepth(-17).setScale(rand.realInRange(0.8, 1.2));
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
      const spriteCfg = PLAYER_SPRITES[this.characterKey] || { worldScale: 1.4 };
      this.player = this.physics.add.sprite(center, center, `player_${this.characterKey}`);
      this.player.setScale(spriteCfg.worldScale || 1.4).setDepth(10).setCollideWorldBounds(true);
      this.player.body.setSize(18, 18).setOffset(7, 10);
      this.player.setDrag(900, 900);
      this.player.setMaxVelocity(420, 420);
      this.shadow = this.add.ellipse(center, center + 15, 34, 12, 0x111016, 0.22).setDepth(4);
    }

    createInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC
      });
      this.input.keyboard.on('keydown-ESC', () => {
        if (this.isGameOver || this.isChoiceOpen) return;
        this.manualPause = !this.manualPause;
        document.querySelector('#pause-screen').classList.toggle('show', this.manualPause);
        if (this.manualPause) {
          this.physics.world.pause(); this.time.paused = true;
        } else {
          this.physics.world.resume(); this.time.paused = false;
        }
      });
    }

    createHud() {
      const cam = this.cameras.main;
      const fixed = (obj) => obj.setScrollFactor(0).setDepth(1000);
      this.hudBg = fixed(this.add.rectangle(12, 12, 336, 82, 0x17151d, 0.86).setOrigin(0));
      this.hudBg.setStrokeStyle(2, 0x524959, 1);
      this.hpBg = fixed(this.add.rectangle(26, 29, 210, 13, 0x4b2730, 1).setOrigin(0, 0.5));
      this.hpBar = fixed(this.add.rectangle(26, 29, 210, 13, 0xe26463, 1).setOrigin(0, 0.5));
      this.xpBg = fixed(this.add.rectangle(26, 52, 210, 9, 0x203d3b, 1).setOrigin(0, 0.5));
      this.xpBar = fixed(this.add.rectangle(26, 52, 0, 9, 0x50d1ad, 1).setOrigin(0, 0.5));
      this.hudName = fixed(this.add.text(250, 20, '', { fontFamily: 'monospace', fontSize: '13px', color: '#fff3c7' }));
      this.hudInfo = fixed(this.add.text(250, 42, '', { fontFamily: 'monospace', fontSize: '12px', color: '#d0c7d1' }));
      this.timerText = fixed(this.add.text(cam.width - 18, 16, '00:00', { fontFamily: 'monospace', fontSize: '25px', fontStyle: 'bold', color: '#fff4cb' }).setOrigin(1, 0));
      this.waveText = fixed(this.add.text(cam.width - 18, 47, 'WAVE 1', { fontFamily: 'monospace', fontSize: '13px', color: '#8ee1bd' }).setOrigin(1, 0));
      this.bossHpBg = fixed(this.add.rectangle(cam.width / 2, 84, 370, 14, 0x2b1720, 0.92).setOrigin(0.5)).setVisible(false);
      this.bossHpBar = fixed(this.add.rectangle(cam.width / 2 - 185, 84, 370, 14, 0xd45455, 1).setOrigin(0, 0.5)).setVisible(false);
      this.bossHpText = fixed(this.add.text(cam.width / 2, 66, '', { fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#ffe3c4', stroke: '#21151b', strokeThickness: 3 }).setOrigin(0.5)).setVisible(false);
      this.skillText = fixed(this.add.text(18, cam.height - 18, '', { fontFamily: 'monospace', fontSize: '11px', color: '#ded4df', backgroundColor: '#18151ecc', padding: { x: 8, y: 6 } }).setOrigin(0, 1));
      this.banner = fixed(this.add.text(cam.width / 2, 105, '', { fontFamily: 'monospace', fontSize: '25px', fontStyle: 'bold', align: 'center', color: '#fff2b6', stroke: '#201922', strokeThickness: 5 }).setOrigin(0.5));
      this.banner.setAlpha(0);
      this.updateHud();
    }

    createPhysics() {
      this.physics.add.overlap(this.projectiles, this.enemies, this.onProjectileHit, null, this);
      this.physics.add.overlap(this.skillHitboxes, this.enemies, this.onSkillHit, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemyContact, null, this);
      this.physics.add.overlap(this.player, this.enemyProjectiles, this.onEnemyProjectileHit, null, this);
      this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
      this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    }

    showBanner(title, subtitle = '') {
      this.banner.setText(subtitle ? `${title}\n${subtitle}` : title).setAlpha(1).setScale(0.9);
      this.tweens.killTweensOf(this.banner);
      this.tweens.add({ targets: this.banner, alpha: 0, scale: 1.05, duration: 1800, ease: 'Quad.easeOut', delay: 500 });
    }

    getScaling() {
      const steps = Math.floor(this.runTimeMs / 30000);
      return {
        steps,
        hp: Math.pow(1.15, steps),
        speed: Math.pow(1.05, steps)
      };
    }

    getBossEscalation() {
      const bossCount = Math.floor(this.runTimeMs / 300000);
      return {
        bossCount,
        hp: Math.pow(1.10, bossCount),
        damage: Math.pow(1.05, bossCount)
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
      const bossScaling = this.getBossEscalation();
      const isElite = !!opts.elite;
      const isBoss = type === 'boss';
      const isRaid = type === 'raidBoss';
      let texture = 'enemy_boss', baseHp = 300, baseSpeed = 50, damage = 20, xp = 0, spriteScale = 1;
      let role = 'normal';

      if (isRaid) {
        const raidTextures = ['enemy_raid_grape', 'enemy_raid_choco', 'enemy_raid_onion'];
        texture = raidTextures[Math.max(0, this.raidBossCount - 1) % raidTextures.length];
        baseHp = 3200 + this.raidBossCount * 900;
        baseSpeed = 60 + Math.min(24, this.raidBossCount * 3);
        damage = 34 + this.raidBossCount * 4;
        xp = 0;
        spriteScale = 2.9;
        role = 'raidBoss';
      } else if (isBoss) {
        texture = 'enemy_boss';
        baseHp = 520;
        baseSpeed = 54;
        damage = 22;
        xp = 0;
        spriteScale = 2.65;
        role = 'boss';
      } else {
        const data = FOOD_ENEMIES[type] || FOOD_ENEMIES.grape;
        texture = data.texture;
        baseHp = data.hp * bossScaling.hp;
        baseSpeed = data.speed;
        damage = data.damage * bossScaling.damage;
        xp = data.xp;
        if (isElite) {
          baseHp *= 4.2;
          baseSpeed *= 0.92;
          damage *= 1.45;
          xp = Math.max(4, xp * 4);
          spriteScale = 1.65;
          role = 'elite';
        }
      }

      const e = this.enemies.create(x, y, texture);
      e.setScale(spriteScale).setDepth(8);
      e.enemyType = type;
      e.enemyRole = role;
      e.maxHp = baseHp * scaling.hp;
      e.hp = e.maxHp;
      e.speed = baseSpeed * scaling.speed;
      e.contactDamage = damage;
      e.contactDamageMult = 1;
      e.shrinkUntil = 0;
      e.xpValue = xp;
      e.nextTouchAt = 0;
      e.hitFlashUntil = 0;
      e.baseDisplayScale = spriteScale;
      e.nextShotAt = this.runTimeMs + Phaser.Math.Between(role === 'elite' ? 1300 : 900, role === 'elite' ? 2500 : 1700);
      e.shotPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
      e.nextRushAt = this.runTimeMs + Phaser.Math.Between(3000, 5200);
      e.rushUntil = 0;
      e.setData('dead', false);

      if (role === 'raidBoss') e.body.setCircle(25, 11, 11);
      else if (role === 'boss') e.body.setCircle(18, 6, 6);
      else if (role === 'elite') e.body.setCircle(13, 3, 3);
      else e.body.setCircle(10, 5, 5);

      if (role === 'elite') {
        e.eliteFace = this.add.image(x, y, 'eliteFace').setDepth(9).setScale(spriteScale * 0.9);
        e.setTint(0xc8a5a5);
      }
      if (role === 'boss') e.setTint(0xe6b26f);
      if (role === 'raidBoss') {
        e.setTint(0xffffff);
        this.tweens.add({ targets: e, scaleX: spriteScale * 1.05, scaleY: spriteScale * 1.05, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      return e;
    }

    applyBossEscalationToLiveEnemies() {
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        if (e.enemyRole === 'normal' || e.enemyRole === 'elite') {
          e.maxHp *= 1.10;
          e.hp *= 1.10;
          e.contactDamage *= 1.05;
        }
      });
    }

    spawnRingEvent() {
      if (this.raidBossActive) return;
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

    spawnBoss() {
      if (this.raidBossActive) return;
      this.applyBossEscalationToLiveEnemies();
      const view = this.cameras.main.worldView;
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Math.max(view.width, view.height) * 0.72;
      const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * r, 80, this.worldSize - 80);
      const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * r, 80, this.worldSize - 80);
      this.spawnEnemy('boss', x, y);
      this.showBanner('BOSS 출현!', '정예보다 훨씬 큰 거대 초콜릿');
      this.cameras.main.flash(250, 80, 20, 90);
    }

    spawnElite(count = 1) {
      if (this.raidBossActive) return;
      this.spawnOutsideView('elite', count);
      this.showBanner('정예 위험식품!', '커지고 흉측해진 정예가 투사체를 발사한다');
    }

    clearBattlefieldForRaid() {
      [...this.enemies.getChildren()].forEach(e => {
        if (e.eliteFace?.active) e.eliteFace.destroy();
        if (e.active) e.destroy();
      });
      this.enemyProjectiles.clear(true, true);
    }

    spawnRaidBoss() {
      this.raidBossActive = true;
      this.clearBattlefieldForRaid();
      this.raidBossCount += 1;
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Math.max(this.cameras.main.width, this.cameras.main.height) * 0.55;
      const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * r, 140, this.worldSize - 140);
      const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * r, 140, this.worldSize - 140);
      const boss = this.spawnEnemy('raidBoss', x, y);
      boss.raidIndex = this.raidBossCount - 1;
      this.showBanner(`WAVE ${this.getWave()} TRUE BOSS`, '잡몹 소멸 · 탄막 보스전 시작!');
      this.cameras.main.flash(500, 255, 60, 35);
      this.cameras.main.shake(650, 0.012);
      playEnemyShotSfx(true);
    }

    updateWaveSpawns(delta) {
      const sec = this.runTimeMs / 1000;
      const wave = this.getWave();

      if (!this.raidBossActive && wave >= this.nextRaidWave) {
        this.spawnRaidBoss();
        this.nextRaidWave += 35;
      }
      if (this.raidBossActive) return;

      const phase = this.getSpawnPhase();
      let normalInterval = 2000, normalCount = 3;
      let fastEnabled = false, fastInterval = 5000, fastCount = 2;
      if (phase === 2) { normalInterval = 1000; normalCount = 3; fastEnabled = true; }
      if (phase === 3) { normalInterval = 800; normalCount = 4; fastEnabled = true; fastInterval = 4000; fastCount = 3; }

      this.zombieTimer += delta;
      while (this.zombieTimer >= normalInterval) {
        this.zombieTimer -= normalInterval;
        this.spawnOutsideView('normal', normalCount);
      }

      if (fastEnabled) {
        this.batTimer += delta;
        while (this.batTimer >= fastInterval) {
          this.batTimer -= fastInterval;
          this.spawnOutsideView('fast', fastCount);
        }
      } else this.batTimer = 0;

      if (sec >= 45) {
        this.eliteTimer += delta;
        const eliteInterval = Math.max(9000, 22000 - wave * 180);
        if (this.eliteTimer >= eliteInterval) {
          this.eliteTimer = 0;
          this.spawnElite(Math.min(3, 1 + Math.floor(wave / 20)));
        }
      }

      if (sec >= 180 && !this.event180Done) {
        this.event180Done = true;
        this.spawnRingEvent();
      }
      while (sec >= this.nextBossAt) {
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
        this.spawnBasicProjectile(baseAngle + spread);
      }
      playShotSfx(this.charData.projectile);
      this.player.setFlipX(target.x < this.player.x);
    }

    spawnBasicProjectile(angle) {
      const kind = this.charData.projectile;
      const texture = `proj_${kind}`;
      const p = this.projectiles.create(this.player.x, this.player.y, texture);
      p.setDepth(12);
      p.kind = 'basic';
      p.damage = this.attackPower * (1 + (this.basicSizeMult - 1) * 0.52);
      p.hitSet = new Set();
      p.pierceLeft = this.basicPierce || 0;
      p.ricochetLeft = this.basicRicochet || 0;
      p.spawnAt = this.runTimeMs; p.lifeMs = kind === 'pee' ? 1100 : 1600;
      const speed = kind === 'pee' ? 440 : 310;
      p.setRotation(angle);
      this.physics.velocityFromRotation(angle, speed, p.body.velocity);
      const sizeMult = this.basicSizeMult || 1;
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
        if (this.skillLevels.shrinkRay && enemy.enemyRole !== 'raidBoss') {
          const nextScale = Math.max(enemy.baseDisplayScale * 0.62, enemy.scaleX * 0.9);
          enemy.setScale(nextScale);
          enemy.contactDamageMult = 0.85;
          enemy.shrinkUntil = this.runTimeMs + 3000;
        }
        if (this.skillLevels.juiceBox) this.heal(this.maxHp * 0.05);
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
      if (enemy.hp <= 0) this.killEnemy(enemy, source);
    }

    killEnemy(enemy) {
      if (!enemy.active || enemy.getData('dead')) return;
      enemy.setData('dead', true);
      const x = enemy.x, y = enemy.y, role = enemy.enemyRole || 'normal';
      this.kills += 1;
      if (enemy.eliteFace?.active) enemy.eliteFace.destroy();
      this.cameras.main.shake(role === 'raidBoss' ? 520 : role === 'boss' ? 280 : role === 'elite' ? 120 : 55, role === 'raidBoss' ? 0.015 : role === 'boss' ? 0.007 : role === 'elite' ? 0.003 : 0.0015);
      if (role === 'raidBoss') {
        this.raidBossActive = false;
        this.dropMagnet(x - 34, y);
        this.dropChest(x + 34, y);
        this.dropChest(x, y + 34);
        this.showBanner('TRUE BOSS 격파!', '잡몹 웨이브 재개 · 보상 대량 드롭');
        this.cameras.main.flash(420, 255, 224, 100);
      } else if (role === 'boss') {
        if (Math.random() < 0.5) this.dropMagnet(x, y);
        else this.dropChest(x, y);
      } else {
        this.dropGem(x, y, enemy.xpValue || 1);
        if (role === 'elite' && Math.random() < 0.18) this.dropChest(x + 14, y);
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

    xpRequirement(level) {
      const early = { 1:2, 2:3, 3:4, 4:6, 5:8, 6:11, 7:15, 8:20, 9:26, 10:33 };
      if (early[level]) return early[level];
      const late = Math.ceil(33 * Math.pow(1.16, level - 10) + (level - 10) * 3);
      return Math.max(36, late);
    }

    collectGem(_player, gem) {
      if (!gem.active) return;
      const val = gem.xpValue || 1;
      gem.destroy();
      this.xp += val * (this.xpGainMult || 1);
      this.checkLevelProgression();
      this.updateHud();
    }

    checkLevelProgression() {
      if (this.isChoiceOpen || this.isGameOver) return;
      if (this.xp < this.xpNeed) return;
      this.xp -= this.xpNeed;
      this.level += 1;
      this.xpNeed = this.xpRequirement(this.level);
      this.pendingAugmentType = this.level % 10 === 0 ? 'major' : (this.level % 5 === 0 ? 'minor' : null);
      this.updateHud();
      this.openLevelUp();
    }

    collectItem(_player, item) {
      if (!item.active) return;
      const type = item.itemType;
      item.destroy();
      if (type === 'magnet') {
        this.magnetUntil = this.runTimeMs + 5000;
        this.gems.getChildren().forEach(g => { if (g.active) g.magnetized = true; });
        this.showBanner('자석 획득!', '모든 경험치 보석 흡수');
      } else if (type === 'chest') {
        this.openChest();
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
        b.className = 'choice-card';
        b.innerHTML = `<span class="icon">${u.icon}</span><b>${u.title}</b><p>${u.desc}</p>`;
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
      const screen = document.querySelector('#levelup-screen');
      const root = document.querySelector('#levelup-choices');
      document.querySelector('#levelup-eyebrow').textContent = `LEVEL ${this.level} AUGMENT!`;
      document.querySelector('#levelup-title').textContent = '5레벨 증강 하나를 선택해';
      root.innerHTML = '';
      const picks = shuffle(MILESTONE_AUGMENTS).slice(0, 3);
      picks.forEach(a => {
        const b = document.createElement('button');
        b.className = 'choice-card';
        b.innerHTML = `<span class="icon">${a.icon}</span><b>${a.title}</b><p>${a.desc}</p><span class="level">5레벨 보너스 증강</span>`;
        b.onclick = () => {
          this.applyMilestoneAugment(a.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          this.scene.resume();
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
        b.className = 'choice-card major-choice';
        const current = this.majorLevels[a.id] || 0;
        b.innerHTML = `<span class="icon">${a.icon}</span><b>${a.title}</b><p>${a.desc}</p><span class="level">현재 Lv.${current} → Lv.${current + 1}</span>`;
        b.onclick = () => {
          this.applyMajorAugment(a.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          this.scene.resume();
          this.checkLevelProgression();
        };
        root.appendChild(b);
      });
      screen.classList.add('show');
    }

    applyLevelUpgrade(id) {
      if (id === 'damage') this.attackPower *= 1.05;
      if (id === 'speed') this.moveSpeed *= 1.02;
      if (id === 'health') {
        this.maxHp += 10;
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.35);
      }
      if (id === 'xpGain') this.xpGainMult *= 1.08;
      if (id === 'attackSpeed') this.basicCooldown = Math.max(520, this.basicCooldown * 0.98);
      this.updateHud();
    }

    applyMilestoneAugment(id) {
      const data = MILESTONE_AUGMENTS.find(a => a.id === id);
      if (id === 'hunterInstinct') {
        this.basicCooldown = Math.max(520, this.basicCooldown * 0.90);
        this.attackPower *= 1.05;
      }
      if (id === 'sniffer') this.gemMagnetRange += 55;
      if (id === 'ironStomach') {
        this.maxHp += 20;
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.50);
        this.playerDamageMult *= 0.95;
      }
      if (id === 'zoomies') {
        this.moveSpeed *= 1.09;
        this.basicCooldown = Math.max(520, this.basicCooldown * 0.96);
      }
      if (data) this.augments.push(data.title);
      this.showBanner(data?.title || '증강 획득!', `Lv.${this.level} 특별 증강`);
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
        const o = this.add.image(this.player.x, this.player.y, 'poopOrbit').setDepth(14).setScale(1.05);
        this.poopOrbiters.push(o);
      }
    }

    castDisc(level) {
      const dirs = [this.facingAngle || 0, -Math.PI / 2, Math.PI / 2];
      const angle = dirs[this.discDirectionIndex % dirs.length];
      this.discDirectionIndex += 1;
      const p = this.projectiles.create(this.player.x, this.player.y, 'disc').setDepth(14);
      p.kind = 'disc';
      p.damage = this.attackPower * (1.45 + Math.min(2, level - 1) * 0.45);
      p.pierceLeft = Math.max(0, level - 3);
      p.hitSet = new Set();
      p.spawnAt = this.runTimeMs; p.lifeMs = 2600;
      p.setRotation(angle);
      this.physics.velocityFromRotation(angle, 360 + Math.min(80, level * 10), p.body.velocity);
      noise(0.045, 0.025, 900); tone(260, 0.05, 'triangle', 0.018, 180);
    }

    castBarkRoar(level) {
      const radius = 120 + (level - 1) * 30;
      const damage = this.attackPower * (0.58 + level * 0.08);
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
      const radius = 28 + Math.min(18, level * 3);
      const obj = this.add.circle(this.player.x, this.player.y + 8, radius, 0xe7d84d, 0.16).setStrokeStyle(2, 0xbda934, 0.25).setDepth(3);
      this.gasClouds.push({ obj, x:this.player.x, y:this.player.y + 8, radius, level, expire:this.runTimeMs + 3200 + level * 220, nextTick:this.runTimeMs });
      this.tweens.add({ targets: obj, alpha: 0.04, scale: 1.18, duration: 3200 + level * 220 });
    }

    castYawnWave(level) {
      const range = 175 + (level - 1) * 18;
      const halfAngle = 0.48 + Math.min(0.22, (level - 1) * 0.035);
      const damage = this.attackPower * (0.28 + level * 0.035);
      const spread = Math.tan(halfAngle) * range;
      const tri = this.add.triangle(this.player.x, this.player.y, 0, 0, range, -spread, range, spread, 0xaee9ff, 0.16).setOrigin(0, 0.5).setRotation(this.facingAngle || 0).setDepth(6);
      this.tweens.add({ targets: tri, alpha: 0, scaleX: 1.08, duration: 420, onComplete: () => tri.destroy() });
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
        if (d > range) return;
        const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
        if (Math.abs(Phaser.Math.Angle.Wrap(a - (this.facingAngle || 0))) > halfAngle) return;
        this.damageEnemy(e, damage, 'yawnWave');
        e.slowUntil = this.runTimeMs + 2400 + level * 120;
        e.slowMult = Math.max(0.48, 0.68 - level * 0.025);
      });
      noise(0.10, 0.025, 350); tone(165, 0.18, 'sine', 0.025, 95);
    }

    spawnTerritoryZone(level) {
      const radius = 52 + Math.min(24, level * 4);
      const obj = this.add.circle(this.player.x, this.player.y + 7, radius, 0xe8ce48, 0.13).setStrokeStyle(3, 0xd4aa38, 0.38).setDepth(2);
      this.territoryZones.push({ obj, x:this.player.x, y:this.player.y + 7, radius, level, expire:this.runTimeMs + 6500 + level * 250, nextTick:this.runTimeMs });
      this.tweens.add({ targets: obj, alpha: { from:0.18, to:0.08 }, duration:700, yoyo:true, repeat:-1 });
    }

    dropSqueakyToy(level) {
      const view = this.cameras.main.worldView;
      const candidates = this.enemies.getChildren().filter(e => e.active && !e.getData('dead') && view.contains(e.x, e.y));
      const target = candidates.length ? Phaser.Utils.Array.GetRandom(candidates) : this.nearestEnemy();
      if (!target) return;
      const toy = this.add.image(target.x, target.y - 105, 'squeakyToy').setDepth(30).setScale(1.05);
      const tx = target.x, ty = target.y;
      this.tweens.add({ targets: toy, y:ty, angle:Phaser.Math.Between(-35,35), duration:430, ease:'Quad.easeIn', onComplete:() => {
        if (target.active && !target.getData('dead')) {
          this.damageEnemy(target, this.attackPower * (1.45 + level * 0.22), 'squeakyToy');
          target.stunUntil = this.runTimeMs + 320 + level * 35;
          this.explodeAt(tx, ty, this.attackPower * (0.18 + level * 0.03), 34 + level * 2, target);
        }
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
            if (Phaser.Math.Distance.Between(z.x,z.y,e.x,e.y) <= z.radius) this.damageEnemy(e, this.attackPower * (0.075 + z.level * 0.022), 'yellowGas');
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
              e.vulnerableMult = 1.10 + z.level * 0.025;
              this.damageEnemy(e, this.attackPower * (0.07 + z.level * 0.02), 'territoryMark');
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
        const radius = 48 + Math.min(20, lv.poopOrbit * 3);
        this.poopOrbiters.forEach((o,i) => {
          const a = this.runTimeMs * 0.0032 + (Math.PI * 2 * i) / count;
          o.setPosition(this.player.x + Math.cos(a) * radius, this.player.y + Math.sin(a) * radius);
          this.enemies.getChildren().forEach(e => {
            if (!e.active || e.getData('dead') || this.runTimeMs < (e.poopHitReady || 0)) return;
            if (Phaser.Math.Distance.Between(o.x,o.y,e.x,e.y) <= 22) {
              e.poopHitReady = this.runTimeMs + 380;
              this.damageEnemy(e, this.attackPower * (0.22 + lv.poopOrbit * 0.035), 'poopOrbit');
              if (e.enemyRole !== 'raidBoss') {
                const pa = Phaser.Math.Angle.Between(this.player.x,this.player.y,e.x,e.y);
                e.x += Math.cos(pa) * 7; e.y += Math.sin(pa) * 7;
              }
            }
          });
        });
      }
      if (lv.discThrow) {
        this.majorTimers.discThrow += delta;
        const interval = Math.max(1900, 3400 - (lv.discThrow - 1) * 180);
        if (this.majorTimers.discThrow >= interval) { this.majorTimers.discThrow = 0; this.castDisc(lv.discThrow); }
      }
      if (lv.barkRoar) {
        this.majorTimers.barkRoar += delta;
        if (this.majorTimers.barkRoar >= 6000) { this.majorTimers.barkRoar = 0; this.castBarkRoar(lv.barkRoar); }
      }
      if (lv.yellowGas && moving) {
        this.majorTimers.yellowGas += delta;
        const interval = Math.max(480, 820 - lv.yellowGas * 45);
        if (this.majorTimers.yellowGas >= interval) { this.majorTimers.yellowGas = 0; this.spawnGasCloud(lv.yellowGas); }
      }
      if (lv.yawnWave) {
        this.majorTimers.yawnWave += delta;
        if (this.majorTimers.yawnWave >= 5400) { this.majorTimers.yawnWave = 0; this.castYawnWave(lv.yawnWave); }
      }
      if (lv.territoryMark) {
        this.majorTimers.territoryMark += delta;
        if (this.majorTimers.territoryMark >= 7200) { this.majorTimers.territoryMark = 0; this.spawnTerritoryZone(lv.territoryMark); }
      }
      if (lv.squeakyToy) {
        this.majorTimers.squeakyToy += delta;
        const interval = Math.max(2800, 5000 - (lv.squeakyToy - 1) * 180);
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
        b.className = 'choice-card';
        b.innerHTML = `<span class="icon">${s.icon}</span><b>${s.title}</b><p>${s.desc}</p><span class="level">현재 Lv.${level} → Lv.${level + 1}</span>`;
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
      this.hp = Math.min(this.maxHp, this.hp + amount);
      this.updateHud();
    }

    applyPlayerDamage(amount, sourceX, sourceY, invulnMs = 300) {
      if (this.isGameOver || this.runTimeMs < this.playerInvulnUntil) return false;
      this.playerInvulnUntil = this.runTimeMs + invulnMs;

      if (this.shieldCharges > 0) {
        this.shieldCharges -= 1;
        this.showBanner('장막 방어!', '공격 1회 무효');
        this.cameras.main.flash(90, 130, 210, 255);
        this.updateHud();
        return false;
      }

      const dmg = amount * (this.playerDamageMult || 1);
      this.hp -= dmg;
      if (Number.isFinite(sourceX) && Number.isFinite(sourceY)) {
        const angle = Phaser.Math.Angle.Between(sourceX, sourceY, this.player.x, this.player.y);
        this.player.body.velocity.x += Math.cos(angle) * 130;
        this.player.body.velocity.y += Math.sin(angle) * 130;
      }
      playPlayerHurtSfx();
      this.cameras.main.shake(110, 0.004);
      this.cameras.main.flash(80, 180, 35, 35);
      this.updateHud();
      if (this.hp <= 0) this.gameOver();
      return true;
    }

    onPlayerEnemyContact(_player, enemy) {
      if (!enemy.active || enemy.getData('dead') || this.isGameOver) return;
      if (this.runTimeMs < enemy.nextTouchAt) return;
      enemy.nextTouchAt = this.runTimeMs + 650;
      const dmg = enemy.contactDamage * (enemy.contactDamageMult || 1);
      this.applyPlayerDamage(dmg, enemy.x, enemy.y, 380);
    }

    onEnemyProjectileHit(_player, bullet) {
      if (!bullet.active || this.isGameOver) return;
      const hit = this.applyPlayerDamage(bullet.damage || 10, bullet.x, bullet.y, bullet.strong ? 250 : 180);
      if (hit || this.shieldCharges >= 0) bullet.destroy();
    }

    spawnEnemyBullet(x, y, angle, speed, damage, kind = 'enemy', lifeMs = 4200) {
      const texture = kind === 'raid' ? 'raidBullet' : kind === 'boss' ? 'bossBullet' : 'enemyBullet';
      const b = this.enemyProjectiles.create(x, y, texture).setDepth(12);
      b.damage = damage;
      b.kind = kind;
      b.strong = kind === 'boss' || kind === 'raid';
      b.spawnAt = this.runTimeMs;
      b.lifeMs = lifeMs;
      b.setRotation(angle);
      this.physics.velocityFromRotation(angle, speed, b.body.velocity);
      if (kind === 'raid') b.body.setCircle(6, 2, 2);
      else b.body.setCircle(4, 1, 1);
      return b;
    }

    fireEliteShot(enemy) {
      const a = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const count = enemy.enemyRole === 'elite' ? 1 : 3;
      for (let i = 0; i < count; i++) {
        const spread = count === 1 ? 0 : (i - 1) * 0.16;
        this.spawnEnemyBullet(enemy.x, enemy.y, a + spread, enemy.enemyRole === 'boss' ? 215 : 185, enemy.contactDamage * 0.72, enemy.enemyRole === 'boss' ? 'boss' : 'enemy');
      }
      playEnemyShotSfx(enemy.enemyRole === 'boss');
    }

    fireRaidPattern(enemy) {
      if (!enemy.active || enemy.getData('dead')) return;
      const pattern = (enemy.raidIndex || 0) % 3;
      const base = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      this.raidShotPhase += 0.31;

      if (pattern === 0) {
        const count = 18;
        for (let i = 0; i < count; i++) {
          const a = this.raidShotPhase + (Math.PI * 2 * i) / count;
          this.spawnEnemyBullet(enemy.x, enemy.y, a, 185, 12 + this.raidBossCount * 1.5, 'raid', 5200);
        }
      } else if (pattern === 1) {
        const count = 9;
        for (let i = 0; i < count; i++) {
          const a = base + (i - (count - 1) / 2) * 0.13;
          this.spawnEnemyBullet(enemy.x, enemy.y, a, 245, 13 + this.raidBossCount * 1.5, 'raid', 4400);
        }
        for (let i = 0; i < 4; i++) {
          const a = base + Math.PI / 2 + i * Math.PI / 2 + this.raidShotPhase;
          this.spawnEnemyBullet(enemy.x, enemy.y, a, 160, 10 + this.raidBossCount, 'raid', 5200);
        }
      } else {
        const count = 12;
        for (let i = 0; i < count; i++) {
          const a = base + (Math.PI * 2 * i) / count + this.raidShotPhase;
          this.spawnEnemyBullet(enemy.x, enemy.y, a, i % 2 ? 155 : 225, 11 + this.raidBossCount * 1.4, 'raid', 5400);
        }
      }
      playEnemyShotSfx(true);
      this.cameras.main.shake(55, 0.002);
    }

    updateEnemyAI() {
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        if (e.shrinkUntil && this.runTimeMs >= e.shrinkUntil) {
          e.contactDamageMult = 1;
          e.shrinkUntil = 0;
          e.setScale(e.baseDisplayScale || 1);
        }

        if (e.eliteFace?.active) {
          e.eliteFace.setPosition(e.x, e.y);
          e.eliteFace.setFlipX(e.flipX);
        }

        const a = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
        let speed = e.speed;
        if (this.runTimeMs < (e.stunUntil || 0)) speed = 0;
        else if (this.runTimeMs < (e.slowUntil || 0)) speed *= (e.slowMult || 0.65);
        if (e.enemyRole === 'raidBoss') {
          if (this.runTimeMs >= e.nextRushAt) {
            e.rushUntil = this.runTimeMs + 850;
            e.nextRushAt = this.runTimeMs + Phaser.Math.Between(3200, 5000);
            this.showBanner('보스 돌진!', '피해!');
          }
          if (this.runTimeMs < e.rushUntil) speed *= 2.9;
          else {
            const d = Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y);
            if (d > 360) speed *= 1.55;
            if (d < 190) speed *= 0.55;
          }
        }
        e.body.setVelocity(Math.cos(a) * speed, Math.sin(a) * speed);
        e.setFlipX(this.player.x < e.x);

        if ((e.enemyRole === 'elite' || e.enemyRole === 'boss' || e.enemyRole === 'raidBoss') && this.runTimeMs >= e.nextShotAt) {
          if (e.enemyRole === 'raidBoss') {
            this.fireRaidPattern(e);
            e.nextShotAt = this.runTimeMs + Math.max(650, 1450 - this.raidBossCount * 70);
          } else {
            this.fireEliteShot(e);
            e.nextShotAt = this.runTimeMs + (e.enemyRole === 'boss' ? Phaser.Math.Between(1500, 2300) : Phaser.Math.Between(2200, 3400));
          }
        }
      });
    }

    updateGems() {
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
        } else {
          g.body.setVelocity(0, 0);
        }
      });
    }

    updateProjectiles() {
      this.projectiles.getChildren().forEach(p => {
        if (!p.active) return;
        if (p.kind === 'magicMissile') {
          const target = this.nearestEnemy(p.x, p.y, 900);
          if (target) {
            const a = Phaser.Math.Angle.Between(p.x, p.y, target.x, target.y);
            const speed = 260 + (this.skillLevels.magicMissile || 1) * 18;
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
        const interval = Math.max(2500, 5000 - (lv.magicMissile - 1) * 350);
        if (this.skillTimers.magicMissile >= interval) {
          this.skillTimers.magicMissile = 0;
          this.castMagicMissiles(lv.magicMissile);
        }
      }
      if (lv.veil) {
        this.skillTimers.veil += delta;
        const interval = Math.max(18000, 30000 - (lv.veil - 1) * 1800);
        if (this.skillTimers.veil >= interval) {
          this.skillTimers.veil = 0;
          this.shieldCharges = Math.min(1 + Math.floor((lv.veil - 1) / 3), this.shieldCharges + 1);
          this.updateHud();
        }
      }
      if (lv.sword) {
        this.skillTimers.sword += delta;
        const interval = Math.max(1700, 3000 - (lv.sword - 1) * 180);
        if (this.skillTimers.sword >= interval) {
          this.skillTimers.sword = 0;
          this.castSword(lv.sword);
        }
      }
      if (lv.hellConductor) {
        this.skillTimers.hellConductor += delta;
        const interval = Math.max(2600, 4500 - (lv.hellConductor - 1) * 250);
        if (this.skillTimers.hellConductor >= interval) {
          this.skillTimers.hellConductor = 0;
          this.castFireRing(lv.hellConductor);
        }
      }
      if (lv.bulletBarrage) {
        this.skillTimers.bulletBarrage += delta;
        const interval = Math.max(2400, 4000 - (lv.bulletBarrage - 1) * 220);
        if (this.skillTimers.bulletBarrage >= interval) {
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
      const count = 3 + Math.floor((level - 1) / 2);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const p = this.projectiles.create(this.player.x + Math.cos(a) * 24, this.player.y + Math.sin(a) * 24, 'magicMissile');
        p.kind = 'magicMissile'; p.damage = this.attackPower * (0.8 + level * 0.12); p.hitSet = new Set();
        p.spawnAt = this.runTimeMs; p.lifeMs = 3500; p.setDepth(13);
        p.body.setVelocity(Math.cos(a) * 160, Math.sin(a) * 160);
      }
    }

    castSword(level) {
      const damage = this.attackPower * (1.7 + level * 0.18);
      [-48, 48].forEach(offset => {
        const s = this.skillHitboxes.create(this.player.x, this.player.y + offset, 'slash').setDepth(15);
        s.damage = damage; s.skillKind = 'sword'; s.hitSet = new Set();
        s.body.setSize(18, 64);
        this.tweens.add({ targets: s, alpha: 0, scaleY: 1.15, duration: 230, onComplete: () => s.destroy() });
      });
    }

    castFireRing(level) {
      const count = 8 + Math.min(4, level - 1);
      const radius = 105 + level * 4;
      const damage = this.attackPower * (1.25 + level * 0.16);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const f = this.skillHitboxes.create(this.player.x + Math.cos(a) * radius, this.player.y + Math.sin(a) * radius, 'firePillar').setDepth(14);
        f.damage = damage; f.skillKind = 'fire'; f.hitSet = new Set();
        f.body.setSize(18, 30);
        f.setScale(0.8);
        this.tweens.add({ targets: f, scale: 1.3, alpha: 0, duration: 520, ease: 'Quad.easeOut', onComplete: () => f.destroy() });
      }
    }

    castBulletBarrage(level) {
      const target = this.nearestEnemy();
      if (!target) return;
      for (let i = 0; i < 5; i++) {
        this.time.delayedCall(i * 90, () => {
          if (!target.active || target.getData('dead')) return;
          const p = this.projectiles.create(this.player.x, this.player.y, 'bullet').setDepth(13);
          p.kind = 'bullet'; p.damage = this.attackPower * (0.45 + level * 0.05); p.hitSet = new Set();
          p.spawnAt = this.runTimeMs; p.lifeMs = 1400;
          const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
          p.rotation = a;
          this.physics.velocityFromRotation(a, 480, p.body.velocity);
        });
      }
    }

    updateShieldVisual() {
      if (this.shieldCharges > 0) {
        if (!this.shieldVisual || !this.shieldVisual.active) {
          this.shieldVisual = this.add.circle(this.player.x, this.player.y, 28, 0x83d7f0, 0.12).setStrokeStyle(2, 0xa9efff, 0.8).setDepth(11);
          this.tweens.add({ targets: this.shieldVisual, alpha: { from: 0.35, to: 0.12 }, duration: 650, yoyo: true, repeat: -1 });
        }
        this.shieldVisual.setPosition(this.player.x, this.player.y);
      } else if (this.shieldVisual) {
        this.shieldVisual.destroy(); this.shieldVisual = null;
      }
    }

    updateHud() {
      if (!this.hpBar) return;
      const hpPct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
      const xpPct = Phaser.Math.Clamp(this.xp / this.xpNeed, 0, 1);
      this.hpBar.width = 210 * hpPct;
      this.xpBar.width = 210 * xpPct;
      this.hudName.setText(`${this.charData.name}  Lv.${this.level}`);
      this.hudInfo.setText(`HP ${Math.ceil(this.hp)}/${this.maxHp}\nKILL ${this.kills}`);
      const names = SKILLS.filter(s => this.skillLevels[s.id]).map(s => `${s.title} Lv.${this.skillLevels[s.id]}`);
      const majors = MAJOR_AUGMENTS.filter(a => this.majorLevels?.[a.id]).map(a => `${a.title} Lv.${this.majorLevels[a.id]}`);
      if (majors.length) names.unshift(`10Lv: ${majors.join(', ')}`);
      if (this.augments?.length) names.unshift(`증강: ${this.augments.join(', ')}`);
      if (this.shieldCharges > 0) names.unshift(`장막 ${'◆'.repeat(this.shieldCharges)}`);
      const boss = this.enemies?.getChildren().find(e => e.active && !e.getData('dead') && (e.enemyRole === 'raidBoss' || e.enemyRole === 'boss'));
      if (boss) {
        const pct = Phaser.Math.Clamp(boss.hp / boss.maxHp, 0, 1);
        this.bossHpBg.setVisible(true);
        this.bossHpBar.setVisible(true).setSize(370 * pct, 14);
        this.bossHpText.setVisible(true).setText(`${boss.enemyRole === 'raidBoss' ? 'TRUE BOSS' : 'BOSS'}  ${Math.ceil(boss.hp)} / ${Math.ceil(boss.maxHp)}`);
      } else {
        this.bossHpBg.setVisible(false); this.bossHpBar.setVisible(false); this.bossHpText.setVisible(false);
      }
      this.skillText.setText(names.length ? names.join('  ·  ') : 'Lv.5 특별 증강 · Lv.10 전투 증강 · 보스 상자 스킬');
    }

    gameOver() {
      if (this.isGameOver) return;
      this.isGameOver = true;
      stopBgm();
      this.physics.world.pause();
      this.time.paused = true;
      const sec = this.runTimeMs / 1000;
      document.querySelector('#gameover-stats').textContent = `생존 ${formatTime(sec)} · Lv.${this.level} · 처치 ${this.kills}`;
      document.querySelector('#gameover-screen').classList.add('show');
    }

    update(_time, delta) {
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
      this.shadow.setPosition(this.player.x, this.player.y + 15);

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

      this.timerText.setText(formatTime(sec));
      this.waveText.setText(`WAVE ${this.getWave()}  ·  적 강화 ${this.getScaling().steps}`);
      this.updateHud();
    }
  }

  function startGame() {
    ensureAudio();
    startBgmPlaylist();
    document.querySelector('#start-screen').classList.remove('show');
    document.querySelector('#gameover-screen').classList.remove('show');
    document.querySelector('#levelup-screen').classList.remove('show');
    document.querySelector('#chest-screen').classList.remove('show');
    document.querySelector('#pause-screen').classList.remove('show');

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
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      });
      game.scene.add('SurvivorScene', SurvivorScene, false);
    }
    if (game.scene.isActive('SurvivorScene') || game.scene.isPaused('SurvivorScene')) {
      game.scene.stop('SurvivorScene');
    }
    game.scene.start('SurvivorScene', { character: selectedCharacter });
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

  document.querySelector('#start-btn').addEventListener('click', startGame);
  document.querySelector('#restart-btn').addEventListener('click', () => {
    if (activeScene) {
      activeScene.time.paused = false;
      activeScene.physics.world.resume();
    }
    startGame();
  });
})();
