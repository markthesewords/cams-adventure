'use strict';
const T=16; let VW=320, VH=180;
const cv=document.getElementById('c'), ctx0=cv.getContext('2d'); let ctx=ctx0; const uc=document.getElementById('u'), U=uc.getContext('2d'); let UK=1;
cv.width=VW; cv.height=VH; ctx.imageSmoothingEnabled=false;
const IMG={}; let loaded=0;
function loadImg(k,src){const im=new Image(); im.onload=()=>{loaded++;}; im.src=src; IMG[k]=im;}
loadImg('base',ASSET_BASE); loadImg('atlas',ASSET_ATLAS); loadImg('park',ASSET_PARK); loadImg('bsmt',ASSET_BSMT); loadImg('yard',ASSET_YARD);
let MAPD=DATA, MW=DATA.W*T, MH=DATA.H*T;
function setMap(name){ MAPD=(name==='park')?DATA_PARK:(name==='bsmt')?DATA_BSMT:(name==='yard')?DATA_YARD:DATA; MW=MAPD.W*T; MH=MAPD.H*T; S.map=name; S.snapCam=true; crumbs.length=0; }
// ---------------- state ----------------
const S={t:0,dlg:null,menu:null,clock:'',goal:'',light:'day',flags:{},inv:[],cam:{x:0,y:0},shake:0,fade:0,fadeTarget:0,banner:null,tip:null,title:true,bubbles:[],ended:false};
S.lock=0; S.glows=[]; Object.defineProperty(S,'cut',{get(){return S.lock>0;},set(v){ S.lock=v?S.lock+1:Math.max(0,S.lock-1);}});
const doors={}; for(const k in DATA.doors) doors[k]=DATA.doors[k].open; for(const k in DATA_BSMT.doors) doors[k]=DATA_BSMT.doors[k].open;
const OBJ={}; for(const o of DATA.objs) OBJ[o.id]=o;
const hidden=new Set(['sliderOpen','cribRail','y_sliderOpen']); for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.add(o.id);
// ---------------- input ----------------
const K={}; const pressed={};
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',
 KeyZ:'a',Space:'a',Enter:'a',KeyE:'a',ShiftLeft:'b',ShiftRight:'b',KeyX:'b',KeyB:'b',KeyI:'bag',Tab:'bag',Escape:'bag',KeyM:'mute'};
