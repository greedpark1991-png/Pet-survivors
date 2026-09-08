const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const gamePath = path.join(__dirname, '..', 'public', 'game.js');
let src = fs.readFileSync(gamePath, 'utf8');
src = src.replace(/\}\)\(\);\s*$/, `window.__TEST_EXPORTS={SurvivorScene,TRUE_BOSS_PATTERNS,HEALING,treasureSkillStats,characterStartStats};})();`);

class FakeEl {
  constructor(){ this.classList={add(){},remove(){},toggle(){}}; this.style={}; this.dataset={}; this.value=''; this.textContent=''; this.innerHTML=''; }
  addEventListener(){} querySelector(){return new FakeEl();} appendChild(){} setAttribute(){}
}
class FakeAudio { constructor(){this.volume=1;this.currentTime=0;this.preload='';this.loop=false;} addEventListener(){} play(){return Promise.resolve();} pause(){} }
class FakeImage { set src(_v){} }
class Scene { constructor(){} }
const PMath={
  Clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
  Between:(a,b)=>Math.floor((a+b)/2),
  FloatBetween:(a,b)=>(a+b)/2,
  Distance:{Between:(x1,y1,x2,y2)=>Math.hypot(x2-x1,y2-y1),Squared:(x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1;return dx*dx+dy*dy;}},
  Angle:{Between:(x1,y1,x2,y2)=>Math.atan2(y2-y1,x2-x1),Wrap:(a)=>{while(a<=-Math.PI)a+=Math.PI*2;while(a>Math.PI)a-=Math.PI*2;return a;}},
  Linear:(a,b,t)=>a+(b-a)*t,
  RadToDeg:r=>r*180/Math.PI
};
const context={
  console,
  window:{io:null,AudioContext:null,webkitAudioContext:null},
  document:{querySelector:()=>new FakeEl(),querySelectorAll:()=>[],createElement:()=>new FakeEl()},
  navigator:{clipboard:{writeText:async()=>{}}},
  localStorage:{getItem:()=>null,setItem(){}},
  Audio:FakeAudio,Image:FakeImage,
  Phaser:{Scene,Math:PMath,Utils:{Array:{GetRandom:a=>a[0]}},Scale:{FIT:1,CENTER_BOTH:1},AUTO:1,Game:class{}},
  setTimeout,clearTimeout,Map,Set,Math,Number,Infinity
};
vm.createContext(context);
vm.runInContext(src,context,{filename:'game.js'});
const {SurvivorScene,TRUE_BOSS_PATTERNS,HEALING,treasureSkillStats,characterStartStats}=context.window.__TEST_EXPORTS;

let passed=0;
function test(name,fn){try{fn();console.log('PASS',name);passed++;}catch(e){console.error('FAIL',name);console.error(e.stack||e);process.exitCode=1;}}
function fakeEnemy(role,xp=0){return {active:true,enemyRole:role,xpValue:xp,x:100,y:100,hp:100,maxHp:100,getData:()=>false,setData(){},destroy(){this.active=false;},body:{velocity:{x:0,y:0},setVelocity(){}}};}
function sceneSolo(){const s=new SurvivorScene();s.init({character:'jjigae'});s.showBanner=()=>{};s.cameras={main:{flash(){},shake(){},width:960,height:540}};s.time={delayedCall:(ms,fn)=>({ms,fn})};return s;}

