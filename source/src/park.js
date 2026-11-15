'use strict';
// ================= Heredia Park =================
const PARK={ routes:{
  big:{name:'the big slide',ach:'slide1',segs:[['stairs',8],['bridge',5],['stairs',4]]},
  curly:{name:'the curly slide',ach:'slide2',segs:[['stairs',6],['tunnel',5],['stairs',6]]} } };
ITEMS.stick={name:'A Really Good Stick',desc:'Found in the wood chips at Heredia Park. Mom says it stays outside. We\'ll see.',icon:null};
function pgCam(x,y,pose,t,o){   // a little side-on Cam, feet at (x,y)
  o=o||{}; const of=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1], shirt=of[2], pants=of[3], sleeve=of[4]||of[2], SK='#f6d0b4', HAIR='#e6c878';
  U.save(); U.translate(x,y); if(o.rot) U.rotate(o.rot); const sq=o.squash||0; U.scale(1+sq*0.25,1-sq*0.25);
  if(pose==='duck'){ const w=Math.sin(t*14)*2; uLimb([[-6,-5],[-9+w,0]],3.4,pants); uLimb([[-1,-5],[-3-w,0]],3.4,pants); uRR(-9,-10,13,7,3.2,shirt,CO,0.9); uLimb([[3,-6],[6-w,0]],3,sleeve); uCirc(9,-9,6.2,SK,CO,0.9); camHair(9,(-10)+1,(6.4)-0.3); U.fillStyle=CO; U.fillRect(11.5,-9.5,1.3,1.8); }
  else if(pose==='sit'){ uLimb([[-1,-3],[6,-1]],3.6,pants); uRR(-5,-12,9,10,3.2,shirt,CO,0.9); uLimb([[-1,-9],[4,-5]],3,sleeve); uCirc(0,-17,6.4,SK,CO,0.9); camHair(0,(-18)+1,(6.6)-0.3); U.fillStyle=CO; U.fillRect(1.6,-18,1.2,0.8); U.fillRect(4,-18,1.2,0.8);
    for(let i=0;i<3;i++){ const a=t*5+i*2.1; cubStar(Math.cos(a)*9,-27+Math.sin(a)*3,2.2,'#ffd98a'); } }
  else if(pose==='slide'){ uLimb([[0,-4],[9,-3]],3.6,pants); uRR(-5,-13,9,10,3.2,shirt,CO,0.9); const up=o.arms?-9:-2; uLimb([[-1,-10],[5,-12+up*0.6],[7,-13+up]],3,sleeve); uCirc(0,-18,6.4,SK,CO,0.9); camHair(-0.6,(-19)+1,(6.6)-0.3); U.fillStyle=CO; U.fillRect(3,-19,1.3,1.8); U.beginPath(); U.arc(3.4,-15.4,1.6,0,3.14); U.fillStyle='#7a2a2a'; U.fill(); }
  else { const air=pose==='jump', w=air?0:Math.sin(t*15)*3.4; uLimb([[-1,-6],[-1-w,air?-2:0]],3.6,pants); uLimb([[1,-6],[1+w,air?-3:0]],3.6,pants); uRR(-4.5,-14,9,9.5,3.2,shirt,CO,0.9);
    if(air){ uLimb([[0,-12],[5,-17]],3,sleeve); uLimb([[0,-12],[-5,-17]],3,sleeve); } else uLimb([[0,-12],[w*0.9,-7]],3,sleeve);
    uCirc(0.5,-19.5,6.6,SK,CO,0.9); camHair(0,(-20.5)+1,(6.8)-0.3); U.fillStyle=CO; U.fillRect(3.4,-20.5,1.3,1.9); U.strokeStyle='#8a3a3a'; U.lineWidth=0.8; U.beginPath(); U.arc(3.6,-17,1.6,0.2,2.6); U.stroke(); }
  U.restore();
}
function pgGrace(x0,y0,t,cheer,face){ const SK='#f2caa8', HAIR='#6a4630', TOP='#34313f'; const w=Math.sin(t*9)*3, x=0, y=0;
  U.save(); U.translate(x0,y0); U.scale(face<0?-1:1,1);
  uLimb([[x-2,y-18],[x-2-w,y]],4.4,'#5a78b0'); uLimb([[x+2,y-18],[x+2+w,y]],4.4,'#4a6496'); uRR(x-6,y-36,12,19,4,TOP,CO,0.9);
  if(cheer){ uLimb([[x,y-33],[x+7,y-44]],3.4,TOP); uLimb([[x,y-33],[x-7,y-44]],3.4,TOP); } else uLimb([[x,y-33],[x+w,y-22]],3.4,TOP);
  U.beginPath(); U.moveTo(x-8,y-46); U.quadraticCurveTo(x-10.5,y-36,x-8.5,y-27.5); U.lineTo(x-6.6,y-29.5); U.lineTo(x-5,y-26.5); U.lineTo(x-3.2,y-29); U.lineTo(x-1.6,y-27); U.lineTo(x-1,y-46); U.closePath(); U.fillStyle=HAIR; U.fill(); U.strokeStyle=hexShade(HAIR,-0.3); U.lineWidth=0.5; U.stroke();
  uStrands(x-5,y-44,y-29,6,HAIR,3);
  uCirc(x+0.5,y-43,7,SK,CO,0.9); uHair(x,y-44,7.2,2.6,6.0,HAIR); U.fillStyle=CO; U.fillRect(x+3.6,y-44,1.3,1.9); U.strokeStyle='#8a3a3a'; U.lineWidth=0.9; U.beginPath(); U.arc(x+3.4,y-40,2,0.2,2.6); U.stroke(); U.restore(); }
function pgSky(G,par){ const W=VW,Hh=VH; let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#7ec4f2'); g.addColorStop(1,'#d8f0fb'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
  U.fillStyle='rgba(255,255,255,0.9)'; for(let i=0;i<4;i++){ const cx=((i*150-par*0.05)%(W+140)+W+140)%(W+140)-70, cy=14+(i*31)%40; U.beginPath(); U.ellipse(cx,cy,22,7,0,0,7); U.ellipse(cx+12,cy-5,13,7,0,0,7); U.fill(); } }