const isTouch=()=>document.body.classList.contains('touch');
// what to print for a button: touch shows A/B, a keyboard shows the real keys
function keyName(k,long){ if(isTouch()) return k==='a'?'A':k==='b'?'B':'▲'; return k==='a'?(long?'Z or Space':'Z'):k==='b'?(long?'X or Shift':'X'):'▲'; }
// developer mode: type "camdev", or tap the face badge five times within 2.5 s
let devBuf='', devTaps=[];
function devOpen(){ try{ localStorage.setItem('cam_dev','1'); sessionStorage.setItem('cam_warp','dev'); }catch(e){} location.reload(); }
addEventListener('keydown',e=>{ if(e.key&&e.key.length===1&&!S.rawKey){ devBuf=(devBuf+e.key.toLowerCase()).slice(-6); if(devBuf==='camdev'){ devOpen(); return; } } });
addEventListener('pointerdown',e=>{ const b=document.getElementById('face'); if(!b||!b.offsetParent) return; const r=b.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) return; const n=performance.now(); devTaps=devTaps.filter(q=>n-q<2500); devTaps.push(n); if(devTaps.length>=5) devOpen(); },true);
addEventListener('keydown',e=>{ if(S.rawKey){ if(e.key.length===1||['Enter','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){ e.preventDefault(); S.rawKey(e); audioKick(); } return; } let k=KEYMAP[e.code]; if(e.code==='KeyA'&&S.mini&&S.mini.abKeys) k='a'; if(!k)return; e.preventDefault(); if(!K[k])pressed[k]=true; K[k]=true; audioKick();});
addEventListener('keyup',e=>{const k=KEYMAP[e.code]; if(!k)return; K[k]=false; if(e.code==='KeyA') K.a=false;});
function hit(k){ if(pressed[k]){pressed[k]=false; return true;} return false; }
// touch buttons: act on pointerdown, buzz at once, never let the OS long-press in
const buzz=(ms)=>{ try{ navigator.vibrate&&navigator.vibrate(ms); }catch(e){} };
addEventListener('contextmenu',e=>e.preventDefault());
document.querySelectorAll('[data-k]').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{e.preventDefault(); try{b.setPointerCapture(e.pointerId);}catch(_){} if(!K[k])pressed[k]=true; K[k]=true; b.classList.add('on'); buzz(10); audioKick();};
  const off=e=>{e.preventDefault(); K[k]=false; b.classList.remove('on');};
  b.addEventListener('pointerdown',on); b.addEventListener('pointerup',off); b.addEventListener('pointercancel',off); b.addEventListener('lostpointercapture',off);
  b.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
});
// the d-pad, shown only while a game asks for it (S.mini.dpad): angle picks the direction, dead zone in the middle
(function(){
  const zone=document.getElementById('dzone'), pad=document.getElementById('dpad'); if(!zone) return;
  let pid=null, cur='';
  const set=(dirs)=>{ const key=dirs.join('+'); if(key===cur) return;
    for(const d of ['up','down','left','right']){ const want=dirs.includes(d); if(want&&!K[d]) pressed[d]=true; K[d]=want; pad.querySelector('[data-d='+d+']').classList.toggle('on',want); }
    cur=key; if(dirs.length) buzz(6); };
  const at=(e)=>{ const r=pad.getBoundingClientRect(), dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    if(Math.hypot(dx,dy)<r.width*0.10){ set([]); return; }
    set([Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')]); };   // four clean directions: these games pick, they don't steer
  zone.addEventListener('pointerdown',e=>{ e.preventDefault(); e.stopPropagation(); pid=e.pointerId; try{zone.setPointerCapture(pid);}catch(_){} audioKick(); at(e); });
  zone.addEventListener('pointermove',e=>{ if(e.pointerId===pid){ e.preventDefault(); at(e); } });
  const up=e=>{ if(e.pointerId!==pid) return; pid=null; set([]); };
  zone.addEventListener('pointerup',up); zone.addEventListener('pointercancel',up); zone.addEventListener('lostpointercapture',up);
  zone.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  setInterval(()=>{ const m=document.body.dataset.mode; if(m!=='mini'&&m!=='pick'&&pid!==null){ pid=null; set([]); } },150);
})();
// floating stick: wherever a finger lands becomes the centre; drag to walk, drag far to run, quick tap = A
(function(){
  const stick=document.getElementById('stick'), knob=document.getElementById('knob'); if(!stick) return;
  const R=46, DEAD=12, RUN=0.82, names=[['right'],['right','down'],['down'],['down','left'],['left'],['left','up'],['up'],['up','right']];
  let pid=null, ox=0, oy=0, t0=0, moved=false, cur='';
  const set=(dirs,run)=>{ const key=dirs.join('+'); K.run=!!run; stick.classList.toggle('run',!!run); if(key===cur) return;
    for(const d of ['up','down','left','right']){ const want=dirs.includes(d); if(want&&!K[d]) pressed[d]=true; K[d]=want; } cur=key; if(dirs.length) buzz(5); };
  const place=()=>{ stick.style.left=ox+'px'; stick.style.top=oy+'px'; };
  const at=e=>{ let dx=e.clientX-ox, dy=e.clientY-oy, d=Math.hypot(dx,dy);
    if(d>R){ ox+=dx/d*(d-R); oy+=dy/d*(d-R); place(); dx=e.clientX-ox; dy=e.clientY-oy; d=R; }   // the ring trails the finger
    knob.style.transform='translate('+dx+'px,'+dy+'px)';
    if(d<DEAD){ set([],false); return; } moved=true;
    let a=Math.atan2(dy,dx)*180/Math.PI; if(a<0)a+=360; let idx=Math.round(a/45)%8; const ci=names.findIndex(n=>n.join('+')===cur);
    if(ci>=0&&ci!==idx){ let diff=Math.abs(a-ci*45); if(diff>180)diff=360-diff; if(diff<22.5+12) idx=ci; }
    set(names[idx],d>R*RUN); };
  const end=(e,tap)=>{ if(pid===null||(e&&e.pointerId!==pid)) return; pid=null; stick.style.display='none'; set([],false); if(tap&&!moved&&performance.now()-t0<350){ pressed.a=true; buzz(8); } };
  let holdPid=null;
  addEventListener('pointerdown',e=>{ if(!isTouch()||e.pointerType==='mouse') return; if(e.target.closest&&e.target.closest('[data-k],#dzone')) return; if(e.target.tagName==='INPUT'||e.target.tagName==='BUTTON') return;
    audioKick(); e.preventDefault();
    if(uiMode()!=='walk'){ const r=cv.getBoundingClientRect(), inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      if(S.mini&&S.mini.holdA&&!S.dlg&&holdPid===null){ holdPid=e.pointerId; K.a=true; pressed.a=true; return; }
      if(uiMode()==='story'&&holdPid===null){ holdPid=e.pointerId; K.ff=true; return; }
      uiTap((e.clientX-r.left)/r.width*VW,(e.clientY-r.top)/r.height*VH,inside); return; }
    if(pid!==null) return;
    pid=e.pointerId; ox=e.clientX; oy=e.clientY; t0=performance.now(); moved=false; place(); knob.style.transform='translate(0,0)'; stick.style.display='block'; },{passive:false});
  const holdEnd=e=>{ if(holdPid!==null&&(!e||e.pointerId===holdPid)){ holdPid=null; K.a=false; K.ff=false; } };
  addEventListener('pointerup',holdEnd); addEventListener('pointercancel',holdEnd); addEventListener('blur',()=>holdEnd(null));
  setInterval(()=>{ if(pid!==null&&uiMode()!=='walk') end(null,false); },120);
  addEventListener('pointermove',e=>{ if(e.pointerId===pid){ e.preventDefault(); at(e); } },{passive:false});
  addEventListener('pointerup',e=>end(e,true)); addEventListener('pointercancel',e=>end(e,false));
  addEventListener('blur',()=>end(null,false)); document.addEventListener('visibilitychange',()=>{ if(document.hidden) end(null,false); });
})();
// the badge: a pixelated Cam, swapped for another every so often
(function(){ const f0=document.getElementById('f0'), f1=document.getElementById('f1'); if(!f0||typeof CAM_FACES==='undefined'||!CAM_FACES.length) return;
  let i=Math.floor(Math.random()*CAM_FACES.length), top=0; f0.src=CAM_FACES[i];
  setInterval(()=>{ let j; do{ j=Math.floor(Math.random()*CAM_FACES.length); }while(j===i&&CAM_FACES.length>1); i=j; const show=top?f0:f1, hide=top?f1:f0; show.src=CAM_FACES[i]; show.style.opacity=1; hide.style.opacity=0; top=1-top; },40000); })();
// what the player can do right now. The controls on screen, and what a tap means, follow this.
function uiMode(){ if(S.title) return 'talk'; if(S.dlg) return (S.dlg.choices&&S.dlg.shown>=S.dlg.text.length)?'pick':'talk'; if(S.menu) return 'talk'; if(S.mini) return (S.mini.card||S.mini.tapA)?'talk':'mini'; if(S.lock>0||S.cut||S.fade>=0.3) return 'story'; return 'walk'; }
// a tap that is not steering: it goes to the thing under the finger, never to "whatever is highlighted"
function uiTap(x,y,inside){
  if(S.rawTap){ if(inside) S.rawTap(x,y); return true; }
  if(S.title){ pressed.a=true; return true; }
  const d=S.dlg;
  if(d){ if(d.choices&&d.shown>=d.text.length){ for(const r of (d.rects||[])) if(inside&&x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3]){ d.sel=r[4]; pressed.a=true; buzz(8); return true; } return true; }
    pressed.a=true; return true; }
  if(S.menu){ pressed.a=true; return true; }
  const m=S.mini;
  if(m){ if(m.card||m.tapA){ pressed.a=true; return true; }
    if(m.taps&&inside){ for(const z of m.taps()){ if(x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h){ buzz(8); if(z.fn) z.fn(x,y); else pressed[z.k]=true; return true; } } }
    return true; }
  return false; }
cv.addEventListener('pointerdown',e=>{ if(isTouch()&&e.pointerType!=='mouse') return; audioKick(); const r=cv.getBoundingClientRect(), x=(e.clientX-r.left)/r.width*VW, y=(e.clientY-r.top)/r.height*VH; if(uiMode()!=='walk'){ uiTap(x,y,true); return; } if(e.button===2) pressed.b=true; else pressed.a=true; });
// the day at a glance, under the controls: where Cam is in his Saturday and what is still to come
const DAY=[['☀️','Morning'],['🚶','Outing'],['😴','Lunch + nap'],['🥁','Basement'],['👧','Emory'],['🍔','Frenchman\'s'],['🛁','Bath'],['🌙','Bed']];
function tlUpdate(){ const el=document.getElementById('tl'); if(!el) return; const ch=S.chapter||0, at=ch<=2?0:ch===3?1:ch===4?2:ch===5?3:4; if(el.dataset.at===String(at)&&el.children.length) return; el.dataset.at=String(at);
  el.innerHTML=DAY.map((d,i)=>'<span class="'+(i<at?'done':i===at?'now':'')+'"><i>'+d[0]+'</i>'+(i===at?'<b>'+d[1]+'</b>':'')+'</span>').join(''); }
setInterval(()=>{ if(typeof S!=='undefined'){ tlUpdate(); const c=document.querySelector('#storyp .card'); if(c) c.classList.toggle('ff',!!S.ff); } },400);
// keep the page in step with the mode, and announce it when control comes back
(function(){ let last='', storySince=0; const sp1=document.getElementById('sp1'), sp2=document.getElementById('sp2');
  setInterval(()=>{ if(typeof S==='undefined') return; const m=uiMode(); if(m===last) return; const prev=last; last=m; document.body.dataset.mode=m;
    if(sp1){ if(m==='talk'){ sp1.textContent=S.title?'Tap to start':'Tap to continue'; sp2.textContent=''; } else { sp1.textContent='Story time'; sp2.textContent='Sit back and watch. Hold the screen to speed it up.'; } }
    tlUpdate();
    if(m==='story'&&prev!=='talk'&&prev!=='pick') storySince=performance.now(); if(prev==='walk') storySince=performance.now();
    if(m==='walk'&&prev&&prev!=='mini'&&performance.now()-storySince>1500){ S.turnT=S.t; jingle([784,1047,1319],0.07,'triangle',0.06); buzz(40); document.body.classList.add('handback'); setTimeout(()=>document.body.classList.remove('handback'),600); }
  },90); })();
// ---------------- audio ----------------
let AC=null, noiseGain=null, muted=false;
function audioKick(){ if(AC) { if(AC.state==='suspended') AC.resume(); return; }
  try{ AC=new (window.AudioContext||window.webkitAudioContext)();
    const len=AC.sampleRate*2, buf=AC.createBuffer(1,len,AC.sampleRate), d=buf.getChannelData(0);
    let lastB=0; for(let i=0;i<len;i++){const w=Math.random()*2-1; lastB=(lastB+0.02*w)/1.02; d[i]=lastB*3.5;} for(let i=0;i<2000;i++){ const k=i/2000; d[i]=d[i]*k+d[len-2000+i]*(1-k); }
    const src=AC.createBufferSource(); src.buffer=buf; src.loop=true; noiseGain=AC.createGain(); noiseGain.gain.value=0;
    const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900;
    src.connect(lp); lp.connect(noiseGain); noiseGain.connect(AC.destination); src.start();
  }catch(e){} }
function noise(v,sec=1.5){ if(!AC||!noiseGain)return; noiseGain.gain.cancelScheduledValues(AC.currentTime); noiseGain.gain.linearRampToValueAtTime(muted?0:v,AC.currentTime+sec); S.noiseV=v; }
function blip(f=520,dur=0.035,vol=0.05,type='square'){ if(!AC||muted)return; const o=AC.createOscillator(),g=AC.createGain(); o.type=type; o.frequency.value=f; g.gain.value=vol; g.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+dur); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur+0.02);}
function jingle(notes,step=0.12,type='triangle',vol=0.06){ if(!AC||muted)return; notes.forEach((f,i)=>{ if(!f)return; const o=AC.createOscillator(),g=AC.createGain(); o.type=type; o.frequency.value=f; const t0=AC.currentTime+i*step; g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+step*1.6); o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0+step*1.7);}); }
// ---------------- entities ----------------
const DIRS={right:0,up:1,left:2,down:3};
function ent(o){ return Object.assign({x:0,y:0,dir:'down',moving:false,anim:0,speed:40,visible:true,sit:0,row:null,bubble:null,path:null,follow:null,wob:0},o); }
const P=ent({id:'cam',sheet:'cam_pj',kid:true,speed:44});
const OUTFITS=DATA.outfits;   // [id,name]
function camSheet(){ if(!S.flags.outfit||!DATA.chars['cam_'+S.flags.outfit]){ const o=OUTFITS.filter(x=>x[0]!=='pj'); S.flags.outfit=o[Math.floor(Math.random()*o.length)][0]; } return 'cam_'+S.flags.outfit; }
const NPC={
  grace:ent({id:'grace',sheet:'grace',visible:false,speed:46,name:'Mom'}),
  nick:ent({id:'nick',sheet:'nick',visible:false,speed:44,name:'Dad'}),
  ryan:ent({id:'ryan',sheet:'ryan',visible:false,speed:44,name:'Ryan'}),
  lizz:ent({id:'lizz',sheet:'lizz',visible:false,speed:44,name:'Lizz'}),
  emory:ent({id:'emory',sheet:'emory',kid:true,visible:false,speed:50,name:'Emory'}),
  vinny:ent({id:'vinny',sheet:'vinny',dog:true,visible:false,speed:52,name:'Vinny',sleep:false}),
};
const ALL=()=>[P,...Object.values(NPC)];
// ---------------- collision ----------------
function solidAt(px,py){
  const tx=Math.floor(px/T), ty=Math.floor(py/T);
  if(tx<0||ty<0||tx>=MAPD.W||ty>=MAPD.H) return true;
  if(MAPD.solid[ty][tx]) return true;
  for(const o of MAPD.objs){ const s=o.solid; if(!s||hidden.has(o.id))continue; if(o.door&&doors[o.door])continue;
    if(px>=s[0]&&px<s[0]+s[2]&&py>=s[1]&&py<s[1]+s[3]) return true; }
  // closed door wall cells
  for(const k in MAPD.doors){ if(doors[k])continue; const [wx,wy]=MAPD.doors[k].wall; if(tx===wx&&(ty===wy)) return true; }
  return false;
}
// people and the dog are solid (unless they are following Cam, being carried, or hidden)
function npcBlock(x,y){
  if(S.squeeze&&S.t<S.squeeze) return null;
  for(const e of Object.values(NPC)){ if(!e.visible||e.follow||e.ghost||P.carry===e||e.noBlock||(e.path&&!e.hold)) continue;
    const hw=e.dog?(e.lie?14:10):7, hh=e.dog?5:5; const dx=Math.abs(x-e.x), dy=Math.abs(y-e.y);
    if(dx<hw+3&&dy<hh+2){ if(Math.abs(P.x-e.x)<hw+3&&Math.abs(P.y-e.y)<hh+2&&Math.hypot(x-e.x,y-e.y)>=Math.hypot(P.x-e.x,P.y-e.y)) continue; return e; } }
  return null;
}
function boxFree(x,y,hw=4,hh=2){ return !solidAt(x-hw,y-hh)&&!solidAt(x+hw,y-hh)&&!solidAt(x-hw,y+hh)&&!solidAt(x+hw,y+hh); }
// ---------------- text ----------------
function say(name,text,opts={}){
  // whoever is talking turns to Cam, and Cam turns to them
  const sp=name==='Mom'?NPC.grace:name==='Dad'?NPC.nick:null;
  if(sp&&sp.visible&&!opts.noFace&&!sp.noBlock&&!(S.mini&&S.mini.full)&&P.carry!==sp){
    if(!sp.path||sp.hold) sp.dir=faceTo(sp,P);
    if(!P.carry&&!S.bounds&&!(P.sit>0)&&!P.lying&&!P.path) P.dir=faceTo(P,sp); }
  return new Promise(res=>{ S.dlg={name,text,shown:0,res,choices:null,voice:opts.voice||(name==='Cam'?880:name==='Mom'?620:name==='Dad'?380:name==='Vinny'?240:500)}; }); }
function choose(prompt,choices,name=''){ return new Promise(res=>{ S.dlg={name,text:prompt,shown:0,res,choices,sel:0,voice:500}; }); }
// ---------- dreams: a ripple dissolve to white, then a soft, glowing, drifting look until the ripple back ----------
const DR={on:false,w:0,t:0,sp:[]}; let drTmp=null;
function dreamRipple(cnv,c2,amp,rows){ if(!drTmp) drTmp=document.createElement('canvas'); const w=cnv.width,h=cnv.height; if(drTmp.width!==w||drTmp.height!==h){ drTmp.width=w; drTmp.height=h; } const t2=drTmp.getContext('2d'); t2.clearRect(0,0,w,h); t2.drawImage(cnv,0,0);
  c2.save(); c2.setTransform(1,0,0,1,0,0); c2.clearRect(0,0,w,h); const sh=Math.max(1,Math.round(h/rows)); for(let y=0;y<h;y+=sh){ const dx=Math.sin(y/h*16+DR.t*6)*amp+Math.sin(y/h*5-DR.t*3)*amp*0.5; c2.drawImage(drTmp,0,y,w,sh,dx,y,w,sh); } c2.restore(); }
function dreamPost(dt){ if(!DR.on&&DR.w<=0) return; DR.t+=dt; const W=VW,Hh=VH; U.save(); U.setTransform(UK,0,0,UK,0,0);
  if(DR.on){ U.fillStyle='rgba(214,190,255,0.13)'; U.fillRect(0,0,W,Hh);
    const R=Math.hypot(W,Hh)/2, g=U.createRadialGradient(W/2,Hh/2,R*0.42,W/2,Hh/2,R); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.7,'rgba(246,238,255,0.55)'); g.addColorStop(1,'rgba(255,255,255,0.96)'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
    while(DR.sp.length<16) DR.sp.push({x:Math.random()*W,y:Math.random()*Hh,v:4+Math.random()*7,p:Math.random()*6.28,r:0.7+Math.random()*1.3});
    for(const s of DR.sp){ s.y-=s.v*dt; s.x+=Math.sin(DR.t*0.8+s.p)*5*dt; if(s.y<-4){ s.y=Hh+4; s.x=Math.random()*W; } const a=0.35+0.45*Math.sin(DR.t*2.4+s.p); U.fillStyle='rgba(255,255,255,'+Math.max(0,a).toFixed(2)+')'; U.beginPath(); U.arc(s.x,s.y,s.r,0,7); U.fill(); U.fillRect(s.x-s.r*2.2,s.y-0.2,s.r*4.4,0.4); U.fillRect(s.x-0.2,s.y-s.r*2.2,0.4,s.r*4.4); } }
  U.restore();
  if(DR.w>0){ const k=Math.sin(Math.min(1,DR.w)*Math.PI/2); dreamRipple(cv,ctx0,k*9,VH/2); dreamRipple(uc,U,k*9*UK,VH/2); U.save(); U.setTransform(1,0,0,1,0,0); U.fillStyle='rgba(250,244,255,'+Math.pow(DR.w,1.6).toFixed(3)+')'; U.fillRect(0,0,uc.width,uc.height); U.restore(); } }
async function dreamRamp(to,ms){ const a=DR.w, t0=performance.now(); while(true){ const k=Math.min(1,(performance.now()-t0)/ms); DR.w=a+(to-a)*k; if(k>=1) break; await new Promise(r=>setTimeout(r,16)); } }
function harp(up){ const sc=[523,587,659,784,880,1047,1175,1319,1568,1760,2093,2349,2637]; jingle(up?sc:sc.slice().reverse(),0.055,'triangle',0.05); jingle((up?sc:sc.slice().reverse()).map(f=>f*1.5),0.055,'sine',0.025); }
// swap: called while the screen is fully white. on: is what follows a dream?
async function dreamCut(swap,on,up){ harp(up!==false); await dreamRamp(1,900); DR.on=on; document.body.classList.toggle('dream',on); await swap(); await new Promise(r=>setTimeout(r,250)); await dreamRamp(0,900); }
let TS=1;   // time scale: 3 while the player holds to fast-forward a story scene
function wait(ms){ return new Promise(r=>setTimeout(r,ms/TS)); }
function bubble(e,txt,ms=1300){ e.bubble={txt,until:S.t+ms/1000}; }
async function fadeTo(v,ms=600){ S.fadeTarget=v; S.fadeSpeed=1000/ms; while(Math.abs(S.fade-v)>0.01) await wait(16); S.fade=v; }
async function banner(txt,sub='',ms=2200){ S.banner={txt,sub}; await wait(ms); S.banner=null; }
// the goal, plus the thing(s) to go and touch for it: object ids, or 'npc:grace' for a person
function setGoal(g,targets){ S.goal=g; S.targets=g?(targets||[]):[]; S.goalT=S.t; if(g) jingle([660,880],0.08,'triangle',0.04); }
function goalThings(){ const out=[]; if(!S.goal) return out; for(const t of (S.targets||[])){ if(t.indexOf('npc:')===0){ const n=NPC[t.slice(4)]; if(n&&n.visible&&P.carry!==n) out.push({e:n,x:n.x,y:n.y-(n.dog?8:14),top:n.y-(n.dog?24:34)}); }
    else { const o=MAPD.objs.find(q=>q.id===t); if(o&&!hidden.has(o.id)) out.push({o,x:o.x+o.w/2,y:o.y+o.h/2,top:o.y}); } } return out; }
function canPlay(){ return !S.lock&&!S.dlg&&!S.mini&&!S.title&&S.fade<0.3; }
// a soft pulsing outline in the shape of the thing itself
const glowCv=document.createElement('canvas'), glowX=glowCv.getContext('2d');
function drawGlowing(it,isChar,ox,oy){
  if(glowCv.width!==VW||glowCv.height!==VH){ glowCv.width=VW; glowCv.height=VH; } glowX.globalCompositeOperation='source-over'; glowX.clearRect(0,0,VW,VH);
  ctx=glowX; try{ isChar?drawChar(it,ox,oy):drawObj(it,ox,oy); } finally { ctx=ctx0; }
  glowX.globalCompositeOperation='source-in'; glowX.fillStyle='#ffe07a'; glowX.fillRect(0,0,VW,VH);
  const p=0.5+0.5*Math.sin(S.t*4.8);
  ctx.globalAlpha=0.22+0.3*p; for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]) ctx.drawImage(glowCv,dx,dy);
  ctx.globalAlpha=0.5+0.45*p; for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) ctx.drawImage(glowCv,dx,dy);
  ctx.globalAlpha=1; isChar?drawChar(it,ox,oy):drawObj(it,ox,oy);
  ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=0.06+0.16*p; ctx.drawImage(glowCv,0,0); ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
}
// thin bars while the story is playing and Cam can't be moved; a small pointer at the screen edge for a goal that is out of view
function drawStoryBars(){ const b=S.bars||0; if(b<=0.01) return; const h=6*b; U.fillStyle='#203731'; U.fillRect(0,0,VW,h); U.fillStyle='#FFB612'; U.fillRect(0,h-1.3*b,VW,1.3*b); U.fillStyle='#4F2683'; U.fillRect(0,VH-h,VW,h); U.fillStyle='#FFC62F'; U.fillRect(0,VH-h,VW,1.3*b);
  if(b>0.8){ if(S.clock) txt(S.clock,5,-0.2,'#FFB612',5,'left'); if(S.lockPing&&S.t-S.lockPing<0.9){ const a=1-(S.t-S.lockPing)/0.9; U.globalAlpha=a; txt('story playing...',VW-5,VH-5.2,'#FFC62F',5,'right',true); U.globalAlpha=1; } } }
