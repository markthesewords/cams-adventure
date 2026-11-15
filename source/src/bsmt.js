// ================= Chapter 5: the basement =================
const BS={top:[236,94],land:[238,190],sticks:[294,304],kit:[274,324],throne:[259,324],seat:[265,374],door:[176,264],bedTop:[94,352]};
const bsObj=id=>DATA_BSMT.objs.find(o=>o.id===id);
function bsLeft(){ const b=S.flags.bs||{}; return ['guitar','cube','bed'].filter(k=>!b[k]); }
function bsGoal(){ const L=bsLeft(); if(L.length) setGoal('Keep busy while the drums load.',L.map(k=>'b_'+k)); }
function nickSit(){ const n=NPC.nick; n.x=BS.seat[0]; n.y=BS.seat[1]; n.dir='down'; n.seated=true; n.zBias=0; }
async function chapter5(){
  const n=NPC.nick, g=NPC.grace, v=NPC.vinny;
  claim(n); claim(g); v.follow=false; v.path=null; v.sleep=false; v.lie=false; v.zBias=0;
  setMap('bsmt'); S.chapter=5; S.clock='2:15 PM'; S.light='day'; S.glows=[]; S.goal=''; S.targets=[]; S.extra=[]; S.bounds=null; S.noCollide=false; S.camFocus=null;
  S.flags.bs={}; S.flags.bsReady=false; S.flags.bsDone=false; hidden.delete('b_sticks'); save();
  g.visible=false; v.visible=false; n.visible=true; n.seated=false; n.onCouch=false; P.sit=0; P.carry=null; P.lift=0; P.zBias=0; P.lying=false; P.seated=false;
  P.x=BS.top[0]; P.y=BS.top[1]; P.dir='down'; n.x=BS.top[0]+8; n.y=BS.top[1]-10; n.dir='down'; S.snapCam=true;
  S.tick=bsTick; S.hud=bsHud; BSN.on=false; BSN.noise=0;
  await fadeTo(0,700);
  // down the last steps together
  walk(n,[[246,170],[252,206]],30);
  for(let i=0;i<5;i++){ await walk(P,[[BS.top[0],BS.top[1]+16+i*16]],26); blip(150-i*8,0.07,0.06,'triangle'); await wait(160); }
  await walk(P,[BS.land],30); await wait(300);
  // the sticks!
  P.dir='right'; bubble(P,'!',700); blip(900,0.08,0.05,'triangle'); await wait(650);
  await walk(P,[[262,236],BS.sticks],78); hidden.add('b_sticks'); S.flags.sticks=true; jingle([660,880,1100],0.07,'triangle',0.05); bubble(P,'Sticks!',900); await wait(800);
  await walk(P,[BS.kit],84); P.dir='left'; bubble(P,'OH OH OH!!!!',2000); jingle([523,659,784,1047],0.08,'triangle',0.06); await hop(P,3); await wait(500);
  await walk(n,[[262,300],[BS.seat[0],BS.seat[1]-2]],46); nickSit(); for(let i=0;i<3;i++){ blip(500+i*140,0.05,0.04,'square'); await wait(140); }
  await say('Dad','Ok just a second I have to turn everything on - you know it takes a minute to load!');
  bubble(P,'Oh oh oh?',1200); await wait(900);
  bsGoal();
}
// one of the three is finished: Vinny after the first, Mom after the second, the drums after the third
async function bsProgress(k){
  const n=NPC.nick, g=NPC.grace, v=NPC.vinny; if(S.flags.bs[k]) return; S.flags.bs[k]=true; save(); const done=3-bsLeft().length;
  if(done===1){ S.goal=''; S.targets=[];
    for(let i=0;i<4;i++){ blip(120+i*10,0.06,0.07,'triangle'); S.shake=0.08; await wait(180); }
    v.visible=true; v.sleep=false; v.lie=false; v.follow=false; v.x=BS.top[0]; v.y=BS.top[1]; v.dir='down';
    await walk(v,[[240,196],[P.x+16,P.y+8]],104); v.dir=P.x<v.x?'left':'right'; bubble(v,'*wag wag*',1200); blip(200,0.12,0.07,'square'); await wait(900);
    await say('','Vinny heard the fun. He is not leaving your side.'); v.follow=true; crumbs.length=0; }
  if(done===2){ S.goal=''; S.targets=[];
    for(let i=0;i<5;i++){ blip(170-i*6,0.05,0.05,'triangle'); await wait(200); }
    g.visible=true; g.x=BS.top[0]; g.y=BS.top[1]; g.dir='down'; g.seated=false; await walk(g,[[240,196],[266,238]],48); g.dir='down'; n.seated=false; n.dir='up'; await wait(400);
    await say('Mom','You guys good down here if I go do my own thing?');
    await say('Dad','Absolutely.');
    bubble(g,'Have fun, boys!',1300); await wait(900); await walk(g,[[240,196],BS.top],52); g.visible=false; nickSit(); }
  if(done<3){ bsGoal(); return; }
  // the drums are ready
  S.goal=''; S.targets=[]; S.flags.bsReady=true; save();
  jingle([523,659,784,1047,1319],0.08,'triangle',0.06); bubble(n,'It\'s ready!',1500); await wait(900);
  await say('Dad','Okay bud, it finally loaded. Come here, let\'s play some drums!');
  bubble(P,'OH OH OH!!!!',1600); await hop(P,2);
  await bsToThrone(); await bsDrumScene();
}
async function bsToThrone(){
  const n=NPC.nick; n.seated=false; S.noCollide=true; await walk(n,[[P.x+12,P.y+1]],74); n.dir='left'; P.carry=n; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(350);
  await walk(n,[[BS.throne[0]+14,BS.throne[1]+4]],54); n.dir='left'; await wait(200);
  P.carry=null; P.lift=4; P.zBias=4; P.x=BS.throne[0]; P.y=BS.throne[1]; P.dir='left'; blip(300,0.05,0.04,'triangle'); await wait(300);
  await walk(n,[[BS.throne[0]+22,BS.throne[1]+12]],40); n.dir='left';
}
async function bsDrumScene(replay){
  const n=NPC.nick, v=NPC.vinny;
  await fadeTo(1,350); const pr=drumGame({replay:!!replay}); await fadeTo(0,350); const r=await pr;
  const isBest=best('drums',r.score); await showBoard('drums','THE DRUMS',r.score,r.song);
  await fadeTo(1,300); S.mini=null; S.snapCam=true;
  if(replay){ P.lift=0; P.zBias=0; P.x=BS.throne[0]+12; P.y=BS.throne[1]+6; P.dir='down'; S.noCollide=false; await fadeTo(0,300); await walk(n,[[BS.seat[0],BS.seat[1]-2]],46); nickSit(); return; }
  P.lift=4; P.zBias=4; P.x=BS.throne[0]; P.y=BS.throne[1]; P.dir='down'; await fadeTo(0,300);
  award('drummer'); await wait(900);
  await say('Dad','That was awesome, dude! High five!'); bubble(P,'Yeah!!!',1200); blip(900,0.05,0.05,'triangle'); await wait(1000);
  if(v.visible){ bubble(v,'Awooo!',1300); blip(260,0.3,0.06,'sawtooth'); await wait(900); }
  S.flags.bsDone=true; save();
  await emoryIsHere();
}
// ---------------- the sneak: noise is the only thing Dad has to go on ----------------
const BSN={on:false,noise:0,sq:{},cool:0,warn:0};
function bsInBedroom(){ return P.x<166&&P.y>250; }
function bsTick(dt){
  if(S.map!=='bsmt') return; const v=NPC.vinny, inRoom=bsInBedroom();
  if(inRoom&&!BSN.on){ BSN.on=true; BSN.noise=0; BSN.sq={}; if(v.visible&&v.follow){ v.follow=false; walk(v,[[BS.door[0]+6,BS.door[1]]],70).then(()=>{ v.dir='left'; v.lie=true; }); } S.tip={txt:'Shhh. Walk, don\'t run. Mind the toys.',until:S.t+4}; }
  if(!inRoom&&BSN.on){ BSN.on=false; BSN.noise=0; if(v.visible&&!v.follow){ v.lie=false; v.follow=true; crumbs.length=0; } }
  if(S.tip&&S.tip.until&&S.t>S.tip.until) S.tip=null;
  if(!BSN.on) return;
  if(P.moving) BSN.noise+=(P.running?70:4)*dt; else BSN.noise-=14*dt;
  for(const id of ['b_sq0','b_sq1','b_sq2','b_sq3']){ const o=bsObj(id); const d=Math.hypot(P.x-(o.x+o.w/2),P.y-(o.y+o.h/2)); if(d<7&&!BSN.sq[id]){ BSN.sq[id]=1; BSN.noise+=42; blip(1400,0.12,0.07,'square'); setTimeout(()=>blip(1000,0.1,0.06,'square'),90); bubble(P,'*SQUEAK*',900); S.shake=0.1; } else if(d>12) BSN.sq[id]=0; }
  BSN.noise=Math.max(0,BSN.noise);
  if(BSN.noise>=100){ BSN.noise=0; runHandler('bs_heard',null); }
}
function bsMeter(noise,strikes,y){ const W=VW, w=Math.min(120,W-150), x=W/2-w/2, label='NOISE'; if(y===undefined) y=5; if(w<50) return;
  uRR(x-14,y-2,w+18,11,5.5,'rgba(28,24,40,0.85)',null); txt(label,x-10,y+0.5,'#a9a0b8',5,'left',true);
  const bx=x+16, bw=w-18; uRR(bx,y+1.5,bw,4,2,'rgba(255,255,255,0.14)',null); const k=Math.min(1,noise/100); uRR(bx,y+1.5,Math.max(2,bw*k),4,2,k>0.75?'#ff7a6a':k>0.45?'#ffd98a':'#7bd95a',null);
  if(strikes!==undefined) for(let i=0;i<2;i++) uCirc(x+w+8+i*7,y+3.5,2.4,i<strikes?'#ff7a6a':'rgba(255,255,255,0.2)',CO,0.6); }
