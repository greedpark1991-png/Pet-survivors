const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || '/').split('?')[0]);
  if (raw.startsWith('/socket.io/')) return;
  const relative = raw === '/' ? 'index.html' : raw.replace(/^\/+/, '');
  const filePath = path.normalize(path.join(ROOT, relative));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      fs.readFile(path.join(ROOT, 'index.html'), (e, data) => {
        if (e) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(filePath).pipe(res);
  });
});

const io = new Server(server, { transports: ['websocket', 'polling'] });
const rooms = new Map();
const CHARS = new Set(['jjigae','mandu','gamja','gucci']);

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let tries=0; tries<80; tries++) {
    let s=''; for (let i=0;i<5;i++) s += alphabet[Math.floor(Math.random()*alphabet.length)];
    if (!rooms.has(s)) return s;
  }
  return String(Date.now()).slice(-5);
}
function publicRoom(room) {
  return {
    code: room.code, hostId: room.hostId, started: room.started,
    players: [...room.players.values()].map(p => ({ id:p.id, slot:p.slot, character:p.character }))
  };
}
function getRoom(socket) { return socket.data.roomCode ? rooms.get(socket.data.roomCode) : null; }
function emitRoom(room) { io.to(room.code).emit('coopRoom', publicRoom(room)); }
function leaveRoom(socket, notify=true) {
  const room = getRoom(socket); if (!room) return;
  room.players.delete(socket.id); socket.leave(room.code); socket.data.roomCode = null;
  if (!room.players.size) { rooms.delete(room.code); return; }
  if (room.hostId === socket.id) {
    room.started = false;
    room.hostId = [...room.players.keys()][0];
    const host = room.players.get(room.hostId); if (host) host.slot = 1;
    for (const p of room.players.values()) if (p.id !== room.hostId) p.slot = 2;
    io.to(room.code).emit('coopHostChanged', { hostId:room.hostId });
  }
  if (notify) io.to(room.code).emit('coopPartnerLeft', { id:socket.id });
  emitRoom(room);
}

io.on('connection', socket => {
  socket.on('coopCreate', (payload={}, cb=()=>{}) => {
    leaveRoom(socket, false);
    const code = makeCode();
    const room = { code, hostId:socket.id, started:false, players:new Map() };
    room.players.set(socket.id, { id:socket.id, slot:1, character:CHARS.has(payload.character)?payload.character:'jjigae' });
    rooms.set(code, room); socket.join(code); socket.data.roomCode = code;
    cb({ ok:true, room:publicRoom(room), myId:socket.id }); emitRoom(room);
  });
  socket.on('coopJoin', (payload={}, cb=()=>{}) => {
    const code = String(payload.code||'').trim().toUpperCase();
    const room = rooms.get(code);
    if (!room) return cb({ ok:false, error:'방을 찾을 수 없어.' });
    if (room.started) return cb({ ok:false, error:'이미 게임이 시작된 방이야.' });
    if (room.players.size >= 2) return cb({ ok:false, error:'이미 2명이 들어와 있어.' });
    leaveRoom(socket, false);
    room.players.set(socket.id, { id:socket.id, slot:2, character:CHARS.has(payload.character)?payload.character:'mandu' });
    socket.join(code); socket.data.roomCode = code;
    cb({ ok:true, room:publicRoom(room), myId:socket.id }); emitRoom(room);
  });
  socket.on('coopCharacter', (payload={}, cb=()=>{}) => {
    const room=getRoom(socket); if(!room || room.started) return cb({ok:false});
    const p=room.players.get(socket.id); if(!p) return cb({ok:false});
    if(CHARS.has(payload.character)) p.character=payload.character;
    emitRoom(room); cb({ok:true});
  });
  socket.on('coopStart', (_payload={}, cb=()=>{}) => {
    const room=getRoom(socket); if(!room) return cb({ok:false,error:'방이 없어.'});
    if(room.hostId!==socket.id) return cb({ok:false,error:'방장만 시작할 수 있어.'});
    if(room.players.size<2) return cb({ok:false,error:'2명이 들어와야 시작할 수 있어.'});
    room.started=true; io.to(room.code).emit('coopStarted', publicRoom(room)); cb({ok:true});
  });
  socket.on('coopInput', payload => {
    const room=getRoom(socket); if(!room?.started || socket.id===room.hostId) return;
    io.to(room.hostId).emit('coopRemoteInput', { id:socket.id, input:payload?.input||{} });
  });
  socket.on('coopSnapshot', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    socket.to(room.code).emit('coopSnapshot', payload);
  });
  socket.on('coopChoicePrompt', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    if(!payload?.targetId || !room.players.has(payload.targetId)) return;
    io.to(payload.targetId).emit('coopChoicePrompt', payload);
  });
  socket.on('coopChoicePick', payload => {
    const room=getRoom(socket); if(!room?.started || socket.id===room.hostId) return;
    io.to(room.hostId).emit('coopChoicePick', { playerId:socket.id, kind:payload?.kind, choiceId:payload?.choiceId });
  });
  socket.on('coopChoiceState', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    socket.to(room.code).emit('coopChoiceState', payload||{});
  });
  socket.on('coopChoiceResume', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    socket.to(room.code).emit('coopChoiceResume', payload||{});
  });
  socket.on('coopPauseRequest', () => {
    const room=getRoom(socket); if(!room?.started || socket.id===room.hostId) return;
    io.to(room.hostId).emit('coopPauseRequest', { playerId:socket.id });
  });
  socket.on('coopPauseState', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    socket.to(room.code).emit('coopPauseState', payload||{});
  });
  socket.on('coopGameOver', payload => {
    const room=getRoom(socket); if(!room?.started || room.hostId!==socket.id) return;
    socket.to(room.code).emit('coopGameOver', payload||{});
  });
  socket.on('coopBackLobby', () => {
    const room=getRoom(socket); if(!room) return;
    room.started=false;
    io.to(room.code).emit('coopReturnedLobby', publicRoom(room));
    emitRoom(room);
  });
  socket.on('coopLeave', () => leaveRoom(socket, true));
  socket.on('disconnect', () => leaveRoom(socket, true));
});

server.listen(PORT, '0.0.0.0', () => console.log(`Pet Survivors 2P co-op running on :${PORT}`));
