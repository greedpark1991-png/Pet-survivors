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
  'game-container','start-screen','start-btn','restart-btn','levelup-screen','levelup-choices','chest-screen','chest-choices',
  'pause-screen','pause-resume-btn','pause-lobby-btn','gameover-screen','bgm-volume','sfx-volume',
  'coop-create-btn','coop-code-input','coop-join-btn','coop-room-panel','coop-room-code','coop-start-btn','coop-leave-btn','coop-wait-screen',
  'selected-char-preview','selected-char-name','selected-char-role','selected-passive-name','selected-passive-desc',
  'audio-widget','audio-toggle-btn','audio-controls','boss-warning-ui','pause-special-list','pause-major-list','pause-skill-list'
];


test('DOM ids are unique',()=>{const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);ok(dup.length===0,`duplicate ids: ${[...new Set(dup)].join(', ')}`);});
test('core UI listeners are registered once',()=>{const checks=[['start-btn',"document.querySelector('#start-btn').addEventListener('click'"],['audio-toggle',"audioToggle.addEventListener('click'"],['restart-btn',"document.querySelector('#restart-btn').addEventListener('click'"]];for(const [name,needle] of checks){const count=game.split(needle).length-1;ok(count===1,`${name} listener count=${count}`);}});
test('park decoration budget remains bounded',()=>{ok(game.includes('for(let i=0;i<90;i++)'),'grass patch budget changed');ok(game.includes('x+=104'),'horizontal path budget changed');ok(game.includes('y+=104'),'vertical path budget changed');ok(game.includes('for(let j=0;j<3;j++)'),'tree cluster budget changed');ok(game.includes('i < 205'),'small decor budget changed');});
test('package is v1.16 UI remaster',()=>ok(pkg.version==='1.16.0',`version=${pkg.version}`));
test('all legacy and remaster DOM ids exist',()=>requiredIds.forEach(id=>ok(html.includes(`id="${id}"`),`missing #${id}`)));
test('four character selectors remain',()=>['jjigae','mandu','gamja','gucci'].forEach(k=>ok(html.includes(`data-char="${k}"`),`missing ${k}`)));
test('CSS design tokens exist',()=>['--bg','--panel','--panel-soft','--border','--text','--muted','--accent','--accent-2','--danger','--success'].forEach(v=>ok(css.includes(v+':'),`missing ${v}`)));
test('pixel rendering protections remain',()=>{ok(game.includes('pixelArt: true'),'pixelArt true missing');ok(game.includes('antialias: false'),'antialias false missing');ok(css.includes('image-rendering:pixelated')||css.includes('image-rendering: pixelated'),'CSS pixelated missing');ok(game.includes('imageSmoothingEnabled = false')||game.includes('imageSmoothingEnabled=false'),'preview smoothing guard missing');});
test('player render scales enlarged without hitbox inflation',()=>{
  ok(/gamja:\s*\{[^}]*worldScale:\s*1\.14[^}]*hitbox:\s*\{\s*w:\s*14,\s*h:\s*14/s.test(game),'gamja scale/hitbox mismatch');
  ok(/gucci:\s*\{[^}]*worldScale:\s*1\.16[^}]*hitbox:\s*\{\s*w:\s*14,\s*h:\s*14/s.test(game),'gucci scale/hitbox mismatch');
  ok(/mandu:\s*\{[^}]*worldScale:\s*1\.07[^}]*hitbox:\s*\{\s*w:\s*13,\s*h:\s*13/s.test(game),'mandu scale/hitbox mismatch');
  ok(/jjigae:\s*\{[^}]*worldScale:\s*1\.16[^}]*hitbox:\s*\{\s*w:\s*14,\s*h:\s*14/s.test(game),'jjigae scale/hitbox mismatch');
});
test('park landmarks and decor textures exist',()=>['grassPatchLight','grassPatchDark','pathTileH','pathTileV','parkPlaza','parkPond','parkTree','parkBench','parkLamp','parkSign','parkFence','flowerBed','dogParkSet'].forEach(x=>ok(game.includes(`'${x}'`)||game.includes(`\`${x}\``),`missing ${x}`)));
test('park decorations are visual only',()=>{ok(!/physics\.add\.(?:staticGroup|image|sprite)\([^\n]*(?:parkTree|parkBench|parkPond|parkFence|dogParkSet)/.test(game),'park decor added as physics object');ok(game.includes('this.worldDecorCount'),'decor count instrumentation missing');});
test('slim HUD and icon build slots exist',()=>{ok(game.includes('refreshBuildHud()'),'build slot refresh missing');ok(game.includes('getBuildHudItems()'),'build item collector missing');ok(game.includes("KILL ${this.kills}"),'kill HUD missing');});
test('debug threat data moved out of combat wave line',()=>{ok(game.includes("this.waveText.setText(`WAVE ${this.getWave()}${this.pendingTrueBoss?' · TRUE BOSS 접근':''}`)"),'solo wave line changed unexpectedly');ok(game.includes('위협도 HP'),'pause threat details missing');});
test('sound UI is collapsible and persistence retained',()=>{ok(game.includes("audioWidget.classList.toggle('open',open)"),'audio popup toggle missing');ok(game.includes("localStorage.setItem('petSurvivorsBgm'"),'BGM persistence missing');ok(game.includes("localStorage.setItem('petSurvivorsSfx'"),'SFX persistence missing');});
test('choice cards have category and rarity extension points',()=>{ok(game.includes('button.dataset.type=card.type'),'choice type missing');ok(game.includes('button.dataset.rarity'),'rarity data missing');ok(css.includes('[data-type="exclusive"]')||css.includes('exclusive-choice'),'exclusive card visual missing');});
test('character feedback FX are wired',()=>{ok(game.includes('flashPlayerSprite(this.player)'),'damage flash not wired');ok(game.includes('playHealFx(this.player)'),'heal fx not wired');ok(game.includes('playLevelUpFx?.()'),'level-up fx not wired');ok(game.includes('localGuard'),'invulnerability guard missing');});
test('TRUE BOSS remaster warning is wired host and guest',()=>{ok((game.match(/showBossWarningUi\(/g)||[]).length>=3,'boss warning calls missing');ok(game.includes('bossHpAccent'),'TRUE boss differentiated HP UI missing');});
test('network architecture and v1.15 gameplay markers preserved',()=>['volatile','coopSnapshot','buildNetworkSnapshot','updateRevives','pendingTrueBoss','HEALING','TRUE_BOSS_PATTERNS','openMilestoneAugment','openMajorAugment','openChest'].forEach(x=>ok(game.includes(x),`missing core ${x}`)));
test('responsive CSS includes desktop and small viewport rules',()=>{ok(css.includes('@media(max-width:980px)')||css.includes('@media (max-width: 980px)'),'tablet breakpoint missing');ok(css.includes('@media(max-width:720px)')||css.includes('@media (max-width: 680px)'),'small breakpoint missing');ok(css.includes('@media(max-height:')||css.includes('@media (max-height:'),'short-height breakpoint missing');});
test('UI transitions stay short',()=>{const vals=[...css.matchAll(/(\d+)ms/g)].map(m=>Number(m[1]));ok(vals.length>0,'no ms timing tokens found');ok(vals.filter(v=>v<1000).every(v=>v<=300),`short UI timing over 300ms: ${Math.max(...vals.filter(v=>v<1000))}`);});

if(fails){console.error(`UI STATIC FAILURES: ${fails}`);process.exit(1);}console.log('ALL UI STATIC PASS');
