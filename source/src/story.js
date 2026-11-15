'use strict';
const tx=(x)=>x*16+8, ty=(y)=>y*16+12;
// ====== flavor text for things around the house (any chapter) ======
const H={
  _nothing: async()=>{ const b=['Ba!','Da?','Hmm.','Uh?','Ooh.']; bubble(P,b[Math.floor(Math.random()*b.length)],900); },
  door: async()=>{ await say('','The door is shut. The handle is way, way up there.'); },
  door_bath: async()=>{ if(S.bathUser===NPC.grace){ blip(240,0.06,0.05,'triangle'); await say('Mom','Just a minute, sweetie!',{noFace:1}); } else if(S.flags.nickPoop||S.bathUser===NPC.nick){ blip(240,0.06,0.05,'triangle'); await say('Dad','Sorry dude, I\'m poopin!',{noFace:1}); } else return H.door(); },
  crib: async()=>{ await say('','The crib. Monkey is in there, waiting for nap time.'); },
  whitenoise: async()=>{ await say('','The sound machine. It makes the shhhhh at night.'); },
  glider: async()=>{ await say('','The big gray rocking chair. Where the bottles and the books happen.'); },
  futon: async()=>{ await say('','The futon. Excellent for climbing, terrible for landing.'); },
  changing: async()=>changeClothes(),
  books: async()=>{ await say('','Books! Most of them have been chewed a little.'); },
  shower: async()=>{ await say('','The tub. Bath time is later. Much later.'); },
  toilet: async()=>{ await say('','The big potty. Not yet, buddy.'); },
  vanity: async()=>{ await say('','Too high to see anything but cabinet doors.'); },
  sidedoor: async()=>{ await say('','The side door out to the deck. Locked.'); },
  bsmtdoor: async()=>{ await say('','The basement door. Shut tight. The stairs are steep, and Dad\'s drums are down there somewhere.'); bubble(P,'Oh oh oh?',1400); },
  linen: async()=>{ await say('','A closet. Towels, probably. The knob is too high.'); },
  closet: async()=>{ await say('','Mom and Dad\'s closet. Shoes on the floor. Tempting.'); },
  cabinet: async()=>{
    if(!S.flags.spoon){ S.flags.spoon=true; blip(180,0.25,0.07,'sawtooth'); S.shake=0.25;
      await say('','Cam opens the cabinet. Pots! Pans! A lid rolls across the floor!');
      await say('','Down at the bottom, there\'s a wooden spoon.'); give('spoon');
      if(NPC.nick.visible) await say('Dad','Aaand there go the pots. Keep the spoon, bud.');
    } else { blip(170,0.2,0.06,'sawtooth'); S.shake=0.15; await say('','Clang. Clang clang. CLANG.'); }
  },
  counter: async()=>{ await say('','The counter. Everything good is up there.'); },
  sink: async()=>{ await say('','The sink. Cam can hear it but can\'t see it.'); },
  fridge: async()=>{ await say('','The fridge. Magnets and pictures all over it.'); },
  pantry: async()=>{ await say('','The pantry. Snacks live here. All of them out of reach.'); },
  coffee: async()=>{ await say('','The coffee maker. That one\'s Mom\'s.'); },
  cart: async()=>{ await say('','The rolling cart. There\'s a pumpkin on it.'); },
  bar: async()=>{ await say('','The bar. Breakfast happens on the other side, up on the stools.'); },
  stove: async()=>{ await say('','Hot! No no no.'); },
  stool: async()=>{ await say('','A tall stool. Cam needs a boost to get up there.'); },
  slider: async()=>{ await say('','The sliding door. The deck and the backyard are out there. Locked for now.'); },
  table: async()=>{ await say('','The dining table. Under it is a great fort.'); },
  shelves: async()=>{ await say('','Shelves full of stuff Cam isn\'t supposed to touch.'); },
  cubbies: async()=>{ await say('','The cubbies. Shoes, books, baskets, and one lonely sock.'); },
  hooks: async()=>{ await say('','Coats and bags. Cam\'s little green coat is up there.'); },
  frontdoor: async()=>{ await say('','The front door. Outside is for later.'); },
  flag: async()=>{ await say('','The House Divided flag. Packers on one side, Vikings on the other.'); },
  sofa: async()=>{ await say('','The couch. Prime real estate for Cookie. Also for Vinny.'); },
  ottoman: async()=>{ await say('','Soft and fuzzy. Good for face-planting.'); },
  ctable: async(o)=>{ if(o&&P.x<o.x+2&&S.chapter>=2&&!S.bounds&&S.map!=='park') return climbChest(o); await say('','The big wooden chest behind the couch. Exactly forehead height.'); },
  fireplace: async()=>{ await say('','The fireplace. Look, don\'t touch.'); },
  dogbed: async()=>{ await say('','Vinny\'s bed, right on the warm tiles.'); },
  toys: async()=>{ blip(660,0.1,0.05,'triangle'); setTimeout(()=>blip(880,0.1,0.05,'triangle'),120); await say('','The DJ piano. Lights, buttons, and a little record that spins.'); },
  elephant: async()=>{ await say('','Elephant has the good chair. He always gets the good chair.'); },
  sc_guitar: async()=>{ jingle([330,392,494],0.07,'square',0.04); await say('','The red guitar. Every button is the loud button.'); },
  sc_fishtoy: async()=>{ await say('','The fish ball drop. Ball goes in the top. Ball comes out the bottom. Again.'); },
  sc_cube: async()=>{ await say('','The bead cube. Slide the beads up, watch them slide back down.'); },
  sc_plane: async()=>{ await say('','The airplane you can sit on. It has a steering wheel and many opinions.'); },
  sc_truck: async()=>{ await say('','A monster truck. Vroom.'); },
  sc_books: async()=>{ await say('','A pile of board books. Corners pre-chewed.'); },
  sc_giraffe: async()=>{ await say('','Giraffe. Usually on the little chair. Not today.'); },
  sc_cup: async()=>{ await say('','An orange cup with a cat face drawn on it.'); },
  sc_blocks: async()=>{ await say('','Blocks. Mostly for knocking over.'); },
  sc_ball: async()=>{ bubble(P,'Ball!',1000); },
  tv: async()=>{ bubble(P,'Cookie?',1400); await wait(600); await say('','The TV is off. Cookie will have to wait.'); },
  bigbed: async()=>{ await say('','Mom and Dad\'s bed. Still warm. Good for jumping, when nobody\'s looking.'); },
  dresser: async()=>{ await say('','A dresser. The bottom drawer opens. The top ones are a mystery.'); },
  desk: async()=>{ await say('','Mom\'s work desk. Lots of buttons. All of them off-limits.'); },
  sparebed: async()=>{ await say('','The spare bed, with the purple checkered quilt.'); },
  npc_vinny: async()=>{ bubble(NPC.vinny,'*wag wag*'); await say('','Vinny leans his whole weight on Cam. Cam leans back.'); },
  npc_grace: async()=>{ await say('Mom','Hi, sweet boy.'); },
  npc_nick: async()=>{ await say('Dad','Hey, bud.'); },
};
function cribFront(on){
  const c=OBJ.cribRail;
  S.extra=(S.extra||[]).filter(e=>e.id!=='cribfront');
  if(on) S.extra.push({id:'cribfront',sortY:c.sortY+30,draw:(ox,oy)=>{ ctx.drawImage(IMG.atlas,c.sx,c.sy,c.w,c.h,Math.round(c.x-ox),Math.round(c.y-oy),c.w,c.h); }});
  P.zBias=on?16:0;
}
async function arcTo(e,x,y,h=10,ms=330){ const x0=e.x,y0=e.y,l0=e.lift||0,n=Math.max(4,Math.round(ms/30)); for(let i=1;i<=n;i++){ const k=i/n; e.x=x0+(x-x0)*k; e.y=y0+(y-y0)*k; e.lift=l0+Math.sin(k*Math.PI)*h; await wait(30); } e.lift=l0; }
// ----- the chest behind the couch: climb up, jump onto the couch, crawl off -----
async function climbChest(o){
  const cy=Math.max(o.y+16,Math.min(o.y+o.h-12,P.y)); const sofa=OBJ.sofaLeft;
  S.noCollide=true; P.dir='right'; bubble(P,'Up!',800); blip(500,0.06,0.04,'triangle');
  P.zBias=120; await arcTo(P,o.x+11,cy,9,380); P.lift=5; P.dir='down';
  bubble(P,'Hee hee hee!',1400); blip(1000,0.08,0.05,'triangle'); setTimeout(()=>blip(1150,0.08,0.05,'triangle'),140);
  for(let i=0;i<2;i++){ for(const l of [7,9,7,5]){ P.lift=l; await wait(55); } }
  await wait(500);
  const c=await choose('Cam is standing on top of the chest.',['Jump onto the couch!','Climb back down']);
  if(c===0){
    P.dir='right'; blip(620,0.1,0.05,'triangle'); await arcTo(P,sofa.x+13,cy,12,420); P.lift=2;
    P.sit=1.3; P.fallDir=1; S.shake=0.16; blip(110,0.14,0.07,'sawtooth');
    bubble(P,'Yeah!!!',1500); jingle([784,988,1319],0.07,'triangle',0.05); await wait(1400);
    P.sit=0; P.lying=1; await walk(P,[[sofa.x+sofa.w+3,cy]],16); P.lying=false; P.lift=0;
    await arcTo(P,sofa.x+sofa.w+10,cy+1,3,200); P.dir='down';
  } else { P.lift=0; P.dir='left'; await arcTo(P,o.x-7,cy,6,320); }
  P.lift=0; P.zBias=0; S.noCollide=false;
}
// ----- outfits: pick at the changing table, a parent comes over and does the work -----
function outfitPicker(){
  return new Promise(res=>{ let sel=Math.max(0,OUTFITS.findIndex(o=>o[0]===S.flags.outfit)); const t0=S.t, N=OUTFITS.length;
    const spr=(id,f,x,y,k,a)=>{ const c=DATA.chars['cam_'+id]; U.globalAlpha=a; U.drawImage(IMG.atlas,c.sx+f*16,c.sy+7,16,25,x-8*k,y,16*k,25*k); U.globalAlpha=1; };
    S.mini={ taps(){ const cx=VW/2; return [{x:0,y:0,w:cx-30,h:VH,k:'left'},{x:cx+30,y:0,w:cx-30,h:VH,k:'right'},{x:cx-30,y:0,w:60,h:VH,k:'a'}]; },
      update(dt){ if(hit('left')){ sel=(sel+N-1)%N; blip(700); } if(hit('right')){ sel=(sel+1)%N; blip(700); } hit('up'); hit('down');
        if(hit('a')&&S.t-t0>0.3){ S.mini=null; blip(900,0.03,0.03); res(OUTFITS[sel][0]); } else if(hit('b')){ S.mini=null; res(null); } },
      draw(){ const cx=VW/2, w=Math.min(VW-10,200), x=cx-w/2, y=Math.round(VH/2-60); box(x,y,w,120,'rgba(24,20,36,0.96)','#ffd98a');
        txt('What should Cam wear?',cx,y+6,'#ffd98a',8,'center',true);
        U.fillStyle='#3b2f5a'; U.fillRect(cx-28,y+20,56,72); U.strokeStyle='#ffd98a'; U.lineWidth=1; U.strokeRect(cx-27.5,y+20.5,55,71);
        spr(OUTFITS[sel][0],[3,0,1,2][Math.floor((S.t-t0)*1.3)%4],cx,y+22,2.7,1);
        spr(OUTFITS[(sel+N-1)%N][0],3,cx-58,y+44,1.5,0.45); spr(OUTFITS[(sel+1)%N][0],3,cx+58,y+44,1.5,0.45);
        txt('◀',cx-84,y+56,'#ffd98a',9,'center'); txt('▶',cx+84,y+56,'#ffd98a',9,'center');
        txt(OUTFITS[sel][1]+(OUTFITS[sel][0]===S.flags.outfit?'  (wearing it)':''),cx,y+95,'#f4ead8',7.5,'center',true);
        txt(isTouch()?'tap ◀ ▶ to look     tap the outfit to wear it':'◀ ▶ pick     '+keyName('a')+': wear it     '+keyName('b')+': never mind',cx,y+107,'#a9a0b8',6,'center'); } };
  });
}
const OUTFIT_LINES={pj:'Jammies. Bold choice for daytime.',dino:'Rawr. Dinosaur shirt it is.',jacket:'The puffy jacket. Are you cold, bud?',fuzzy:'The blue fuzzy suit. You look very soft.',orange:'The Halloween shirt. It\'s always Halloween somewhere.',sweats:'Packers sweats. Good man.',bibs:'Snow bibs. Inside. Okay.',cozy:'The cozy sweatshirt.',gold:'Go Pack Go.',polo:'Stripes. Very sharp.',vikes:'The Vikings jersey. ...Mom picked that one out.'};
function pickHelper(){
  const ok=e=>e.visible&&!e.follow&&!e.ghost&&!P.carry&&!e.inBath&&!e.away&&e!==S.doorHelper;
  const c=[]; if(ok(NPC.nick)&&!S.flags.nickPoop) c.push(NPC.nick); if(ok(NPC.grace)&&!S.cleaning) c.push(NPC.grace);
  c.sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y)); return c[0]||null;
}
function homeRoute(back){   // from the living-room hub to a standing spot
  const inKitchen=back.x<tx(23)+10&&back.y<ty(9); return (inKitchen?[[tx(25),ty(9)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)]]:[]).concat([[back.x,back.y]]);
}
async function swapOutfit(id){ for(let i=0;i<5;i++){ P.lift=9+(i%2?2:0); blip(420+i*40,0.04,0.03,'triangle'); await wait(170); } P.lift=9;
  S.flags.outfit=id; P.sheet=camSheet(); jingle([659,784,988,1319],0.08,'triangle',0.05); save(); await wait(450); }