function bsHud(){ if(S.map==='bsmt'&&BSN.on&&!S.mini&&!S.lock) bsMeter(BSN.noise,undefined,VH-34); }
// ---------------- handlers ----------------
CH[5]={
  npc_nick: async()=>{ const L=bsLeft();
    if(S.flags.bsDone) await say('Dad','Want to play some more? The drums are right there, bud.');
    else if(L.length===3) await say('Dad','Still loading, dude. Go find something to do. Just not the guitar. ...Okay, maybe the guitar.');
    else await say('Dad',['Almost there. This computer is older than you are.','Any second now. Probably.'][L.length%2]); },
  npc_vinny: async()=>{ bubble(NPC.vinny,'*lick*',900); blip(240,0.08,0.05,'square'); await wait(600); bubble(P,'Hee hee!',900); },
  npc_grace: async()=>{},
  bs_drums: async()=>{ if(S.flags.bsDone){ const c=await choose('Play the drums again?',['Yes!','Not now']); if(c===0){ await bsToThrone(); await bsDrumScene(true); } return; }
    bubble(P,'Oh oh oh?',1000); for(let i=0;i<3;i++){ blip(180,0.03,0.03,'triangle'); await wait(160); } await say('Dad','Not yet, bud! It\'s still loading. Nothing will come out.'); },
  bs_guitar: async()=>{ const pr=guitarPlay(); const r=await pr; S.mini=null; if(r.plucks>=6){ unlock('guitar'); award('strum'); await bsProgress('guitar'); } },
  bs_cube: async()=>{ await fadeTo(1,250); const pr=cubeTour(); await fadeTo(0,250); const r=await pr; if(r.done){ best('cube',r.score); await showBoard('cube','ACTIVITY CUBE',r.score,''); }
    await fadeTo(1,250); S.mini=null; await fadeTo(0,250); if(r.done){ S.tip={txt:'Activity cube: '+r.score+' points',until:S.t+4}; award('cube'); await bsProgress('cube'); } },
  bs_heard: async()=>{ const n=NPC.nick; S.shake=0.15; blip(200,0.2,0.06,'sawtooth');
    await say('Dad','(from the other room) Cam? Where\'d you go, bud? Come back out here.');
    S.noCollide=true; await walk(P,[[150,264],[196,266],[236,256]],50); S.noCollide=false; P.dir='down'; await say('','Busted. Maybe quieter next time.'); },
  bs_bed: async()=>{ const n=NPC.nick, v=NPC.vinny;
    if(!bsInBedroom()) return;
    // crawl up onto the bed
    S.noCollide=true; bubble(P,'...',700); const side=P.x<70?[70,P.y]:P.x>118?[118,P.y]:[P.x,338]; await walk(P,[side],18); P.zBias=70; P.lift=3; blip(260,0.05,0.03,'triangle'); await walk(P,[BS.bedTop],14); P.lift=4; P.dir='down'; await wait(300);
    const g0=S.goal, t0=S.targets; S.goal=''; S.targets=[]; const r=await bedJump(BSN.noise); S.mini=null; BSN.noise=0;
    // Dad comes to see what the racket is
    S.camFocus=null; n.seated=false; bubble(P,'Uh oh.',1200); await walk(n,[[236,262],[176,264],[150,266],[147,300],[147,348]],70); n.dir='left'; await wait(300);
    await say('Dad','Hey! No jumping on the bed!');
    bubble(P,'Hee hee hee!',1200); await wait(600);
    await walk(P,[[128,348]],22); P.dir='right'; await wait(200); P.carry=n; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(300);
    await walk(n,[[147,300],[150,266],[176,264],[236,262],[286,280]],56); n.dir='left'; P.carry=null; P.lift=0; P.zBias=0; P.x=n.x-13; P.y=n.y+2; P.dir='right'; S.noCollide=false; blip(300,0.05,0.04,'triangle'); await wait(300);
    best('bed',r.score); await showBoard('bed','BED JUMPING',r.score,r.jumps+' jumps'); S.tip={txt:'Bed jumping: '+r.score+' points, '+r.jumps+' jumps',until:S.t+4}; if(r.jumps>=15) award('bed');
    await say('Dad',r.jumps>=10?'How long were you up there?! ...Stay where I can see you, goofball.':'Stay where I can see you, goofball.');
    await walk(n,[[BS.seat[0],BS.seat[1]-2]],50); nickSit();
    await bsProgress('bed'); },
  bs_stairs: async()=>{ if(S.flags.bsDone){ await say('Dad','We\'ll head up for dinner soon, bud.'); S.fadeText='To be continued'; S.fadeSub='Next: dinner at Frenchman\'s'; await fadeTo(1,1200); await wait(2600); S.fadeText=null; S.fadeSub=null; await fadeTo(0,600); }
    else await say('Dad','Stay down here with me, bud. It\'s almost ready.'); },
  bs_door: async()=>{ await say('','Closed. Nothing fun in there anyway.'); },
  bs_desk: async()=>{ await say('','A lot of cables, two speakers, and a progress bar that has not moved.'); },
  bs_easel: async()=>{ bubble(P,'A, B, C!',1100); await wait(800); await say('','Magnet letters and four cups of paint. Somebody has rearranged the letters.'); },
  bs_amp: async()=>{ await say('','The amp hums a little. Dad says not to touch the knobs. All the knobs are at Cam height.'); },
  bs_bar: async()=>{ await say('','The bar. Too tall to see over.'); }, bs_stool: async()=>{ await say('','A bar stool. Not the breakfast kind.'); },
  bs_kbar: async()=>{ await say('','The little sink. Out of reach.'); }, bs_fridge: async()=>{ await say('','Cold drinks for grown-ups.'); },
  bs_couch: async()=>{ bubble(P,'Oof.',700); await hop(P,1); await say('','The basement couch. It has eaten many toys.'); },
  bs_recl: async()=>{ await say('','Dad\'s recliner. It has a lever. The lever is the best part.'); },
  bs_fire: async()=>{ await say('','The brick fireplace. Hot means no touch.'); }, bs_tv: async()=>{ await say('','The basement TV is off. The drums are better anyway.'); },
  bs_wallguitar: async()=>{ await say('','One of Dad\'s guitars, way up on the wall. Look with your eyes.'); },
  bs_wall: async()=>{ await say('','Dad\'s wall of stuff. A clock made out of a record. Signs with words.'); },
  bs_chart: async()=>{ bubble(P,'Baa!',900); blip(300,0.2,0.05,'sawtooth'); await wait(700); await say('','The animal chart. Sheep, pigs, cows. Cam knows what the sheep says.'); },
  bs_poster: async()=>{ await say('','A concert poster from a show Dad went to.'); },
  bs_dresser: async()=>{ await say('','Drawers full of sweaters.'); },
  _nothing: async()=>{},
};
// ================= Dad's guitar: free play =================
function guitarPlay(){
  return new Promise(resolve=>{
    const OPEN=[82.4,110,146.8,196,246.9,329.6]; const G={t:0,str:2,fret:0,plucks:0,vib:[0,0,0,0,0,0],cap:'Dad\'s red guitar. Strum it!',capT:3,said:0};
    const pluck=i=>{ G.vib[i]=1; G.plucks++; const f=OPEN[i]*Math.pow(2,G.fret*2/12); blip(f,0.7,0.07,'triangle'); blip(f*2,0.25,0.02,'sawtooth');
      if(G.plucks===4&&G.said<1){ G.said=1; G.cap='Careful with that one, bud!'; G.capT=2.6; } if(G.plucks===12&&G.said<2){ G.said=2; G.cap='Hey, that almost sounded like a song!'; G.capT=2.6; } if(G.plucks===30&&G.said<3){ G.said=3; G.cap='Okay, okay. Rock star.'; G.capT=2.6; } };
    S.mini={ full:true, G, guitar:true, dpad:true,
      taps(){ const W=VW,Hh=VH, cx=W/2, cy=Hh*0.48, k=Math.min(1,(W-16)/300); return [{x:cx-190*k,y:cy-34*k,w:330*k,h:68*k,fn(x,y){ const i=Math.max(0,Math.min(5,Math.round(((y-cy)/k+8.5)/3.4))); if(x<cx+14*k) G.fret=Math.max(0,Math.min(6,Math.round(((x-cx)/k+116)/22))); G.str=i; pluck(i); }}]; },
      update(dt){ G.t+=dt; if(G.capT>0) G.capT-=dt; for(let i=0;i<6;i++) G.vib[i]*=Math.max(0,1-dt*3.2);
        if(hit('up')){ G.str=Math.max(0,G.str-1); pluck(G.str); } if(hit('down')){ G.str=Math.min(5,G.str+1); pluck(G.str); }
        if(hit('left')){ G.fret=Math.max(0,G.fret-1); blip(300,0.03,0.02,'triangle'); } if(hit('right')){ G.fret=Math.min(6,G.fret+1); blip(360,0.03,0.02,'triangle'); }
        if(hit('a')) pluck(G.str);
        if(hit('b')&&G.t>0.6){ resolve(G); } },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh); let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#3c6a54'); g.addColorStop(1,'#2a4a3c'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
        const cx=W/2, cy=Hh*0.48, k=Math.min(1,(W-16)/300); U.save(); U.translate(cx,cy); U.scale(k,k);
        // neck, headstock (plain), body, pickguard
        uRR(-150,-11,170,22,3,'#e2be82',CO,1.2); for(let i=0;i<7;i++){ U.fillStyle='#b8bcc4'; U.fillRect(-122+i*22,-11,1.6,22); if(i===2||i===4){ uCirc(-111+i*22,0,2,'#3a3028',null); } }
        uPoly([[-150,-12],[-178,-15],[-186,-6],[-182,10],[-150,12]],'#e2be82',CO,1.2); for(let i=0;i<6;i++) uCirc(-176+i*4.4,-13+i*0.6,2,'#c8ccd4',CO,0.6);
        U.beginPath(); U.moveTo(14,-12); U.lineTo(14,-28); U.bezierCurveTo(20,-46,60,-48,78,-40); U.bezierCurveTo(96,-34,130,-46,138,-8); U.bezierCurveTo(142,28,118,50,90,46); U.bezierCurveTo(72,44,64,36,50,37); U.bezierCurveTo(40,38,34,34,32,26); U.bezierCurveTo(30,18,24,13,14,12); U.closePath(); U.fillStyle='#c8242c'; U.fill(); U.strokeStyle=CO; U.lineWidth=1.6; U.stroke();
        U.beginPath(); U.moveTo(22,-24); U.bezierCurveTo(40,-33,70,-31,82,-20); U.lineTo(86,4); U.bezierCurveTo(86,20,72,29,56,27); U.bezierCurveTo(44,26,38,20,36,13); U.lineTo(22,11); U.closePath(); U.fillStyle='#18181c'; U.fill(); U.strokeStyle='#3a3a42'; U.lineWidth=0.8; U.stroke();
        U.beginPath(); U.ellipse(100,-38,26,5,0.25,Math.PI,Math.PI*1.9); U.strokeStyle='rgba(255,255,255,0.35)'; U.lineWidth=1.4; U.stroke();
        uRR(40,-14,10,28,2,'#c8ccd4',CO,0.8); uRR(96,-16,14,32,2,'#c8ccd4',CO,0.8); uRR(92,24,34,9,3,'#c8ccd4',CO,0.8); uCirc(100,28.5,2.6,'#8a8f9a',CO,0.6); uCirc(112,28.5,2.6,'#8a8f9a',CO,0.6);
        // fret marker for where Cam's other hand is
        const fx=-116+G.fret*22; uRR(fx-9,-13,18,26,4,'rgba(255,217,138,0.28)','#ffd98a',1);
        for(let i=0;i<6;i++){ const y=-8.5+i*3.4, a=G.vib[i]; U.strokeStyle=i===G.str?'#ffd98a':'#eef0f4'; U.lineWidth=0.7+i*0.12+(i===G.str?0.5:0); U.beginPath(); U.moveTo(-176,y*0.6-10+i*1.1); U.lineTo(-150,y); for(let x=-150;x<=106;x+=8) U.lineTo(x,y+Math.sin(x*0.25+G.t*60)*a*2.2*Math.sin((x+150)/256*Math.PI)); U.stroke(); }
        U.restore();
        txt('DAD\'S GUITAR',W/2,8,'#ffd98a',9,'center',true); txt(G.plucks+' strums',W/2,20,'#cfe8d8',6.5,'center');
        const h='▲▼ strum    ◀ ▶ slide    '+keyName('a')+' pluck    '+keyName('b')+' done'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,Hh-(G.capT>0?27:12),tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,Hh-(G.capT>0?25:10),'rgba(255,255,255,0.92)',5.5,'center');
        if(G.capT>0) bsCap(G.said?'Dad':'',G.cap); } };
  });
}
// ================= jumping on the bed =================
function bedJump(noise0){
  return new Promise(resolve=>{
    const B=[62,334,126,374]; const G={t:0,noise:Math.min(60,noise0||0),strikes:0,charge:0,air:0,airT:0,h:0,score:0,jumps:0,streak:0,cap:(isTouch()?'Hold the screen':'Hold '+keyName('a'))+' longer to jump higher. Higher is louder.',capT:4,capWho:'',fx:[],done:false,base:0,big:0};
    G.b0=0; G.hard=1;
    const bust=()=>{ if(G.done) return; if(G.strikes===0){ G.strikes=1; G.streak=0; G.b0=G.t-22; G.noise=Math.max(40,(G.t-G.b0-6)*2); G.cap='Cam? What are you doing in there?'; G.capWho='Dad'; G.capT=3; blip(200,0.2,0.06,'sawtooth'); S.shake=0.12; }
      else { G.done=true; P.lift=4; G.cap='CAM!'; G.capWho='Dad'; G.capT=2; blip(160,0.3,0.07,'sawtooth'); setTimeout(()=>resolve(G),900); } };
    S.mini={ G, bed:true, holdA:true,
      update(dt){ G.t+=dt; if(G.capT>0) G.capT-=dt; for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<0.9); if(G.done) return;
        G.hard=1+(G.t-G.b0)/30; G.base=Math.max(0,(G.t-G.b0-6)*2); G.noise=Math.max(G.base,G.noise-13/G.hard*dt); if(!G.creak&&G.base>18){ G.creak=1; G.cap='The bed is starting to creak...'; G.capWho=''; G.capT=2.6; }
        if(G.air<=0&&G.noise>=100) bust();
        if(G.air>0){ G.air-=dt; const k=1-G.air/G.airT; P.lift=4+Math.sin(k*Math.PI)*G.h; P.anim+=dt;
          if(G.air<=0){ P.lift=4; const c=G.lastC; G.noise+=(7+c*36)*G.hard; const pts=Math.round((6+c*44)*(1+Math.min(G.streak,10)*0.08)); G.score+=pts; G.jumps++; G.streak++; G.fx.push({txt:'+'+pts,t:0,x:P.x,y:P.y}); blip(150+c*90,0.09,0.03+c*0.05,'triangle'); if(c>0.8){ S.shake=0.08; G.big++; if(G.big%3===1) bubble(P,'(wheee)',800); }
            if(G.noise>=100) bust(); } return; }
        const ax=(K.right?1:0)-(K.left?1:0), ay=(K.down?1:0)-(K.up?1:0); if(ax||ay){ P.x=Math.max(B[0],Math.min(B[2],P.x+ax*26*dt)); P.y=Math.max(B[1],Math.min(B[3],P.y+ay*26*dt)); P.dir=ax>0?'right':ax<0?'left':ay<0?'up':'down'; G.noise+=1.5*dt; }
        if(K.a){ G.charge=Math.min(1,G.charge+dt/0.75); P.lift=4-G.charge*2.5; }
        else if(G.charge>0){ const c=G.charge; G.charge=0; G.lastC=c; G.h=5+c*17; G.airT=G.air=0.3+c*0.36; blip(300+c*240,0.06,0.03,'triangle'); }
        hit('a'); hit('b'); },
      draw(){ const W=VW,Hh=VH; bsMeter(G.noise,G.strikes);
        box(3,17,58,13,'rgba(28,24,40,0.85)'); txt(String(G.score),8,20,'#ffd98a',7,'left',true); txt(G.jumps+' jumps',56,21,'#a9a0b8',5.5,'right');
        const ox=Math.round(S.cam.x), oy=Math.round(S.cam.y);
        if(G.charge>0&&!G.done){ const x=P.x-ox, y=P.y-oy-34; uRR(x-10,y,20,4,2,'rgba(28,24,40,0.85)',CO,0.6); uRR(x-9,y+1,18*G.charge,2,1,G.charge>0.8?'#ff7a6a':'#ffd98a',null); }
        for(const f of G.fx){ U.globalAlpha=1-f.t/0.9; txt(f.txt,f.x-ox,f.y-oy-30-f.t*14,'#ffd98a',7,'center',true); U.globalAlpha=1; }
        if(G.capT>0) bsCap(G.capWho,G.cap);
        else { const h='◀▲▼▶ move    hold '+keyName('a')+' then let go: jump'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); } } };
  });
}
// ================= the activity cube: turn it, do a little of each side =================
function cubeTour(){
  return new Promise(resolve=>{
    const FACES=['Bead maze','Shape sorter','Peek-a-boo doors','Mix and match']; const COL=['#3c78dc','#dc3c32','#3caa50','#f0c828'];
    const PAR=[26,16,24,14];   // seconds until a side's speed bonus has drained to nothing
    const G={t:0,mode:'hub',face:0,done:[0,0,0,0],pts:[0,0,0,0],spin:0,bonks:0,T:0,T2:0,msg:'',msgT:0,parts:[],st:null,fin:false,gain:null};
    const bonus=()=>Math.max(0,Math.round(300*(1-G.T/PAR[G.face]))); const total=()=>Math.max(0,G.pts.reduce((a,b)=>a+b,0)-G.bonks*25);
    const say2=(s,d)=>{ G.msg=s; G.msgT=d||1.6; }; const pop=(x,y,c)=>{ for(let i=0;i<8;i++){ const a=Math.random()*6.28; G.parts.push({x,y,vx:Math.cos(a)*50,vy:Math.sin(a)*50-20,t:0,c}); } };
    const SH=['circle','square','triangle','star'];
    const drawShape=(s,x,y,r,fill,stroke)=>{ if(s==='circle') uCirc(x,y,r,fill,stroke,1.2); else if(s==='square') uRR(x-r*0.9,y-r*0.9,r*1.8,r*1.8,1.5,fill,stroke,1.2); else if(s==='triangle') uPoly([[x,y-r],[x+r,y+r*0.85],[x-r,y+r*0.85]],fill,stroke,1.2); else { const p=[]; for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r*1.05; p.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]); } uPoly(p,fill,stroke,1.2); } };
    const ANI=['dog','bug','cat'];
    const drawPart=(a,part,x,y,w,h)=>{ const c={dog:'#b07a48',bug:'#e86aa0',cat:'#f09a3a'}[a], d={dog:'#7a5230',bug:'#a83a6c',cat:'#b86a1a'}[a];
      if(part===0){ uCirc(x+w/2,y+h*0.58,h*0.36,c,CO,1); if(a==='dog'){ uRR(x+w/2-h*0.5,y+h*0.3,h*0.2,h*0.42,3,d,CO,0.8); uRR(x+w/2+h*0.3,y+h*0.3,h*0.2,h*0.42,3,d,CO,0.8); } if(a==='cat'){ uPoly([[x+w/2-h*0.34,y+h*0.36],[x+w/2-h*0.26,y+h*0.08],[x+w/2-h*0.1,y+h*0.28]],c,CO,0.8); uPoly([[x+w/2+h*0.34,y+h*0.36],[x+w/2+h*0.26,y+h*0.08],[x+w/2+h*0.1,y+h*0.28]],c,CO,0.8); } if(a==='bug'){ U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(x+w/2-4,y+h*0.26); U.lineTo(x+w/2-9,y+h*0.06); U.moveTo(x+w/2+4,y+h*0.26); U.lineTo(x+w/2+9,y+h*0.06); U.stroke(); uCirc(x+w/2-9,y+h*0.06,1.6,d,null); uCirc(x+w/2+9,y+h*0.06,1.6,d,null); }
        uCirc(x+w/2-h*0.13,y+h*0.52,1.5,CO,null); uCirc(x+w/2+h*0.13,y+h*0.52,1.5,CO,null); U.strokeStyle=CO; U.lineWidth=0.9; U.beginPath(); U.arc(x+w/2,y+h*0.66,h*0.1,0.2,2.9); U.stroke(); }
      else if(part===1){ uRR(x+w*0.26,y+1,w*0.48,h-2,5,c,CO,1); if(a==='dog'){ uCirc(x+w*0.42,y+h*0.4,2.4,d,null); uCirc(x+w*0.58,y+h*0.66,2,d,null); } if(a==='bug'){ for(let i=0;i<3;i++) uRR(x+w*0.27,y+4+i*(h-8)/3,w*0.46,(h-8)/6,1,d,null); } if(a==='cat'){ for(let i=0;i<3;i++){ U.strokeStyle=d; U.lineWidth=1.4; U.beginPath(); U.moveTo(x+w*0.3,y+5+i*6); U.lineTo(x+w*0.42,y+8+i*6); U.stroke(); } }
        uRR(x+w*0.12,y+h*0.2,w*0.14,h*0.26,3,c,CO,0.9); uRR(x+w*0.74,y+h*0.2,w*0.14,h*0.26,3,c,CO,0.9); }
      else { const n=a==='bug'?3:2; for(let i=0;i<n;i++){ const lx=x+w*(n===3?0.3+i*0.2:0.36+i*0.28)-3; uRR(lx,y,6,h*0.7,2.5,c,CO,0.9); uRR(lx-1.5,y+h*0.62,9,h*0.26,2.5,d,CO,0.9); } if(a==='cat'){ U.strokeStyle=c; U.lineWidth=3; U.beginPath(); U.moveTo(x+w*0.7,y+2); U.quadraticCurveTo(x+w*0.92,y+2,x+w*0.86,y+h*0.6); U.stroke(); } } };
    const start=f=>{ G.mode='play'; G.T=0;
      if(f===0){ const mk=fn=>{ const p=[]; for(let i=0;i<=60;i++) p.push(fn(i/60)); const L=[0]; for(let i=1;i<p.length;i++) L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1])); return {p,L,len:L[L.length-1]}; };
        G.st={w:0,s:0,wires:[mk(u=>[-70+140*u,20-Math.sin(u*Math.PI)*60]),mk(u=>[-70+140*u,-10+Math.sin(u*Math.PI*2)*34]),mk(u=>{ const a=u*Math.PI*2*1.5; return [-70+140*u+Math.sin(a)*18*(u>0.2&&u<0.8?1:0.4),5-Math.sin(u*Math.PI)*20-(1-Math.cos(a))*16*(u>0.2&&u<0.8?1:0.3)]; })],cols:['#3c78dc','#f0c828','#dc3c32']}; say2('Slide the bead to the other end. Follow the wire.',3); }
      if(f===1){ const order=SH.slice().sort(()=>Math.random()-0.5); G.st={cur:0,order,i:0,in:[],shake:0}; say2('Which hole does it fit?',2.4); }
      if(f===2){ const cards=[0,0,1,1,2,2].sort(()=>Math.random()-0.5); G.st={cards,open:[],found:[],cur:0,wait:0}; say2('Find the two that match.',2.4); }
      if(f===3){ let rows; do{ rows=[0,1,2].map(()=>Math.floor(Math.random()*3)); }while(rows.every(r=>r===0)); G.st={rows,cur:0,ok:0}; say2('Make the whole dog!',2.4); } };
    const finishFace=()=>{ const b=bonus(); G.done[G.face]=1; G.pts[G.face]=100+b; G.gain={b,t:0}; jingle(b>200?[659,784,1047,1319]:[659,784,1047],0.07,'triangle',0.05); G.mode='won'; G.wonT=1.3; };
    S.mini={ full:true, G, cube:true, dpad:true,
      taps(){ const W=VW,Hh=VH, cx=W/2, cy=Hh/2+15, fw=Math.min(150,W-40), fh=Math.min(92,Hh-88), st=G.st, Z=[];
        if(G.mode==='hub'){ Z.push({x:0,y:0,w:cx-fw*0.3,h:Hh,k:'left'},{x:cx+fw*0.3,y:0,w:W-(cx+fw*0.3),h:Hh,k:'right'},{x:cx-fw*0.3,y:cy-fh/2,w:fw*0.6,h:fh,k:'a'}); return Z; }
        if(G.mode!=='play') return Z;
        if(G.face===1){ const hx=[-fw*0.22,fw*0.22], hy=[-fh*0.2,fh*0.12]; for(let i=0;i<4;i++) Z.push({x:cx+hx[i%2]-21,y:cy+hy[i>>1]-19,w:42,h:38,fn(){ st.cur=i; pressed.a=true; }}); }
        if(G.face===2){ for(let i=0;i<6;i++) Z.push({x:cx-fw*0.3+(i%3)*fw*0.3-20,y:cy-fh*0.2+Math.floor(i/3)*fh*0.4-18,w:40,h:36,fn(){ if(st.wait>0) return; st.cur=i; pressed.a=true; }}); }
        if(G.face===3){ const rh=(fh-22)/3; for(let r=0;r<3;r++){ const y=cy-fh/2+11+r*rh; Z.push({x:cx-60,y:y-1,w:60,h:rh,fn(){ st.cur=r; pressed.left=true; }},{x:cx,y:y-1,w:60,h:rh,fn(){ st.cur=r; pressed.right=true; }}); } }
        return Z; },
      update(dt){ G.t+=dt; if(G.msgT>0) G.msgT-=dt; if(G.gain) G.gain.t+=dt; for(const p of G.parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=160*dt; } G.parts=G.parts.filter(p=>p.t<0.5); if(G.spin) G.spin*=Math.max(0,1-dt*8);
        const L=hit('left'),R=hit('right'),Up=hit('up'),Dn=hit('down'),A=hit('a'),Bk=hit('b');
        if(G.fin) return;
        if(G.mode==='won'){ G.wonT-=dt; if(G.wonT<=0){ if(G.done.every(d=>d)){ G.fin=true; G.score=Math.max(100,total()); say2('All four sides in '+G.T2.toFixed(1)+' seconds!',2.4); setTimeout(()=>resolve({done:true,score:G.score}),2400); } else { G.mode='hub'; let f=G.face; for(let i=0;i<4;i++){ f=(f+1)%4; if(!G.done[f]) break; } G.face=f; G.spin=1; blip(300,0.05,0.03,'triangle'); } } return; }
        if(G.mode==='hub'){ if(L){ G.face=(G.face+3)%4; G.spin=-1; blip(300,0.05,0.03,'triangle'); } if(R){ G.face=(G.face+1)%4; G.spin=1; blip(300,0.05,0.03,'triangle'); }
          if(A){ if(G.done[G.face]) say2('That side is done. Turn the cube.',1.6); else start(G.face); } if(Bk&&G.t>0.5) resolve({done:false}); return; }
        { const b0=bonus(); G.T+=dt; G.T2+=dt; const b1=bonus(); if(b1>0&&b1<110&&Math.floor(G.T*2)!==Math.floor((G.T-dt)*2)) blip(1100,0.02,0.02,'square'); if(b0>0&&b1===0){ blip(160,0.15,0.05,'sawtooth'); say2('Speed bonus gone! Finish it anyway.',1.4); } } const st=G.st;
        if(G.face===0){ const w=st.wires[st.w]; let i=0; while(i<w.L.length-2&&w.L[i+1]<st.s) i++; const tx_=w.p[i+1][0]-w.p[i][0], ty_=w.p[i+1][1]-w.p[i][1], tl=Math.hypot(tx_,ty_)||1; const ax=(K.right?1:0)-(K.left?1:0), ay=(K.down?1:0)-(K.up?1:0);
          const dot=(ax*tx_+ay*ty_)/tl; if(ax||ay){ const ps=st.s; st.s=Math.max(0,Math.min(w.len,st.s+dot*95*dt)); if(Math.floor(ps/14)!==Math.floor(st.s/14)) blip(700+st.w*120,0.02,0.025,'triangle'); }
          if(st.s>=w.len-0.5){ blip(1000,0.08,0.05,'triangle'); pop(0,0,st.cols[st.w]); st.w++; st.s=0; if(st.w>=3){ st.w=2; st.s=st.wires[2].len; finishFace(); } } }
        if(G.face===1){ if(st.shake>0) st.shake-=dt; if(L) st.cur=(st.cur&2)|0; if(R) st.cur=(st.cur&2)|1; if(Up) st.cur=st.cur&1; if(Dn) st.cur=(st.cur&1)|2; if(L||R||Up||Dn) blip(400,0.02,0.02,'triangle');
          if(A){ if(SH[st.cur]===st.order[st.i]){ st.in.push(st.order[st.i]); st.i++; blip(240,0.1,0.06,'triangle'); pop(0,0,'#ffd98a'); if(st.i>=4) finishFace(); } else { st.shake=0.3; G.bonks++; blip(130,0.12,0.06,'sawtooth'); buzz(20); say2(['Bonk. Not that one.','Nope!','Almost!'][G.bonks%3],1.1); } } }
        if(G.face===2){ if(st.wait>0){ st.wait-=dt; if(st.wait<=0) st.open=[]; return; } if(L) st.cur=(st.cur+5)%6; if(R) st.cur=(st.cur+1)%6; if(Up||Dn) st.cur=(st.cur+3)%6; if(L||R||Up||Dn) blip(400,0.02,0.02,'triangle');
          if(A&&!st.open.includes(st.cur)&&!st.found.includes(st.cur)){ st.open.push(st.cur); blip(520,0.05,0.04,'triangle'); if(st.open.length===2){ const [a,b]=st.open; if(st.cards[a]===st.cards[b]){ st.found.push(a,b); st.open=[]; jingle([784,988],0.06,'triangle',0.05); if(st.found.length===6) finishFace(); } else { st.wait=0.75; G.bonks++; } } } }
        if(G.face===3){ if(st.ok>0){ st.ok-=dt; if(st.ok<=0) finishFace(); return; } if(Up) st.cur=(st.cur+2)%3; if(Dn) st.cur=(st.cur+1)%3; if(L) st.rows[st.cur]=(st.rows[st.cur]+2)%3; if(R) st.rows[st.cur]=(st.rows[st.cur]+1)%3; if(L||R){ blip(500,0.04,0.03,'triangle'); if(st.rows.every(r=>r===0)) st.ok=0.5; else if(new Set(st.rows).size===3) say2('A '+ANI[st.rows[0]]+'-'+ANI[st.rows[1]]+'-'+ANI[st.rows[2]]+'! Ha!',1.4); } if(Up||Dn) blip(400,0.02,0.02,'triangle'); }
        if(Bk&&G.T>0.5){ G.mode='hub'; } },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh); let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#b8a488'); g.addColorStop(1,'#96846c'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
        const cx=W/2, cy=Hh/2+15, fw=Math.min(150,W-40), fh=Math.min(92,Hh-88), sk=G.spin*18;
        // the cube: wires on top, one face toward us, a sliver of the next
        U.save(); U.translate(cx+sk,cy);
        for(const [c,o] of [['#3c78dc',-28],['#dc3c32',0],['#f0c828',26]]){ U.strokeStyle=CO; U.lineWidth=3.4; U.beginPath(); U.moveTo(o-18,-fh/2-4); U.bezierCurveTo(o-16,-fh/2-27,o+18,-fh/2-30,o+16,-fh/2-4); U.stroke(); U.strokeStyle=c; U.lineWidth=2; U.stroke(); uCirc(o-13,-fh/2-16,3,c,CO,0.8); uCirc(o+8,-fh/2-23,3,'#3caa50',CO,0.8); }
        uPoly([[-fw/2,-fh/2],[-fw/2+14,-fh/2-10],[fw/2+14,-fh/2-10],[fw/2,-fh/2]],'#f0dcb0',CO,1.2); uPoly([[fw/2,-fh/2],[fw/2+14,-fh/2-10],[fw/2+14,fh/2-10],[fw/2,fh/2]],COL[(G.face+1)%4],CO,1.2);
        uRR(-fw/2,-fh/2,fw,fh,3,'#f4e2ba',CO,1.4); U.strokeStyle=COL[G.face]; U.lineWidth=4; U.strokeRect(-fw/2+3,-fh/2+3,fw-6,fh-6);
        const st=G.st, f=G.face, live=G.mode!=='hub';
        if(!live){ uRR(-56,-16,112,34,8,'#3a2c20',null); txt(FACES[f],0,-11,'#fff6dc',10,'center',true); txt(G.done[f]?'done!':(isTouch()?'tap to play this side':keyName('a')+': play this side'),0,5,G.done[f]?'#9be07a':'#ffd98a',7,'center',true); if(G.done[f]) cubStar(0,-28,6,'#ffd98a'); }
        else if(f===0){ st.wires.forEach((w,i)=>{ if(i>st.w&&G.mode!=='won') U.globalAlpha=0.35; U.strokeStyle=CO; U.lineWidth=4.4; U.lineJoin='round'; U.beginPath(); w.p.forEach((p,k)=>k?U.lineTo(p[0],p[1]+i*0):U.moveTo(p[0],p[1])); U.stroke(); U.strokeStyle=st.cols[i]; U.lineWidth=2.6; U.stroke(); U.globalAlpha=1; uCirc(w.p[0][0],w.p[0][1],3,'#3c4048',CO,0.8); uCirc(w.p[60][0],w.p[60][1],3,'#3c4048',CO,0.8); });
            st.wires.forEach((w,i)=>{ const s=i<st.w?w.len:i===st.w?st.s:0; let k=0; while(k<w.L.length-2&&w.L[k+1]<s) k++; const u=(s-w.L[k])/((w.L[k+1]-w.L[k])||1); const bx=w.p[k][0]+(w.p[k+1][0]-w.p[k][0])*u, by=w.p[k][1]+(w.p[k+1][1]-w.p[k][1])*u; uCirc(bx,by,i===st.w?6.5:5,st.cols[i],CO,1.2); uCirc(bx-1.6,by-1.8,1.6,'rgba(255,255,255,0.7)',null); if(i===st.w&&G.mode==='play'){ const e=w.p[60]; cubStar(e[0],e[1]-10+Math.sin(G.t*5)*1.5,3.4,'#ffd98a'); } }); }
        else if(f===1){ const hx=[-fw*0.22,fw*0.22], hy=[-fh*0.2,fh*0.12]; for(let i=0;i<4;i++){ const x=hx[i%2], y=hy[i>>1]; drawShape(SH[i],x,y,13,st.in.includes(SH[i])?['#dc3c32','#3c78dc','#3caa50','#f0c828'][i]:'#4a3c30',CO); if(i===st.cur&&G.mode==='play'){ cubeSel(x-18,y-18,36,36,G.t); } }
            if(st.i<4){ const s=st.order[st.i], k=SH.indexOf(s), x=(st.shake>0?Math.sin(G.t*60)*3:0), y=(hy[0]+hy[1])/2; uCirc(x,y,14,'rgba(255,255,255,0.55)',null); drawShape(s,x,y,10,['#dc3c32','#3c78dc','#3caa50','#f0c828'][k],CO); } }
        else if(f===2){ for(let i=0;i<6;i++){ const x=-fw*0.3+(i%3)*fw*0.3, y=-fh*0.2+Math.floor(i/3)*fh*0.4, op=st.open.includes(i)||st.found.includes(i); uRR(x-17,y-15,34,30,3,op?'#fffaf0':['#b48ae0','#f09a3a','#f0c828','#7bd95a','#3c78dc','#e86aa0'][i],CO,1.2);
              if(op){ const c=st.cards[i]; if(c===0) drawPart('dog',0,x-15,y-14,30,28); if(c===1){ uRR(x-9,y-2,18,10,2,'#f4a0b8',CO,0.9); uRR(x-9,y-6,18,5,2,'#fff',CO,0.9); uRR(x-1,y-12,2,6,1,'#dc3c32',null); } if(c===2){ uCirc(x,y,9,'#3c78dc',CO,1); U.strokeStyle='#fff'; U.lineWidth=1.2; U.beginPath(); U.arc(x,y,9,0.6,2.2); U.stroke(); cubStar(x,y,3,'#ffd98a'); } }
              else uCirc(x+11,y,1.8,'#f4e2ba',CO,0.7);
              if(i===st.cur&&G.mode==='play'){ cubeSel(x-19,y-17,38,34,G.t); } } }
        else if(f===3){ const rh=(fh-22)/3; for(let r=0;r<3;r++){ const y=-fh/2+11+r*rh; uRR(-34,y,68,rh-2,3,'#fffaf0',CO,1); drawPart(ANI[st.rows[r]],r,-34,y,68,rh-2); if(r===st.cur&&G.mode==='play'){ cubeSel(-36,y-2,72,rh+2,G.t); txt('◀',-48,y+rh/2-5,CO,9,'center',true); txt('▶',48,y+rh/2-5,CO,9,'center',true); } } }
        for(const p of G.parts){ U.globalAlpha=1-p.t/0.5; U.fillStyle=p.c; U.fillRect(p.x-1.5,p.y-1.5,3,3); } U.globalAlpha=1;
        U.restore();
        txt('ACTIVITY CUBE',W/2,4,'#fff6dc',9,'center',true); for(let i=0;i<4;i++){ uCirc(W/2-21+i*14,19,4,G.done[i]?COL[i]:'rgba(40,30,20,0.25)',CO,0.9); if(i===G.face) { U.strokeStyle='#fff'; U.lineWidth=1.2; U.beginPath(); U.arc(W/2-21+i*14,19,5.6,0,7); U.stroke(); } }
        // stopwatch, score, and the speed bonus draining while a side is in play
        { const mm=Math.floor(G.T2/60), ss=(G.T2%60).toFixed(1); box(3,3,50,13,'rgba(28,24,40,0.85)'); txt('⏱',7,6,'#a9a0b8',6); txt(mm+':'+(ss<10?'0':'')+ss,49,6,'#fff',7,'right',true);
          box(W-53,3,50,13,'rgba(28,24,40,0.85)'); txt('PTS',W-49,7,'#a9a0b8',5.5); txt(''+total(),W-7,6,'#ffd98a',7,'right',true);
          if(G.mode==='play'){ const b=bonus(), k=b/300, bw=Math.min(120,W-60), bx=W/2-bw/2, by=28; uRR(bx-1,by-1,bw+2,8,4,'rgba(28,24,40,0.85)',CO,0.7); if(k>0) uRR(bx,by,Math.max(3,bw*k),6,3,k>0.5?'#7bd95a':k>0.22?'#ffd23a':'#e8543a',null); txt(b>0?'SPEED BONUS  +'+b:'no bonus left',W/2,by+9,b>0?'#fff6dc':'rgba(255,255,255,0.7)',6,'center',true); }
          if(G.gain&&G.gain.t<1.6){ const g=G.gain, a=Math.min(1,(1.6-g.t)*2); U.globalAlpha=a; txt('+100',W/2,30-g.t*3,'#fff',11,'center',true); txt(g.b>0?'+'+g.b+(g.b>200?'  FAST!':'  speed'):'too slow for a bonus',W/2,43-g.t*3,g.b>200?'#7bd95a':'#ffd98a',g.b>200?10:8,'center',true); U.globalAlpha=1; } }
        if(G.msgT>0) bsCap('',G.msg);
        else { const h=G.mode==='hub'?(isTouch()?'tap the sides to turn it    tap the middle to play    '+keyName('b')+' leave':'◀ ▶ turn the cube    '+keyName('a')+' play    '+keyName('b')+' leave'):f===0?(isTouch()?'drag to push the bead along the wire':'push the bead along the wire with the arrows'):f===3?(isTouch()?'tap the left or right of a row to flip it':'▲▼ pick a row    ◀ ▶ flip it'):(isTouch()?'tap the one you want':'arrows move    '+keyName('a')+' pick    '+keyName('b')+' back'); U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); } } };
  });
}
// ================= the drums: bang on everything, learn the kit, play along =================
let DRNB=null;
function drumSound(p,vol){ if(!AC||muted) return; vol=vol||1; const t=AC.currentTime, out=AC.destination;
  const osc=(f0,f1,dur,v,type)=>{ const o=AC.createOscillator(),g=AC.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f1,t+dur); g.gain.setValueAtTime(v*vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g); g.connect(out); o.start(t); o.stop(t+dur+0.03); };
  const nz=(dur,v,hp)=>{ if(!DRNB){ DRNB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate); const d=DRNB.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; } const s=AC.createBufferSource(); s.buffer=DRNB; const f=AC.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp; const g=AC.createGain(); g.gain.setValueAtTime(v*vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t+dur+0.03); };
  if(p==='kick') osc(150,45,0.22,0.55); if(p==='snare'){ nz(0.16,0.3,1400); osc(220,150,0.1,0.22,'triangle'); } if(p==='tom') osc(210,130,0.24,0.42); if(p==='floor') osc(135,72,0.3,0.48); if(p==='hat') nz(0.05,0.2,7000); if(p==='crash'){ nz(0.9,0.26,3800); osc(520,380,0.4,0.05,'square'); } }
