const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
let src=fs.readFileSync(path.join(__dirname,'..','server.js'),'utf8').replace(/server\.listen\([\s\S]*?\);\s*$/,'');
class FakeServer {constructor(){this.handlers={};this.sent=[];FakeServer.instance=this;}on(ev,fn){this.handlers[ev]=fn;}to(target){const self=this;return {emit(ev,p){self.sent.push({target,ev,p,volatile:false});},volatile:{emit(ev,p){self.sent.push({target,ev,p,volatile:true});}}};}}
class FakeSocket{constructor(id,io){this.id=id;this.io=io;this.handlers={};this.data={};this.rooms=new Set();}on(ev,fn){this.handlers[ev]=fn;}join(code){this.rooms.add(code);}leave(code){this.rooms.delete(code);}to(target){const self=this;return {emit(ev,p){self.io.sent.push({from:self.id,target,ev,p,volatile:false});},volatile:{emit(ev,p){self.io.sent.push({from:self.id,target,ev,p,volatile:true});}}};}}
const ctx={console,process:{env:{}},__dirname:path.join(__dirname,'..'),Map,Set,String,Date,Math,decodeURIComponent,require:(name)=>{if(name==='http')return {createServer:()=>({})};if(name==='socket.io')return {Server:FakeServer};return require(name);}};
vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'server.js'});
const io=FakeServer.instance;assert(io.handlers.connection);
const host=new FakeSocket('HOST',io),guest=new FakeSocket('GUEST',io);io.handlers.connection(host);io.handlers.connection(guest);
let create;host.handlers.coopCreate({character:'jjigae'},r=>create=r);assert(create.ok&&create.room.players.length===1);const code=create.room.code;
let join;guest.handlers.coopJoin({code,character:'mandu'},r=>join=r);assert(join.ok&&join.room.players.length===2);
let start;host.handlers.coopStart({},r=>start=r);assert(start.ok);
io.sent=[];guest.handlers.coopInput({input:{right:true}});assert(io.sent.some(x=>x.ev==='coopRemoteInput'&&x.target==='HOST'&&x.volatile));
io.sent=[];host.handlers.coopSnapshot({t:123,raidPendingActive:true,items:[{it:'snack'}],players:[{id:'GUEST',down:true,reviveProgress:2400}]});assert(io.sent.some(x=>x.ev==='coopSnapshot'&&x.volatile&&x.p.t===123));
io.sent=[];guest.handlers.coopChoicePick({kind:'base',choiceId:'damage'});assert(io.sent.some(x=>x.ev==='coopChoicePick'&&x.target==='HOST'));
console.log('PASS Socket.IO mock: create/join/start/input/snapshot/choice relay');