async function changeClothes(){
  if(S.chapter<2||S.bounds){ await say('','The changing table. Cam would rather not.'); return; }
  const e=pickHelper();
  if(!e){ await say('','The changing table. Nobody is free to help with clothes right now.'); return; }
  const id=await outfitPicker(); if(!id) return;
  if(id===S.flags.outfit){ await say('','Cam is already wearing that.'); return; }
  claim(e); S.busyHelper=e; S.noCollide=true; doors.cam=true;
  bubble(P,e===NPC.nick?'Dada!':'Mama!',1100); blip(900,0.1,0.05,'triangle'); await wait(500);
  if(!(e.x<tx(8)+8&&e.y<ty(9)+8)) await navTo(e,'CR',96);
  await walk(e,[[P.x+13,P.y]],80); e.dir='left';
  await say(e.name,'New outfit? Okay. Up you go.');
  P.carry=e; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(350);
  await walk(e,[[tx(4)+4,ty(7)+2]],40); e.dir='down'; await wait(250);
  await swapOutfit(id);
  await say(e.name,OUTFIT_LINES[id]||'There. Very handsome.');
  P.carry=null; P.lift=0; P.zBias=0; P.x=tx(4); P.y=ty(7); P.dir='down'; e.x=tx(5)+8; e.y=ty(7)-2; e.dir='left'; S.noCollide=false; blip(300,0.05,0.04,'triangle');
  S.busyHelper=null; e.node=null; await walk(e,[[tx(6),ty(7)+6]],50); afterHelp(e);
}
function slider(open){ if(open){ hidden.add('slider'); hidden.delete('sliderOpen'); } else { hidden.delete('slider'); hidden.add('sliderOpen'); } blip(open?260:200,0.12,0.05,'triangle'); }
const CRIB=[48,72], CRIB_BOUNDS=[41,68,57,74], CRIB_SIDE=[44,94], NOISE_VOL=0.11;
// ====== getting around the house, and what Mom and Dad do when nobody needs them ======
const NAV={K1:[21,5],K2:[21,7],K3:[23,7],D1:[25,8],SL:[25,4],HUB:[28,12],HALL:[18,12.3],BH:[10,12.2],BR:[10,8],TOI:[11.2,4.3],CD:[7,12.2],CR:[7,8],L1:[28,19],L2:[24.7,19.6],KW:[18,4.3],EN:[15,4.2],GK:[22,4],NK:[20.4,4],TB:[26,6]};
const NAVE=[['K1','K2'],['K2','K3'],['K3','D1'],['D1','SL'],['D1','HUB'],['HUB','HALL'],['HALL','BH'],['BH','BR'],['BR','TOI'],['BH','CD'],['CD','CR'],['HUB','L1'],['L1','L2'],['K1','GK'],['K1','NK'],['GK','NK'],['NK','KW'],['KW','EN'],['D1','TB']];
function navPath(a,b){ const prev={[a]:null}, q=[a]; while(q.length){ const n=q.shift(); if(n===b) break; for(const [x,y] of NAVE){ const m=x===n?y:y===n?x:null; if(m&&!(m in prev)){ prev[m]=n; q.push(m); } } }
  const out=[]; for(let n=b;n;n=prev[n]) out.unshift(n); return out; }
