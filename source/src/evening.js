// ================= Chapter 6: Emory is here =================
// End of the basement: Mom calls down, Cam hops off the kit and climbs the stairs.
async function emoryIsHere(){
  const n=NPC.nick, v=NPC.vinny; S.goal=''; S.targets=[]; S.tick=null; S.hud=null;
  for(let i=0;i<2;i++){ blip(170,0.05,0.05,'triangle'); await wait(220); } blip(260,0.12,0.06,'triangle'); await wait(500);
  S.tip={txt:'From the top of the stairs:',until:S.t+2.2};
  await say('Mom','Cam! Emory is here!',{noFace:true});
  P.dir='up'; bubble(P,'!!!',900); jingle([784,988,1175,1568],0.07,'triangle',0.06); await wait(800);
  for(let i=0;i<3;i++){ for(const l of [6,9,11,9,6,4]){ P.lift=l; await wait(40); } } P.lift=4;
  bubble(P,'Yeah!!!',1300); await wait(700);
  // pops off the kit
  S.noCollide=true; for(const l of [7,10,8,4,0]){ P.lift=l; P.x+=2.6; P.y+=1.2; await wait(55); } P.lift=0; P.zBias=0; blip(300,0.06,0.05,'triangle'); await wait(250);
  if(v.visible){ v.follow=false; v.lie=false; walk(v,[[240,196],BS.top],110).then(()=>{ v.visible=false; }); }
  await say('Dad','Go on up, little dude. I\'m right behind you.');
  await walk(P,[[262,300],[244,214],[BS.top[0],BS.top[1]+92]],40); P.dir='up';
  n.seated=false; walk(n,[[262,300],[250,222]],40);
  // slowly, one step at a time
  for(let i=0;i<5;i++){ await walk(P,[[BS.top[0],BS.top[1]+92-(i+1)*16]],18); blip(120+i*10,0.07,0.06,'triangle'); if(i===2) bubble(P,'Up. Up.',1100); await wait(480); }
  walk(n,[[BS.top[0]+6,BS.top[1]+70]],30);
  await fadeTo(1,800); n.path=null; P.path=null; S.noCollide=false;
  await chapter6();
}
const EV={cam:[tx(25),ty(8)+2],emory:[tx(26)+6,ty(10)],ryan:[tx(28)+4,ty(10)-2],lizz:[tx(30),ty(10)+2],grace:[tx(27),ty(11)+6],nick:[394,162]};
function spinPair(a,b,turns){ return (async()=>{ const D=['down','left','up','right']; for(let i=0;i<turns*4;i++){ a.dir=D[i%4]; b.dir=D[(i+2)%4]; a.lift=b.lift=(i%2?3:1); if(i%2===0) blip(700+((i*90)%500),0.04,0.04,'triangle'); await wait(85); } a.lift=b.lift=0; })(); }
async function chapter6(){
  const n=NPC.nick, g=NPC.grace, v=NPC.vinny, r=NPC.ryan, l=NPC.lizz, e=NPC.emory;
  claim(n); claim(g); v.follow=false; v.path=null; v.lie=false; v.sleep=false; S.vinTok=(S.vinTok||0)+1;
  setMap('house'); S.chapter=6; S.clock='3:00 PM'; S.light='day'; S.glows=[]; S.goal=''; S.targets=[]; S.extra=[]; S.bounds=null; S.camFocus=null; S.tick=null; S.hud=null; S.flags.yard=false; save();
  hidden.delete('slider'); hidden.add('sliderOpen'); hidden.add('bsmtdoor'); tvOn(false);
  for(const [k,x] of [['ryan',r],['lizz',l],['emory',e],['grace',g]]){ x.visible=true; x.seated=false; x.path=null; x.x=EV[k][0]; x.y=EV[k][1]; }
  r.dir='down'; l.dir='left'; g.dir='right'; e.dir='up'; n.visible=false; n.seated=false; n.onCouch=false;
  v.visible=true; v.x=392; v.y=208; v.dir='right';
  P.visible=true; P.lift=0; P.zBias=0; P.carry=null; P.sit=0; P.lying=false; P.x=tx(14)-2; P.y=ty(5)+30; P.dir='up'; S.snapCam=true; S.noCollide=true;
  await fadeTo(0,700);
  // up the last steps and out the basement door
  for(let i=0;i<3;i++){ await walk(P,[[tx(14)-2,ty(5)+30-(i+1)*9]],18); blip(150+i*10,0.07,0.06,'triangle'); await wait(380); }
  await walk(P,[[tx(14)-2,ty(4)+2]],30); S.noCollide=false;
  n.visible=true; n.x=tx(14); n.y=ty(6); n.dir='up'; walk(n,[[tx(14),ty(4)+2],[tx(15),ty(4)]],36).then(()=>{ hidden.delete('bsmtdoor'); blip(200,0.1,0.05,'triangle'); });
  bubble(g,'There he is!',1400); await wait(500);
  await walk(P,[[tx(17),ty(4)+2],[tx(20),ty(7)+2],EV.cam],46); P.dir='down';
  walk(n,[EV.nick],44).then(()=>{ n.dir='right'; });
  // they see each other
  await wait(300); e.dir='up'; bubble(e,'!',700); bubble(P,'!',700); blip(900,0.08,0.05,'triangle'); await wait(750);
  bubble(e,'Cam!!',1300); await wait(500); await walk(e,[[P.x+13,P.y+10]],80); e.dir='left'; P.dir='right';
  jingle([784,988,1175,1568],0.07,'triangle',0.06); await spinPair(P,e,3);
  P.dir='right'; e.dir='left'; bubble(P,'Yeah!!!',1200); await hop(P,2); await hop(e,2);
  l.dir=faceTo(l,P); bubble(l,'Hi, Cam!',1200); await wait(700); r.dir=faceTo(r,P); bubble(r,'Hey, bud!',1100); await wait(900);
  while(n.path) await wait(60);
  // the grown-ups drift out of the way of the feeder
  await Promise.all([[l,[436,212]],[r,[412,200]]].map(([x,pt])=>{ const q=msFreeNear(pt[0],pt[1]); const pa=findPath(x.x,x.y,q[0],q[1]); return walk(x,pa||[q],40).then(()=>{ x.dir=faceTo(x,P); }); }));
  await feedVinny(); S.clock='3:10 PM'; save();
  for(const x of [r,l,g]) x.dir=faceTo(x,P); e.path=null;
  if(Math.hypot(e.x-P.x,e.y-P.y)>30){ const q=findPath(e.x,e.y,P.x-12,P.y+6); if(q) await walk(e,q,80); } e.dir=faceTo(e,P);
  r.dir=faceTo(r,P); await say('Ryan','Now go have fun you two, outside!');
  // Emory opens the sliding door and heads out
  bubble(e,'Come on!',1100); await walk(e,[DOOR_SIDE,[DOOR_IN[0],DOOR_IN[1]+2]],76); e.dir='up'; await wait(250);
  slider(true); await wait(400); S.noCollide=true; await walk(e,[[DOOR_IN[0],ty(2)]],50); S.noCollide=false; e.visible=false;
  S.flags.emoryOut=true; save();
  setGoal('Follow Emory outside!',['sliderOpen']);
}
// through the sliding door: the backyard
async function toYard(){
  const e=NPC.emory, n=NPC.nick, g=NPC.grace, r=NPC.ryan, l=NPC.lizz, v=NPC.vinny;
  for(const x of [n,g,r,l,v]){ x.visible=false; x.path=null; x.follow=false; x.seated=false; x.zBias=0; }
  // the grown-ups settle into the deck chairs
  for(const [x,cx,cy,dir] of [[n,497,527,'left'],[g,496,587,'left'],[r,403,511,'down'],[l,390,597,'up']]){ x.chair={x:cx,y:cy+3,dir}; x.visible=true; x.x=cx; x.y=cy+3; x.dir=dir; x.seated=true; x.zBias=6; x.ghost=false; }
  setMap('yard'); S.clock='3:15 PM'; S.light='day'; S.goal=''; S.targets=[]; S.flags.yard=true; save('yard');
  hidden.add('y_slider'); hidden.delete('y_sliderOpen');
  const D=DATA_YARD.objs.find(o=>o.id==='y_slider'), dx=D.x+D.w/2;
  P.x=dx; P.y=D.y-6; P.dir='up'; P.lift=0; P.zBias=0; S.snapCam=true;
  e.visible=true; e.path=null; e.x=dx-34; e.y=D.y-40; e.dir='down';
  await fadeTo(0,600);
  await walk(P,[[dx,D.y-22]],36); bubble(P,'Wooooow',1300); await wait(700);
  bubble(e,'Cam! This way!',1400); await wait(900);
  yardEmory(); yardSetup();
  setGoal('That\'s everything built so far. Play in the backyard.');
}
// ---------- backyard extras: Kirby next door, dog poop by the back fence ----------
const YD={poops:[],kirby:null,fence:null,busy:false};
// Kirby, the neighbours' golden retriever: lustrous gold, lighter feathering on the chest, legs, belly and the underside of a level tail,
// short drop ears, dark eyes and nose. About 15% smaller than Vinny.
function drawKirby(k,ox,oy){ const C={o:'#4a2e14',g:'#c98a2c',l:'#e9b85a',d:'#94601e',n:'#1c1414',t:'#e46a78'}; const X=Math.round(k.x-ox), Y=Math.round(k.y-oy);
  const R=(x,y,w,h,c)=>{ ctx.fillStyle=C[c]||c; ctx.fillRect(X+x,Y+y,w,h); }; const step=k.moving?Math.floor(k.anim*1.4)%4:0, lg=[0,1,0,-1][step], wag=Math.round(Math.sin(S.t*14))*(k.moving||k.wag?1:0), mouth=k.bark>S.t;
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(X-9,Y-1,18,2);
  if(k.dir==='left'||k.dir==='right'){ const s=k.dir==='right'?1:-1, M=(x,y,w,h,c)=>R(s>0?x:-x-w,y,w,h,c);
    M(-8,-6+Math.max(0,lg),2,6-Math.max(0,lg),'d'); M(-5,-6+Math.max(0,-lg),2,6-Math.max(0,-lg),'g'); M(3,-6+Math.max(0,-lg),2,6-Math.max(0,-lg),'d'); M(6,-6+Math.max(0,lg),2,6-Math.max(0,lg),'g');
    M(-9,-6,2,2,'l'); M(-10,-13,18,1,'o'); M(-10,-13,1,7,'o'); M(-9,-12,17,6,'g'); M(-9,-12,17,1,'d'); M(-7,-7,13,1,'l'); M(-8,-6,14,1,'o');
    M(-15,-13+wag,6,2,'g'); M(-16,-12+wag,1,1,'g'); M(-14,-11+wag,5,2,'l');
    M(6,-14,4,8,'g'); M(8,-11,3,5,'l'); M(7,-20,7,7,'g'); M(7,-21,6,1,'o'); M(14,-18,4,3,'g'); M(14,-16,4,1,'l'); M(17,-19,2,2,'n'); M(11,-18,1,1,'n'); M(7,-19,3,6,'d'); M(6,-14,1,1,'o');
    if(mouth){ M(14,-15,3,2,'n'); M(15,-14,2,2,'t'); } else if(k.moving) M(15,-15,2,2,'t'); }
  else { const up=k.dir==='up';
    R(-6,-6+Math.max(0,lg),2,6-Math.max(0,lg),'g'); R(4,-6+Math.max(0,-lg),2,6-Math.max(0,-lg),'g'); R(-3,-6,2,6,'d'); R(1,-6,2,6,'d');
    R(-7,-14,14,9,'g'); R(-7,-14,14,1,'o'); R(-5,-9,10,3,'l');
    if(up){ R(-1,-17+wag,2,4,'g'); R(-5,-22,10,7,'g'); R(-6,-20,2,5,'d'); R(4,-20,2,5,'d'); }
    else { R(-5,-23,10,8,'g'); R(-5,-24,10,1,'o'); R(-7,-21,3,6,'d'); R(4,-21,3,6,'d'); R(-3,-19,1,1,'n'); R(2,-19,1,1,'n'); R(-2,-17,4,3,'l'); R(-1,-17,2,1,'n'); if(mouth) R(-1,-15,2,2,'t'); R(-4,-14,8,4,'l'); } }
  if(k.bubble&&S.t<k.bubble.until) drawBubble(k.bubble.txt,k.x-ox,k.y-oy-26); }
