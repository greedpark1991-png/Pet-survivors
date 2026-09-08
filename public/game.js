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

  const LEVEL_UPGRADES = [
    { id: 'damage', icon: '⚔', title: '공격력 증가', desc: '모든 공격 피해량이 20% 증가한다.' },
    { id: 'speed', icon: '➜', title: '이동속도 증가', desc: '이동 속도가 10% 증가한다.' },
    { id: 'health', icon: '♥', title: '최대 체력 회복', desc: '최대 HP가 20 증가하고 체력을 크게 회복한다.' }
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
    { id: 'hunterInstinct', icon: '⚡', title: '사냥 본능', desc: '기본 공격 속도가 20% 빨라지고 공격력이 10% 증가한다.' },
    { id: 'doubleShot', icon: 'Ⅱ', title: '쌍발 본능', desc: '기본 무기를 한 번 발사할 때 투사체가 1개 더 나간다.' },
    { id: 'sniffer', icon: '✧', title: '자석 코', desc: '경험치 보석을 끌어당기는 범위가 크게 넓어진다.' },
    { id: 'ironStomach', icon: '♥', title: '튼튼한 배', desc: '최대 HP가 40 증가하고 체력을 전부 회복하며 받는 피해가 10% 감소한다.' },
    { id: 'zoomies', icon: '➤', title: '우다다!', desc: '이동속도가 18% 증가하고 기본 공격 속도가 8% 빨라진다.' }
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
    const p = CHARACTERS[key];
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#15131a';
    c.fillRect(0, 0, canvas.width, canvas.height);
    const S = 4;
    const ox = 28, oy = 17;
    const rect = (x, y, w, h, col) => {
      c.fillStyle = col;
      c.fillRect(ox + x * S, oy + y * S, w * S, h * S);
    };
    const main = colorHex(p.main), dark = colorHex(p.dark), light = colorHex(p.light);

    if (key === 'gucci') {
      rect(5, 5, 13, 11, light); rect(3, 14, 16, 9, light);
      rect(5, 2, 4, 4, dark); rect(14, 2, 4, 4, dark);
      rect(9, 5, 5, 4, dark); rect(14, 14, 5, 4, dark); rect(3, 17, 4, 3, dark);
      rect(0, 18, 5, 3, dark); rect(-2, 20, 3, 3, dark);
    } else if (key === 'mandu') {
      rect(5, 5, 13, 11, main); rect(3, 14, 16, 9, main);
      rect(4, 2, 5, 5, main); rect(9, 1, 6, 6, main); rect(14, 2, 5, 5, main);
      rect(2, 7, 4, 8, main); rect(17, 7, 4, 8, main);
    } else if (key === 'gamja') {
      rect(5, 5, 13, 11, main); rect(4, 14, 14, 8, main);
      rect(4, 2, 5, 5, main); rect(9, 1, 6, 6, main); rect(14, 2, 5, 5, main);
      rect(2, 8, 5, 7, main); rect(17, 8, 5, 7, main);
    } else {
      rect(5, 5, 13, 11, main); rect(3, 14, 16, 9, main);
      rect(2, 7, 4, 9, dark); rect(17, 7, 4, 9, dark); rect(17, 10, 4, 4, main);
    }
    rect(7, 9, 2, 2, '#16131a'); rect(14, 9, 2, 2, '#16131a');
    rect(11, 12, 2, 2, '#241b1b');
    rect(6, 22, 4, 3, main); rect(14, 22, 4, 3, main);
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
      this.basicCooldown = 1500;
      this.extraBasicShots = 0;
      this.gemMagnetRange = 135;
      this.playerDamageMult = 1;
      this.augments = [];
      this.pendingMilestone = false;
      this.basicTimer = 350;
      this.zombieTimer = 0;
      this.batTimer = 0;
      this.event180Done = false;
      this.nextBossAt = 300;
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
      this.gems = this.physics.add.group({ allowGravity: false });
      this.items = this.physics.add.group({ allowGravity: false });
      this.skillHitboxes = this.physics.add.group({ allowGravity: false });
    }

    createPlayer() {
      const center = this.worldSize / 2;
      this.player = this.physics.add.sprite(center, center, `player_${this.characterKey}`);
      this.player.setScale(1.4).setDepth(10).setCollideWorldBounds(true);
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
      this.skillText = fixed(this.add.text(18, cam.height - 18, '', { fontFamily: 'monospace', fontSize: '11px', color: '#ded4df', backgroundColor: '#18151ecc', padding: { x: 8, y: 6 } }).setOrigin(0, 1));
      this.banner = fixed(this.add.text(cam.width / 2, 105, '', { fontFamily: 'monospace', fontSize: '25px', fontStyle: 'bold', align: 'center', color: '#fff2b6', stroke: '#201922', strokeThickness: 5 }).setOrigin(0.5));
      this.banner.setAlpha(0);
      this.updateHud();
    }

    createPhysics() {
      this.physics.add.overlap(this.projectiles, this.enemies, this.onProjectileHit, null, this);
      this.physics.add.overlap(this.skillHitboxes, this.enemies, this.onSkillHit, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemyContact, null, this);
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

    getWave() {
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
        const margin = Phaser.Math.Between(80, 170);
        const edge = Phaser.Math.Between(0, 3);
        let x, y;
        if (edge === 0) { x = Phaser.Math.Between(view.left - margin, view.right + margin); y = view.top - margin; }
        else if (edge === 1) { x = view.right + margin; y = Phaser.Math.Between(view.top - margin, view.bottom + margin); }
        else if (edge === 2) { x = Phaser.Math.Between(view.left - margin, view.right + margin); y = view.bottom + margin; }
        else { x = view.left - margin; y = Phaser.Math.Between(view.top - margin, view.bottom + margin); }
        x = Phaser.Math.Clamp(x, 25, this.worldSize - 25);
        y = Phaser.Math.Clamp(y, 25, this.worldSize - 25);
        const actualType = (type === 'normal' || type === 'fast' || type === 'all') ? this.pickFoodEnemy(type) : type;
        this.spawnEnemy(actualType, x, y);
      }
    }

    spawnEnemy(type, x, y) {
      const scale = this.getScaling();
      let texture = 'enemy_boss', baseHp = 300, baseSpeed = 50, damage = 20, xp = 0, spriteScale = 2;
      if (type !== 'boss') {
        const data = FOOD_ENEMIES[type] || FOOD_ENEMIES.grape;
        texture = data.texture;
        baseHp = data.hp;
        baseSpeed = data.speed;
        damage = data.damage;
        xp = data.xp;
        spriteScale = 1;
      }
      const e = this.enemies.create(x, y, texture);
      e.setScale(spriteScale).setDepth(8);
      e.enemyType = type;
      e.maxHp = baseHp * scale.hp;
      e.hp = e.maxHp;
      e.speed = baseSpeed * scale.speed;
      e.contactDamage = damage;
      e.contactDamageMult = 1;
      e.shrinkUntil = 0;
      e.xpValue = xp;
      e.nextTouchAt = 0;
      e.hitFlashUntil = 0;
      e.baseDisplayScale = spriteScale;
      e.setData('dead', false);
      e.body.setCircle(type === 'boss' ? 16 : 10, type === 'boss' ? 8 : 5, type === 'boss' ? 8 : 5);
      return e;
    }

    spawnRingEvent() {
      const cx = this.player.x, cy = this.player.y;
      const radius = Math.max(this.cameras.main.width, this.cameras.main.height) * 0.72;
      for (let i = 0; i < 50; i++) {
        const a = (Math.PI * 2 * i) / 50;
        const r = radius + Phaser.Math.Between(-35, 35);
        this.spawnEnemy(this.pickFoodEnemy('all'), cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      this.showBanner('포위 이벤트!', '50마리 전방위 습격');
      this.cameras.main.shake(450, 0.004);
    }

    spawnBoss() {
      const view = this.cameras.main.worldView;
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Math.max(view.width, view.height) * 0.65;
      const x = Phaser.Math.Clamp(this.player.x + Math.cos(a) * r, 40, this.worldSize - 40);
      const y = Phaser.Math.Clamp(this.player.y + Math.sin(a) * r, 40, this.worldSize - 40);
      this.spawnEnemy('boss', x, y);
      this.showBanner('ELITE BOSS!', '크기 2배 · HP 10배');
      this.cameras.main.flash(250, 80, 20, 90);
    }

    updateWaveSpawns(delta) {
      const sec = this.runTimeMs / 1000;
      const wave = this.getWave();
      let zombieInterval = 2000, zombieCount = 3;
      let batEnabled = false, batInterval = 5000, batCount = 2;
      if (wave === 2) { zombieInterval = 1000; zombieCount = 3; batEnabled = true; }
      if (wave === 3) { zombieInterval = 800; zombieCount = 4; batEnabled = true; batInterval = 4000; batCount = 3; }

      this.zombieTimer += delta;
      while (this.zombieTimer >= zombieInterval) {
        this.zombieTimer -= zombieInterval;
        this.spawnOutsideView('normal', zombieCount);
      }
      if (batEnabled) {
        this.batTimer += delta;
        while (this.batTimer >= batInterval) {
          this.batTimer -= batInterval;
          this.spawnOutsideView('fast', batCount);
        }
      } else {
        this.batTimer = 0;
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
      this.player.setFlipX(target.x < this.player.x);
    }

    spawnBasicProjectile(angle) {
      const kind = this.charData.projectile;
      const texture = `proj_${kind}`;
      const p = this.projectiles.create(this.player.x, this.player.y, texture);
      p.setDepth(12);
      p.kind = 'basic'; p.damage = this.attackPower; p.hitSet = new Set();
      p.spawnAt = this.runTimeMs; p.lifeMs = kind === 'pee' ? 950 : 1400;
      const speed = kind === 'pee' ? 440 : 310;
      p.setRotation(angle);
      this.physics.velocityFromRotation(angle, speed, p.body.velocity);
      if (kind === 'bark') p.setScale(1.15);
      if (kind === 'pee') p.body.setSize(25, 4);
      else p.body.setCircle(6, 1, 1);
    }

    onProjectileHit(projectile, enemy) {
      if (!projectile.active || !enemy.active || enemy.getData('dead')) return;
      if (projectile.hitSet && projectile.hitSet.has(enemy)) return;
      if (projectile.hitSet) projectile.hitSet.add(enemy);
      this.damageEnemy(enemy, projectile.damage || this.attackPower, projectile.kind || 'basic');

      if (projectile.kind === 'basic') {
        if (this.skillLevels.shrinkRay) {
          const nextScale = Math.max(0.55, enemy.scaleX * 0.9);
          enemy.setScale(nextScale);
          enemy.contactDamageMult = 0.85;
          enemy.shrinkUntil = this.runTimeMs + 3000;
        }
        if (this.skillLevels.juiceBox) this.heal(this.maxHp * 0.05);
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
      enemy.hp -= amount;
      enemy.hitFlashUntil = this.runTimeMs + 90;
      enemy.setTint(0xffffff);
      this.time.delayedCall(80, () => { if (enemy.active) enemy.clearTint(); });
      this.spawnDamageText(enemy.x, enemy.y - 18, Math.round(amount));
      if (enemy.hp <= 0) this.killEnemy(enemy, source);
    }

    killEnemy(enemy) {
      if (!enemy.active || enemy.getData('dead')) return;
      enemy.setData('dead', true);
      const x = enemy.x, y = enemy.y, type = enemy.enemyType;
      this.kills += 1;
      this.cameras.main.shake(type === 'boss' ? 280 : 55, type === 'boss' ? 0.007 : 0.0015);
      if (type === 'boss') {
        if (Math.random() < 0.5) this.dropMagnet(x, y);
        else this.dropChest(x, y);
      } else {
        this.dropGem(x, y, enemy.xpValue || 1);
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
      this.xp += val;
      this.checkLevelProgression();
      this.updateHud();
    }

    checkLevelProgression() {
      if (this.isChoiceOpen || this.isGameOver) return;
      if (this.xp < this.xpNeed) return;
      this.xp -= this.xpNeed;
      this.level += 1;
      this.xpNeed = this.xpRequirement(this.level);
      this.pendingMilestone = this.level % 5 === 0;
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
      shuffle(LEVEL_UPGRADES).forEach(u => {
        const b = document.createElement('button');
        b.className = 'choice-card';
        b.innerHTML = `<span class="icon">${u.icon}</span><b>${u.title}</b><p>${u.desc}</p>`;
        b.onclick = () => {
          this.applyLevelUpgrade(u.id);
          screen.classList.remove('show');
          this.isChoiceOpen = false;
          if (this.pendingMilestone) {
            this.pendingMilestone = false;
            this.openMilestoneAugment();
          } else {
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

    applyLevelUpgrade(id) {
      if (id === 'damage') this.attackPower *= 1.2;
      if (id === 'speed') this.moveSpeed *= 1.1;
      if (id === 'health') {
        this.maxHp += 20;
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.55);
      }
      this.updateHud();
    }

    applyMilestoneAugment(id) {
      const data = MILESTONE_AUGMENTS.find(a => a.id === id);
      if (id === 'hunterInstinct') {
        this.basicCooldown = Math.max(420, this.basicCooldown * 0.8);
        this.attackPower *= 1.1;
      }
      if (id === 'doubleShot') this.extraBasicShots += 1;
      if (id === 'sniffer') this.gemMagnetRange += 110;
      if (id === 'ironStomach') {
        this.maxHp += 40;
        this.hp = this.maxHp;
        this.playerDamageMult *= 0.9;
      }
      if (id === 'zoomies') {
        this.moveSpeed *= 1.18;
        this.basicCooldown = Math.max(420, this.basicCooldown * 0.92);
      }
      if (data) this.augments.push(data.title);
      this.showBanner(data?.title || '증강 획득!', `Lv.${this.level} 특별 증강`);
      this.updateHud();
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

    onPlayerEnemyContact(_player, enemy) {
      if (!enemy.active || enemy.getData('dead') || this.isGameOver) return;
      if (this.runTimeMs < enemy.nextTouchAt || this.runTimeMs < this.playerInvulnUntil) return;
      enemy.nextTouchAt = this.runTimeMs + 650;
      this.playerInvulnUntil = this.runTimeMs + 380;

      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      this.player.body.velocity.x += Math.cos(angle) * 150;
      this.player.body.velocity.y += Math.sin(angle) * 150;

      if (this.shieldCharges > 0) {
        this.shieldCharges -= 1;
        this.showBanner('장막 방어!', '공격 1회 무효');
        this.cameras.main.flash(90, 130, 210, 255);
        this.updateHud();
        return;
      }

      const dmg = enemy.contactDamage * (enemy.contactDamageMult || 1) * (this.playerDamageMult || 1);
      this.hp -= dmg;
      this.cameras.main.shake(110, 0.004);
      this.cameras.main.flash(80, 180, 35, 35);
      this.updateHud();
      if (this.hp <= 0) this.gameOver();
    }

    updateEnemyAI() {
      this.enemies.getChildren().forEach(e => {
        if (!e.active || e.getData('dead')) return;
        if (e.shrinkUntil && this.runTimeMs >= e.shrinkUntil) {
          e.contactDamageMult = 1;
          e.shrinkUntil = 0;
        }
        const a = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
        e.body.setVelocity(Math.cos(a) * e.speed, Math.sin(a) * e.speed);
        e.setFlipX(this.player.x < e.x);
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
      if (this.augments?.length) names.unshift(`증강: ${this.augments.join(', ')}`);
      if (this.shieldCharges > 0) names.unshift(`장막 ${'◆'.repeat(this.shieldCharges)}`);
      this.skillText.setText(names.length ? names.join('  ·  ') : 'Lv.5마다 특별 증강 · 보스 상자에서 스킬 획득');
    }

    gameOver() {
      if (this.isGameOver) return;
      this.isGameOver = true;
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
      this.player.body.setVelocity(dx * this.moveSpeed, dy * this.moveSpeed);
      if (dx !== 0) this.player.setFlipX(dx < 0);
      this.shadow.setPosition(this.player.x, this.player.y + 15);

      this.updateWaveSpawns(delta);
      this.updateEnemyAI();
      this.updateGems();
      this.updateProjectiles();
      this.updateSkills(delta);
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

  document.querySelector('#start-btn').addEventListener('click', startGame);
  document.querySelector('#restart-btn').addEventListener('click', () => {
    if (activeScene) {
      activeScene.time.paused = false;
      activeScene.physics.world.resume();
    }
    startGame();
  });
})();