// ---------- the playground: a free-roam climbing frame. Walk, hop, climb, crawl, swing. Find the slides. ----------
const PG={T:12,W:62,H:24,pf:[],cl:[],stars:[],zones:[]};
(function pgBuild(){ const {W,H}=PG; for(let y=0;y<H;y++){ PG.pf.push(new Array(W).fill(' ')); PG.cl.push(new Array(W).fill(' ')); }
  const plat=(x0,x1,y,c)=>{ for(let x=x0;x<=x1;x++) PG.pf[y][x]=c||'='; };
  const climb=(x,y0,y1,c)=>{ for(let y=y0;y<=y1;y++) PG.cl[y][x]=c; };
  const star=(x,y)=>PG.stars.push({x:x*12+6,y:y*12+6});
  plat(0,W-1,22,'G'); plat(0,W-1,23,'G');
  plat(6,7,21,'s'); plat(8,9,20,'s'); plat(10,11,19,'s');
  plat(12,19,18); plat(20,24,18); plat(20,24,17,'T'); plat(25,30,18);          // deck A, tunnel, deck B
  climb(13,14,17,'N'); climb(14,14,17,'N'); plat(10,16,14);                     // net up to deck C
  for(let x=17;x<=24;x++) PG.cl[11][x]='M';                                     // monkey bars
  plat(25,30,14); climb(27,10,13,'H'); plat(26,31,10);                          // deck D, ladder, deck E (curly tower)
  climb(30,14,21,'P'); climb(28,18,21,'H');                                     // fire pole, ladder from the ground
  plat(31,38,18,'b');                                                           // wobbly bridge
  plat(39,44,18); climb(41,14,17,'H'); plat(39,44,14); climb(43,10,13,'H'); plat(39,47,10);   // big tower
  climb(47,10,21,'W');                                                          // climbing wall
  PG.pf[21][38]='B';                                                            // bouncy pad
  PG.zones.push({id:'curly',x:31,y:9},{id:'big',x:46,y:9},{id:'exit',x:1,y:21});
  for(const [x,y] of [[6.5,19.6],[8.5,18.6],[10.5,17.6],[14,16.6],[17,16.6],[21,16.9],[22.5,16.9],[23.9,16.9],[22,15.2],[27,16.6],[13.5,15],[13.5,13],[11,12.6],[15,12.6],
    [18,12.6],[20,12.6],[22,12.6],[24,12.6],[26,12.6],[29,12.6],[27,11],[27,9],[29,8.6],[30,19.5],[30,16.5],[28,20],[33,16.4],[35,16.9],[37,16.4],[38,19.2],[38,15],[38,13],
    [40,16.6],[41,15],[41,13],[43,11.5],[43,9],[41,8.6],[45,8.6],[47,19],[47,16],[47,13],[16,20.6],[18,20.6],[51,20.6],[54,20.6],[3,18.5]]) star(x,y);
})();
const PGS={got:new Set(),x:40,y:264,slides:{big:0,curly:0},t:0};   // one visit to the playground
function pgCaption(who,s){ if(!s) return; const W=VW,Hh=VH; U.font='6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=Math.min(W-10,U.measureText(who+':  '+s).width+16); uRR(W/2-tw/2,Hh-15,tw,12,6,'rgba(24,20,34,0.9)','#ffd98a',0.8); const x0=W/2-tw/2+8; txt(who+':',x0,Hh-12,'#ffd98a',6.5,'left',true); U.font='bold 6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const nw=U.measureText(who+': ').width; txt(s,x0+nw+2,Hh-12,'#fff',6.5); }
function playgroundGame(){
  return new Promise(resolve=>{
    const T=PG.T, LW=PG.W*T, LH=PG.H*T, GY=22*T;
    const pf=(tx,ty)=>(tx<0||tx>=PG.W||ty<0||ty>=PG.H)?' ':PG.pf[ty][tx], cl=(tx,ty)=>(tx<0||tx>=PG.W||ty<0||ty>=PG.H)?' ':PG.cl[ty][tx];
    const tx=x=>Math.floor(x/T), isOne=c=>c==='='||c==='b'||c==='s'||c==='T'||c==='B', isCl=c=>c==='H'||c==='N'||c==='W'||c==='P';
    const WALK=64, JH=31, TA=0.3, GR=2*JH/(TA*TA), JV=2*JH/TA;
    const G={t:0,x:PGS.x,y:PGS.y,vx:0,vy:0,face:1,st:'walk',gnd:true,coy:0,buf:0,drop:0,hangCD:0,sq:0,sit:0,fallTop:PGS.y,cx:0,cy:0,cap:null,capT:0,capWho:'Mom',seen:{},idle:0,parts:[],fx:[],gx:PGS.x-30,done:false,zone:null,steps:0};
    G.cx=Math.max(0,Math.min(LW-VW,G.x-VW/2)); G.cy=Math.max(0,Math.min(LH-VH,G.y-VH*0.62));
    const cap=(s,who,d)=>{ G.cap=s; G.capWho=who||'Mom'; G.capT=d||3; };
    const once=(k,s,who)=>{ if(G.seen[k]||PGS['said_'+k]) return; PGS['said_'+k]=G.seen[k]=1; cap(s,who); };
    if(!PGS.t) cap('Go play, bud! I\'m right here.');
    const burst=(x,y,col,n)=>{ for(let i=0;i<(n||7);i++){ const a=Math.random()*6.28,v=20+Math.random()*45; G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-25,t:0,life:0.5,col}); } };
    const finish=(go)=>{ if(G.done) return; G.done=true; PGS.x=G.x; PGS.y=G.y; resolve({go}); };
    S.mini={ full:true, G, pg:true,
      taps(){ if(!G.ask) return []; const W=VW,Hh=VH, bw=Math.min(190,W-14), x=W/2-bw/2, y=Hh/2-34; return [0,1].map(i=>({x:x+8+i*(bw/2-4),y:y+34,w:bw/2-12,h:26,fn(){ G.ask.sel=i; G.ask.t=-9; pressed.a=true; }})); },
      update(dt){ G.t+=dt;
        if(G.ask){ if(hit('left')||hit('up')){ G.ask.sel=0; blip(400,0.03,0.03,'triangle'); } if(hit('right')||hit('down')){ G.ask.sel=1; blip(400,0.03,0.03,'triangle'); } const a_=hit('a'); hit('b'); if(a_&&G.t-G.ask.t>0.5){ const sel=G.ask.sel; G.ask=null; if(sel===0) finish('exit'); } return; }
        if(!PGS.said_ask&&G.gnd&&PGS.slides.big&&PGS.slides.curly&&PGS.got.size===PG.stars.length){ PGS.said_ask=1; G.ask={sel:0,t:G.t}; G.vx=0; jingle([523,659,784,1047,1319],0.08,'triangle',0.06); return; }
        if(PGS.said_ask&&K.b&&G.gnd){ G.bHold=(G.bHold||0)+dt; if(G.bHold>0.6) finish('exit'); } else G.bHold=0;
        PGS.t+=dt; G.idle+=dt; if(G.capT>0){ G.capT-=dt; if(G.capT<=0) G.cap=null; } if(G.sq) G.sq*=Math.max(0,1-dt*9);
        for(const p of G.parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=170*dt; } G.parts=G.parts.filter(p=>p.t<p.life); for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<0.9);
        if(G.done) return;
        const ax=(K.right?1:0)-(K.left?1:0), ay=(K.down?1:0)-(K.up?1:0); if(ax) G.face=ax;
        if(G.hangCD>0) G.hangCD-=dt; if(G.drop>0) G.drop-=dt;
        // slide doors and the way out
        G.zone=null; for(const z of PG.zones) if(Math.abs(z.x*T+6-G.x)<9&&Math.abs((z.y+1)*T-G.y)<8&&G.gnd) G.zone=z;
        const jp=hit('a'); hit('b'); hit('up'); hit('down'); hit('left'); hit('right');
        if(G.zone&&jp){ blip(660,0.08,0.05,'triangle'); finish(G.zone.id); return; }
        if(G.sit>0){ G.sit-=dt; return; }
        if(jp) G.buf=0.14; else if(G.buf>0) G.buf-=dt;
        const bodyC=cl(tx(G.x),Math.floor((G.y-8)/T)), below=cl(tx(G.x),Math.floor((G.y+2)/T));
        if(G.st==='walk'&&((K.up&&isCl(bodyC))||(K.down&&(isCl(below)||(isCl(bodyC)&&!G.gnd))))){ G.st='climb'; G.vx=G.vy=0; G.ct=isCl(bodyC)?bodyC:below; if(!isCl(bodyC)) G.y+=2; blip(300,0.04,0.03,'triangle'); }
        if(G.st==='climb'){
          const col=tx(G.x), cxm=col*T+6; G.x+=(cxm-G.x)*Math.min(1,dt*12); const pole=G.ct==='P';
          let ny=G.y+ay*(pole?(ay>0?125:22):46)*dt;
          if(ay<0||ny<G.y){ if(!isCl(cl(col,Math.floor((ny-0.01)/T)))) ny=Math.ceil((ny-0.01)/T)*T; }
          else if(ny>G.y){ if(ny>=GY){ ny=GY; G.st='walk'; G.gnd=true; G.sq=0.5; } else if(!isCl(cl(col,Math.floor((ny+0.01)/T)))){ G.st='walk'; G.gnd=false; G.vy=0; ny=Math.floor((ny+0.01)/T)*T; } }
          if(Math.abs(ny-G.y)>0.01) G.steps+=Math.abs(ny-G.y); G.y=ny; G.fallTop=G.y;
          if(pole&&ay>0) once('pole','Wheee! Down the fire pole!');
          if(G.buf>0){ G.buf=0; G.st='walk'; G.vy=-JV*0.75; G.vx=ax*WALK; G.gnd=false; blip(520,0.06,0.04,'triangle'); }
          else if(ax&&!ay&&G.st==='climb'){ const top=!isCl(cl(col,Math.floor((G.y-0.5)/T))); const onPlat=isOne(pf(col,Math.round(G.y/T)))&&Math.abs(G.y-Math.round(G.y/T)*T)<1.5; if(top||onPlat||G.y>=GY-1){ G.st='walk'; G.gnd=true; G.y=Math.round(G.y/T)*T; G.vy=0; } else { G.st='walk'; G.gnd=false; G.vy=0; G.vx=ax*WALK*0.8; } }
        }
        else if(G.st==='hang'){
          G.x+=ax*44*dt; G.steps+=Math.abs(ax)*44*dt; G.vy=0; G.fallTop=G.y;
          const row=Math.floor((G.y-17)/T); if(cl(tx(G.x),row)!=='M'||K.down||G.buf>0){ G.st='walk'; G.hangCD=0.35; G.gnd=false; G.buf=0; G.coy=0; G.vx=ax*WALK*0.7; }
        }
        else {
          const crawl=G.gnd&&pf(tx(G.x),Math.floor((G.y-6)/T))==='T'; G.crawl=crawl; if(crawl) once('tunnel','Through the tunnel! I see you!');
          const sp=crawl?40:WALK, tv=ax*sp; G.vx+=Math.max(-700*dt,Math.min(700*dt,tv-G.vx));
          if(G.gnd) G.coy=0.1; else if(G.coy>0) G.coy-=dt;
          if(G.buf>0&&G.coy>0&&!crawl){ G.vy=-JV; G.gnd=false; G.coy=0; G.buf=0; G.sq=-0.5; blip(520,0.06,0.04,'triangle'); }
          if(!G.gnd){ if(G.vy<0&&!K.a&&G.vy<-JV*0.45) G.vy=-JV*0.45; G.vy+=GR*(G.vy>0?1.45:1)*dt; if(G.vy>330) G.vy=330; }
          if(G.gnd&&K.down&&!G.downLatch&&!isCl(below)&&G.y<GY-1){ const r0=Math.round(G.y/T), here=pf(tx(G.x),r0); if(isOne(here)&&here!=='B'){ G.dropRow=r0; G.drop=0.5; G.gnd=false; G.vy=0; G.fallTop=G.y; } } G.downLatch=K.down;
          G.x+=G.vx*dt; if(G.x<6){ G.x=6; G.vx=0; } if(G.x>LW-6){ G.x=LW-6; G.vx=0; } if(G.gnd) G.steps+=Math.abs(G.vx)*dt;
          const py=G.y; if(G.gnd){ // still standing on something?
            const r=Math.round(G.y/T); const sup=G.y>=GY-0.5||isOne(pf(tx(G.x-3),r))||isOne(pf(tx(G.x+3),r)); if(!sup){ G.gnd=false; G.vy=0; G.fallTop=G.y; } }
          if(!G.gnd){ G.y+=G.vy*dt; if(G.vy<0) G.fallTop=Math.min(G.fallTop,G.y);
            if(G.vy>=0){ let land=null; if(G.y>=GY){ land=GY; } else { for(let r=Math.ceil(py/T-0.001);r<=Math.floor(G.y/T);r++){ const top=r*T; if(G.drop>0&&r===G.dropRow) continue; if(py<=top+0.01&&G.y>=top&&(isOne(pf(tx(G.x-3),r))||isOne(pf(tx(G.x+3),r)))){ land=top; break; } } }
              if(land!==null){ const fell=land-G.fallTop; G.y=land; const padB=pf(tx(G.x),Math.round(land/T))==='B';
                if(padB){ G.vy=-JV*1.72; G.sq=-0.8; G.fallTop=G.y; blip(300,0.12,0.06,'square'); setTimeout(()=>blip(600,0.1,0.05,'square'),60); burst(G.x,G.y,'#ff9a9a',6); once('bounce','Boing! So high!'); }
                else { G.gnd=true; G.drop=0; G.vy=0; G.sq=Math.min(0.9,0.35+fell/160); blip(170,0.03,0.035,'triangle'); if(fell>58){ G.sit=0.7; G.vx=0; cap(['Boom! You\'re okay!','Whoa! Shake it off, bud.','Oopsie daisy!'][Math.floor(Math.random()*3)]); blip(110,0.14,0.06,'sawtooth'); buzz(35); burst(G.x,G.y,'#d6b88c',8); } G.fallTop=G.y; } } }
            if(!G.gnd&&G.hangCD<=0&&!K.down&&G.vy<120){ const row=Math.floor((G.y-17)/T); if(cl(tx(G.x),row)==='M'&&Math.abs((G.y-17)-(row*T+6))<7){ G.st='hang'; G.y=row*T+6+17; G.vy=0; blip(420,0.05,0.04,'triangle'); once('bars','Monkey bars! Hold on tight!'); } } }
        }
        if(G.y<=10*T+1&&G.gnd) once('high','Look how high you are!');
        for(let i=0;i<PG.stars.length;i++){ if(PGS.got.has(i)) continue; const s=PG.stars[i]; if(Math.abs(s.x-G.x)<10&&Math.abs(s.y-(G.y-(G.st==='hang'?6:8)))<11){ PGS.got.add(i); G.idle=0; blip(880+(PGS.got.size%8)*50,0.05,0.04,'triangle'); burst(s.x,s.y,'#ffd98a'); if(PGS.got.size===PG.stars.length) cap('Every single star! Wow, Cam!'); } }
        if(G.idle>28){ G.idle=0; cap(PGS.slides.big&&PGS.slides.curly?'Come see me by the gate when you\'re all done.':!PGS.slides.big?'The big slide is way up top, on the right.':'The curly slide is up the middle tower.'); }
        G.gx+=Math.max(-40*dt,Math.min(40*dt,(G.x-28*G.face)-G.gx)); G.gmove=Math.abs((G.x-28*G.face)-G.gx)>2; if(G.gmove) G.gdir=((G.x-28*G.face)-G.gx)>0?1:-1;
        const tcx=G.x+G.face*22-VW/2, tcy=G.y-VH*0.62; G.cx+=(Math.max(0,Math.min(LW-VW,tcx))-G.cx)*Math.min(1,dt*4.5); G.cy+=(Math.max(0,Math.min(LH-VH,tcy))-G.cy)*Math.min(1,dt*5);
      },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh); pgSky(G,G.cx*2);
        { const yy=GY-G.cy+2; for(let i=0;i<14;i++){ const t_=PG_TREES[(i*5+3)%PG_TREES.length]; pgTree(i*74-G.cx*0.28-10,yy,t_[0],t_[1]*0.72,i*7+2,0.55); }
          for(let i=0;i<11;i++){ const t_=PG_TREES[i%PG_TREES.length]; pgTree(i*96-G.cx*0.45+24+((i*37)%23),yy,t_[0],t_[1],i+1,0.9); } }
        U.save(); U.translate(-Math.round(G.cx*4)/4,-Math.round(G.cy*4)/4);
        const x0=Math.max(0,Math.floor(G.cx/T)-1), x1=Math.min(PG.W-1,Math.ceil((G.cx+W)/T)+1);
        U.fillStyle='#d6b88c'; U.fillRect(G.cx-4,GY,W+8,LH-GY+40); U.fillStyle='#c4a476'; for(let x=x0*T;x<=x1*T;x+=9) U.fillRect(x+((x*7)%5),GY+3+((x*13)%9),4,1.5); U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(G.cx-4,GY); U.lineTo(G.cx+W+4,GY); U.stroke();
        // the two slides, as scenery
        for(const [lw,c] of [[13,CO],[10.5,'#22969a'],[3,'#5ac4be']]){ U.strokeStyle=c; U.lineWidth=lw; U.lineCap='round'; U.beginPath(); for(let i=0;i<=40;i++){ const f=i/40, sx=48*T+f*130, sy=10*T+3+f*f*(GY-10*T-8)*0.55+f*(GY-10*T-8)*0.45-Math.sin(f*Math.PI*3)*7*(1-f)+(lw===3?-3:0); i?U.lineTo(sx,sy):U.moveTo(sx,sy); } U.stroke(); } U.lineCap='butt';
        { const cx=34*T+2, R=19, yT=10*T+4, yB=GY-15, th0=-Math.PI/2, th1=Math.PI*6, N=150, pt=k=>{ const th=th0+(th1-th0)*k; return [cx+R*Math.sin(th),yT+(yB-yT)*k+5*Math.cos(th),Math.cos(th)]; };
          const run=(front)=>{ let on=false; const seg=(lw,col)=>{ U.lineWidth=lw; U.strokeStyle=col; U.lineCap='round'; U.lineJoin='round'; U.beginPath(); on=false; for(let i=0;i<=N;i++){ const [px,py,d]=pt(i/N); if((d>=-0.06)===front||Math.abs(d)<0.06){ on?U.lineTo(px,py):U.moveTo(px,py); on=true; } else on=false; } U.stroke(); };
            seg(12.5,CO); seg(10.5,front?'#3caa5a':'#27753f'); if(front){ U.save(); U.translate(0,-3.2); seg(1.6,'#8fe0a0'); U.restore(); U.save(); U.translate(0,3.6); seg(1.4,'#2a8a48'); U.restore(); } };
          run(false);
          uRR(cx-3,10*T-10,6,GY-10*T+10,2,'#3c4048',CO,0.8); uRR(cx-7,GY-4,14,4,1.5,'#3c4048',CO,0.8); uCirc(cx,10*T-10,4,'#3c4048',CO,0.8);
          run(true);
          // covered entry from the deck, and the run-out onto the wood chips
          uRR(32*T-2,yT-9,cx-R-(32*T-2)+3,13,[5,5,2,2],'#3caa5a',CO,1); U.fillStyle='rgba(255,255,255,0.3)'; U.fillRect(32*T,yT-7,cx-R-32*T,2);
          const [ex,ey]=pt(1); for(const [lw,c] of [[12.5,CO],[10.5,'#3caa5a']]){ U.lineWidth=lw; U.strokeStyle=c; U.lineCap='round'; U.beginPath(); U.moveTo(ex,ey); U.quadraticCurveTo(ex+20,ey+6,ex+34,GY-6); U.lineTo(ex+48,GY-6); U.stroke(); }
          U.lineWidth=1.6; U.strokeStyle='#8fe0a0'; U.beginPath(); U.moveTo(ex,ey-3.2); U.quadraticCurveTo(ex+20,ey+2.8,ex+34,GY-9.2); U.lineTo(ex+47,GY-9.2); U.stroke(); U.lineCap='butt'; }
        // roofs
        for(const [a,b,c] of [[26,31,'#3caa5a'],[39,47,'#22969a']]){ uPoly([[a*T-6,6.4*T],[(a+b+1)/2*T,4.2*T],[(b+1)*T+6,6.4*T]],c,CO,1); uRR(a*T+1,6.4*T,3,3.6*T,1,'#3c4048',CO,0.7); uRR((b+1)*T-4,6.4*T,3,3.6*T,1,'#3c4048',CO,0.7); }
        // posts under every deck end
        for(let y=0;y<22;y++) for(let x=x0;x<=x1;x++){ const c=PG.pf[y][x]; if(c!=='='&&c!=='s') continue; const L=PG.pf[y][x-1], R=PG.pf[y][x+1]; if((L!=='='&&L!=='s'&&L!=='b')||(R!=='='&&R!=='s'&&R!=='b')||x%6===0) uRR(x*T+4,y*T+4,4,GY-y*T-4,1,'#3c4048',CO,0.7); }
        // railings: thin bars behind the decks, so they read as a rail
        U.lineWidth=0.8; for(let y=0;y<22;y++) for(let x=x0;x<=x1;x++){ if(PG.pf[y][x]!=='=') continue; if(PG.cl[y][x]!==' '||PG.cl[y-1][x]!==' '||PG.pf[y-1][x]==='T') continue; if(PG.zones.some(z=>z.x===x&&z.y===y-1)) continue; U.strokeStyle='#c99a2a'; U.beginPath(); U.moveTo(x*T,y*T-13); U.lineTo(x*T+T,y*T-13); for(let k=2;k<T;k+=4){ U.moveTo(x*T+k,y*T-13); U.lineTo(x*T+k,y*T); } U.stroke(); }
        // things to climb
        for(let y=0;y<22;y++) for(let x=x0;x<=x1;x++){ const c=PG.cl[y][x]; if(c===' ') continue; const X=x*T, Y=y*T;
          if(c==='H'){ U.strokeStyle='#8a6a44'; U.lineWidth=2; U.beginPath(); U.moveTo(X+1.5,Y); U.lineTo(X+1.5,Y+T); U.moveTo(X+T-1.5,Y); U.lineTo(X+T-1.5,Y+T); U.stroke(); U.lineWidth=1.6; U.strokeStyle='#b08a5a'; U.beginPath(); U.moveTo(X+1.5,Y+3); U.lineTo(X+T-1.5,Y+3); U.moveTo(X+1.5,Y+9); U.lineTo(X+T-1.5,Y+9); U.stroke(); }
          else if(c==='N'){ U.strokeStyle='#d8c9a0'; U.lineWidth=1.1; U.beginPath(); U.moveTo(X,Y); U.lineTo(X+T,Y+T); U.moveTo(X+T,Y); U.lineTo(X,Y+T); U.moveTo(X,Y); U.lineTo(X+T,Y); U.stroke(); }
          else if(c==='W'){ uRR(X,Y,T,T+0.5,0,'#b9906a',null); U.strokeStyle='rgba(46,40,56,0.5)'; U.lineWidth=0.6; U.strokeRect(X,Y,T,T); uCirc(X+3+((y*5)%6),Y+4+((y*3)%5),1.8,['#e0564e','#f2c230','#4a90d8','#57c06e'][y%4],CO,0.6); }
          else if(c==='P'){ uRR(X+4,Y,4,T+0.5,0,'#e0564e',null); U.fillStyle='rgba(255,255,255,0.35)'; U.fillRect(X+5,Y,1,T); if(PG.cl[y-1][x]!=='P'){ uCirc(X+6,Y,3,'#e0564e',CO,0.8); } }
          else if(c==='M'){ uRR(X,Y+4.5,T+0.5,3,0,'#e0564e',null); U.strokeStyle=CO; U.lineWidth=0.7; U.beginPath(); U.moveTo(X,Y+4.5); U.lineTo(X+T,Y+4.5); U.moveTo(X,Y+7.5); U.lineTo(X+T,Y+7.5); U.stroke(); uRR(X+4.5,Y+3.5,3,5,1,'#f2c230',CO,0.6); if(PG.cl[y][x-1]!=='M') uRR(X-2,Y+3,3,3*T+3,1,'#3c4048',CO,0.7); if(PG.cl[y][x+1]!=='M') uRR(X+T-1,Y+3,3,3*T+3,1,'#3c4048',CO,0.7); } }
        // decks, steps, bridge, tunnel (back)
        for(let y=0;y<22;y++) for(let x=x0;x<=x1;x++){ const c=PG.pf[y][x], X=x*T, Y=y*T; if(c===' ') continue;
          if(c==='='||c==='s'){ uRR(X,Y,T+0.5,5,0,'#2aa6a0',null); U.fillStyle='rgba(255,255,255,0.3)'; U.fillRect(X,Y+1,T+0.5,1.2); U.strokeStyle=CO; U.lineWidth=0.9; U.beginPath(); U.moveTo(X,Y); U.lineTo(X+T+0.5,Y); U.moveTo(X,Y+5); U.lineTo(X+T+0.5,Y+5); if(!isOne(PG.pf[y][x-1])){ U.moveTo(X,Y); U.lineTo(X,Y+5); } if(!isOne(PG.pf[y][x+1])){ U.moveTo(X+T,Y); U.lineTo(X+T,Y+5); } U.stroke(); }
          else if(c==='b'){ const wob=Math.sin(G.t*3+x)*0.6*(Math.abs(G.x-X)<40?1:0.2); uRR(X+0.5,Y+wob,T-1,4,1,'#b08a5a',CO,0.8); U.strokeStyle='#8a6a44'; U.lineWidth=1; U.beginPath(); U.moveTo(X,Y-12+Math.sin((x-31)/8*Math.PI)*3); U.lineTo(X+T,Y-12+Math.sin((x-30)/8*Math.PI)*3); U.moveTo(X+6,Y-12+Math.sin((x-30.5)/8*Math.PI)*3); U.lineTo(X+6,Y+wob); U.stroke(); }
          else if(c==='T'){ uRR(X,Y-2,T+0.5,T+2,0,'#1d5a34',null); }
          else if(c==='B'){ U.strokeStyle='#8a8f9a'; U.lineWidth=1.4; U.beginPath(); for(let k=0;k<4;k++){ U.moveTo(X+2,Y+3+k*2.4); U.lineTo(X+T-2,Y+4.2+k*2.4); } U.stroke(); const b=G.sq<-0.3&&Math.abs(G.x-X-6)<10?2:0; uRR(X-2,Y-1+b,T+4,4.5,2.2,'#e0564e',CO,0.9); U.fillStyle='rgba(255,255,255,0.4)'; U.fillRect(X,Y+b,T,1); } }
        // slide doors and the gate
        for(const z of PG.zones){ const X=z.x*T, Y=(z.y+1)*T; if(z.id==='exit'){ uRR(X+3,Y-22,2.5,22,1,'#8a6a44',CO,0.7); uRR(X-6,Y-27,22,10,2,'#f4ead8',CO,0.9); txt('MOM',X+5,Y-25,CO,5.5,'center',true); }
          else { const col=z.id==='big'?'#22969a':'#3caa5a'; uRR(X-1,Y-21,T+2,21,[7,7,0,0],'rgba(20,16,30,0.55)',CO,0.9); U.strokeStyle=col; U.lineWidth=2.4; U.beginPath(); U.arc(X+6,Y-14,7.5,Math.PI,0); U.lineTo(X+13.5,Y); U.moveTo(X-1.5,Y-14); U.lineTo(X-1.5,Y); U.stroke(); cubStar(X+6,Y-27+Math.sin(G.t*4)*1.5,3,PGS.slides[z.id]?'#7bd95a':'#ffd98a'); } }
        for(let i=0;i<PG.stars.length;i++){ if(PGS.got.has(i)) continue; const s=PG.stars[i]; if(s.x<G.cx-10||s.x>G.cx+W+10) continue; cubStar(s.x,s.y+Math.sin(G.t*4+s.x)*1.3,3.6,'#ffd98a'); }
        // Mom on the wood chips, a step behind
        pgGrace(G.gx,GY+1,G.gmove?G.t:0,G.capT>0&&G.cap&&/Wow|high|Boing|Wheee|Every/.test(G.cap),G.gmove?G.gdir:(G.x>=G.gx?1:-1));
        // Cam
        const pose=G.sit>0?'sit':G.st==='hang'?'hang':G.st==='climb'?'climb':G.crawl?'duck':!G.gnd?'jump':'run';
        U.fillStyle='rgba(0,0,0,0.18)'; if(G.gnd){ U.beginPath(); U.ellipse(G.x,G.y+0.5,7,1.6,0,0,7); U.fill(); }
        U.save(); U.translate(G.x,G.y); if(G.face<0&&pose!=='climb') U.scale(-1,1);
        if(pose==='hang'){ const sw=Math.sin(G.steps*0.35)*0.22; U.translate(0,-17); U.rotate(sw); pgCam(0,17,'jump',0,{}); }
        else if(pose==='climb'){ U.translate(Math.sin(G.steps*0.45)*1.2,0); pgCam(0,0,'jump',0,{}); }
        else pgCam(0,0,pose,pose==='run'?(Math.abs(G.vx)>6?G.steps/64:0):G.steps/40,{squash:G.sq}); U.restore();
        // tunnel front: see-through, with ribs
        for(let x=x0;x<=x1;x++) for(let y=0;y<22;y++){ if(PG.pf[y][x]!=='T') continue; const X=x*T, Y=y*T; U.globalAlpha=0.5; uRR(X,Y-2,T+0.5,T+2,0,'#4cc06c',null); U.globalAlpha=1; U.fillStyle='rgba(255,255,255,0.35)'; U.fillRect(X,Y,T+0.5,1.4); U.strokeStyle=CO; U.lineWidth=0.9; U.beginPath(); U.moveTo(X,Y-2); U.lineTo(X+T+0.5,Y-2); U.stroke(); if(PG.pf[y][x-1]!=='T') uRR(X-1.6,Y-3.5,3.2,T+4,1.6,'#2f8a4c',CO,0.8); uRR(X+T-1.6,Y-3.5,3.2,T+4,1.6,'#2f8a4c',CO,0.8); }
        for(const p of G.parts){ U.globalAlpha=1-p.t/p.life; U.fillStyle=p.col; U.fillRect(p.x-1.2,p.y-1.2,2.4,2.4); } U.globalAlpha=1;
        if(G.zone){ const s=G.zone.id==='exit'?keyName('a')+': back to Mom':keyName('a')+': '+(G.zone.id==='big'?'big slide!':'curly slide!'); U.font='bold 6.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(s).width+12; const px=Math.max(G.cx+tw/2+3,Math.min(G.cx+W-tw/2-3,G.x)); uRR(px-tw/2,G.y-42,tw,11,5.5,'#ffd98a',CO,0.9); txt(s,px,G.y-39.5,CO,6.5,'center',true); }
        U.restore();
        // HUD
        if(PGS.said_ask&&!G.ask){ const h='hold '+keyName('b')+': all done'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,4,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,6,'#ffd98a',5.5,'center'); }
        if(G.ask){ U.fillStyle='rgba(10,8,18,0.55)'; U.fillRect(0,0,W,Hh); const bw=Math.min(190,W-14), x=W/2-bw/2, y=Hh/2-34; uRR(x,y,bw,68,7,'rgba(20,16,30,0.97)','#ffd98a',1.2); txt('You did everything!',W/2,y+7,'#ffd98a',10,'center',true); txt('Every star and both slides.',W/2,y+22,'#f4ead8',6.5,'center');
          ['All done','Keep playing'].forEach((s_,i)=>{ const bx=x+8+i*(bw/2-4), w2=bw/2-12; uRR(bx,y+38,w2,18,5,G.ask.sel===i?'#ffd98a':'rgba(255,255,255,0.1)',CO,0.9); txt(s_,bx+w2/2,y+43,G.ask.sel===i?CO:'#f4ead8',7,'center',true); }); }
        box(3,3,62,13,'rgba(28,24,40,0.85)'); cubStar(11,9.5,3.6,'#ffd98a'); txt(PGS.got.size+' / '+PG.stars.length,18,6,'#fff',7,'left',true);
        const bx=W-70; box(bx,3,67,13,'rgba(28,24,40,0.85)'); txt('SLIDES',bx+5,7,'#a9a0b8',5.5); uCirc(bx+40,9.5,4,PGS.slides.big?'#22969a':'rgba(255,255,255,0.12)',CO,0.8); uCirc(bx+54,9.5,4,PGS.slides.curly?'#3caa5a':'rgba(255,255,255,0.12)',CO,0.8);
        if(G.cap) pgCaption(G.capWho,G.cap);
        else if(PGS.t<9){ const up=isTouch()?'drag':'arrows'; const h=up+': walk and climb      '+keyName('a')+': jump'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); }
      } };
  });
}
// ---------- the big slide: hold on the yellow to go faster, and every hump throws Cam into the air. Nothing slows him down. ----------
function slideBig(opts){ opts=opts||{};
  return new Promise(resolve=>{
    // key points alternate valley / crest (the lip), joined by cosine curves. Eight humps, each a little bigger.
    const kp=[[0,0],[46,0]]; { let x=46,y=0; for(let i=0;i<(opts.humps||8);i++){ x+=210+10*i; y+=96+5*i; kp.push([x,y]); x+=120+5*i; y-=50+3*i; kp.push([x,y]); } }
    const END=kp[kp.length-1][0], ENDY=kp[kp.length-1][1], CHIPS=ENDY+46, LIPS=[]; for(let i=3;i<kp.length;i+=2) LIPS.push(kp[i][0]);
    const DOWNS=[]; for(let i=1;i<kp.length-1;i+=2) DOWNS.push([kp[i][0],kp[i+1][0]]);
    const gy=x=>{ if(x<=0) return 0; if(x>=END) return CHIPS; let i=1; while(kp[i][0]<x) i++; const [x0,y0]=kp[i-1],[x1,y1]=kp[i]; const f=(x-x0)/(x1-x0); return y0+(y1-y0)*(1-Math.cos(f*Math.PI))/2; };
    const slope=x=>(gy(x+0.5)-gy(x-0.5));
    const onDown=x=>{ for(const d of DOWNS) if(x>=d[0]+6&&x<=d[1]-4) return true; return false; };
    const VMIN=150, VMAX=335, LA=0.52, GRAV=430;
    // one step. On the slide, speed only ever comes from "charge": holding on a yellow stretch fills it, and nothing takes it away before the lip.
    const phys=(o,held,dt,ev)=>{
      if(o.gnd){ if(o.x>=END){ o.v=Math.max(0,o.v-520*dt); o.x+=o.v*dt; o.y=CHIPS; return; }
        o.good=held&&onDown(o.x); if(o.good) o.charge=Math.min(1,o.charge+dt/0.62);
        const want=VMIN+(VMAX-VMIN)*o.charge; o.v+=(want-o.v)*Math.min(1,dt*6); const s0=slope(o.x), x0=o.x; o.x+=o.v/Math.hypot(1,s0)*dt; o.y=gy(o.x);
        for(const L of LIPS) if(x0<L&&o.x>=L){ o.x=L; o.y=gy(L-0.01); o.gnd=false; o.air=0; o.vx=o.v*Math.cos(LA); o.vy=-o.v*Math.sin(LA)*(0.75+0.5*o.charge); o.launchC=o.charge; if(ev) ev('launch',o.charge); break; } }
      else { o.good=false; o.vy+=GRAV*dt; o.x+=o.vx*dt; o.y+=o.vy*dt; o.air+=dt; const g=gy(o.x);
        if(o.y>=g&&(o.vy>0||o.y>g+2)){ o.y=g; o.gnd=true; const sm=o.x<END&&slope(o.x)>0.1&&o.air>0.55; o.charge=o.x>=END?0:Math.min(1,o.launchC*0.7+(sm?0.25:0)); o.v=Math.max(VMIN,Math.hypot(o.vx,o.vy)*0.8); if(o.x>=END) o.v=Math.max(60,o.vx); if(ev) ev(o.x>=END?'chips':sm?'clean':'land',o.air,g); } } };
    const fresh=()=>({x:20,y:0,v:VMIN,vx:0,vy:0,gnd:true,air:0,charge:0,launchC:0,good:false});
    // stars hang where a well-ridden line flies
    const stars=[]; { const o=fresh(); let acc=0, t=0; while(o.x<END-10&&t<60){ phys(o,true,0.006); t+=0.006; if(!o.gnd&&o.air>0.1){ acc+=0.006; if(acc>=0.17){ acc=0; stars.push({x:o.x,y:o.y-10,got:false}); } } else acc=0.08; } }
    const G=Object.assign(fresh(),{t:0,phase:'ready',pT:0,airTotal:0,best:0,perfect:0,stars:0,total:stars.length,score:0,held:false,fx:[],parts:[],cap:'Ready... set...',capT:1.4,zoom:1,cy:0,dist:0,done:false,rideT:0,sq:0,teach:true,humps:0});
    const fx=(s,col)=>G.fx.push({txt:s,col:col||'#fff',t:0});
    const ev=(kind,a,ground)=>{
      if(kind==='launch'){ G.humps++; G.teach=false; G.pow=(G.pow||0)+a; blip(300+a*500,0.12,0.05,'triangle'); if(a>0.75){ fx('BIG AIR!','#ffd98a'); jingle([660,880,1175],0.05,'triangle',0.05); G.cap='Wheeeeeee!'; G.capWho='Cam'; G.capT=1.1; } return; }
      if(kind==='clean'){ G.perfect++; fx('Smooth!  +50','#7bd95a'); jingle([784,988,1319],0.05,'triangle',0.05); } else blip(190,0.04,0.04,'triangle');
      G.sq=0.6; for(let i=0;i<8;i++) G.parts.push({x:G.x,y:ground,vx:-40-Math.random()*90,vy:-30-Math.random()*70,t:0,life:0.45,col:kind==='clean'?'#bfeee9':'#fff'}); G.airTotal+=a; G.best=Math.max(G.best,a); };
    S.mini={ full:true, G, slideBig:true, holdA:true, slope,
      update(dt){ G.t+=dt; for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<1); for(const p of G.parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=300*dt; } G.parts=G.parts.filter(p=>p.t<p.life); if(G.capT>0){ G.capT-=dt; if(G.capT<=0) G.cap=null; } if(G.sq) G.sq*=Math.max(0,1-dt*8);
        hit('a'); hit('b'); hit('up'); hit('down'); hit('left'); hit('right');
        if(G.phase==='ready'){ G.pT+=dt; if(G.pT>1.4){ G.phase='ride'; G.cap=null; } }
        else if(G.phase==='ride'){ G.held=!!(K.a||K.down||K.b); G.rideT+=dt;
          // the first hump runs in slow motion with the instruction on screen
          const slow=G.teach&&G.gnd&&G.x>40?0.4:1, d2=dt*slow, n=Math.max(1,Math.ceil(d2/0.006)); for(let i=0;i<n;i++) phys(G,G.held,d2/n,ev);
          if(G.good&&Math.floor(G.t*14)!==Math.floor((G.t-dt)*14)) blip(260+G.charge*520,0.03,0.03,'triangle');
          for(const s of stars) if(!s.got&&Math.abs(s.x-G.x)<18&&Math.abs(s.y-(G.y-9))<22){ s.got=true; G.stars++; blip(880+(G.stars%8)*50,0.05,0.04,'triangle'); for(let i=0;i<5;i++) G.parts.push({x:s.x,y:s.y,vx:(Math.random()-0.5)*90,vy:-Math.random()*80,t:0,life:0.4,col:'#ffd98a'}); }
          if(G.x>=END&&G.gnd&&G.v<6){ G.phase='land'; G.pT=0; G.dist=Math.max(0,G.x-END); G.score=G.stars*10+G.perfect*50+Math.round((G.pow||0)*60)+Math.round(G.airTotal*40)+Math.round(G.dist*1.5)+Math.max(0,Math.round(400-G.rideT*12)); G.cap=G.dist>150?'You FLEW! All the way out here!':'Yay, Cam! Big slide!'; G.capWho='Mom'; G.capT=3; jingle([523,659,784,1047,1319],0.08,'triangle',0.06); } }
        else if(G.phase==='land'){ G.pT+=dt; if(G.pT>2.2&&!G.done){ G.done=true; resolve(G); } }
        const h=Math.max(0,gy(G.x)-G.y), sp=G.gnd?G.v:Math.hypot(G.vx,G.vy); const tz=Math.max(0.55,Math.min(1,1/(1+h/170+Math.max(0,sp-250)/900))); G.zoom+=(tz-G.zoom)*Math.min(1,dt*2.5);
      },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
        let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#5fb4ee'); g.addColorStop(0.7,'#cdeefb'); g.addColorStop(1,'#f4f7df'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
        uCirc(W*0.8,Hh*0.2,13,'#fff3b0',null); uCirc(W*0.8,Hh*0.2,19,'rgba(255,243,176,0.25)',null);
        U.fillStyle='rgba(255,255,255,0.9)'; for(let i=0;i<5;i++){ const cx=((i*140-G.x*0.08)%(W+160)+W+160)%(W+160)-80, cy=18+(i*37)%50; U.beginPath(); U.ellipse(cx,cy,24,7,0,0,7); U.ellipse(cx+13,cy-5,14,7,0,0,7); U.fill(); }
        for(let L=0;L<2;L++){ U.fillStyle=L?'#8fcf8a':'#b5e0b0'; U.beginPath(); U.moveTo(0,Hh); for(let x=0;x<=W;x+=8){ const wx=x+G.x*(L?0.3:0.15); U.lineTo(x,Hh*(L?0.74:0.62)+Math.sin(wx*0.02+L)*12+Math.sin(wx*0.047)*6); } U.lineTo(W,Hh); U.fill();
          if(L===0) for(let i=0;i<7;i++){ const px=((i*88-G.x*0.2)%(W+120)+W+120)%(W+120)-60, t_=PG_TREES[i%PG_TREES.length]; pgTree(px,Hh*0.7+((i*13)%9),t_[0],t_[1]*0.5,i+3,0.8); } }
        const z=G.zoom, ground=gy(G.x), CX=W*0.3, midY=(G.y+Math.min(ground,G.y+150))/2; G.cy+=(midY-G.cy)*0.2; const X=wx=>CX+(wx-G.x)*z, Y=wy=>Hh*0.52+(wy-G.cy)*z;
        const wx0=G.x-CX/z-20, wx1=G.x+(W-CX)/z+20;
        const band=(a,b,col)=>{ U.beginPath(); for(let x=a;x<=b+0.01;x+=Math.min(6,b-a||6)) U.lineTo(X(x),Y(gy(x))); U.lineTo(X(b),Y(gy(b))); U.lineTo(X(b),Hh+10); U.lineTo(X(a),Hh+10); U.closePath(); U.fillStyle=col; U.fill(); };
        const a0=Math.max(0,wx0), b0=Math.min(END,wx1);
        if(b0>a0){ for(let s=Math.floor(a0/36)*36;s<b0;s+=36){ const sa=Math.max(a0,s), sb=Math.min(b0,s+36); if(sb>sa) band(sa,sb,(s/36)%2?'#1f8f93':'#27a3a6'); }
          // the "go" stretches: every way down is painted yellow, and lights up while you are holding on it
          for(const d of DOWNS){ if(d[1]<a0||d[0]>b0) continue; const here=G.gnd&&G.x>=d[0]&&G.x<=d[1], lit=here&&G.good, pulse=0.5+0.5*Math.sin(G.t*9);
            U.lineCap='round'; U.beginPath(); for(let x=Math.max(a0,d[0]+6);x<=Math.min(b0,d[1]-4);x+=5) U.lineTo(X(x),Y(gy(x))+3.2*z); U.strokeStyle=lit?'#fff27a':here?'rgba(255,210,58,'+(0.75+0.25*pulse)+')':'rgba(255,210,58,0.8)'; U.lineWidth=(lit?7:5.2)*z; U.stroke(); U.lineCap='butt';
            U.fillStyle='rgba(46,40,56,0.55)'; for(let x=d[0]+18;x<d[1]-12;x+=22){ if(x<a0||x>b0) continue; const s1=slope(x), an=Math.atan(s1); U.save(); U.translate(X(x),Y(gy(x))+3.2*z); U.rotate(an); U.scale(z,z); U.beginPath(); U.moveTo(-3,-2.2); U.lineTo(1,0); U.lineTo(-3,2.2); U.lineTo(-1.2,0); U.closePath(); U.fill(); U.beginPath(); U.moveTo(2,-2.2); U.lineTo(6,0); U.lineTo(2,2.2); U.lineTo(3.8,0); U.closePath(); U.fill(); U.restore(); } }
          U.beginPath(); for(let x=a0;x<=b0;x+=5) U.lineTo(X(x),Y(gy(x))); U.lineTo(X(b0),Y(gy(b0-0.01))); U.strokeStyle=CO; U.lineWidth=1.4; U.stroke();
          // a little flag on every lip
          for(const L of LIPS){ if(L<a0-10||L>b0+10) continue; const lx=X(L), ly=Y(gy(L-0.01)); uRR(lx-0.8*z,ly-15*z,1.6*z,15*z,0.5,'#f4ead8',CO,0.6); uPoly([[lx+0.8*z,ly-15*z],[lx+9*z,ly-12*z],[lx+0.8*z,ly-9*z]],'#ff7a6a',CO,0.7); } }
        if(wx0<0){ U.fillStyle='#96704a'; U.fillRect(X(wx0),Y(0),X(0)-X(wx0),Hh); uPoly([[X(-34),Y(-46)],[X(-10),Y(-66)],[X(14),Y(-46)]],'#22969a',CO,1); uRR(X(-30),Y(-46),3*z,46*z,1,'#3c4048',CO,0.7); }
        if(wx1>END){ U.fillStyle='#d6b88c'; U.fillRect(X(END),Y(CHIPS),X(wx1)-X(END)+4,Hh); U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(X(END),Y(ENDY)); U.lineTo(X(END),Y(CHIPS)); U.lineTo(X(wx1),Y(CHIPS)); U.stroke();
          for(let d=100;d<=700;d+=100){ const fxp=X(END+d); if(fxp>W+20) break; uRR(fxp-1,Y(CHIPS)-14*z,2,14*z,0.5,'#f4ead8',CO,0.6); txt(String(d/10|0),fxp,Y(CHIPS)-22*z,'#fff',6,'center',true); }
          pgGrace(X(END+Math.max(120,G.phase==='land'?G.dist+30:120)),Y(CHIPS)+1,0,G.phase==='land',-1); }
        for(const s of stars) if(!s.got&&s.x>wx0&&s.x<wx1) cubStar(X(s.x),Y(s.y)+Math.sin(G.t*5+s.x)*1.2,3.6*Math.max(0.75,z),'#ffd98a');
        for(const p of G.parts){ U.globalAlpha=1-p.t/p.life; U.fillStyle=p.col; U.fillRect(X(p.x)-1.3,Y(p.y)-1.3,2.6,2.6); } U.globalAlpha=1;
        // Cam
        const sp=G.gnd?G.v:Math.hypot(G.vx,G.vy), ang=G.gnd?(G.x>=END?0:Math.atan(slope(G.x))):Math.atan2(G.vy,Math.max(40,G.vx))*0.6;
        if(sp>230&&G.phase==='ride'){ U.strokeStyle='rgba(255,255,255,0.7)'; U.lineWidth=1; U.beginPath(); for(let i=0;i<4;i++){ const bx=X(G.x)-Math.cos(ang)*(13+i*6), by=Y(G.y)-8-i*3.5-Math.sin(ang)*(13+i*6), len=8+sp/40; U.moveTo(bx,by); U.lineTo(bx-Math.cos(ang)*len,by-Math.sin(ang)*len); } U.stroke(); }
        const cs=Math.max(0.72,z); U.save(); U.translate(X(G.x),Y(G.y)-1); U.scale(cs,cs);
        if(G.phase==='land') pgCam(0,0,'jump',G.t,{}); else if(G.phase==='ready') pgCam(0,0,'slide',G.t,{}); else if(G.good) pgCam(0,0,'duck',0,{rot:ang}); else pgCam(0,0,'slide',G.t,{rot:ang,arms:!G.gnd,squash:G.sq}); U.restore();
        // how big the next jump will be
        if(G.phase==='ride'&&G.gnd&&G.x<END){ const bx=X(G.x)-13, by=Y(G.y)-36*cs; uRR(bx-1,by-1,28,6,3,'rgba(28,24,40,0.85)',CO,0.7); uRR(bx,by,Math.max(2,26*G.charge),4,2,G.charge>0.75?'#7bd95a':'#ffd23a',null); }
        for(const f of G.fx){ U.globalAlpha=f.t>0.7?(1-f.t)/0.3:1; txt(f.txt,X(G.x),Y(G.y)-46-f.t*14,f.col,8,'center',true); U.globalAlpha=1; }
        // the lesson on the first hump, then a short reminder
        if(G.phase==='ride'&&G.teach&&G.x>40){ const m=G.good?'That\'s it! Keep holding!':(isTouch()?'HOLD the screen on the yellow':'HOLD  '+keyName('a')+'  on the yellow'); U.font='bold 9px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(m).width+18; uRR(W/2-tw/2,24,tw,16,8,G.good?'#7bd95a':'#ffd23a',CO,1); txt(m,W/2,27.5,CO,9,'center',true); txt('The fuller the bar, the bigger the jump.',W/2,44,'#fff',6.5,'center',true); }
        else if(G.phase==='ride'&&G.humps<4&&G.x<END){ const m=(isTouch()?'hold the screen':'hold '+keyName('a'))+' on the yellow: bigger jump'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(m).width+12; uRR(W/2-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(m,W/2,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); }
        box(3,3,62,13,'rgba(28,24,40,0.85)'); cubStar(11,9.5,3.6,'#ffd98a'); txt(G.stars+' / '+G.total,18,6,'#fff',7,'left',true);
        box(W-78,3,75,13,'rgba(28,24,40,0.85)'); txt('AIR',W-73,7,'#a9a0b8',5.5); txt((G.airTotal+(G.gnd?0:G.air)).toFixed(1)+' s',W-8,6,'#ffd98a',7,'right',true);
        const pw=Math.min(110,W-160); if(pw>36){ uRR(W/2-pw/2,7,pw,5,2.5,'rgba(28,24,40,0.7)',CO,0.7); uRR(W/2-pw/2,7,Math.max(4,pw*Math.min(1,G.x/END)),5,2.5,'#27a3a6',null); }
        if(G.phase==='land'){ const m='Flew '+(G.dist/10).toFixed(1)+' ft'; txt(m,W/2,Hh*0.13,'#fff',11,'center',true); }
        if(G.cap) pgCaption(G.capWho||'Mom',G.cap);
      } };
  });
}
// ---------- the curly slide: from behind Cam, down the tube. Steer; the bends push you up the wall. ----------
function slideCurly(){
  return new Promise(resolve=>{
    const SL=1, segs=[]; const add=(n,c,dy)=>{ for(let i=0;i<n;i++){ const f=i/n, e=f<0.25?f/0.25:f>0.75?(1-f)/0.25:1; segs.push({c:c*e,dy:(dy||0.035)*(0.6+0.8*e)}); } };
    add(16,0); add(30,0.9); add(10,0); add(32,-1); add(20,0.6,0.11); add(28,-0.8); add(12,0,0.12); add(34,1.1); add(26,-1.1); add(16,0,0.14); add(30,0.9); add(32,-1,0.06); add(20,0.5); add(30,0);
    let yy=0; for(const s of segs){ s.y=yy; yy-=s.dy*1.6; } const N=segs.length, ENDZ=(N-24)*SL;
    const items=[]; { let lane=0; for(let i=18;i<N-30;i+=3){ const blk=Math.floor(i/24); if(blk%2===0){ lane=Math.sin(i*0.16)*0.55-segs[i].c*0.2; items.push({i,x:lane,t:'star'}); } else if(i%24===6) items.push({i,x:(blk%4===1?-0.45:0.45),t:'boost'}); else if(i%24===15) items.push({i,x:(blk%4===1?0.4:-0.4),t:'leaf'}); } }
    const total=items.filter(q=>q.t==='star').length;
    const G={t:0,phase:'ready',pT:0,z:0,v:5,px:0,lean:0,stars:0,total,boosts:0,bumps:0,boostT:0,slow:0,score:0,fx:[],cap:'Into the tube!',capT:1.4,capWho:'Mom',rideT:0,shake:0,done:false,wall:0};
    const fx=(s,col)=>G.fx.push({txt:s,col:col||'#fff',t:0});
    S.mini={ full:true, G, slideCurly:true, items, segs, SL,
      update(dt){ G.t+=dt; for(const f of G.fx) f.t+=dt; G.fx=G.fx.filter(f=>f.t<0.9); if(G.capT>0){ G.capT-=dt; if(G.capT<=0) G.cap=null; } if(G.shake>0) G.shake-=dt;
        hit('a'); hit('b'); hit('up'); hit('down'); hit('left'); hit('right');
        if(G.phase==='ready'){ G.pT+=dt; if(G.pT>1.3) G.phase='ride'; return; }
        if(G.phase==='out'){ G.pT+=dt; if(G.pT>2.2&&!G.done){ G.done=true; resolve(G); } return; }
        G.rideT+=dt; const steer=(K.right?1:0)-(K.left?1:0); G.lean+=(steer-G.lean)*Math.min(1,dt*9);
        const seg=segs[Math.min(N-1,Math.floor(G.z/SL))]; const vmax=(G.boostT>0?25:18.5)*(G.slow>0?0.55:1); G.v+=Math.max(-14*dt,Math.min((G.boostT>0?16:2.6)*dt,vmax-G.v)); if(G.boostT>0) G.boostT-=dt; if(G.slow>0) G.slow-=dt;
        const pct=G.v/18.5; G.px+=steer*1.75*dt-seg.c*pct*1.25*dt;
        if(Math.abs(G.px)>0.86){ G.px=Math.sign(G.px)*0.86; G.wall+=dt; G.v=Math.max(6,G.v-9*dt); if(G.wall>0.25&&!G.wallHit){ G.wallHit=true; G.bumps++; G.shake=0.2; fx('Bump!','#ffb0a0'); blip(130,0.1,0.05,'sawtooth'); buzz(25); } } else { G.wall=0; G.wallHit=false; }
        const pz=G.z; G.z+=G.v*dt;
        for(const q of items){ if(q.got) continue; const qz=q.i*SL; if(qz>pz&&qz<=G.z+0.6){ if(Math.abs(q.x-G.px)<0.32){ q.got=true;
              if(q.t==='star'){ G.stars++; blip(880+(G.stars%8)*50,0.05,0.04,'triangle'); }
              else if(q.t==='boost'){ G.boosts++; G.boostT=1.3; fx('Zoom!','#7bd95a'); jingle([660,880,1320],0.05,'triangle',0.05); G.cap='Wheeeee!'; G.capWho='Cam'; G.capT=1; }
              else { G.slow=0.9; fx('Leaves!','#e9b83a'); blip(160,0.12,0.05,'sawtooth'); G.shake=0.15; } } } }
        if(G.z>=ENDZ){ G.phase='out'; G.pT=0; G.speedB=Math.max(0,Math.round(900-G.rideT*30)); G.score=Math.max(0,G.stars*10+G.boosts*30+G.speedB-G.bumps*15); G.cap='There he is! Wooow!'; G.capWho='Mom'; G.capT=3; jingle([523,659,784,1047,1319],0.08,'triangle',0.06); }
      },
      draw(){ const W=VW,Hh=VH; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
        let g=U.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'#69b9ef'); g.addColorStop(1,'#dff3fb'); U.fillStyle=g; U.fillRect(0,0,W,Hh);
        const base=Math.min(N-2,Math.floor(G.z/SL)), bp=(G.z-base*SL)/SL, HZ=Hh*0.36;
        // treetops drift with the bends
        let drift=0; for(let i=0;i<base;i+=6) drift+=segs[i].c; for(let i=0;i<9;i++){ const px=((i*70-drift*9)%(W+140)+W+140)%(W+140)-70; const t_=PG_TREES[i%PG_TREES.length]; pgTree(px,HZ+34,t_[0],t_[1]*0.62,i+1); } U.fillStyle='#8fcf8a'; U.fillRect(0,HZ+30,W,Hh);
        if(G.phase==='out'){ const k=Math.min(1,G.pT/0.6); U.fillStyle='#d6b88c'; U.fillRect(0,Hh*0.62,W,Hh); pgGrace(W/2+34,Hh*0.9,0,true); U.save(); U.translate(W/2-10,Hh*0.9-(1-k)*30*Math.sin(k*3.14)); U.scale(1.6,1.6); pgCam(0,0,k<1?'slide':'jump',G.t,{arms:true}); U.restore(); }
        else { const D=0.9, CH=0.5, R=1, sh=G.shake>0?(Math.random()-0.5)*3:0; const pa=G.px*1.15, camX=Math.sin(pa)*R*0.55, camY=segs[base].y+(segs[base+1].y-segs[base].y)*bp+CH+(1-Math.cos(pa))*R*0.35;
          const ANG=[-2.05,-1.6,-1.15,-0.7,-0.25,0.25,0.7,1.15,1.6,2.05], COLS=[['#1f7a3c','#2a9148'],['#278f45','#33a454'],['#31a352','#3fb862'],['#3fb564','#52ca76'],['#4cc470','#66d98a'],['#3fb564','#52ca76'],['#31a352','#3fb862'],['#278f45','#33a454'],['#1f7a3c','#2a9148']];
          const P=[]; let x=0, dx=-segs[base].c*0.02*bp; const ND=Math.min(46,N-base-1);
          for(let n=0;n<=ND;n++){ const sg=segs[base+n], rz=Math.max(0.1,(n-bp)*SL+0.02), sc=D/rz; const pts=ANG.map(a=>[W/2+sh+sc*(Math.sin(a)*R-camX-x)*W/2, HZ-sc*(sg.y+(1-Math.cos(a))*R-camY)*Hh/2]); P.push({pts,sc,n:base+n,cx:W/2+sh+sc*(-camX-x)*W/2,by:HZ-sc*(sg.y-camY)*Hh/2}); x+=dx; dx+=sg.c*0.02; }
          for(let n=ND-1;n>=0;n--){ const a=P[n], b=P[n+1], k=Math.floor(a.n/2)%2;
            for(let q=0;q<9;q++) uPoly([b.pts[q],b.pts[q+1],a.pts[q+1],a.pts[q]],COLS[q][k],null);
            if(a.n%4===0){ U.strokeStyle='rgba(18,70,36,0.85)'; U.lineWidth=Math.max(0.9,Math.min(6,a.sc*7)); U.lineJoin='round'; U.beginPath(); a.pts.forEach((p,ii)=>ii?U.lineTo(p[0],p[1]):U.moveTo(p[0],p[1])); U.stroke(); }
            U.strokeStyle=CO; U.lineWidth=Math.max(0.5,Math.min(1.6,a.sc*1.2)); U.beginPath(); U.moveTo(b.pts[0][0],b.pts[0][1]); U.lineTo(a.pts[0][0],a.pts[0][1]); U.moveTo(b.pts[9][0],b.pts[9][1]); U.lineTo(a.pts[9][0],a.pts[9][1]); U.stroke();
            for(const q of items){ if(q.i!==a.n||q.got) continue; const ia=q.x*1.15, ix=a.cx+a.sc*Math.sin(ia)*R*W/2, iy=a.by-a.sc*(1-Math.cos(ia))*R*Hh/2, r2=Math.max(1.4,a.sc*26);
              if(q.t==='star') cubStar(ix,iy-r2*1.1,r2,'#ffd98a');
              else if(q.t==='boost'){ for(let c2=0;c2<3;c2++) uPoly([[ix-r2*1.5,iy-c2*r2*0.8],[ix,iy-r2*0.8-c2*r2*0.8],[ix+r2*1.5,iy-c2*r2*0.8],[ix,iy-r2*0.4-c2*r2*0.8]],'#fff27a',CO,0.5); }
              else { for(let c2=0;c2<4;c2++) uCirc(ix+(c2-1.5)*r2*0.7,iy-r2*0.4-(c2%2)*r2*0.4,r2*0.6,['#e9b83a','#d8792a','#c8a030','#b5651d'][c2],CO,0.5); } } }
          // Cam from behind
          const cx=W/2+G.px*26+sh, cy=Hh-6+Math.abs(G.px)*-10; U.save(); U.translate(cx,cy); U.rotate(-G.px*0.55+G.lean*0.15); U.scale(0.9,0.9);
          const of=OUTFITS.find(q=>q[0]===S.flags.outfit)||OUTFITS[1]; const bob=Math.sin(G.t*22)*0.8;
          uLimb([[-9,-26+bob],[-19,-46-(G.boostT>0?6:0)]],6,of[4]||of[2]); uLimb([[9,-26+bob],[19,-46-(G.boostT>0?6:0)]],6,of[4]||of[2]); uCirc(-19.5,-48-(G.boostT>0?6:0),4,'#f6d0b4',CO,0.9); uCirc(19.5,-48-(G.boostT>0?6:0),4,'#f6d0b4',CO,0.9);
          uRR(-13,-30+bob,26,34,9,of[2],CO,1.1); uCirc(0,-40+bob,14,'#f6d0b4',CO,1.1); U.beginPath(); U.ellipse(0,-42+bob,14.6,13.5,0,Math.PI*0.92,Math.PI*2.08); U.lineTo(11,-33+bob); U.quadraticCurveTo(0,-27+bob,-11,-33+bob); U.closePath(); U.fillStyle='#e6c878'; U.fill(); U.strokeStyle=CO; U.lineWidth=1; U.stroke(); camBackHair(0,-42+bob,14); U.restore();
          if(G.v>15){ U.strokeStyle='rgba(255,255,255,0.5)'; U.lineWidth=1; U.beginPath(); for(let i=0;i<6;i++){ const a=(i/6)*Math.PI+0.2+G.t*3%0.5, r0=70+((G.t*240+i*37)%60); U.moveTo(W/2+Math.cos(a)*r0,Hh*0.62-Math.sin(a)*r0*0.6); U.lineTo(W/2+Math.cos(a)*(r0+16),Hh*0.62-Math.sin(a)*(r0+16)*0.6); } U.stroke(); } }
        for(const f of G.fx){ U.globalAlpha=f.t>0.6?(0.9-f.t)/0.3:1; txt(f.txt,W/2,Hh*0.42-f.t*14,f.col,9,'center',true); U.globalAlpha=1; }
        box(3,3,62,13,'rgba(28,24,40,0.85)'); cubStar(11,9.5,3.6,'#ffd98a'); txt(G.stars+' / '+G.total,18,6,'#fff',7,'left',true);
        { const sb=G.phase==='out'?G.speedB:Math.max(0,Math.round(900-G.rideT*30)); box(W-80,3,77,13,'rgba(28,24,40,0.85)'); txt('SPEED',W-75,7,'#a9a0b8',5.5); txt('+'+sb,W-8,6,G.boostT>0?'#7bd95a':'#ffd98a',7,'right',true); if(G.phase==='out') txt('Speed bonus  +'+G.speedB,W/2,Hh*0.2,'#fff',10,'center',true); }
        const pw=Math.min(110,W-150); if(pw>36){ uRR(W/2-pw/2,7,pw,5,2.5,'rgba(28,24,40,0.7)',CO,0.7); uRR(W/2-pw/2,7,Math.max(4,pw*Math.min(1,G.z/ENDZ)),5,2.5,'#4cc470',null); }
        if(G.phase==='ready'){ uRR(W/2-80,Hh/2-22,160,36,7,'rgba(20,16,30,0.94)','#ffd98a',1.2); txt('The curly slide!',W/2,Hh/2-17,'#ffd98a',10,'center',true); txt('◀ ▶  steer.  The bends push you up the wall.',W/2,Hh/2-1,'#fff',6,'center'); }
        if(G.cap) pgCaption(G.capWho||'Mom',G.cap);
        else if(G.phase==='ride'&&G.rideT<5){ const h='◀ ▶ steer     chevrons: zoom     leaves: slow'; U.font='5.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const tw=U.measureText(h).width+12; uRR(W/2-tw/2,Hh-11,tw,9.5,4.5,'rgba(28,24,40,0.8)',null); txt(h,W/2,Hh-9,'rgba(255,255,255,0.92)',5.5,'center'); }
      } };
  });
}
function parkCard(total,isBest){
  return new Promise(resolve=>{ const t0=S.t; const prev=S.mini;
    S.mini={full:true,card:true,update(){ if((hit('a')||hit('b'))&&S.t-t0>0.8) resolve(); },
      draw(){ prev.draw(); const W=VW,Hh=VH,bw=Math.min(190,W-14),x=W/2-bw/2; uRR(x,16,bw,Hh-34,7,'rgba(20,16,30,0.96)','#ffd98a',1.2); txt('THE PLAYGROUND',W/2,22,'#ffd98a',10,'center',true);
        const rows=[['Stars found',PGS.got.size+' / '+PG.stars.length,PGS.got.size*20],['Big slide',PGS.slides.big?String(PGS.slides.big):'not yet',PGS.slides.big],['Curly slide',PGS.slides.curly?String(PGS.slides.curly):'not yet',PGS.slides.curly]]; let y=42; for(const [a,b] of rows){ txt(a,x+12,y,'#f4ead8',7); txt(b,x+bw-12,y,'#f4ead8',7,'right',true); y+=12; }
        y+=5; txt('SCORE',x+12,y,'#ffd98a',9,'left',true); txt(String(total),x+bw-12,y,'#ffd98a',9,'right',true); y+=15; txt(isBest?'New best!':'Best: '+(META.best.park||total),W/2,y,'#a9a0b8',6.5,'center');
        if(Math.floor(S.t*2)%2) txt(keyName('a')+': continue',W/2,Hh-28,'#ffd98a',7,'center',true); } }; });
}
// ---- park handlers (the park map only)
Object.assign(H,{
  p_sign: async()=>{ await say('','HEREDIA PARK. The sign is green. Cam has opinions about green.'); },
  p_tree: async()=>{ await say('','A big tree. There are probably squirrels up there.'); },
  p_bench: async()=>{ await say('','A bench. For moms.'); },
  p_hoop: async()=>{ await say('','The basketball hoop. Way, way up there.'); },
  p_ball: async()=>{ bubble(P,'Football!!!',1400); await wait(900); await say('Mom','That\'s a basketball, bud. Close.'); },
  p_tablechips: async()=>{ await say('','A picnic table in the wood chips. Somebody left a juice box.'); },
  p_rider: async()=>{ await say('','The bouncy red thing!'); P.zBias=30; const ox=P.x, oy=P.y; const o=MAPD.objs.find(q=>q.id==='pk_rider'); P.x=o.x+9; P.y=o.y+14; S.noCollide=true;
    for(let i=0;i<8;i++){ P.lift=(i%2)?7:2; blip(300+i*30,0.05,0.04,'triangle'); await wait(180); } bubble(P,'Yeah!',1000); await wait(700); P.lift=0; P.zBias=0; P.x=ox; P.y=oy; S.noCollide=false; },
  p_small: async()=>{ await say('','The little slide. Cam goes up the three steps and down the slide. Then again. Then again.'); bubble(P,'Oh yeah!',1100); },
  p_swing: async()=>{ const g=NPC.grace; const o=MAPD.objs.find(q=>q.id==='pk_swings'); const ox=P.x, oy=P.y;
    await say('Mom','Swings? Okay. Hold on tight.'); g.follow=false; S.noCollide=true;
    P.x=o.x+29; P.y=o.y+36; P.dir='down'; P.zBias=20; P.lift=4; await walk(g,[[o.x+29,o.y+20]],60); g.dir='down';
    for(let i=0;i<10;i++){ P.lift=4+(i%2?10:0); P.y=o.y+36+(i%2?5:0); blip(i%2?520:420,0.06,0.04,'triangle'); if(i===3) bubble(P,'Wheee!',1100); if(i===7) bubble(P,'Whoaaaa!',1100); await wait(330); }
    await say('Mom','Higher? ...That\'s high enough.'); P.lift=0; P.zBias=0; P.x=ox; P.y=oy; S.noCollide=false; g.follow=true; },
  p_chips: async()=>{ const finds=['a stick','a rock','a wood chip','a leaf','a bottle cap']; const f=finds[Math.floor(Math.random()*finds.length)];
    const c=await choose('Cam finds '+f+' in the wood chips.',['Keep it','Give it to Mom','Eat it']);
    if(c===0){ if(f==='a stick'&&!S.inv.includes('stick')){ give('stick'); await say('','This is a REALLY good stick.'); } else await say('','Into the pocket it goes. Cam does not have pockets. It falls on the ground.'); }
    if(c===1){ bubble(P,'Mommy!',1000); await wait(700); await say('Mom','Oh! For me? Thank you. I love it.'); }
    if(c===2){ await say('Mom','No no no no. Not in your mouth. Blech.'); bubble(P,'Hee hee!',1000); } },
  p_struct: async()=>{
    PGS.got=new Set(); PGS.slides={big:0,curly:0}; PGS.x=40; PGS.y=264; PGS.t=0; for(const k in PGS) if(k.indexOf('said_')===0) delete PGS[k];
    await fadeTo(1,300);
    while(true){
      const pr=playgroundGame(); await fadeTo(0,300); const r=await pr;
      if(r.go==='exit') break;
      await fadeTo(1,250); const sp=r.go==='big'?slideBig():slideCurly(); await fadeTo(0,250); const sl=await sp;
      PGS.slides[r.go]=Math.max(PGS.slides[r.go],sl.score||1); S.flags['slide_'+r.go]=true; award(PARK.routes[r.go].ach);
      PGS.x=(r.go==='big'?59:37)*12; PGS.y=264; await fadeTo(1,250);
    }
    const total=PGS.got.size*20+PGS.slides.big+PGS.slides.curly, n=(PGS.slides.big?1:0)+(PGS.slides.curly?1:0);
    if(total>0){ const isBest=best('park',total); await parkCard(total,isBest); await showBoard('park','THE PLAYGROUND',total,n+(n===1?' slide':' slides')); }
    await fadeTo(1,300); S.mini=null; const o=MAPD.objs.find(q=>q.id==='pk_struct'); P.x=o.x+50; P.y=o.y+100; P.dir='down'; S.snapCam=true; await fadeTo(0,300);
    if(n===2) await say('Mom','Both slides! When you\'re ready, we can have a snack at the picnic table under the tree.');
    else if(n===1) await say('Mom','Nice sliding, dude. The other slide is still waiting for you.');
    else if(total>0) await say('Mom','Good climbing, bud.'); },
  p_picnic: async()=>{ const c=await choose('The picnic table under the tree. Snack time?',['Snack, then home','Keep playing'],'Mom'); if(c===1) return;
    const g=NPC.grace; g.follow=false; const o=MAPD.objs.find(q=>q.id==='pk_picnic'); S.noCollide=true; await walk(g,[[o.x+8,o.y+26]],60); g.dir='up';
    P.x=o.x+26; P.y=o.y+26; P.dir='up';
    await say('Mom','Goldfish and water. The lunch of park champions.'); bubble(P,'Yeah!',1100); await wait(900);
    await say('','Cam eats eleven Goldfish and shares the twelfth with a very interested squirrel.');
    S.noCollide=false; S.flags.parkDone=true; },
});
async function parkOuting(){
  const g=NPC.grace, n=NPC.nick, v=NPC.vinny;
  await say('Mom','The park! Let\'s go, just you and me.');
  await leaveHome(false); await fadeTo(1,600); setDown(); S.fadeText='Heredia Park'; S.fadeSub='A few blocks from home'; await wait(1800); S.fadeText=null; S.fadeSub=null;
  setMap('park'); n.visible=false; v.visible=false; g.visible=true; g.path=null; g.zBias=0;
  P.sit=0; P.x=6*16+8; P.y=3*16+12; P.dir='down'; g.x=P.x+14; g.y=P.y-6; g.dir='down'; g.follow=true; S.bounds=null; S.noCollide=false; S.flags.parkDone=false; S.clock='10:15 AM';
  await fadeTo(0,600);
  await say('Mom','Go play! The big slides are up the stairs. Come find me at the picnic table when you want a snack.');
  setGoal('Play at the park. Picnic table = snack and home.',['pk_struct','pk_picnic']);
  const L=S.lock; S.lock=0;
  while(!S.flags.parkDone) await wait(120);
  while(S.lock>0||S.dlg) await wait(60);
  S.lock=L; setGoal('');
  await fadeTo(1,700); g.follow=false; setMap('house'); n.visible=true; v.visible=true;
  return {};
}

