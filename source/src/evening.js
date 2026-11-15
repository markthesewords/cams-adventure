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
  await say('Dad','Go on up, bud. I\'m right behind you.');
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
  setMap('house'); S.chapter=6; S.clock='4:00 PM'; S.light='day'; S.glows=[]; S.goal=''; S.targets=[]; S.extra=[]; S.bounds=null; S.camFocus=null; S.tick=null; S.hud=null; S.flags.yard=false; save();
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
  for(const x of [n,g,r,l,v]){ x.visible=false; x.path=null; x.follow=false; }
  setMap('yard'); S.clock='4:05 PM'; S.light='day'; S.goal=''; S.targets=[]; S.flags.yard=true; save('yard');
  hidden.add('y_slider'); hidden.delete('y_sliderOpen');
  const D=DATA_YARD.objs.find(o=>o.id==='y_slider'), dx=D.x+D.w/2;
  P.x=dx; P.y=D.y-6; P.dir='up'; P.lift=0; P.zBias=0; S.snapCam=true;
  e.visible=true; e.path=null; e.x=dx-34; e.y=D.y-40; e.dir='down';
  await fadeTo(0,600);
  await walk(P,[[dx,D.y-22]],36); bubble(P,'Wooooow',1300); await wait(700);
  bubble(e,'Cam! This way!',1400); await wait(900);
  yardEmory();
  setGoal('That\'s everything built so far. Play in the backyard.');
}
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
  npc_emory: async()=>{ const e=NPC.emory; e.dir=faceTo(e,P); bubble(e,'Cam!!',1100); await wait(500); await spinPair(P,e,1); bubble(P,'Yeah!',900); await wait(500); },
  bsmtdoor: async()=>{ await say('Dad','Drums later, bud. Emory\'s here.'); },
  y_slide: async()=>{ const o=DATA_YARD.objs.find(q=>q.id==='y_slide'); S.noCollide=true;
    await walk(P,[[o.x-5,o.y+16]],40); P.dir='right'; P.zBias=40;
    for(let i=0;i<4;i++){ P.x+=3.5; P.y-=1.5; P.lift=3+i*2.5; blip(200+i*40,0.05,0.04,'triangle'); await wait(260); }
    P.dir='down'; bubble(P,'Whoaaaa!',1100); await wait(900);
    const x0=P.x,y0=P.y,l0=P.lift; for(let i=1;i<=12;i++){ const k=i/12; P.x=x0+k*20; P.y=y0+k*28; P.lift=l0*(1-k); if(i%3===0) blip(900-i*40,0.04,0.04,'triangle'); await wait(35); }
    P.lift=0; P.zBias=0; await walk(P,[[P.x+4,P.y+8]],50); S.noCollide=false; bubble(P,'Yeah!',1100); jingle([784,988,1175],0.07,'triangle',0.05); await hop(P,1); },
  y_gate: async()=>{ await say('','The gate to the driveway. Latched, and the latch is way up high.'); },
  y_backdoor: async()=>{ await say('','The back door. Closed.'); },
  y_slider: async()=>{ S.fadeText='To be continued'; S.fadeSub=''; await fadeTo(1,1200); await wait(2400); S.fadeText=null; S.fadeSub=null; await fadeTo(0,600); },
};
