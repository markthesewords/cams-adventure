'use strict';
// ================= The walk: side-scroller around the block =================
const WALK={ HIGH:4000, SLOT:190, get X(){ return VW<260?76:110; },
  // roof colour, wall colour, garage?, tree after (0 none,1 green,2 big,3 maroon,4 gold)
  legs:[
    {name:'Park Ave',dirn:'south',stage:0,houses:[['#5a4a44','#d8cdb8',1,2],['#5f7a72','#e8e2d2',0,1],['#8a8a90','#c9b89a',1,0]],turn:'E 68th St'},
    {name:'E 68th St',dirn:'east',stage:1,houses:[['#8a8a90','#c9b89a',0,1],['#9a9aa0','#e0d8c6',1,0],'X:Columbus Ave',['#7a5a48','#d9c8a8',1,3],['#a8b4a0','#e8e2d2',0,1]],turn:'Chicago Ave'},
    {name:'Chicago Ave',dirn:'north',stage:2,houses:[['#a8563e','#e0d2b8',1,1],['#8a8a90','#d8cdb8',0,0],['#9a9aa0','#c9b89a',1,2],['#b8b8bc','#e8e2d2',0,0],['#6a6a72','#d0c4ac',1,1],['#8a8a90','#e0d8c6',0,2],['#5e5048','#c9b89a',1,0]],turn:'E 67th St'},
    {name:'E 67th St',dirn:'west',stage:3,houses:[['#5e5048','#c9b89a',0,1],['#8a8a90','#e0d8c6',1,3],'X:Columbus Ave',['#8f8f96','#d8cdb8',0,1],['#9a9aa0','#e8e2d2',1,2]],turn:'Park Ave'},
    {name:'Park Ave',dirn:'south',stage:3,houses:[['#8a8a90','#d0c4ac',1,2],['#9a5a48','#e0d2b8',0,3],['#7a6a60','#d9c8a8',1,2,'ryan'],['#a08468','#e8dcc0',1,2],['#b0b0b6','#f0ece2',1,1,'home']]},
  ],
  stageNames:['Point at things!','Call Vinny!','Wave at neighbors!','All together now!'],
  words:{plane:'Airplane!',car:'Car!',truck:'Car!',bus:'Car!',dog:'Puppy!',football:'Football!!!'},
  generic:['Whoaaaa!','Yeah!','Wooooow','Oh yeah!','Mommy!','Daddy!','Whoaaaa!','Wooooow'],
};
function walkBuild(){
  const els=[]; let d=60; const legStart=[];
  WALK.legs.forEach((leg,li)=>{ legStart.push(d);
    leg.houses.forEach((h,hi)=>{
      if(typeof h==='string'){ els.push({t:'street',d,w:110,name:h.slice(2)}); d+=110; return; }
      els.push({t:'house',d:d+20,roof:h[0],wall:h[1],gar:h[2],tag:h[4],seed:li*10+hi}); if(h[3]) els.push({t:'tree',d:d+150,kind:h[3],seed:li*7+hi});
      d+=WALK.SLOT; });
    if(leg.turn){ els.push({t:'street',d,w:110,name:leg.turn,corner:true}); d+=110; } });
  return {els,legStart,total:d};
}
function walkTargets(world){
  // targets by distance; stage = leg stage
  const T=[]; const rnd=(a,b)=>a+Math.random()*(b-a);
  const legEnd=i=>i+1<world.legStart.length?world.legStart[i+1]:world.total;
  const pointKinds=['plane','car','dog','truck','bird','football','bus','plane','car','dog'];
  const fill=(from,to,gap,mk)=>{ for(let d=from; d<to; d+=gap*rnd(0.85,1.15)) T.push(mk(d)); };
  let k=0;
  fill(world.legStart[0]+170,legEnd(0)-60,92,d=>({type:'point',kind:pointKinds[(k++)%pointKinds.length],d,stage:0}));
  fill(world.legStart[1]+90,legEnd(1)-60,118,d=>({type:'vinny',kind:Math.random()<0.7?'squirrel':'otherdog',d,stage:1}));
  fill(world.legStart[2]+90,legEnd(2)-60,150,d=>({type:'wave',kind:Math.floor(Math.random()*6),d,stage:2}));
  const ryanD=world.els.find(e=>e.tag==='ryan').d;
  let j=0; fill(world.legStart[3]+80,ryanD-170,78,d=>{ const ty=['point','vinny','wave','point','wave','vinny'][(j++)%6]; return ty==='point'?{type:'point',kind:pointKinds[(k++)%pointKinds.length],d,stage:3}:ty==='vinny'?{type:'vinny',kind:Math.random()<0.6?'squirrel':'otherdog',d,stage:3}:{type:'wave',kind:Math.floor(Math.random()*6),d,stage:3}; });
  T.sort((a,b)=>a.d-b.d); T.forEach(t=>{ t.state='wait'; }); return T;
}
function walkGame(){
  return new Promise(resolve=>{
    const world=walkBuild(); const tg=walkTargets(world).filter(t=>!world.els.some(e=>e.corner&&t.d>e.d-24&&t.d<e.d+e.w+44)); const ryanD=world.els.find(e=>e.tag==='ryan').d, homeD=world.els.find(e=>e.tag==='home').d;
    const G={t:0,scroll:0,speed:34,stage:-1,score:0,streak:0,bestStreak:0,stats:{point:[0,0],vinny:[0,0],wave:[0,0]},tg,world,phase:'banner',pT:0,flash:null,camSay:null,camSayT:0,
      arm:0,lunge:0,ryanK:0,ryanGo:false,cans:0,cheers:0,say:[],done:false,legIdx:0,walkAnim:0,ryan:false,surprise:false,camOut:false,camX:0};
    for(const t of tg) G.stats[t.type][1]++;
    const speeds=[34,36,38,46], wins=[30,27,26,22];
    const center=()=>G.scroll+WALK.X+30;
    const phase=t=>t.d-center();                     // px until it reaches the family
    const win=t=>wins[t.stage]*(t.type==='point'&&['plane','car','truck','bus'].includes(t.kind)?1.15:1);
    function flash(txt,col){ G.flash={txt,col,t:0.8}; }
    function bub(who,txt,sec=1.2){ G.say=G.say.filter(s=>s.who!==who); G.say.push({who,txt,t:sec}); }
    function press(type){
      let best=null; for(const t of tg) if(t.state==='wait'&&t.type===type&&Math.abs(phase(t))<=win(t)){ if(!best||Math.abs(phase(t))<Math.abs(phase(best))) best=t; }
      if(!best){ const any=tg.some(t=>t.state==='wait'&&Math.abs(phase(t))<=win(t)*1.6); G.streak=0; G.score-=25; flash(any?'Wrong one!':'-25','#f25c54'); blip(150,0.12,0.05,'sawtooth'); return; }
      best.state='hit'; best.hitT=0; G.streak++; G.bestStreak=Math.max(G.bestStreak,G.streak); G.stats[type][0]++;
      const mult=1+Math.min(G.streak-1,10)*0.1, perfect=Math.abs(phase(best))<win(best)*0.4; const pts=Math.round(100*mult)+(perfect?25:0); G.score+=pts;
      flash((perfect?'Perfect! ':'')+'+'+pts,perfect?'#ffd98a':'#7bd95a'); jingle(perfect?[784,988,1319]:[784,988],0.06,'triangle',0.05); G.arm=0.6;
      if(type==='point'){ const w=WALK.words[best.kind]; bub('cam',(w&&Math.random()<0.45)?w:WALK.generic[Math.floor(Math.random()*WALK.generic.length)]); }
      else if(type==='vinny'){ bub('cam','Vinny Vinny!'); bub('vinny','?',0.8); }
      else { bub('cam','Hi!',0.9); best.reply=['Hi, Cam!','Hey, buddy!','Well hello!','Morning!','Hi, sweetie!'][Math.floor(Math.random()*5)]; }
    }
    function miss(t){ t.state='miss'; G.streak=0; if(t.type==='vinny'){ G.score-=50; G.lunge=1.0; flash('-50','#f25c54'); bub('nick','Whoa! VINNY!',1.2); blip(120,0.3,0.07,'sawtooth'); buzz(60); } }
    function setStage(s){ G.stage=s; G.phase='banner'; G.pT=0; G.speed=speeds[s]; }
    setStage(0);
    S.mini={ full:true, abKeys:true, dlgTop:true, G, get holdA(){ return G.phase==='camwalk'; },
      taps(){ const W=VW,Hh=VH, w=Math.min(64,(W-16)/3), y=Hh-30, on=[[0],[1],[2],[0,1,2]][Math.max(0,Math.min(3,G.stage))]||[]; if(G.phase==='camwalk') return [{x:0,y:0,w:W,h:Hh,fn(){ pressed.right=true; }}]; if(G.phase!=='play') return []; return on.map(i=>({x:W/2+(i-1)*(w+4)-w/2,y:y,w:w,h:22,k:['a','b','up'][i]})); },
      update(dt){ G.t+=dt; G.walkAnim+=dt;
        if(G.flash){ G.flash.t-=dt; if(G.flash.t<=0) G.flash=null; }
        G.say=G.say.filter(s=>(s.t-=dt)>0); if(G.arm>0) G.arm-=dt; if(G.lunge>0) G.lunge-=dt;
        if(G.phase==='banner'){ G.pT+=dt; if(G.pT>2.0) G.phase='play'; }
        if(G.phase==='play'||G.phase==='banner'){
          G.scroll+=G.speed*dt*(G.lunge>0.5?0.2:1);
          if(G.phase==='play'){ if(hit('a')) press('point'); if(hit('b')) press('vinny'); if(hit('up')) press('wave'); } else { hit('a');hit('b');hit('up'); }
          hit('left');hit('right');hit('down');
          for(const t of tg){ if(t.state==='wait'&&phase(t)<-win(t)) miss(t); if(t.state==='hit') t.hitT+=dt; }
          let li=0; for(let i=0;i<world.legStart.length;i++) if(center()>=world.legStart[i]) li=i; G.legIdx=li;
          const st=WALK.legs[li].stage; if(st>G.stage) setStage(st);
          if(!G.ryan&&center()>=ryanD+40){ G.ryan=true; G.phase='ryan'; }
          // corners: stop at the curb and swing the whole street around
          for(const e of world.els) if(e.corner&&!e.turned&&center()>=e.d+6){ e.turned=true; G.back=G.phase; G.phase='turn'; G.turnT=0; G.turnFrom=G.scroll; G.turnTo=e.d+e.w+8-(WALK.X+30); G.turnName=e.name; G.turnA=null; blip(420,0.08,0.04,'triangle'); }
        }
        else if(G.phase==='turn'){ G.turnT+=dt; hit('a');hit('b');hit('up');hit('left');hit('right');hit('down'); if(G.turnT>=1.25){ G.scroll=G.turnTo; G.phase=G.back==='banner'?'play':G.back; G.turnA=null; } }
        if(G.ryanGo) G.ryanK=Math.max(0,Math.min(1,G.ryanK+(G.ryanBack?-1:1)*dt/1.6)); if(G.cheers>0) G.cheers-=dt;
        if(G.phase==='home'){ G.scroll+=G.speed*dt; if(center()>=homeD+70){ G.phase='end'; } hit('a');hit('b');hit('up');hit('left');hit('right');hit('down'); }
        else if(G.phase==='camwalk'){ const go=K.right||K.a; if(go){ G.scroll+=20*dt; G.camStep=(G.camStep||0)+dt; } hit('a');hit('b');hit('up');hit('left');hit('right');hit('down');
          if(Math.random()<dt*0.5&&go) bub('vinny','*sniff*',0.8);
          if(center()>=homeD+70){ G.phase='end'; } }
        if(G.phase==='end'&&!G.done){ G.done=true; resolve(G); }
      },
      draw(){ walkDraw(G); }
    };
  });
}
// ---------- drawing: everything on the walk is drawn here, to scale ----------
let WC=ctx;                                   // where the street scene is being painted (screen, or a buffer during a turn)
const WO='#2e2838';
function wR(x,y,w,h,c){ WC.fillStyle=c; WC.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
function walkHouse(x,gy,e){
  const R=(a,b,w,h,c)=>wR(x+a,gy+b,w,h,c); const O=WO;
  const w=118, wallH=38;
  R(-1,-wallH-1,w+2,wallH+2,O); R(0,-wallH,w,wallH,e.wall);
  for(let i=0;i<wallH;i+=5) R(0,-wallH+i,w,1,'rgba(0,0,0,0.07)');
  WC.fillStyle=O; WC.beginPath(); WC.moveTo(x-8,gy-wallH+1); WC.lineTo(x+14,gy-wallH-26); WC.lineTo(x+w-14,gy-wallH-26); WC.lineTo(x+w+8,gy-wallH+1); WC.fill();
  WC.fillStyle=e.roof; WC.beginPath(); WC.moveTo(x-6,gy-wallH); WC.lineTo(x+15,gy-wallH-24); WC.lineTo(x+w-15,gy-wallH-24); WC.lineTo(x+w+6,gy-wallH); WC.fill();
  for(let i=6;i<24;i+=6) R(-6+i*0.9,-wallH-i,w+12-i*1.8,1,'rgba(0,0,0,0.12)');
  if(e.seed%3===0){ R(w*0.6,-wallH-34,10,14,O); R(w*0.6+1,-wallH-33,8,12,'#a8563e'); }
  const dx=e.gar?w*0.42:w*0.5; R(dx-1,-27,14,27,O); R(dx,-26,12,26,e.tag==='home'?'#3b78d8':['#7a4a32','#3f6b4a','#8a2a2a','#4a4a6a'][e.seed%4]); R(dx+9,-13,1,2,'#ffd98a');
  R(8,-30,22,16,O); R(9,-29,20,14,'#a8d0e8'); R(18,-29,1,14,'#f4f0ea'); R(9,-23,20,1,'#f4f0ea');
  if(e.gar){ R(w-42,-30,38,30,O); R(w-41,-29,36,29,'#e8e4dc'); for(let i=0;i<4;i++) R(w-41,-29+i*7,36,1,'#b8b4ac'); }
  else { R(w-34,-30,22,16,O); R(w-33,-29,20,14,'#a8d0e8'); R(w-24,-29,1,14,'#f4f0ea'); }
  R(dx-3,0,18,3,'#b8b4ac');
  if(e.tag==='home'&&WC===ctx){ txt('6733',x+dx+6,gy-36,'#2e2838',5,'center',true); }
}
function walkTree(x,gy,kind,seed){
  const cols={1:['#3f8a3c','#57a84e','#2f6a30'],2:['#35803a','#4c9a48','#27602c'],3:['#6a2a40','#8a3a54','#4a1c2c'],4:['#c8a030','#e0bc48','#9a7820']}[kind]; const big=kind===2?1.35:1;
  wR(x-4,gy-44*big,8,44*big,WO); wR(x-3,gy-44*big,6,44*big,'#6e4e34');
  const blobs=[[0,-70,26],[-20,-58,20],[20,-60,21],[-8,-86,18],[12,-84,17],[0,-50,22]];
  for(const pass of [0,1,2]) for(const [bx,by,r] of blobs){ const rr=r*big; WC.fillStyle=pass===0?WO:pass===1?cols[0]:cols[1]; WC.beginPath(); WC.arc(Math.round(x+bx*big)-(pass===2?4:0),Math.round(gy+by*big)-(pass===2?5:0),pass===0?rr+1.5:pass===1?rr:rr*0.55,0,7); WC.fill(); }
}
// a person, side on. x = centre, fy = feet. d = +1 facing right, -1 facing left.
function wfig(x,fy,o){
  const d=o.d||1, H=o.H||10, T=o.T||16, L=o.L||20, hw=o.hw||5, tw=o.tw||5, lw=o.lw||4, t=o.t||0, wk=o.walk?1:0;
  const parts=[]; const P_=(a,b,w,h,c)=>parts.push([d>0?x+a:x-a-w,fy+b,w,h,c]);
  const sw=wk?Math.sin(t*9):0, st=L*0.22;
  const leg=(s,col)=>{ const f=s*sw*st; P_(-lw/2+f*0.45,-L,lw,Math.ceil(L/2),col); P_(-lw/2+f,-L+Math.floor(L/2),lw,Math.ceil(L/2)-2,col); P_(-lw/2+f,-2,lw+2,2,o.shoes||'#3a3a44'); };
  const top=-L-T, sh=top+2, al=Math.round(T*0.8);
  const arm=(kind,s)=>{ const col=o.sleeve||o.shirt, sk=o.skin||'#f0c8a4';
    if(kind==='swing'){ const f=s*sw*al*0.3; P_(-1+f*0.5,sh,3,al-3,col); P_(-1+f,sh+al-3,3,3,sk); }
    else if(kind==='push'){ P_(0,sh+3,tw+7,3,col); P_(tw+7,sh+3,2,3,sk); }
    else if(kind==='leash'){ P_(0,sh+2,3,6,col); P_(2,sh+7,tw+2,3,col); P_(tw+4,sh+7,2,3,sk); }
    else if(kind==='hold'){ P_(0,sh+1,3,7,col); P_(2,sh+6,tw+1,3,sk); if(o.can){ P_(tw+2,sh+1,3,6,'#d8a020'); P_(tw+2,sh+1,3,1,'#f4f0ea'); } if(o.can2){ P_(tw-2,sh+1,3,6,'#d8a020'); P_(tw-2,sh+1,3,1,'#f4f0ea'); } }
    else if(kind==='cheers'){ P_(1,sh-1,3,4,col); P_(3,sh-6,tw+1,3,sk); P_(tw+3,sh-12,3,6,'#d8a020'); P_(tw+3,sh-12,3,1,'#f4f0ea'); }
    else if(kind==='wave'||kind==='up'){ const wv=kind==='wave'&&Math.floor(t*5)%2; P_(1,sh-al+5,3,al-3,col); P_(1+(wv?2:0),sh-al+2,3,3,sk); }
    else if(kind==='point'){ P_(0,sh+1,tw+6,3,col); P_(tw+6,sh+1,3,3,sk); } };
  leg(-1,o.pants2||o.pants);
  if(o.arm2) arm(o.arm2,-1);
  leg(1,o.pants);
  P_(-tw,top,tw*2,T,o.shirt); if(o.stripe) for(let i=2;i<T-1;i+=3) P_(-tw,top+i,tw*2,1,o.stripe); if(o.chest) P_(1,top+Math.round(T*0.3),3,3,o.chest);
  if(o.bibTop) P_(-tw+1,top+Math.round(T*0.35),tw*2-2,T-Math.round(T*0.35),o.bibTop);
  arm(o.arm||'swing',1);
  const hy=top-H+1, sk=o.skin||'#f0c8a4';
  if(o.hair&&o.hairStyle==='long') P_(-hw-1,hy+2,4,H+Math.round(T*0.45),o.hair);
  P_(-hw+1,hy,hw*2-1,H,sk); P_(hw-2,hy+Math.round(H*0.42),1,2,WO); P_(hw-3,hy+H-3,2,1,'#c8806a'); P_(-hw+2,hy+Math.round(H*0.45),1,2,'#d8a488');
  if(o.hair){ P_(-hw,hy-1,hw*2,Math.round(H*0.36),o.hair); P_(-hw,hy-1,3,Math.round(H*(o.hairStyle==='long'?0.95:0.62)),o.hair); if(o.hairStyle==='long') P_(-hw+2,hy+Math.round(H*0.3),2,Math.round(H*0.6),o.hair); }
  if(o.hair&&o.hair[0]==='#'){ const hd=hexShade(o.hair,-0.28), hl=hexShade(o.hair,0.3), hh=Math.round(H*0.36); P_(-hw+2,hy-2,2,1,o.hair); P_(1,hy-2,3,1,o.hair); P_(-hw+3,hy,3,1,hl); P_(2,hy+1,2,1,hd); P_(-hw+1,hy+hh-1,1,2,o.hair); P_(0,hy+hh-1,1,1,o.hair); P_(hw-3,hy+hh-1,2,1,o.hair); P_(-hw,hy+hh,1,1,hd); if(o.hairStyle==='long'){ P_(-hw-1,hy+H,1,3,hd); P_(-hw+1,hy+H+2,1,3,hl); } }
  else { P_(-hw+3,hy+1,3,1,'#fbe0c4'); }
  if(o.beard){ P_(-1,hy+H-4,hw,4,o.beard); P_(-hw+3,hy+H-5,3,3,o.beard); }
  if(o.hat){ P_(-hw,hy-2,hw*2,Math.round(H*0.42),o.hat); }
  for(const p of parts){ WC.fillStyle=WO; WC.fillRect(Math.round(p[0])-1,Math.round(p[1])-1,Math.round(p[2])+2,Math.round(p[3])+2); }
  for(const p of parts){ WC.fillStyle=p[4]; WC.fillRect(Math.round(p[0]),Math.round(p[1]),Math.round(p[2]),Math.round(p[3])); }
}
// a dog, side on. k = size (1 = Vinny). cols: [coat, stripe, muzzle]
function wdog(x,fy,o){
  const d=o.d||1, k=o.k||1, t=o.t||0, c=o.cols||['#33211c','#5a3022','#120c0b']; const parts=[]; const P_=(a,b,w,h,col)=>parts.push([d>0?x+a*k:x-(a+w)*k,fy+b*k,w*k,h*k,col]);
  const sw=o.walk?Math.sin(t*10)*3:0, up=o.lift||0;
  P_(-15+sw*0.6,-9-up,4,9,c[0]); P_(9-sw*0.6,-9-up,4,9,c[0]);
  P_(-17,-17-up,3,3,c[0]); P_(-19,-20-up+(Math.floor(t*6)%2),3,4,c[0]);                     // tail
  P_(-15,-21-up,30,13,c[0]); P_(8,-23-up,8,6,c[0]);                                          // body, shoulders
  P_(-11-sw,-9-up,4,9,c[0]); P_(13+sw,-9-up,4,9,c[0]);
  P_(12,-29-up,12,12,c[0]); P_(20,-24-up,7,8,c[2]); P_(13,-30-up,4,6,c[2]);                 // head, muzzle, ear
  for(const p of parts){ WC.fillStyle=WO; WC.fillRect(Math.round(p[0])-1,Math.round(p[1])-1,Math.round(p[2])+2,Math.round(p[3])+2); }
  for(const p of parts){ WC.fillStyle=p[4]; WC.fillRect(Math.round(p[0]),Math.round(p[1]),Math.round(p[2]),Math.round(p[3])); }
  const S_=(a,b,w,h,col)=>{ WC.fillStyle=col; WC.fillRect(Math.round(d>0?x+a*k:x-(a+w)*k),Math.round(fy+b*k),Math.round(w*k),Math.round(h*k)); };
  if(c[1]) for(let i=0;i<7;i++) S_(-13+i*4,-20-up+(i%2),1,9-(i%3),c[1]);
  S_(19,-26-up,2,2,'#f4f0ea'); S_(20,-26-up,1,1,'#120c0b'); if(o.collar) S_(9,-24-up,2,7,o.collar);
  if(o.tongue) S_(23,-17-up,3,3,'#e8788a');
}
function wcar(x,y,kind,col,d=-1){
  const P_=(a,b,w,h,c)=>wR(d>0?x+a:x-a-w,y+b,w,h,c);
  const poly=(pts,c)=>{ WC.fillStyle=c; WC.beginPath(); pts.forEach(([a,b],i)=>{ const X=Math.round(x+a*d), Y=Math.round(y+b); i?WC.lineTo(X,Y):WC.moveTo(X,Y); }); WC.fill(); };
  const wheel=(a)=>{ const X=Math.round(x+a*d), Y=Math.round(y-4); WC.fillStyle=WO; WC.beginPath(); WC.arc(X,Y,5,0,7); WC.fill(); WC.fillStyle='#1c1a22'; WC.beginPath(); WC.arc(X,Y,4,0,7); WC.fill(); WC.fillStyle='#b8b8c2'; WC.beginPath(); WC.arc(X,Y,1.8,0,7); WC.fill(); };
  const dk=col, lite='rgba(255,255,255,0.22)', shade='rgba(0,0,0,0.2)', glass='#b4dcf0';
  if(kind==='bus'){ const L=38;
    poly([[-L-1,-4],[-L-1,-30],[L-6,-30],[L+1,-22],[L+1,-4]],WO); poly([[-L,-5],[-L,-29],[L-7,-29],[L,-21],[L,-5]],'#f0b01e');
    P_(-L,-14,L*2,2,'#22202a'); P_(-L,-9,L*2,1,'#22202a'); for(let i=0;i<6;i++) P_(-L+4+i*10,-26,8,8,glass); P_(L-10,-26,8,9,glass);
    P_(L-2,-11,3,3,'#fff4a8'); P_(-L,-11,2,3,'#d8232a'); P_(-L+2,-20,14,3,'#22202a'); wheel(-L+12); wheel(L-14); return; }
  if(kind==='truck'){ const L=28;
    poly([[-L-1,-4],[-L-1,-17],[2,-17],[5,-26],[18,-26],[23,-17],[L+1,-15],[L+1,-4]],WO);
    poly([[-L,-5],[-L,-16],[3,-16],[6,-25],[17,-25],[22,-16],[L,-14],[L,-5]],dk);
    poly([[7,-23],[16,-23],[19,-17],[5,-17]],glass); P_(-L,-16,L+3,2,shade); P_(-L,-12,L*2,1,lite); P_(-L,-7,L*2,2,shade);
    P_(L-2,-13,3,3,'#fff4a8'); P_(-L,-13,2,3,'#d8232a'); P_(11,-17,1,10,shade); P_(L-1,-7,3,2,'#b8b8c2'); wheel(-L+9); wheel(L-9); return; }
  const L=22;   // sedan
  poly([[-L-1,-4],[-L-1,-12],[-14,-13],[-8,-21],[9,-21],[16,-13],[L+1,-11],[L+1,-4]],WO);
  poly([[-L,-5],[-L,-11],[-13,-12],[-7,-20],[8,-20],[15,-12],[L,-10],[L,-5]],dk);
  poly([[-6,-18],[0,-18],[0,-13],[-10,-13]],glass); poly([[2,-18],[8,-18],[12,-13],[2,-13]],glass);
  P_(-L,-11,L*2,1,lite); P_(-L,-7,L*2,2,shade); P_(1,-13,1,7,shade); P_(-6,-10,3,1,shade); P_(4,-10,3,1,shade);
  P_(L-2,-10,3,2,'#fff4a8'); P_(-L,-10,2,2,'#d8232a'); P_(L-1,-6,3,2,'#b8b8c2'); P_(-L-2,-6,3,2,'#b8b8c2'); wheel(-L+8); wheel(L-9);
}
const WCAST={
  nick:{H:10,T:17,L:21,tw:6,hw:5,lw:5,shirt:'#2a2832',chest:'#e08a96',pants:'#3f5486',pants2:'#33456e',shoes:'#4a3a30',beard:'#8a7d78',skin:'#f0c4a0'},
  grace:{H:10,T:15,L:19,tw:5,hw:5,lw:4,shirt:'#2c2a38',pants:'#5a78b0',pants2:'#4a6496',shoes:'#f0ece4',hair:'#6a4630',hairStyle:'long',skin:'#f2caa8'},
  ryan:{H:10,T:16,L:21,tw:6,hw:5,lw:5,shirt:'#3a6ea8',pants:'#6a6a58',pants2:'#585848',shoes:'#3a3a44',hair:'#5a3a22',skin:'#eec0a0'},
  emory:{H:9,T:9,L:9,tw:4,hw:5,lw:3,shirt:'#24603f',sleeve:'#a8a8b0',chest:'#ffbe28',pants:'#4a5e8c',shoes:'#f0aabe',hair:'#ecd088',hairStyle:'long',skin:'#f4cdb0'},
};
function wcam(){ const o=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1]; return {H:9,T:7,L:6,tw:4,hw:5,lw:3,shirt:o[2],sleeve:o[4],pants:o[3],shoes:'#8a8e98',hair:'#e6c878',skin:'#f6d0b4'}; }
// the street itself: sky, lawns, houses, trees, sidewalk, road, cross streets
function walkScene(G,sc){
  const W=VW,Hh=VH,gy=Hh-34; const O=WO; const main=(WC===ctx);
  const sky=WC.createLinearGradient(0,0,0,gy); sky.addColorStop(0,'#8ec8f0'); sky.addColorStop(1,'#d8eefa'); WC.fillStyle=sky; WC.fillRect(0,0,W,gy);
  WC.fillStyle='#fff'; for(let i=0;i<5;i++){ const cx=((i*173-sc*0.08)%(W+120)+W+120)%(W+120)-60, cy=10+((i*37)%30); WC.fillRect(Math.round(cx),cy,34,7); WC.fillRect(Math.round(cx)+8,cy-4,18,5); }
  wR(0,gy-10,W,12,'#6fae58'); for(let x=-((sc)%14);x<W;x+=14) wR(x,gy-8,2,2,'#5f9e4c');
  for(const e of G.world.els){ const x=e.d-sc; if(x<-260||x>W+140) continue; if(e.t==='house') walkHouse(x,gy-8,e); }
  for(const e of G.world.els){ const x=e.d-sc; if(x<-260||x>W+140) continue; if(e.t==='tree') walkTree(x,gy-6,e.kind,e.seed); }
  wR(0,gy+2,W,14,'#c9c6c0'); for(let x=-((sc)%40);x<W;x+=40) wR(x,gy+2,1,14,'#b0ada6');
  wR(0,gy+16,W,5,'#5f9e4c'); wR(0,gy+21,W,2,'#8a8790'); wR(0,gy+23,W,Hh,'#55525c');
  for(let x=-((sc*1.2)%46);x<W;x+=46) wR(x,Hh-5,20,2,'#e8d870');
  for(const e of G.world.els){ if(e.t!=='street') continue; const x=e.d-sc; if(x<-140||x>W+20) continue;
    wR(x,gy-10,e.w,Hh,'#55525c'); for(let i=0;i<5;i++) wR(Math.round(x)+8+i*20,gy+3,12,12,'#f4f0ea');
    const sx=Math.round(x)-10; wR(sx,gy-58,3,60,O); wR(sx+1,gy-58,1,60,'#8a8a92');
    U.font='bold 6px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(e.name).width+8; wR(sx-tw/2,gy-70,tw+2,12,O); wR(sx-tw/2+1,gy-69,tw,10,'#2f7a4a'); if(main) txt(e.name,sx+1,gy-67,'#fff',6,'center',true); }
}
function walkDraw(G){
  const W=VW,Hh=VH,gy=Hh-34; let sc=G.scroll; const O=WO; const fy=gy+13;
  if(G.phase==='turn'){
    // the block swings around the corner: old street folds away to the left, new one opens from the right
    if(!G.turnA||G.turnA.width!==W||G.turnA.height!==Hh){ const mk=(s)=>{ const c=document.createElement('canvas'); c.width=W; c.height=Hh; WC=c.getContext('2d'); WC.imageSmoothingEnabled=false; walkScene(G,s); WC=ctx; return c; }; G.turnA=mk(G.turnFrom); G.turnB=mk(G.turnTo); }
    const q=Math.min(1,G.turnT/1.25), k=q<0.5?2*q*q:1-Math.pow(-2*q+2,2)/2, cut=Math.round(W*(1-k));
    if(cut>0){ ctx.drawImage(G.turnA,0,0,W,Hh,0,0,cut,Hh); ctx.fillStyle=`rgba(20,16,30,${0.45*k})`; ctx.fillRect(0,0,cut,Hh); }
    if(cut<W){ ctx.drawImage(G.turnB,0,0,W,Hh,cut,0,W-cut,Hh); ctx.fillStyle=`rgba(20,16,30,${0.45*(1-k)})`; ctx.fillRect(cut,0,W-cut,Hh); }
    ctx.fillStyle=O; ctx.fillRect(cut-1,0,2,Hh);
    sc=G.turnFrom+(G.turnTo-G.turnFrom)*k;
  } else walkScene(G,sc);
  const moving=(G.phase==='play'||G.phase==='banner'||G.phase==='home'||G.phase==='turn'); const t=G.walkAnim;
  // ---- things to react to
  for(const tg of G.tg){ const ph=tg.d-(sc+WALK.X+30); if(tg.state==='miss'&&ph<-200) continue; if(G.phase==='turn') continue;
    let x=WALK.X+30+ph, y=gy; const active=tg.state==='wait'; let lbl=null, ly=0;
    if(tg.type==='point'){
      if(tg.kind==='plane'){ x=WALK.X+30+ph*2.2; y=22;
        WC.fillStyle=O; WC.beginPath(); WC.moveTo(x-20,y+1); WC.lineTo(x-15,y-4); WC.lineTo(x+14,y-4); WC.lineTo(x+18,y-11); WC.lineTo(x+22,y-11); WC.lineTo(x+20,y+5); WC.lineTo(x-15,y+5); WC.fill();
        wR(x-16,y-3,34,7,'#f4f4f8'); wR(x-19,y-1,4,4,'#f4f4f8'); wR(x+16,y-10,5,8,'#d8232a'); wR(x-6,y+1,16,3,'#8a96b0'); for(let i=0;i<6;i++) wR(x-12+i*4,y-2,2,2,'#3b78d8'); ly=y+12; }
      else if(tg.kind==='bird'){ y=gy-98; const f=Math.floor(G.t*6)%2; wR(x-4,y,8,4,O); wR(x-8,y-(f?3:0),4,2,O); wR(x+4,y-(f?3:0),4,2,O); wR(x-2,y+1,4,2,'#d85a3a'); wR(x-6,y+1,2,1,'#e8b030'); ly=y+8; }
      else if(tg.kind==='dog'){ wdog(x,gy-6,{d:-1,k:0.62,t:G.t,cols:['#f0ece4','', '#c8a070'],collar:'#d8232a',tongue:1}); ly=gy-38; }
      else if(tg.kind==='football'){ wfig(x,gy-6,{H:8,T:11,L:12,tw:4,hw:4,lw:3,shirt:'#4a8ad8',pants:'#3a4a6a',hair:'#3a2a1e',arm:'up',d:-1,t:G.t});
        const by=gy-52-Math.abs(Math.sin(G.t*3))*14; WC.fillStyle=O; WC.beginPath(); WC.ellipse(x-12,by,5,3.5,0.4,0,7); WC.fill(); WC.fillStyle='#8a4a22'; WC.beginPath(); WC.ellipse(x-12,by,4,2.5,0.4,0,7); WC.fill(); wR(x-13,by-1,3,1,'#f4f0ea'); ly=gy-76; }
      else { x=WALK.X+30+ph*2.4; y=Hh-3; const col=tg.kind==='bus'?'#f0b01e':tg.kind==='truck'?['#3f8f5a','#b8423c','#5a6a8a'][Math.floor(tg.d)%3]:['#c8423c','#3b78d8','#e8e4dc','#4a4a52','#3f8f7a'][Math.floor(tg.d)%5];
        wcar(x,y,tg.kind,col,-1); ly=y-(tg.kind==='bus'?44:tg.kind==='truck'?40:34); }
      lbl=keyName('a');
    } else if(tg.type==='wave'){ const shirts=['#c84a6a','#4aa868','#c8a03a','#8a5ac8','#3aa8b8','#e07a4a'], hairs=['#e8e4d8','#3a2a1e','#c8a03a','#8a8a92','#5a3a22','#1e1e24'];
      wfig(x,gy-6,{H:9,T:14,L:17,tw:5,hw:5,lw:4,shirt:shirts[tg.kind],pants:['#3a4a6a','#6a6a58','#4a4a52'][tg.kind%3],hair:hairs[tg.kind],hairStyle:tg.kind%2?'long':'short',arm:tg.state==='hit'?'up':'wave',d:-1,t:G.t});
      if(tg.reply&&tg.hitT<1.4) drawBubbleU(tg.reply,x,gy-54); lbl='▲'; ly=gy-64;
    } else { const ahead=Math.max(ph,26); x=WALK.X+30+Math.min(ahead,W)+62; if(tg.state==='hit') x+=tg.hitT*120; if(tg.state==='miss') x+=20;
      y=gy+12; if(x>W+20&&tg.state!=='wait') continue;
      if(tg.kind==='squirrel'){ const hop=Math.abs(Math.sin(G.t*9))*3; wR(x-5,y-9-hop,10,8,O); wR(x-4,y-8-hop,8,6,'#9a6a3a'); wR(x+3,y-17-hop,6,11,O); wR(x+4,y-16-hop,4,9,'#b8844a'); wR(x-7,y-12-hop,5,5,O); wR(x-6,y-11-hop,3,3,'#9a6a3a'); wR(x-6,y-10-hop,1,1,O); }
      else wdog(x,y,{d:-1,k:0.7,t:G.t,walk:1,cols:['#c8a070','','#6a4a30'],collar:'#3b78d8'});
      lbl=keyName('b'); ly=y-32;
    }
    if(active&&lbl){ const wn=(tg.stage<3?[30,27,26][tg.stage]:22)*(tg.type==='point'&&['plane','car','truck','bus'].includes(tg.kind)?1.15:1); const inW=Math.abs(ph)<=wn; const soon=ph>0&&ph<wn*4;
      if(inW||soon){ const lx=Math.max(12,Math.min(W-12,x)); const r=inW?8+Math.sin(G.t*20)*1.2:6; U.globalAlpha=inW?1:0.55; U.fillStyle=inW?(tg.type==='point'?'#ffd98a':tg.type==='vinny'?'#f28a5a':'#7bd95a'):'#fff'; U.beginPath(); U.arc(lx,ly,r,0,7); U.fill(); U.strokeStyle='#2e2838'; U.lineWidth=1; U.stroke(); U.globalAlpha=1;
        txt(lbl,lx,ly-(inW?4:3.5),'#2e2838',inW?8:7,'center',true); if(!inW){ U.strokeStyle='rgba(255,255,255,0.8)'; U.beginPath(); U.arc(lx,ly,6+Math.min(14,ph-wn)*0.5,0,7); U.stroke(); } } }
  }
  // ---- the family
  const lun=G.lunge>0?Math.sin(Math.min(1,G.lunge)*Math.PI)*14:0;
  const gx=WALK.X-54, stx=WALK.X-27, nx=WALK.X+14+lun*0.7, vx=WALK.X+54+lun+(G.ryanK||0)*14;
  // ---- Ryan and Emory: out front, then Ryan walks over with two cans
  const ry=G.world.els.find(e=>e.tag==='ryan'); const r0=ry.d-sc+(Math.min(W-40,WALK.X+150)-WALK.X+10), rk=G.ryanK||0;
  const rx=r0+((nx+17+(sc-G.scroll))-r0)*(G.ryanGo?rk:0), ex=r0+16-(G.ryanGo?rk*8:0);
  const cheer=G.cheers>0;
  if(r0>-60&&r0<W+60){
    wfig(ex,fy-2-(G.emHop?4:0),Object.assign({d:-1,t:G.t,arm:G.emHop?'up':'swing'},WCAST.emory));
    wfig(rx,fy,Object.assign({d:G.ryanBack&&rk>0?1:-1,t:G.t,walk:G.ryanGo&&rk<1&&rk>0,arm:cheer?'cheers':'hold',can:G.cans<2||true,can2:G.cans<1,arm2:'swing'},WCAST.ryan)); }
  wfig(gx,fy,Object.assign({t,walk:moving,arm:'push',arm2:null},WCAST.grace));
  // stroller
  { const sy=fy; const wheel=(a)=>{ WC.fillStyle=O; WC.beginPath(); WC.arc(Math.round(stx+a),sy-4,4.5,0,7); WC.fill(); WC.fillStyle='#b8b8c0'; WC.beginPath(); WC.arc(Math.round(stx+a),sy-4,1.8,0,7); WC.fill(); };
    wR(stx-13,sy-31,2,22,O); wR(stx-17,sy-33,7,3,O);                                         // handle
    WC.fillStyle=O; WC.beginPath(); WC.moveTo(stx-12,sy-8); WC.lineTo(stx-12,sy-22); WC.lineTo(stx+13,sy-18); WC.lineTo(stx+10,sy-8); WC.fill();
    WC.fillStyle='#4a5868'; WC.beginPath(); WC.moveTo(stx-11,sy-9); WC.lineTo(stx-11,sy-21); WC.lineTo(stx+12,sy-17); WC.lineTo(stx+9,sy-9); WC.fill();
    wR(stx-8,sy-8,2,4,O); wR(stx+6,sy-8,2,4,O);
    if(!G.camOut){ const c=wcam(); wR(stx-5,sy-27,10,9,O); wR(stx-4,sy-26,8,8,c.shirt); wR(stx+3,sy-22,6,3,O); wR(stx+3,sy-21,5,1,c.pants);
      wR(stx-5,sy-37,11,11,O); wR(stx-4,sy-36,9,9,c.skin); wR(stx-5,sy-38,10,4,c.hair); wR(stx-5,sy-37,3,7,c.hair); wR(stx-3,sy-39,2,1,c.hair); wR(stx+1,sy-39,2,1,c.hair); wR(stx-2,sy-37,3,1,hexShade(c.hair,0.3)); wR(stx+2,sy-36,2,1,hexShade(c.hair,-0.28)); wR(stx-1,sy-34,1,1,c.hair); wR(stx+3,sy-34,1,1,c.hair); wR(stx+2,sy-32,1,2,O); wR(stx+2,sy-29,2,1,'#c8806a');
      if(G.arm>0){ wR(stx+3,sy-27,11,4,O); wR(stx+4,sy-26,6,2,c.sleeve); wR(stx+10,sy-26,3,2,c.skin); } }
    WC.fillStyle=O; WC.beginPath(); WC.moveTo(stx-13,sy-22); WC.lineTo(stx-12,sy-41); WC.lineTo(stx-2,sy-42); WC.lineTo(stx-8,sy-22); WC.fill();
    WC.fillStyle='#2a8a8a'; WC.beginPath(); WC.moveTo(stx-12,sy-23); WC.lineTo(stx-11,sy-40); WC.lineTo(stx-3,sy-41); WC.lineTo(stx-8,sy-23); WC.fill();
    wheel(-8); wheel(10); }
  const hasCan=G.cans>=1;
  if(!G.camOut){ wfig(nx,fy,Object.assign({t:t+0.35,walk:moving,arm:hasCan?(cheer?'cheers':'hold'):'leash',can:hasCan,arm2:hasCan?null:'swing'},WCAST.nick));
    WC.strokeStyle=O; WC.lineWidth=1; WC.beginPath(); WC.moveTo(Math.round(nx+(hasCan?2:13)),fy-(hasCan?22:27)); WC.lineTo(Math.round(vx+8),fy-21); WC.stroke(); }
  else { const cw=(K.right||K.a)&&G.phase==='camwalk'; wfig(WALK.X-4,fy,Object.assign({t,walk:false,arm:hasCan?'hold':'swing',can:hasCan},WCAST.nick));
    wfig(vx-36,fy,Object.assign({t:G.t,walk:cw,arm:'leash'},wcam())); WC.strokeStyle=O; WC.lineWidth=1; WC.beginPath(); WC.moveTo(Math.round(vx-27),fy-11); WC.lineTo(Math.round(vx+8),fy-21); WC.stroke(); }
  wdog(vx,fy,{t:G.walkAnim,walk:moving||(G.phase==='camwalk'&&(K.right||K.a)),collar:'#c8423c',tongue:1});
  // bubbles
  for(const s of G.say){ const pos={cam:[G.camOut?vx-36:stx+8,fy-(G.camOut?32:48)],nick:[G.camOut?WALK.X-4:nx,fy-58],vinny:[vx+18,fy-36],grace:[gx,fy-54],ryan:[rx,fy-58],emory:[ex,fy-36]}[s.who]; if(pos) drawBubbleU(s.txt,Math.max(24,Math.min(W-24,pos[0])),pos[1]); }
  // ---- UI
  const leg=WALK.legs[G.legIdx]; box(3,3,84,20,'rgba(28,24,40,0.85)'); txt(leg.name,8,6,'#ffd98a',7,'left',true); txt('heading '+leg.dirn,8,14,'#a9a0b8',5.5);
  box(W-64,3,61,20,'rgba(28,24,40,0.85)'); txt(String(G.score),W-8,5,'#ffd98a',8,'right',true); txt(G.streak>1?'streak x'+G.streak:'',W-8,14,'#7bd95a',5.5,'right');
  if(G.flash){ const k=G.flash.t/0.8; txt(G.flash.txt,WALK.X+20,gy-92-(1-k)*12,G.flash.col,9,'center',true); }
  const A=keyName('a'), B=keyName('b'), AL=keyName('a',1), BL=keyName('b',1);
  if(G.phase==='turn'){ box(W/2-70,26,140,16,'rgba(60,46,90,0.95)','#ffd98a'); txt('Turning onto '+G.turnName,W/2,31,'#fff',7,'center',true); }
  if(G.phase==='banner'){ box(W/2-88,Hh/2-30,176,46,'rgba(20,16,30,0.94)','#ffd98a'); txt('PART '+(G.stage+1)+' OF 4',W/2,Hh/2-25,'#a9a0b8',6,'center',true); txt(WALK.stageNames[G.stage],W/2,Hh/2-15,'#ffd98a',10,'center',true);
    txt([AL+' when Cam should point',BL+' when Vinny spots something','▲ (Up) when a neighbor is out',A+' point    '+B+' Vinny    ▲ wave'][G.stage],W/2,Hh/2+2,'#fff',6.5,'center'); }
  if(G.phase==='camwalk') { box(W/2-74,26,148,14,'rgba(60,46,90,0.95)','#ffd98a'); txt('Hold ▶ or '+A+': walk Vinny home',W/2,30,'#fff',6.5,'center',true); }
  if(G.phase==='play'&&isTouch()){ const w=Math.min(64,(W-16)/3), y=Hh-30, on=[[0],[1],[2],[0,1,2]][Math.max(0,Math.min(3,G.stage))]||[]; for(const i of on){ const x=W/2+(i-1)*(w+4)-w/2; uRR(x,y,w,22,7,['#ffd98a','#e8845a','#8fd0f0'][i],'#2e2838',1.2); txt(['POINT','VINNY!','WAVE'][i],x+w/2,y+7,'#2e2838',7.5,'center',true); } }
  else if(G.phase==='play') txt([A+' point',B+' Vinny Vinny!','▲ wave',A+' point   '+B+' Vinny   ▲ wave'][G.stage],W/2,Hh-9,'rgba(255,255,255,0.8)',5.5,'center');
}
async function walkOuting(){
  await say('Mom','A walk! Let\'s get the stroller.');
  await say('Dad','I\'ll grab Vinny\'s leash.');
  await leaveHome(true); await fadeTo(1,600); setDown(); return walkCore(); }
async function walkCore(){ S.fadeText='The Walk'; S.fadeSub='Around the block: Park, 68th, Chicago, 67th'; await wait(2000); S.fadeText=null; S.fadeSub=null;
  const pr=walkGame(); const G=S.mini.G; await fadeTo(0,500);
  // Ryan + Emory (always), then the last stretch
  while(G.phase!=='ryan') await wait(80);
  const bub=(who,txt,sec)=>{ G.say=G.say.filter(s=>s.who!==who); G.say.push({who,txt,t:sec||1.6}); };
  await wait(500); bub('cam','Hi!',1.2); await wait(900); bub('emory','Cam!!',1.4); await wait(1200);
  await say('Ryan','Hey, neighbors! Out for the loop?');
  G.ryanGo=true; while(G.ryanK<1) await wait(60); await wait(250);
  await say('Ryan','Here, Nick. You look thirsty.'); G.cans=1; blip(700,0.05,0.05,'triangle'); await wait(600);
  await say('Dad','Don\'t mind if I do. Cheers.'); G.cheers=1.3; await wait(350); jingle([1568,2093],0.05,'triangle',0.06); await wait(1100);
  await say('Dad','We\'ll see Emory later tonight!');
  bub('cam','Yeah!',1.5); bub('emory','Yeah!!',1.5); jingle([784,988,1175,1568],0.08,'triangle',0.05);
  for(let i=0;i<6;i++){ G.emHop=(i%2?1:0); await wait(200); } G.emHop=0;
  G.ryanBack=true; while(G.ryanK>0) await wait(60); await wait(500);
  const high=G.score>=WALK.HIGH;
  if(high){ G.surprise=true;
    await say('Dad','You were such a good walker today, bud. Want to walk Vinny the rest of the way?');
    bub('cam','Yeah!',1.4); await wait(900); G.camOut=true; blip(300,0.05,0.04,'triangle');
    await say('','Cam climbs out and takes the leash in both hands. Vinny, for once in his life, walks slowly.');
    G.phase='camwalk'; }
  else { G.speed=40; G.phase='home'; }
  await pr;
  if(high){ bub('cam','Vinny Vinny!',1.6); await wait(1200); await say('Mom','Look at you two. Best friends.'); award('walker'); await wait(1000); }
  // scoreboard
  const isBest=best('walk',G.score); let ok=false, t0=S.t;
  const keep=S.mini; S.mini={full:true,abKeys:true,tapA:true,G,update(dt){ if(S.t-t0>1&&(hit('a')||hit('b'))) ok=true; },
    draw(){ walkDraw(G); const W=VW,Hh=VH; box(W/2-92,14,184,Hh-28,'rgba(20,16,30,0.96)','#ffd98a'); txt('THE WALK',W/2,20,'#ffd98a',10,'center',true);
      const rows=[['Pointed at',G.stats.point],['Called Vinny',G.stats.vinny],['Waved',G.stats.wave]]; let y=38;
      for(const [n,[a,b]] of rows){ txt(n,W/2-78,y,'#f4ead8',7); txt(a+' / '+b,W/2+78,y,'#f4ead8',7,'right',true); y+=11; }
      txt('Best streak',W/2-78,y,'#f4ead8',7); txt('x'+G.bestStreak,W/2+78,y,'#f4ead8',7,'right',true); y+=14;
      txt('SCORE',W/2-78,y,'#ffd98a',9,'left',true); txt(String(G.score),W/2+78,y,'#ffd98a',9,'right',true); y+=14;
      txt('High score line: '+WALK.HIGH,W/2,y,high?'#7bd95a':'#a9a0b8',6.5,'center'); y+=9;
      txt(high?'Cam walked Vinny home!':'Beat the line and Cam gets a surprise.',W/2,y,high?'#7bd95a':'#a9a0b8',6.5,'center'); y+=9;
      txt(isBest?'New best!':'Best: '+(META.best.walk||G.score),W/2,y,'#a9a0b8',6.5,'center');
      if(Math.floor(S.t*2)%2) txt(keyName('a')+': continue',W/2,Hh-24,'#ffd98a',7,'center',true); }};
  while(!ok) await wait(60);
  await showBoard('walk','THE WALK',G.score,'');
  await fadeTo(1,700); S.mini=null;
  return {score:G.score,high};
}
