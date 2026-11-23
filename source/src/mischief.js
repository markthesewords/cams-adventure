// ====== Cam's list: toddler mischief around the house ======
// Each item is a spot, a short action and an acted-out reaction. Nothing can be failed: a caught Cam still ticks the item.
// The text comes from Nick's doc ("Cam's Mischief List"); lines marked with his words are his.
const MS={ mode:null, props:[], ch:null, t:0, tv:0 };
const MS_LISTS={ am:{title:'Morning', ids:['tp','books','phone','remote','vinnyfood','rocker','toybin','glass','bowl','vinny']} };
const MS_ITEMS={
  tp:{name:'Unroll the toilet paper', obj:'toilet'},
  books:{name:'Empty the bookshelf', obj:'books_cam'},
  phone:{name:"Take Dad's phone", obj:'ctrS21', prop:'phone'},
  remote:{name:'Press every button on the remote', obj:'trunk', prop:'remote'},
  vinnyfood:{name:'Share breakfast with Vinny', hint:'At breakfast'},
  rocker:{name:'Climb the rocking chair', obj:'rockchair'},
  toybin:{name:'Dump the toy bin', obj:'toys'},
  glass:{name:'Hands on the glass', obj:'slider'},
  bowl:{name:"Splash Vinny's water bowl", at:[503,138], prop:'bowl'},
  vinny:{name:'Lie on top of Vinny', hint:'When he is on the couch'},
};
MS_LISTS.yard={title:'Backyard',map:'yard',ach:'backyard',ids:['wrongway','hose','ball','garden','stick','dirt']};
const MS_CATCH={ nick:["I'm gonna get ya!","Get over here you little troublemaker!","Now you've asked for it!"], grace:["Hey! You! I got you!","Camaroon causing trouble!","You're so cute I can't freakin stand it!"] };
const msRand=a=>a[Math.floor(Math.random()*a.length)];
function msListId(){ if(S.map==='yard') return S.chapter>=6?'yard':null; return (S.chapter===2||S.chapter===3)&&(!S.map||S.map==='house')?'am':null; }
function msFlags(){ S.flags.ms=S.flags.ms||{}; return S.flags.ms; }
const msHouse=()=>!S.map||S.map==='house';
function msActive(){ return !!msListId()&&!YD.busy&&!S.cleaning&&!S.doorHelper&&!P.carry&&!P.lying&&!S.bounds&&!S.noCollide; }
function msSpot(id){ const it=MS_ITEMS[id]; if(it.at) return it.at; if(it.obj&&OBJ[it.obj]){ const o=OBJ[it.obj]; return [o.x+o.w/2,o.y+o.h/2]; } if(id==='vinny') return [NPC.vinny.x,NPC.vinny.y-6]; return null; }
function msNear(id,px,py){ const it=MS_ITEMS[id];
  if(id==='vinny'){ const v=NPC.vinny; return v.visible&&v.lie&&!!v.perch&&Math.hypot(v.x-px,v.y-4-py)<22; }
  if(it.at) return Math.hypot(it.at[0]-px,it.at[1]-py)<13;
  if(it.obj&&OBJ[it.obj]){ const o=OBJ[it.obj], r=o.solid||[o.x,o.y,o.w,o.h], pad=4, in_=(x,y,m)=>x>=r[0]-m&&x<r[0]+r[2]+m&&y>=r[1]-m&&y<r[1]+r[3]+m; return in_(px,py,pad)||in_(P.x,P.y-2,15); }   // close enough counts too: tight corners can keep the probe from reaching
  return false; }
function msDone(id){ const f=msFlags(); if(f[id]) return; f[id]=true; save(); const L=MS_LISTS[msListId()||'am'], n=L.ids.filter(k=>f[k]).length;
  jingle([784,988,1175],0.07,'triangle',0.05); buzz(30); S.toast={head:"CAM'S LIST",txt:'✓ '+MS_ITEMS[id].name+'   ('+n+' of '+L.ids.length+')',until:S.t+3.5};
  if(n>=L.ids.length) setTimeout(()=>award(L.ach||'mischief'),3700); }
// ---------- helpers ----------
function msFreeNear(x,y,avoid){ let best=null,bd=1e9; for(let r=0;r<=40;r+=8) for(let a=0;a<8;a++){ const px=x+Math.cos(a*Math.PI/4)*r, py=y+Math.sin(a*Math.PI/4)*r; if(!boxFree(px,py,5,4)) continue; if(avoid&&Math.hypot(px-avoid[0],py-avoid[1])<14) continue; const d=Math.hypot(px-x,py-y); if(d<bd){ bd=d; best=[px,py]; } if(r===0) break; } return best||[x,y]; }
function msWho(pref){ const a=NPC[pref], b=NPC[pref==='grace'?'nick':'grace']; for(const e of [a,b]) if(e&&e.visible&&!e.away&&S.doorHelper!==e) return e; return null; }
function msFaceTo(e,x,y){ const dx=x-e.x, dy=y-e.y; e.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); }
async function msCome(e,x,y,sp){ claim(e); const p=msFreeNear(x,y,[P.x,P.y]); await walk(e,[p],(sp||84)*1.4); msFaceTo(e,P.x,P.y); }
async function msCarry(e,x,y){ msFaceTo(e,P.x,P.y); P.carry=e; P.lift=9; P.zBias=3; bubble(P,'Up!',800); blip(500,0.06,0.04,'triangle'); await wait(400);
  const p=msFreeNear(x,y); await walk(e,[p],58); P.carry=null; P.lift=0; P.zBias=0; const q=msFreeNear(e.x,e.y+10,[e.x,e.y]); P.x=q[0]; P.y=q[1]; P.dir='down'; msFaceTo(e,P.x,P.y); blip(300,0.05,0.04,'triangle'); }
