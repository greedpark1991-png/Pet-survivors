const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'public/styles.css'),'utf8');
const game=fs.readFileSync(path.join(root,'public/game.js'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
let fails=0;
function test(name,fn){try{fn();console.log('PASS',name);}catch(e){fails++;console.error('FAIL',name);console.error(e.message);}}
function ok(v,msg){if(!v)throw new Error(msg||'assertion failed');}

const requiredIds=[
  'game-container','combat-hud','combat-player-portrait','combat-player-name','combat-player-level','combat-hp-fill','combat-hp-text','combat-xp-fill','combat-xp-text',
  'combat-time','combat-wave','combat-kill','combat-boss-hud','combat-boss-name','combat-boss-fill','combat-build-slots',
  'start-screen','start-btn','restart-btn','levelup-screen','levelup-choices','chest-screen','chest-choices','pause-screen','pause-resume-btn','pause-lobby-btn','gameover-screen',
  'bgm-volume','sfx-volume','coop-create-btn','coop-code-input','coop-join-btn','coop-room-panel','coop-room-code','coop-start-btn','coop-leave-btn','coop-wait-screen',
  'selected-char-preview','selected-char-name','selected-char-role','selected-passive-name','selected-passive-desc','audio-widget','audio-toggle-btn','audio-controls','boss-warning-ui',
  'pause-special-list','pause-major-list','pause-skill-list'
];

test('package is v1.16.1 visual polish',()=>ok(pkg.version==='1.16.1',`version=${pkg.version}`));
test('DOM ids are unique',()=>{const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);ok(dup.length===0,`duplicate ids: ${[...new Set(dup)].join(', ')}`);});
test('all core and polished DOM ids exist',()=>requiredIds.forEach(id=>ok(html.includes(`id="${id}"`),`missing #${id}`)));
test('four character selectors remain',()=>['jjigae','mandu','gamja','gucci'].forEach(k=>ok(html.includes(`data-char="${k}"`),`missing ${k}`)));
test('lobby previews are intrinsic-aspect images',()=>{ok(/id="selected-char-preview"[^>]*<|id="selected-char-preview"/.test(html),'hero preview missing');ok(/<img[^>]+id="selected-char-preview"/s.test(html),'hero preview is not img');ok((html.match(/class="char-thumb"/g)||[]).length===4,'four img character thumbs required');ok(/<img[^>]+id="pause-char-preview"/s.test(html),'pause preview is not img');ok(css.includes('.hero-preview{')&&css.includes('width:auto'),'hero width:auto missing');ok(css.includes('.char-thumb')&&css.includes('width:auto'),'thumb width:auto missing');});
test('pixel rendering protections remain',()=>{ok(game.includes('pixelArt: true'),'pixelArt true missing');ok(game.includes('antialias: false'),'antialias false missing');ok(game.includes('roundPixels: true'),'roundPixels true missing');ok(css.includes('image-rendering:pixelated')||css.includes('image-rendering: pixelated'),'CSS pixelated missing');ok(game.includes('imageSmoothingEnabled = false')||game.includes('imageSmoothingEnabled=false'),'preview smoothing guard missing');ok(game.includes('Phaser.Textures.FilterMode.NEAREST'),'NEAREST texture filter missing');});
test('player sprites use uniform native scale and old hitboxes',()=>{
  const expected={gamja:'w: 14, h: 14',gucci:'w: 14, h: 14',mandu:'w: 13, h: 13',jjigae:'w: 14, h: 14'};
  for(const [id,hit] of Object.entries(expected)){
    const line=game.split('\n').find(x=>x.trim().startsWith(id+': {') && x.includes('worldScale:'));
    ok(line,`${id} sprite config missing`);
    ok(line.includes('worldScale: 1'),`${id} not native uniform scale`);
    ok(line.includes(hit),`${id} hitbox changed`);
  }
  ok(!/displayWidth\s*=|displayHeight\s*=|setDisplaySize\s*\(/.test(game),'display size APIs must not deform player sprites');
  ok(/this\.player\.setScale\(spriteCfg\.worldScale \?\? 1\)/.test(game),'local player uniform scale missing');
  ok(/this\.ally\.setScale\(remoteCfg\.worldScale \?\? 1\)/.test(game),'remote player uniform scale missing');
});
test('DOM combat HUD replaces blurry Phaser fixed text',()=>{ok(game.includes("root:document.querySelector('#combat-hud')"),'DOM HUD cache missing');ok(game.includes('combat-time'),'DOM time missing');ok(!/this\.(?:timerText|waveText|killText)\s*=\s*this\.add\.text/.test(game),'legacy Phaser HUD text still created');ok(css.includes('.combat-run-hud time'),'native time CSS missing');});
test('shared HUD safe-area tokens are used',()=>{ok(css.includes('--hud-safe-x:'),'safe x missing');ok(css.includes('--hud-safe-y:'),'safe y missing');for(const s of ['.combat-player-hud','.combat-run-hud','.combat-build-hud','.audio-widget'])ok(css.includes(s),`missing ${s}`);ok(css.includes('right:var(--hud-safe-x)'),'safe right not used');ok(css.includes('left:var(--hud-safe-x)'),'safe left not used');});
test('sound widget is subordinate and overlay-safe',()=>{ok(css.includes('.audio-widget{position:absolute;right:var(--hud-safe-x);bottom:var(--hud-safe-y);z-index:18'),'audio safe placement/z missing');ok(game.includes("audioWidget.classList.toggle('open',open)"),'sound popover toggle missing');ok(game.includes("localStorage.setItem('petSurvivorsBgm'"),'BGM persistence missing');ok(game.includes("localStorage.setItem('petSurvivorsSfx'"),'SFX persistence missing');});
test('park uses continuous graphics paths instead of rectangular path sprites',()=>{const world=game.slice(game.indexOf('createWorld() {'),game.indexOf('createPlayer() {'));ok(world.includes('this.add.graphics()'),'path graphics layer missing');ok(!world.includes("'pathTileH'")&&!world.includes("'pathTileV'"),'old rectangular path tiles still placed');ok(world.includes('fillPoints'),'continuous polygon path drawing missing');ok(world.includes('const oct=')&&world.includes('fillPoints(oct(88,68)'),'octagonal plaza geometry missing');});
test('park object budget is lower and visual-only',()=>{ok(game.includes('for(let i=0;i<52;i++)'),'grass patch budget should be 52');ok(game.includes('for(let i=0;i<150;i++)'),'small decoration budget should be 150');ok(game.includes('for(let j=0;j<2;j++)'),'tree clusters should use two trees');ok(!/physics\.add\.(?:staticGroup|image|sprite)\([^\n]*(?:parkTree|parkBench|parkPond|parkFence|dogParkSet)/.test(game),'park decor became physical');ok(game.includes('this.worldDecorCount'),'decor instrumentation missing');});
test('grass texture is large low-repeat tile',()=>ok(game.includes("create('grassTile', 256, 256"),'256 grass tile missing'));
test('choice UI stays compatible and extensible',()=>{ok(game.includes('button.dataset.type=card.type'),'choice type missing');ok(game.includes('button.dataset.rarity'),'rarity missing');ok(css.includes('[data-type="exclusive"]')||css.includes('exclusive-choice'),'exclusive visual missing');});
test('core v1.15 gameplay/network systems remain',()=>['pendingTrueBoss','TRUE_BOSS_PATTERNS','updateRevives','HEALING','openMilestoneAugment','openMajorAugment','openChest','buildNetworkSnapshot','coopSnapshot','volatile'].forEach(x=>ok(game.includes(x),`missing core ${x}`)));
test('core UI listeners registered once',()=>{const checks=[['start-btn',"document.querySelector('#start-btn').addEventListener('click'"],['audio-toggle',"audioToggle.addEventListener('click'"],['restart-btn',"document.querySelector('#restart-btn').addEventListener('click'"]];for(const [name,needle] of checks){const count=game.split(needle).length-1;ok(count===1,`${name} listener count=${count}`);}});
test('responsive rules cover requested viewport classes',()=>{ok(css.includes('@media(min-width:1800px)'),'large desktop breakpoint missing');ok(css.includes('@media(max-width:980px)'),'tablet breakpoint missing');ok(css.includes('@media(max-width:720px)'),'small breakpoint missing');ok(css.includes('@media(max-height:680px)'),'short viewport breakpoint missing');});

if(fails){console.error(`V1.16.1 VISUAL STATIC FAILURES: ${fails}`);process.exit(1);}console.log('ALL V1.16.1 VISUAL STATIC PASS');
