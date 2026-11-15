'use strict';
// ================= Cub Foods: first-person from the cart seat (v2: timing, sneaking, chains) =================
const CUB={
  PTS:{mom:100,cam:150,hi:50,junk:-75,wrong:-25}, COOKIE:8000, SWEET:0.86,
  items:{ // shape, main colour, accent, name
    kale:['leafy','#3f8f3a','#2c6a2a','Kale'], veggies:['bag','#6fbf4a','#f08a2a','Veggies'],
    beef:['tray','#c8423c','#f4f0ea','Ground Beef'], brats:['tray','#d9a878','#f4f0ea','Brats'], cheese:['block','#f4a62a','#ffd35a','Cheese'],
    milk:['carton','#f6f6f6','#3b78d8','Milk'], eggs:['flat','#d8d2c4','#b8b0a0','Eggs'], bread:['loaf','#d9a45a','#f0d090','Bread'],
    taco:['box','#f2c230','#d8452a','Taco Shells'], dietcoke:['bottle','#c8ccd2','#d8232a','Diet Coke'], sprite:['bottle','#2fa84a','#f4e23a','Sprite'],
    bloody:['bottle','#b3261e','#f4f0ea','Bloody Mary Mix'], pizza:['flatbox','#b8322a','#f2c230','Frozen Pizza'],
    yogies:['pouch','#8a4fc8','#f4f0ea','Yogies'], oreos:['pack','#2a56c8','#f6f6f6','Oreos'], goldfish:['bag','#f28a1e','#f6f6f6','Goldfish'],
    cereal:['box','#e8452a','#f2c230','Cereal'], chocolate:['bar','#6a3d22','#c8a060','Chocolate'], chips:['bag','#f2d02a','#d8232a','Chips'],
    icecream:['tub','#f6c8d8','#8a4f2a','Ice Cream'],
    catfood:['can','#8a6ad0','#f4f0ea','Cat Food'], bulbs:['box','#e8e4d8','#4a90d8','Light Bulbs'], mustard:['bottle','#e8c81e','#f6f6f6','Mustard'],
    prune:['bottle','#5a2a4a','#e8d8a0','Prune Juice'], soap:['bottle','#3ab8d8','#f6f6f6','Dish Soap'], sardines:['flat','#4a6a8a','#e8c81e','Sardines'],
    batteries:['pack','#2a2a2a','#e8a81e','Batteries'], denture:['box','#4ab8a8','#f6f6f6','Denture Cream'], beets:['can','#8a1e4a','#f4f0ea','Canned Beets'],
    mop:['box','#8a8a92','#e8e4d8','Mop Heads'] },
  junk:['catfood','bulbs','mustard','prune','soap','sardines','batteries','denture','beets','mop'],
  // T = seconds an item takes to reach Cam; away = how long Mom looks away; run = snacks per look-away
  // each aisle adds one new idea: 1 requests, 2 snacks, 3 junk + look-alikes, 4 two at once, 5 everything
  aisles:[
    {name:'Produce',mom:['kale','veggies'],cam:[],T:3.3,away:2.6,run:2,junk:0,
      intro:'Alright little dude, first up is veggies, so we can make tacos at home! Ready?',tip:'When I ask for something, you grab it. Wait for the ring to close!'},
    {name:'Meat & Cheese',mom:['beef','brats','cheese'],cam:['chocolate','chips','oreos','goldfish'],T:3.0,away:2.5,run:2,junk:0,
      intro:'Okay bud, now it\'s meat and cheese for TACO NIGHT! Ready?',tip:'And if any snacks jump in the cart while I\'m not looking... I saw nothing.'},
    {name:'Dairy & Bread',mom:['milk','eggs','bread'],cam:['yogies','cereal','oreos','chips','yogies','cereal'],T:2.75,away:2.3,run:2,junk:0.4,decoy:true,chat:true,
      intro:'Dairy time, mister! Milk, eggs, bread. Breakfast for DAYS! Ready?',tip:'Careful now. Grab ONLY what I ask for. We do not need light bulbs.'},
    {name:'Tacos & Pop',mom:['taco','dietcoke','sprite','bloody'],cam:['oreos','chips','chocolate','goldfish','oreos','chips'],T:2.5,away:2.0,run:3,junk:0.45,decoy:true,double:true,bait:1,
      intro:'Taco shells and pop, my dude! This is the GOOD aisle. Ready?',tip:'I\'m gonna ask for two things at once. You got this!'},
    {name:'Frozen',mom:['pizza'],cam:['oreos','chocolate','goldfish','chips','oreos','chocolate','yogies'],T:2.3,away:1.9,run:3,junk:0.5,ice:true,bait:2,
      intro:'Last one, buddy! Frozen pizza, for when Mom and Dad give up on cooking! Ready?'},
  ],
  levels:[{name:'Easy',T:1.3,away:0.7,tell:0.6},{name:'Fast',T:1.0,away:0,tell:0.42},{name:'Weeeeee',T:0.8,away:-0.15,tell:0.36}],
  closeUps:['How cute!','Hello, sir!','Isn\'t he adorable!','You know, I have a grandson just like this... want to see pictures?','Oh my word, look at those cheeks!','Are you helping your mommy? Yes you are!'],
  hiReplies:['Hi, sweetie!','Well, hello there!','...','Aww! Hi!','Oh my goodness, hi!','Hey, little man!','...','Hi hi hi!'],
  icons:{},
};
const CO='#2e2838';
if(!CanvasRenderingContext2D.prototype.roundRect){ CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){ r=Math.min(typeof r==='number'?r:r[0],w/2,h/2); this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+h,r); this.arcTo(x+w,y+h,x,y+h,r); this.arcTo(x,y+h,x,y,r); this.arcTo(x,y,x+w,y,r); this.closePath(); }; }
function uRR(x,y,w,h,r,fill,stroke=CO,lw=1){ U.beginPath(); U.roundRect(x,y,w,h,r); if(fill){ U.fillStyle=fill; U.fill(); } if(stroke){ U.strokeStyle=stroke; U.lineWidth=lw; U.stroke(); } }
function uPoly(pts,fill,stroke=CO,lw=1){ U.beginPath(); pts.forEach(([x,y],i)=>i?U.lineTo(x,y):U.moveTo(x,y)); U.closePath(); if(fill){ U.fillStyle=fill; U.fill(); } if(stroke){ U.strokeStyle=stroke; U.lineWidth=lw; U.lineJoin='round'; U.stroke(); } }
function uCirc(x,y,r,fill,stroke=CO,lw=1,ry){ U.beginPath(); U.ellipse(x,y,r,ry||r,0,0,7); if(fill){ U.fillStyle=fill; U.fill(); } if(stroke){ U.strokeStyle=stroke; U.lineWidth=lw; U.stroke(); } }
function uLimb(pts,w,fill){ U.lineCap='round'; U.lineJoin='round'; for(const [lw,c] of [[w+2,CO],[w,fill]]){ U.beginPath(); pts.forEach(([x,y],i)=>i?U.lineTo(x,y):U.moveTo(x,y)); U.strokeStyle=c; U.lineWidth=lw; U.stroke(); } U.lineCap='butt'; }
// product pictures: drawn once at 4x into a small canvas, with a rounded outline, a label and a shine
function cubIcon(id){
  if(CUB.icons[id]) return CUB.icons[id];
  const [shape,c1,c2]=CUB.items[id]; const c=document.createElement('canvas'); c.width=c.height=64; const q=c.getContext('2d'); q.scale(4,4); q.lineJoin='round';
  const rr=(x,y,w,h,r,col,st=true)=>{ q.beginPath(); q.roundRect(x,y,w,h,r); q.fillStyle=col; q.fill(); if(st){ q.strokeStyle=CO; q.lineWidth=0.9; q.stroke(); } };
  const pl=(pts,col)=>{ q.beginPath(); pts.forEach(([x,y],i)=>i?q.lineTo(x,y):q.moveTo(x,y)); q.closePath(); q.fillStyle=col; q.fill(); q.strokeStyle=CO; q.lineWidth=0.9; q.stroke(); };
  const dot=(x,y,r,col)=>{ q.beginPath(); q.arc(x,y,r,0,7); q.fillStyle=col; q.fill(); };
  const shine=(x,y,w,h)=>{ q.fillStyle='rgba(255,255,255,0.38)'; q.beginPath(); q.roundRect(x,y,w,h,0.6); q.fill(); };
  const shade=(x,y,w,h)=>{ q.fillStyle='rgba(0,0,0,0.16)'; q.fillRect(x,y,w,h); };
  if(shape==='carton'){ pl([[4,5.5],[8,1.5],[12,5.5]],c1); rr(4,5,8,10,0.8,c1); rr(4.4,8.5,7.2,3.5,0.3,c2,false); shade(10,5.5,1.6,9); shine(5,6,1.2,7.5); }
  else if(shape==='bottle'){ rr(6.8,1,2.4,3,0.5,c2); rr(5,4.5,6,10.5,1.6,c1); rr(5.4,8,5.2,3.6,0.3,c2,false); shade(9.4,5,1.2,9.5); shine(5.8,5.5,1,7); }
  else if(shape==='box'){ rr(3.5,2.5,9,12.5,0.8,c1); rr(4.6,4.5,6.8,4.6,0.6,c2,false); q.fillStyle=c2; q.fillRect(4.6,11,6.8,1); shade(10.8,3,1.4,11.5); shine(4.2,3.2,1,10); }
  else if(shape==='flatbox'){ rr(1.5,5,13,9,1,c1); dot(8,9.5,3.3,c2); dot(7,8.8,0.7,c1); dot(9.2,10.4,0.7,c1); dot(8.6,8.2,0.5,'#3f8f3a'); shade(1.9,12.4,12.2,1.2); shine(2.3,5.8,5,1); }
  else if(shape==='bag'){ pl([[4,3.5],[5,2.2],[6,3],[7,2.2],[8,3],[9,2.2],[10,3],[11,2.2],[12,3.5],[12.4,13.8],[3.6,13.8]],c1); rr(5,6.2,6,4.6,2,c2,false); shade(10.6,4,1.4,9.4); shine(4.6,4.2,1.1,8); }
  else if(shape==='tray'){ rr(1.5,5.5,13,9,1.6,c2); rr(2.8,6.8,10.4,6.4,1.2,c1,false); q.fillStyle='rgba(255,255,255,0.35)'; for(const [x,y] of [[4.5,8],[7.5,9.6],[10.5,8.4],[6,11.4],[9.6,11.6]]){ q.beginPath(); q.arc(x,y,0.9,0,7); q.fill(); } shine(3.2,7.2,5,0.9); }
  else if(shape==='block'){ pl([[2.5,7],[9,4.5],[13.5,7],[13.5,13.5],[2.5,13.5]],c1); pl([[2.5,7],[9,4.5],[13.5,7],[7,9]],c2); dot(5.5,11.5,0.9,'#d98a1a'); dot(10.6,11,1.2,'#d98a1a'); dot(8.2,12.4,0.6,'#d98a1a'); }
  else if(shape==='flat'){ rr(1.5,6.5,13,7,1.4,c1); for(let i=0;i<4;i++){ q.beginPath(); q.ellipse(3.6+i*2.95,9,1.15,1.5,0,0,7); q.fillStyle=c2; q.fill(); q.strokeStyle='rgba(46,40,56,0.5)'; q.lineWidth=0.4; q.stroke(); } shade(1.9,12,12.2,1.1); }
  else if(shape==='loaf'){ q.beginPath(); q.moveTo(2,13.5); q.lineTo(2,8); q.quadraticCurveTo(2,4.5,5,4.5); q.lineTo(11,4.5); q.quadraticCurveTo(14,4.5,14,8); q.lineTo(14,13.5); q.closePath(); q.fillStyle=c1; q.fill(); q.strokeStyle=CO; q.lineWidth=0.9; q.stroke();
    q.fillStyle=c2; q.beginPath(); q.roundRect(3,8,10,4.6,0.8); q.fill(); q.strokeStyle='rgba(120,70,20,0.5)'; q.lineWidth=0.5; for(const x of [6,8,10]){ q.beginPath(); q.moveTo(x,5); q.lineTo(x+0.6,7.4); q.stroke(); } }
  else if(shape==='leafy'){ rr(6.6,10,2.8,5,0.8,'#e4dccb'); for(const [x,y,r] of [[5,7.5,3.6],[11,7.5,3.6],[8,5,4],[8,9,3.4]]){ q.beginPath(); q.arc(x,y,r,0,7); q.fillStyle=c1; q.fill(); q.strokeStyle=CO; q.lineWidth=0.9; q.stroke(); }
    for(const [x,y,r] of [[5,7.5,2.9],[11,7.5,2.9],[8,5,3.3],[8,9,2.8]]) dot(x,y,r,c1); q.strokeStyle=c2; q.lineWidth=0.7; for(const [a,b,c_,d] of [[8,10,8,3.5],[8,7.5,5,6],[8,7,11,5.6]]){ q.beginPath(); q.moveTo(a,b); q.lineTo(c_,d); q.stroke(); } }
  else if(shape==='pouch'){ rr(6.8,0.8,2.4,3,0.6,c2); pl([[5,4],[11,4],[12.6,13.5],[3.4,13.5]],c1); dot(8,9,2.6,c2); dot(8,9,1.2,c1); shine(5.4,5,0.9,6.5); }
  else if(shape==='pack'){ rr(1.5,5.5,13,8,1.2,c1); rr(4,7.2,8,4.6,2.2,c2,false); dot(6.2,9.5,1.3,'#2a2a2a'); dot(9.8,9.5,1.3,'#2a2a2a'); q.fillStyle=c2; q.fillRect(1.9,5.9,1,7.2); q.fillRect(13.1,5.9,1,7.2); }
  else if(shape==='bar'){ rr(2.5,4.5,11,10,0.8,c1); q.fillStyle=c2; q.fillRect(2.9,4.9,10.2,3.4); q.fillStyle='rgba(0,0,0,0.25)'; for(let i=0;i<3;i++) for(let j=0;j<2;j++) q.fillRect(4+i*3,9.2+j*2.5,2.2,1.8); shine(3.4,5.4,4,0.8); }
  else if(shape==='tub'){ pl([[3,6.5],[13,6.5],[12,14],[4,14]],c1); rr(2,4,12,2.8,1,'#f8f6f2'); q.fillStyle=c2; q.beginPath(); q.arc(8,10.2,2.4,0,7); q.fill(); dot(7.3,9.6,0.8,'#f6f0e8'); shine(4.4,7.2,0.9,5.6); }
  else if(shape==='can'){ rr(4,3.5,8,11.5,1.4,c1); q.fillStyle='#cfd3d9'; q.fillRect(4.4,3.9,7.2,1.2); q.fillRect(4.4,13.4,7.2,1.2); rr(4.4,6.6,7.2,5.2,0.3,c2,false); dot(8,9.2,1.6,c1); shade(10.2,4,1.3,10.5); shine(4.9,4.6,0.9,9); }
  CUB.icons[id]=c; return c;
}
const cubMult=ch=>ch>=15?3:ch>=10?2.5:ch>=6?2:ch>=3?1.5:1;
// ---- what happens in each aisle, decided up front so everything is fair and readable
function cubPlan(ai,level){
  const a=CUB.aisles[ai], L=CUB.levels[level||0], T=a.T*L.T, items=[], ev=[]; const R=(x,y)=>x+Math.random()*(y-x); const pick=l=>l[Math.floor(Math.random()*l.length)];
  const free=(sweet,side)=>!items.some(i=>i.side===side&&Math.abs(i.sweet-sweet)<0.62);
  const place=(sweet,id,kind,side,extra)=>{ if(side==null) side=Math.random()<0.5?0:1; if(!free(sweet,side)) side=1-side; let n=0; while(!free(sweet,side)&&n++<8) sweet+=0.2;
    const it=Object.assign({id,kind,side,sweet,spawn:sweet-CUB.SWEET*T,state:'wait',p:0},extra||{}); items.push(it); return it; };
  const moms=a.mom.slice(), cams=a.cam.slice(); let t=0.8, firstAway=true; const away=Math.max(1.4,a.away+L.away);
  const others=[].concat(...CUB.aisles.map(x=>x.mom)).filter(id=>!a.mom.includes(id));
  const sneak=(dur,n)=>{ const s=t; ev.push({t:s,type:'away',dur,mode:pick(['list','L','R','phone'])});
    for(let i=0;i<n&&cams.length;i++){ const sw=n>1?s+0.6+i*((dur-0.6)/(n-1))*R(0.86,1.22):s+R(0.6,dur); place(sw,cams.shift(),'cam'); } t=s+dur+R(0.9,1.4); };
  while(moms.length){
    const ids=[moms.shift()]; if(a.double&&moms.length&&Math.random()<0.7) ids.push(moms.shift());
    const sw=t+CUB.SWEET*T; ev.push({t,type:'ask',ids}); const first=place(sw,ids[0],'mom'); if(ids[1]) place(sw+R(0.55,0.8),ids[1],'mom',1-first.side);
    if(a.decoy&&Math.random()<0.8) place(sw+(Math.random()<0.5?-1:1)*R(0.62,0.8),pick(others),'mom',Math.random()<0.5?first.side:1-first.side);
    t=sw+(ids[1]?1.5:0.9)+R(0,0.4);
    if(a.chat&&firstAway){ firstAway=false; ev.push({t,type:'chat',dur:5.4}); const s=t+2.2; for(let i=0;i<4&&cams.length;i++) place(s+0.7+i*R(0.95,1.2),cams.shift(),'cam'); t=s+5.4+1.0; }
    else if(cams.length) sneak(away+R(0,0.8),a.run);
  }
  if(a.ice){ ev.push({t,type:'ice'}); place(t+CUB.SWEET*T,'icecream','cam'); t+=CUB.SWEET*T+1.0; }
  while(cams.length>(a.bait||0)) sneak(away+R(0,0.8),Math.min(a.run,cams.length-(a.bait||0)));
  const len=t+0.6;
  for(let i=0;i<(a.bait||0)&&cams.length;i++){ let sw, n=0; do{ sw=R(3,len-1.5); } while(n++<20&&ev.some(e=>(e.type==='away'||e.type==='chat')&&sw>e.t-0.4&&sw<e.t+e.dur+0.5)); place(sw,cams.shift(),'cam'); }
  for(let tt=2.2;tt<len-0.8;tt+=R(0.8,1.3)) if(Math.random()<a.junk){ const side=Math.random()<0.5?0:1; if(free(tt,side)) place(tt,pick(CUB.junk),'junk',side); }
  const his=[R(0.5,Math.max(1,len*0.3)),R(len*0.45,len*0.75)];
  items.sort((x,y)=>x.spawn-y.spawn); ev.sort((x,y)=>x.t-y.t);
  return {items,ev,len,his,T,tell:L.tell,nReq:a.mom.length,nSnack:a.cam.length};
}
function cubNew(){ return {t:0,aisle:0,aT:0,items:[],score:0,chain:0,bestChain:0,sneak:0,stars:[],lines:[],cart:[],perfects:0,level:0,
  rec:{mom:[],cam:[],junk:[],hi:0,missed:[],caught:0}, mom:{look:1,away:false,awayUntil:0,mode:'list',say:null,sayT:0,mood:'smile',moodT:0,blink:0},
  reqs:[],shoppers:[],hand:{L:0,R:0,tL:null,tR:null},phase:'idle',pT:0,fx:[],parts:[],fly:[],shake:0,freeze:0,camSay:null,camSayT:0,pulse:0,done:false,
  talk:null,talkQ:[],lean:0,speedK:0,rate:0,scr:0,resume:0,guide:null,sprint:false}; }