function navTo(e,target,speed){
  const pts=[], near=n=>Math.hypot(e.x-tx(NAV[n][0]),e.y-ty(NAV[n][1])); let from=e.node;
  if(!from||near(from)>14){ from=null; for(const n in NAV) if(near(n)<14&&(!from||near(n)<near(from))) from=n;
    if(!from){ for(const p of routeToHub(e)) pts.push(p); from='HUB'; } }
  for(const n of navPath(from,target)) pts.push([tx(NAV[n][0]),ty(NAV[n][1])]);
  return walk(e,pts,speed||44).then(()=>{ e.node=target; });
}
// take a parent out of whatever they were idly doing so a scene can use them
function claim(e){
  e.amb=(e.amb||0)+1; e.path=null; e.moving=false; e.hold=false;
  if(e.inBath){ e.inBath=false; if(S.bathUser===e){ S.bathUser=null; doors.bath=true; } e.x=tx(10); e.y=ty(11); e.node=null; }
  if(e.away){ e.visible=true; if(e.away==='down'){ hidden.delete('bsmtdoor'); e.x=tx(15); e.y=ty(4.2); } else { hidden.delete('slider'); hidden.add('sliderOpen'); e.x=DOOR_IN[0]; e.y=DOOR_IN[1]+8; } e.away=null; e.node=null; }
  if(e.onCouch){ e.onCouch=false; e.x=OBJ.sofaLeft.x+OBJ.sofaLeft.w+10; e.node=null; }
  e.zBias=0; e.noBlock=false; e.lift=0;
}
async function ambient(e){
  claim(e); const my=e.amb, ok=()=>e.amb===my; const camNear=(d=150)=>Math.hypot(P.x-e.x,P.y-e.y)<d;
  const w=async ms=>{ const t=S.t+ms/1000; while(S.t<t){ await wait(120); if(!ok()) throw 0; } };
  const go=async(n,sp)=>{ await navTo(e,n,sp); if(!ok()) throw 0; while(e.hold){ await wait(120); if(!ok()) throw 0; } if(e.path===null&&Math.hypot(e.x-tx(NAV[n][0]),e.y-ty(NAV[n][1]))>3) return go(n,sp); };
  const wk=async(pts,sp)=>{ await walk(e,pts,sp||44); if(!ok()) throw 0; };
  const R=(a,b)=>a+Math.random()*(b-a), isNick=e===NPC.nick, other=isNick?NPC.grace:NPC.nick;
  const camInBath=()=>P.x>tx(8)+8&&P.x<tx(13)+8&&P.y<ty(11);
  try{
    await w(R(500,1800));
    while(true){
      let opts=['kitchen','couch','clean','kitchen'];
      if(S.chapter!==2) opts.push('bath','down','out','couch');
      if(S.bathUser||camInBath()) opts=opts.filter(o=>o!=='bath');
      if(other.away||['down','out','bath'].includes(other.lastAct)||!e.lastAct) opts=opts.filter(o=>o!=='down'&&o!=='out'&&o!=='bath');
      opts=opts.filter(o=>o!==e.lastAct); const a=opts[Math.floor(Math.random()*opts.length)]; e.lastAct=a;
      if(a==='kitchen'){ await go(isNick?'NK':'GK'); e.dir='up'; await w(R(6000,12000)); }
      else if(a==='couch'){ const sofa=OBJ.sofaLeft, sy=isNick?318:346; await go('L2'); await wk([[sofa.x+sofa.w+10,sy]]);
        e.dir='left'; await arcTo(e,sofa.x+13,sy,3,220); if(!ok()) throw 0; e.dir='right'; e.zBias=90; e.noBlock=true; e.onCouch=true;
        await w(R(9000,16000)); e.onCouch=false; await arcTo(e,sofa.x+sofa.w+10,sy,3,220); if(!ok()) throw 0; e.zBias=0; e.noBlock=false; e.node=null; await wk([[tx(NAV.L2[0]),ty(NAV.L2[1])]]); e.node='L2'; }
      else if(a==='clean'){ for(const n of (Math.random()<0.5?['TB','HUB','L1']:['K2','D1','HUB'])){ await go(n); e.dir=Math.random()<0.5?'left':'right'; if(camNear()) bubble(e,isNick?'*picks up toys*':'*tidy tidy*',1200); await w(R(2200,3800)); } }
      else if(a==='bath'){ await go('BR',50); if(S.bathUser||camInBath()) continue; S.bathUser=e; await wk([[tx(NAV.TOI[0]),ty(NAV.TOI[1])]],50); e.node='TOI';
        if(camInBath()){ S.bathUser=null; await go('BH'); continue; }
        e.dir='down'; e.zBias=14; e.noBlock=true; e.inBath=true; doors.bath=false; if(camNear(120)) blip(220,0.08,0.06,'triangle');
        await w(R(9000,15000));
        if(camNear(140)){ for(const f of [520,420,340,260,200]){ blip(f,0.12,0.03,'sawtooth'); await w(90); } }
        doors.bath=true; e.inBath=false; S.bathUser=null; e.zBias=0; e.noBlock=false; await go('BH',50); }
      else if(a==='down'){ await go('EN'); hidden.add('bsmtdoor'); if(camNear(120)) blip(260,0.12,0.05,'triangle'); await wk([[tx(14),ty(4.4)],[tx(14),ty(6)]],36);
        e.visible=false; e.away='down'; hidden.delete('bsmtdoor'); await w(R(9000,16000));
        hidden.add('bsmtdoor'); e.visible=true; await wk([[tx(14),ty(4.4)],[tx(15),ty(4.2)]],36); hidden.delete('bsmtdoor'); e.away=null; e.node='EN'; }
      else if(a==='out'){ await go('SL'); await wk([DOOR_IN]); e.dir='up'; hidden.add('slider'); hidden.delete('sliderOpen'); if(camNear(140)) blip(260,0.12,0.05,'triangle'); await w(350);
        await wk([[DOOR_IN[0],ty(2)]]); e.visible=false; e.away='out'; hidden.delete('slider'); hidden.add('sliderOpen'); await w(R(9000,16000));
        hidden.add('slider'); hidden.delete('sliderOpen'); e.visible=true; e.dir='down'; await wk([DOOR_IN,[tx(25),ty(4)]]); hidden.delete('slider'); hidden.add('sliderOpen'); e.away=null; e.node='SL'; }
      await w(R(800,2500));
    }
  }catch(x){ if(x!==0) throw x; }
}
function afterHelp(e){ if(S.chapter===2&&!S.flags.ch2done){ navTo(e,e===NPC.nick?'NK':'GK',70).then(()=>{ e.dir='up'; }); } else if(S.chapter===4&&S.flags.pmStage<6){ if(e===NPC.grace) navTo(e,'TB',60); } else if(S.chapter===3&&!S.flags.gotMom&&e===NPC.grace){ navTo(e,'HUB',60).then(()=>walk(e,[[tx(25),ty(14)]],50)).then(()=>{ e.dir='left'; }); } else ambient(e); }
// ====== chapters ======
const CH={};
// ----- Chapter 1: 5:30 AM -----
CH[1]={ _nothing: async()=>crib1(), crib: async()=>crib1() };
async function crib1(){
  if(S.flags.stage===0){
    S.flags.stage=1;
    bubble(P,'Mama!',1300); blip(900,0.12,0.05,'triangle'); await wait(1200);
    bubble(P,'Mamaaa!',1500); blip(980,0.18,0.06,'triangle'); await wait(1900);
    blip(1400,0.03,0.05,'square'); await wait(150);
    S.glows.push([24,118,44,0.9,'rgba(120,170,255,0.25)']); noise(NOISE_VOL,3);
    await say('','Click. Somewhere down the hall, Mom finds her phone without opening her eyes. The sound machine turns itself on.');
    await say('','Shhhhhhhhhhhhhhh.');
    setGoal('Snuggle Monkey and go back to sleep. ('+(isTouch()?'Press A':'Press Z or Space')+')');
    S.flags.stage=2;
  } else if(S.flags.stage===2){
    S.flags.stage=3; setGoal('');
    give('monkey'); await wait(500);
    bubble(P,'Monkey.',1200); await wait(1000);
    await say('','Cam grabs Monkey by the ear, flops over, and listens to the shhhhhhh.');
    P.lying=true;
    S.fadeText='Zzz...'; await fadeTo(1,2200); await wait(1200);
    S.flags.ch1done=true; S.chapter=2; save(); S.fadeText=null;
    chapter2();   // not awaited: this handler's lock is released by runHandler
  }
}
async function chapter1(){
  S.chapter=1; S.light='night'; S.clock='5:30 AM'; S.goal=''; S.flags.stage=-1;
  S.glows=[[tx(5)+8,ty(2),56,0.5,'rgba(160,180,255,0.08)']];
  for(const k in NPC) NPC[k].visible=false;
  P.sheet='cam_pj'; [P.x,P.y]=CRIB; P.dir='down'; P.visible=true; cribFront(true);
  S.bounds=CRIB_BOUNDS; S.noCollide=true; S.noFall=true; doors.cam=false;
  S.snapCam=true; noise(0,0.1);
  S.fadeText='Saturday'; S.fadeSub='5:30 AM'; S.fade=1; await wait(1400); S.fadeText=null; S.fadeSub=null; await fadeTo(0,900);
  P.lying=true; bubble(P,'Zzz',1300); await wait(1600);
  if(S.dreamFirst){ S.dreamFirst=false; bubble(P,'Zzz',1300); await wait(900); await dreams(); await wait(300); bubble(P,'Zzz',1100); await wait(1300); }
  P.lying=false; P.dir='down'; blip(300,0.04,0.03,'triangle'); await wait(500);
  for(const d of ['left','right','down']){ P.dir=d; await wait(320); }
  await say('','Cam is awake. It\'s still dark out, and very, very quiet.');
  bubble(P,'Ehh... ehhh...',1300); blip(700,0.2,0.04,'triangle'); await wait(900); blip(760,0.25,0.05,'triangle'); await wait(900);
  bubble(P,'Waaah!',1200); blip(840,0.35,0.06,'triangle'); await wait(1300);
  S.flags.stage=0;
  setGoal('Call for Mama. ('+(isTouch()?'Press A':'Press Z or Space')+')');
}
// ----- Chapter 2: 7:00 AM -----
CH[2]={
  npc_vinny: async()=>{
    const v=NPC.vinny;
    if(!S.flags.vinnyAwake){
      S.flags.vinnyAwake=true; bubble(P,'Vinny Vinny!',1400); await wait(1000);
      v.sleep=false; v.lie=false; v.dir='left'; bubble(v,'Wuff!'); blip(200,0.12,0.07,'square'); await wait(700);
      await say('','Vinny stretches, sniffs Cam\'s whole head, and licks him right on the face.');
      bubble(P,'Hee hee!',1200);
      v.follow=true; crumbs.length=0;
      setGoal('Find Dad in the kitchen.',['npc:nick']);
    } else return H.npc_vinny();
  },
  npc_nick: async()=>{
    const n=NPC.nick, g=NPC.grace;
    if(S.flags.ch2done) return H.npc_nick();
    if(!S.flags.vinnyAwake){ await say('Dad','Hey, buddy! Go wake up Vinny first. He\'s on his bed by the fireplace.'); return; }
    if(!S.flags.metDad){
      S.flags.metDad=true; face(n,faceTo(n,P));
      bubble(P,'Dada!',1300); await wait(700);
      await say('Dad','There he is! Good morning, buddy.');
      await say('Dad','Daddy\'s just making a daddy breakfast drink.');
      bubble(n,'Heh heh heh.',1500); await wait(1300);
      if(g.path){ g.path=null; } g.x=tx(22); g.y=ty(4); g.dir='up'; g.moving=false;
      await say('Mom','Mm-hm. I\'m making coffee.');
      face(n,faceTo(n,P));
      await say('Dad','You hungry? Hop up on a stool and I\'ll get your breakfast.');
      face(n,'up');
      setGoal('Climb up on a bar stool for breakfast.',['stool0','stool1']);
    } else await say('Dad','Stool, bud. Breakfast\'s coming.');
  },
  stool: async(o)=>{ if(!S.flags.metDad||S.flags.ch2done) return H.stool(); await breakfast(o); },
  toys: async()=>{ if(!S.flags.toysOk||S.flags.dj) return H.toys(); await djScene(); },
  slider: async()=>{ if(S.flags.dadOut&&!S.flags.dadBack) return doorCry(); return H.slider(); },
  npc_grace: async()=>{ if(S.flags.ch2done) return H.npc_grace(); await say('Mom', S.flags.metDad?'Breakfast time! Hop up, bud.':'Go find Dad! And go wake up Vinny.'); },
};
// first open floor spot near Cam from a list of offsets (so nobody ends up standing in furniture)
function spotNear(offs,avoid){ for(const [dx,dy] of offs){ const x=P.x+dx, y=P.y+dy; if(boxFree(x,y,8,4)&&boxFree(x,y-6,8,2)&&!(avoid&&Math.hypot(x-avoid.x,y-avoid.y)<22)) return [x,y]; } return [P.x+offs[0][0],P.y+offs[0][1]]; }
function faceTo(a,b){ const dx=b.x-a.x, dy=b.y-a.y; return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); }
const GRACE_KITCHEN=[tx(22),ty(4)];
async function chapter2(){
  S.cut=true;
  S.chapter=2; S.light='day'; S.clock='7:00 AM'; S.goal=''; S.glows=[];
  P.lying=false; P.sheet='cam_pj'; [P.x,P.y]=CRIB; P.dir='down'; cribFront(true); S.bounds=CRIB_BOUNDS; S.noCollide=true; S.noFall=true;
  doors.cam=false; noise(NOISE_VOL,0.5);
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny; claim(g); claim(n);
  n.visible=true; n.x=tx(20)+6; n.y=ty(4); n.dir='up';
  v.visible=true; v.x=485; v.y=296; v.dir='left'; v.lie=true; v.sleep=true; v.follow=false; v.zBias=0;
  S.snapCam=true;
  S.fadeText='7:00 AM'; S.fadeSub='Rise and shine'; S.fade=1; await wait(1600); S.fadeText=null; S.fadeSub=null; await fadeTo(0,1000);
  bubble(P,'Mama?',1200); await wait(1000);
  g.visible=true; g.x=tx(7); g.y=ty(12); g.dir='up';
  setDoor('cam',true);
  await walk(g,[[tx(7),ty(8)-4],[tx(5),ty(7)],CRIB_SIDE],46); face(g,'up'); g.zBias=44;
  noise(0,1.2);
  await say('Mom','Good morning, sunshine! Did you and Monkey sleep okay?');
  bubble(P,'Hi!',1100); await wait(900);
  await say('Mom','Let\'s get that diaper changed. Upsy-daisy.');
  cribFront(false); g.zBias=0; P.carry=g; P.lift=9; P.zBias=3; bubble(P,'Up!',900); blip(500,0.06,0.04,'triangle'); await wait(500);
  await walk(g,[[tx(4)+4,ty(6)],[tx(4)+4,ty(7)+2]],40); g.dir='down'; await wait(400);
  await fadeTo(1,500); P.carry=null; P.lift=0; P.zBias=0;
  S.fadeText='Fresh diaper. Fresh clothes.'; S.fadeSub='(There was some protest.)'; await wait(1900); S.fadeText=null; S.fadeSub=null;
  cribFront(false); P.sheet=camSheet(); P.x=tx(4); P.y=ty(7); P.dir='down'; S.bounds=null; S.noCollide=false;
  g.x=tx(5)+8; g.y=ty(7)-2; g.dir='left';
  S.snapCam=true; await fadeTo(0,600);
  await say('Mom','All set! Daddy\'s in the kitchen.');
  await say('Mom','Can you go wake up Vinny? He\'s snoring on his bed by the fireplace.');
  setGoal('Wake up Vinny in the living room.',['npc:vinny']);
  S.tip={txt:'Hold '+keyName('b',1)+' to run. Toddlers tip over sometimes.',until:S.t+5};
  walk(g,[[tx(7),ty(8)],[tx(7),ty(12)+2],[tx(18),ty(12)+2],[tx(25),ty(11)],[tx(25),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],GRACE_KITCHEN],40).then(()=>{ g.dir='up'; });
  S.noFall=false;
  S.cut=false;
}
async function breakfast(o){
  const n=NPC.nick, v=NPC.vinny, g=NPC.grace;
  claim(n); claim(g);
  await say('Dad','Up you go!');
  if(n.x<tx(17)||n.y>ty(8)) await navTo(n,'K1',96);
  n.path=null; g.path=null; [g.x,g.y]=GRACE_KITCHEN; g.dir='down'; v.follow=false; S.noCollide=true;
  await walk(n,[[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(25)+8,ty(7)],[P.x+11,P.y+1]],70); n.dir='left';
  P.carry=n; P.lift=9; P.zBias=3; bubble(P,'Up!',900); blip(500,0.06,0.04,'triangle'); await wait(450);
  await walk(n,[[o.x+22,o.y+12]],50); n.dir='left'; await wait(250);
  P.carry=null; P.lift=0; P.x=o.x+7; P.y=o.y+10; P.dir='left'; P.zBias=4; S.bounds=[P.x,P.y,P.x,P.y]; blip(300,0.05,0.04,'triangle');
  walk(v,[[P.x+26,P.y+16]],70).then(()=>{ v.dir='left'; }); v.visible=true; v.sleep=false; v.lie=false;
  await walk(n,[[tx(25)+8,ty(7)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],[tx(22),ty(5)-2]],70); n.dir='right';
  const st={banana:0,cereal:3,cup:false,spill:false,y:P.y}; foodOn(st); blip(420,0.05,0.05,'triangle');
  await say('Dad','Some banana, sliced up, and a little bowl of Cheerios. Breakfast of champions.');
  await say('Mom','What do you say?');
  bubble(P,'Tank you.',1400); await wait(1200);
  let eats=0, fed=0, water=false, cut=false, nb=0, nc=0;
  const BAN=['Cam picks up one slice of banana, squishes it a little, and eats it.','Another slice. This one goes in whole.','One more slice of banana. Sticky fingers.'];
  const CER=['A few Cheerios, one O at a time.','A little pinch of cereal. Two of them fall on the floor.','Three more O\'s. Crunch crunch crunch.'];
  while(eats<7){
    const c=await choose('What does Cam do?',['Eat some banana','Eat some cereal',water?'Drink some water':'Ask for water','Throw some to Vinny','Dump out the cereal','All done!']);
    if(c===0){ eats++; st.banana++; bubble(P,'Nom',900); blip(300,0.05,0.04); await wait(700); await say('',BAN[nb++%3]); if(eats===2) await say('Dad','Good eating, bud.'); }
    if(c===1){ if(st.cereal<=0){ await say('Dad','You dumped it, bud. ...Here\'s a little more.'); st.cereal=3; st.spill=false; }
      eats++; st.cereal--; bubble(P,'Crunch',900); blip(340,0.04,0.04); await wait(700); await say('',CER[nc++%3]); if(st.cereal<=0) st.cereal=1; }
    if(c===2){ if(!water){ water=true; bubble(P,'Water?',1200); await wait(900); st.cup=true; blip(420,0.05,0.05,'triangle'); await say('Mom','Water? Here\'s your cup, bud.'); bubble(P,'Tank you.',1300); await wait(1100); await say('Mom','Good manners!'); }
      else { eats++; bubble(P,'Glug glug',1000); await wait(800); await say('','Glug glug glug. Most of it goes in.'); } }
    if(c===3){ fed++; await tossToVinny(fed);
      if(fed===1) await say('Dad','Hey! That\'s people food... okay, it\'s a little bit of banana. Fine.');
      else if(fed===2) await say('Dad','Again? He\'s never caught one in his life.');
      else { await say('Mom','Alright, that\'s enough then!'); cut=true; break; } }
    if(c===4){ S.shake=0.2; blip(300,0.3,0.05,'sawtooth'); st.cereal=0; st.spill=true; await say('','The bowl tips. Cheerios everywhere. Vinny gets to work right away.'); bubble(v,'*crunch crunch*',1300); await wait(800); await say('Mom','Every. Single. Morning.'); }
    if(c===5){ if(!eats){ await say('Dad','At least a couple bites, buddy. Try the banana.'); continue; } break; }
  }
  if(!cut){ bubble(P,'All done!',1400); blip(900,0.1,0.05,'triangle'); await wait(1100); await say('Dad','All done? Nice work, bud.'); }
  else { await say('Dad','Breakfast is over, I guess.'); }
  jingle([523,659,784,659,784,1047],0.11,'triangle',0.06);
  S.flags.ch2done=true; save();
  // Mom comes around, lifts him down, then cleans up
  await walk(g,[[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(25)+8,ty(7)],[o.x+22,o.y+12]],74); g.dir='left';
  await say('Mom','Down you go.');
  P.carry=g; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(350);
  await walk(g,[[o.x+30,o.y+26]],50); g.dir='down'; await wait(200);
  P.carry=null; P.lift=0; P.zBias=0; S.bounds=null; P.x=g.x; P.y=g.y+12; P.dir='down'; blip(300,0.05,0.04,'triangle'); S.noCollide=false;
  walk(v,[[P.x+22,P.y+4]],70).then(()=>{ v.dir='left'; });
  await say('Mom','There. Now look at this counter.');
  setGoal('');
  graceClean(st);
  vinnyRoutine();
}
function foodOn(st){
  S.extra=(S.extra||[]).filter(e=>e.id!=='food'); if(!st) return;
  const bx=OBJ.bar.x+3;
  S.extra.push({id:'food',sortY:OBJ.bar.sortY+2,draw:(ox,oy)=>{ const R=(x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(Math.round(x-ox),Math.round(y-oy),w,h); }; const py=st.y, O='#2e2838';
    if(st.kind==='lunch'){ const sh=st.pushed?-3:0; R(bx+sh,py-19,10,8,O); R(bx+1+sh,py-18,8,6,'#f4f0ea'); const tw=Math.max(2,6-st.taco*2); R(bx+2+sh,py-17,tw,3,'#e8b84a'); R(bx+2+sh,py-17,tw,1,'#8a5a2a'); if(st.taco<2) R(bx+3+sh,py-18,2,1,'#5aa84a');
      R(bx+sh,py-10,10,7,O); R(bx+1+sh,py-9,8,5,'#f4f0ea'); const vg=Math.max(1,5-st.veg); for(let i=0;i<vg;i++) R(bx+2+sh+(i%3)*2,py-8+(i>2?2:i%2),2,2,i%2?'#e8862a':'#5aa84a');
      if(st.cup){ R(bx+5,py-28,6,8,O); R(bx+6,py-27,4,6,'#3aa8b8'); R(bx+6,py-27,4,2,'#f4f0ea'); R(bx+7,py-29,2,2,'#f4f0ea'); } return; }
    R(bx,py-19,10,7,O); R(bx+1,py-18,8,5,'#f4f0ea'); const left=Math.max(1,4-st.banana); for(let i=0;i<left;i++) R(bx+2+(i%3)*2,py-17+(i>2?2:i%2),2,2,'#f2d24a');
    R(bx,py-10,10,7,O); R(bx+1,py-9,8,5,'#4a8ad8'); R(bx+2,py-9,6,2,st.cereal>0?'#d8a860':'#dfe8f2'); if(st.cereal>0){ R(bx+3,py-9,1,1,'#b07a3a'); R(bx+6,py-8,1,1,'#b07a3a'); }
    if(st.cup){ R(bx+5,py-28,6,8,O); R(bx+6,py-27,4,6,'#3aa8b8'); R(bx+6,py-27,4,2,'#f4f0ea'); R(bx+7,py-29,2,2,'#f4f0ea'); }
    if(st.spill) for(let i=0;i<10;i++) R(bx-1+((i*7)%11),py-12+((i*5)%13),1,1,'#d8a860');
  }});
}
// Cam throws, Vinny jumps, Vinny misses. Every time.
async function tossToVinny(k,what,col){ what=what||'banana'; col=col||'#f2d24a';
  const v=NPC.vinny, home=[v.x,v.y]; const spots=[[tx(26)+2,ty(6)+8],[tx(25)+10,ty(8)+2],[tx(26)+6,ty(4)+6]]; const [lx,ly]=spots[(k-1)%3];
  bubble(P,'Vinny Vinny!',1000); await wait(650); P.dir='right';
  const it={id:'toss',x:P.x+2,y:P.y-2,z:14,get sortY(){ return this.y+40; }};
  it.draw=(ox,oy)=>{ const X=Math.round(it.x-ox), Y=Math.round(it.y-oy); ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fillRect(X-1,Y,4,2); ctx.fillStyle='#2e2838'; ctx.fillRect(X-1,Y-Math.round(it.z)-3,4,4); ctx.fillStyle=col; ctx.fillRect(X,Y-Math.round(it.z)-2,2,2); };
  S.extra.push(it); const x0=it.x,y0=it.y; blip(640,0.08,0.05,'triangle'); v.dir=lx>v.x?'right':'left';
  for(let i=1;i<=24;i++){ const q=i/24; it.x=x0+(lx-x0)*q; it.y=y0+(ly-y0)*q; it.z=14*(1-q)+Math.sin(q*Math.PI)*30;
    if(i===7){ bubble(v,'*snap!*',800); blip(190,0.06,0.07,'square'); (async()=>{ for(const l of [4,8,11,12,10,6,2,0]){ v.lift=l; await wait(42); } })(); }
    await wait(30); }
  it.z=0; blip(160,0.05,0.05); for(const z of [3,4,3,1,0]){ it.z=z; await wait(40); }
  await wait(300); bubble(v,'?',600); await wait(550);
  await walk(v,[[lx-(v.x<lx?13:-13),ly+1]],120); bubble(v,'*chomp*',1000); blip(150,0.1,0.07); S.extra=S.extra.filter(e=>e!==it); await wait(800);
  await walk(v,[home],90); v.dir='left';
  await say('','The '+what+' sails right past Vinny\'s face. He finds it on the floor a second later.');
}
async function graceClean(st){
  const g=NPC.grace; S.cleaning=true;
  await walk(g,[[tx(25)+8,ty(7)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],[tx(22),ty(5)-2]],74); g.dir='right';
  for(let i=0;i<4&&S.cleaning;i++){ bubble(g,'*wipe wipe*',700); blip(240,0.05,0.03,'triangle'); await walk(g,[[tx(22),ty(i%2?5:4)-2]],30); g.dir='right'; if(i===1&&st){ st.spill=false; } if(i===2) foodOn(null); await wait(250); }
  foodOn(null); const was=S.cleaning; S.cleaning=false; if(was){ g.node=null; ambient(g); }
}
// Dad heads for the bathroom, telling Cam to go play on the way past
async function nickBathroom(){
  const n=NPC.nick; claim(n);
  while(S.bathUser&&S.bathUser!==n) await wait(200);
  if(P.x>tx(8)+8&&P.x<tx(13)+8&&P.y<ty(11)){ S.noCollide=true; await walk(P,[[tx(10),ty(8)],[tx(10),ty(12)+2],[tx(12),ty(13)]],70); S.noCollide=false; }
  S.camFocus=n;
  const hall=[tx(18),ty(12)+4]; let route;
  if(P.x>=tx(24)&&P.y<ty(11)){            // Cam is still by the table: come around the bar to him
    route=[[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(25),ty(8)],[Math.max(tx(24)+8,P.x-16),Math.max(ty(4),P.y)]]; }
  else if(P.y>ty(11)&&P.x>tx(16)){        // Cam is in the living room or the hall mouth
    route=routeToHub(n).concat([[Math.max(tx(18),Math.min(tx(30),P.x+(P.x<tx(28)?16:-16))),Math.max(ty(12),Math.min(ty(14),P.y))]]); }
  else route=routeToHub(n).concat([hall]);
  await walk(n,route,70); face(n,faceTo(n,P)); await wait(300);
  await say('Dad','Go play with your toys for a bit.');
  setGoal('Go play with your toys by the TV.',['toys']); S.flags.toysOk=true;
  setDoor('bath',true);
  await walk(n,(n.y<ty(11)?[[tx(26),ty(9)],[tx(28),ty(12)]]:[]).concat([hall]).concat([[tx(10),ty(12)+2],[tx(10),ty(8)],[tx(11),ty(5)],[tx(11)+3,ty(3)+8]]),78); n.dir='down'; n.zBias=14; n.noBlock=true; S.bathUser=n;
  setDoor('bath',false); await wait(250); blip(1500,0.03,0.05,'square'); S.flags.nickPoop=true; await wait(700);
  S.camFocus=null; while(S.camEase) await wait(60);
}
// ====== Vinny's morning: follow, couch, door, repeat ======
function routeToHub(e){
  const c=e.x/16, r=e.y/16, pts=[];
  if(c<16){
    if(c>=13.5&&r<5.5) pts.push([tx(17),ty(4)],[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(25),ty(9)]);
    else { if(r<9.5){ const dc=c<8.5?7:10; pts.push([tx(dc),e.y],[tx(dc),ty(12)+2]); }
           else if(r>14){ const dc=c<8.5?7:12; pts.push([tx(dc),e.y],[tx(dc),ty(13)]); }
           pts.push([tx(18),ty(12)+4]); }
  } else if(c<23.6&&r<9){ if(r<6.4) pts.push([tx(21),ty(5)]); pts.push([tx(21),ty(7)],[tx(23),ty(7)],[tx(25),ty(9)]); }
  pts.push([tx(28),ty(12)]);
  return pts;
}
const COUCH=[tx(24)+8,ty(17)+1], DOOR_IN=[tx(25)+1,ty(3)+1], DOOR_SIDE=[tx(26)+6,ty(4)-2];
async function graceToDoor(g){ await walk(g,[[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(26),ty(7)],DOOR_SIDE],58); g.dir='left'; }
async function graceBack(g){ await walk(g,[[tx(26),ty(7)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],GRACE_KITCHEN],46); g.dir='up'; }
function vinnyStop(){
  S.vinTok=(S.vinTok||0)+1; const v=NPC.vinny, g=NPC.grace;
  v.path=null; v.ghost=false; v.bubble=null; v.follow=false; v.visible=true;
  [v.x,v.y]=COUCH; v.lie=true; v.sleep=true; v.zBias=8; v.dir='left';
  hidden.delete('slider'); hidden.add('sliderOpen'); S.doorHelper=null;
  g.node=null; ambient(g);
}
async function vinnyRoutine(){
  const my=S.vinTok=(S.vinTok||0)+1, alive=()=>S.vinTok===my;
  const v=NPC.vinny, g=NPC.grace;
  const w=async(ms)=>{ await wait(ms); if(!alive()) throw 0; };
  const wk=async(e,pts,sp)=>{ await walk(e,pts,sp); if(!alive()) throw 0; };
  const taps=async()=>{ for(let i=0;i<2;i++){ bubble(v,'*tap tap*',1100); blip(520,0.03,0.05,'square'); setTimeout(()=>{ if(alive()) blip(520,0.03,0.05,'square'); },160); await w(1500); } };
  let locked=false;
  const doorBit=async(scene)=>{
    v.sleep=false; v.lie=false; v.zBias=0; v.bubble=null; bubble(v,'!',900);
    if(scene){ S.camFocus=v; }
    await w(900);
    const from=(v.y>ty(15))?[[tx(25),ty(18)+4],[tx(28),ty(18)+4],[tx(28),ty(10)],[tx(26),ty(9)]]:routeToHub(v).concat([[tx(26),ty(9)]]);
    await wk(v,from.concat([DOOR_IN]),100); v.dir='up';
    if(scene) S.camFocus={x:DOOR_IN[0]-30,y:DOOR_IN[1]+50};
    await taps();
    let h=null; while(!h){ while(S.cleaning||S.busyHelper) await w(200); h=[g,NPC.nick].find(e=>e.visible&&!e.inBath&&!e.away&&!S.flags.nickPoop||e===g&&e.visible&&!e.inBath&&!e.away); if(!h) await w(400); }
    claim(h); S.doorHelper=h;
    bubble(h,'Vinny...',1300); await w(1000);
    await navTo(h,'D1',64); if(!alive()) throw 0; await wk(h,[DOOR_SIDE],58); h.dir='left';
    bubble(h,'Ugh. Fine.',1300); slider(true); await w(500);
    await wk(v,[[DOOR_IN[0],ty(2)]],60); v.visible=false; await w(300); slider(false);
    await wk(h,[[tx(26),ty(7)]],46); h.dir='up';
    await w(scene?2500:3500);
    v.ghost=true; v.x=DOOR_IN[0]; v.y=ty(2)+4;
    await taps();
    bubble(h,'Seriously?!',1400); await w(1100);
    await wk(h,[DOOR_SIDE],58); h.dir='left';
    slider(true); await w(300); v.ghost=false; v.visible=true; v.dir='down';
    await wk(v,[DOOR_IN],60); slider(false);
    bubble(h,'In or out, bud. Pick one.',1900); await w(scene?1800:800);
    S.doorHelper=null; h.node=null; ambient(h);
  };
  try{
    v.follow=true; crumbs.length=0;
    await w(S.fast?3000:7000);
    while(S.lock>0||S.dlg) await w(150);
    v.follow=false; S.cut=true; locked=true; P.moving=false;
    await doorBit(true);
    S.camFocus=null; await nickBathroom(); if(!alive()) throw 0;
    S.cut=false; locked=false;
    while(true){
      v.follow=false;
      await wk(v,routeToHub(v).concat([[tx(28),ty(18)+4],[tx(25),ty(18)+4],COUCH]),72);
      v.lie=true; v.sleep=true; v.zBias=8; v.dir='left';
      await w(S.fast?5000:20000+Math.random()*10000);
      await doorBit(false);
    }
  }catch(e){ S.doorHelper=null; if(locked){ S.camFocus=null; S.cut=false; } if(e!==0) throw e; }
}
// ====== the DJ piano (follow-the-lights mini game) ======
function djGame(){
  return new Promise(res=>{
    const PADS=[{k:'up',c:'#f25c54',f:523,x:0,y:-1},{k:'right',c:'#f7b32b',f:659,x:1,y:0},{k:'down',c:'#4fb0c6',f:784,x:0,y:1},{k:'left',c:'#7bc950',f:988,x:-1,y:0}];
    const ROUNDS=[3,4,5]; let round=0, seq=[], pos=0, phase='show', t=0, lit=-1, litT=0, msg='Watch the lights...';
    const start=()=>{ seq=[]; for(let i=0;i<ROUNDS[round];i++) seq.push(Math.floor(Math.random()*4)); pos=0; phase='show'; t=-0.7; msg='Watch the lights...'; };
    const flash=(i)=>{ lit=i; litT=0.28; blip(PADS[i].f,0.22,0.07,'triangle'); };
    start();
    S.mini={ get seq(){return seq;}, get phase(){return phase;}, get pos(){return pos;},
      taps(){ const cx=VW/2, cy=VH/2+4; return PADS.map(p=>({x:cx+p.x*27-14,y:cy+2+p.y*25-14,w:28,h:28,k:p.k})); },
      update(dt){ t+=dt; if(litT>0){ litT-=dt; if(litT<=0) lit=-1; }
        if(phase==='show'){ const step=Math.floor(t/0.55); if(t>=0&&step>=pos){ if(pos<seq.length){ flash(seq[pos]); pos++; } else if(t>seq.length*0.55+0.1){ phase='play'; pos=0; msg='Your turn! Play it back.'; for(const k in pressed) pressed[k]=false; } } }
        else if(phase==='play'){ for(let i=0;i<4;i++) if(hit(PADS[i].k)){ flash(i);
            if(i===seq[pos]){ pos++; if(pos>=seq.length){ round++; if(round>=ROUNDS.length){ phase='done'; t=0; msg='DJ CAM!'; jingle([523,659,784,1047,784,1047,1319],0.1,'triangle',0.07); } else { phase='wait'; t=0; msg='Yeah! One more.'; } } }
            else { phase='wait'; t=0; msg='Oops! Try again.'; blip(140,0.25,0.06,'sawtooth'); }
            break; } hit('a'); hit('b'); }
        else if(phase==='wait'){ if(t>1.0) start(); }
        else if(phase==='done'){ if(t>1.6){ S.mini=null; res(); } }
      },
      draw(){ const cx=VW/2, cy=VH/2+4; box(cx-74,cy-70,148,140,'rgba(24,20,36,0.95)','#ffd98a');
        txt('THE DJ SONG',cx,cy-63,'#ffd98a',8,'center',true); txt('Round '+Math.min(round+1,3)+' of 3',cx,cy-52,'#a9a0b8',6.5,'center');
        U.fillStyle='#46c8be'; U.fillRect(cx-46,cy-40,92,84); U.strokeStyle='#2e2838'; U.lineWidth=1; U.strokeRect(cx-45.5,cy-39.5,91,83);
        PADS.forEach((p,i)=>{ const px=cx+p.x*27-11, py=cy+2+p.y*25-11; U.globalAlpha=(lit===i)?1:0.45; U.fillStyle=p.c; U.fillRect(px,py,22,22); U.globalAlpha=1; U.strokeStyle=(lit===i)?'#fff':'#2e2838'; U.strokeRect(px+0.5,py+0.5,21,21);
          txt(['▲','▶','▼','◀'][i],px+11,py+7,'#fff',7,'center'); });
        U.fillStyle='#2e2838'; U.beginPath(); U.arc(cx,cy+2,6,0,7); U.fill();
        txt(msg,cx,cy+52,'#f4ead8',7,'center'); }
    };
  });
}
async function djScene(){
  const n=NPC.nick, g=NPC.grace, v=NPC.vinny;
  bubble(P,'Ooh!',1000); await wait(700);
  await say('','The DJ piano! Lights, buttons, and one song Cam knows by heart.');
  await say('',isTouch()?'Play the DJ song: watch the lights, then drag the same directions.':'Play the DJ song: watch the lights, then press the same arrows.');
  await djGame(); unlock('dj');
  S.flags.dj=true;
  bubble(P,'Yay!',1200); await wait(900);
  vinnyStop(); setGoal('');
  if(S.flags.nickPoop){ S.camFocus={x:tx(11),y:ty(8)}; await wait(900);
    for(const f of [520,420,340,260,200]){ blip(f,0.12,0.04,'sawtooth'); await wait(90); } S.tip={txt:'fwooosh',until:S.t+1.4}; await wait(900);
    S.flags.nickPoop=false; S.bathUser=null; setDoor('bath',true); n.zBias=0; n.noBlock=false; S.camFocus=n;
    await walk(n,[[tx(11),ty(5)],[tx(10),ty(8)],[tx(10),ty(12)+2],[tx(18),ty(12)+4],[tx(28),ty(12)],[tx(28),ty(19)],[Math.max(tx(26),P.x-18),P.y]],84); face(n,faceTo(n,P)); S.camFocus=null; }
  else { n.x=tx(28); n.y=ty(19); n.dir='down'; }
  await say('Dad','Nice set, DJ Cam! Daddy\'s gotta go check on something. Be right back.');
  S.camFocus=n;
  await walk(n,[[tx(28),ty(19)],[tx(28),ty(12)],[tx(26),ty(9)],[tx(25),ty(7)],DOOR_IN],70); n.dir='up';
  slider(true); await wait(400); await walk(n,[[DOOR_IN[0],ty(2)]],50); n.visible=false; await wait(250); slider(false); await wait(700);
  S.camFocus=null; await wait(500);
  S.flags.dadOut=true; setGoal('Follow Dad!',['slider','sliderOpen']);
}
async function doorCry(){
  const n=NPC.nick, g=NPC.grace;
  S.flags.dadBack=true; setGoal(''); claim(g);
  blip(240,0.08,0.05,'triangle'); await say('','Cam pushes on the glass with both hands. It doesn\'t budge.');
  bubble(P,'Dada?',1100); await wait(1000);
  bubble(P,'Waaaah!',1500); blip(820,0.35,0.06,'triangle'); await wait(700); blip(880,0.4,0.06,'triangle'); await wait(1000);
  await say('Mom','He\'ll be right back. He\'s in the garage farting around with something.');
  bubble(P,'*sniff*',1200); await wait(3200);
  if(Math.abs(P.x-DOOR_IN[0])<10&&P.y<ty(4)+4){ P.x=DOOR_IN[0]+22; }
  slider(true); await wait(350); n.visible=true; n.x=DOOR_IN[0]; n.y=ty(2); n.dir='down';
  await walk(n,[DOOR_IN,[DOOR_IN[0],ty(4)+2]],50); slider(false); face(n,faceTo(n,P));
  bubble(P,'Dada!',1100); await wait(900);
  await navTo(g,'D1',70); await walk(g,[[tx(27),ty(5)+4]],64); face(g,faceTo(g,P)); face(n,faceTo(n,P)); P.dir=faceTo(P,g);
  await say('Mom','Alright Cam, what do you want to do?');
  bubble(P,'Cookie!',1300); blip(900,0.1,0.05,'triangle'); await wait(1100); face(n,faceTo(n,g)); face(g,faceTo(g,n));
  await say('Dad','I\'ve been waiting to see what happens next.',{noFace:1});
  bubble(g,'Ha ha ha!',1400); await wait(1200);
  await say('Mom','Ok Cam, let\'s watch Cookie.');
  await walk(g,[[P.x+10,P.y]],50);
  P.carry=g; P.lift=9; P.zBias=3; S.noCollide=true; bubble(P,'Up!',900);
  await walk(g,[[tx(27),ty(9)],[tx(28),ty(12)],[tx(28),ty(19)],[tx(25),ty(19)],[366,318]],58);
  P.carry=null; P.lift=0;
  const SX=OBJ.sofaLeft.x+13;
  g.x=SX; g.y=348; g.dir='right'; g.zBias=90; g.moving=false;
  P.x=SX+2; P.y=330; P.dir='right'; P.zBias=90; S.bounds=[P.x,P.y,P.x,P.y];
  await wait(600);
  tvOn(true); blip(1200,0.04,0.04,'square'); jingle([392,523,659,523,659,784],0.13,'triangle',0.05);
  S.mini={update(){},draw(){ tvInset(); }};
  await wait(1100);
  // Cam can't sit still for the theme song
  S.bounds=null; bubble(P,'Cookie!!!',1500); blip(1000,0.1,0.05,'triangle'); await wait(500);
  await arcTo(P,SX+26,330,7,260); P.zBias=0; P.running=true;
  await walk(P,[[SX+44,312],[SX+70,326]],96); bubble(P,'Cookie!!!',1300); blip(1100,0.1,0.05,'triangle');
  await walk(P,[[SX+52,352],[SX+30,340],[SX+56,322],[SX+26,330]],96); P.running=false; P.dir='left';
  P.zBias=90; await arcTo(P,SX+2,330,8,280); P.dir='right'; S.bounds=[P.x,P.y,P.x,P.y];
  await say('','Mom settles in on the chaise. Cam climbs back up next to her, eyes locked on the TV.');
  await wait(2200);
  n.zBias=0; await walk(n,[[tx(26),ty(9)],[tx(28),ty(12)],[tx(28),ty(18)],[SX+26,312]],70); await arcTo(n,SX,312,3,220); n.dir='right'; n.zBias=90; n.noBlock=true;
  await wait(700); await say('Dad','Scoot over, bud.');
  await wait(2600);
  S.fadeText='9:30 AM'; S.fadeSub=''; await fadeTo(1,3600); await wait(1200);
  S.mini=null; tvOn(false); S.chapter=3; save();
  chapter3();
}
// the show: an original puppet pair, big enough to see
function tvShow(R,w,h,t){   // R(x,y,w,h,col) in screen-local pixels
  R(0,0,w,h,'#7fc8f0'); R(0,Math.round(h*0.68),w,Math.ceil(h*0.32),'#6fb85a');
  const b=Math.round(Math.sin(t*5)*h*0.05), b2=Math.round(Math.cos(t*4)*h*0.05), u=Math.max(1,Math.round(w/14));
  // left: round orange puppet with a tuft
  let x=Math.round(w*0.14), y=Math.round(h*0.34)+b, pw=Math.round(w*0.28), ph=Math.round(h*0.5);
  R(x,y,pw,ph,'#f08a2c'); R(x+Math.round(pw*0.4),y-u,u,u,'#f4c040'); R(x+u,y+u,u,u,'#fff'); R(x+pw-2*u,y+u,u,u,'#fff'); R(x+u,y+Math.round(ph*0.55),pw-2*u,u,'#7a2a1a');
  // right: tall teal puppet with a striped scarf
  x=Math.round(w*0.58); y=Math.round(h*0.2)+b2; pw=Math.round(w*0.24); ph=Math.round(h*0.66);
  R(x,y,pw,ph,'#2aa6a0'); R(x+u,y+u,u,u,'#fff'); R(x+pw-2*u,y+u,u,u,'#fff'); R(x+Math.round(pw/2)-Math.floor(u/2),y+2*u,u,u,'#f25c8a'); R(x,y+Math.round(ph*0.5),pw,u,'#f4e04a'); if(h>20) R(x,y+Math.round(ph*0.5)+2*u,pw,u,'#f4e04a');
}
function tvInset(){
  const w=70,h=46,x=VW-w-8,y=26; box(x-4,y-4,w+8,h+14,'#22202a','#8a8794');
  tvShow((a,b,c,d,col)=>{ U.fillStyle=col; U.fillRect(x+a,y+b,c,d); },w,h,S.t);
  // a cookie bouncing across the screen
  const cx=x+8+((S.t*14)%(w-16)), cy=y+8+Math.abs(Math.sin(S.t*3))*4; U.fillStyle='#b8793a'; U.beginPath(); U.arc(cx,cy,4,0,7); U.fill(); U.fillStyle='#4a2a14'; U.fillRect(cx-2,cy-1,1.4,1.4); U.fillRect(cx+1,cy+1,1.4,1.4); U.fillRect(cx,cy-2.4,1.4,1.4);
  txt('ON TV',x+w/2,y+h+1,'#8a8794',5.5,'center',true);
}
function tvOn(on){
  S.extra=(S.extra||[]).filter(e=>e.id!=='tvglow');
  if(on){ const o=OBJ.tv; S.extra.push({id:'tvglow',sortY:o.sortY+2,draw:(ox,oy)=>{ const X=Math.round(o.x-ox)+3, Y=Math.round(o.y-oy)+3; tvShow((a,b,c,d,col)=>{ ctx.fillStyle=col; ctx.fillRect(X+a,Y+b,c,d); },o.w-6,o.h-9,S.t); }}); }
}
// ----- Chapter 3: 9:30 AM -----
CH[3]={
  npc_nick: async()=>{ await say('Dad', S.flags.gotMom?'Have fun out there, bud.':'Go get Mom! Run!'); },
  npc_grace: async()=>{ if(S.map==='park'){ await say('Mom','Go play, bud! I\'m right here.'); return; } if(S.flags.gotMom) return pickOuting(); },
  npc_vinny: async()=>H.npc_vinny(),
};
async function chapter3(){
  S.cut=true;
  S.chapter=3; S.light='day'; S.clock='9:30 AM'; S.goal=''; S.glows=[]; S.flags.gotMom=false;
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny;
  S.vinTok=(S.vinTok||0)+1; hidden.delete('slider'); hidden.add('sliderOpen'); tvOn(false); cribFront(false);
  P.sheet=camSheet(); P.lying=false; S.bounds=null; S.noCollide=false; S.noFall=false;
  P.x=tx(4); P.y=ty(7); P.dir='down'; doors.cam=true;
  claim(n); claim(g); S.bathUser=null;
  n.visible=true; n.path=null; n.zBias=0; n.noBlock=false; S.flags.nickPoop=false; doors.bath=true; S.cleaning=false; S.busyHelper=null; foodOn(null); S.mini=null;
  n.x=tx(4)+4; n.y=ty(7)+2; n.dir='down'; P.carry=n; P.lift=9; P.zBias=3;
  g.visible=true; g.path=null; g.zBias=0; g.x=tx(25); g.y=ty(14); g.dir='left';
  v.visible=true; v.path=null; v.ghost=false; v.follow=false; v.x=485; v.y=296; v.dir='left'; v.lie=true; v.sleep=true; v.zBias=0;
  for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.delete(o.id);
  S.snapCam=true; S.fade=1; await wait(600); S.fadeText=null; S.fadeSub=null; await fadeTo(0,900);
  await say('','TV time is over. Nick is changing Cam again.');
  await say('Dad','Oh man, that was a RANK one!');
  bubble(P,'Hee hee hee!',1500); blip(1000,0.08,0.05,'triangle'); setTimeout(()=>blip(1150,0.08,0.05,'triangle'),140); await wait(1400);
  await say('Dad','Alright. What do you want to wear, bud?');
  { const id=await outfitPicker(); if(id&&id!==S.flags.outfit){ await swapOutfit(id); await say('Dad',OUTFIT_LINES[id]||'Very handsome.'); } else await say('Dad','Sticking with that one? Works for me.'); }
  await say('Dad','Ok, go get Mom!');
  P.carry=null; P.lift=0; P.zBias=0; P.x=n.x+14; P.y=n.y; P.dir='down'; blip(300,0.05,0.04,'triangle'); n.dir='right'; await wait(300);
  setGoal('Run to Mom!',['npc:grace']); n.node=null; ambient(n);
  S.tip={txt:'Hold '+keyName('b',1)+' to run.',until:S.t+4};
  S.cut=false;
  while(S.chapter===3 && P.x<tx(17)) await wait(100);
  if(S.chapter!==3) return;
  S.cut=true; while(S.dlg) await wait(50);
  v.sleep=false; v.lie=false; v.bubble=null; bubble(v,'!',800); await wait(700);
  P.moving=false; P.running=false;
  { const vs=spotNear([[24,6],[24,14],[-24,6],[0,20],[24,-4]]); await walk(v,[[tx(28),ty(13)],vs],120); v.dir=vs[0]>P.x?'left':'right'; }
  bubble(v,'*lick lick lick*',1500); blip(260,0.05,0.05); await wait(500); P.sit=1.2; P.fallDir=-1; S.shake=0.15; await wait(900);
  bubble(P,'No Vinny Vinny!',1600); await wait(1500);
  await walk(g,[spotNear([[4,22],[-18,16],[20,22],[-22,4],[0,-16]],v)],60); face(g,faceTo(g,P)); P.sit=0; P.dir=faceTo(P,g);
  S.flags.gotMom=true; setGoal('');
  await pickOuting();
  S.cut=false;
}
async function pickOuting(){
  const names=['Go for a walk','Go to Cub Foods','Go to the park','Not right now']; claim(NPC.grace);
  const c=await choose(S.flags.outings?'Want to go on another adventure?':'Alright Cam, what should we do now?',names,'Mom');
  if(c===3){ setGoal('Talk to Mom to pick an adventure.',['npc:grace']); NPC.grace.node=null; ambient(NPC.grace); return; }
  claim(NPC.nick);
  if(c===0){ await walkOuting(); S.flags.outings=(S.flags.outings||0)+1; S.flags.lastOut='walk'; save('home'); await backHome(); return; }
  if(c===1){ await cubOuting(); S.flags.outings=(S.flags.outings||0)+1; S.flags.didCub=true; S.flags.lastOut='cub'; save('home'); await backHome(); return; }
  if(c===2){ await parkOuting(); S.flags.outings=(S.flags.outings||0)+1; S.flags.lastOut='park'; save('home'); await backHome(); return; }
  await fadeTo(1,600); S.fadeText=names[c]; S.fadeSub='This adventure isn\'t built yet.'; await wait(2200); S.fadeText=null; S.fadeSub=null; await fadeTo(0,600);
  setGoal('Talk to Mom to pick an adventure.',['npc:grace']);
}
const FRONT=[tx(18)+5,ty(23)+4], FRONT_IN=[tx(19),ty(21)];
// out the front door: Mom scoops Cam up and carries him out. Dad and Vinny come along for the walk.
async function leaveHome(withDad){
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny; claim(g); S.noCollide=true; P.sit=0;
  await walk(g,[[P.x+12,P.y+1]],92); g.dir='left'; P.carry=g; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(350);
  if(withDad){ claim(n); v.sleep=false; v.lie=false; v.zBias=0; v.follow=false; walk(n,[[FRONT_IN[0]+16,FRONT_IN[1]-6]],84).then(()=>{ n.dir='down'; }); walk(v,[[FRONT_IN[0]-14,FRONT_IN[1]+8]],96).then(()=>{ v.dir='right'; bubble(v,'*wag wag*',900); }); }
  await walk(g,[FRONT_IN,FRONT],72); g.dir='down'; blip(260,0.12,0.06,'triangle'); await wait(350);
}
function setDown(){ P.carry=null; P.lift=0; P.zBias=0; S.noCollide=false; }
async function backHome(){
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny;
  claim(g); claim(n); S.clock='11:30 AM'; P.sit=0; S.noCollide=true; g.path=null; g.x=FRONT[0]; g.y=FRONT[1]; g.dir='up'; g.visible=true; P.carry=g; P.lift=9; P.zBias=3; P.x=g.x; P.y=g.y;
  n.x=tx(20)+6; n.y=ty(4); n.dir='up'; v.lie=true; v.sleep=true; [v.x,v.y]=COUCH; v.zBias=8; v.dir='left'; v.follow=false;
  S.snapCam=true; S.fadeText=null; blip(260,0.12,0.06,'triangle'); await fadeTo(0,700);
  await walk(g,[FRONT_IN],56); g.dir='left'; await wait(250);
  setDown(); P.x=g.x-13; P.y=g.y+2; P.dir='right'; blip(300,0.05,0.04,'triangle'); await wait(300);
  await say('Mom','Home again. Go play, bud.');
  g.node=null; n.node=null; ambient(g); ambient(n);
  setGoal('Talk to Mom for another adventure, or go to your crib for a nap.',['npc:grace','crib']);
}
// ====== boot ======
// ---------- a taste of the fun before the day begins (first time only) ----------
// the last dream: everybody on the couch
function couchDream(sec){ return new Promise(resolve=>{ const G={t:0,hearts:[],gig:0,done:false};
  const person=(x,sy,k,o)=>{ const b=Math.sin(G.t*1.6+o.ph)*0.6*k, hop=o.hop||0; U.save(); U.translate(x,sy-hop); U.scale(k,k);
    // legs over the front of the cushion, then body, arms, head
    uRR(-8,-3,7,o.leg||20,3,o.pants,CO,0.9); uRR(1,-3,7,o.leg||20,3,o.pants,CO,0.9); uRR(-9.5,(o.leg||20)-5,9,5,2.5,o.shoe,CO,0.8); uRR(0.5,(o.leg||20)-5,9,5,2.5,o.shoe,CO,0.8);
    uRR(-10,-27+b,20,26,6,o.top,CO,1); uLimb([[-9,-22+b],[-12-(o.armL||0),-8+b]],4.6,o.sleeve||o.top); uLimb([[9,-22+b],[12+(o.armR||0),-8+b]],4.6,o.sleeve||o.top);
    if(o.longHair){ uRR(-10.8,-45+b,21.6,17,7,o.hair,hexShade(o.hair,-0.3),0.6); uRR(-11.5,-34+b,4.5,12,2.2,o.hair,null); uRR(7,-34+b,4.5,12,2.2,o.hair,null); }
    uCirc(0,-36+b,9,o.skin,CO,1);
    U.fillStyle=o.hair; U.beginPath(); U.arc(0,-37.5+b,9.4,Math.PI*1.02,Math.PI*1.98); U.quadraticCurveTo(o.part||3,-41+b,-9.3,-37+b); U.closePath(); U.fill(); U.strokeStyle=hexShade(o.hair,-0.3); U.lineWidth=0.5; U.stroke();
    if(o.wisp){ U.strokeStyle=o.hair; U.lineWidth=1; U.beginPath(); U.moveTo(1,-45.5+b); U.quadraticCurveTo(4,-49+b,6,-46.5+b); U.stroke(); }
    if(o.beard){ U.fillStyle=o.beard; U.beginPath(); U.arc(0,-34+b,8.6,0.15,Math.PI-0.15); U.quadraticCurveTo(0,-31+b,8.4,-32.7+b); U.fill(); }
    U.strokeStyle=CO; U.lineWidth=1; U.lineCap='round'; for(const ex of [-3.4,3.4]){ U.beginPath(); U.arc(ex,-36.5+b,1.7,Math.PI*1.1,Math.PI*1.9); U.stroke(); }
    U.strokeStyle=o.beard?'#f4d8c4':'#8a3a3a'; U.lineWidth=1; U.beginPath(); U.arc(0,-33.2+b,3,0.25,Math.PI-0.25); U.stroke();
    if(o.cheek){ uCirc(-5.6,-33.4+b,1.5,'rgba(240,130,130,0.55)',null); uCirc(5.6,-33.4+b,1.5,'rgba(240,130,130,0.55)',null); }
    U.restore(); };
  S.mini={ full:true, tapA:true, G,
    update(dt){ G.t+=dt; if(G.gig>0) G.gig-=dt; if(hit('a')&&G.t>0.4){ G.gig=0.5; blip(880+Math.random()*200,0.07,0.04,'triangle'); G.hearts.push({x:VW/2+(Math.random()-0.5)*50,y:VH*0.5,t:0}); } for(const k of ['b','left','right','up','down']) hit(k);
      if(Math.floor(G.t/0.9)!==Math.floor((G.t-dt)/0.9)) G.hearts.push({x:VW/2+(Math.random()-0.5)*110,y:VH*0.52,t:0}); for(const h of G.hearts){ h.t+=dt; h.y-=14*dt; } G.hearts=G.hearts.filter(h=>h.t<2.2);
      if(G.t>sec&&!G.done){ G.done=true; resolve(G); } },
    draw(){ const W=VW,Hh=VH,cx=W/2, sy=Math.round(Hh*0.66), cw=Math.min(196,W-10), x0=cx-cw/2; ctx.fillStyle='#e8d2b8'; ctx.fillRect(0,0,W,Hh);
      let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#f6e3c8'); g.addColorStop(1,'#eccfae'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
      // window with morning light, a picture, the floor and a rug
      const wx=cx-30, wy=sy-128; uRR(wx,wy,60,46,3,'#fdf6dc','#8a6a4a',2); U.fillStyle='rgba(255,240,170,0.75)'; U.fillRect(wx+3,wy+3,54,40); uCirc(wx+42,wy+15,7,'#ffe9a0',null); U.strokeStyle='#8a6a4a'; U.lineWidth=1.6; U.beginPath(); U.moveTo(wx+30,wy+2); U.lineTo(wx+30,wy+44); U.moveTo(wx+2,wy+23); U.lineTo(wx+58,wy+23); U.stroke();
      U.fillStyle='rgba(255,236,170,0.16)'; U.beginPath(); U.moveTo(wx,wy+46); U.lineTo(wx+60,wy+46); U.lineTo(wx+104,Hh); U.lineTo(wx-44,Hh); U.closePath(); U.fill();
      U.fillStyle='#b98a5e'; U.fillRect(0,sy+26,W,Hh-sy-26); U.fillStyle='#a87a50'; for(let i=0;i<6;i++) U.fillRect(0,sy+34+i*14,W,0.8); U.fillStyle='#8a6a4a'; U.fillRect(0,sy+24,W,3);
      U.fillStyle='rgba(120,70,130,0.3)'; U.beginPath(); U.ellipse(cx,sy+44,cw*0.5,10,0,0,7); U.fill();
      // the couch: back, arms, seat
      uRR(x0+6,sy-46,cw-12,54,12,'#6f8f8a',CO,1.4); U.strokeStyle='rgba(46,40,56,0.25)'; U.lineWidth=1; for(const f of [1/3,2/3]){ U.beginPath(); U.moveTo(x0+6+(cw-12)*f,sy-42); U.lineTo(x0+6+(cw-12)*f,sy-6); U.stroke(); }
      uRR(x0+8,sy-8,cw-16,22,6,'#7fa29c',CO,1.2); uRR(x0+8,sy+8,cw-16,14,4,'#5d7a76',CO,1.2);
      // Vinny first so the people's legs sit over him: a big fawn dog flopped along the right end, head on Mom's side
      { const vx=x0+cw*0.77, vy=sy-9, wag=Math.sin(G.t*9)*5, br=Math.sin(G.t*1.4)*0.7; U.strokeStyle='#402a22'; U.lineWidth=3.2; U.lineCap='round'; U.beginPath(); U.moveTo(vx+24,vy-2); U.quadraticCurveTo(vx+34,vy-8,vx+33+wag*0.4,vy-17-Math.abs(wag)*0.3); U.stroke();
        uRR(vx-20,vy-13-br,48,17+br,8,'#33211c',CO,1.1); uRR(vx-14,vy-1,11,6,3,'#402a22',CO,0.9); uRR(vx+12,vy-1,11,6,3,'#402a22',CO,0.9);
        uCirc(vx-23,vy-10,10,'#33211c',CO,1.1); uPoly([[vx-32,vy-15],[vx-34,vy-5],[vx-28,vy-11]],'#120c0b',CO,0.8); uPoly([[vx-15,vy-17],[vx-12,vy-7],[vx-18,vy-12]],'#120c0b',CO,0.8);
        uRR(vx-29,vy-9,12,9,4,'#120c0b',CO,0.9); uCirc(vx-23,vy-7,1.6,'#3a2a26',null); U.strokeStyle='#d8c8b8'; U.lineWidth=0.9; for(const ex of [-27,-19]){ U.beginPath(); U.arc(vx+ex,vy-12.5,1.6,Math.PI*0.1,Math.PI*0.9); U.stroke(); } }
      const of=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1];
      person(x0+cw*0.19,sy,1.12,{ph:0,pants:'#4a5a7a',shoe:'#e8e4dc',top:'#24222a',sleeve:'#2c2a33',skin:'#eec4a4',hair:'#5a4030',beard:'rgba(90,64,48,0.85)',armR:4,part:-2});
      person(x0+cw*0.52,sy,1.0,{ph:1.3,pants:'#5a78b0',shoe:'#d8c8e8',top:'#34313f',skin:'#f2caa8',hair:'#6a4630',longHair:true,armL:4,armR:6,cheek:true});
      person(x0+cw*0.355,sy+3,0.72,{ph:2.4,leg:13,pants:'#7a8ec8',shoe:'#f4f0e8',top:'#f0c84a',skin:'#f6d0b4',hair:'#e6c878',wisp:true,cheek:true,hop:G.gig>0?Math.abs(Math.sin(G.gig*18))*3:0,part:1});
      uRR(x0,sy-22,15,42,7,'#5d7a76',CO,1.3); uRR(x0+cw-15,sy-22,15,42,7,'#5d7a76',CO,1.3);
      for(const h of G.hearts){ const a=Math.max(0,1-h.t/2.2), x=h.x+Math.sin(h.t*3+h.x)*4, r=3; U.globalAlpha=a; U.fillStyle='#f08aa8'; U.beginPath(); U.moveTo(x,h.y+r); U.bezierCurveTo(x-r*2,h.y-r*0.6,x-r*0.6,h.y-r*1.8,x,h.y-r*0.5); U.bezierCurveTo(x+r*0.6,h.y-r*1.8,x+r*2,h.y-r*0.6,x,h.y+r); U.fill(); U.globalAlpha=1; } } }; }); }