// Cam's hair, from the photos: short, fine, light blond, close to the head, a high hairline and a little wisp at the front.
const CAMHAIR='#e9c98c';
function camHair(x,y,r){ const col=CAMHAIR, dk=hexShade(col,-0.26), lt=hexShade(col,0.35);
  U.beginPath(); U.moveTo(x+r*0.66,y-r*0.74); U.quadraticCurveTo(x+r*0.25,y-r*1.2,x-r*0.35,y-r*1.07); U.quadraticCurveTo(x-r*1.14,y-r*0.78,x-r*1.07,y-r*0.05); U.quadraticCurveTo(x-r*1.02,y+r*0.3,x-r*0.76,y+r*0.48);
  U.quadraticCurveTo(x-r*0.66,y+r*0.2,x-r*0.46,y+r*0.02); U.quadraticCurveTo(x-r*0.34,y-r*0.3,x-r*0.06,y-r*0.42); U.quadraticCurveTo(x+r*0.3,y-r*0.46,x+r*0.52,y-r*0.58); U.closePath();
  U.fillStyle=col; U.fill(); U.strokeStyle=dk; U.lineWidth=Math.max(0.4,r*0.06); U.lineJoin='round'; U.stroke();
  U.lineCap='round'; U.lineWidth=Math.max(0.35,r*0.055);
  // fine strands brushed forward from the crown
  for(let i=0;i<5;i++){ const k=i/4; U.strokeStyle=i%2?lt:dk; U.globalAlpha=0.75; U.beginPath(); U.moveTo(x-r*(0.55-k*0.25),y-r*(0.86+0.1*Math.sin(k*3))); U.quadraticCurveTo(x-r*(0.2-k*0.5),y-r*(0.98-k*0.12),x+r*(0.05+k*0.42),y-r*(0.62+ (1-k)*0.12)); U.stroke(); }
  for(let i=0;i<3;i++){ U.strokeStyle=i%2?lt:dk; U.beginPath(); U.moveTo(x-r*(0.72+i*0.1),y-r*(0.5-i*0.22)); U.quadraticCurveTo(x-r*(0.86+i*0.05),y-r*(0.1-i*0.2),x-r*(0.8-i*0.02),y+r*(0.22+i*0.06)); U.stroke(); } U.globalAlpha=1;
  // the wisp that sticks up at the front
  U.strokeStyle=col; U.lineWidth=Math.max(0.6,r*0.11); U.beginPath(); U.moveTo(x+r*0.3,y-r*1.02); U.quadraticCurveTo(x+r*0.42,y-r*1.24,x+r*0.6,y-r*1.2); U.moveTo(x+r*0.08,y-r*1.1); U.quadraticCurveTo(x+r*0.14,y-r*1.28,x+r*0.28,y-r*1.3); U.stroke();
  U.strokeStyle=dk; U.lineWidth=Math.max(0.3,r*0.04); U.beginPath(); U.moveTo(x+r*0.32,y-r*1.06); U.quadraticCurveTo(x+r*0.43,y-r*1.25,x+r*0.58,y-r*1.22); U.stroke(); U.lineCap='butt';
  uCirc(x-r*0.24,y+r*0.1,r*0.2,'#f6d0b4',CO,Math.max(0.4,r*0.07)); }