function cubGame(level,opts){ opts=opts||{};
  return new Promise(resolve=>{
    const G=cubNew(); G.aisle=-1; G.level=level||0; let plan=null, st=null, greets=0, closeUp=false; const easy=G.level===0;
    const say=(txt,sec=2.2,mood)=>{ G.mom.say=txt; G.mom.sayT=sec*1.9; if(mood){ G.mom.mood=mood; G.mom.moodT=sec*1.9; } };
    const csay=(txt,sec=1.1)=>{ G.camSay=txt; G.camSayT=sec*1.5; };
    // Mom stops the cart, leans in and talks. Nothing moves until A.
    const talk=(text,mood,o)=>G.talkQ.push(Object.assign({text,mood:mood||'ask',shown:0},o||{}));
    const fx=(txt,x,y,col,size=9)=>G.fx.push({txt,x,y,col,size,t:0});
    const burst=(x,y,col,n=8)=>{ for(let i=0;i<n;i++){ const a=Math.random()*6.28, v=20+Math.random()*50; G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,t:0,life:0.45+Math.random()*0.3,col}); } };
    const add=(pts,label,kind,x,y,col)=>{ pts=Math.round(pts/5)*5; G.score+=pts; st.pts+=pts; G.lines.push([label,pts,kind]); fx((pts>0?'+':'')+pts,x,y,col,pts>=300?12:10); G.pulse=0.25; return pts; };
    const chainUp=()=>{ const was=cubMult(G.chain); G.chain++; G.bestChain=Math.max(G.bestChain,G.chain); const now=cubMult(G.chain);
      blip(440*Math.pow(2,Math.min(G.chain,18)/12),0.07,0.05,'triangle'); if(now>was){ fx('x'+now+'!',VW/2,VH*0.3,'#ffd98a',13); jingle([784,988,1319],0.05,'square',0.04); buzz(20);
        if(now===1.5&&!G.toldChain&&easy){ G.toldChain=true; talk('You\'re on a roll! Keep the chain going and everything is worth more.','laugh'); } } };
    const chainBreak=(half)=>{ if(G.chain>=3) fx(half?'chain cut':'chain lost',VW-40,26,'#f25c54',7); G.chain=half?Math.floor(G.chain/2):0; };
    function startAisle(){ G.aisle++; if(G.aisle>=CUB.aisles.length){ G.phase='end'; G.pT=0; return; }
      const a=CUB.aisles[G.aisle]; plan=cubPlan(G.aisle,G.level); G.plan=plan; G.T=plan.T; st={pts:0,req:0,snack:0,junk:0,caught:0,missed:0}; G.aT=0; G.phase='play'; G.pT=0; G.items=plan.items; G.shoppers=[]; G.reqs=[]; G.sneak=0; G.rate=3.2/plan.T;
      G.mom.away=false; G.mom.awayUntil=0; G.mom.look=1; G.his=plan.his.slice(); G.sprint=false;
      if(G.level===2){ talk('Ready, Cam?','ask'); talk('Weeeeee!','laugh',{then:()=>{ G.sprint=true; jingle([523,659,784,1047,1319],0.06,'square',0.05); }}); }
      else if(!opts.dream){ talk(a.intro,'laugh'); if(easy&&a.tip) talk(a.tip,'ask'); } }
    function finishAisle(){ let s=1; if(st.missed<=1&&st.junk<=1) s=2; if(st.missed===0&&st.junk===0&&st.snack>=Math.ceil(plan.nSnack*0.5)) s=3; G.stars.push(s); G.lastStars=s; }
    function itemXY(it){ return cubItemXY(it.p,it.side); }
    function grab(side){
      const key=side?'R':'L'; G.hand[key]=0.3;
      const on=G.items.filter(x=>x.state==='on'&&x.side===side); let it=null;
      for(const x of on) if(x.p>=0.70&&x.p<=1.0&&(!it||Math.abs(x.p-CUB.SWEET)<Math.abs(it.p-CUB.SWEET))) it=x;
      if(!it){ const near=on.find(x=>(x.p>0.58&&x.p<0.70)||(x.p>1.0&&x.p<1.07));
        if(near){ near.state='knock'; near.gotT=0; const [x,y]=itemXY(near); G.hand['t'+key]=[x,y]; fx(near.p<0.7?'Too early!':'Too late!',x,y-16,'#f25c54',8); blip(170,0.12,0.05,'sawtooth'); chainBreak(false);
          if(near.kind==='mom'&&G.reqs.includes(near.id)){ G.reqs=G.reqs.filter(r=>r!==near.id); st.missed++; G.rec.missed.push(near.id); say('Oops. I\'ll get it.',1.4); } }
        else { G.hand['t'+key]=null; blip(180,0.05,0.03,'triangle'); }
        return; }
      const [x,y]=itemXY(it); G.hand['t'+key]=[x,y]; const nm=CUB.items[it.id][3], perfect=Math.abs(it.p-CUB.SWEET)<=0.05, pm=perfect?1.5:1; it.gotT=0;
      const good=(col)=>{ it.state='got'; G.fly.push({id:it.id,x,y,t:0}); burst(x,y,col,perfect?12:6); if(perfect){ G.perfects++; fx('PERFECT',x,y-26,'#fff',7); G.freeze=0.06; } buzz(perfect?18:10); };
      if(it.kind==='mom'){
        if(G.reqs.includes(it.id)){ G.reqs=G.reqs.filter(r=>r!==it.id); chainUp(); add(CUB.PTS.mom*pm*cubMult(G.chain),nm.toUpperCase(),'M',x,y-12,'#7bd95a'); good('#7bd95a'); G.rec.mom.push(it.id); st.req++;
          if(it.id==='kale'&&!opts.dream) talk('Nick loves this stuff. Ha ha ha!','laugh'); else say(['Thanks, bud!','Good job!','Nice grab!','That\'s the one!','Yes sir!'][Math.floor(Math.random()*5)],1.3,'smile'); }
        else { it.state='back'; chainBreak(false); add(CUB.PTS.wrong,nm.toUpperCase()+' (WRONG ONE)','J',x,y-12,'#f25c54'); say(['Not that one, bud.','Close! Not that.','Wrong one, mister.'][Math.floor(Math.random()*3)],1.5,'caught'); blip(150,0.16,0.05,'sawtooth'); }
      } else if(it.kind==='cam'){
        if(it.id==='icecream'){ chainUp(); add(CUB.PTS.cam*pm*cubMult(G.chain),nm.toUpperCase(),'C',x,y-12,'#ffd98a'); good('#ffd98a'); G.rec.cam.push(it.id); st.snack++; talk('Oh good job dude. Mommy wants that too.','laugh'); csay('Snacks!'); jingle([523,659,784,1047],0.07,'triangle',0.05); }
        else if(G.mom.look>0.3){ it.state='back'; G.rec.caught++; st.caught++; G.sneak=0; chainBreak(true); G.shake=0.2; fx('Caught!',x,y-14,'#f25c54',10);
          say(['Cam! Put that back.','Nope. Back on the shelf.','I saw that, mister.','Not today, bud.'][Math.floor(Math.random()*4)],1.8,'caught'); blip(150,0.2,0.06,'sawtooth'); buzz(40); }
        else { G.sneak++; chainUp(); const sm=1+0.5*(G.sneak-1); add(CUB.PTS.cam*sm*pm*cubMult(G.chain),nm.toUpperCase()+(G.sneak>1?' (SNEAK x'+G.sneak+')':''),'C',x,y-12,'#ffd98a'); good('#ffd98a'); G.rec.cam.push(it.id); st.snack++; csay(G.sneak>2?'Hee hee hee!':'Snacks!'); }
      } else { it.state='back'; chainBreak(false); st.junk++; G.rec.junk.push(it.id); add(CUB.PTS.junk,nm.toUpperCase()+' (RETURN)','J',x,y-12,'#f25c54'); G.shake=0.12;
        say(['We don\'t need that.','What? No. Why.','Put the '+nm.toLowerCase()+' down.','Not on the list, bud.'][Math.floor(Math.random()*4)],1.8,'caught'); blip(140,0.25,0.06,'sawtooth'); buzz(40); }
    }
    function hi(){ csay('Hi!',0.9); blip(880,0.08,0.05,'triangle');
      const sh=G.shoppers.find(s=>!s.greeted&&!s.chat&&s.p>0.3&&s.p<0.88);
      if(sh){ sh.greeted=true; greets++; chainUp(); G.rec.hi++; const [x,y]=cubShopXY(sh);
        const p=Math.round(CUB.PTS.hi*cubMult(G.chain)/5)*5; G.score+=p; st.pts+=p; G.hiPts=(G.hiPts||0)+p; fx('+'+p,x,y-40,'#7bd95a',9); burst(x,y-30,'#7bd95a',5);
        if(Math.random()<0.2||(greets>=3&&!closeUp)){ closeUp=true; sh.close=true; talk(CUB.closeUps[Math.floor(Math.random()*CUB.closeUps.length)],'roll',{who:'shopper',sh,then:()=>{ sh.close=false; say(['Okay! Bye now!','Mm-hm. So cute. Moving on.','We\'re on a schedule, ma\'am.'][Math.floor(Math.random()*3)],1.4,'roll'); }}); }
        else { sh.reply=CUB.hiReplies[Math.floor(Math.random()*CUB.hiReplies.length)]; sh.replyT=2.4; } } }
    startAisle();
    S.mini={ full:true, G, taps(){ const W=VW; if(G.talk) return [{x:0,y:0,w:W,h:VH,k:'a'}]; return [{x:0,y:0,w:W*0.38,h:VH,k:'left'},{x:W*0.62,y:0,w:W*0.38,h:VH,k:'right'},{x:W*0.38,y:0,w:W*0.24,h:VH,k:'a'}]; },
      update(dt){ const m=G.mom;
        if(G.freeze>0){ G.freeze-=dt; return; }
        G.t+=dt; cubTick(G,dt);
        // ---- talking: the cart is stopped
        if(!G.talk&&G.talkQ.length&&G.phase!=='end'&&!G.guide){ G.talk=G.talkQ.shift(); G.talk.t=0; m.mood=G.talk.mood; m.moodT=99; m.say=null; blip(620,0.06,0.04,'triangle'); for(const k in pressed) pressed[k]=false; }
        if(G.talk){ const tk=G.talk; tk.t+=dt; if(G.lean>0.6||tk.who) tk.shown=Math.min(tk.text.length,tk.shown+dt*38);
          if(Math.floor(tk.shown)%3===0&&tk.shown<tk.text.length&&Math.random()<0.5) blip((tk.who?520:640)+Math.random()*60,0.03,0.02);
          if(hit('a')&&tk.t>0.25){ if(tk.shown<tk.text.length) tk.shown=tk.text.length; else { G.talk=null; m.moodT=0; m.mood='smile'; if(tk.then) tk.then(); G.resume=G.talkQ.length?0:0.45; blip(900,0.03,0.03); } }
          hit('left'); hit('right'); hit('b'); hit('up'); hit('down'); return; }
        if(G.resume>0){ G.resume-=dt; hit('a'); hit('left'); hit('right'); return; }
        if(G.phase==='stars'){ G.pT+=dt; if(G.pT>1.7){ startAisle(); } hit('a'); hit('left'); hit('right'); return; }
        if(G.phase==='end'){ G.pT+=dt; if(G.pT>0.3&&!G.done){ G.done=true; S.mini=null; resolve(G); } return; }
        // ---- guided first tries (easy only): everything waits for the right press
        if(G.guide){ const gd=G.guide; if(hit(gd.it.side?'right':'left')){ G.guide=null; grab(gd.it.side); } hit('a'); hit('left'); hit('right'); hit('b'); return; }
        const T=G.T; G.aT+=dt;
        if(opts.dream&&(st.req+st.missed>=opts.dream||G.aT>24)){ G.dreamT=(G.dreamT||0)+dt; if(G.dreamT>1.1&&!G.done){ G.done=true; resolve(G); } }
        if(hit('left')) grab(0); if(hit('right')) grab(1); if(hit('a')) hi(); hit('b'); hit('up'); hit('down');
        // scripted beats
        while(plan.ev.length&&G.aT>=plan.ev[0].t){ const e=plan.ev.shift();
          if(e.type==='ask'){ const names=e.ids.map(id=>CUB.items[id][3].toLowerCase()); m.away=false; talk('Cam, grab the '+names.join(' AND the ')+'!','ask',{icons:e.ids,then:()=>{ for(const id of e.ids) G.reqs.push(id); }}); }
          else if(e.type==='away'){ const go=()=>{ m.away=true; m.awayUntil=G.aT+e.dur; m.mode=e.mode; m.told=false; G.sneak=0; };
            if(e.mode==='list') talk('Let\'s see... what else is on this list...','ask',{then:go}); else if(e.mode==='phone') talk('Hang on, Daddy\'s texting me.','ask',{then:go}); else go(); }
          else if(e.type==='chat'){ G.shoppers.push({p:0,side:-1,sp:1/3.2,hue:6,chat:true,stopAt:0.62,greeted:true,stay:e.dur}); }
          else if(e.type==='ice'){ talk('Ooh. Do we need ice cream? ...We need ice cream.','laugh'); } }
        // Mom's head: turning back is the warning
        if(m.away&&G.aT>=m.awayUntil-plan.tell){ if(!m.told){ m.told=true; blip(980,0.03,0.04,'square'); } }
        if(m.away&&G.aT>=m.awayUntil){ m.away=false; if(G.sneak>=2){ const b=40*G.sneak*G.sneak; G.score+=b; st.pts+=b; G.sneakPts=(G.sneakPts||0)+b; fx('SNEAKY x'+G.sneak+'  +'+b,VW/2,VH*0.42,'#ffd98a',11); jingle([659,880,1175,1568],0.05,'square',0.04); } G.sneak=0; }
        const target=(m.away&&G.aT<m.awayUntil-plan.tell)?0:1; m.look+=Math.sign(target-m.look)*Math.min(Math.abs(target-m.look),dt/(target?plan.tell:0.25));
        // items
        for(const it of G.items){ if(it.state==='wait'){ if(G.aT>=it.spawn) it.state='on'; else continue; }
          if(it.state==='on'){ it.p=(G.aT-it.spawn)/T;
            if(easy&&!G.guide&&it.p>=CUB.SWEET-0.012&&it.p<CUB.SWEET+0.03){
              if(it.kind==='mom'&&G.reqs.includes(it.id)&&!G.taughtGrab){ G.taughtGrab=true; G.guide={it,text:'Now! Grab it!'}; }
              else if(it.kind==='cam'&&it.id!=='icecream'&&m.look<0.25&&!G.taughtSnack){ G.taughtSnack=true; G.guide={it,text:'She isn\'t looking. Grab the snack!'}; } }
            if(it.p>=1.07){ it.state='gone'; if(it.kind==='mom'&&G.reqs.includes(it.id)){ G.reqs=G.reqs.filter(r=>r!==it.id); st.missed++; G.rec.missed.push(it.id); chainBreak(false); say('I\'ll get it.',1.3); } } }
          else { it.gotT+=dt; if(it.gotT>0.5) it.state='gone'; } }
        // shoppers come down the aisle and walk past the cart
        if(G.his.length&&G.aT>=G.his[0]){ G.his.shift(); G.shoppers.push({p:0,side:Math.random()<0.5?-1:1,sp:1/(4.6*CUB.levels[G.level].T),hue:Math.floor(Math.random()*6),greeted:false,reply:null,replyT:0}); }
        for(const sh of G.shoppers){ if(sh.chat&&sh.p>=sh.stopAt&&sh.stay>0){ if(!sh.started){ sh.started=true; sh.reply='Grace! Oh my gosh, how ARE you?'; sh.replyT=4.6; say('Oh! Hi! Good, we\'re good...',2.2); m.away=true; m.awayUntil=G.aT+sh.stay; m.mode='L'; m.told=false; G.sneak=0; }
              sh.stay-=dt; }
          else sh.p+=sh.sp*dt; if(sh.replyT>0) sh.replyT-=dt; }
        G.shoppers=G.shoppers.filter(s=>s.p<1.25);
        if(G.aT>=plan.len&&!G.items.some(i=>i.state!=='gone')&&!G.talkQ.length){ finishAisle(); st=null; G.sprint=false; G.rate=0; G.phase='stars'; G.pT=0; jingle([523,659,784].slice(0,G.lastStars).concat([1047]),0.1,'triangle',0.05); }
      },
      draw(){ cubDraw(G); }
    };
  });
}
// shared animation bookkeeping (also used by the idle scenes around the game)
function cubTick(G,dt){ const m=G.mom;
  for(const k of ['L','R']) if(G.hand[k]>0) G.hand[k]-=dt;
  if(m.sayT>0){ m.sayT-=dt; if(m.sayT<=0) m.say=null; } if(m.moodT>0){ m.moodT-=dt; if(m.moodT<=0) m.mood='smile'; }
  m.blink-=dt; if(m.blink<-0.12) m.blink=2+Math.random()*3;
  if(G.camSayT>0){ G.camSayT-=dt; if(G.camSayT<=0) G.camSay=null; }
  if(G.shake>0) G.shake-=dt; if(G.pulse>0) G.pulse-=dt;
  const leanT=(G.talk&&G.talk.who!=='shopper')?1:0; G.lean+=(leanT-G.lean)*Math.min(1,dt*9);
  const stop=G.talk||G.resume>0||G.guide||G.phase==='stars'; G.speedK+=((stop?0:1)-G.speedK)*Math.min(1,dt*(stop?10:5)); G.scr+=(G.rate||0)*G.speedK*dt;
  for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<1);
  for(const p of G.parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=160*dt; } G.parts=G.parts.filter(p=>p.t<p.life);
  for(const f of G.fly){ f.t+=dt; if(f.t>=0.42&&!f.in){ f.in=true; G.cart.push({id:f.id,t:0}); if(G.cart.length>9) G.cart.shift(); } } G.fly=G.fly.filter(f=>f.t<0.42);
  for(const c of G.cart) c.t+=dt;
}
// a shopper walking down the aisle toward the cart: where their feet are and how big they look
function cubShopXY(sh){ const W=VW,Hh=VH,cx=W/2,vy=Math.round(Hh*0.34); const e=Math.pow(Math.min(1.3,sh.p),1.7); return [cx+sh.side*(13+e*W*0.36), vy+13+e*(Hh*0.98-(vy+13)), 0.42+e*2.3]; }
function cubShopper(G,sh){
  const [x,y,s]=cubShopXY(sh); const shirts=['#4a78c8','#c84a6a','#4aa868','#c8a03a','#8a5ac8','#3aa8b8','#e07a9a'], hairs=['#3a2a1e','#c8a03a','#8a8a92','#5a3a22','#1e1e24','#a85a2a','#e8e4d8'];
  const still=(sh.chat&&sh.started&&sh.stay>0)||G.speedK<0.3; const step=still?0:Math.sin(G.t*9+sh.hue)*1.4;
  U.save(); U.translate(x,y); U.scale(s,s);
  U.fillStyle='rgba(0,0,0,0.16)'; U.beginPath(); U.ellipse(0,0,7,1.6,0,0,7); U.fill();
  uRR(sh.side*7-5,-13,10,8,1,'#b4bac4',CO,0.7/s+0.3); U.strokeStyle='#8a8a96'; U.lineWidth=0.6; U.beginPath(); U.moveTo(sh.side*7-3,-5); U.lineTo(sh.side*7-3,-1); U.moveTo(sh.side*7+3,-5); U.lineTo(sh.side*7+3,-1); U.stroke();
  uRR(-3.4,-8,2.8,8+step*0.4,1,'#3a4a6a',CO,0.6); uRR(0.6,-8,2.8,8-step*0.4,1,'#3a4a6a',CO,0.6);
  uRR(-5,-19,10,12,3.4,shirts[sh.hue],CO,0.7); uCirc(0,-23.5,4.2,'#eebf98',CO,0.7);
  uHair(0,-24.6,4.4,3.25,6.18,hairs[sh.hue],{teeth:4}); if(sh.hue%2===0){ uRR(-4.9,-25,2.4,9,1,hairs[sh.hue],null); uRR(2.5,-25,2.4,9,1,hairs[sh.hue],null); }
  U.fillStyle=CO; U.fillRect(-2,-24,0.9,1.2); U.fillRect(1.1,-24,0.9,1.2); U.strokeStyle='#8a3a3a'; U.lineWidth=0.6; U.beginPath(); U.arc(0,-22.6,1.6,0.4,2.74); U.stroke();
  U.restore();
  if(sh.reply&&sh.replyT>0) drawBubbleU(sh.reply,Math.max(40,Math.min(VW-40,x)),y-30*s);
  else if(!sh.greeted&&!sh.chat&&sh.p>0.3&&sh.p<0.88){ const r=7+Math.sin(G.t*10)*0.9, by=Math.max(30,y-34*s); uCirc(x,by,r,'#7bd95a',CO,0.9); txt(keyName('a'),x,by-4.5,CO,8,'center',true); txt('say hi',x,by+r+1,'#fff',5.5,'center',true); }
}
function cubItemXY(p,side){ const W=VW,Hh=VH,cx=W/2,vy=Math.round(Hh*0.34),farX=28; const e=Math.min(1.1,Math.max(0,p))**2, sx=side?1:-1;
  return [cx+sx*(farX-6+(cx-farX-12)*e), vy-4+(Hh*0.5-(vy-4))*e, 0.35+e*1.75]; }
