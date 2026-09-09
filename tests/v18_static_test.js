const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');const game=fs.readFileSync(path.join(root,'public/game.js'),'utf8'),html=fs.readFileSync(path.join(root,'public/index.html'),'utf8'),server=fs.readFileSync(path.join(root,'server.js'),'utf8'),pkg=require(path.join(root,'package.json'));
let n=0;function t(name,fn){try{fn();console.log('PASS',name);n++}catch(e){console.error('FAIL',name);throw e}}
t('package v1.18.0',()=>assert.equal(pkg.version,'1.18.0'));
t('v1.17 themed treasure skills preserved',()=>['자동 급식기','쪼그라들개!','간식 냠냠','넥카라 철벽','발톱 슥삭','산책줄 휘리릭','발바닥 도장'].forEach(x=>assert(game.includes(x),x)));
t('five TRUE boss phase textures present',()=>['enemy_raid_grape_green','enemy_raid_grape_red','enemy_raid_choco_white','enemy_raid_choco_macadamia','enemy_raid_onion_yellow','enemy_raid_onion_red','enemy_raid_coffee_ice','enemy_raid_coffee_espresso','enemy_raid_gum','enemy_raid_gum_giant'].forEach(x=>assert(game.includes(x),x)));
t('F2 expanded hitbox debug still present',()=>{assert(game.includes("keydown-F2"));assert(game.includes("enemy.enemyRole==='raidBoss'"))});
t('run complete UI has restart lobby endless',()=>['run-complete-screen','run-endless-btn','run-restart-btn','run-lobby-btn'].forEach(id=>assert(html.includes(`id="${id}"`),id)));
t('coop run complete and continue are relayed',()=>{assert(server.includes("coopRunComplete"));assert(server.includes("coopRunContinue"));assert(game.includes("socket.on('coopRunComplete'"));assert(game.includes("socket.on('coopRunContinue'"))});
t('delivery assets and rewards exist',()=>['deliveryCrate','deliveryShadow','deliveryAlert','rollDeliveryReward','spawnDeliveryDrop'].forEach(x=>assert(game.includes(x),x)));
t('no new player or large map rewrite',()=>{['jjigae','mandu','gamja','gucci'].forEach(k=>assert(game.includes(k)));assert(game.includes('this.worldSize = 6000'))});
t('host authoritative volatile snapshot retained',()=>{assert(game.includes("networkRole==='host'"));assert(game.includes("socket?.volatile"));assert(server.includes("socket.to(room.code).volatile.emit('coopSnapshot'"))});
t('v1.16.2 honest collision core retained',()=>{assert(game.includes('hitRadius:5.5'));assert(game.includes('hitbox: { r: 6'));});
console.log(`ALL V1.18 STATIC PASS (${n})`);
