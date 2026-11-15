'use strict';
// ================= back home: nap, 1:30 wake-up, lunch, Goldfish, finding Dad =================
async function hop(e,n=1){ for(let i=0;i<n;i++){ for(const l of [3,6,8,6,3,0]){ e.lift=l; await wait(45); } } e.lift=0; }
CH[3].crib=async()=>{ if(S.map!=='park'&&S.flags.outings) return napScene(); return H.crib(); };
async function napScene(){
  const n=NPC.nick, g=NPC.grace; claim(n);
  S.vinTok=(S.vinTok||0)+1; setGoal(''); bubble(P,'*yawn*',1200); await wait(900);
  n.visible=true; n.path=null; n.x=tx(7); n.y=ty(12); n.dir='up'; doors.cam=true;
  await walk(n,[[tx(7),ty(8)],[P.x+12,P.y+1]],60); n.dir='left';
  await say('Dad','Tired, huh, buddy? I guess it\'s that time.');
  P.carry=n; P.lift=9; P.zBias=3; S.noCollide=true; blip(500,0.06,0.04,'triangle'); await wait(400);
  await walk(n,[[tx(3)+4,ty(6)+6],[tx(2),ty(6)+2]],44); n.dir='down'; n.zBias=24; P.zBias=28; P.lift=4; await wait(500);
  await say('Dad','Wanna read "Dog"?');
  bubble(P,'Yeah!',1300); blip(900,0.08,0.05,'triangle'); await wait(1100);
  await say('','Dad reads "Dog." Cam turns the pages a little before Dad is done with them.');
  bubble(P,'*yawn*',1100); await wait(900);
  n.zBias=0; P.zBias=3; P.lift=9; await walk(n,[[tx(3)+4,ty(6)+6],CRIB_SIDE],38); n.dir='up'; await wait(300);
  P.carry=null; P.lift=0; P.zBias=0; [P.x,P.y]=CRIB; P.dir='down'; P.lying=true; cribFront(true); S.bounds=CRIB_BOUNDS; blip(300,0.05,0.04,'triangle'); await wait(500);
  await say('Dad','Night night, buddy. Love you.');
  await walk(n,[[tx(5),ty(7)],[tx(7),ty(8)-4],[tx(7),ty(12)]],40); setDoor('cam',false); n.visible=false; noise(NOISE_VOL,2.5); await wait(500);
  S.fadeText='1:30 PM'; S.fadeSub='Nap time is over'; await fadeTo(1,1800); await wait(1500);
  chapter4();
}
CH[4]={
  _nothing: async()=>{ if(S.flags.pmStage===0) return yellMommy(); return H._nothing(); },
  crib: async()=>{ if(S.flags.pmStage===0) return yellMommy(); return H.crib(); },
  npc_grace: async()=>{ if(S.flags.pmStage===2) return lunch(); await say('Mom', S.flags.pmStage>=4?'Go find Daddy, bud.':'Hi, sweet boy.'); },
  stool: async()=>{ if(S.flags.pmStage===2) return lunch(); return H.stool(); },
  npc_nick: async()=>{ if(S.flags.pmStage===4) return basementDoor(); return H.npc_nick(); },
  bsmtdoor: async()=>{ if(S.flags.pmStage===4){ bubble(P,'Oh oh oh?',1200); return; } return H.bsmtdoor(); },
  npc_vinny: async()=>H.npc_vinny(),
};
async function yellMommy(){
  S.flags.pmCalls=(S.flags.pmCalls||0)+1; const k=S.flags.pmCalls;
  bubble(P,['Mommy!','Mommy!!','MOMMY!','MOMMYYY!'][Math.min(3,k-1)],1100); blip(860+k*40,0.14,0.05,'triangle'); P.dir=['left','right','down','up'][k%4]; await hop(P,2);
  if(k>=4){ S.flags.pmStage=1; setGoal(''); await graceGetsCam(); }
}
async function graceGetsCam(){
  const g=NPC.grace;
  g.visible=true; g.path=null; g.zBias=0; g.x=tx(7); g.y=ty(12); g.dir='up'; setDoor('cam',true);
  await walk(g,[[tx(7),ty(8)-4],[tx(5),ty(7)],CRIB_SIDE],52); g.dir='up'; g.zBias=44; noise(0,1.2);
  await say('Mom','Hi, buddy! Did you have a good nap?');
  bubble(P,'Mommy!',1000); await hop(P,1);
  cribFront(false); g.zBias=0; P.carry=g; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(450);
  await walk(g,[[tx(4)+4,ty(6)],[tx(4)+4,ty(7)+2]],40); g.dir='down'; await wait(300);
  bubble(g,'Fresh diaper time.',1300); await wait(700);
  for(let i=0;i<7;i++){ P.lift=9+(i%2?2:0); blip(400+i*30,0.04,0.03,'triangle'); if(i===3) bubble(P,'No no no!',900); await wait(190); } P.lift=9; bubble(g,'All clean!',1000); await wait(800);
  await walk(g,[[tx(5)+8,ty(7)-2]],40); g.dir='left'; await wait(200);
  P.carry=null; P.lift=0; P.zBias=0; S.bounds=null; S.noCollide=false; P.x=g.x-13; P.y=g.y+2; P.dir='right'; blip(300,0.05,0.04,'triangle'); await wait(300);
  await say('Mom','There we go. Let\'s get you some lunch.');
  S.flags.pmStage=2; save('lunch'); setGoal('Go to the kitchen for lunch.',['npc:grace','stool0','stool1']);
  walk(g,[[tx(7),ty(8)],[tx(7),ty(12)+2],[tx(18),ty(12)+2],[tx(25),ty(11)],[tx(26),ty(7)]],46).then(()=>{ g.dir='left'; });
}
async function chapter4(){
  S.cut=true;
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny;
  claim(g); claim(n); S.bathUser=null; doors.bath=true;
  S.chapter=4; S.light='day'; S.clock='1:30 PM'; S.goal=''; S.glows=[]; S.flags.pmStage=-1; S.flags.pmCalls=0; save();
  if(S.map==='park') setMap('house'); tvOn(false); S.vinTok=(S.vinTok||0)+1; hidden.delete('slider'); hidden.add('sliderOpen'); hidden.delete('bsmtdoor');
  for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.delete(o.id);
  n.visible=false; n.path=null; n.zBias=0; g.visible=false; g.path=null; g.zBias=0; g.follow=false;
  v.visible=true; v.path=null; v.follow=false; v.ghost=false; [v.x,v.y]=COUCH; v.lie=true; v.sleep=true; v.zBias=8; v.dir='left';
  P.sheet=camSheet(); P.carry=null; P.lift=0; P.sit=0; [P.x,P.y]=CRIB; P.dir='down'; P.lying=true; cribFront(true); S.bounds=CRIB_BOUNDS; S.noCollide=true; S.noFall=true; doors.cam=false;
  S.snapCam=true; S.fade=1; noise(NOISE_VOL,0.5); await wait(700); S.fadeText=null; S.fadeSub=null; await fadeTo(0,1200);
  for(let i=0;i<2;i++){ bubble(P,'Zzz',1200); await wait(1600); }
  P.lying=false; blip(300,0.04,0.03,'triangle'); await wait(700); for(const d of ['left','right','down']){ P.dir=d; await wait(450); }
  S.flags.pmStage=0; setGoal('Yell for Mommy! ('+(isTouch()?'Press A':'Press Z or Space')+')');
  S.noFall=false; S.cut=false;
}
// ---------- picking the afternoon back up at a save point ----------
function pmSetup(){ const g=NPC.grace, n=NPC.nick, v=NPC.vinny; claim(g); claim(n); S.bathUser=null; doors.bath=true;
  S.chapter=4; S.light='day'; S.clock='1:30 PM'; S.goal=''; S.glows=[]; S.flags.pmCalls=4;
  if(S.map!=='house') setMap('house'); tvOn(false); S.vinTok=(S.vinTok||0)+1; hidden.delete('slider'); hidden.add('sliderOpen'); hidden.delete('bsmtdoor');
  for(const o of DATA.objs) if(o.id.startsWith('sc_')) hidden.delete(o.id);
  n.visible=false; n.path=null; n.zBias=0; n.seated=false; g.visible=true; g.path=null; g.zBias=0; g.follow=false; g.seated=false;
  v.visible=true; v.path=null; v.follow=false; v.ghost=false; [v.x,v.y]=COUCH; v.lie=true; v.sleep=true; v.zBias=8; v.dir='left';
  P.visible=true; P.sheet=camSheet(); P.carry=null; P.lift=0; P.sit=0; P.zBias=0; P.lying=false; cribFront(false); S.bounds=null; S.noCollide=false; S.noFall=false; doors.cam=true; noise(0,0.3); foodOn(null); S.mini=null; S.tick=null; S.hud=null; }