function cubStore(G,speed){
  const W=VW,Hh=VH,cx=W/2,vy=Math.round(Hh*0.34);
  // ceiling, lights, back wall
  let g=U.createLinearGradient(0,0,0,vy); g.addColorStop(0,'#cfd6de'); g.addColorStop(1,'#e9edf1'); U.fillStyle=g; U.fillRect(0,0,W,vy);
  for(let i=0;i<4;i++){ const q=(i+0.5)/4, y=vy*(1-q)*0.9, hw=14+(1-q)*60; uPoly([[cx-hw,y],[cx+hw,y],[cx+hw*0.86,y+3+(1-q)*4],[cx-hw*0.86,y+3+(1-q)*4]],'#fbfdff','rgba(46,40,56,0.25)',0.6); }
  g=U.createLinearGradient(0,vy,0,Hh); g.addColorStop(0,'#d9cba8'); g.addColorStop(1,'#f2e8cf'); U.fillStyle=g; U.fillRect(0,vy,W,Hh-vy);
  U.strokeStyle='rgba(150,130,90,0.5)'; U.lineWidth=0.7; U.beginPath();
  for(let i=-6;i<=6;i++){ U.moveTo(cx+i*5,vy); U.lineTo(cx+i*W*0.22,Hh); }
  const ph=(G.scr)%1; for(let k=0;k<7;k++){ const q=(k+ph)/7; const y=vy+(Hh-vy)*q*q; U.moveTo(0,y); U.lineTo(W,y); } U.stroke();
  g=U.createLinearGradient(cx-40,0,cx+40,0); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.5,'rgba(255,255,255,0.35)'); g.addColorStop(1,'rgba(255,255,255,0)'); U.fillStyle=g; U.fillRect(cx-40,vy,80,Hh-vy);
  uRR(cx-27,vy-25,54,36,2,'#c3c9d1','rgba(46,40,56,0.5)',0.8); uRR(cx-27,vy-25,54,8,2,'#d8232a','rgba(46,40,56,0.5)',0.8); uRR(cx-18,vy-12,36,23,1,'#aab2bd',null);
  // shelves
  const farX=28, nearY0=-8, nearY1=Hh*0.92; const pal=['#d99a84','#8fb8a0','#e2c878','#95a9d0','#cf9cc0','#b9c08a','#e8a860','#9ad0d8'];
  for(const side of [0,1]){ const sx=side?1:-1; const X=e=>cx+sx*(farX+(cx-farX)*e); const top=e=>vy-25+(nearY0-(vy-25))*e, bot=e=>vy+12+(nearY1-(vy+12))*e;
    g=U.createLinearGradient(X(0),0,X(1),0); g.addColorStop(0,'#a8987a'); g.addColorStop(1,'#cdbd9c'); uPoly([[X(1),nearY0],[X(1),nearY1],[X(0),vy+12],[X(0),vy-25]],g,'rgba(46,40,56,0.6)',0.8);
    const rows=4;
    for(let k=11;k>=0;k--){ const q=((k+((G.scr*1.35)%1))/12); const e=q*q; const x=X(e), h=(bot(e)-top(e)); const sz=h/rows*0.62, w=Math.max(1,sz*0.62);
      for(let row=0;row<rows;row++){ const y=top(e)+h*(row+0.92)/rows-sz; const hsh=(((k-Math.floor(G.scr*1.35))%12+12)*7+row*5+side*3)%8;
        U.fillStyle=pal[hsh]; U.beginPath(); U.roundRect(x-(side?0:w),y,w,sz,Math.min(1.5,w*0.25)); U.fill(); if(e>0.12){ U.strokeStyle='rgba(46,40,56,0.45)'; U.lineWidth=0.5; U.stroke(); U.fillStyle='rgba(255,255,255,0.3)'; U.fillRect(x-(side?-w*0.15:w*0.85),y+sz*0.15,w*0.18,sz*0.6); } } }
    for(let row=1;row<=rows;row++){ const f=row/rows; const y1=top(1)+(bot(1)-top(1))*f*0.99, y0=top(0)+(bot(0)-top(0))*f; uPoly([[X(1),y1],[X(1),y1+3],[X(0),y0+0.8],[X(0),y0]],'#f3efe6','rgba(46,40,56,0.5)',0.5); }
  }
}
function cubGrace(G,mx,my,handY){
  const m=G.mom, away=1-m.look, HAIR='#6a4630', HAIR2='#7d5538', SKIN='#f2caa8', TOP='#34313f', TOP2='#454152';
  let hx=0, hy=0, gx=0, gy=0; if(m.mode==='L'||m.mode==='R'){ const d=m.mode==='L'?-1:1; hx=d*7*away; gx=d*2.6*away; } else { hy=3.5*away; gy=2.2*away; }
  const sprint=G.sprint&&G.speedK>0.5, bob=sprint?Math.abs(Math.sin(G.t*13))*-3.2:Math.sin(G.t*5)*0.8*Math.max(0.25,G.speedK||0); my+=bob;
  const lean=G.lean||0; U.save(); U.translate(mx,handY+8); U.scale(1+lean*0.3,1+lean*0.3); U.translate(-mx,-(handY+8)+lean*9);
  if(sprint){ // legs kicking out behind, hair streaming
    const k=Math.sin(G.t*13); for(const sd of [-1,1]){ const up=Math.max(0,sd*k), fx2=mx+sd*(44+up*14), fy2=my+60-up*34; uLimb([[mx+sd*18,my+68],[mx+sd*(34+up*6),my+70-up*10],[fx2,fy2]],8,'#5a78b0'); U.save(); U.translate(fx2,fy2); U.rotate(sd*(0.5+up*0.9)); uRR(-8,-5,16,10,4,'#f0ece4',CO,1); U.fillStyle='#c8ccd4'; U.fillRect(-7,2,14,2); U.restore(); }
    uRR(mx-21,my-41-Math.abs(Math.sin(G.t*13))*3,42,20,10,HAIR); }
  uRR(mx-20+hx*0.6,my-37+hy,40,56,15,HAIR);                                     // hair behind
  uStrands(mx+hx*0.6,my-22+hy,my+15+hy,36,HAIR,5);
  uRR(mx-27,my+3,54,80,13,TOP); U.fillStyle=TOP2; U.beginPath(); U.roundRect(mx-22,my+8,12,60,6); U.fill();      // torso
  uPoly([[mx-7,my+3],[mx+7,my+3],[mx,my+13]],SKIN,CO,0.9); uRR(mx-5,my-6,10,11,3,SKIN,CO,0.9);
  U.strokeStyle='#d8d4cc'; U.lineWidth=1; U.beginPath(); U.moveTo(mx-5,my+12); U.lineTo(mx-6,my+26); U.moveTo(mx+5,my+12); U.lineTo(mx+6,my+26); U.stroke();
  const holding=(m.mode==='list'||m.mode==='phone')&&away>0.15;
  // arms to the cart handle (one comes up when she is reading)
  uLimb([[mx-25,my+12],[mx-31,my+38],[mx-28,handY-1]],9,TOP);
  if(holding){ const k=Math.min(1,away*1.6); uLimb([[mx+25,my+12],[mx+27,my+34],[mx+10,my+30-k*4]],9,TOP);
    if(m.mode==='list'){ uRR(mx-8,my+10-k*4,18,24,1.5,'#fbfaf4'); U.strokeStyle='#9aa0b0'; U.lineWidth=0.8; for(let i=0;i<5;i++){ U.beginPath(); U.moveTo(mx-5,my+15-k*4+i*4); U.lineTo(mx+7,my+15-k*4+i*4); U.stroke(); } }
    else { uRR(mx-4,my+12-k*4,11,19,2,'#2a2a34'); uRR(mx-2.5,my+14-k*4,8,13,1,'#8fd0f0',null); }
    uCirc(mx+9,my+30-k*4,4.2,SKIN,CO,0.9); }
  else uLimb([[mx+25,my+12],[mx+31,my+38],[mx+28,handY-1]],9,TOP);
  // head
  const fx_=mx+hx, fy=my+hy;
  uRR(fx_-13,fy-31,26,31,11,SKIN);
  const turned=Math.abs(hx)>2, d=Math.sign(hx);
  // hair front: cap + side locks (the far lock hides when she turns)
  U.beginPath(); U.moveTo(fx_-14,fy-17); U.quadraticCurveTo(fx_-15,fy-34,fx_,fy-34); U.quadraticCurveTo(fx_+15,fy-34,fx_+14,fy-17); U.quadraticCurveTo(fx_+9,fy-26,fx_+1,fy-27); U.quadraticCurveTo(fx_-8,fy-26,fx_-14,fy-17); U.closePath(); U.fillStyle=HAIR; U.fill(); U.strokeStyle=CO; U.lineWidth=1; U.stroke();
  U.strokeStyle=HAIR2; U.lineWidth=1.2; U.beginPath(); U.moveTo(fx_-8,fy-31); U.quadraticCurveTo(fx_-2,fy-33,fx_+6,fy-30); U.stroke();
  for(let i=0;i<4;i++){ U.strokeStyle=i%2?HAIR2:hexShade(HAIR,-0.3); U.lineWidth=1; U.beginPath(); U.moveTo(fx_-9+i*6,fy-32.5); U.quadraticCurveTo(fx_-12+i*7,fy-27,fx_-13+i*8.5,fy-21-(i%2)*2); U.stroke(); }
  if(!(turned&&d<0)) uRR(fx_-16-(turned?3:0),fy-22,6+(turned?8:0),26,3,HAIR); if(!(turned&&d>0)) uRR(fx_+10-(turned?5:0),fy-22,6+(turned?8:0),26,3,HAIR);
  // face
  const ex=5.6, ey=fy-16+gy*0.5, mood=m.moodT>0?m.mood:(sprint&&m.look>0.6?'laugh':m.look>0.6?'smile':'away'), blink=m.blink<0;
  const eye=(sx)=>{ const x=fx_+sx*ex+gx*1.4; if(turned&&sx===-d&&away>0.7) return;
    if(mood==='roll'){ uCirc(x,ey,2.7,'#fff',CO,0.8,3.1); uCirc(x+1.1,ey-1.9,1.4,'#3a2a22',null); U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(x-2.9,ey+0.6); U.lineTo(x+2.9,ey+0.6); U.stroke(); return; }
    if(mood==='laugh'||blink){ U.strokeStyle=CO; U.lineWidth=1.2; U.beginPath(); U.arc(x,ey+1,2.4,3.5,5.9); U.stroke(); return; }
    if(mood==='away'&&m.mode!=='L'&&m.mode!=='R'){ U.strokeStyle=CO; U.lineWidth=1.2; U.beginPath(); U.arc(x,ey-0.5,2.4,0.4,2.75); U.stroke(); return; }
    uCirc(x,ey,2.7,'#fff',CO,0.8,3.1); uCirc(x+gx*0.6,ey+gy*0.4,1.5,'#3a2a22',null);
    U.fillStyle='#fff'; U.fillRect(x+gx*0.6-0.9,ey+gy*0.4-1.1,0.8,0.8); };
  eye(-1); eye(1);
  U.strokeStyle='#4e3322'; U.lineWidth=1.3; U.lineCap='round'; const br=(sx,raise)=>{ const x=fx_+sx*ex+gx*1.4; U.beginPath(); U.moveTo(x-3,ey-5.5-raise+(mood==='caught'?sx*-1.2:0)); U.lineTo(x+3,ey-5.5-raise+(mood==='caught'?sx*1.2:0)); U.stroke(); };
  if(!(turned&&away>0.7)){ br(-1,mood==='caught'?0:mood==='ask'?1:0); br(1,mood==='caught'?2.2:mood==='ask'?1:0); } else br(d,0);
  U.lineCap='butt'; const mxm=fx_+gx*1.6, mym=fy-6.5+gy*0.3;
  if(mood==='laugh'){ U.beginPath(); U.moveTo(mxm-4.5,mym-1.5); U.quadraticCurveTo(mxm,mym+6,mxm+4.5,mym-1.5); U.closePath(); U.fillStyle='#7a2a2a'; U.fill(); U.strokeStyle=CO; U.lineWidth=0.8; U.stroke(); U.fillStyle='#fff'; U.fillRect(mxm-3,mym-1.4,6,1.3); }
  else if(mood==='roll'){ U.strokeStyle='#8a3a3a'; U.lineWidth=1.3; U.beginPath(); U.moveTo(mxm-3.5,mym); U.lineTo(mxm+3.5,mym); U.stroke(); }
  else if(mood==='caught'){ U.strokeStyle='#8a3a3a'; U.lineWidth=1.3; U.beginPath(); U.moveTo(mxm-3.5,mym+0.8); U.lineTo(mxm+3.5,mym-0.4); U.stroke(); }
  else if((mood==='ask'&&!(G.talk&&G.talk.shown>=G.talk.text.length))||m.say){ uCirc(mxm,mym,2.2,'#7a2a2a',CO,0.8,1.6+Math.abs(Math.sin(G.t*14))*1.4); }
  else { U.strokeStyle='#8a3a3a'; U.lineWidth=1.3; U.beginPath(); U.arc(mxm,mym-2.2,4,0.5,2.64); U.stroke(); }
  U.fillStyle='rgba(232,120,120,0.28)'; if(!turned){ U.beginPath(); U.arc(fx_-8.5,fy-9,2.6,0,7); U.arc(fx_+8.5,fy-9,2.6,0,7); U.fill(); }
  // eye badge: is it safe?
  const watching=m.look>0.3, warn=m.away&&m.told; const by=fy-45;
  uRR(fx_-9,by-5,18,10,5,watching?'#b3261e':(warn&&Math.floor(G.t*14)%2?'#e8a81e':'#2f8f4a'),CO,0.9);
  if(watching){ uCirc(fx_,by,3.4,'#fff',null,0,2.3); uCirc(fx_,by,1.5,CO,null); } else { U.strokeStyle='#fff'; U.lineWidth=1.2; U.beginPath(); U.arc(fx_,by-1.5,3.4,0.5,2.64); U.stroke(); }
  U.restore();
  return [fx_,fy+lean*9-(lean*0.3)*(handY+8-fy)];
}
function cubDraw(G){
  const W=VW,Hh=VH,cx=W/2,vy=Math.round(Hh*0.34); const m=G.mom; const ai=Math.max(0,Math.min(G.aisle,CUB.aisles.length-1)), a=CUB.aisles[ai];
  ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
  U.save(); if(G.shake>0) U.translate((Math.random()-0.5)*5*G.shake/0.2,(Math.random()-0.5)*4*G.shake/0.2);
  cubStore(G,0);
  // hanging aisle sign
  U.fillStyle=CO; U.fillRect(cx-24,0,1,5); U.fillRect(cx+23,0,1,5); uRR(cx-38,3,76,13,2.5,'#d8232a',CO,0.9); txt('AISLE '+(ai+1)+'  '+a.name.toUpperCase(),cx,6,'#fff',6,'center',true);
  // shoppers still far down the aisle (behind Mom)
  const shs=G.shoppers.slice().sort((p,q)=>p.p-q.p); for(const sh of shs) if(sh.p<0.78&&!sh.close) cubShopper(G,sh);
  // items riding the shelves toward Cam
  for(const it of G.items){ if(it.state==='wait'||it.state==='gone'||it.state==='got') continue; let [x,y,sc]=cubItemXY(it.p,it.side); const sz=16*sc; let rot=0, al=1;
    if(it.state==='back'){ x+=Math.sin(it.gotT*40)*2*(1-it.gotT/0.5); }
    if(it.state==='knock'){ y+=it.gotT*it.gotT*260; rot=it.gotT*9*(it.side?1:-1); al=1-it.gotT/0.5; }
    const inZone=it.state==='on'&&it.p>=0.70&&it.p<=1.0, wanted=it.kind==='mom'&&G.reqs&&G.reqs.includes(it.id);
    if(it.state==='on'&&it.p>0.45&&it.p<=1.0){ const d=(CUB.SWEET-it.p)/0.4; const r0=sz*0.66; // timing ring closes onto the target ring
      U.globalAlpha=0.9; U.strokeStyle=wanted?'#7bd95a':it.kind==='cam'?'#ffd98a':'#ffffff'; U.lineWidth=inZone?1.6:1; U.beginPath(); U.arc(x,y,r0,0,7); U.stroke();
      if(d>0){ U.globalAlpha=0.75; U.lineWidth=1.2; U.beginPath(); U.arc(x,y,r0+d*26,0,7); U.stroke(); } else if(Math.abs(it.p-CUB.SWEET)<=0.05){ U.globalAlpha=0.5; U.fillStyle=U.strokeStyle; U.beginPath(); U.arc(x,y,r0,0,7); U.fill(); }
      U.globalAlpha=1; }
    U.save(); U.translate(x,y); U.rotate(rot); U.globalAlpha=Math.max(0,al); U.fillStyle='rgba(0,0,0,0.18)'; U.beginPath(); U.ellipse(0,sz*0.5,sz*0.36,sz*0.08,0,0,7); U.fill();
    const pop=inZone?1+Math.sin(G.t*18)*0.03:1; U.drawImage(cubIcon(it.id),-sz/2*pop,-sz/2*pop,sz*pop,sz*pop); U.restore(); U.globalAlpha=1;
    if(it.state==='on'&&it.p>0.36){ const lx=Math.max(30,Math.min(W-30,x)); const nm=CUB.items[it.id][3]; U.font='bold 6px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(nm).width+6;
      uRR(lx-tw/2,y+sz/2+1,tw,8.5,3,wanted?'#2f8f4a':'rgba(40,36,52,0.82)',wanted?'#fff':null,0.7); txt(nm,lx,y+sz/2+2.2,'#fff',6,'center',true); } }
  // Mom, then the cart
  const hyB=Math.round(Hh*0.80), my=Math.round(Hh*0.5);
  const [hx_,hy_]=cubGrace(G,cx,my,hyB);
  uRR(cx-60,hyB-1,120,8,4,'#d8232a',CO,1); U.fillStyle='rgba(255,255,255,0.35)'; U.beginPath(); U.roundRect(cx-56,hyB+0.5,112,2,1); U.fill();
  const stick=Math.min(6,Math.floor(((META.best||{}).cubStars||0)/3)); for(let i=0;i<stick;i++){ const sx=cx-10+i*8-(stick-1)*4+10; cubStar(sx,hyB+3,2.6,'#ffd98a'); }
  uCirc(cx-28,hyB+2,4.6,'#f2caa8',CO,0.9); if(!((m.mode==='list'||m.mode==='phone')&&m.look<0.85)) uCirc(cx+28,hyB+2,4.6,'#f2caa8',CO,0.9);
  U.strokeStyle='#9a9aa6'; U.lineWidth=1.6; U.beginPath(); for(let i=-3;i<=3;i++){ U.moveTo(cx+i*17,hyB+7); U.lineTo(cx+i*18.5,Hh+2); } U.moveTo(cx-56,hyB+17); U.lineTo(cx+56,hyB+17); U.stroke();
  uRR(cx-40,Hh-7,80,10,3,'#c8ccd4',CO,0.9);
  for(const sh of shs) if(sh.p>=0.78&&!sh.close) cubShopper(G,sh);
  // Cam's arms (sleeves match what he is wearing)
  const of=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1], sleeve=of[4]||of[2];
  for(const side of [0,1]){ const key=side?'R':'L', k0=Math.max(0,G.hand[key])/0.3, k=Math.sin(Math.min(1,k0*1.25)*Math.PI*0.5), tg=G.hand['t'+key]; const rx=cx+(side?32:-32), ry=Hh-5;
    const tx_=tg?tg[0]:(side?W-26:26), ty_=tg?tg[1]:Hh*0.5; const x=rx+(tx_-rx)*k, y=ry+(ty_-ry)*k; const sx_=cx+(side?52:-52);
    uLimb([[sx_,Hh+6],[(sx_+x)/2+(side?8:-8)*(1-k),(Hh+6+y)/2+4],[x,y+2]],10,sleeve);
    uCirc(x,y,5.6,'#f6d0b4',CO,1); U.strokeStyle='rgba(46,40,56,0.55)'; U.lineWidth=0.7; U.beginPath(); for(let i=-1;i<=1;i++){ U.moveTo(x+i*2.4,y-5); U.lineTo(x+i*2.4,y-2); } U.stroke(); }
  // things flying into the cart, sparkles, numbers
  for(const f of G.fly){ const k=f.t/0.42, bx=20+Math.min(8,G.cart.length)*11, by=Hh-12; const x=f.x+(bx-f.x)*k, y=f.y+(by-f.y)*k-Math.sin(k*Math.PI)*34, s=22*(1-k*0.55); U.drawImage(cubIcon(f.id),x-s/2,y-s/2,s,s); }
  for(const p of G.parts){ U.globalAlpha=1-p.t/p.life; U.fillStyle=p.col; const s=2.4*(1-p.t/p.life)+0.6; U.fillRect(p.x-s/2,p.y-s/2,s,s); } U.globalAlpha=1;
  U.restore();
  // ---- HUD
  if(G.cart.length){ const n=G.cart.length; uRR(3,Hh-21,14+n*11,17,4,'rgba(28,24,40,0.78)','#8a8794',0.7); U.strokeStyle='#c8ccd4'; U.lineWidth=1; U.strokeRect(6.5,Hh-16.5,6,5); uCirc(7.5,Hh-9.5,1,'#c8ccd4',null); uCirc(11.5,Hh-9.5,1,'#c8ccd4',null);
    G.cart.forEach((c,i)=>{ const k=Math.min(1,c.t/0.18), sq=c.t<0.18?1+Math.sin(k*Math.PI)*0.35:1; const s=10; U.drawImage(cubIcon(c.id),16+i*11+(s-s*sq)/2,Hh-17.5+(s-s/sq),s*sq,s/sq); }); }
  const mult=cubMult(G.chain), pu=G.pulse>0?1+G.pulse*0.6:1;
  box(W-58,3,55,13,'rgba(28,24,40,0.85)'); txt(String(G.score),W-8,6+ (1-pu)*2,'#ffd98a',7*pu,'right',true); txt('PTS',W-54,7,'#a9a0b8',5.5);
  if(G.chain>0){ const cw=55; uRR(W-58,18,cw,10,3,mult>1?'#5a3a8a':'rgba(28,24,40,0.85)','#ffd98a',0.7); txt('CHAIN '+G.chain,W-55,20,'#fff',5.5,'left',true); txt('x'+mult,W-6,19.5,'#ffd98a',6.5,'right',true);
    const nxt=G.chain>=15?15:G.chain>=10?15:G.chain>=6?10:G.chain>=3?6:3, prv=G.chain>=15?15:G.chain>=10?10:G.chain>=6?6:G.chain>=3?3:0; if(nxt>prv){ U.fillStyle='#ffd98a'; U.fillRect(W-57,27,(cw-2)*(G.chain-prv)/(nxt-prv),1); } }
  if(G.reqs) G.reqs.forEach((id,i)=>{ const ry=(W<260?32:3)+i*22; uRR(3,ry,72,20,4,'rgba(28,24,40,0.88)','#7bd95a',1); U.drawImage(cubIcon(id),5,ry+2,16,16); txt('MOM WANTS',24,ry+3,'#7bd95a',5.5,'left',true); txt(CUB.items[id][3],24,ry+10,'#fff',6.5,'left',true); });
  if(G.sneak>0&&m.look<0.5){ txt('SNEAK x'+G.sneak,cx,Hh*0.86,'#ffd98a',7,'center',true); }
  for(const f of G.fx){ const k=f.t; U.globalAlpha=k>0.7?(1-k)/0.3:1; const pop=k<0.12?0.6+k/0.12*0.6:k<0.2?1.2-(k-0.12)/0.08*0.2:1; txt(f.txt,Math.max(24,Math.min(W-24,f.x)),f.y-k*18,f.col,f.size*pop,'center',true); U.globalAlpha=1; }
  if(m.say&&!G.talk) drawBubbleU(m.say,cx,hy_-52,Math.min(170,W-24));
  if(G.camSay) drawBubbleU(G.camSay,cx,Hh-24);
  if(G.sprint&&G.speedK>0.5){ U.strokeStyle='rgba(255,255,255,0.55)'; U.lineWidth=1; U.beginPath(); for(let i=0;i<10;i++){ const a=i*0.63+G.t*0.7, r0=40+((G.t*90+i*37)%60); U.moveTo(cx+Math.cos(a)*r0,vy+Math.sin(a)*r0*0.6); U.lineTo(cx+Math.cos(a)*(r0+16),vy+Math.sin(a)*(r0+16)*0.6); } U.stroke(); }
  if(G.guide){ const gd=G.guide, [gx,gy,gs]=cubItemXY(gd.it.p,gd.it.side); const r=16*gs*0.66+3+Math.sin(G.t*9)*2; U.strokeStyle='#fff'; U.lineWidth=2; U.beginPath(); U.arc(gx,gy,r,0,7); U.stroke();
    const bw=Math.min(150,W-16), bx=Math.max(8,Math.min(W-bw-8,gx-bw/2)), by2=Math.min(Hh-52,gy+16*gs*0.5+14); uRR(bx,by2,bw,24,6,'rgba(20,16,30,0.94)','#ffd98a',1.2); txt(gd.text,bx+bw/2,by2+4,'#fff',7,'center',true); txt('Press '+(gd.it.side?'▶':'◀'),bx+bw/2,by2+13,'#ffd98a',7.5,'center',true); }
  if(G.talk){ const tk=G.talk; const bw=Math.min(190,W-14), shown=tk.text.slice(0,Math.floor(tk.shown)), lines=wrap(tk.text,bw-(tk.icons?16+tk.icons.length*20:16),8), ic=tk.icons||[]; const bh=Math.max(lines.length*10+12,ic.length?28:0);
    let bx=cx-bw/2, by2, tx0, ty0;
    if(tk.who==='shopper'){ // a stranger leans right into the seat
      const sd=tk.sh?tk.sh.side:1, fx0=cx+sd*W*0.2, fy0=Hh*0.62, hue=tk.sh?tk.sh.hue:2; const hairs=['#3a2a1e','#c8a03a','#8a8a92','#5a3a22','#1e1e24','#a85a2a','#e8e4d8'], shirts=['#4a78c8','#c84a6a','#4aa868','#c8a03a','#8a5ac8','#3aa8b8','#e07a9a']; const wob=Math.sin(G.t*4)*2;
      uRR(fx0-52,fy0+34,104,Hh,26,shirts[hue],CO,1.4); uCirc(fx0,fy0+wob,40,'#f0c39c',CO,1.4,44); uHair(fx0,fy0-14+wob,42,3.3,6.12,hairs[hue],{ry:36,teeth:7});
      for(const e of [-1,1]){ uCirc(fx0+e*15,fy0-4+wob,8,'#fff',CO,1.1,9); uCirc(fx0+e*15,fy0-2+wob,4,'#3a2a22',null); U.fillStyle='#fff'; U.fillRect(fx0+e*15-2.5,fy0-5+wob,2.2,2.2); U.strokeStyle='#4e3322'; U.lineWidth=2; U.beginPath(); U.arc(fx0+e*15,fy0-12+wob,9,3.7,5.7); U.stroke(); }
      U.beginPath(); U.moveTo(fx0-14,fy0+18+wob); U.quadraticCurveTo(fx0,fy0+36+wob,fx0+14,fy0+18+wob); U.closePath(); U.fillStyle='#7a2a2a'; U.fill(); U.strokeStyle=CO; U.lineWidth=1.1; U.stroke(); U.fillStyle='#fff'; U.fillRect(fx0-9,fy0+18.6+wob,18,3);
      U.fillStyle='rgba(232,120,120,0.35)'; U.beginPath(); U.arc(fx0-26,fy0+12+wob,7,0,7); U.arc(fx0+26,fy0+12+wob,7,0,7); U.fill();
      by2=Math.max(20,fy0-58-bh); tx0=fx0; ty0=fy0-40; }
    else { by2=Math.max(18,hy_-42-bh-G.lean*4); tx0=cx; ty0=hy_-38; }
    uRR(bx,by2,bw,bh,7,'#fffaf0',CO,1.2); uPoly([[tx0-5,by2+bh-0.6],[tx0+5,by2+bh-0.6],[tx0,Math.min(ty0,by2+bh+9)]],'#fffaf0',CO,1.2); U.fillStyle='#fffaf0'; U.fillRect(tx0-4.2,by2+bh-1.6,8.4,1.8);
    let lx=bx+8; ic.forEach((id,i)=>{ U.drawImage(cubIcon(id),bx+6+i*20,by2+bh/2-9,18,18); lx=bx+10+(i+1)*20; });
    let n=0; lines.forEach((l,i)=>{ const part=shown.slice(n,n+l.length); n+=l.length+1; U.font='8px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; U.textAlign='left'; U.textBaseline='top'; U.fillStyle=CO; U.fillText(part,lx,by2+7+i*10); });
    if(tk.shown>=tk.text.length){ const pr=6+Math.sin(G.t*8)*0.8; uCirc(bx+bw-9,by2+bh-2,pr,'#ffd98a',CO,1); txt(keyName('a'),bx+bw-9,by2+bh-6.2,CO,7.5,'center',true); } }
  if(G.phase==='stars'){ uRR(cx-60,Hh/2-22,120,44,6,'rgba(20,16,30,0.94)','#ffd98a',1.2); txt(a.name+' done!',cx,Hh/2-16,'#fff',7.5,'center',true); for(let i=0;i<3;i++){ const on=i<G.lastStars&&G.pT>0.25+i*0.3; const pop=on?Math.min(1,(G.pT-0.25-i*0.3)/0.15):1; cubStar(cx-22+i*22,Hh/2+6,8*(on?0.6+0.4*pop:1),on?'#ffd98a':'#4a4460'); } }
  if(G.phase==='play'&&!G.talk&&!G.guide){ const h='◀ ▶ grab when the ring closes     '+keyName('a')+' say hi'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(cx-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,cx,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); }
}
function cubStar(x,y,r,col){ U.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r; U.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } U.closePath(); U.fillStyle=col; U.fill(); U.strokeStyle=CO; U.lineWidth=0.8; U.stroke(); }
function drawBubbleU(s,x,y,maxW){ const lines=wrap(s,(maxW||150)-12,6.5); U.font='6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const w=Math.max(...lines.map(l=>U.measureText(l).width))+10, h=lines.length*8+6;
  let bx=Math.round(x-w/2); bx=Math.max(3,Math.min(VW-w-3,bx)); const by=Math.round(y-h);
  U.fillStyle='#2e2838'; U.fillRect(bx-1,by-1,w+2,h+2); U.fillStyle='#fffaf0'; U.fillRect(bx,by,w,h); U.fillRect(Math.round(x)-2,by+h,4,3);
  U.fillStyle='#2e2838'; U.textAlign='left'; U.textBaseline='top'; lines.forEach((l,i)=>U.fillText(l,bx+5,by+3+i*8)); }