test('reset/init clears all new v1.15 run state',()=>{const s=sceneSolo();assert.equal(s.pendingTrueBoss,null);assert.equal(s.lastRegularBossSpawnAt,-999999);assert.equal(s.lastTrueBossEndedAt,-999999);assert.equal(s.raidPendingSeq,0);assert.equal(s.pendingCleanupProgression,false);});
test('v1.15 healing constants',()=>{assert.equal(HEALING.snackPct,0.20);assert.equal(HEALING.levelUpPct,0.03);assert.equal(HEALING.eliteSnackChance,0.10);assert.equal(HEALING.cleanupXpRatio,0.50);});
test('v1.14 character passives preserved',()=>{assert.equal(characterStartStats('mandu').maxHp,108);assert(Math.abs(characterStartStats('gamja').moveSpeed-201.4)<1e-9);assert.equal(characterStartStats('gucci').basicDamageMult,1.05);assert.equal(characterStartStats('jjigae').basicProjectileScale,1.10);});
test('treasure growth including shrink ray / juice box preserved',()=>{assert(treasureSkillStats('shrinkRay',3).minScale<treasureSkillStats('shrinkRay',1).minScale);assert(treasureSkillStats('shrinkRay',3).contactDamageMult<treasureSkillStats('shrinkRay',1).contactDamageMult);assert(treasureSkillStats('juiceBox',3).healPct>treasureSkillStats('juiceBox',1).healPct);assert(treasureSkillStats('juiceBox',3).repeatFactor>treasureSkillStats('juiceBox',1).repeatFactor);});
test('all 7 treasure skills have real level growth',()=>{for(const id of ['magicMissile','shrinkRay','juiceBox','veil','sword','hellConductor','bulletBarrage']){const a=treasureSkillStats(id,1),b=treasureSkillStats(id,2);assert.notDeepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),id);for(const v of Object.values(b))if(typeof v==='number')assert(Number.isFinite(v),id);}});
test('TRUE boss table has 3 patterns per phase per boss',()=>{for(const kind of ['grape','choco','onion'])for(const phase of [1,2])assert.equal(TRUE_BOSS_PATTERNS[kind].filter(p=>p.phase===phase).length,3,`${kind} phase${phase}`);});
test('TRUE boss pattern metadata is complete and finite',()=>{for(const kind of ['grape','choco','onion'])for(const p of TRUE_BOSS_PATTERNS[kind]){assert(p.id&&p.execute);assert([1,2].includes(p.phase));assert(Number.isFinite(p.weight)&&p.weight>0);assert(Number.isFinite(p.cooldown)&&p.cooldown>=900);assert(Number.isFinite(p.minDistance)&&p.minDistance>=0);assert(typeof p.condition==='string');}});
test('late-game scaling and boss escalation remain finite',()=>{const s=sceneSolo();for(const min of [0,5,10,15,30,60,180]){s.runTimeMs=min*60000;const x=s.getScaling();for(const v of [x.hp,x.speed,x.damage])assert(Number.isFinite(v));assert(x.hp<=12&&x.speed<=1.42&&x.damage<=1.40);}for(let i=1;i<=30;i++){const b=s.getBossEscalation(i);for(const k of ['hp','damage','speed','shotInterval','shotSpeed','fanBonus','ringBonus'])assert(Number.isFinite(b[k]));}});
test('pattern selector avoids previous two when 3 choices exist',()=>{for(let raidIndex=0;raidIndex<3;raidIndex++){const s=sceneSolo();s.nearestActivePlayerTo=()=>({x:300,y:300,active:true,body:{velocity:{x:0,y:0}}});const e={x:0,y:0,raidIndex,raidPhase2:false,raidPatternHistory:[],rushTelegraphUntil:0,rushUntil:0};const ids=[];for(let i=0;i<12;i++)ids.push(s.selectRaidPattern(e).id);for(let i=1;i<ids.length;i++)assert.notEqual(ids[i],ids[i-1]);for(let i=2;i<ids.length;i++)assert.notEqual(ids[i],ids[i-2]);}});
test('snack heals 20% and never overheals',()=>{const s=sceneSolo();s.maxHp=100;s.hp=87;s.playerDown=false;s.updateHud=()=>{};s.collectItem({}, {active:true,itemType:'snack',destroy(){this.active=false;}});assert.equal(s.hp,100);s.hp=40;s.collectItem({}, {active:true,itemType:'snack',destroy(){}});assert.equal(s.hp,60);});
test('2P snack heals picker only',()=>{const s=sceneSolo();s.coopMode=true;s.networkRole='host';const a={id:'a',maxHp:100,hp:40,down:false},b={id:'b',maxHp:100,hp:70,down:false};s.getBuild=id=>id==='a'?a:b;s.getLocalBuild=()=>a;s.withBuild=(build,fn)=>{const prev={hp:s.hp,maxHp:s.maxHp,down:s.playerDown};s.hp=build.hp;s.maxHp=build.maxHp;s.playerDown=build.down;fn();build.hp=s.hp;Object.assign(s,{hp:prev.hp,maxHp:prev.maxHp,playerDown:prev.down});};s.updateHud=()=>{};s.collectItem({netPlayerId:'a'},{active:true,itemType:'snack',destroy(){}});assert.equal(a.hp,60);assert.equal(b.hp,70);});
test('level-up recovery is 3% for alive players only',()=>{const s=sceneSolo();s.maxHp=200;s.hp=100;s.playerDown=false;s.applyLevelUpRecovery();assert.equal(s.hp,106);s.coopMode=true;s.networkRole='host';s.currentBuildId='x';s.builds=new Map([['a',{id:'a',maxHp:100,hp:50,down:false}],['b',{id:'b',maxHp:120,hp:0,down:true}]]);s.getBuild=()=>null;s.getLocalBuild=()=>null;s.applyLevelUpRecovery();assert.equal(s.builds.get('a').hp,53);assert.equal(s.builds.get('b').hp,0);});
test('pending TRUE boss preserves live regular boss at trigger',()=>{const s=sceneSolo();s.runTimeMs=340000;s.lastRegularBossSpawnAt=300000;const boss=fakeEnemy('boss');s.enemies={getChildren:()=>[boss]};s.queueTrueBossEncounter(35);assert(s.pendingTrueBoss);assert(boss.active);assert.equal(s.pendingTrueBoss.deadlineAt,364000);assert.equal(s.pendingTrueBoss.earliestStartAt,360000);assert.equal(s.pendingTrueBoss.blockSpawns,true);assert.equal(s.updatePendingTrueBoss(),true);});
test('pending without a live regular boss can keep normal wave until minimum gap',()=>{const s=sceneSolo();s.runTimeMs=340000;s.lastRegularBossSpawnAt=300000;s.enemies={getChildren:()=>[]};s.queueTrueBossEncounter(35);assert.equal(s.pendingTrueBoss.blockSpawns,false);assert.equal(s.updatePendingTrueBoss(),false);});
test('regular boss natural kill keeps normal reward then pending can transition',()=>{const s=sceneSolo();s.runTimeMs=340000;s.lastRegularBossSpawnAt=300000;const boss=fakeEnemy('boss');let arr=[boss],reward=0,started=0;s.enemies={getChildren:()=>arr};s.destroyEnemyDecorations=()=>{};s.dropRegularBossRewards=()=>reward++;s.queueTrueBossEncounter(35);s.killEnemy(boss);assert.equal(reward,1);s.runTimeMs=350000;s.updatePendingTrueBoss();s.startRaidBossEncounter=()=>{started++;};s.runTimeMs=360100;s.updatePendingTrueBoss();assert.equal(started,1);});
test('pending timeout removes boss only after 24s and guarantees reward',()=>{const s=sceneSolo();s.runTimeMs=340000;s.lastRegularBossSpawnAt=300000;const boss=fakeEnemy('boss');s.enemies={getChildren:()=>[boss]};let rewards=0;s.dropRegularBossRewards=()=>rewards++;s.destroyEnemyDecorations=()=>{};s.queueTrueBossEncounter(35);s.runTimeMs=363999;s.updatePendingTrueBoss();assert(boss.active);s.runTimeMs=364000;s.updatePendingTrueBoss();assert.equal(rewards,1);assert.equal(boss.active,false);});
test('battlefield cleanup grants exactly 50% of remaining raw XP',()=>{const s=sceneSolo();s.xp=0;const a=fakeEnemy('normal',2),b=fakeEnemy('elite',8);s.enemies={getChildren:()=>[a,b]};s.enemyProjectiles={clear(){this.cleared=true;}};s.destroyEnemyDecorations=()=>{};s.dropRegularBossRewards=()=>{throw new Error('no boss expected')};const r=s.clearBattlefieldForRaid();assert.equal(r.cleanupXp,5);assert.equal(s.xp,5);assert.equal(s.pendingCleanupProgression,true);});
test('battlefield cleanup preserves player/down/build state and existing pickups',()=>{const s=sceneSolo();const normal=fakeEnemy('normal',2);s.enemies={getChildren:()=>[normal]};let bulletsCleared=0;s.enemyProjectiles={clear(){bulletsCleared++;}};s.destroyEnemyDecorations=()=>{};s.dropRegularBossRewards=()=>{};s.gems={sentinel:'gems'};s.items={sentinel:'items'};s.coopMode=true;s.builds=new Map([['a',{id:'a',hp:0,down:true,reviveProgress:2100,deathCount:2}],['b',{id:'b',hp:55,down:false,reviveProgress:0,deathCount:0}]]);const before=JSON.stringify([...s.builds.entries()]);s.clearBattlefieldForRaid();assert.equal(JSON.stringify([...s.builds.entries()]),before);assert.equal(s.gems.sentinel,'gems');assert.equal(s.items.sentinel,'items');assert.equal(bulletsCleared,1);});
test('forced regular boss reward guarantees one normal reward + one snack',()=>{const s=sceneSolo();let snack=0,other=0;s.dropSnack=()=>snack++;s.dropMagnet=()=>other++;s.dropChest=()=>other++;const old=Math.random;Math.random=()=>0.2;try{s.dropRegularBossRewards(0,0,true);}finally{Math.random=old;}assert.equal(snack,1);assert.equal(other,1);});
test('TRUE boss kill reward is magnet + two chests + two snacks and records end time',()=>{const s=sceneSolo();s.runTimeMs=500000;s.raidBossActive=true;s.destroyEnemyDecorations=()=>{};let m=0,c=0,n=0;s.dropMagnet=()=>m++;s.dropChest=()=>c++;s.dropSnack=()=>n++;const e=fakeEnemy('raidBoss');e.raidName='거대 포도';s.killEnemy(e);assert.equal(m,1);assert.equal(c,2);assert.equal(n,2);assert.equal(s.lastTrueBossEndedAt,500000);assert.equal(s.raidBossActive,false);});
test('regular boss due less than 60s after TRUE boss is skipped, preserving later 5m cycle',()=>{const s=sceneSolo();s.runTimeMs=600000;s.lastTrueBossEndedAt=570000;s.nextBossAt=600;s.nextRaidWave=9999;s.event180Done=true;s.nextPressureEventAt=99999;s.enemies={getChildren:()=>[]};s.spawnOutsideView=()=>{};s.spawnElite=()=>{};s.spawnRingEvent=()=>{};s.spawnPressureEvent=()=>{};let bosses=0;s.spawnBoss=()=>bosses++;s.updateWaveSpawns(16);assert.equal(bosses,0);assert.equal(s.nextBossAt,900);});