// the back of Cam's head: short hair all over, a small whorl at the crown, a soft neckline, ears showing
function camBackHair(x,y,r){ const col=CAMHAIR, dk=hexShade(col,-0.26), lt=hexShade(col,0.35), SK='#f6d0b4';
  uCirc(x-r*1.02,y+r*0.38,r*0.2,SK,CO,Math.max(0.5,r*0.07)); uCirc(x+r*1.02,y+r*0.38,r*0.2,SK,CO,Math.max(0.5,r*0.07));
  U.fillStyle=col; U.beginPath(); U.moveTo(x-r*0.7,y+r*0.6); for(let i=0;i<=6;i++){ const k=i/6; U.quadraticCurveTo(x-r*0.7+r*1.4*(k-1/12),y+r*(0.92-0.1*Math.abs(k-0.5)*2),x-r*0.7+r*1.4*k,y+r*(0.74-0.1*Math.abs(k-0.5)*2)); } U.lineTo(x+r*0.7,y+r*0.5); U.fill();
  U.lineCap='round'; U.lineWidth=Math.max(0.4,r*0.05); const wx=x+r*0.12, wy=y-r*0.3;
  U.strokeStyle=dk; U.beginPath(); U.arc(wx,wy,r*0.09,0.4,4.6); U.stroke();
  for(let i=0;i<11;i++){ const a=i/11*Math.PI*2+0.3, c=Math.cos(a), sn=Math.sin(a); U.strokeStyle=i%2?lt:dk; U.globalAlpha=0.7; U.beginPath(); U.moveTo(wx+c*r*0.18,wy+sn*r*0.18); U.quadraticCurveTo(wx+Math.cos(a+0.5)*r*0.45,wy+Math.sin(a+0.5)*r*0.45,wx+Math.cos(a+0.75)*r*(0.62+0.1*(i%3)),wy+Math.sin(a+0.75)*r*(0.62+0.1*(i%3))+r*0.12); U.stroke(); } U.globalAlpha=1;
  U.strokeStyle=col; U.lineWidth=Math.max(0.6,r*0.1); U.beginPath(); U.moveTo(x-r*0.05,y-r*0.98); U.quadraticCurveTo(x+r*0.02,y-r*1.2,x+r*0.2,y-r*1.16); U.stroke(); U.lineCap='butt'; }