async function dreams(){
  await dreamCut(async()=>{ slideBig({humps:1}); },true);
  await new Promise(r=>{ const iv=setInterval(()=>{ const G=S.mini&&S.mini.G; if(!S.mini||!S.mini.slideBig||(G&&G.phase==='land'&&G.pT>1.2)){ clearInterval(iv); r(); } },80); });
  let pr; await dreamCut(async()=>{ S.mini=null; pr=cubGame(0,{dream:2}); },true); await pr;
  await dreamCut(async()=>{ S.mini=null; pr=drumGame({dream:4}); },true); await pr;
  await dreamCut(async()=>{ S.mini=null; pr=couchDream(5.5); },true); await pr;
  await dreamCut(async()=>{ S.mini=null; },false,false); }
// ---------- mini games from the title screen: each one opens once it has been played in the story ----------
const ARCADE=[{id:'dj',name:'The DJ Song',where:'Morning',col:'#46c8be'},{id:'walk',name:'The Walk',where:'Outing',col:'#8fd0f0'},{id:'park',name:'Heredia Park',where:'Outing',col:'#7bd95a'},{id:'cub',name:'Cub Foods',where:'Outing',col:'#e8845a'},
  {id:'guitar',name:'Dad\'s Guitar',where:'Basement',col:'#c8242c'},{id:'bed',name:'Bed Jumping',where:'Basement',col:'#b48ae0'},{id:'cube',name:'Activity Cube',where:'Basement',col:'#f0c828'},{id:'drums',name:'The Drums',where:'Basement',col:'#ffd98a'}];