// Kirby behind the back fence: spawn, move, bark, leave
function kirbySpawn(x){ const K9=ent({id:'kirby',dog:true,speed:110,name:'Kirby',visible:true}); K9.x=x; K9.y=23; K9.dir='left'; const item={sortY:23,draw(ox,oy){ drawKirby(K9,ox,oy); }}; S.extra.push(item); K9.item=item; YD.kirby=K9; return K9; }
function kirbyGone(K9){ S.extra=S.extra.filter(q=>q!==K9.item); if(YD.kirby===K9) YD.kirby=null; }
function kMove(e,x,y,sp){ return new Promise(r=>{ const tick=setInterval(()=>{ const dx=x-e.x, dy=y-e.y, d=Math.hypot(dx,dy), st=sp*0.03*TS; if(d<=st){ e.x=x; e.y=y; e.moving=false; clearInterval(tick); r(); return; } e.x+=dx/d*st; e.y+=dy/d*st; e.moving=true; e.anim+=0.03*TS*8; if(Math.abs(dx)>Math.abs(dy)) e.dir=dx>0?'right':'left'; else e.dir=dy>0?'down':'up'; },30); }); }
function kirbyAtlas(){ if(YD.atlas) return YD.atlas; const A=IMG.atlas, c=DATA.chars.vinny, cv=document.createElement('canvas'); cv.width=A.width; cv.height=A.height; const x=cv.getContext('2d'); x.drawImage(A,0,0);
  const w=Math.min(48*8,A.width-c.sx), h=Math.min(32*6,A.height-c.sy), im=x.getImageData(c.sx,c.sy,w,h), d=im.data;
  for(let i=0;i<d.length;i+=4){ if(d[i+3]<10) continue; const L=0.3*d[i]+0.59*d[i+1]+0.11*d[i+2]; if(L<30) continue; const k=0.62+0.75*(L/255);
    d[i]=Math.min(255,226*k); d[i+1]=Math.min(255,168*k); d[i+2]=Math.min(255,84*k); }
  x.putImageData(im,c.sx,c.sy); return YD.atlas=cv; }