// ---------- trees with some character: oak, maple, pine, birch, poplar ----------
function pgRand(seed,n){ const v=Math.sin(seed*12.9898+n*78.233)*43758.5453; return v-Math.floor(v); }
function pgTree(x,by,kind,h,seed,fade){ const R=n=>pgRand(seed,n), lw=fade?0.7:1; U.save(); if(fade) U.globalAlpha=fade;
  const blobs=(pts,col)=>{ U.strokeStyle=CO; U.lineWidth=lw*2; for(const [bx,byy,br] of pts){ U.beginPath(); U.arc(bx,byy,br,0,7); U.stroke(); } U.fillStyle=col; for(const [bx,byy,br] of pts){ U.beginPath(); U.arc(bx,byy,br,0,7); U.fill(); }
    U.fillStyle=hexShade(col,0.22); for(const [bx,byy,br] of pts){ U.beginPath(); U.arc(bx-br*0.28,byy-br*0.3,br*0.5,0,7); U.fill(); }
    U.fillStyle=hexShade(col,-0.2); for(const [bx,byy,br] of pts){ U.beginPath(); U.arc(bx+br*0.3,byy+br*0.38,br*0.34,0,7); U.fill(); }
    U.strokeStyle=hexShade(col,-0.32); U.lineWidth=0.8; for(let i=0;i<pts.length;i++){ const [bx,byy,br]=pts[i]; U.beginPath(); U.arc(bx+br*(R(i+40)-0.5)*0.6,byy+br*(R(i+50)-0.3)*0.5,br*0.3,0.3,2.6); U.stroke(); } };
  const trunk=(w,th,col,fork)=>{ U.beginPath(); U.moveTo(x-w*0.75,by); U.quadraticCurveTo(x-w*0.4,by-th*0.4,x-w*0.36,by-th); U.lineTo(x+w*0.36,by-th); U.quadraticCurveTo(x+w*0.4,by-th*0.4,x+w*0.75,by); U.closePath(); U.fillStyle=col; U.fill(); U.strokeStyle=CO; U.lineWidth=lw; U.stroke();
    U.strokeStyle=hexShade(col,-0.3); U.lineWidth=0.7; for(let i=0;i<3;i++){ const yy=by-th*(0.2+i*0.25); U.beginPath(); U.moveTo(x-w*0.15+(i%2?w*0.2:0),yy); U.lineTo(x-w*0.1+(i%2?w*0.2:0),yy-th*0.12); U.stroke(); }
    if(fork){ U.strokeStyle=col; U.lineWidth=w*0.45; U.lineCap='round'; U.beginPath(); U.moveTo(x,by-th*0.8); U.lineTo(x-w*1.5,by-th*1.25); U.moveTo(x,by-th*0.85); U.lineTo(x+w*1.3,by-th*1.3); U.stroke(); U.lineCap='butt'; } };
  if(kind==='pine'){ const col=['#2f6b45','#2a5f4a','#356f3c'][seed%3]; trunk(h*0.07,h*0.2,'#6a4a30'); const tiers=4+(seed%2);
    for(let i=0;i<tiers;i++){ const k=i/tiers, ty=by-h*0.14-h*0.86*k*0.82, w=h*0.3*(1-k*0.72), th=h*0.36*(1-k*0.3); const pts=[[x,ty-th]]; const n=5; for(let j=0;j<=n;j++){ const px=x+w-(2*w)*j/n; pts.push([px,ty+(j%2?-th*0.12:0)+(R(i*9+j)-0.5)*2]); } uPoly(pts,col,CO,lw); uPoly([[x,ty-th],[x-w*0.75,ty-th*0.08],[x-w*0.2,ty-th*0.2]],hexShade(col,0.2),null); U.strokeStyle=hexShade(col,-0.3); U.lineWidth=0.7; U.beginPath(); U.moveTo(x+w*0.2,ty-th*0.5); U.lineTo(x+w*0.5,ty-th*0.12); U.stroke(); } }
  else if(kind==='poplar'){ const col=['#5aa04a','#6aa84a'][seed%2]; trunk(h*0.05,h*0.25,'#7a6248'); const pts=[]; for(let i=0;i<6;i++){ const k=i/5; pts.push([x+(R(i)-0.5)*h*0.06,by-h*0.24-h*0.7*k,h*(0.13-0.06*Math.abs(k-0.35))]); } blobs(pts,col); }
  else if(kind==='birch'){ const col=['#9cc054','#b4c84a','#d8b83a'][seed%3]; const w=h*0.045, th=h*0.62; uRR(x-w,by-th,w*2,th,w*0.6,'#ece8dc',CO,lw); U.fillStyle='#4a4650'; for(let i=0;i<6;i++) U.fillRect(x-w+(i%2?w*0.9:0.5),by-th*(0.12+i*0.14),w*0.9,1.1); U.strokeStyle='#ece8dc'; U.lineWidth=1.4; U.beginPath(); U.moveTo(x,by-th*0.8); U.lineTo(x-h*0.14,by-th*1.05); U.moveTo(x,by-th*0.9); U.lineTo(x+h*0.12,by-th*1.1); U.stroke();
    const pts=[]; for(let i=0;i<7;i++){ const a=i/7*6.283; pts.push([x+Math.cos(a)*h*0.15*(0.7+R(i)*0.6),by-h*0.74+Math.sin(a)*h*0.13*(0.7+R(i+9)*0.6),h*(0.085+R(i+20)*0.035)]); } pts.push([x,by-h*0.76,h*0.11]); blobs(pts,col); }
  else { const maple=kind==='maple', col=maple?['#d8862a','#c8a030','#c4552b','#e0a83a'][seed%4]:['#4c9a48','#3f8a3c','#57a84e','#468c50'][seed%4]; trunk(h*0.085,h*0.42,maple?'#6a4630':'#7a5a3a',true);
    const pts=[], cw=h*(maple?0.3:0.36), cy=by-h*0.66; for(let i=0;i<8;i++){ const a=i/8*6.283+R(i)*0.5; pts.push([x+Math.cos(a)*cw*(0.62+R(i+3)*0.3),cy+Math.sin(a)*h*0.2*(0.7+R(i+6)*0.4),h*(0.13+R(i+12)*0.06)]); } pts.push([x,cy,h*0.2],[x-cw*0.2,cy-h*0.16,h*0.15],[x+cw*0.25,cy-h*0.1,h*0.14]); blobs(pts,col);
    if(maple){ U.fillStyle=hexShade(col,0.1); for(let i=0;i<3;i++) U.fillRect(x+(R(i+70)-0.5)*cw*1.6,by-2-R(i+80)*h*0.3,1.6,1.6); } }
  U.restore(); }
const PG_TREES=[['oak',92],['pine',118],['maple',74],['birch',86],['oak',104],['poplar',124],['maple',88],['pine',96],['birch',72],['oak',80],['poplar',108],['maple',96]];