function arcOpen(id){ const sv=loadSave(), u=META.unl||{}; return !!(u[id]||META.best[id]||(id==='guitar'&&META.ach.strum)||(id==='dj'&&sv&&sv.ch>=3)||(id==='park'&&(META.ach.slide1||META.ach.slide2))); }
function arcMenu(LIST,title,all){ LIST=LIST||ARCADE; return new Promise(res=>{ let sel=0, msg='', msgT=0; const t0=S.t;
  const lay=()=>{ const cols=VW>=300?4:2, rows=Math.ceil(LIST.length/cols), w=Math.floor((VW-12-(cols-1)*4)/cols), h=Math.min(52,Math.floor((VH-58-(rows-1)*(LIST.length>12?2:4))/rows)); return {cols,w,h,at:i=>[6+(i%cols)*(w+4),28+Math.floor(i/cols)*(h+(LIST.length>12?2:4))]}; };
  const go=i=>{ if(S.t-t0<0.3) return; if((all||arcOpen(LIST[i].id))){ blip(900,0.04,0.04); S.mini=null; res(LIST[i].id); } else { sel=i; msg='Play the story to unlock it ('+LIST[i].where+').'; msgT=2.2; blip(180,0.1,0.05,'sawtooth'); } };
  S.mini={ full:true, dpad:true,
    taps(){ const L=lay(), Z=LIST.map((a,i)=>{ const [x,y]=L.at(i); return {x,y,w:L.w,h:L.h,fn(){ sel=i; go(i); }}; }); Z.push({x:VW/2-34,y:VH-22,w:68,h:18,fn(){ S.mini=null; res(null); }}); return Z; },
    update(dt){ const L=lay(), N=LIST.length; if(msgT>0) msgT-=dt; if(hit('left')) sel=(sel+N-1)%N; if(hit('right')) sel=(sel+1)%N; if(hit('up')) sel=(sel+N-L.cols)%N; if(hit('down')) sel=(sel+L.cols)%N; if(hit('a')) go(sel); if(hit('b')&&S.t-t0>0.3){ S.mini=null; res(null); } },
    draw(){ const W=VW,Hh=VH, L=lay(); ctx.fillStyle='#1c1826'; ctx.fillRect(0,0,W,Hh); U.fillStyle='#1c1826'; U.fillRect(0,0,W,Hh); txt(title||'MINI GAMES',W/2,8,'#ffd98a',11,'center',true);
      LIST.forEach((a,i)=>{ const [x,y]=L.at(i), open=all||arcOpen(a.id), on=i===sel; uRR(x,y,L.w,L.h,L.h<30?4:6,open?a.col:'#3a3644',on?'#fff':CO,on?1.8:1); if(open){ if(L.h>=30) uRR(x+2,y+2,L.w-4,L.h*0.42,[5,5,0,0],'rgba(255,255,255,0.22)',null); U.font='bold 7.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; U.textAlign='center'; U.textBaseline='top'; U.fillStyle=CO; if(L.h<30){ U.font='bold 6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; U.fillText(a.name,x+L.w/2,y+L.h/2-3.5); U.textAlign='left'; return; } U.fillText(a.name,x+L.w/2,y+L.h/2-9); const b=META.best[a.id]; U.font='6px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; U.fillStyle='rgba(46,40,56,0.8)'; U.fillText(b?'best '+b:'tap to play',x+L.w/2,y+L.h/2+4); U.textAlign='left'; }
        else { U.globalAlpha=0.55; uRR(x+L.w/2-6,y+L.h/2-6,12,10,2,'#6a6478',CO,0.9); U.strokeStyle='#6a6478'; U.lineWidth=2; U.beginPath(); U.arc(x+L.w/2,y+L.h/2-6,4,Math.PI,0); U.stroke(); U.globalAlpha=1; txt('? ? ?',x+L.w/2,y+L.h/2+8,'#6a6478',6.5,'center',true); } });
      uRR(W/2-34,Hh-22,68,18,9,'rgba(255,255,255,0.1)','#a9a0b8',1); txt(isTouch()?'Back':keyName('b')+': back',W/2,Hh-17,'#f4ead8',7,'center',true);
      if(msgT>0){ U.font='6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(msg).width+16; uRR(W/2-tw/2,Hh-40,tw,13,6.5,'rgba(24,20,34,0.95)','#ffd98a',0.8); txt(msg,W/2,Hh-37,'#fff',6.5,'center'); } } }; }); }
async function arcPlay(id){
    if(id==='dj'){ S.fade=0; await djGame(); }
    if(id==='walk'){ await walkCore(); }
    if(id==='cub'){ let level=0; S.fade=0; if(META.cubDone) level=await choose('How fast should Mom push the cart?',['Easy','Fast','Weeeeee!'],'Mom'); S.fade=1; await cubCore(level); }
    if(id==='park'){ S.chapter=3; setMap('park'); P.visible=true; P.x=200; P.y=120; S.fade=0; await H.p_struct(); setMap('house'); }
    if(id==='guitar'){ const pr=guitarPlay(); await fadeTo(0,250); await pr; }
    if(id==='cube'){ const pr=cubeTour(); await fadeTo(0,250); const r=await pr; if(r.done){ best('cube',r.score); await showBoard('cube','ACTIVITY CUBE',r.score,''); } }
    if(id==='drums'){ const pr=drumGame({replay:true}); await fadeTo(0,250); const r=await pr; best('drums',r.score); await showBoard('drums','THE DRUMS',r.score,r.song); }
    if(id==='bed'){ setMap('bsmt'); P.visible=true; P.x=94; P.y=352; P.dir='down'; P.lift=4; P.zBias=70; S.snapCam=true; S.goal=''; const pr=bedJump(0); await fadeTo(0,300); const r=await pr; best('bed',r.score); await showBoard('bed','BED JUMPING',r.score,r.jumps+' jumps'); await fadeTo(1,250); P.lift=0; P.zBias=0; setMap('house'); }
    if(id==='bigslide'){ const pr=slideBig(); await fadeTo(0,250); await pr; }
    if(id==='curly'){ const pr=slideCurly(); await fadeTo(0,250); await pr; }
    if(id==='couch'){ const pr=couchDream(8); await fadeTo(0,250); await pr; }
    if(id==='dream'){ S.fade=0; S.fadeText=null; setMap('house'); P.visible=false; await dreams(); P.visible=true; }
    S.mini=null; S.rawTap=null; }
// ---------- developer mode: hidden. Open the link with #dev, type "camdev", or tap Cam's face badge five times fast ----------
const DEV_LIST=[{id:'ch1',name:'5:30 AM + dreams',col:'#8fd0f0'},{id:'ch2',name:'7:00 AM',col:'#8fd0f0'},{id:'ch3',name:'9:30 AM outings',col:'#8fd0f0'},{id:'walk',name:'Outing: walk',col:'#7bd95a'},{id:'park',name:'Outing: park',col:'#7bd95a'},{id:'cub',name:'Outing: Cub',col:'#7bd95a'},{id:'nap',name:'Home after outing',col:'#7bd95a'},
  {id:'pm',name:'1:30 PM',col:'#f0c828'},{id:'bsmt',name:'Basement',col:'#f0c828'},{id:'emory',name:'Emory arrives',col:'#f0c828'},{id:'yard',name:'Backyard',col:'#f0c828'},
  {id:'g-dream',name:'Game: dreams',col:'#e0a8f0'},{id:'g-couch',name:'Game: couch',col:'#e0a8f0'},{id:'g-dj',name:'Game: DJ song',col:'#e8845a'},{id:'g-walk',name:'Game: walk',col:'#e8845a'},{id:'g-park',name:'Game: playground',col:'#e8845a'},{id:'g-bigslide',name:'Game: big slide',col:'#e8845a'},{id:'g-curly',name:'Game: curly slide',col:'#e8845a'},{id:'g-cub',name:'Game: Cub Foods',col:'#e8845a'},
  {id:'g-guitar',name:'Game: guitar',col:'#ffd98a'},{id:'g-bed',name:'Game: bed jump',col:'#ffd98a'},{id:'g-cube',name:'Game: cube',col:'#ffd98a'},{id:'g-drums',name:'Game: drums',col:'#ffd98a'},{id:'unlock',name:'Unlock all mini games',col:'#c8c0d8'},{id:'hide',name:'Hide dev mode',col:'#c8c0d8'}];
function devOn(){ try{ return localStorage.getItem('cam_dev')==='1'; }catch(e){ return false; } }
function devWarp(id){ try{ sessionStorage.setItem('cam_warp',id); }catch(e){} location.hash=''; location.reload(); }
async function devMenu(){ S.cut=true; for(const k in NPC) NPC[k].visible=false;
  while(true){ S.fade=0; const id=await arcMenu(DEV_LIST,'DEVELOPER WARP',true); if(!id){ location.hash=''; location.reload(); return; }
    if(id==='hide'){ try{ localStorage.removeItem('cam_dev'); }catch(e){} location.hash=''; location.reload(); return; }
    if(id==='unlock'){ META.unl=META.unl||{}; for(const a of ARCADE) META.unl[a.id]=1; saveMeta(); jingle([659,784,1047],0.07,'triangle',0.05); continue; }
    if(id.indexOf('g-')===0){ P.sheet=camSheet(); await fadeTo(1,200); await arcPlay(id.slice(2)); S.fadeText=null; S.fadeSub=null; S.goal=''; S.targets=[]; DR.on=false; DR.w=0; document.body.classList.remove('dream'); continue; }
    devWarp(id); return; } }
async function arcade(){ let played=false; S.cut=true; P.sheet=camSheet(); for(const k in NPC) NPC[k].visible=false;
  while(true){ S.fade=0; const id=await arcMenu(); if(!id) break; played=true; await fadeTo(1,250);
    await arcPlay(id);
    S.mini=null; S.fadeText=null; S.fadeSub=null; S.goal=''; S.targets=[]; }
  S.cut=false; return played; }
// save points inside a chapter, and what the title screen calls them
const SAVE_PT={ home:f=>'back from '+({walk:'the walk',cub:'Cub Foods',park:'the park'}[f.lastOut]||'the outing'), lunch:f=>'lunch', daddy:f=>'after lunch',
  bs:f=>{ const n=Object.keys(f.bs||{}).filter(k=>f.bs[k]).length; return n>=3?'the drums':'the basement ('+n+' of 3 toys)'; }, yard:f=>'the backyard' };
async function boot(){
  let HASH=location.hash; try{ const w=sessionStorage.getItem('cam_warp'); if(w){ sessionStorage.removeItem('cam_warp'); HASH='#'+w; } }catch(e){}
  if(HASH==='#dev'){ try{ localStorage.setItem('cam_dev','1'); }catch(e){} }
  const sv=loadSave();
  S.title=true; S.titleScene=false;
  S.titleSub = sv&&sv.pt&&SAVE_PT[sv.pt] ? 'Saved: '+SAVE_PT[sv.pt](sv.flags||{}) : sv&&sv.ch>=6 ? 'Saved: Emory is here' : sv&&sv.ch>=5 ? 'Saved: the basement' : sv&&sv.ch>=4 ? 'Saved: 1:30 PM' : sv&&sv.ch>=3 ? 'Saved: 9:30 AM' : sv&&sv.ch>=2 ? 'Saved: 7:00 AM' : '';
  await new Promise(r=>S.titleRes=r); S.titleRes=null; audioKick();
  S.title=false;
  if(HASH==='#dev'){ await devMenu(); return; }
  let fresh=false; if(HASH==='#ch1'){ HASH=''; fresh=true; S.dreamFirst=true; }
  if(HASH==='#ch2'||HASH==='#ch3'){ S.inv=[]; S.flags={ch1done:true}; if(HASH==='#ch3'){ S.flags.ch2done=true; S.flags.dj=true; await chapter3(); } else await chapter2(); return; }
  if(!HASH&&!fresh){ while(true){ const n=ARCADE.filter(a=>arcOpen(a.id)).length; const c=await choose('',[sv&&sv.ch>=2?'Play the story':'Start the day','Mini games   '+n+' of '+ARCADE.length].concat(devOn()?['Developer warp']:[])); if(c===0) break; if(c===2){ await devMenu(); return; } const played=await arcade(); if(played){ location.reload(); return; } }
    S.dreamFirst=true; }
  if(sv&&sv.ch>=2&&!fresh&&!HASH){ const f=sv.flags||{}, list=[];   // newest first: the exact save point, then every major event and time of day ever reached
    const h=hiOf(sv);
    if(sv.pt&&SAVE_PT[sv.pt]) list.push(['Continue: '+SAVE_PT[sv.pt](f),'pt']);
    if(h.yard) list.push(['The backyard','yard']);
    if(h.ch>=6) list.push(['Emory is here','ch6']);
    if(h.drums) list.push(['The drums','drums']);
    if(h.ch>=5) list.push(['The basement','ch5']);
    if(h.ch>=5||h.ps>=4) list.push(['After lunch','daddy']);
    if(h.ch>=5||h.ps>=2) list.push(['Lunch','lunch']);
    if(h.ch>=4) list.push(['1:30 PM (nap is over)','ch4']);
    if(h.ch>=4||h.out) list.push(['Home after the outing','home']);
    if(h.ch>=3) list.push(['9:30 AM','ch3']);
    list.push(['7:00 AM','ch2'],['New game','new']);
    const c=await choose('Start where?',list.map(q=>q[0])); let pick=list[c][1];
    if(pick!=='new'){ S.inv=sv.inv||[]; const exact=pick==='pt'; if(exact) pick=sv.pt;
      S.flags=exact?Object.assign({},f,{ch1done:true}):{ch1done:true,outfit:f.outfit}; const F=S.flags;
      if(pick!=='ch2'){ F.ch2done=true; F.dj=true; }
      if(!['ch2','ch3'].includes(pick)){ F.outings=F.outings||1; F.gotMom=true; if(!S.inv.includes('monkey')) S.inv.push('monkey'); }
      if(['ch5','bs','drums','ch6','yard'].includes(pick)) F.pmStage=6;
      if(pick==='ch6'||pick==='yard') F.bsDone=true;
      if(pick==='yard'){ S.chapter=6; S.clock='4:00 PM'; S.tick=null; S.hud=null; P.sheet=camSheet(); S.cut=true; S.fade=1; await toYard(); if(S.fade>0) await fadeTo(0,500); S.cut=false; }
      else if(pick==='ch6'){ S.cut=true; S.fade=1; await chapter6(); S.cut=false; }
      else if(pick==='drums'){ F.bs={guitar:true,cube:true,bed:true}; await bsResume(); }
      else if(pick==='bs'){ await bsResume(); }
      else if(pick==='ch5'){ for(const k in NPC) NPC[k].visible=true; S.cut=true; S.fade=1; await chapter5(); S.cut=false; }
      else if(pick==='daddy') await resumeDaddy();
      else if(pick==='lunch') await resumeLunch();
      else if(pick==='ch4') await chapter4();
      else if(pick==='home'){ S.chapter=3; S.clock='9:30 AM'; P.sheet=camSheet(); for(const k in NPC) NPC[k].visible=true; for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.delete(o.id); doors.cam=true; S.cut=true; S.fade=1; save('home'); await backHome(); S.cut=false; }
      else if(pick==='ch3') await chapter3(); else await chapter2();
      return; } }
  if(['#walk','#park','#nap','#pm'].includes(HASH)){ S.chapter=3; S.clock='9:30 AM'; S.flags={gotMom:true,outings:1}; S.inv=['monkey']; P.sheet=camSheet(); for(const k in NPC) NPC[k].visible=true; for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.delete(o.id); doors.cam=true; S.cut=true;
    if(HASH==='#walk'){ window._res=await walkOuting(); await backHome(); }
    if(HASH==='#park'){ window._res=await parkOuting(); await backHome(); }
    if(HASH==='#nap'){ await backHome(); }
    if(HASH==='#pm'){ S.cut=false; await chapter4(); return; }
    S.cut=false; return; }
  if(HASH==='#emory'||HASH==='#yard'){ S.chapter=5; S.flags={gotMom:true,outings:1,ch2done:true,pmStage:6,bsDone:true}; S.inv=['monkey']; P.sheet=camSheet(); S.cut=true; S.fade=1; await chapter6(); if(HASH==='#yard') await toYard(); S.cut=false; return; }
  if(HASH==='#drums'){ S.chapter=5; S.flags={gotMom:true,outings:1,ch2done:true,pmStage:6}; S.inv=['monkey']; P.sheet=camSheet(); S.cut=true; S.fade=0; const r=await drumGame({replay:true}); best('drums',r.score); await showBoard('drums','THE DRUMS',r.score,r.song); S.mini=null; S.fade=1; await chapter5(); S.cut=false; return; }
  if(HASH==='#bsmt'){ S.chapter=4; S.flags={gotMom:true,outings:1,ch2done:true,pmStage:6}; S.inv=['monkey']; P.sheet=camSheet(); for(const k in NPC) NPC[k].visible=true; S.cut=true; S.fade=1; await chapter5(); S.cut=false; return; }
  if(HASH==='#cub'){ S.chapter=3; S.clock='9:30 AM'; S.flags={gotMom:true}; for(const k in NPC) NPC[k].visible=true; S.cut=true; const r=await cubOuting(); window._cubRes=r; await backHome(); S.cut=false; return; }
  S.inv=[]; S.flags={}; S.cut=true; await chapter1(); S.cut=false;
}