// ---- checkout: scan each thing as it rides over the red light
function cubCheckout(G){
  return new Promise(resolve=>{
    const ids=G.rec.mom.concat(G.rec.cam).slice(-10); while(ids.length<6) ids.push(['bread','milk','eggs'][ids.length%3]);
    const belt=ids.map((id,i)=>({id,x:-24-i*46-(i>5?i*4:0),done:0})); let t=0, bonus=0, beeps=0, fin=false, scanFlash=0; G.phase='idle'; G.mom.away=false; G.reqs=[]; G.items=[]; G.shoppers=[]; G.mom.say=null;
    const sx=()=>VW/2;
    S.mini={ full:true, tapA:false, taps(){ return [{x:0,y:0,w:VW,h:VH,k:'a'}]; }, G, belt,
      update(dt){ t+=dt; G.t+=dt; cubTick(G,dt); G.mom.look=Math.min(1,G.mom.look+dt*3); if(scanFlash>0) scanFlash-=dt;
        if(t<1.6){ hit('a'); hit('left'); hit('right'); return; }
        const sp=58+Math.min(40,(t-1.6)*4.2); for(const b of belt) b.x+=sp*dt;
        if(hit('a')||hit('left')||hit('right')){ let bst=null; for(const b of belt) if(!b.done&&Math.abs(b.x-sx())<16&&(!bst||Math.abs(b.x-sx())<Math.abs(bst.x-sx()))) bst=b;
          if(bst){ const perfect=Math.abs(bst.x-sx())<5.5; bst.done=perfect?2:1; G.chain++; G.bestChain=Math.max(G.bestChain,G.chain); const p=Math.round((perfect?60:30)*cubMult(G.chain)/5)*5; bonus+=p; G.score+=p; beeps++; scanFlash=0.15;
            blip(perfect?1568:1175,0.07,0.06,'square'); G.fx.push({txt:(perfect?'PERFECT ':'')+'+'+p,x:sx(),y:VH*0.72,col:perfect?'#fff':'#7bd95a',size:9,t:0}); if(perfect){ G.perfects++; for(let i=0;i<8;i++){ const a=Math.random()*6.28; G.parts.push({x:sx(),y:VH*0.8,vx:Math.cos(a)*50,vy:Math.sin(a)*50-30,t:0,life:0.5,col:'#ffd98a'}); } } buzz(12); }
          else { blip(200,0.06,0.04,'triangle'); } }
        if(!fin&&belt.every(b=>b.x>VW+20)){ fin=true; if(bonus) G.lines.push(['HELPED SCAN  x'+beeps,bonus,'B']); S.mini=null; resolve(bonus); } },
      draw(){ const W=VW,Hh=VH,cx=W/2; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
        let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#e4e8ee'); g.addColorStop(1,'#cfd4dc'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
        uRR(-4,10,W+8,20,0,'#d8232a',CO,1); txt('CHECKOUT  LANE 4',cx,16,'#fff',8,'center',true);
        for(let i=0;i<6;i++){ uRR(10+i*((W-20)/6),38,(W-20)/6-6,Hh*0.3,2,'#f3efe6','rgba(46,40,56,0.35)',0.7); for(let j=0;j<3;j++) for(let k=0;k<4;k++){ U.fillStyle=['#d99a84','#8fb8a0','#e2c878','#95a9d0','#cf9cc0'][(i*3+j*2+k)%5]; U.fillRect(14+i*((W-20)/6)+k*((W-20)/6-14)/4,42+j*(Hh*0.09),((W-20)/6-18)/4,Hh*0.07); } }
        const by=Math.round(Hh*0.80); cubGrace(G,cx,Math.round(Hh*0.5),by-4);
        uRR(-4,by-10,W+8,30,0,'#3a3840',CO,1); U.fillStyle='#4a4852'; for(let x=-((t*58)%14);x<W;x+=14){ U.fillRect(W-x-3,by-9,3,28); }
        uRR(-4,by-13,W+8,4,0,'#8a8a96',CO,0.8); uRR(-4,by+19,W+8,Hh,0,'#b8bcc6',CO,0.8);
        uRR(cx-17,by-11,34,30,2,'#1c2a30',CO,1); U.fillStyle=scanFlash>0?'#ff8a8a':'#e02a2a'; U.fillRect(cx-0.8,by-10,1.6,28); U.globalAlpha=0.25; U.fillRect(cx-5.5,by-10,11,28); U.globalAlpha=1;
        for(const b of belt){ if(b.x<-20||b.x>W+20) continue; const s=24; U.fillStyle='rgba(0,0,0,0.3)'; U.beginPath(); U.ellipse(b.x,by+13,9,2.2,0,0,7); U.fill(); U.drawImage(cubIcon(b.id),b.x-s/2,by-s/2+2,s,s); if(b.done){ cubStar(b.x+9,by-8,4,b.done===2?'#ffd98a':'#7bd95a'); } }
        uRR(W-70,34,64,30,4,'#22202a','#8a8794',1); txt('TOTAL',W-64,38,'#7bd95a',5.5,'left',true); txt(String(G.score),W-10,46,'#7bd95a',11,'right',true);
        for(const p of G.parts){ U.globalAlpha=1-p.t/p.life; U.fillStyle=p.col; U.fillRect(p.x-1.2,p.y-1.2,2.4,2.4); } U.globalAlpha=1;
        for(const f of G.fx){ U.globalAlpha=f.t>0.7?(1-f.t)/0.3:1; txt(f.txt,f.x,f.y-f.t*18,f.col,f.size,'center',true); U.globalAlpha=1; }
        if(G.mom.say) drawBubbleU(G.mom.say,cx,Hh*0.5-52,Math.min(170,W-24));
        if(t<1.6){ uRR(cx-84,Hh/2-20,168,40,6,'rgba(20,16,30,0.94)','#d8232a',1.2); txt('HELP SCAN!',cx,Hh/2-14,'#fff',11,'center',true); txt('Press '+keyName('a')+' when each thing is on the red light.',cx,Hh/2+4,'#a9a0b8',6,'center'); }
        else { uRR(cx-24,Hh-12,48,10,5,'rgba(28,24,40,0.85)',null); txt(keyName('a')+': beep!',cx,Hh-10,'#fff',6,'center',true); } }
    };
  });
}
// ---- receipt
function cubReceipt(G){
  return new Promise(resolve=>{
    const lines=G.lines.slice(); if(G.hiPts) lines.push(['SAID HI  x'+G.rec.hi,G.hiPts,'B']); if(G.sneakPts) lines.push(['SNEAKY BONUS',G.sneakPts,'B']);
    const total=G.score, cookie=total>=CUB.COOKIE; let t=0, shown=0; const isBest=best('cub',total); const stars=G.stars.reduce((a,b)=>a+b,0);
    if(stars>((META.best||{}).cubStars||0)){ META.best.cubStars=stars; saveMeta(); }
    const grade=total>=CUB.COOKIE*1.5?'A+':total>=CUB.COOKIE*1.2?'A':total>=CUB.COOKIE?'B':total>=CUB.COOKIE*0.6?'C':'D';
    S.mini={ full:true, tapA:true,
      update(dt){ t+=dt; const want=Math.min(lines.length,Math.floor(t/0.11)); if(want>shown){ shown=want; blip(1200,0.02,0.03,'square'); }
        if(hit('a')||hit('b')){ if(shown<lines.length){ t=lines.length*0.11+1; shown=lines.length; } else if(t>lines.length*0.11+0.8){ S.mini=null; resolve({total,cookie,stars,grade}); } } },
      draw(){ ctx.fillStyle='#3a3340'; ctx.fillRect(0,0,VW,VH); const w=Math.min(196,VW-14), x=Math.round(VW/2-w/2); const rowH=7.5, tail=66, bodyH=56+lines.length*rowH+tail; const fin=shown>=lines.length;
        const over=Math.max(0,bodyH-(VH-8)); const y0=4-(fin?over:Math.min(over,Math.max(0,(shown*rowH+70)-(VH-20))));
        U.fillStyle='#fbfaf4'; U.fillRect(x,y0,w,bodyH); U.fillStyle='#e8e4d8'; for(let i=0;i<w;i+=6){ U.beginPath(); U.moveTo(x+i,y0+bodyH); U.lineTo(x+i+3,y0+bodyH+3); U.lineTo(x+i+6,y0+bodyH); U.fill(); }
        U.fillStyle='#d8232a'; U.fillRect(x+w/2-22,y0+6,44,17); const T=(s,xx,yy,c,sz,al,b)=>{ U.font=`${b?'bold ':''}${sz}px "Courier New",monospace`; U.textAlign=al||'left'; U.textBaseline='top'; U.fillStyle=c; U.fillText(s,xx,yy); U.textAlign='left'; };
        T('Cub',x+w/2,y0+7,'#fff',14,'center',true); T('FOODS',x+w/2,y0+25,'#d8232a',6,'center',true);
        T('RICHFIELD, MN',x+w/2,y0+33,'#555',6,'center'); T('CASHIER: CAM\'S MOM   HELPER: CAM',x+w/2,y0+41,'#555',5.5,'center');
        T('- - - - - - - - - - - - - - - - - - - - -',x+w/2,y0+48,'#999',6,'center');
        let y=y0+56; for(let i=0;i<shown;i++){ const [n,p,k]=lines[i]; T((k==='M'?'M ':k==='C'?'C ':k==='B'?'+ ':'- ')+n,x+8,y,k==='J'?'#b3261e':'#222',6); T((p>0?'':'-')+Math.abs(p),x+w-8,y,k==='J'?'#b3261e':'#222',6,'right'); y+=rowH; }
        if(fin){ y=y0+56+lines.length*rowH; T('- - - - - - - - - - - - - - - - - - - - -',x+w/2,y,'#999',6,'center'); T('TOTAL',x+8,y+8,'#000',9,'left',true); T(String(total),x+w-8,y+8,'#000',9,'right',true);
          T('BEST CHAIN '+G.bestChain+'    PERFECT x'+G.perfects+'    CAUGHT x'+G.rec.caught,x+w/2,y+20,'#555',5.5,'center');
          for(let i=0;i<15;i++) cubStar(x+14+i*8.4,y+34,3.3,i<stars?'#e8a81e':'#d8d4c8'); T('GRADE',x+w-36,y+31,'#777',5.5,'right',true); T(grade,x+w-8,y+27,'#d8232a',13,'right',true);
          T(cookie?'*** FREE COOKIE FOR THE HELPER ***':'COOKIE CLUB: '+CUB.COOKIE+' PTS',x+w/2,y+42,cookie?'#d8232a':'#777',6,'center',true);
          T((isBest?'NEW BEST!  ':'BEST: '+(META.best.cub||total)+'  ')+'M=MOM  C=CAM',x+w/2,y+50,'#777',5.5,'center');
          if(Math.floor(S.t*2)%2) txt(keyName('a')+': continue',VW/2,VH-9,'#ffd98a',6.5,'center',true); } }
    };
  });
}
// ---- the outing
async function cubOuting(){
  await say('Mom','Cub Foods it is. I need a few things.');
  let level=0;
  if(META.cubDone){ const c=await choose('How fast should Mom push the cart?',['Easy','Fast','Weeeeee!'],'Mom'); level=c; }
  await leaveHome(false); await fadeTo(1,600); setDown(); return cubCore(level); }
