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

test('package is v1.16.2 combat feel hotfix',()=>ok(pkg.version==='1.16.2',`version=${pkg.version}`));
test('DOM ids stay unique',()=>{const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);ok(dup.length===0,`duplicate ids: ${[...new Set(dup)].join(', ')}`);});
test('pixel rendering protections remain',()=>{ok(game.includes('pixelArt: true'),'pixelArt missing');ok(game.includes('antialias: false'),'antialias missing');ok(game.includes('roundPixels: true'),'roundPixels missing');ok(game.includes('Phaser.Textures.FilterMode.NEAREST'),'NEAREST missing');ok(css.includes('image-rendering:pixelated')||css.includes('image-rendering: pixelated'),'CSS pixelated missing');});
test('player sprites remain native scale and torso hit circles are explicit',()=>{
  const expected={gamja:'r: 6, cx: 33, cy: 50',gucci:'r: 7, cx: 31, cy: 49',mandu:'r: 7, cx: 31, cy: 47',jjigae:'r: 7, cx: 31, cy: 47'};
  for(const [id,hit] of Object.entries(expected)){
    const line=game.split('\n').find(x=>x.trim().startsWith(id+': {')&&x.includes('worldScale:'));
    ok(line,`${id} config missing`);ok(line.includes('worldScale: 1'),`${id} scale changed`);ok(line.includes(hit),`${id} hit circle mismatch`);
  }
  ok(!/displayWidth\s*=|displayHeight\s*=|setDisplaySize\s*\(/.test(game),'display size deformation API found');
  ok(game.includes('this.player.body.setCircle(hb.r, hb.cx-hb.r, hb.cy-hb.r)'),'local player circle body missing');
  ok(game.includes('this.ally.body.setCircle(ahb.r, ahb.cx-ahb.r, ahb.cy-ahb.r)'),'ally player circle body missing');
});
test('enemy bullet collision cores are explicit and smaller than visuals',()=>{ok(game.includes('const ENEMY_BULLET_HITBOX'),'bullet hitbox table missing');for(const needle of ["enemy: { visualRadius:5, hitRadius:3.5 }","boss:  { visualRadius:7, hitRadius:5.0 }","raid:  { visualRadius:8, hitRadius:5.5 }"])ok(game.includes(needle),`missing ${needle}`);ok(game.includes('b.body.setCircle(hit.hitRadius'),'bullet circle body missing');});
test('F2 hitbox debug is development-only and defaults hidden',()=>{ok(game.includes("this.input.keyboard.on('keydown-F2'"),'F2 listener missing');ok(game.includes('updateHitboxDebug()'),'debug draw missing');ok(game.includes("초록=플레이어 · 빨강=적 탄환"),'debug legend missing');ok(!html.includes('HITBOX DEBUG'),'debug UI leaked into DOM');});
test('old spear-like rush warning is gone',()=>{ok(game.includes("create('rushLine', 128, 8"),'rushLine missing');ok(!game.includes("create('rushWarning'"),'old rushWarning texture remains');ok(!game.includes("texture:'rushWarning'"),'old rushWarning network ref remains');ok(game.includes("texture:'rushLine'"),'rushLine network ref missing');});
test('grape dash uses target lock, overshoot, body telegraph, afterimage and recovery',()=>{for(const needle of ['const GRAPE_RUSH','enemy.rushTargetX=t.x;enemy.rushTargetY=t.y','GRAPE_RUSH.overshoot','spawnRaidRushAfterimage','spawnRaidRushDust','spawnRaidRushImpact','enemy.rushRecoveryUntil=this.runTimeMs+recovery','const back=6*Math.sin','const wiggle='])ok(game.includes(needle),`missing ${needle}`);ok(!game.includes("this.showBanner('포도 돌진 준비!'"),'dash should be read from boss body/floor line, not a repeated UI banner');});
test('DOM HUD and shared safe area remain',()=>{ok(game.includes("root:document.querySelector('#combat-hud')"),'DOM HUD missing');ok(css.includes('--hud-safe-x:')&&css.includes('--hud-safe-y:'),'safe variables missing');ok(css.includes('.combat-run-hud time'),'time HUD missing');ok(css.includes('.audio-toggle:after'),'sound tooltip polish missing');});
test('park stays visual-only and uses blended continuous paths',()=>{const world=game.slice(game.indexOf('createWorld() {'),game.indexOf('createGroups() {'));ok(world.includes('this.add.graphics()'),'ground graphics missing');ok(!world.includes("'pathTileH'")&&!world.includes("'pathTileV'"),'old path tile placement returned');ok(world.includes('0x8f7d65,0.52')&&world.includes('0x9a886f,0.74'),'blended path palette missing');ok(world.includes('fillPoints(oct(78,60)'),'plaza geometry missing');ok(!/physics\.add\.(?:staticGroup|image|sprite)\([^\n]*(?:parkTree|parkBench|parkPond|parkFence|dogParkSet)/.test(game),'decor became physical');});
test('core game/network systems are still present',()=>['pendingTrueBoss','TRUE_BOSS_PATTERNS','updateRevives','HEALING','openMilestoneAugment','openMajorAugment','openChest','buildNetworkSnapshot','coopSnapshot','volatile','GRAPE_RUSH'].forEach(x=>ok(game.includes(x),`missing ${x}`)));
test('core listeners remain single-registration',()=>{for(const [name,needle] of [['start',"document.querySelector('#start-btn').addEventListener('click'"],['audio',"audioToggle.addEventListener('click'"],['restart',"document.querySelector('#restart-btn').addEventListener('click'"]]){const n=game.split(needle).length-1;ok(n===1,`${name} count=${n}`);}});

if(fails){console.error(`V1.16.2 STATIC FAILURES: ${fails}`);process.exit(1);}console.log('ALL V1.16.2 COMBAT FEEL STATIC PASS');