function fenceOverlay(){ if(YD.fence) return YD.fence; const B=IMG.yard, cv=document.createElement('canvas'); cv.width=B.width; cv.height=34; const x=cv.getContext('2d'); x.drawImage(B,0,0,B.width,34,0,0,B.width,34);
  const im=x.getImageData(0,0,B.width,34), d=im.data; for(let i=0;i<d.length;i+=4){ const L=0.3*d[i]+0.59*d[i+1]+0.11*d[i+2], y=Math.floor(i/4/B.width); if(!(L<70&&y>=10)) d[i+3]=0; } x.putImageData(im,0,0); return YD.fence=cv; }
function yardSetup(){ YD.busy=false; if(S.flags.spout){ hidden.add('y_spout'); hidden.delete('y_spoutDown'); } YD.poops=[]; const rnd=(a,b)=>a+Math.random()*(b-a);
  for(let n=0;n<40&&YD.poops.length<5;n++){ const p={x:rnd(70,470),y:rnd(42,96)}; if(Math.abs(p.x-140)<40&&p.y>300) continue; if(YD.poops.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<50)) continue; if(!boxFree(p.x,p.y,4,2)) continue; YD.poops.push(p); }
  S.extra=(S.extra||[]).filter(it=>!it.yard);
  for(const p of YD.poops) S.extra.push({yard:true,p,get sortY(){ return this.p.y-3; },draw(ox,oy){ if(this.p.gone) return; const x=Math.round(this.p.x-ox), y=Math.round(this.p.y-oy); ctx.fillStyle='#5a3a1e'; ctx.fillRect(x-3,y-1,7,3); ctx.fillRect(x-2,y-3,5,2); ctx.fillRect(x-1,y-5,3,2); ctx.fillStyle='#7a5230'; ctx.fillRect(x-1,y-3,2,1); ctx.fillRect(x-2,y,2,1); if(Math.floor(S.t*2+this.p.x)%3===0){ ctx.fillStyle='rgba(120,140,60,0.6)'; ctx.fillRect(x+3,y-8-(Math.floor(S.t*4)%3),1,2); } }});
  S.extra.push({yard:true,sortY:25.5,draw(ox,oy){ ctx.drawImage(fenceOverlay(),-ox,-oy); }});
  S.tick=yardTick; }