async function resumeLunch(){ const g=NPC.grace; S.cut=true; pmSetup(); P.x=tx(5)-5; P.y=ty(7); P.dir='right'; g.x=tx(26); g.y=ty(7); g.dir='left'; S.snapCam=true; S.fade=1;
  S.flags.pmStage=2; save('lunch'); await fadeTo(0,700); setGoal('Go to the kitchen for lunch.',['npc:grace','stool0','stool1']); S.cut=false; }
async function resumeDaddy(){ const g=NPC.grace, n=NPC.nick, v=NPC.vinny; S.cut=true; pmSetup(); P.x=tx(26); P.y=ty(19)+2; P.dir='up'; g.x=tx(22); g.y=ty(5)-2; g.dir='right';
  v.lie=false; v.sleep=false; v.zBias=0; v.x=P.x+20; v.y=P.y+6; v.dir='left'; n.visible=true; n.x=tx(15); n.y=ty(4); n.dir='down'; S.snapCam=true; S.fade=1;
  S.flags.pmStage=4; save('daddy'); await fadeTo(0,700); setGoal('Go find Daddy.',['npc:nick']); S.cut=false; }
async function lunch(){
  const g=NPC.grace, o=OBJ.stool0;
  S.flags.pmStage=3; setGoal('');
  g.path=null; await say('Mom','Lunch time. Up you go.');
  S.noCollide=true; await walk(g,[[P.x+11,P.y+1]],60); g.dir='left'; P.carry=g; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(400);
  await walk(g,[[o.x+22,o.y+12]],50); g.dir='left'; await wait(250);
  P.carry=null; P.lift=0; P.x=o.x+7; P.y=o.y+10; P.dir='left'; P.zBias=4; S.bounds=[P.x,P.y,P.x,P.y]; blip(300,0.05,0.04,'triangle');
  await walk(g,[[tx(25)+8,ty(7)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],[tx(22),ty(5)-2]],70); g.dir='right';
  const v=NPC.vinny; v.sleep=false; v.lie=false; v.zBias=0; v.follow=false; walk(v,[[P.x+26,P.y+16]],80).then(()=>{ v.dir='left'; });
  const st={kind:'lunch',taco:0,veg:0,cup:false,pushed:false,y:P.y}; foodOn(st); blip(420,0.05,0.05,'triangle');
  await say('Mom','Leftover tacos and veggies. Yum, right?');
  let eats=0, fed=0, water=false, cut=false, nt=0, nv=0;
  const TAC=['One bite of taco. Most of the cheese. None of the tortilla.','Another bite. The taco falls apart. Cam eats the pieces off the plate.','He picks out the meat and leaves the rest.'];
  const VEG=['Cam looks at the vegetable. The vegetable looks at Cam. He eats it, then makes a face about it.','A carrot. Crunch. Half of it comes back out.','One pea at a time. This could take a while.'];
  while(eats<7){
    const c=await choose('What does Cam do?',['Eat some taco','Eat a vegetable',water?'Drink some water':'Ask for water','Throw some to Vinny','Push the plate away','All done!']);
    if(c===0){ eats++; st.taco++; bubble(P,'Nom',900); blip(300,0.05,0.04); await wait(700); await say('',TAC[nt++%3]); if(eats===2) await say('Mom','Good job, bud.'); }
    if(c===1){ eats++; st.veg++; bubble(P,'...',900); blip(340,0.04,0.04); await wait(700); await say('',VEG[nv++%3]); }
    if(c===2){ if(!water){ water=true; bubble(P,'Water?',1200); await wait(900); st.cup=true; blip(420,0.05,0.05,'triangle'); await say('Mom','Water? Here you go.'); bubble(P,'Tank you.',1300); await wait(1100); }
      else { eats++; bubble(P,'Glug glug',1000); await wait(800); await say('','Glug glug glug. Most of it goes in.'); } }
    if(c===3){ fed++; await tossToVinny(fed,'taco','#e8b84a');
      if(fed===1) await say('Mom','Cam! That is not for Vinny.');
      else if(fed===2) await say('Mom','He didn\'t even catch it. Eat your lunch, please.');
      else { await say('Mom','Alright, that\'s enough then!'); cut=true; break; } }
    if(c===4){ st.pushed=true; S.shake=0.12; blip(240,0.12,0.05,'sawtooth'); await say('Mom','Hey. We don\'t push our plate.'); st.pushed=false; }
    if(c===5){ if(!eats){ await say('Mom','A couple of bites first, bud.'); continue; } break; }
  }
  if(!cut){ bubble(P,'All done!',1300); blip(900,0.1,0.05,'triangle'); await wait(1000); await say('Mom',eats<3?'That\'s all you\'re eating? ...Okay. Down you go.':'All done? Good eating. Down you go.'); }
  else await say('Mom','Lunch is over. Down you go.');
  await walk(g,[[tx(21),ty(5)],[tx(21),ty(7)],[tx(23),ty(7)],[tx(25)+8,ty(7)],[o.x+22,o.y+12]],80); g.dir='left';
  P.carry=g; P.lift=9; P.zBias=3; blip(500,0.06,0.04,'triangle'); await wait(350); await walk(g,[[o.x+30,o.y+26]],50); P.carry=null; P.lift=0; P.zBias=0; S.bounds=null; P.x=g.x; P.y=g.y+10; P.dir='down'; blip(300,0.05,0.04,'triangle'); await wait(300);
  // straight to the couch
  P.running=true; await walk(P,[[tx(26),ty(9)],[tx(28),ty(12)],[tx(28),ty(19)],[tx(26),ty(19)+2]],92); P.running=false; P.dir='up'; S.noCollide=false;
  bubble(P,'Snack?',1400); blip(900,0.1,0.05,'triangle'); await wait(1300);
  await say('Mom','You JUST had lunch.');
  bubble(P,'Snack?',1400); await wait(1200);
  await walk(g,[[tx(27),ty(9)],[tx(28),ty(12)],[tx(28),ty(18)],[P.x+14,P.y-2]],70); g.dir='left';
  await say('Mom','Fine. Goldfish.');
  bubble(P,'Yeah!!',1500); jingle([784,988,1175],0.08,'triangle',0.05); await hop(P,2); await wait(600);
  walk(g,[[tx(28),ty(12)],[tx(25)+8,ty(7)],[tx(23),ty(7)],[tx(21),ty(7)],[tx(21),ty(5)],[tx(22),ty(5)-2]],60).then(async()=>{ g.dir='right'; bubble(g,'*wipe wipe*',800); await wait(900); foodOn(null); });
  walk(v,[[P.x+20,P.y+6]],70).then(()=>{ v.dir='left'; });
  await wait(1600);
  // footsteps on the basement stairs
  for(let i=0;i<3;i++){ S.tip={txt:'thump'+'  thump'.repeat(i),until:S.t+1.2}; blip(70,0.16,0.09,'sine'); S.shake=0.06; await wait(650); }
  P.dir='left'; bubble(P,'!',900); await wait(700);
  const n=NPC.nick; S.camFocus={x:tx(14)+8,y:ty(5)+10}; await wait(900);
  hidden.add('bsmtdoor'); blip(260,0.12,0.06,'triangle'); n.visible=true; n.zBias=0; n.x=tx(14); n.y=ty(6); n.dir='up';
  await walk(n,[[tx(14),ty(4)+2],[tx(15),ty(4)]],40); n.dir='down'; hidden.delete('bsmtdoor'); blip(200,0.1,0.05,'triangle'); await wait(700);
  S.camFocus=null; await wait(500);
  bubble(P,'Daddy!',1300); await wait(900);
  S.flags.pmStage=4; save('daddy'); setGoal('Go find Daddy.',['npc:nick']);
}
async function basementDoor(){
  const n=NPC.nick; S.flags.pmStage=5; setGoal(''); face(n,faceTo(n,P));
  bubble(P,'Oh oh oh??',1500); blip(700,0.08,0.05,'triangle'); await wait(1300);
  await say('Dad','You want to go downstairs?');
  bubble(P,'Oh oh oh?????',1600); blip(760,0.08,0.05,'triangle'); await hop(P,2); await wait(600);
  bubble(n,'Ha ha ha!',1300); await wait(1100);
  await say('Dad','Alright. Let\'s go to the basement.');
  bubble(P,'Yeah!!!!',1500); jingle([523,659,784,1047],0.08,'triangle',0.06); await hop(P,2); await wait(400);
  await walk(n,[[tx(15),ty(4)+2]],40); n.dir='left'; hidden.add('bsmtdoor'); blip(260,0.12,0.06,'triangle'); await wait(500);
  S.noCollide=true; await walk(P,[[tx(14)-2,ty(4)+2],[tx(14)-2,ty(5)]],36); P.dir='down';
  await say('','One hand on the rail. One step at a time.');
  for(let i=0;i<5;i++){ await walk(P,[[tx(14)-2,ty(5)+8+i*7]],22); blip(160-i*10,0.07,0.06,'triangle'); if(i===2) bubble(P,'Oh oh oh!',1200); await wait(420); }
  walk(n,[[tx(14)+6,ty(5)]],40);
  await fadeTo(1,800); n.path=null; S.noCollide=false; hidden.delete('bsmtdoor'); S.flags.pmStage=6;
  await chapter5();
}