function drawGoalPointers(ox,oy){ if(!canPlay()) return; const p=0.5+0.5*Math.sin(S.t*4.8);
  for(const g of goalThings()){ const sx=g.x-ox, sy=g.y-oy;
    if(sx<4||sx>VW-4||sy<4||sy>VH-4){ const cx=VW/2, cy=VH/2, a=Math.atan2(sy-cy,sx-cx), m=9; const k=Math.min((cx-m)/Math.abs(Math.cos(a)||1e-6),(cy-m)/Math.abs(Math.sin(a)||1e-6)); const px=cx+Math.cos(a)*k; let py=cy+Math.sin(a)*k; if(px<150&&py<40) py=40;
      U.save(); U.translate(px,py); U.rotate(a); U.globalAlpha=0.65+0.35*p; U.beginPath(); U.moveTo(4,0); U.lineTo(-3,-3.2); U.lineTo(-1.5,0); U.lineTo(-3,3.2); U.closePath(); U.fillStyle='#ffe07a'; U.fill(); U.strokeStyle='#2e2838'; U.lineWidth=0.8; U.stroke(); U.restore(); U.globalAlpha=1; }
    else if(Math.hypot(g.x-P.x,g.y-(P.y-8))<30){ const s=keyName('a'); U.font='bold 6px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=U.measureText(s).width+6; U.fillStyle='#ffe07a'; U.strokeStyle='#2e2838'; U.lineWidth=0.8; U.beginPath(); U.roundRect(sx-w/2,g.top-oy-10,w,8,3); U.fill(); U.stroke(); txt(s,sx,g.top-oy-8.6,'#2e2838',6,'center',true); } } }
function give(id){ if(!S.inv.includes(id)){ S.inv.push(id); jingle([523,659,784,1047],0.09,'square',0.045); S.tip={txt:'Got '+ITEMS[id].name+'!',until:S.t+2.4}; save(); } }
// walk an entity along waypoints (px), ignores collision
// can a grown-up-sized body stand here / walk this straight line?
let CLR=[4,3]; function stepFree(x,y){ return boxFree(x,y,CLR[0],CLR[1]); }
function lineFree(x0,y0,x1,y1){ const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/4)); for(let i=0;i<=n;i++){ if(!stepFree(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n)) return false; } return true; }
// A* over an 8px grid (tile centres and tile edges), then pulled tight. Returns null when there is no way round.
function findPath(x0,y0,x1,y1){
  const Gs=8, W=MAPD.W*2+1, Hh=MAPD.H*2+1, id=(c,r)=>r*W+c, free=(c,r)=>c>=0&&r>=0&&c<W&&r<Hh&&stepFree(c*Gs,r*Gs);
  const snap=(x,y)=>{ let best=null,bd=1e9; const c0=Math.round(x/Gs), r0=Math.round(y/Gs); for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){ const c=c0+dc,r=r0+dr; if(!free(c,r)) continue; const d=Math.hypot(c*Gs-x,r*Gs-y); if(d<bd&&lineFree(x,y,c*Gs,r*Gs)){ bd=d; best=[c,r]; } } return best; };
  const a=snap(x0,y0), b=snap(x1,y1); if(!a||!b) return null;
  const open=[[a[0],a[1]]], g=new Map([[id(a[0],a[1]),0]]), f=new Map([[id(a[0],a[1]),0]]), prev=new Map(); let it=0;
  while(open.length&&it++<9000){ let bi=0; for(let i=1;i<open.length;i++) if(f.get(id(open[i][0],open[i][1]))<f.get(id(open[bi][0],open[bi][1]))) bi=i;
    const [c,r]=open.splice(bi,1)[0]; if(c===b[0]&&r===b[1]){ const out=[[x1,y1]]; let k=id(c,r); out.unshift([c*Gs,r*Gs]); while(prev.has(k)){ const p=prev.get(k); out.unshift([p[0]*Gs,p[1]*Gs]); k=id(p[0],p[1]); }
        const pts=[[x0,y0]].concat(out), keep=[]; let i=0; while(i<pts.length-1){ let j=pts.length-1; while(j>i+1&&!lineFree(pts[i][0],pts[i][1],pts[j][0],pts[j][1])) j--; keep.push(pts[j]); i=j; } return keep; }
    for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){ const nc=c+dc,nr=r+dr; if(!free(nc,nr)) continue; if(dc&&dr&&(!free(c+dc,r)||!free(c,r+dr))) continue;
      const ng=g.get(id(c,r))+(dc&&dr?1.414:1), k=id(nc,nr); if(g.has(k)&&g.get(k)<=ng) continue; g.set(k,ng); f.set(k,ng+Math.hypot(nc-b[0],nr-b[1])); prev.set(k,[c,r]); if(!open.some(o=>o[0]===nc&&o[1]===nr)) open.push([nc,nr]); } }
  return null; }