function drawExtra(it,ox,oy){ it.draw(ox,oy); }
function yardTick(dt){ if(S.map!=='yard'||S.cut||YD.busy) return;
  if(!S.flags.dinner&&typeof MS!=='undefined'&&!MS.mode){ const f=msFlags(), n=MS_LISTS.yard.ids.filter(k=>f[k]).length; if(n>=4){ YD.dinT=(YD.dinT||0)+dt; if(YD.dinT>4){ YD.busy=true; S.flags.dinner=true; runYard(dinnerCall); return; } } }
  if(!S.flags.spout&&(P.moving||K.left||K.right||K.up||K.down)){ const o=DATA_YARD.objs.find(q=>q.id==='y_spout'), r=o.solid; if(P.x>r[0]-8&&P.x<r[0]+r[2]+8&&P.y>r[1]-4&&P.y<r[1]+r[3]+8){ YD.busy=true; S.flags.spout=true; runYard(spoutScene); return; } }
  if(!S.flags.kirby&&P.y<78){ YD.busy=true; S.flags.kirby=true; runYard(kirbyScene); return; }
  if(!S.flags.poop) for(const p of YD.poops){ if(!p.gone&&Math.hypot(P.x-p.x,P.y-p.y)<6){ YD.busy=true; S.flags.poop=true; runYard(()=>poopScene(p)); return; } } }
