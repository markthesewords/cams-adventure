'use strict';
// ================= usernames + online leaderboards (only active when played from the website) =================
if(!META.id){ META.id=(Date.now().toString(36)+Math.random().toString(36).slice(2,10)); saveMeta(); }
const LB={ url:'/.netlify/functions/leaderboard', on:location.protocol.startsWith('http'),
  async call(method,body,qs){ if(!this.on) return null;
    try{ const ctl=new AbortController(), to=setTimeout(()=>ctl.abort(),6000);
      const r=await fetch(this.url+(qs||''),{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:ctl.signal}); clearTimeout(to);
      if(r.status===404){ this.on=false; return null; } const data=await r.json().catch(()=>null); return {status:r.status,data}; }catch(e){ return null; } },
  register(name){ return this.call('POST',{action:'register',name,id:META.id}); },
  submit(game,score,level){ return this.call('POST',{action:'score',game,name:META.name,id:META.id,score,level:level||''}); },
  top(game){ return this.call('GET',null,'?game='+encodeURIComponent(game)); } };
function nameEntry(taken){
  return new Promise(resolve=>{
    const KEYS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').concat(['DEL','OK']); const COLS=9; let name=taken?'':(META.name||''), cur=0, msg=taken?'That name got taken by someone else. Pick a new one.':'', busy=false; const t0=S.t;
    const geo=()=>{ const gy=VH<200?84:Math.round(VH*0.5); const cw=Math.min(22,Math.floor((VW-16)/COLS),Math.floor((VH-gy-16)/5)), gx=Math.round(VW/2-cw*COLS/2); return {cw,gx,gy}; };
    const cell=i=>{ const {cw,gx,gy}=geo(); if(i<36) return [gx+(i%COLS)*cw,gy+Math.floor(i/COLS)*cw,cw,cw]; const w=cw*4; return [gx+(i===36?0:cw*5),gy+4*cw+3,w,cw]; };
    const done=async()=>{ if(busy) return; if(name.length<2){ msg='At least 2 letters.'; blip(180,0.1,0.05,'sawtooth'); return; }
      busy=true; msg='Checking...'; const r=await LB.register(name); busy=false;
      if(r&&r.status===409){ msg='Somebody already has '+name+'. Try another.'; blip(180,0.15,0.05,'sawtooth'); return; }
      META.name=name; META.nameTaken=false; saveMeta(); jingle([523,659,784,1047],0.08,'triangle',0.06); S.rawKey=null; S.rawTap=null; S.mini=null; resolve(name); };
    const press=k=>{ if(busy) return; if(k==='OK') return done(); if(k==='DEL'){ name=name.slice(0,-1); blip(300,0.04,0.04); return; } if(name.length<10){ name+=k; blip(700+name.length*30,0.04,0.04); msg=''; } };
    S.rawKey=e=>{ if(e.key==='Enter') return done(); if(e.key==='Backspace') return press('DEL'); if(/^[a-zA-Z0-9]$/.test(e.key)) return press(e.key.toUpperCase());
      const mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-COLS,ArrowDown:COLS}[e.key]; if(mv){ cur=Math.max(0,Math.min(KEYS.length-1,cur+mv)); blip(600,0.02,0.03); } };
    S.rawTap=(x,y)=>{ for(let i=0;i<KEYS.length;i++){ const [cx,cy,w,h]=cell(i); if(x>=cx&&x<cx+w&&y>=cy&&y<cy+h){ cur=i; press(KEYS[i]); return; } } };
    S.mini={ full:true,
      update(dt){ const mv=(hit('left')?-1:0)+(hit('right')?1:0)+(hit('up')?-COLS:0)+(hit('down')?COLS:0); if(mv){ cur=Math.max(0,Math.min(KEYS.length-1,cur+mv)); blip(600,0.02,0.03); }
        if(hit('a')&&S.t-t0>0.3) press(KEYS[cur]); if(hit('b')) press('DEL'); },
      draw(){ ctx.fillStyle='#1c1826'; ctx.fillRect(0,0,VW,VH); const W=VW, cx=W/2;
        txt('WHO\'S PLAYING?',cx,8,'#ffd98a',11,'center',true);
        const L=wrap('Pick your username for the leaderboards. It works like initials on an arcade machine at a bar: your best scores get posted under it so everyone can see who\'s on top. It has to be a name nobody else is using.',Math.min(W-20,280),6.5);
        L.forEach((l,i)=>txt(l,cx,24+i*8.5,'#c9c0d8',6.5,'center'));
        const ny=28+L.length*8.5; box(cx-62,ny,124,18,'#2a2438','#ffd98a'); txt(name+(Math.floor(S.t*2)%2&&name.length<10?'_':''),cx,ny+4,'#fff',10,'center',true);
        if(msg) txt(msg,cx,ny+21,msg==='Checking...'?'#c9c0d8':'#f28a8a',6.5,'center');
        KEYS.forEach((k,i)=>{ const [x,y,w,h]=cell(i), on=i===cur; U.fillStyle=on?'#ffd98a':(i>=36?'#4a3f6a':'#2f2942'); U.fillRect(x+1,y+1,w-2,h-2); U.strokeStyle=on?'#fff':'#5a5074'; U.lineWidth=1; U.strokeRect(x+1.5,y+1.5,w-3,h-3);
          txt(k==='DEL'?'ERASE':k==='OK'?'DONE':k,x+w/2,y+h/2-(i>=36?3.5:(h<18?3.6:4.5)),on?'#2e2838':'#f4ead8',i>=36?(h<18?6:7):(h<18?7:9),'center',true); });
        txt(isTouch()?'Tap the letters, then DONE':'Type it, then press Enter',cx,VH-10,'#7d7590',6,'center'); } };
  });
}
// after a mini game: post the score and show the top of the board (skipped when the game is played from a file)
async function showBoard(game,title,score,level){
  if(!LB.on) return; if(!META.name||META.nameTaken) await nameEntry(META.nameTaken); if(!META.name) return;
  let rows=null, me=null, state='Posting your score...', ok=false; const t0=S.t;
  S.mini={ full:true, tapA:true, update(){ if((hit('a')||hit('b'))&&S.t-t0>0.6&&state!=='Posting your score...') ok=true; hit('left');hit('right');hit('up');hit('down'); },
    draw(){ ctx.fillStyle='#1c1826'; ctx.fillRect(0,0,VW,VH); const W=VW,cx=W/2,bw=Math.min(230,W-12),x=cx-bw/2;
      box(x,6,bw,VH-12,'#221d30','#ffd98a'); txt(title+'  LEADERBOARD',cx,12,'#ffd98a',9,'center',true);
      if(!rows){ txt(state,cx,VH/2-4,'#c9c0d8',7,'center'); }
      else { txt('#',x+10,27,'#7d7590',6,'left',true); txt('NAME',x+26,27,'#7d7590',6,'left',true); txt('SCORE',x+bw-58,27,'#7d7590',6,'right',true); txt('LEVEL',x+bw-10,27,'#7d7590',6,'right',true);
        rows.slice(0,10).forEach((r,i)=>{ const y=37+i*10.5, mine=r.name===META.name; if(mine){ U.fillStyle='rgba(255,217,138,0.16)'; U.fillRect(x+5,y-1.5,bw-10,10); }
          const c=mine?'#ffd98a':'#f4ead8'; txt(String(i+1),x+10,y,c,7,'left',true); txt(r.name,x+26,y,c,7,'left',mine); txt(String(r.score),x+bw-58,y,c,7,'right',true); txt(r.level||'',x+bw-10,y,'#a9a0b8',6,'right'); });
        if(me&&me.rank>10) txt('You: #'+me.rank+'   '+META.name+'   '+me.score,cx,37+10*10.5+2,'#ffd98a',7,'center',true);
        if(me&&score<me.score) txt('This run: '+score+'.  Your best stays posted.',cx,VH-30,'#a9a0b8',6,'center'); }
      if(state!=='Posting your score...'&&Math.floor(S.t*2)%2) txt(keyName('a')+': continue',cx,VH-19,'#ffd98a',7,'center',true); } };
  const r=await LB.submit(game,score,level);
  if(r&&r.status===409){ META.nameTaken=true; saveMeta(); state='That username belongs to someone else now. You\'ll pick a new one next time.'; }
  else if(r&&r.data&&r.data.top){ rows=r.data.top; me=r.data.me; state='ok'; }
  else { const g=await LB.top(game); if(g&&g.data&&g.data.top){ rows=g.data.top; state='ok'; } else state='Couldn\'t reach the leaderboard. Your score is saved on this device.'; }
  while(!ok) await wait(60);
}