// keep a scripted route as written, except where a leg would cut through something solid
function safePts(e,pts){ if(e===P||e.ghost) return pts.slice(); const out=[]; let cx=e.x, cy=e.y;
  for(const p of pts){ if(stepFree(cx,cy)&&stepFree(p[0],p[1])&&!lineFree(cx,cy,p[0],p[1])){ let r=null; for(const c of [[8,5],[6,4],[4,3]]){ CLR=c; r=findPath(cx,cy,p[0],p[1]); CLR=[4,3]; if(r) break; } if(r) out.push(...r); else out.push(p); } else out.push(p); cx=p[0]; cy=p[1]; }
  return out; }
async function walk(e,pts,speed){ e.hold=false; e.path=safePts(e,pts); e.pathSpeed=speed||e.speed; while(e.path&&e.path.length) await wait(30); }
function face(e,d){ e.dir=d; }
function setDoor(k,open){ doors[k]=open; blip(open?300:220,0.08,0.06,'triangle'); }
// ---------------- save ----------------
function save(){ try{ localStorage.setItem('camAdventure_v2',JSON.stringify({ch:S.chapter,inv:S.inv,flags:S.flags})); }catch(e){} }
function loadSave(){ try{ return JSON.parse(localStorage.getItem('camAdventure_v2')||'null'); }catch(e){ return null; } }
// ---------------- update ----------------
let last=performance.now();
function frame(now){
  TS=(!S.title&&!S.mini&&!S.dlg&&(S.lock>0||S.cut)&&(K.ff||K.a))?3:1; S.ff=TS>1;
  const dt=Math.min(0.05,(now-last)/1000)*TS; last=now; S.t+=dt;
  if(loaded>=5) { update(dt);
    const story=!S.title&&!S.mini&&(S.lock>0||!!S.dlg); S.bars=Math.max(0,Math.min(1,(S.bars||0)+(story?1:-1)*dt/0.22));
    if(story&&!S.dlg&&(K.left||K.right||K.up||K.down)) S.lockPing=S.t;
    if(story!==S.wasStory){ S.wasStory=story; document.body.classList.toggle('story',story); if(!story&&!S.title){ S.backT=S.t; if(S.t-(S.goalT||-9)>0.5) blip(740,0.05,0.025,'triangle'); } }
    draw(); dreamPost(dt); }
  requestAnimationFrame(frame);
}
function update(dt){
  // fade
  if(S.fade!==S.fadeTarget){ const s=(S.fadeSpeed||2)*dt; S.fade+= Math.sign(S.fadeTarget-S.fade)*Math.min(s,Math.abs(S.fadeTarget-S.fade)); }
  if(S.shake>0) S.shake=Math.max(0,S.shake-dt);
  if(hit('mute')){ muted=!muted; if(noiseGain&&AC) noiseGain.gain.value=muted?0:(S.noiseV||0); }
  // dialog
  if(S.dlg){ const d=S.dlg; const prev=Math.floor(d.shown); d.shown=Math.min(d.text.length,d.shown+dt*45);
    if(Math.floor(d.shown)>prev && Math.floor(d.shown)%3===0 && d.text[Math.floor(d.shown)-1]!==' ') blip(d.voice+(Math.random()*60-30),0.03,0.025);
    if(d.choices && d.shown>=d.text.length){ if(hit('up')){d.sel=(d.sel+d.choices.length-1)%d.choices.length; blip(700);} if(hit('down')){d.sel=(d.sel+1)%d.choices.length; blip(700);} }
    if(d.choices&&d.shown>=d.text.length&&!d.readyAt) d.readyAt=performance.now()+500;   // choices cannot be picked by the press that skipped the line before them
    if(hit('a')||(!d.choices&&hit('b'))){ if(d.shown<d.text.length) d.shown=d.text.length; else if(d.choices&&performance.now()<d.readyAt){ } else { S.dlg=null; blip(900,0.03,0.03); d.res(d.choices?d.sel:undefined); } }
    pressed.bag=false;
  } else if(S.menu){ if(hit('left')||hit('right')){ S.bagPage=1-(S.bagPage||0); blip(650); } if(hit('bag')||hit('b')||hit('a')){ S.menu=null; blip(500); } }
  else if(S.title){ if(hit('a')) S.titleRes&&S.titleRes(); }
  else if(S.mini){ S.mini.update(dt); }
  else if(!S.cut){ control(dt); if(S.tick) S.tick(dt); if(hit('bag')){ S.menu='bag'; blip(700); } }
  if((S.cut||S.dlg||S.mini)&&!P.path&&!P.carry){ P.moving=false; P.running=false; }
  // npc paths
  for(const e of ALL()){
    if(e.hold){ e.moving=false; } else if(e.path&&e.path.length){ const [tx,ty]=e.path[0]; const dx=tx-e.x, dy=ty-e.y, dist=Math.hypot(dx,dy), sp=(e.pathSpeed||e.speed)*dt;
      if(dist<=sp){ e.x=tx; e.y=ty; e.path.shift(); if(!e.path.length){ e.path=null; e.moving=false; } }
      else { e.x+=dx/dist*sp; e.y+=dy/dist*sp; e.moving=true; e.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); }
    } else if(e!==P && !e.follow) e.moving=false;
    if(e.sit>0){ e.sit-=dt; }
    e.anim+=dt;
  }
  followUpdate(dt);
  if(P.carry){ P.x=P.carry.x; P.y=P.carry.y+0.5; P.dir=P.carry.dir; P.moving=false; }
  // camera
  const F=S.camFocus||P; const hx=Math.floor(VW/2), hy=Math.floor(VH/2);
  const tx=MW<=VW?Math.round((MW-VW)/2):Math.max(0,Math.min(MW-VW,F.x-hx)), ty=MH<=VH?Math.round((MH-VH)/2):Math.max(0,Math.min(MH-VH,F.y-16-hy));
  const far=Math.hypot(tx-S.cam.x,ty-S.cam.y);
  if(S.snapCam||(!S.camFocus&&!S.camEase)||far<1.5){ S.cam.x=tx; S.cam.y=ty; S.snapCam=false; S.camEase=false; }
  else { const step=Math.min(far,Math.max(far*dt*5,170*dt)); S.cam.x+=(tx-S.cam.x)/far*step; S.cam.y+=(ty-S.cam.y)/far*step; }
  if(S.camFocus) S.camEase=true;
  if(S.tip&&S.t>S.tip.until) S.tip=null;
}
// breadcrumb follow
const crumbs=[];
function followUpdate(dt){
  const fs=Object.values(NPC).filter(e=>e.follow&&e.visible); if(!fs.length) return;
  if(!crumbs.length||Math.hypot(crumbs[crumbs.length-1][0]-P.x,crumbs[crumbs.length-1][1]-P.y)>2) crumbs.push([P.x,P.y]);
  if(crumbs.length>200) crumbs.shift();
  for(const v of fs){ const lag=v.dog?14:20;
    const target=crumbs.length>lag?crumbs[crumbs.length-lag]:null;
    const dist=Math.hypot(P.x-v.x,P.y-v.y);
    if(target&&dist>(v.dog?20:26)){ const dx=target[0]-v.x, dy=target[1]-v.y, d=Math.hypot(dx,dy); const sp=Math.min(d,(dist>60?95:60)*dt);
      if(d>1){ v.x+=dx/d*sp; v.y+=dy/d*sp; v.moving=true; v.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); } else v.moving=false;
      if(dist>140){ v.x=target[0]; v.y=target[1]; }
    } else v.moving=false; }
}
// ---------------- player control ----------------
let runT=0, lastDir='down';
function control(dt){
  if(P.sit>0){ P.moving=false; return; }
  for(const d of ['up','down','left','right']) if(pressed[d]){ pressed[d]=false; if(!K[d]) P.dir=d; }
  let dx=(K.right?1:0)-(K.left?1:0), dy=(K.down?1:0)-(K.up?1:0);
  const running=(K.b||K.run)&&(dx||dy);
  if(dx||dy){
    const len=Math.hypot(dx,dy); dx/=len; dy/=len;
    const sp=(running?78:P.speed)*dt;
    const nd=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
    let nx=P.x+dx*sp, ny=P.y+dy*sp;
    const bnd=S.bounds;
    const ok=(x,y)=> (S.noCollide||(boxFree(x,y)&&!npcBlock(x,y))) && (!bnd||(x>=bnd[0]&&x<=bnd[2]&&y>=bnd[1]&&y<=bnd[3]));
    const x0=P.x, y0=P.y;
    if(ok(nx,P.y)) P.x=nx; if(ok(P.x,ny)) P.y=ny;
    // pushing on a person who has you boxed in: after a moment they let you squeeze by
    if(P.x===x0&&P.y===y0&&!S.noCollide&&boxFree(nx,ny)&&npcBlock(nx,ny)){ S.pushT=(S.pushT||0)+dt; if(S.pushT>0.7){ const e=npcBlock(nx,ny); if(S.pushT<0.8&&!e.dog) bubble(e,'Oop, \'scuse me!',1000); S.squeeze=S.t+0.9; } } else S.pushT=0;
    if(running){ runT+=dt; } else runT=Math.max(0,runT-dt*2);
    P.dir=nd; lastDir=nd; P.moving=true; P.running=running;
    // wobble & fall
    if(running && runT>3 && Math.random()<dt*0.09 && !S.noFall){ fall(); }
    S.stepT=(S.stepT||0)+dt; if(S.stepT>(running?0.18:0.28)){ S.stepT=0; blip(running?140:120,0.02,0.02,'triangle'); }
  } else { P.moving=false; P.running=false; runT=Math.max(0,runT-dt*2); }
  if(hit('a')) interact();
}
function fall(){
  P.sit=1.1; P.fallDir=(P.dir==='left'||P.dir==='up')?-1:1; runT=0; S.shake=0.18; blip(90,0.15,0.08,'sawtooth');
  const lines=['Oof!','Whoa!','Boom!','Uh-oh!','Bonk!'];
  bubble(P,lines[Math.floor(Math.random()*lines.length)]);
  S.flags.falls=(S.flags.falls||0)+1;
  if(NPC.vinny.follow && Math.random()<0.5) setTimeout(()=>bubble(NPC.vinny,'*lick*'),500);
}
// ---------------- interaction ----------------
function probe(){ const v={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]}[P.dir]; return [P.x+v[0]*11, P.y-2+v[1]*11]; }
function interact(){
  const [px,py]=probe();
  let dog=null;
  for(const e of Object.values(NPC)){ if(!e.visible)continue; if(Math.hypot(e.x-px,e.y-py)<(e.dog?20:15)){ if(e.dog){ dog=e; continue; } runHandler('npc_'+e.id,e); return; } }
  let best=null;
  for(const o of MAPD.objs){ if(!o.interact||hidden.has(o.id))continue; if(o.door&&doors[o.door])continue;
    const r=o.solid||[o.x,o.y,o.w,o.h]; const pad=3;
    if(px>=r[0]-pad&&px<r[0]+r[2]+pad&&py>=r[1]-pad&&py<r[1]+r[3]+pad){ best=o; break; } }
  if(best&&!(dog&&best.layer==='flat')){ runHandler(best.interact,best); return; }
  if(dog){ runHandler('npc_'+dog.id,dog); return; }
  runHandler('_nothing',null);
}
async function runHandler(key,arg){
  const fn=(CH[S.chapter]&&CH[S.chapter][key])||H[key]||(key.startsWith('door_')?H.door:null);
  if(!fn) return;
  const held=(key.startsWith('npc_')&&arg&&!arg.dog)?arg:null; if(held) held.hold=true;
  S.cut=true; try{ await fn(arg,key); } finally { if(held) held.hold=false; S.cut=false; for(const k in pressed) pressed[k]=false; }
}
// ---------------- drawing ----------------
function drawChar(e,ox,oy){
  if(!e.visible) return;
  const c=DATA.chars[e.sheet]; let fw=e.dog?48:16; const fh=32;
  if(e.dog&&e.lie){ if(e.sleep&&!e.bubble&&Math.floor(S.t)%5===0) e.bubble={txt:'Zzz',until:S.t+1.4}; const f=e.dir==='left'?1:0; ctx.drawImage(IMG.atlas,c.sx+f*48,c.sy+5*32,48,32,Math.round(e.x-24-ox),Math.round(e.y-30-oy+Math.round(Math.sin(e.anim*1.6)*0.6)),48,32); return; }
  let row, col; const di=DIRS[e.dir];
  if(e.dog){
    if(false){}
    else if(e.moving){ row=2; col=di*6+Math.floor(e.anim*10)%6; }
    else { row=1; col=di*6+Math.floor(e.anim*5)%6; }
  } else if(e.lying || (e.kid && e.sit>0)){
    const k=e.lying?(e.lying===true?-1:e.lying):(e.fallDir||1);
    ctx.save(); ctx.translate(Math.round(e.x-ox),Math.round(e.y-oy-5)); ctx.rotate(k*Math.PI/2);
    ctx.drawImage(IMG.atlas,c.sx+3*16,c.sy,16,32,-8,-22,16,32); ctx.restore(); return; }
  else if(e.seated&&e.kid){ row=3; col=5; }
  else if(e.seated){ row=1; col=di*6; }
  else if(e.moving){ row=2; col=di*6+Math.floor(e.anim*(e.running?14:9))%6; }
  else { row=1; col=di*6+Math.floor(e.anim*5)%6; }
  let wx=0, wy=0;
  const dx=Math.round(e.x-fw/2-ox+wx), dy=Math.round(e.y-fh+2-oy+wy+(e.kid?2:0)-(e.lift||0));
  ctx.drawImage(IMG.atlas,c.sx+col*fw,c.sy+row*fh,fw,fh,dx,dy,fw,fh);
}
function drawObj(o,ox,oy){ ctx.drawImage(IMG.atlas,o.sx,o.sy,o.w,o.h,Math.round(o.x-ox),Math.round(o.y-oy),o.w,o.h); }
function draw(){
  ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#18161e'; ctx.fillRect(0,0,VW,VH); U.setTransform(1,0,0,1,0,0); U.clearRect(0,0,uc.width,uc.height); U.setTransform(UK,0,0,UK,0,0); U.imageSmoothingEnabled=false;
  if(S.title&&!S.titleScene){ drawTitle(); return; }
  if(S.mini&&S.mini.full){ S.mini.draw(); if(S.dlg) drawDialog(); if(S.toast) drawToast(); if(S.banner) drawBanner();
    if(S.fade>0){ U.fillStyle=`rgba(8,6,14,${S.fade})`; U.fillRect(0,0,VW,VH); if(S.fadeText&&S.fade>0.9){ txt(S.fadeText,VW/2,VH/2-6,'#f4ead8',12,'center'); if(S.fadeSub) txt(S.fadeSub,VW/2,VH/2+10,'#a9a0b8',8,'center'); } }
    return; }
  let ox=Math.round(S.cam.x), oy=Math.round(S.cam.y);
  if(S.shake>0){ ox+=Math.round((Math.random()-0.5)*4); oy+=Math.round((Math.random()-0.5)*3); }
  ctx.drawImage(S.map==='park'?IMG.park:S.map==='bsmt'?IMG.bsmt:S.map==='yard'?IMG.yard:IMG.base,ox,oy,VW,VH,0,0,VW,VH);
  for(const o of MAPD.objs) if(o.layer==='flat'&&!hidden.has(o.id)) drawObj(o,ox,oy);
  for(const o of MAPD.objs) if(o.layer==='wall'&&!hidden.has(o.id)) drawObj(o,ox,oy);
  const list=[];
  for(const o of MAPD.objs){ if(o.layer==='flat'||o.layer==='wall'||hidden.has(o.id))continue; if(o.door&&doors[o.door])continue; list.push([o.sortY+(o.sortBias||0),0,o]); }
  for(const e of ALL()) if(e.visible) list.push([e.y+(e.zBias||0),1,e]);
  for(const it of (S.extra||[])) list.push([it.sortY,2,it]);
  list.sort((a,b)=>a[0]-b[0]);
  const gts=canPlay()?goalThings():[], gset=new Set(gts.map(g=>g.e||g.o));
  for(const o of MAPD.objs) if((o.layer==='flat'||o.layer==='wall')&&gset.has(o)) drawGlowing(o,false,ox,oy);
  for(const [,k,it] of list){ if(k===0) (gset.has(it)?drawGlowing(it,false,ox,oy):drawObj(it,ox,oy)); else if(k===1) (gset.has(it)?drawGlowing(it,true,ox,oy):drawChar(it,ox,oy)); else it.draw(ox,oy); }
  drawLight(ox,oy);
  drawStoryBars(); drawGoalPointers(ox,oy);
  // bubbles
  for(const e of ALL()) if((e.visible||e.ghost)&&e.bubble){ if(S.t>e.bubble.until){e.bubble=null;continue;} drawBubble(e.bubble.txt,e.x-ox,e.y-oy-(e.dog?26:(e.kid?30:34))); }
  if(!S.title) drawHUD();
  if(S.mini) S.mini.draw();
  if(S.dlg) drawDialog();
  if(S.menu==='bag') drawBag();
  if(S.toast) drawToast();
  if(S.banner) drawBanner();
  if(S.fade>0){ U.fillStyle=`rgba(8,6,14,${S.fade})`; U.fillRect(0,0,VW,VH); if(S.fadeText&&S.fade>0.9) { txt(S.fadeText,VW/2,VH/2-6,'#f4ead8',12,'center'); if(S.fadeSub) txt(S.fadeSub,VW/2,VH/2+10,'#a9a0b8',8,'center'); } }
  if(S.title) drawTitle();
}
const LIGHTS={
  night:{tint:'rgba(14,18,52,0.80)',glows:[]},
  dawn:{tint:'rgba(40,40,90,0.45)',glows:[]},
  day:{tint:null},
};
const lc=document.createElement('canvas'); lc.width=VW; lc.height=VH; const lx=lc.getContext('2d');
function drawLight(ox,oy){
  const L=LIGHTS[S.light]; if(!L||!L.tint){ if(S.light==='day'){ // soft warm morning wash + window shafts
      ctx.fillStyle='rgba(255,226,180,0.06)'; ctx.fillRect(0,0,VW,VH); } return; }
  lx.globalCompositeOperation='source-over'; lx.clearRect(0,0,VW,VH); lx.fillStyle=L.tint; lx.fillRect(0,0,VW,VH);
  lx.globalCompositeOperation='destination-out';
  for(const g of (S.glows||[])){ const x=g[0]-ox, y=g[1]-oy, r=g[2]; const gr=lx.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,`rgba(0,0,0,${g[3]||0.9})`); gr.addColorStop(1,'rgba(0,0,0,0)'); lx.fillStyle=gr; lx.fillRect(x-r,y-r,r*2,r*2); }
  ctx.drawImage(lc,0,0);
  ctx.globalCompositeOperation='lighter';
  for(const g of (S.glows||[])){ if(!g[4])continue; const x=g[0]-ox, y=g[1]-oy, r=g[2]*0.7; const gr=ctx.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,g[4]); gr.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=gr; ctx.fillRect(x-r,y-r,r*2,r*2); }
  ctx.globalCompositeOperation='source-over';
}
// ---- UI text (bitmap-ish via canvas font)
function txt(s,x,y,col='#fff',size=7,align='left',bold=false){ U.font=`${bold?'bold ':''}${size}px "Trebuchet MS","Segoe UI",Verdana,sans-serif`; U.textAlign=align; U.textBaseline='top'; U.fillStyle='rgba(0,0,0,0.55)'; U.fillText(s,x+1,y+1); U.fillStyle=col; U.fillText(s,x,y); U.textAlign='left'; }
function box(x,y,w,h,fill='rgba(28,24,40,0.94)',edge='#f4ead8'){ U.fillStyle=fill; U.fillRect(x,y,w,h); U.strokeStyle=edge; U.lineWidth=1; U.strokeRect(x+1.5,y+1.5,w-3,h-3); U.strokeStyle='rgba(0,0,0,0.6)'; U.strokeRect(x+0.5,y+0.5,w-1,h-1); }
function wrap(s,maxW,size){ U.font=`${size}px "Trebuchet MS","Segoe UI",Verdana,sans-serif`; const words=s.split(' '); const lines=[]; let cur='';
  for(const w of words){ const t=cur?cur+' '+w:w; if(U.measureText(t).width>maxW&&cur){ lines.push(cur); cur=w; } else cur=t; } if(cur) lines.push(cur); return lines; }