async function runYard(fn){ S.cut=true; try{ await fn(); }catch(e){ console.error(e); } finally{ S.cut=false; YD.busy=false; for(const k in pressed) pressed[k]=false; } }
async function kirbyScene(){ const v=NPC.vinny, K9=kirbySpawn(520);
  const KY=23, VYF=42, mv=(e,x,y,sp)=>new Promise(r=>{ const tick=setInterval(()=>{ const dx=x-e.x, dy=y-e.y, d=Math.hypot(dx,dy), st=sp*0.03*TS; if(d<=st){ e.x=x; e.y=y; e.moving=false; clearInterval(tick); r(); return; } e.x+=dx/d*st; e.y+=dy/d*st; e.moving=true; e.anim+=0.03*TS*8; if(Math.abs(dx)>Math.abs(dy)) e.dir=dx>0?'right':'left'; else e.dir=dy>0?'down':'up'; },30); });
  const bark=(e,t)=>{ if(e===K9) K9.bark=S.t+0.35; bubble(e,t||'Woof!',600); blip(e===K9?330:220,0.12,0.07,'sawtooth'); setTimeout(()=>blip(e===K9?300:200,0.1,0.06,'sawtooth'),140); };
  K9.x=520; K9.y=KY; K9.dir='left'; P.dir='up';
  await mv(K9,Math.max(90,Math.min(470,P.x+30)),KY,120); K9.dir='down'; bark(K9); await wait(500); bark(K9,'Woof woof!'); bubble(P,'Doggy!',1000); await wait(700);
  for(let i=0;i<3;i++){ await mv(K9,K9.x+(i%2?40:-40),KY,140); bark(K9); }
  // Vinny hears him and charges out the back door
  const D=DATA_YARD.objs.find(o=>o.id==='y_slider'); hidden.add('y_slider'); hidden.delete('y_sliderOpen');
  v.visible=true; v.path=null; v.follow=false; v.lie=false; v.sleep=false; v.ghost=true; v.x=D.x+D.w/2; v.y=D.y+4; v.dir='up'; bark(v,'WOOF!');
  S.camFocus={x:(P.x+v.x)/2,y:Math.min(v.y,P.y+120)}; await walk(v,[[v.x,D.y-30],[K9.x+10,VYF]],150); v.ghost=false; S.camFocus=null; bark(v); bark(K9);
  // fence running: both dogs race up and down the fence line, each on its own side
  const xs=[100,330,140,300,180]; for(const x of xs){ const kp=mv(K9,x,KY,135); v.ghost=true; const vp=walk(v,[[x+6,VYF]],132); await Promise.all([kp,vp]); bark(Math.random()<0.5?v:K9); await wait(120); }
  v.ghost=false; K9.dir='down'; v.dir='up'; bubble(K9,'*sniff*',900); bubble(v,'*sniff*',900); await wait(1100);
  bubble(K9,'Woof!',700); await mv(K9,K9.x+60,KY,120); await mv(K9,K9.x+30,KY-30,90); kirbyGone(K9);
  bubble(v,'...',900); await wait(900); v.dir=faceTo(v,P); bubble(P,'Vinny!',1000); await wait(700);
  crumbs.length=0; v.follow=true; }