function msName(e){ return e===NPC.nick?'Dad':'Mom'; }
async function msRun(fn){ S.cut=true; try{ await fn(); } catch(x){ console.error(x); } finally{ MS.mode=null; S.cut=false; for(const k in pressed) pressed[k]=false; } }
// hand control back to the player for a while; resolves when the mode calls done()
function msFree(mode){ return new Promise(res=>{ mode.done=r=>{ if(MS.mode!==mode) return; MS.mode=null; S.cut=true; res(r); }; mode.t=0; MS.mode=mode; S.cut=false; for(const k in pressed) pressed[k]=false; }); }
function msProp(p){ MS.props.push(p); return p; }
// ---------- the chase: Dad (or Mom) runs Cam down; last long enough and it turns around ----------
const MS_PANTRY=()=>{ const o=OBJ.pantry; return [o.x+o.w+7,o.y+o.h/2+2]; };
const MS_FLEE=[[300,300],[440,220],[290,100],[420,150],[310,380],[450,330],[440,300],[330,96]];
async function msChase(e,opts){ opts=opts||{}; claim(e); const who=e===NPC.nick?'nick':'grace';
  bubble(e,opts.start||msRand(MS_CATCH[who]),1500); jingle([330,392,494,587],0.06,'square',0.04);
  const r=await msFree({ id:'chase', e, rep:0, hideT:0, limit:opts.limit||8, label:'RUN!',
    tick(dt){ const m=this; m.t+=dt; m.rep-=dt; const d=Math.hypot(e.x-P.x,e.y-P.y);
      if(m.rep<=0){ m.rep=0.3; const p=findPath(e.x,e.y,P.x,P.y); e.path=p&&p.length?p:[[P.x,P.y]]; e.pathSpeed=opts.speed||55; e.hold=false; }
      const pp=MS_PANTRY(); if(Math.hypot(P.x-pp[0],P.y-pp[1])<12&&!P.moving){ m.hideT+=dt; if(m.hideT>0.45&&d>34) return m.done('hid'); } else m.hideT=0;
      if(d<13) return m.done('caught'); if(m.t>m.limit) return m.done('escaped'); },
    hud(){ const m=this; msPill(m.label+'  '+Math.max(0,Math.ceil(m.limit-m.t)),'#e8543a'); } });
  e.path=null; e.moving=false;
  if(r==='hid'){ const pp=MS_PANTRY(); P.visible=false; blip(240,0.08,0.05,'triangle'); await walk(e,[msFreeNear(pp[0]+16,pp[1]+6)],60);
    for(const d of ['left','right','up']){ e.dir=d; await wait(380); } bubble(e,"Where'd he go?",1500); await wait(1700);
    msFaceTo(e,pp[0],pp[1]); blip(300,0.08,0.05,'triangle'); P.visible=true; await arcTo(P,P.x,P.y,7,260); bubble(e,'Found you!',1300); bubble(P,'Hahaha!',1300); await wait(1400); award('hider'); return 'hid'; }
  if(r==='caught'){ msFaceTo(e,P.x,P.y); S.shake=0.15; buzz(40); bubble(e,msRand(MS_CATCH[who]),1500); await arcTo(P,P.x,P.y,6,240); await wait(900); return 'caught'; }
  // escaped: Cam turns around and becomes the chaser
  msFaceTo(e,P.x,P.y); bubble(e,'*huff*  *puff*',1300); await wait(1300); bubble(P,'My turn!',1100); jingle([587,494,392,330],0.06,'square',0.04); await wait(700);
  const fl=MS_FLEE.filter(p=>boxFree(p[0],p[1],5,4));
  const r2=await msFree({ id:'flip', e, rep:0, limit:14, label:'GET '+msName(e).toUpperCase()+'!',
    tick(dt){ const m=this; m.t+=dt; m.rep-=dt; const d=Math.hypot(e.x-P.x,e.y-P.y);
      if(m.rep<=0||!e.path){ m.rep=1.1; let best=null,bs=-1; for(const p of fl){ const s=Math.hypot(p[0]-P.x,p[1]-P.y)-0.35*Math.hypot(p[0]-e.x,p[1]-e.y); if(s>bs){ bs=s; best=p; } } const pa=best&&findPath(e.x,e.y,best[0],best[1]); if(pa){ e.path=pa; e.pathSpeed=54; e.hold=false; } }
      if(d<14) return m.done('tagged'); if(m.t>m.limit) return m.done('tired'); },
    hud(){ const m=this; msPill(m.label+'  '+Math.max(0,Math.ceil(m.limit-m.t)),'#3f9a4a'); } });
  e.path=null; e.moving=false; msFaceTo(e,P.x,P.y);
  if(r2==='tagged'){ S.shake=0.2; buzz(60); jingle([523,659,784,1047],0.07,'triangle',0.05); bubble(e,'Ahh! He got me!',1500); for(const d of ['left','up','right','down']){ P.dir=d; await wait(110); } await arcTo(P,P.x,P.y,8,280); await wait(700); award('chaser'); return 'tagged'; }
  bubble(e,'Okay, okay. You win.',1500); await wait(1500); return 'escaped'; }