async function cubCore(level){ S.fadeText='Cub Foods'; S.fadeSub='Mom lifts Cam into the cart seat.'; await wait(1900); S.fadeText=null; S.fadeSub=null;
  let res, first=true;
  while(true){
    const pr=cubGame(level); if(first){ await fadeTo(0,500); first=false; }
    const G=await pr;
    await cubCheckout(G);
    res=await cubReceipt(G); res.level=level;
    if(!META.cubDone){ META.cubDone=true; saveMeta(); }
    await showBoard('cub','CUB FOODS',res.total,CUB.levels[level].name);
    // bakery / cookie
    const G1=cubNew(); S.mini={full:true,dlgTop:true,update(dt){ G1.t+=dt; cubTick(G1,dt); },draw(){ cubDraw(G1); }};
    if(res.cookie){
      G1.mom.mood='laugh'; G1.mom.moodT=3;
      await say('Mom','You were such a good helper today. Let\'s stop at the bakery.');
      await say('','The lady at the bakery counter leans over with a free cookie.');
      G1.camSay='Cookie!!!'; G1.camSayT=1.4; jingle([523,659,784,1047],0.1,'triangle',0.06); await wait(1400);
      award('helper'); await wait(1200);
      await say('Mom','What do you say?'); G1.camSay='Tank you!'; G1.camSayT=1.3; await wait(1300);
    } else {
      await say('Mom', res.total>=CUB.COOKIE*0.6?'Not bad, bud. Almost a cookie day.':'Well. We got out of there. Mostly.');
    }
    const again=await choose('Grade '+res.grade+'.  '+res.stars+' of 15 stars.',['Head home','Shop again: Easy','Shop again: Fast','Shop again: Weeeeee!'],'');
    if(!again) break; level=again-1;
  }
  await fadeTo(1,700); S.mini=null;
  return res;
}