function exerciseAllPatterns(coop){
  for(let raidIndex=0;raidIndex<3;raidIndex++)for(const phase of [1,2]){
    const kind=['grape','choco','onion'][raidIndex];
    const defs=TRUE_BOSS_PATTERNS[kind].filter(p=>p.phase===phase);
    for(const def of defs){
      const s=sceneSolo();s.runTimeMs=1000;s.raidBossActive=true;s.raidBossCount=1;s.coopMode=coop;
      const p1={x:320,y:30,active:true,body:{velocity:{x:120,y:20}}},p2={x:260,y:-120,active:true,body:{velocity:{x:-70,y:80}}};
      s.player=p1;s.nearestActivePlayerTo=()=>p1;s.activeRaidTargets=()=>coop?[p1,p2]:[p1];
      let shots=0,rush=0,delayed=[];s.spawnEnemyBullet=(x,y,a,sp,dmg,_kind,life)=>{for(const v of [x,y,a,sp,dmg,life])assert(Number.isFinite(v),`${def.id} non-finite bullet value`);assert(sp>0&&dmg>=0&&life>0);shots++;};s.time={delayedCall:(_ms,fn)=>{delayed.push(fn);}};s.beginRaidRushTelegraph=()=>{rush++;return true;};
      const e={active:true,x:0,y:0,raidIndex,raidPhase2:phase===2,getData:()=>false,rushTelegraphUntil:0,rushUntil:0};
      s.executeRaidPattern(e,def);let guard=0;while(delayed.length&&guard++<20){const jobs=delayed.splice(0);jobs.forEach(fn=>fn());}
      assert(shots>0||rush>0,`${def.id} produced no attack`);
    }
  }
}
test('all 18 TRUE boss pattern definitions execute in solo',()=>exerciseAllPatterns(false));
test('all 18 TRUE boss pattern definitions execute in 2P targeting mode',()=>exerciseAllPatterns(true));
test('rush telegraph is 0.5-0.7s and leaves a fixed direction warning',()=>{const s=sceneSolo();s.runTimeMs=5000;s.add={image:()=>({active:true,setDepth(){return this},setRotation(){return this},setScale(){return this},setAlpha(){return this},destroy(){this.active=false},setPosition(){return this}})};s.nearestActivePlayerTo=()=>({x:200,y:0,active:true,body:{velocity:{x:0,y:0}}});const e={active:true,x:0,y:0,raidPhase2:false,getData:()=>false};assert(s.beginRaidRushTelegraph(e,null,false));const d=e.rushTelegraphUntil-s.runTimeMs;assert(d>=500&&d<=700);assert(Number.isFinite(e.rushAngle));});
test('2P revive state fields remain present in network build summary',()=>{const s=sceneSolo();s.runTimeMs=10000;const summary=s.buildSummary({id:'p',characterKey:'mandu',hp:0,maxHp:108,down:true,attackPower:20,moveSpeed:190,basicCooldown:1500,extraBasicShots:0,basicDamageMult:1,xpGainMult:1,gemMagnetRange:135,playerDamageMult:1,levelUpgradeCounts:{},augments:[],characterAugmentLevels:{},majorLevels:{},skillLevels:{},shieldCharges:0,reviveProgress:2400,reviveNeedMs:4800,deathCount:1,playerInvulnUntil:0});assert.equal(summary.down,true);assert.equal(summary.reviveProgress,2400);assert.equal(summary.reviveNeedMs,4800);assert.equal(summary.deathCount,1);});
test('actual revive restores 50% HP and 2s invulnerability',()=>{const s=sceneSolo();s.runTimeMs=20000;s.tweens={add(){}};s.clearReviveUi=()=>{};s.withBuild=(_b,fn)=>fn();const sprite={active:true,alpha:0.38,body:{enable:false,setVelocity(){}},setAlpha(v){this.alpha=v;return this;}};const build={id:'p',down:true,hp:0,maxHp:120,reviveProgress:4800,deathCount:1,majorLevels:{},sprite,shadow:{setAlpha(){return this;}},charData:{name:'만두'}};s.reviveBuild(build);assert.equal(build.down,false);assert.equal(build.hp,60);assert.equal(build.playerInvulnUntil,22000);assert.equal(sprite.body.enable,true);});
test('snack itemType is serialized for 2P snapshots',()=>{const s=sceneSolo();s.netIdCounter=1;s._netInterestPoints=[];const item={active:true,x:10,y:20,texture:{key:'snackItem'},rotation:0,scaleX:1,scaleY:1,flipX:false,itemType:'snack'};const out=s.serializeGroup({getChildren:()=>[item]},'i','item',900);assert.equal(out.length,1);assert.equal(out[0].it,'snack');});
test('v1.15 network snapshot source includes pending raid and rush telegraph fields',()=>{const source=fs.readFileSync(gamePath,'utf8');assert(source.includes('raidPendingSeq:this.raidPendingSeq'));assert(source.includes('raidPendingActive:!!this.pendingTrueBoss'));assert(source.includes("texture:'rushWarning'"));assert(source.includes("itemType='snack'"));});

if(process.exitCode)process.exit(process.exitCode);
console.log(`ALL PASS (${passed})`);