function drumGame(opts){ opts=opts||{};
  return new Promise(resolve=>{
    let song=DRUM_TRACKS[0];
    const PADS={hat:{x:-88,y:-6,rx:27,ry:10,key:'b',name:'Hi-hat',cym:1},crash:{x:86,y:-44,rx:31,ry:11,key:'a',name:'Crash cymbal',cym:1},tom:{x:-18,y:-26,rx:27,ry:12,key:'up',name:'Tom'},kick:{x:26,y:4,rx:17,ry:15,key:'down',name:'Kick drum',kick:1},snare:{x:-36,y:34,rx:35,ry:17,key:'left',name:'Snare'},floor:{x:66,y:30,rx:37,ry:18,key:'right',name:'Floor tom'}};
    const KEYLAB=k=>({up:'▲',down:'▼',left:'◀',right:'▶',a:keyName('a'),b:keyName('b')})[k];
    const LEARN=['kick','snare','tom','floor','hat','crash'];
    const G={t:0,phase:opts.replay?'pick':'free',pT:0,diff:'easy',full:false,menu:null,limit:60,hits:0,flash:{},stick:null,cap:opts.replay?'':opts.dream?'Bang the drums, buddy!':'Bang on anything! Every button is a drum.',capT:opts.replay?0:4,capWho:'Dad',score:0,streak:0,bestStreak:0,perfect:0,good:0,miss:0,jam:0,li:0,quiz:null,qn:0,notes:[],t0:0,nextBeat:0,fx:[],song:song.name,done:false,learnT:0,count:0};
    const cap=(s,d)=>{ G.cap=s; G.capT=d||2.6; };
    const songTime=()=>G.live?AC.currentTime-G.t0:G.pT-1.5;
    const strike=p=>{ if(G.phase==='pick'||G.phase==='load') return; drumSound(p,G.phase==='song'?0.75:1); G.flash[p]=1; G.stick={p,t:0}; G.hits++; buzz(8);
      if(G.phase==='free'){ if(G.hits===6) cap('Yeah, buddy!',1.8); if(G.hits>=14&&G.pT>4){ G.phase='learnIntro'; G.pT=0; cap('Okay, let me show you what everything is.',2.6); } }
      else if(G.phase==='learn'){ const want=LEARN[G.li]; if(p===want){ jingle([784,1047],0.05,'triangle',0.04); G.li++; G.learnT=0; if(G.li>=LEARN.length){ G.phase='quizIntro'; G.pT=0; cap('Now you find them. Ready?',2.2); } else cap('That\'s the '+PADS[LEARN[G.li]].name.toLowerCase()+'!  ('+KEYLAB(PADS[LEARN[G.li]].key)+')',9); } else cap('That one is the '+PADS[p].name.toLowerCase()+'. Try the '+PADS[want].name.toLowerCase()+'!',9); }
      else if(G.phase==='quiz'){ if(p===G.quiz){ jingle([784,1047,1319],0.05,'triangle',0.04); G.score+=50; G.qn++; if(G.qn>=4){ G.phase='songIntro'; G.pT=0; cap('You got it! Now pick a song. Hit the drums when the rings close in.',3.4); } else nextQuiz(); } else cap('That\'s the '+PADS[p].name.toLowerCase()+'. Where\'s the '+PADS[G.quiz].name.toLowerCase()+'?',9); }
      else if(G.phase==='song'){ const st=songTime(); let bestN=null; for(const n of G.notes){ if(n.hit||n.miss||n.p!==p) continue; const d=Math.abs(n.t-st); if(d<0.22&&(!bestN||d<Math.abs(bestN.t-st))) bestN=n; }
        if(bestN){ bestN.hit=true; const d=Math.abs(bestN.t-st), perf=d<0.09; G.streak++; G.bestStreak=Math.max(G.bestStreak,G.streak); const pts=Math.round((perf?100:50)*(1+Math.min(G.streak,20)*0.05)); G.score+=pts; perf?G.perfect++:G.good++; G.fx.push({txt:perf?'PERFECT':'GOOD',p,t:0,col:perf?'#fff':'#7bd95a'}); } else { G.jam++; G.score+=2; } } };
    const nextQuiz=()=>{ let q; do{ q=LEARN[Math.floor(Math.random()*6)]; }while(q===G.quiz); G.quiz=q; G.learnT=0; cap('Where\'s the '+PADS[q].name.toLowerCase()+'?',9); };
    const KEYS={left:'snare',up:'tom',right:'floor',down:'kick',a:'crash',b:'hat'};
    const fmt=d=>Math.floor(d/60)+':'+String(Math.round(d%60)).padStart(2,'0');
    const DIFFS=[['easy','Easy','just the beat'],['med','Medium','extra kicks and fills'],['hard','Hard','closest to the record']];
    const openMenu=step=>{ G.phase='pick'; G.pT=0;
      if(step==='song') G.menu={step,title:'Pick a song',rows:DRUM_TRACKS.map(t=>[t.name,fmt(opts.replay?t.dur:Math.min(60,t.dur))]),sel:Math.max(0,DRUM_TRACKS.indexOf(song))};
      if(step==='diff') G.menu={step,title:'How hard?',rows:DIFFS.map(d=>[d[1],d[2]]),sel:0};
      if(step==='len') G.menu={step,title:'How much of it?',rows:[['One minute','fades out at 1:00'],['The whole song',fmt(song.dur)]],sel:0}; };
    const choose_=i=>{ const m=G.menu; blip(880,0.05,0.05,'triangle');
      if(m.step==='song'){ song=DRUM_TRACKS[i]; if(opts.replay) openMenu('diff'); else startTrack(); }
      else if(m.step==='diff'){ G.diff=DIFFS[i][0]; if(song.dur>75) openMenu('len'); else startTrack(); }
      else { G.full=i===1; startTrack(); } };
    let src=null, gain=null;
    const stopTrack=()=>{ try{ if(src) src.stop(); }catch(_){} src=null; };
    const startTrack=async()=>{ G.menu=null; G.phase='load'; G.pT=0; G.limit=(G.full||song.dur<=75)?song.dur:60; G.song=song.name+(opts.replay?' · '+DIFFS.find(d=>d[0]===G.diff)[1]+(G.full&&song.dur>75?' · full':''):'');
      G.notes=song.charts[G.diff].filter(n=>n[0]<G.limit-1.2).map(([t,p])=>({t,p})); G.live=false; let buf=null;
      try{ audioKick(); const b64=DRUM_AUDIO[song.id].split(',')[1], bin=atob(b64), u8=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i); buf=await AC.decodeAudioData(u8.buffer); }catch(e){ buf=null; }
      if(G.done) return; G.phase='count'; G.pT=0; G.count=0; cap(song.name,1.6);
      await new Promise(r=>setTimeout(r,1500)); if(G.done) return;
      if(buf&&AC){ src=AC.createBufferSource(); src.buffer=buf; gain=AC.createGain(); gain.gain.value=muted?0:0.9; src.connect(gain); gain.connect(AC.destination); G.t0=AC.currentTime+0.08; src.start(G.t0);
        if(G.limit<song.dur-1&&!muted){ gain.gain.setValueAtTime(0.9,G.t0+G.limit-4); gain.gain.linearRampToValueAtTime(0.0001,G.t0+G.limit); } G.live=true; }
      else cap('(The song would not load, so play along to the rings.)',3);
      G.phase='song'; G.pT=0; };
    const layout=()=>{ const W=VW,Hh=VH, s=Math.min(1.25,(W-12)/250,(Hh-52)/150); return {cx:W/2,cy:Hh*0.47,s}; };
    S.rawTap=(x,y)=>{ if(G.phase==='end'){ if(G.pT>1.2) G.endTap=true; return; } if(G.phase==='pick'&&G.menu){ const m=G.menu, W=VW, bw=Math.min(210,W-12), y0=VH/2-(m.rows.length*20+22)/2+22; if(G.pT>0.35&&Math.abs(x-W/2)<bw/2){ const i=Math.floor((y-y0)/20); if(i>=0&&i<m.rows.length) choose_(i); } return; } const {cx,cy,s}=layout(); let bestK=null, bestD=1.5; for(const k in PADS){ const q=PADS[k], d=Math.hypot((x-(cx+q.x*s))/(q.rx*s+5),(y-(cy+q.y*s))/(q.ry*s+6)); if(d<bestD){ bestD=d; bestK=k; } } if(bestK) strike(bestK); };
    if(opts.replay) openMenu('song');
    S.mini={ full:true, G, drums:true, dpad:true, PADS,
      update(dt){ G.t+=dt; G.pT+=dt; if(G.capT>0) G.capT-=dt; for(const k in G.flash) G.flash[k]=Math.max(0,G.flash[k]-dt*5); if(G.stick){ G.stick.t+=dt; if(G.stick.t>0.16) G.stick=null; } for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<0.7);
        if(G.done) return;
        if(G.phase==='end'){ const a_=hit('a'); for(const k in KEYS) hit(k); if(G.pT>1.2&&(a_||G.endTap||G.pT>25)){ G.done=true; S.rawTap=null; stopTrack(); resolve(G); } return; }
        if(G.phase==='pick'&&G.menu){ const m=G.menu; if(hit('up')){ m.sel=(m.sel+m.rows.length-1)%m.rows.length; blip(400,0.03,0.03,'triangle'); } if(hit('down')){ m.sel=(m.sel+1)%m.rows.length; blip(400,0.03,0.03,'triangle'); } hit('left'); hit('right'); hit('b'); if(hit('a')&&G.pT>0.35) choose_(m.sel); return; }
        if(G.phase==='load'||G.phase==='count'){ for(const k in KEYS) hit(k); if(G.phase==='count') G.count=Math.max(1,3-Math.floor(G.pT/0.5)); return; }
        for(const k in KEYS) if(hit(k)) strike(KEYS[k]);
        if(opts.dream){ if(G.hits>=opts.dream){ G.dreamT=(G.dreamT||0)+dt; if(G.dreamT>0.9&&!G.done){ G.done=true; S.rawTap=null; resolve(G); } } return; }
        if(G.phase==='free'&&G.pT>16&&G.hits>=4){ G.phase='learnIntro'; G.pT=0; cap('Okay, let me show you what everything is.',2.6); }
        if(G.phase==='learnIntro'&&G.pT>2.4){ G.phase='learn'; G.li=0; G.learnT=0; cap('This is the '+PADS[LEARN[0]].name.toLowerCase()+'!  ('+KEYLAB(PADS[LEARN[0]].key)+')',9); }
        if(G.phase==='learn'||G.phase==='quiz') G.learnT+=dt;
        if(G.phase==='quizIntro'&&G.pT>2){ G.phase='quiz'; G.qn=0; nextQuiz(); }
        if(G.phase==='songIntro'&&G.pT>3.2) openMenu('song');
        if(G.phase==='song'){ const st=songTime();
          for(const n of G.notes) if(!n.hit&&!n.miss&&st>n.t+0.22){ n.miss=true; G.miss++; G.streak=0; }
          if(st>G.limit+0.4){ stopTrack(); G.phase='end'; G.pT=0; G.endCard=true; jingle([523,659,784,1047,1319],0.08,'triangle',0.06); cap('That was AWESOME, dude!',4); } }
      },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
        // you are sitting on the throne: pine wall ahead, carpet below, the kit laid out in front of you
        const {cx,cy,s}=layout(), st=G.phase==='song'?songTime():0, HZ=cy-34*s, spbEnd=G.limit;
        U.fillStyle='#e2ac5c'; U.fillRect(0,0,W,HZ); U.strokeStyle='#b07a3a'; U.lineWidth=1; for(let y=HZ-11;y>0;y-=12){ U.beginPath(); U.moveTo(0,y); U.lineTo(W,y); U.stroke(); } for(let i=0;i<9;i++) uCirc((i*83+20)%W,HZ-8-((i*37)%4)*12,1.8,'#96622e',null);
        uRR(cx-116*s,HZ-58*s,34*s,44*s,1.5,'#22202a',CO,1); uRR(cx-113*s,HZ-55*s,28*s,38*s,1,'#c4552b',null); uCirc(cx-99*s,HZ-38*s,8*s,'#ffd98a',null); U.fillStyle='#22202a'; U.fillRect(cx-110*s,HZ-24*s,22*s,2*s);
        let g=U.createLinearGradient(0,HZ,0,Hh); g.addColorStop(0,'#8a7a64'); g.addColorStop(1,'#b8a488'); U.fillStyle=g; U.fillRect(0,HZ,W,Hh-HZ); U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(0,HZ); U.lineTo(W,HZ); U.stroke();
        U.fillStyle='#4a7a5a'; U.beginPath(); U.moveTo(cx-150*s,Hh); U.lineTo(cx-104*s,HZ+10*s); U.lineTo(cx+104*s,HZ+10*s); U.lineTo(cx+150*s,Hh); U.fill();
        // rack and stands
        const bar=(x0,y0,x1,y1,w)=>{ U.lineCap='round'; U.strokeStyle=CO; U.lineWidth=(w+1.6)*s; U.beginPath(); U.moveTo(cx+x0*s,cy+y0*s); U.lineTo(cx+x1*s,cy+y1*s); U.stroke(); U.strokeStyle='#3a3a44'; U.lineWidth=w*s; U.stroke(); U.strokeStyle='rgba(255,255,255,0.18)'; U.lineWidth=w*0.3*s; U.stroke(); U.lineCap='butt'; };
        bar(-60,-66,-64,60,4); bar(60,-70,66,58,4); bar(-62,-12,63,-14,4.5); bar(-88,-4,-92,64,2.6); bar(86,-42,74,-14,2.4); bar(-18,-24,-14,-13,2.6); bar(26,16,26,40,3); bar(-36,36,-38,70,2.6); bar(66,34,70,70,2.6);
        const lit=G.phase==='learn'?LEARN[G.li]:(G.phase==='quiz'&&G.learnT>3?G.quiz:null);
        const ell=(x,y,rx,ry,fill,stroke,lw)=>{ U.beginPath(); U.ellipse(x,y,rx,ry,0,0,7); if(fill){ U.fillStyle=fill; U.fill(); } if(stroke){ U.strokeStyle=stroke; U.lineWidth=lw||1; U.stroke(); } };
        for(const k of ['crash','hat','tom','kick','floor','snare']){ const q=PADS[k], x=cx+q.x*s, y=cy+q.y*s, rx=q.rx*s, ry=q.ry*s, fl=G.flash[k]||0, dip=fl*2.2*s;
          if(lit===k){ const p=0.5+0.5*Math.sin(G.t*7); ell(x,y,rx+(5+p*3)*s,ry+(4+p*2)*s,'rgba(255,217,138,'+(0.18+0.2*p)+')','rgba(255,217,138,'+(0.6+0.4*p)+')',2.5); }
          if(q.cym){ ell(x,y+2*s+dip,rx,ry,'rgba(0,0,0,0.25)'); ell(x,y+dip,rx,ry,'#2a2a30',CO,1.3); ell(x,y-1*s+dip,rx*0.93,ry*0.86,fl>0.1?'#8a7a40':'#3c3c44'); ell(x,y-1*s+dip,rx*0.6,ry*0.56,null,'rgba(255,255,255,0.12)',0.8); ell(x,y-2*s+dip,rx*0.2,ry*0.26,'#55555e',CO,0.7); U.fillStyle='rgba(255,255,255,0.14)'; U.beginPath(); U.ellipse(x-rx*0.35,y-ry*0.3+dip,rx*0.4,ry*0.22,-0.2,0,7); U.fill(); }
          else if(q.kick){ uRR(x-rx-3*s,y-ry-4*s,rx*2+6*s,ry*2+12*s,5*s,'#26262c',CO,1.2); ell(x,y,rx,ry,'#16161a',CO,1); ell(x,y,rx*0.82*(1-fl*0.1),ry*0.82*(1-fl*0.1),fl>0.1?'#fff6c8':'#e8e8e4'); ell(x,y,rx*0.4,ry*0.4,null,'rgba(0,0,0,0.14)',0.8); }
          else { const dep=9*s; U.beginPath(); U.ellipse(x,y+dep,rx,ry,0,0,Math.PI); U.lineTo(x-rx,y); U.ellipse(x,y,rx,ry,0,Math.PI,0,true); U.closePath(); U.fillStyle='#1c1c22'; U.fill(); U.strokeStyle=CO; U.lineWidth=1.3; U.stroke(); U.fillStyle='#c8ccd4'; for(let i=0;i<5;i++){ const a=0.3+i*0.6; U.fillRect(x+Math.cos(a)*rx-1,y+Math.sin(a)*ry+2*s,2,dep-3*s); }
            ell(x,y,rx,ry,'#101014',CO,1.3); ell(x,y+dip*0.5,rx*0.9,ry*0.88,fl>0.1?'#fff6c8':'#f2f2ee'); ell(x,y+dip*0.5,rx*0.5,ry*0.5,null,'rgba(0,0,0,0.1)',0.8); U.fillStyle='rgba(255,255,255,0.5)'; U.beginPath(); U.ellipse(x-rx*0.3,y-ry*0.3,rx*0.35,ry*0.2,-0.2,0,7); U.fill(); }
          uCirc(x,y+(q.kick?0:ry*0.1),5.2,'rgba(28,24,40,0.82)',null); txt(KEYLAB(q.key),x,y+(q.kick?0:ry*0.1)-3.6,'#ffd98a',6.5,'center',true);
          if(G.phase==='song') for(const n of G.notes){ if(n.p!==k||n.hit||n.miss) continue; const d=n.t-st; if(d>1.1||d<-0.22) continue; const grow=Math.max(0,d)*34*s; U.globalAlpha=Math.min(1,1.25-d); ell(x,y,rx+grow,ry+grow*ry/rx,null,d<0.09?'#fff':'#ffd98a',d<0.2?2.4:1.6); U.globalAlpha=1; } }
        // Cam's knees, his foot on the kick pedal, and two forearms with sticks coming in from the bottom of the view
        const of=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1], PANTS=of[3]||'#5a78b0', SLEEVE=of[4]||of[2], kf=G.flash.kick||0;
        uRR(cx+14*s,cy+52*s+kf*3*s,22*s,30*s,[3*s,3*s,6*s,6*s],'#3a3a44',CO,1); uRR(cx+16*s,cy+50*s+kf*4*s,18*s,26*s,6*s,'#f4f4f0',CO,1); uRR(cx+16*s,cy+50*s+kf*4*s,18*s,7*s,[6*s,6*s,0,0],'#d8d8d4',null);
        for(const sd of [-1,1]){ U.beginPath(); U.ellipse(cx+sd*46*s,Hh+6*s,34*s,26*s,sd*0.25,0,7); U.fillStyle=PANTS; U.fill(); U.strokeStyle=CO; U.lineWidth=1.2; U.stroke(); }
        const tgt=G.stick?G.stick.p:null, sw=G.stick?Math.sin(Math.min(1,G.stick.t/0.16)*Math.PI):0;
        [0,1].forEach(i=>{ const sd=i?1:-1, rest=[cx+sd*58*s,cy+66*s], use=tgt&&tgt!=='kick'&&((PADS[tgt].x>=0)===(i===1)); let hand=rest.slice(), tip=[cx+sd*30*s,cy+30*s];
          if(use){ const q=PADS[tgt], px=cx+q.x*s, py=cy+q.y*s, far=q.y<0, SL=(far?40:50)*s; let dx=rest[0]-px, dy=rest[1]-py; const d=Math.hypot(dx,dy)||1; dx/=d; dy/=d; if(dy<0.45){ dy=0.45; const n=Math.hypot(dx,dy); dx/=n; dy/=n; }
            hand=[px+dx*SL,py+dy*SL-(1-sw)*10*s]; tip=[px,py-(1-sw)*12*s]; }
          const elbow=[cx+sd*96*s,Hh+26*s], taper=(a,b,w0,w1,fill)=>{ const ax=b[0]-a[0], ay=b[1]-a[1], l=Math.hypot(ax,ay)||1, nx=-ay/l, ny=ax/l; uPoly([[a[0]+nx*w0,a[1]+ny*w0],[b[0]+nx*w1,b[1]+ny*w1],[b[0]-nx*w1,b[1]-ny*w1],[a[0]-nx*w0,a[1]-ny*w0]],fill,CO,1.1); };
          taper(elbow,hand,13*s,(use&&PADS[tgt].y<0?5:6.5)*s,SLEEVE); taper(hand,tip,2.3*s,1.2*s,'#e2ba78'); uCirc(tip[0],tip[1],1.9*s,'#f0d8a8',CO,0.7);
          uCirc(hand[0],hand[1],7.5*s,'#f6d0b4',CO,1.1); U.strokeStyle='rgba(120,80,60,0.5)'; U.lineWidth=0.8; for(let f=0;f<3;f++){ U.beginPath(); U.arc(hand[0]+(f-1)*3.2*s,hand[1]-2*s,2.2*s,3.4,6.0); U.stroke(); } });
        for(const f of G.fx){ const q=PADS[f.p]; U.globalAlpha=1-f.t/0.7; txt(f.txt,cx+q.x*s,cy+q.y*s-q.ry*s-10-f.t*10,f.col,6.5,'center',true); U.globalAlpha=1; }
        // HUD
        const title={free:'FREE PLAY',learnIntro:'FREE PLAY',learn:'LEARN THE KIT',quizIntro:'LEARN THE KIT',quiz:'FIND IT',songIntro:'GET READY',pick:'PICK A SONG',load:'LOADING',count:'GET READY',song:song.name.toUpperCase(),end:song.name.toUpperCase()}[G.phase];
        box(3,3,Math.max(64,title.length*5+14),13,'rgba(28,24,40,0.85)'); txt(title,8,6,'#ffd98a',6.5,'left',true);
        if(G.phase==='song'||G.phase==='end'||G.phase==='quiz'){ box(W-62,3,59,13,'rgba(28,24,40,0.85)'); txt(String(G.score),W-8,6,'#ffd98a',7,'right',true); txt('PTS',W-58,7,'#a9a0b8',5.5); }
        if(G.phase==='song'){ if(G.streak>=3) txt(G.streak+' in a row',W/2,6,'#fff',7,'center',true); const pw=Math.min(110,W-150); if(pw>36){ uRR(W/2-pw/2,17,pw,3.5,1.7,'rgba(28,24,40,0.7)',null); uRR(W/2-pw/2,17,Math.max(2,pw*Math.min(1,Math.max(0,st)/G.limit)),3.5,1.7,'#ffd98a',null); } }
        if(G.phase==='count'&&G.count>0) txt(String(G.count),W/2,Hh*0.3,'#fff',22,'center',true);
        if(G.phase==='load') txt('Getting the song ready...',W/2,Hh*0.3,'#fff',9,'center',true);
        if(G.phase==='pick'&&G.menu){ const m=G.menu, bw=Math.min(210,W-12), bh=m.rows.length*20+26, x=W/2-bw/2, y=Hh/2-bh/2; U.fillStyle='rgba(10,8,18,0.5)'; U.fillRect(0,0,W,Hh); uRR(x,y,bw,bh,7,'rgba(20,16,30,0.97)','#ffd98a',1.2); txt(m.title,W/2,y+6,'#ffd98a',9,'center',true);
          m.rows.forEach((r,i)=>{ const ry=y+22+i*20, on=i===m.sel; uRR(x+6,ry,bw-12,17,5,on?'#ffd98a':'rgba(255,255,255,0.08)',on?CO:null,1); txt(r[0],x+13,ry+4.5,on?CO:'#f4ead8',7.5,'left',true); txt(r[1],x+bw-13,ry+5.5,on?'#5a4630':'#a9a0b8',5.5,'right'); }); }
        if(G.phase==='end'&&G.pT>0.5){ const bw=Math.min(180,W-14), x=W/2-bw/2, y=Hh/2-44; uRR(x,y,bw,84,7,'rgba(20,16,30,0.96)','#ffd98a',1.2); txt(G.song,W/2,y+6,'#ffd98a',G.song.length>24?7.5:10,'center',true); const rows=[['Perfect',G.perfect],['Good',G.good],['Missed',G.miss],['Best streak',G.bestStreak]]; rows.forEach(([a,b],i)=>{ txt(a,x+14,y+22+i*10,'#f4ead8',7); txt(String(b),x+bw-14,y+22+i*10,'#f4ead8',7,'right',true); }); txt('SCORE  '+G.score,W/2,y+64,'#ffd98a',9,'center',true); if(Math.floor(G.t*2)%2) txt(isTouch()?'tap or '+keyName('a')+': continue':keyName('a')+': continue',W/2,y+76,'#a9a0b8',6,'center'); }
        if(G.capT>0&&G.phase!=='end') bsCap(G.capWho,G.cap); else if(G.capT>0) bsCap('Dad',G.cap); } };
  });
}
function bsCap(who,s){ if(who) return pgCaption(who,s); if(!s) return; const W=VW,Hh=VH; U.font='6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=Math.min(W-10,U.measureText(s).width+16); uRR(W/2-tw/2,Hh-15,tw,12,6,'rgba(24,20,34,0.9)','#ffd98a',0.8); txt(s,W/2,Hh-12,'#fff',6.5,'center'); }

// the "this one is selected" frame on the cube: thick, dark-edged, and gently pulsing so it can't be missed
function cubeSel(x,y,w,h,t){ const p=0.5+0.5*Math.sin(t*7), g=1.5+p*1.5; x-=g; y-=g; w+=g*2; h+=g*2;
  U.fillStyle='rgba(255,90,54,'+(0.10+0.08*p)+')'; U.fillRect(x,y,w,h);
  U.lineJoin='round'; U.strokeStyle=CO; U.lineWidth=5.5; U.strokeRect(x,y,w,h); U.strokeStyle='#ff5a36'; U.lineWidth=3.2; U.strokeRect(x,y,w,h); U.strokeStyle='#fff3b0'; U.lineWidth=1; U.strokeRect(x,y,w,h);
  const L=5; U.strokeStyle='#fff'; U.lineWidth=1.6; U.beginPath(); for(const [cx,cy,sx,sy] of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]]){ U.moveTo(cx+sx*L,cy); U.lineTo(cx,cy); U.lineTo(cx,cy+sy*L); } U.stroke(); }