async function spoutScene(){ P.moving=false; P.path=null; blip(180,0.12,0.07,'square'); setTimeout(()=>blip(120,0.15,0.06,'sawtooth'),90); S.shake=0.25; buzz(60);
  hidden.add('y_spout'); hidden.delete('y_spoutDown'); save();
  const x0=P.x, y0=P.y; P.lying=true; await arcTo(P,x0+4,y0+2,5,220); await wait(300);
  bubble(P,'Waaaah!',1200); for(const f of [520,470,420]){ blip(f,0.18,0.05,'triangle'); await wait(260); } await wait(500);
  P.lying=false; P.dir='down'; await wait(250); bubble(P,'Hahaha!',1100); for(let i=0;i<3;i++){ blip(700+i*90,0.05,0.04,'triangle'); await wait(170); } await hop(P,1); }
async function dinnerCall(){ const g=NPC.grace, e=NPC.emory; yAdult(g); claim(e); S.camFocus={x:(P.x+g.x)/2,y:(P.y+g.y)/2}; g.dir=faceTo(g,P);
  await say('Mom',"Who's hungry? Let's all go to Frenchman's!"); bubble(P,'Yeah!!!',1100); bubble(e,'Yay!!',1100); jingle([659,784,988,1319],0.08,'triangle',0.06); await Promise.all([hop(P,2),hop(e,2)]);
  S.camFocus=null; S.fadeText='To be continued'; S.fadeSub='Next: dinner at Frenchman\'s'; await fadeTo(1,1000); await wait(2600); S.fadeText=null; S.fadeSub=null; save('yard'); await fadeTo(0,600); ySit(g); }
async function poopScene(p){ const g=NPC.grace; p.gone=true; blip(140,0.15,0.06,'sawtooth'); buzz(40); P.dir='down'; bubble(P,'Uh oh...',1200); await wait(1100);
  const D=DATA_YARD.objs.find(o=>o.id==='y_slider'); hidden.add('y_slider'); hidden.delete('y_sliderOpen');
  if(g.visible) yAdult(g); else { g.visible=true; g.x=D.x+D.w/2; g.y=D.y+4; } g.path=null; g.follow=false; g.ghost=true; g.dir='up'; S.camFocus={x:(P.x+g.x)/2,y:Math.min(g.y,P.y+130)};
  await walk(g,[[P.x+12,P.y+6]],129); g.ghost=false; S.camFocus=null; g.dir=faceTo(g,P); P.dir=faceTo(P,g);
  await say('Mom','Oh no! Yuck my man!');
  bubble(g,'*shoes off*',1100); blip(400,0.05,0.04,'triangle'); await wait(1100);
  for(let i=0;i<3;i++){ bubble(g,'*scrub scrub*',600); blip(900+i*40,0.04,0.025,'triangle'); await wait(520); }
  bubble(g,'*shoes back on*',1100); await wait(1000); bubble(P,'Hehe!',900); await wait(600);
  // she picks up the rest while Cam plays
  S.cut=false; (async()=>{ g.ghost=true; for(const q of YD.poops){ if(q.gone) continue; await walk(g,[[q.x+8,q.y+4]],70); g.dir='left'; bubble(g,'*scoop*',800); blip(300,0.06,0.04,'triangle'); await wait(700); q.gone=true; }
    bubble(g,'All clean!',1000); await wait(800); g.ghost=false; if(g.chair) await ySit(g); else g.visible=false; })();
  S.cut=true; }