function drawDialog(){
  const d=S.dlg; const h=42; const y=(S.mini&&S.mini.dlgTop)?36:VH-h-3;
  box(5,y,VW-10,h);
  if(d.name){ U.font='bold 7px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=U.measureText(d.name).width+12; box(9,y-9,w,11,'#3b2f5a'); txt(d.name,15,y-7,'#ffd98a',7,'left',true); }
  const shown=d.text.slice(0,Math.floor(d.shown)); const lines=wrap(shown,VW-34,7);
  let ly=y+8; for(let i=0;i<lines.length;i++){ txt(lines[i],14,ly,'#f4ead8',7); ly+=9.5; }
  if(d.choices&&d.shown>=d.text.length){ U.font='7px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const rh=isTouch()?17:10, cw=Math.max(...d.choices.map(c=>U.measureText(c).width))+(isTouch()?34:24); const ch=d.choices.length*rh+8; const cy=(S.mini&&S.mini.dlgTop)?y+h+3:y-ch-3; box(VW-cw-6,cy,cw,ch); d.rects=[];
    d.choices.forEach((c,i)=>{ const ry=cy+4+i*rh; d.rects.push([VW-cw-6,ry,cw,rh,i]); if(isTouch()) uRR(VW-cw-3,ry+1,cw-6,rh-2,4,i===d.sel?'rgba(255,217,138,0.22)':'rgba(255,255,255,0.07)',i===d.sel?'#ffd98a':null,0.8); txt((i===d.sel?'▶ ':'   ')+c,VW-cw+2,ry+(rh-8)/2+0.5,i===d.sel?'#ffd98a':'#f4ead8',7); }); }
  else if(d.shown>=d.text.length && Math.floor(S.t*3)%2) txt('▼',VW-18,y+h-12,'#ffd98a',7);
}
function drawBubble(s,x,y){ U.font='8px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=U.measureText(s).width+8; const bx=Math.round(x-w/2), by=Math.round(y-12);
  U.fillStyle='#fffaf0'; U.fillRect(bx,by,w,12); U.strokeStyle='#2e2838'; U.strokeRect(bx+0.5,by+0.5,w-1,11); U.fillStyle='#fffaf0'; U.fillRect(Math.round(x)-2,by+11,4,3);
  U.fillStyle='#2e2838'; U.textBaseline='top'; U.fillText(s,bx+4,by+2); }
function drawTurn(){ const k=S.turnT?S.t-S.turnT:9; if(k>1.5||S.map===undefined) return; const a=k<1.1?1:1-(k-1.1)/0.4, px=P.x-Math.round(S.cam.x), py=P.y-Math.round(S.cam.y);
  U.globalAlpha=a; U.strokeStyle='#ffe07a'; U.lineWidth=1.6; U.beginPath(); U.ellipse(px,py-1,9+k*7,4+k*3,0,0,7); U.stroke(); U.strokeStyle='#2e2838'; U.lineWidth=0.6; U.beginPath(); U.ellipse(px,py-1,10+k*7,4.6+k*3,0,0,7); U.stroke();
  const s='Your turn!'; U.font='bold 9px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=U.measureText(s).width+16, pop=Math.min(1,k/0.15), y=Math.max(30,py-48); uRR(VW/2-w/2*pop,y,w*pop,15,7.5,'#ffe07a','#2e2838',1); if(pop>=1) txt(s,VW/2,y+3.5,'#2e2838',9,'center',true); U.globalAlpha=1; }
function drawHUD(){ if(!S.mini&&!S.dlg) drawTurn();
  if(!S.clock) return;
  if(S.hud&&!S.dlg) S.hud();
  const g=S.goal||''; const lines=g?wrap(g,128,6.5):[]; U.font='6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif';
  const w=Math.max(46,...lines.map(l=>U.measureText(l).width))+12; const h=15+lines.length*8;
  if((S.bars||0)<0.5){ const pop=S.backT&&S.t-S.backT<0.7?1-(S.t-S.backT)/0.7:0; box(3,3,w,h,'rgba(28,24,40,0.8)',pop>0.25?'#ffe07a':undefined);
  txt(S.clock,9,6,'#ffd98a',7,'left',true);
  lines.forEach((l,i)=>txt(l,9,15+i*8,'#f4ead8',6.5)); }
  if(S.tip&&!S.dlg){ U.font='7px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=Math.min(VW-16,U.measureText(S.tip.txt).width+16); box(VW/2-tw/2,VH-20,tw,15,'rgba(60,46,90,0.95)','#ffd98a'); txt(S.tip.txt,VW/2,VH-16,'#fff',7,'center'); }
  if(S.inv.length && !S.dlg && (S.bars||0)<0.5){ txt('I: Bag',VW-6,6,'#c9c0d8',6.5,'right'); }
}
const ITEMS={
  monkey:{name:'Monkey',desc:'Soft, a little crusty. Cam does not sleep without him.',icon:'monkey'},
  spoon:{name:'Wooden Spoon',desc:'From the bottom drawer. Hits things. Makes noise. Perfect.',icon:null},
};
function drawBag(){
  box(24,14,VW-48,VH-28);
  const pg=S.bagPage||0;
  txt('Key Items',38,21,pg===0?'#ffd98a':'#6f6884',8,'left',true); txt('Achievements',VW-38,21,pg===1?'#ffd98a':'#6f6884',8,'right',true);
  if(pg===0){
    if(!S.inv.length) txt('Nothing yet.',38,40,'#a9a0b8',7);
    S.inv.forEach((id,i)=>{ const it=ITEMS[id]; const y=38+i*30; txt(it.name,58,y,'#f4ead8',7.5,'left',true);
      wrap(it.desc,VW-104,6.5).slice(0,2).forEach((l,j)=>txt(l,58,y+10+j*8,'#a9a0b8',6.5));
      if(it.icon&&OBJ[it.icon]){ const o=OBJ[it.icon]; U.drawImage(IMG.atlas,o.sx,o.sy,o.w,o.h,38,y,o.w,o.h); }
      else { U.fillStyle='#c98a4a'; U.fillRect(42,y+2,3,14); U.fillStyle='#a36a33'; U.fillRect(40,y+1,7,5); } });
  } else {
    const ids=Object.keys(ACH); let y=36;
    ids.forEach(id=>{ const got=!!META.ach[id]; const a=ACH[id];
      U.fillStyle=got?'#ffd98a':'#4a4460'; U.beginPath(); U.arc(43,y+5,4,0,7); U.fill();
      txt(got||!a.secret?a.name:'???',52,y,got?'#f4ead8':'#7d7590',7,'left',true);
      txt(got||!a.secret?a.desc:'Keep playing.',52,y+9,'#a9a0b8',6); y+=19; });
  }
  txt('Left / Right: switch page    '+keyName('a')+' / '+keyName('b')+': close',VW/2,VH-24,'#7d7590',6.5,'center');
}
// ---------------- achievements + best scores (kept across new games) ----------------
const ACH={
  helper:{name:"Mommy's Little Helper",desc:'Earn the free cookie at Cub Foods.'},
  walker:{name:'Good Walk',desc:'Get a high score on the walk.'},
  slide1:{name:'Big Slide',desc:'Go down the big slide at Heredia Park.'},
  slide2:{name:'Curly Slide',desc:'Go down the curly slide at Heredia Park.'},
  strum:{name:'Careful, Bud',desc:'Strum Dad\'s guitar.'},
  cube:{name:'Busy Hands',desc:'Finish all four sides of the activity cube.'},
  bed:{name:'Quiet as a Mouse',desc:'Jump on the big bed 15 times before Dad hears.'},
  drummer:{name:'Oh Oh Oh!',desc:'Play the drums with Dad.'},
};
let META={ach:{},best:{}};
try{ const m=JSON.parse(localStorage.getItem('camAdventure_meta')||'null'); if(m&&m.ach) META=Object.assign({ach:{},best:{}},m); }catch(e){}
function saveMeta(){ try{ localStorage.setItem('camAdventure_meta',JSON.stringify(META)); }catch(e){} }
function award(id){ if(META.ach[id]) return false; META.ach[id]=Date.now(); saveMeta(); S.toast={txt:ACH[id].name+'   ('+Object.keys(META.ach).length+' of '+Object.keys(ACH).length+')',until:S.t+4.5}; jingle([659,784,988,1319,988,1319,1568],0.09,'triangle',0.07); buzz(30); return true; }
function unlock(g){ META.unl=META.unl||{}; if(!META.unl[g]){ META.unl[g]=1; saveMeta(); } }
function best(game,score){ unlock(game); const old=META.best[game]||0; if(score>old){ META.best[game]=score; saveMeta(); return true; } return false; }
function drawToast(){ const t=S.toast; if(S.t>t.until){ S.toast=null; return; } U.font='bold 7px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=Math.max(120,U.measureText(t.txt).width+34);
  const y=Math.min(6,(t.until-S.t>4.2?(4.5-(t.until-S.t))/0.3:1)*6); box(VW/2-w/2,y,w,24,'rgba(60,46,90,0.97)','#ffd98a');
  U.fillStyle='#ffd98a'; U.beginPath(); U.arc(VW/2-w/2+13,y+12,5,0,7); U.fill(); txt('ACHIEVEMENT',VW/2-w/2+24,y+4,'#ffd98a',5.5,'left',true); txt(t.txt,VW/2-w/2+24,y+12,'#fff',7,'left',true); }
function drawBanner(){ const b=S.banner; box(VW/2-90,VH/2-24,180,b.sub?42:30,'rgba(20,16,30,0.92)','#ffd98a'); txt(b.txt,VW/2,VH/2-15,'#ffd98a',12,'center'); if(b.sub) txt(b.sub,VW/2,VH/2+3,'#f4ead8',8,'center'); }
function drawTitle(){
  U.fillStyle='rgba(12,10,24,0.72)'; U.fillRect(0,0,VW,VH);
  txt('A Day in the Life of',VW/2,46,'#c9c0d8',8,'center');
  txt('CAM',VW/2,60,'#ffd98a',26,'center',true);
  txt(S.titleSub||'',VW/2,100,'#f4ead8',8,'center');
  if(Math.floor(S.t*2)%2) txt(S.titlePrompt||(isTouch()?'Tap to start':'Press Z or Space to start'),VW/2,128,'#ffd98a',8,'center');
  txt(isTouch()?'Drag anywhere: move · drag far or B: run · A or tap: do things':'Arrows or WASD: move · Z or Space: do things · X or Shift: run · I: bag · M: mute',VW/2,VH-14,'#7d7590',6,'center');
}
// ---------------- resize ----------------
function fit(){ const W=innerWidth, Hh=innerHeight; const touch=matchMedia('(pointer:coarse)').matches; document.body.classList.toggle('touch',touch);
  const portrait = touch && W<Hh;
  if(portrait){ VW=208; VH=Math.min(300,Math.round(208*(Hh*0.62)/W)); } else { VW=320; VH=180; }
  cv.width=VW; cv.height=VH; ctx.imageSmoothingEnabled=false; lc.width=VW; lc.height=VH;
  const availH = portrait ? Hh*0.62 : Hh; let s=Math.min(W/VW, availH/VH); if(s>=2 && !touch) s=Math.floor(s);
  const cw=Math.floor(VW*s), ch=Math.floor(VH*s); for(const c of [cv,uc]){ c.style.width=cw+'px'; c.style.height=ch+'px'; }
  const dpr=window.devicePixelRatio||1; uc.width=Math.round(cw*dpr); uc.height=Math.round(ch*dpr); UK=uc.width/VW; }
addEventListener('resize',fit); fit();
requestAnimationFrame(frame);

function hexShade(c,k){ const n=parseInt(c.slice(1),16); const f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k))); return 'rgb('+f(n>>16)+','+f((n>>8)&255)+','+f(n&255)+')'; }
// A cap of hair from angle a0 to a1: uneven crown with tufts, a choppy fringe, and a few strands, so it never reads as a bowl.
function uHair(cx,cy,r,a0,a1,col,o){ o=o||{}; const dk=hexShade(col,-0.3), lt=hexShade(col,0.3), ry=o.ry||r, n=o.teeth||5;
  const x0=cx+Math.cos(a0)*r, y0=cy+Math.sin(a0)*ry, x1=cx+Math.cos(a1)*r, y1=cy+Math.sin(a1)*ry;
  U.beginPath(); U.moveTo(x0,y0);
  for(let i=1;i<=14;i++){ const a=a0+(a1-a0)*i/14, b=(i===4||i===7||i===10)?1.17:(i%2?1.04:0.98); U.lineTo(cx+Math.cos(a)*r*b,cy+Math.sin(a)*ry*b); }
  let ux=-(y1-y0), uy=(x1-x0); const L=Math.hypot(ux,uy)||1; ux/=L; uy/=L; const mid=(a0+a1)/2; if(ux*Math.cos(mid)+uy*Math.sin(mid)>0){ ux=-ux; uy=-uy; }
  for(let i=1;i<n*2;i++){ const k=i/(n*2), d=(i%2?r*(0.16+0.1*((i*7)%3)/2):-r*0.05); U.lineTo(x1+(x0-x1)*k+ux*d,y1+(y0-y1)*k+uy*d); }
  U.closePath(); U.fillStyle=col; U.fill(); U.strokeStyle=dk; U.lineWidth=Math.max(0.45,r*0.07); U.lineJoin='round'; U.stroke();
  U.lineWidth=Math.max(0.4,r*0.07); U.lineCap='round';
  for(let i=1;i<n;i++){ const k=i/n, a=a1+(a0-a1)*k, sx=cx+Math.cos(a)*r*0.78, sy=cy+Math.sin(a)*ry*0.78, ex=x1+(x0-x1)*k+ux*r*0.08, ey=y1+(y0-y1)*k+uy*r*0.08; U.strokeStyle=i%2?dk:lt; U.beginPath(); U.moveTo(sx,sy); U.quadraticCurveTo((sx+ex)/2+(i%2?1:-1)*r*0.1,(sy+ey)/2,ex,ey); U.stroke(); }
  U.lineCap='butt'; }
// strands on hair that is drawn as its own shape (long hair): lines fanning down from y0 to y1
function uStrands(x,y0,y1,w,col,n){ U.lineCap='round'; U.lineWidth=Math.max(0.4,w*0.07); for(let i=0;i<(n||3);i++){ const k=(i+0.5)/(n||3)-0.5; U.strokeStyle=hexShade(col,i%2?-0.3:0.28); U.beginPath(); U.moveTo(x+k*w*0.5,y0); U.quadraticCurveTo(x+k*w*1.1,(y0+y1)/2,x+k*w*0.9,y1); U.stroke(); } U.lineCap='butt'; }