function msPill(s,col){ U.font='bold 8px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=U.measureText(s).width+18, x=VW/2-w/2, y=34; U.fillStyle='rgba(24,20,34,0.9)'; U.beginPath(); U.roundRect(x,y,w,15,7.5); U.fill(); U.strokeStyle=col; U.lineWidth=1.2; U.stroke(); txt(s,VW/2,y+3.5,'#fff',8,'center',true); }
// ---------- the items ----------
const MS_DO={
  async tp(){ const o=OBJ.toilet, roll=[o.x+o.w+3,o.y+20]; blip(700,0.05,0.04,'triangle'); bubble(P,'Wheee!',1200);
    const trail=msProp({kind:'tp',pts:[roll.slice()],sortY:-1e6,k:1});
    await msFree({ id:'tp', label:'Run with it!', limit:5,
      tick(dt){ this.t+=dt; const l=trail.pts[trail.pts.length-1]; if(Math.hypot(P.x-l[0],P.y+2-l[1])>5){ trail.pts.push([P.x,P.y+2]); if(trail.pts.length%3===0) blip(900+Math.random()*200,0.02,0.015,'triangle'); } if(this.t>this.limit) this.done(); },
      hud(){ msPill(this.label+'  '+Math.max(0,Math.ceil(this.limit-this.t)),'#8fd0f0'); } });
    const g=msWho('grace'); if(g){ await msCome(g,P.x,P.y); await say(msName(g),'Cameron!'); bubble(g,'*roll roll roll*',1600); }
    msDone('tp');
    (async()=>{ const n=trail.pts.length; for(let i=0;i<24;i++){ trail.k=1-(i+1)/24; await wait(70); } MS.props=MS.props.filter(p=>p!==trail); if(g) afterHelp(g); })(); },
  async books(){ const o=OBJ.books_cam; let n=0;
    await msFree({ id:'books', label:'Tap A: books out!',
      onA(){ if(!msNear('books',...probe())){ return; } n++; blip(300+n*60,0.05,0.05,'square'); buzz(15); const c=['#c8242c','#3f6bb0','#f0c828','#3f9a4a','#b48ae0','#e8845a'][n%6];
        msProp({kind:'book',x:o.x+o.w/2,y:o.y+8,tx:o.x+o.w+8+Math.random()*26,ty:o.y+2+Math.random()*24,k:0,col:c,sortY:-1e6}); if(n>=6) this.done(); },
      tick(dt){ this.t+=dt; if(this.t>12) this.done(); },
      hud(){ msPill(this.label+'  '+n+'/6','#f0c828'); } });
    const g=msWho('grace'); if(g){ await msCome(g,P.x,P.y); await say(msName(g),'Alright, now you get to put them all back!'); bubble(P,'Hahaha!',1200); afterHelp(g); }
    msDone('books'); },
  async phone(){ const d=msWho('nick'); MS.props=MS.props.filter(p=>p.kind!=='phone'); MS.hold='phone'; blip(880,0.05,0.04); bubble(P,'Hello? Gamma?',1400); await wait(900);
    if(!d){ await wait(800); MS.hold=null; msDone('phone'); return; }
    claim(d); for(const k of ['left','right','down']){ d.dir=k; await wait(260); } bubble(d,'Lost my phone again...',1500); await wait(1500); msFaceTo(d,P.x,P.y); bubble(d,'!',600); await wait(500);
    await say('Dad','Hey! Get your grubby nasty paws off my phone!');
    const r=await msChase(d,{start:"I'm gonna get ya!"}); MS.hold=null; if(r!=='tagged'&&r!=='escaped'){ bubble(d,'*takes it back*',1300); await wait(900); } else { bubble(P,'*gives it back*',1300); await wait(900); }
    msDone('phone'); afterHelp(d); },
  async remote(){ MS.props=MS.props.filter(p=>p.kind!=='remote'); MS.hold='remote'; blip(880,0.05,0.04); let n=0; const said=['I want cookie!','Oh oh oh!','I want cookie!','Oh oh oh!'];
    const inRoom=()=>P.x>384&&P.x<466&&P.y>290&&P.y<372;
    await msFree({ id:'remote', label:'Point it at the TV!',
      onA(){ if(!inRoom()) return; P.dir='right'; MS.tv=1+(n%5); bubble(P,said[n%4],1000); blip(500+Math.random()*700,0.06,0.05,'square'); buzz(15); n++; if(n>=4) this.done(); },
      tick(dt){ this.t+=dt; this.label=inRoom()?'Tap A: press buttons!':'Point it at the TV!'; if(this.t>25) this.done(); },
      hud(){ msPill(this.label+(inRoom()?'  '+n+'/4':''),'#b48ae0'); } });
    const d=msWho('nick'); if(d){ const r=await msChase(d,{start:'Give me that remote!'}); if(r==='caught'||r==='hid'){ bubble(d,'*takes the remote*',1300); await wait(900); } afterHelp(d); }
    MS.hold=null; MS.tv=0; msDone('remote'); },
  async rocker(){ const o=OBJ.rockchair, x0=P.x, y0=P.y; blip(400,0.06,0.04,'triangle'); S.noCollide=true; await arcTo(P,o.x+o.w/2,o.y+o.h-7,9,300); P.zBias=30; P.lift=7; P.dir='down'; bubble(P,'Whoa... whoa...',1600);
    let stop=false; (async()=>{ let i=0; while(!stop){ P.x=o.x+o.w/2+Math.sin(i*0.9)*1.6; P.lift=7+Math.abs(Math.sin(i*0.45))*1.5; if(i%7===0) blip(180,0.04,0.03,'sawtooth'); i++; await wait(60); } })();
    const g=msWho('grace'); if(g){ await msCome(g,o.x+o.w/2+16,o.y+o.h+10,92); await say(msName(g),'Down, please.'); } else await wait(2200);
    stop=true; await wait(80); P.zBias=0; P.lift=0; if(g){ P.carry=g; P.lift=9; P.zBias=3; await wait(350); P.carry=null; P.lift=0; P.zBias=0; }
    const q=msFreeNear(x0,y0,g?[g.x,g.y]:null); P.x=q[0]; P.y=q[1]; S.noCollide=false; blip(300,0.05,0.04,'triangle'); if(g) afterHelp(g); msDone('rocker'); },
  async toybin(){ const o=OBJ.toys; blip(260,0.1,0.06,'sawtooth'); S.shake=0.2; buzz(40); const cols=['#c8242c','#3f6bb0','#f0c828','#3f9a4a','#b48ae0','#e8845a','#46c8be']; const toys=[];
    for(let i=0;i<7;i++){ const a=Math.PI*(0.55+i*0.14), r=16+Math.random()*20; toys.push(msProp({kind:'toy',x:o.x+o.w/2,y:o.y+o.h/2,tx:o.x+o.w/2+Math.cos(a)*r*1.3,ty:o.y+o.h/2+Math.sin(a)*r*0.7+4,k:0,col:cols[i],shape:i%3,sortY:-1e6})); }
    bubble(P,'Uh oh!',1100); await wait(700);
    const d=msWho('nick'); if(d){ const t=toys[3]; await msCome(d,t.tx+10,t.ty,80); await walk(d,[[t.tx,t.ty]],40); blip(140,0.12,0.06,'sawtooth'); S.shake=0.15;
      for(let i=0;i<3;i++){ bubble(d,i?'Ow!':'OW!',500); await arcTo(d,d.x,d.y,7,220); } await say('Dad','Every. Single. Time.'); afterHelp(d); }
    msDone('toybin'); },
  async glass(){ const o=OBJ.slider; let n=0;
    await msFree({ id:'glass', label:'Tap A: slap the glass!',
      onA(){ if(!msNear('glass',...probe())) return; n++; blip(160,0.06,0.07,'square'); S.shake=0.08; buzz(20); msProp({kind:'print',x:o.x+6+Math.random()*(o.w-14),y:o.y+8+Math.random()*12,sortY:-1e5}); if(n>=5) this.done(); },
      tick(dt){ this.t+=dt; if(this.t>12) this.done(); },
      hud(){ msPill(this.label+'  '+n+'/5','#8fd0f0'); } });
    const d=msWho('nick'); if(d){ await msCome(d,P.x,P.y+14,92); await say(msName(d),"C'mon little man, don't hit the glass like that!"); await msCarry(d,P.x-34,P.y+34); afterHelp(d); }
    msDone('glass'); },
  async bowl(){ const b=MS_ITEMS.bowl.at; let n=0;
    await msFree({ id:'bowl', label:'Tap A: splash!',
      onA(){ if(!msNear('bowl',...probe())) return; n++; blip(700+Math.random()*300,0.05,0.04,'triangle'); buzz(15); for(let i=0;i<5;i++) msProp({kind:'drop',x:b[0],y:b[1]-2,vx:(Math.random()-0.5)*50,vy:-30-Math.random()*40,life:0.5,sortY:1e6}); if(n>=4) this.done(); },
      tick(dt){ this.t+=dt; if(this.t>12) this.done(); },
      hud(){ msPill(this.label+'  '+n+'/4','#8fd0f0'); } });
    const bw=MS.props.find(p=>p.kind==='bowl'); if(bw) bw.empty=true;
    const v=NPC.vinny; if(v.visible&&!v.lie&&!v.away){ v.follow=false; await walk(v,[msFreeNear(b[0]-18,b[1]+6,[P.x,P.y])],70); msFaceTo(v,b[0],b[1]); await wait(700); msFaceTo(v,P.x,P.y); bubble(v,'...',1200); await wait(1000); }
    const g=msWho('grace'); if(g){ await msCome(g,P.x,P.y,92); await say(msName(g),'Gross!'); const s=OBJ.sink; await msCarry(g,s.x+s.w/2,s.y+s.h+10); g.dir='up'; P.dir='up';
      for(let i=0;i<4;i++){ bubble(g,'*scrub scrub*',500); blip(900,0.04,0.02,'triangle'); await wait(420); } afterHelp(g); }
    msDone('bowl'); },
  async vinny(){ const v=NPC.vinny, x0=P.x, y0=P.y; S.noCollide=true; blip(400,0.06,0.04,'triangle'); const vq=v.perch||{cx:v.x,cy:v.y-3}; v.roam=0; await arcTo(P,vq.cx,vq.cy+5,8,300); P.zBias=(v.zBias||0)+6; P.lift=5; P.lying=true; await wait(600);
    for(const f of [120,105,92,80]){ blip(f,0.22,0.06,'sawtooth'); await wait(210); } bubble(v,'Mmmmrrrrgh.',1500); await wait(1500); bubble(v,'*wag*',700); blip(500,0.05,0.03,'triangle'); await wait(1100);
    v.lie=false; v.sleep=false; blip(200,0.1,0.07,'square'); S.shake=0.25; buzz(60); P.lying=false; const land=msFreeNear(412,332); bubble(P,'Wheeeee!',1300);
    await arcTo(P,land[0],land[1],34,720); P.lift=0; P.zBias=0; S.noCollide=false; S.shake=0.2; blip(120,0.12,0.07,'sawtooth'); buzz(50); for(const d of ['left','up','right','down']){ P.dir=d; await wait(90); }
    bubble(P,'Again! Again!',1400); await wait(900); v.lie=true; v.sleep=true; msDone('vinny'); },
};
// ---------- hooks called by the engine ----------
function msA(){ if(MS.mode){ if(MS.mode.onA) MS.mode.onA(); return true; } if(!msActive()) return false; const f=msFlags(), L=MS_LISTS[msListId()], pr=probe();
  for(const id of L.ids){ if(f[id]||!MS_DO[id]) continue; const it=MS_ITEMS[id]; if(it.obj&&(S.targets||[]).includes(it.obj)) continue; if(msNear(id,pr[0],pr[1])){ msRun(MS_DO[id]); return true; } }
  return false; }
function msTick(dt){ MS.t+=dt; if(MS.mode&&MS.mode.tick) MS.mode.tick(dt);
  for(const p of MS.props){ if(p.kind==='book'||p.kind==='toy'){ if(p.k<1) p.k=Math.min(1,p.k+dt*3); } else if(p.kind==='drop'){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=160*dt; p.life-=dt; } }
  if(MS.props.some(p=>p.kind==='drop'&&p.life<=0)) MS.props=MS.props.filter(p=>!(p.kind==='drop'&&p.life<=0)); }
function msHud(){ if(MS.mode&&MS.mode.hud&&!S.dlg&&!S.menu) MS.mode.hud(); }
function msSetup(){ if(MS.ch===S.chapter+':'+S.map) return; MS.ch=S.chapter+':'+S.map; MS.props=[]; MS.mode=null; MS.hold=null; MS.tv=0; if(!msListId()) return; const f=msFlags();
  if(msListId()==='yard'){ if(!f.ball) msProp({kind:'ball',x:300,y:108,sortY:108}); if(!f.stick) msProp({kind:'stick',x:212,y:262,sortY:262}); msProp({kind:'hose',x:252,y:598,sortY:599}); return; }
  if(!f.phone){ const o=OBJ.ctrS21; msProp({kind:'phone',x:o.x+6,y:o.y+2,sortY:o.y+o.h+1}); }
  if(!f.remote){ const o=OBJ.trunk; msProp({kind:'remote',x:o.x+8,y:o.y+30,sortY:o.y+o.h+1}); }
  msProp({kind:'bowl',x:503,y:139,sortY:161,empty:!!f.bowl,food:false}); }
function msDrawProps(list,ox,oy){ msSetup(); const R=(x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(Math.round(x-ox),Math.round(y-oy),w,h); };
  for(const p of MS.props){ list.push([p.sortY,2,{draw(){
    if(p.kind==='phone'){ R(p.x,p.y,4,7,'#1c1820'); R(p.x+1,p.y+1,2,4,'#6ab8e8'); }
    else if(p.kind==='remote'){ R(p.x,p.y,3,8,'#2c2a33'); R(p.x+1,p.y+1,1,1,'#e8543a'); R(p.x+1,p.y+3,1,1,'#a9a0b8'); R(p.x+1,p.y+5,1,1,'#a9a0b8'); }
    else if(p.kind==='bowl'){ // the feeder's two bowls: water on top (north), food below (south)
      if(!p.empty){ R(p.x-2,p.y-3,4,5,'#5aa8e0'); R(p.x-1,p.y-3,2,1,'#bfe6ff'); } if(p.food){ R(p.x-2,p.y+8,4,5,'#8a5a2c'); R(p.x-1,p.y+9,1,1,'#b07a40'); R(p.x+1,p.y+11,1,1,'#b07a40'); } }
    else if(p.kind==='book'){ const k=p.k, x=p.x+(p.tx-p.x)*k, y=p.y+(p.ty-p.y)*k-Math.sin(k*Math.PI)*10; R(x-3,y-2,6,4,p.col); R(x-3,y-2,1,4,'#f4ead8'); }
    else if(p.kind==='toy'){ const k=p.k, x=p.x+(p.tx-p.x)*k, y=p.y+(p.ty-p.y)*k-Math.sin(k*Math.PI)*12; if(p.shape===0) R(x-2,y-2,4,4,p.col); else if(p.shape===1){ R(x-2,y-1,5,3,p.col); R(x-1,y-2,3,1,p.col); } else { R(x-3,y-1,6,3,p.col); R(x-2,y+2,1,1,'#1c1820'); R(x+1,y+2,1,1,'#1c1820'); } }
    else if(p.kind==='print'){ ctx.globalAlpha=0.55; R(p.x,p.y,3,3,'#f4f8ff'); R(p.x,p.y-2,1,2,'#f4f8ff'); R(p.x+2,p.y-2,1,2,'#f4f8ff'); R(p.x+5,p.y+1,3,3,'#f4f8ff'); R(p.x+5,p.y-1,1,2,'#f4f8ff'); R(p.x+7,p.y-1,1,2,'#f4f8ff'); ctx.globalAlpha=1; }
    else if(p.kind==='drop'){ R(p.x,p.y,2,2,'#8fd0f0'); }
    else if(p.kind==='ball'){ const l=p.lift||0; if(l) R(p.x-2,p.y,4,1,'rgba(0,0,0,0.2)'); R(p.x-2,p.y-3-l,4,4,'#e8d23a'); R(p.x-1,p.y-3-l,2,1,'#fff6a0'); R(p.x-2,p.y-1-l,4,1,'#b8a020'); }
    else if(p.kind==='stick'){ ctx.save(); ctx.translate(Math.round(p.x-ox),Math.round(p.y-oy)); ctx.rotate(-0.4); ctx.fillStyle='#6a4a2a'; ctx.fillRect(-8,-1,16,2); ctx.fillRect(2,-3,1,2); ctx.restore(); }
    else if(p.kind==='hose'){ ctx.strokeStyle='#3f9a4a'; ctx.lineWidth=2; for(let r=3;r<=7;r+=2){ ctx.beginPath(); ctx.arc(p.x-ox,p.y-oy,r,0,7); ctx.stroke(); } R(p.x-1,p.y-12,3,5,'#9aa0aa'); R(p.x-2,p.y-12,5,1,'#6a6f7a'); }
    else if(p.kind==='carrot'){ R(p.x,p.y,2,5,'#e8842a'); R(p.x-1,p.y-2,1,2,'#3f9a4a'); R(p.x+2,p.y-2,1,2,'#3f9a4a'); }
    else if(p.kind==='tp'){ const n=Math.max(1,Math.round(p.pts.length*p.k)); ctx.strokeStyle='#f8f6f0'; ctx.lineWidth=3; ctx.lineJoin='round'; ctx.beginPath(); for(let i=0;i<n;i++){ const q=p.pts[i]; if(i) ctx.lineTo(q[0]-ox,q[1]-oy); else ctx.moveTo(q[0]-ox,q[1]-oy); } ctx.stroke(); ctx.strokeStyle='#d8d4c8'; ctx.lineWidth=1; ctx.stroke(); }
  }}]); }
  // the thing Cam is carrying, and the TV flicker
  if(MS.hold&&P.visible){ list.push([P.y+(P.zBias||0)+0.5,2,{draw(){ const x=P.x+(P.dir==='left'?-6:4), y=P.y-15-(P.lift||0); if(MS.hold==='phone'){ R(x,y,3,6,'#1c1820'); R(x+1,y+1,1,3,'#6ab8e8'); } else if(MS.hold==='ball'){ R(x,y+2,4,4,'#e8d23a'); } else if(MS.hold==='stick'){ R(x-4,y+3,13,2,'#6a4a2a'); } else if(MS.hold==='carrot'){ R(x,y,2,6,'#e8842a'); R(x-1,y-2,1,2,'#3f9a4a'); R(x+2,y-2,1,2,'#3f9a4a'); } else { R(x,y,2,7,'#2c2a33'); R(x,y+1,1,1,'#e8543a'); } }}]); }
  if(MS.tv&&OBJ.tv){ const o=OBJ.tv; list.push([1e6,2,{draw(){ R(o.x+3,o.y+3,o.w-6,o.h-9,['#000','#e8543a','#3f6bb0','#f0c828','#3f9a4a','#b48ae0'][MS.tv]); if(Math.floor(MS.t*12)%2) R(o.x+3,o.y+3+((MS.t*40)%8|0),o.w-6,1,'rgba(255,255,255,0.6)'); }}]); }
  // a sparkle on anything on the list that Cam is near
  if(!MS.mode&&!S.cut&&msActive()){ const f=msFlags(); for(const id of MS_LISTS[msListId()].ids){ if(f[id]||!MS_DO[id]) continue; if(id==='vinny'&&!(NPC.vinny.visible&&NPC.vinny.lie&&NPC.vinny.perch)) continue; const s=msSpot(id); if(!s||Math.hypot(s[0]-P.x,s[1]-P.y)>58) continue;
      list.push([1e6,2,{draw(){ const a=0.45+0.45*Math.sin(MS.t*5+s[0]), x=Math.round(s[0]-ox), y=Math.round(s[1]-oy-8-Math.sin(MS.t*3)*2); ctx.globalAlpha=a; ctx.fillStyle='#ffe98a'; ctx.fillRect(x-1,y-3,2,7); ctx.fillRect(x-3,y-1,7,2); ctx.fillStyle='#fff'; ctx.fillRect(x-1,y-1,2,2); ctx.globalAlpha=1; }}]); } } }
function drawList(){ const lid=msListId(); const W=VW,Hh=VH, x=Math.round(W/2-90), w=180, f=msFlags(), L=lid?MS_LISTS[lid]:null, rows=L?L.ids.length:1, h=Math.min(Hh-20,38+rows*15), y=Math.round((Hh-h)/2);
  U.fillStyle='rgba(8,6,14,0.55)'; U.fillRect(0,0,W,Hh);
  U.save(); U.translate(W/2,Hh/2); U.rotate(-0.012); U.translate(-W/2,-Hh/2);
  U.fillStyle='#fbf3dc'; U.strokeStyle='#2e2838'; U.lineWidth=1.2; U.beginPath(); U.roundRect(x,y,w,h,4); U.fill(); U.stroke();
  U.strokeStyle='rgba(120,160,210,0.35)'; U.lineWidth=0.6; for(let i=0;i<rows;i++){ const ly=y+38+i*15; U.beginPath(); U.moveTo(x+8,ly); U.lineTo(x+w-8,ly); U.stroke(); }
  U.strokeStyle='rgba(220,90,90,0.5)'; U.beginPath(); U.moveTo(x+24,y+4); U.lineTo(x+24,y+h-4); U.stroke();
  const ink='#2a3a6a'; U.textBaseline='top'; U.textAlign='left'; U.fillStyle=ink; U.font='italic bold 11px Georgia,"Times New Roman",serif'; U.fillText("Cam's list"+(L?': '+L.title.toLowerCase():''),x+30,y+8);
  if(!L){ U.font='italic 8px Georgia,serif'; U.fillText('Nothing on the list right now.',x+30,y+28); U.restore(); return; }
  const n=L.ids.filter(k=>f[k]).length; U.textAlign='right'; U.font='italic 8px Georgia,serif'; U.fillText(n+' of '+L.ids.length,x+w-10,y+10); U.textAlign='left';
  L.ids.forEach((id,i)=>{ const ly=y+27+i*15, done=!!f[id], it=MS_ITEMS[id]; U.strokeStyle=ink; U.lineWidth=0.9; U.strokeRect(x+11,ly+1,7,7);
    U.font='italic 8.5px Georgia,"Times New Roman",serif'; U.fillStyle=done?'rgba(42,58,106,0.5)':ink; U.fillText(it.name,x+30,ly);
    if(done){ const tw=U.measureText(it.name).width; U.strokeStyle='rgba(42,58,106,0.6)'; U.lineWidth=0.8; U.beginPath(); U.moveTo(x+29,ly+5); U.lineTo(x+31+tw,ly+4.4); U.stroke(); U.strokeStyle='#c8242c'; U.lineWidth=1.6; U.beginPath(); U.moveTo(x+11,ly+4); U.lineTo(x+14,ly+8); U.lineTo(x+20,ly-1); U.stroke(); }
    else if(it.hint){ const tw=U.measureText(it.name).width; U.font='italic 6px Georgia,serif'; U.fillStyle='rgba(42,58,106,0.55)'; U.fillText('('+it.hint.toLowerCase()+')',x+33+tw,ly+2); } });
  U.restore(); txt(isTouch()?'Tap to close':keyName('a')+': close',W/2,y+h+4,'#f4ead8',7,'center'); }

// ====== the backyard list (Nick's doc: "Backyard list (with Emory)") ======
Object.assign(MS_ITEMS,{
  wrongway:{name:'Go up the slide the wrong way', at:[150,386]},
  hose:{name:'Turn on the hose', at:[252,600]},
  ball:{name:'Throw the ball over the fence', hint:'Find the ball'},
  garden:{name:'Pick something from the garden', at:[343,526]},
  stick:{name:'Chase Vinny with a stick', hint:'Find a stick'},
  dirt:{name:'Taste the dirt', at:[80,626]},
});
const _msNear0=msNear; msNear=function(id,px,py){ if(id==='ball'||id==='stick'){ const p=MS.props.find(q=>q.kind===id&&!q.air); return !!p&&!MS.hold&&Math.hypot(p.x-px,p.y-py)<13; } return _msNear0(id,px,py); };
const _msSpot0=msSpot; msSpot=function(id){ if(id==='ball'||id==='stick'){ const p=MS.props.find(q=>q.kind===id); return p?[p.x,p.y]:null; } return _msSpot0(id); };
function yAdult(e){ claim(e); e.seated=false; e.zBias=0; }
async function ySit(e){ if(!e.chair) return; await walk(e,[[e.chair.x,e.chair.y]],50); e.seated=true; e.dir=e.chair.dir; e.zBias=6; }
Object.assign(MS_DO,{
  async wrongway(){ const e=NPC.emory; claim(e); S.noCollide=true; const top=[134,348], mid=[143,366], bot=[152,386];
    bubble(P,'Up up up!',1000); P.dir='up';
    await walk(e,[[114,356]],70); e.dir='right'; await arcTo(e,top[0],top[1],8,300); e.lift=4; bubble(e,'Wheee!',900);
    const a=arcTo(P,mid[0]+3,mid[1]+3,3,700), b=(async()=>{ e.dir='down'; await arcTo(e,mid[0]-2,mid[1]-3,0,600); })(); await Promise.all([a,b]);
    blip(160,0.12,0.07,'square'); S.shake=0.2; buzz(50); bubble(P,'Oof!',600); bubble(e,'Oof!',600); await wait(350);
    P.lying=true; await Promise.all([arcTo(P,bot[0],bot[1],0,420),arcTo(e,bot[0]+12,bot[1]-2,0,420)]); e.lift=0;
    for(let i=0;i<3;i++){ blip(700+i*90,0.05,0.04,'triangle'); await wait(160); } bubble(P,'Hahaha!',1200); bubble(e,'Again!',1200); await wait(900); P.lying=false; S.noCollide=false; msDone('wrongway'); },
  async hose(){ const r=NPC.ryan, h=MS.props.find(q=>q.kind==='hose'); P.dir='down'; bubble(P,'*squeak squeak*',900); blip(900,0.05,0.04,'square'); await wait(800);
    const end={x:h.x,y:h.y}; let on=true; (async()=>{ let t=0; while(on){ t+=0.06; end.x=h.x+Math.cos(t*5)*26-10; end.y=h.y-26+Math.sin(t*7)*14; for(let i=0;i<3;i++) msProp({kind:'drop',x:end.x,y:end.y,vx:(Math.random()-0.5)*70,vy:-50-Math.random()*40,life:0.55,sortY:1e6}); await wait(60); } })();
    bubble(P,'Whoa!',900); S.shake=0.1; await wait(900);
    if(r.visible){ yAdult(r); bubble(r,'Whoa whoa whoa!',1100); await walk(r,[[h.x+10,h.y-20]],90); r.dir='left'; for(let i=0;i<5;i++){ msProp({kind:'drop',x:r.x,y:r.y-20,vx:(Math.random()-0.5)*60,vy:-30,life:0.5,sortY:1e6}); await wait(80); }
      await say('Ryan','AAAH! Cold cold cold!'); bubble(r,'*turns it off*',1000); on=false; await wait(800); bubble(P,'Hahahaha!',1200); await wait(900); r.dir='left'; await say('Ryan','Thanks for the shower, bud.'); ySit(r); }
    else { await wait(1500); on=false; }
    msDone('hose'); },
  async ball(){ const b=MS.props.find(q=>q.kind==='ball'); MS.props=MS.props.filter(q=>q!==b); MS.hold='ball'; blip(880,0.05,0.04); bubble(P,'Ball!',800);
    let power=0, thrown=false;
    while(!thrown){
      const r=await msFree({ id:'throw', label:'Hold A to wind up, let go to throw!', p:0,
        tick(dt){ this.t+=dt; if(K.a){ this.held=true; this.p=Math.min(1,this.p+dt*0.9); } else if(this.held){ power=this.p; this.done('throw'); } },
        hud(){ msPill(this.label,'#e8d23a'); if(this.held){ const w=60; uRR(VW/2-w/2,52,w,6,3,'rgba(28,24,40,0.85)',CO,0.7); uRR(VW/2-w/2,52,Math.max(3,w*this.p),6,3,this.p>0.55?'#7bd95a':'#ffd23a',null); } } });
      MS.hold=null; P.dir='up'; blip(300+power*500,0.08,0.05,'triangle'); const ball=msProp({kind:'ball',x:P.x,y:P.y-4,lift:6,sortY:1e5,air:true}); const over=power>0.55&&P.y<170;
      const tx=P.x+(Math.random()-0.5)*20, ty=over?8:P.y-30-power*60; const x0=ball.x,y0=ball.y,n=24; for(let i=1;i<=n;i++){ const k=i/n; ball.x=x0+(tx-x0)*k; ball.y=y0+(ty-y0)*k; ball.lift=6+Math.sin(k*Math.PI)*(16+power*20); await wait(30); }
      ball.lift=0; ball.air=false; ball.sortY=ball.y;
      if(!over){ bubble(P,power<0.55?'Uh oh':'Hmm...',900); await wait(500); if(P.y>=170) await say('','Too far from the fence. Get closer and throw harder!'); await msFree({ id:'fetch', onA(){ if(msNear('ball',...probe())) this.done(); }, tick(dt){ this.t+=dt; }, hud(){ msPill('Go get the ball!','#e8d23a'); } }); MS.props=MS.props.filter(q=>q!==ball); MS.hold='ball'; continue; }
      thrown=true; MS.props=MS.props.filter(q=>q!==ball); bubble(P,'Bye ball!',900); await wait(1500);
      const K9=kirbySpawn(Math.max(60,Math.min(480,tx))); K9.dir='down'; K9.bark=S.t+0.4; bubble(K9,'Bark!',900); blip(330,0.12,0.07,'sawtooth'); await wait(900); bubble(K9,'*chomp*',800); await wait(700);
      const back=msProp({kind:'ball',x:K9.x,y:26,lift:4,sortY:1e5,air:true}), bx=P.x+8, by=P.y+6; for(let i=1;i<=22;i++){ const k=i/22; back.x=K9.x+(bx-K9.x)*k; back.y=24+(by-24)*k; back.lift=4+Math.sin(k*Math.PI)*22; await wait(30); } back.lift=0; back.air=false; back.sortY=back.y;
      bubble(P,'Again!',900); K9.wag=true; await wait(600); kMove(K9,K9.x+90,23,110).then(()=>kirbyGone(K9));
      await say('Ryan',"I've never seen a dog throw a ball back before!"); }
    msDone('ball'); },
  async garden(){ const g=NPC.grace; P.dir='up'; for(let i=0;i<2;i++){ bubble(P,'*pull*',500); blip(260+i*60,0.06,0.05,'square'); await arcTo(P,P.x,P.y+1,2,220); }
    blip(700,0.06,0.05,'triangle'); MS.hold='carrot'; bubble(P,'Ta-da!',900); P.dir='down'; await wait(800);
    if(g.visible){ g.dir=faceTo(g,P); await say('Mom','Cam, are you making dinner tonight?'); } bubble(P,'Yeah!',900); await wait(800);
    setTimeout(()=>{ if(MS.hold==='carrot') MS.hold=null; },6000); msDone('garden'); },
  async stick(){ const v=NPC.vinny, s=MS.props.find(q=>q.kind==='stick'); MS.props=MS.props.filter(q=>q!==s); MS.hold='stick'; blip(700,0.05,0.04,'triangle'); bubble(P,'Stick!',800);
    if(!v.visible){ const D=DATA_YARD.objs.find(o=>o.id==='y_slider'); hidden.add('y_slider'); hidden.delete('y_sliderOpen'); v.visible=true; v.lie=false; v.ghost=true; v.x=D.x+D.w/2; v.y=D.y+4; await walk(v,[[v.x,D.y-30]],120); v.ghost=false; crumbs.length=0; v.follow=true; }
    await msFree({ id:'stick', label:'Run at Vinny with the stick!', tick(dt){ this.t+=dt; if(Math.hypot(v.x-P.x,v.y-P.y)<18) this.done(); }, hud(){ msPill(this.label,'#8fd0f0'); } });
    MS.hold=null; v.follow=false; v.dir=faceTo(v,P); bubble(v,'*chomp*',800); blip(240,0.08,0.05,'square'); await wait(600); bubble(P,'Hey!',700); await wait(400); bubble(v,'*play bow*',900); await wait(700);
    const got=await msFree({ id:'vchase', label:'Vinny has the stick! RUN!', limit:7, rep:0,
      tick(dt){ this.t+=dt; this.rep-=dt; if(this.rep<=0){ this.rep=0.35; const p=findPath(v.x,v.y,P.x,P.y); v.path=p&&p.length?p:[[P.x,P.y]]; v.pathSpeed=58; v.hold=false; } if(Math.hypot(v.x-P.x,v.y-P.y)<12) this.done('caught'); if(this.t>this.limit) this.done('safe'); },
      hud(){ msPill(this.label+'  '+Math.max(0,Math.ceil(this.limit-this.t)),'#e8543a'); } });
    v.path=null; v.dir=faceTo(v,P);
    if(got==='caught'){ S.shake=0.12; bubble(v,'*lick lick lick*',1200); bubble(P,'Hahaha!',1200); await wait(1300); } else { bubble(v,'*pant pant*',1200); await wait(1000); bubble(P,'I win!',900); await wait(800); }
    msProp({kind:'stick',x:v.x+6,y:v.y+2,sortY:v.y+2,done:true}); crumbs.length=0; v.follow=true; msDone('stick'); },
  async dirt(){ const e=NPC.emory, n=NPC.nick; claim(e); P.dir='down'; bubble(P,'*nom nom*',1000); for(let i=0;i<2;i++){ blip(300,0.05,0.04,'square'); await wait(250); } await wait(400);
    await walk(e,[[P.x+14,P.y-4]],80); e.dir='left'; await say('Emory','Ewww!'); bubble(e,'...',700); await wait(700); bubble(e,'*nom*',900); blip(320,0.05,0.04,'square'); await wait(900);
    if(n.visible){ n.dir=faceTo(n,P); await say('Dad','That better just be dirt...'); } bubble(P,'Hehe!',800); bubble(e,'Hehe!',800); await wait(800); msDone('dirt'); },
});