function yardEmory(){
  const e=NPC.emory, tok=S.yardTok=(S.yardTok||0)+1, PTS=[[330,560],[200,450],[150,300],[320,220],[420,380],[250,330],[100,440],[440,460],[170,560]];
  (async()=>{ let i=0; while(S.yardTok===tok&&S.map==='yard'){
      if(S.lock>0||e.hold){ await wait(300); continue; }
      const p=PTS[(i++*4+Math.floor(Math.random()*3))%PTS.length]; e.running=true; await walk(e,[p],70); e.running=false; if(S.yardTok!==tok) break;
      e.dir=faceTo(e,P); if(Math.random()<0.5) bubble(e,['Cam! Over here!','Can\'t catch me!','Come on, Cam!'][i%3],1300); await wait(1400+Math.random()*1800); } })();
}
CH[6]={
  slider: async()=>{ if(!S.flags.emoryOut) return; S.goal=''; S.targets=[];
    S.noCollide=true; await walk(P,[[DOOR_IN[0],DOOR_IN[1]+2]],40); P.dir='up'; await wait(150); walk(P,[[DOOR_IN[0],ty(2)]],36); await fadeTo(1,600); P.path=null; S.noCollide=false;
    await toYard(); },
  npc_ryan: async()=>{ await say('Ryan','Outside, you two! Go on!'); },
  npc_lizz: async()=>{ bubble(NPC.lizz,'Hi, Cam!',1200); await wait(900); },
  npc_grace: async()=>{ await say('Mom','Go on, bud. Emory\'s waiting for you out back.'); },
  npc_nick: async()=>{ await say('Dad','Go get her, dude.'); },
  npc_vinny: async()=>{ bubble(NPC.vinny,'*lick*',900); blip(240,0.08,0.05,'square'); await wait(600); },
  npc_emory: async()=>{ const e=NPC.emory; claim(e); e.dir=faceTo(e,P); bubble(P,'Emory!',1000); await wait(300); await walk(P,[[e.x+(P.x<e.x?-10:10),e.y]],70); P.dir=faceTo(P,e); e.dir=faceTo(e,P); bubble(e,'Cam!!',900); blip(900,0.06,0.05,'triangle'); await Promise.all([hop(P,1),hop(e,1)]); bubble(P,'*hug*',1000); bubble(e,'*hug*',1000); await wait(1100); },
  bsmtdoor: async()=>{ await say('Dad','Drums later, dude. Emory\'s here.'); },
  y_slide: async()=>{ const o=DATA_YARD.objs.find(q=>q.id==='y_slide'); S.noCollide=true;
    await walk(P,[[o.x-5,o.y+16]],40); P.dir='right'; P.zBias=40;
    for(let i=0;i<4;i++){ P.x+=3.5; P.y-=1.5; P.lift=3+i*2.5; blip(200+i*40,0.05,0.04,'triangle'); await wait(260); }
    P.dir='down'; await wait(300);
    const c=await choose('',['Go down the slide','Shake it!']);
    if(c===1){ const n=NPC.nick, D=DATA_YARD.objs.find(q=>q.id==='y_slider'), px=P.x;
      for(let i=0;i<10;i++){ P.x=px+(i%2?2:-2); S.shake=0.12; blip(160+(i%3)*30,0.06,0.05,'sawtooth'); if(i===2) bubble(P,'Hehehe!',900); await wait(110); } P.x=px;
      if(n.visible){ yAdult(n); } else { hidden.add('y_slider'); hidden.delete('y_sliderOpen'); n.visible=true; n.x=D.x+D.w/2; n.y=D.y+4; } n.path=null; S.camFocus={x:(P.x+n.x)/2,y:(P.y+n.y)/2-20};
      await walk(n,[[n.x-20,n.y-20]],84); n.dir=faceTo(n,P);
      await say('Dad','Hey dude! Be careful!');
      bubble(P,'Hahahaha!',1300); for(let i=0;i<3;i++){ blip(700+i*90,0.05,0.04,'triangle'); await wait(180); } await wait(600);
      bubble(n,'*shakes head*',1000); await wait(700); S.camFocus=null; if(n.chair) ySit(n); else walk(n,[[D.x+D.w/2,D.y+4]],50).then(()=>{ n.visible=false; }); }
    bubble(P,'Whoaaaa!',1100); await wait(900);
    const x0=P.x,y0=P.y,l0=P.lift; for(let i=1;i<=12;i++){ const k=i/12; P.x=x0+k*20; P.y=y0+k*28; P.lift=l0*(1-k); if(i%3===0) blip(900-i*40,0.04,0.04,'triangle'); await wait(35); }
    P.lift=0; P.zBias=0; await walk(P,[[P.x+4,P.y+8]],50); S.noCollide=false; bubble(P,'Yeah!',1100); jingle([784,988,1175],0.07,'triangle',0.05); await hop(P,1); },
  y_gate: async()=>{ await say('','The gate to the driveway. Latched, and the latch is way up high.'); },
  y_backdoor: async()=>{ await say('','The back door. Closed.'); },
  y_slider: async()=>{ S.fadeText='To be continued'; S.fadeSub=''; await fadeTo(1,1200); await wait(2400); S.fadeText=null; S.fadeSub=null; await fadeTo(0,600); },
};
