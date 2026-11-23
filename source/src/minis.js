// ================= little games for the routine beats =================
// breakfast fling (7:00), getting dressed (9:30), the treadmill (basement), Vinny's 3 o'clock dinner (after Emory arrives)
// First time through is the easy version; once a game has been played, later plays use the harder one.
const CAMV={skin:'#f6d0b4',hair:'#e6c878',hairD:'#b8954a',shirt:'#f0c84a',pants:'#7a8ec8',shoe:'#f4f0e8'};
const OUTFIT_COL={pj:'#8fb8e8',dino:'#5aa860',jacket:'#e86a4a',fuzzy:'#6a9ae0',orange:'#f08a2a',sweats:'#2f5a3a',bibs:'#c8344a',cozy:'#b8a2d8',gold:'#f0c040',polo:'#3a6ab8',vikes:'#5a2a8a'};
function mLevel(id){ return (META.plays&&META.plays[id])?1:0; }
function mPlayed(id){ META.plays=META.plays||{}; META.plays[id]=(META.plays[id]||0)+1; saveMeta(); unlock(id); }
function mTop(title,score,mid){ uRR(4,4,VW-8,19,6,'rgba(24,20,34,0.88)','#ffd98a',1); txt(title,11,9,'#ffd98a',7.5,'left',true); txt(String(score),VW-11,9,'#fff',8,'right',true); if(mid) txt(mid,VW/2+8,9.5,'#bfe0ff',6.5,'center',true); }
function mCap(s,y,col){ if(!s) return; U.font='bold 7.5px "Trebuchet MS","Segoe UI",Verdana,sans-serif'; const L=wrap(s,VW-40,7.5), w=Math.min(VW-20,Math.max(...L.map(l=>U.measureText(l).width))+20), h=L.length*10+8; uRR(VW/2-w/2,y,w,h,7,'rgba(255,252,244,0.96)',col||CO,1.2); L.forEach((l,i)=>txt(l,VW/2,y+5+i*10,'#2e2838',7.5,'center',true)); }
function mPops(G,dt){ for(const p of G.pops){ p.t+=dt; } G.pops=G.pops.filter(p=>p.t<1); }
function mPopsDraw(G){ for(const p of G.pops){ U.globalAlpha=Math.max(0,1-p.t); txt(p.s,p.x,p.y-p.t*18,p.c||'#fff',8,'center',true); } U.globalAlpha=1; }
function mFoot(x,y,w,h,label,on,glow){ uRR(x,y,w,h,10,on?'#ffd98a':'rgba(255,255,255,0.14)',on?'#fff':'#a9a0b8',on?1.8:1); if(glow){ U.globalAlpha=0.35+0.3*Math.sin(S.t*10); uRR(x-3,y-3,w+6,h+6,12,null,'#fff6c0',2); U.globalAlpha=1; } txt(label,x+w/2,y+h/2-4,on?'#2e2838':'#e8e0f0',8,'center',true); }
// Cam's face, front on: blond with the wispy bits, big cheeks
function camHead(x,y,r,o){ o=o||{}; uCirc(x,y,r,CAMV.skin,CO,1);
  U.fillStyle=CAMV.hair; U.beginPath(); U.arc(x,y-r*0.06,r*1.04,Math.PI,Math.PI*2); U.quadraticCurveTo(x+r*0.35,y-r*0.42,x-r*1.04,y-r*0.06); U.closePath(); U.fill(); U.strokeStyle=CAMV.hairD; U.lineWidth=0.7; U.stroke();
  U.strokeStyle=CAMV.hair; U.lineWidth=1.3; U.lineCap='round'; for(const [a,b] of [[-0.55,-1.28],[0.05,-1.36],[0.55,-1.2]]){ U.beginPath(); U.moveTo(x+a*r,y-r*0.92); U.quadraticCurveTo(x+(a+0.12)*r,y+b*r,x+(a+0.34)*r,y-r*1.04); U.stroke(); }
  const ey=y+r*0.08, ex=r*0.38; U.strokeStyle=CO; U.lineWidth=1.1;
  if(o.eyes==='shut'){ for(const s of [-1,1]){ U.beginPath(); U.arc(x+s*ex,ey,r*0.14,0.2,Math.PI-0.2); U.stroke(); } }
  else if(o.eyes==='happy'){ for(const s of [-1,1]){ U.beginPath(); U.arc(x+s*ex,ey+r*0.06,r*0.14,Math.PI*1.15,Math.PI*1.85); U.stroke(); } }
  else for(const s of [-1,1]){ uCirc(x+s*ex+(o.look||0)*r*0.08,ey,r*0.11,CO,null); uCirc(x+s*ex+(o.look||0)*r*0.08-r*0.04,ey-r*0.04,r*0.04,'#fff',null); }
  uCirc(x-r*0.62,y+r*0.36,r*0.17,'rgba(240,120,120,0.45)',null); uCirc(x+r*0.62,y+r*0.36,r*0.17,'rgba(240,120,120,0.45)',null);
  const my=y+r*0.5; if(o.mouth==='open'||o.mouth==='yell'){ uCirc(x,my,r*(o.mouth==='yell'?0.24:0.17),'#8a3040',CO,0.8,r*(o.mouth==='yell'?0.2:0.14)); }
  else if(o.mouth==='o'){ uCirc(x,my,r*0.09,'#8a3040',CO,0.7); }
  else if(o.mouth==='grr'){ U.strokeStyle=CO; U.beginPath(); U.moveTo(x-r*0.18,my); U.lineTo(x+r*0.18,my-r*0.04); U.stroke(); }
  else { U.strokeStyle='#8a3a3a'; U.lineWidth=1.1; U.beginPath(); U.arc(x,my-r*0.14,r*0.24,0.3,Math.PI-0.3); U.stroke(); } }
// Cam from the side (facing right), for the treadmill
function camSide(x,y,k,ph,o){ o=o||{}; U.save(); U.translate(x,y); U.scale(k,k); if(o.rot) U.rotate(o.rot);
  const sw=Math.sin(ph)*(o.still?0:1);
  uLimb([[0,-17],[ -2-sw*7,-8],[-3-sw*8,0]],4.4,CAMV.pants); uRR(-7-sw*8,-2,8,4,2,CAMV.shoe,CO,0.8);          // back leg
  uLimb([[-1,-28],[-6+sw*6,-21],[-4+sw*9,-17]],3.6,CAMV.skin);                                                    // back arm
  uRR(-6,-31,12,16,5,o.shirt||CAMV.shirt,CO,1);
  uLimb([[0,-17],[2+sw*7,-8],[3+sw*8,0]],4.4,hexShade(CAMV.pants,0.12)); uRR(-1+sw*8,-2,8,4,2,CAMV.shoe,CO,0.8);   // front leg
  const hx=2, hy=-39; uCirc(hx,hy,8,CAMV.skin,CO,1); U.fillStyle=CAMV.hair; U.beginPath(); U.arc(hx-1,hy-1,8.3,Math.PI*0.85,Math.PI*1.9); U.quadraticCurveTo(hx-2,hy-3,hx-8.6,hy+2); U.closePath(); U.fill();
  U.strokeStyle=CAMV.hair; U.lineWidth=1.2; U.beginPath(); U.moveTo(hx-2,hy-8); U.quadraticCurveTo(hx+1,hy-12,hx+3,hy-9); U.stroke();
  uCirc(hx+4.4,hy,1.1,CO,null); uCirc(hx+4.6,hy+3.6,1.4,'rgba(240,120,120,0.5)',null); U.strokeStyle='#8a3a3a'; U.lineWidth=1; U.beginPath(); if(o.yell){ uCirc(hx+6,hy+4,1.8,'#8a3040',CO,0.6); } else { U.arc(hx+5,hy+3,1.8,0.2,1.6); U.stroke(); }
  uLimb([[1,-28],[6-sw*6,-21],[9-sw*7,-18]],3.6,CAMV.skin);                                                       // front arm
  U.restore(); }
// Vinny from the side: dark brindle bullmastiff, black mask, big head
function vinnySide(x,y,k,face,o){ o=o||{}; U.save(); U.translate(x,y); U.scale(face*k,k); const st=Math.sin(o.ph||0)*(o.walk?3:0);
  const B='#3a2620', D='#24160f', M='#14100e';
  for(const [lx,s] of [[-14,1],[-9,-1],[8,-1],[13,1]]) uRR(lx-2+st*s*0.6,-10,5,10,2,s>0?D:B,CO,0.8);
  U.strokeStyle=CO; U.lineWidth=3.4; U.lineCap='round'; U.beginPath(); U.moveTo(-19,-20); U.quadraticCurveTo(-25,-22+(o.wag?Math.sin(S.t*22)*4:0),-26,-14); U.stroke(); U.strokeStyle=B; U.lineWidth=2; U.stroke();
  uRR(-20,-25,36,16,8,B,CO,1.1); U.strokeStyle='rgba(110,70,50,0.5)'; U.lineWidth=0.8; for(let i=-16;i<14;i+=4){ U.beginPath(); U.moveTo(i,-23); U.lineTo(i+2,-12); U.stroke(); }
  const hy=-30+(o.sit?2:0), mo=o.mouth?4:0; uRR(10,hy-6,16,15,6,B,CO,1.1); uRR(21,hy+1,9,7+mo*0.5,3,M,CO,0.9);
  if(o.mouth){ uRR(22,hy+6,7,mo,1.5,'#c04a58',null); } uCirc(29,hy+1.5,1.6,'#000',null);
  uRR(11,hy-7,6,5,2,M,CO,0.8); uCirc(20,hy-1,1.2,'#000',null); uCirc(19.6,hy-1.4,0.4,'#fff',null);
  U.restore(); }
// Dad from behind / turning, at the stove: black sweatshirt, black beanie
function dadBust(x,y,k,turn){ U.save(); U.translate(x,y); U.scale(k,k);
  uRR(-14,-30,28,34,8,'#24222a',CO,1.1); uCirc(0,-40,10,'#eec4a4',CO,1);
  if(turn>0.5){ U.fillStyle='rgba(90,64,48,0.85)'; U.beginPath(); U.arc(0,-37,9.4,0.2,Math.PI-0.2); U.fill(); uCirc(-3.4,-41,1.3,CO,null); uCirc(3.4,-41,1.3,CO,null); U.strokeStyle=CO; U.lineWidth=1; U.beginPath(); U.moveTo(-4,-46); U.lineTo(-1,-45); U.moveTo(4,-46); U.lineTo(1,-45); U.stroke(); }
  else if(turn>0.05){ uCirc(5,-40,1.2,CO,null); U.fillStyle='rgba(90,64,48,0.85)'; U.beginPath(); U.arc(4,-37,8,0.2,1.8); U.fill(); }
  U.fillStyle='#1d1b22'; U.beginPath(); U.arc(0,-42,10.6,Math.PI,0); U.lineTo(10.6,-41); U.lineTo(-10.6,-41); U.closePath(); U.fill(); uRR(-11,-45,22,5,1,'#2c2a33',CO,0.7);
  U.restore(); }
function mTotalCard(G,lines,col){ // the end card drawn over a game
  const h=26+lines.length*12, y=VH*0.32; uRR(16,y,VW-32,h,10,'rgba(24,20,34,0.95)',col||'#ffd98a',1.5);
  lines.forEach((l,i)=>txt(l,VW/2,y+9+i*12,i===0?(col||'#ffd98a'):'#f4ead8',i===0?9:7.5,'center',i===0)); }

// ---------------------------------------------------------------- the treadmill ----------------------------------------------------------------
// Tap left foot, right foot, left, right. The belt keeps getting faster; fall behind and Cam shoots off the back.
function treadGame(level){ return new Promise(resolve=>{ const L=level?1:0;
  const G={t:0,v:0.9,p:0.62,next:'left',run:false,dist:0,belt:0,ph:0,stum:0,pops:[],state:'teach',endT:0,bonus:0,fly:null,cap:'',capT:0,steps:0};
  const RAMP=L?0.11:0.07, CAP=L?99:2.9, LIMIT=L?0:30;
  const feet=()=>Math.round(G.dist*3.28), score=()=>feet()*5+G.bonus;
  const say2=(s,d)=>{ G.cap=s; G.capT=d||1.8; };
  const step=k=>{ if(G.state==='teach'){ G.state='run'; say2('',0); } if(G.state!=='run') return;
    if(k===G.next){ G.p=Math.min(0.93,G.p+0.048+0.011*Math.min(G.v,4.5)); G.next=k==='left'?'right':'left'; G.ph+=Math.PI; G.steps++; blip(k==='left'?170:210,0.04,0.05,'triangle'); buzz(5); }
    else { G.p-=0.03; G.stum=0.3; blip(110,0.08,0.05,'sawtooth'); G.pops.push({s:'Other foot!',x:VW/2,y:VH*0.3,t:0,c:'#ffb0a0'}); } };
  say2(L?'Faster this time. Left, right, left, right!':'Tap LEFT foot, RIGHT foot, LEFT, RIGHT. Keep up with the belt!',3);
  S.mini={ full:true, G,
    taps(){ return [{x:0,y:24,w:VW/2,h:VH-24,fn(){ step('left'); }},{x:VW/2,y:24,w:VW/2,h:VH-24,fn(){ step('right'); }}]; },
    update(dt){ G.t+=dt; mPops(G,dt); if(G.capT>0) G.capT-=dt; if(G.stum>0) G.stum-=dt;
      if(hit('left')||hit('b')) step('left'); if(hit('right')||hit('a')) step('right'); hit('up'); hit('down');
      if(G.state==='run'){ G.v=Math.min(CAP,G.v+RAMP*dt); G.p-=G.v*0.085*dt; G.dist+=G.v*dt; G.belt+=G.v*dt*40;
        if(G.v>=CAP&&LIMIT===0) {} if(Math.floor(G.dist*3.28/50)!==Math.floor((G.dist-G.v*dt)*3.28/50)) G.pops.push({s:feet()+' ft!',x:VW*0.5,y:VH*0.24,t:0,c:'#bfe0ff'});
        if(LIMIT&&G.t>=LIMIT+0.01&&G.steps>0&&G.p>0.05){ G.state='stop'; G.bonus=250; G.endT=0; jingle([523,659,784,1047],0.09,'triangle',0.06); say2('Dad: Whoa whoa whoa! Okay, that\'s enough cardio for today, little dude.',3.2); }
        if(G.p<=0.02){ G.state='fly'; G.endT=0; G.fly={x:0,y:0,r:0}; noise(0.05,0.1); blip(400,0.25,0.06,'sawtooth'); setTimeout(()=>{ blip(90,0.2,0.07,'square'); S.shake=0.3; noise(0,0.3); },700); say2('',0); } }
      else if(G.state==='stop'){ G.endT+=dt; G.v=Math.max(0,G.v-dt*1.5); G.belt+=G.v*dt*40; if(G.endT>3.4){ G.state='done'; S.mini=null; resolve({score:score(),feet:feet(),flew:false}); } }
      else if(G.state==='fly'){ G.endT+=dt; G.belt+=G.v*dt*40; const k=Math.min(1,G.endT/0.75); G.fly.x=-k*VW*0.22; G.fly.y=-Math.sin(k*Math.PI)*36+k*14; G.fly.r=-k*2.6;
        if(G.endT>1.0&&!G.said){ G.said=1; say2('Dad: That\'s how you learn, little dude.',3); }
        if(G.endT>3.8){ G.state='done'; S.mini=null; resolve({score:score(),feet:feet(),flew:true}); } } },
    draw(){ const W=VW,Hh=VH, k=Math.min(1.5,W/250); ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
      // storage room: block wall, metal shelving, concrete floor
      U.fillStyle='#e8e4d8'; U.fillRect(0,0,W,Hh); U.strokeStyle='#cfcabc'; U.lineWidth=0.8; for(let y=0;y<Hh*0.66;y+=11){ U.beginPath(); U.moveTo(0,y); U.lineTo(W,y); U.stroke(); for(let x=((y/11)%2)*14;x<W;x+=28){ U.beginPath(); U.moveTo(x,y); U.lineTo(x,y+11); U.stroke(); } }
      U.fillStyle='#8e8a82'; U.fillRect(0,Hh*0.66,W,Hh*0.34); U.fillStyle='#837f78'; for(let i=0;i<20;i++) U.fillRect((i*53)%W,Hh*0.7+(i*29)%(Hh*0.28),3,1);
      const sx=8, sy=Hh*0.18; for(let i=0;i<4;i++){ uRR(sx,sy+i*24,46,3,1,'#9aa0a8',CO,0.7); for(let j=0;j<3;j++) uRR(sx+3+j*14,sy+i*24-12,12,12,2,['#d84a3a','#3a78c8','#e8c040','#5aa860'][(i+j)%4],CO,0.7); } uRR(sx,sy-14,2,110,1,'#7a8088',null); uRR(sx+44,sy-14,2,110,1,'#7a8088',null);
      // the treadmill
      const x0=W*0.16, x1=W*0.86, dy=Hh*0.62; uRR(x0-6,dy,x1-x0+12,12,5,'#3a3a42',CO,1.2); U.save(); U.beginPath(); U.rect(x0,dy+1,x1-x0,6); U.clip(); U.fillStyle='#1e1e24'; U.fillRect(x0,dy+1,x1-x0,6); U.fillStyle='#34343c'; for(let x=x0-(G.belt%14);x<x1;x+=14) U.fillRect(x,dy+1,5,6); U.restore();
      uCirc(x0-3,dy+6,5,'#55555e',CO,1); uCirc(x1+3,dy+6,5,'#55555e',CO,1);
      uLimb([[x1-6,dy],[x1+8,dy-62*k]],4,'#4a4a54'); uRR(x1-14,dy-72*k,40,16,4,'#2a2a32',CO,1.2); uRR(x1-10,dy-69*k,30,9,2,'#0e1a12',null); txt(G.v.toFixed(1)+' mph',x1+5,dy-68*k,'#6af08a',6,'center',true);
      uLimb([[x1-30,dy-34*k],[x1+2,dy-46*k]],2.6,'#6a6a74');
      // Cam
      if(G.state==='fly'||(G.state==='done'&&G.fly)){ const cx=x0+(x1-x0)*0.05+G.fly.x, cy=dy+G.fly.y; camSide(cx,cy,k,0,{still:true,rot:G.fly.r,yell:true}); if(G.endT>0.75) for(let i=0;i<3;i++){ const a=S.t*4+i*2.1; txt('★',cx+Math.cos(a)*14,cy-60*k+Math.sin(a)*5,'#ffd84a',8,'center',true); } }
      else { const cx=x0+(x1-x0)*G.p, run=G.state==='run'&&G.steps>0; camSide(cx,dy,k,run?G.ph+Math.sin(G.t*6)*0.2:0,{still:!run,yell:G.v>2.4&&run,rot:G.stum>0?-0.15:0}); if(G.p<0.22&&G.state==='run'){ U.globalAlpha=0.5+0.5*Math.sin(S.t*18); txt('!',cx,dy-70*k,'#ff5040',12,'center',true); U.globalAlpha=1; } }
      // the feet buttons
      const by=Hh-46, bw=W/2-14; mFoot(8,by,bw,36,'LEFT FOOT',G.next==='left'&&G.state!=='fly',G.next==='left'&&G.state==='teach'); mFoot(W/2+6,by,bw,36,'RIGHT FOOT',G.next==='right'&&G.state!=='fly',G.next==='right'&&G.state==='teach');
      mTop('TREADMILL',score(),feet()+' ft'+(LIMIT&&G.state==='run'?'  ·  '+Math.max(0,Math.ceil(LIMIT-G.t))+'s':''));
      if(G.capT>0) mCap(G.cap,30,'#ffd98a'); mPopsDraw(G); } }; }); }

// ---------------------------------------------------------------- breakfast fling ----------------------------------------------------------------
// The power swings back and forth; tap to fling a bite off the counter. Land it in Vinny's mouth. Don't let Dad see.
function flingGame(level){ return new Promise(resolve=>{ const L=level?1:0;
  const G={t:0,pw:0,pd:1,left:10,pts:0,combo:0,catches:0,caught:0,pops:[],fly:null,vx:0.62,vt:0.62,vwait:0,face:1,chomp:0,dad:0,dadT:4+Math.random()*2,dadPhase:'back',warn:0,cap:'',capT:0,state:'go',endT:0,floor:[]};
  const say2=(s,d)=>{ G.cap=s; G.capT=d||1.6; };
  const PSPD=L?1.35:0.85, VSPD=L?0.26:0.15, TOL=L?0.045:0.07;
  const geo=()=>{ const W=VW,Hh=VH; return {W,Hh,cy:Hh*0.42,fy:Hh*0.80,hx:W*0.24,hy:Hh*0.42-16,lx0:W*0.30,lx1:W*0.95}; };
  const mouthX=()=>G.vx+(G.face>0?0.075:-0.075);
  const fling=()=>{ if(G.state!=='go'||G.fly||G.left<=0) return; const g=geo(); G.left--; const tx=(g.lx0+(g.lx1-g.lx0)*G.pw)/g.W; G.fly={x0:g.hx/g.W,tx,t:0,kind:G.left%2?'banana':'cheerio'}; blip(600,0.05,0.04,'triangle');
    if(G.dad>0.5){ G.pts=Math.max(0,G.pts-100); G.combo=0; say2('Dad: Cam! Don\'t feed the dog!',1.8); G.pops.push({s:'-100  Dad saw!',x:g.W*0.8,y:g.Hh*0.2,t:0,c:'#ff8070'}); blip(160,0.18,0.05,'sawtooth'); } };
  say2(L?'Vinny is quicker this time. So is Dad.':'Tap to fling a bite to Vinny when the power is right. Don\'t do it while Dad is looking!',3.2);
  S.mini={ full:true, tapA:true, G,
    update(dt){ G.t+=dt; mPops(G,dt); if(G.capT>0) G.capT-=dt; if(G.chomp>0) G.chomp-=dt; if(hit('a')&&G.t>0.4) fling(); for(const k of ['b','left','right','up','down']) hit(k);
      if(G.state==='go'&&!G.fly){ G.pw+=G.pd*PSPD*dt; if(G.pw>1){ G.pw=1; G.pd=-1; } if(G.pw<0){ G.pw=0; G.pd=1; } }
      // Vinny paces the kitchen floor, nose up
      if(G.vwait>0) G.vwait-=dt; else { const d=G.vt-G.vx; if(Math.abs(d)<0.01){ G.vwait=0.3+Math.random()*(L?0.5:1.2); G.vt=0.36+Math.random()*0.56; } else { G.vx+=Math.sign(d)*Math.min(Math.abs(d),VSPD*dt); G.face=Math.sign(d); } }
      // Dad at the stove: mostly turned away, sometimes turns around
      G.dadT-=dt; if(G.dadPhase==='back'&&G.dadT<=0){ G.dadPhase='warn'; G.dadT=L?0.45:0.8; } else if(G.dadPhase==='warn'){ G.dad=Math.min(0.4,G.dad+dt); if(G.dadT<=0){ G.dadPhase='look'; G.dadT=1.2+Math.random()*1.2; } } else if(G.dadPhase==='look'){ G.dad=Math.min(1,G.dad+dt*6); if(G.dadT<=0){ G.dadPhase='back'; G.dadT=(L?2:3.2)+Math.random()*2.5; } } else G.dad=Math.max(0,G.dad-dt*4);
      if(G.fly){ G.fly.t+=dt/0.62; if(G.fly.t>=1){ const hitM=Math.abs(G.fly.tx-mouthX())<TOL; const g=geo();
          if(hitM){ G.combo++; G.catches++; const p=100*Math.min(3,G.combo); G.pts+=p; G.chomp=0.5; blip(240,0.06,0.06,'square'); setTimeout(()=>blip(200,0.06,0.06,'square'),110); G.pops.push({s:(G.combo>1?'x'+G.combo+' ':'')+'+'+p,x:mouthX()*g.W,y:g.fy-50,t:0,c:'#ffd84a'}); if(G.catches===1) say2('Dad: Did he just... catch that?!',1.6); }
          else { G.combo=0; G.floor.push({x:G.fly.tx,kind:G.fly.kind}); G.pts+=10; G.pops.push({s:'+10 floor snack',x:G.fly.tx*g.W,y:g.fy-14,t:0,c:'#d8d0c0'}); blip(500,0.03,0.03); }
          G.fly=null; if(G.left<=0){ G.state='end'; G.endT=0; jingle([523,659,784,1047],0.09,'triangle',0.06); say2(G.catches>=5?'Dad: Okay... he caught '+G.catches+'. I stand corrected.':G.catches?'Dad: He caught '+G.catches+'. Huh.':'Dad: See? He\'s never caught one in his life.',3); } } }
      // he cleans up floor snacks on his way past
      G.floor=G.floor.filter(f=>Math.abs(f.x-mouthX())>0.03);
      if(G.state==='end'){ G.endT+=dt; if(G.endT>3.2){ S.mini=null; resolve({score:G.pts,catches:G.catches}); } } },
    draw(){ const g=geo(), W=g.W, Hh=g.Hh, k=Math.min(1.5,W/240); ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
      // kitchen: cabinets, window, the floor
      U.fillStyle='#f2ead8'; U.fillRect(0,0,W,Hh); uRR(W*0.52,Hh*0.08,W*0.3,Hh*0.16,4,'#cfe8f8','#9a7a52',2);
      for(let i=0;i<5;i++) uRR(W*0.36+i*W*0.13,Hh*0.27,W*0.12,Hh*0.11,3,'#c9945a',CO,0.9);
      U.fillStyle='#c08a56'; U.fillRect(0,g.fy,W,Hh-g.fy); U.fillStyle='#ad7a48'; for(let i=0;i<5;i++) U.fillRect(0,g.fy+6+i*12,W,1);
      // Dad at the stove (right)
      dadBust(W*0.84,Hh*0.47,k,G.dad); if(G.dadPhase==='warn'||G.dadPhase==='look') txt(G.dadPhase==='look'?'!!':'?',W*0.84,Hh*0.47-62*k,G.dadPhase==='look'?'#ff5040':'#ffd84a',11,'center',true);
      uRR(W*0.62,Hh*0.47,W*0.4,8,2,'#6a6a72',CO,1);
      // the counter and Cam on his stool
      uRR(-6,g.cy,W*0.42,12,3,'#ece6da',CO,1.2); uRR(-6,g.cy+12,W*0.4,g.fy-g.cy-12,0,'#d8cdb8',CO,1); uRR(W*0.14,g.fy-30,4,30,1,'#8a6a4a',null);
      const arm=G.fly?0.6:-0.2-G.pw*0.6; U.save(); U.translate(W*0.16,g.cy-6); U.scale(k,k); uRR(-12,-26,24,26,8,CAMV.shirt,CO,1); uLimb([[8,-20],[8+Math.cos(arm)*14,-20+Math.sin(arm)*14]],4.4,CAMV.skin); camHead(0,-38,13,{mouth:G.chomp>0?'open':(G.dad>0.5?'o':undefined),eyes:G.chomp>0?'happy':undefined,look:1}); U.restore();
      uCirc(W*0.08,g.cy-4,7,'#fff',CO,1); uCirc(W*0.08,g.cy-5,5,'#f0d070',null);
      // power meter
      if(G.state==='go'){ const mx=8, my=g.cy+20, mh=Math.min(90,g.fy-g.cy-34); uRR(mx,my,10,mh,5,'rgba(24,20,34,0.8)','#fff',1); uRR(mx+1,my+mh-(mh-2)*G.pw-1,8,(mh-2)*G.pw,4,G.pw>0.75?'#f25c54':G.pw>0.4?'#ffd84a':'#7bd95a',null);
        if(!L&&!G.fly){ const lx=g.lx0+(g.lx1-g.lx0)*G.pw; U.strokeStyle='rgba(255,255,255,0.85)'; U.setLineDash([2,3]); U.lineWidth=1.2; U.beginPath(); U.ellipse(lx,g.fy+3,8,3,0,0,7); U.stroke(); U.setLineDash([]); } }
      // floor snacks, Vinny, the bite in the air
      for(const f of G.floor) uCirc(f.x*W,g.fy+2,f.kind==='banana'?3:2.2,f.kind==='banana'?'#f6e8a0':'#e8c070',CO,0.6);
      vinnySide(G.vx*W,g.fy+4,k*1.05,G.face,{walk:G.vwait<=0,ph:G.t*9,mouth:G.chomp>0||!!G.fly,wag:true});
      if(G.fly){ const t=G.fly.t, x=(G.fly.x0+(G.fly.tx-G.fly.x0)*t)*W, y=g.hy+(g.fy-6-g.hy)*t-Math.sin(t*Math.PI)*60; if(G.fly.kind==='banana') uCirc(x,y,3.4,'#f6e8a0',CO,0.8); else { uCirc(x,y,3,'#e8c070',CO,0.8); uCirc(x,y,1,'#f2ead8',null); } }
      mTop('BREAKFAST FLING',G.pts,G.left+' bites left'); if(G.capT>0) mCap(G.cap,28,'#7bd95a'); mPopsDraw(G); } }; }); }

// ---------------------------------------------------------------- getting dressed ----------------------------------------------------------------
// Dad holds the shirt or the pants still; Cam's head, arms and legs won't stop moving. Tap when the part lines up with the hole.
function dressGame(level,outfit){ return new Promise(resolve=>{ const L=level?1:0; const col=OUTFIT_COL[outfit]||'#5a8ad0';
  const PARTS=[{p:'head',n:'Head through'},{p:'armL',n:'Left arm'},{p:'armR',n:'Right arm'},{p:'legL',n:'Left leg'},{p:'legR',n:'Right leg'}];
  const G={t:0,i:0,pt:0,pts:0,lock:0,ok:0,pops:[],cap:'',capT:0,state:'go',endT:0,perf:0,ph:Math.random()*6};
  const W1=L?3.4:2.2, TOL=L?0.2:0.32, LIM=7;
  const say2=(s,d)=>{ G.cap=s; G.capT=d||1.6; };
  const wob=()=>Math.sin(G.t*W1+G.ph)*0.85+Math.sin(G.t*W1*1.73+G.ph*2)*0.3;
  const next=()=>{ G.i++; G.pt=0; G.ph=Math.random()*6; if(G.i>=PARTS.length){ G.state='end'; G.endT=0; jingle([523,659,784,1047],0.09,'triangle',0.06); say2(G.perf>=4?'Dad: Look at that! You practically dressed yourself.':'Dad: There. Dressed. Mostly.',3); } };
  const tap=()=>{ if(G.state!=='go'||G.lock>0) return; const s=Math.abs(wob());
    if(s<TOL){ const acc=1-s/TOL, p=100+Math.round(acc*100)+Math.max(0,Math.round(60-G.pt*12)); G.pts+=p; if(acc>0.6) G.perf++; G.ok=0.5; blip(700+acc*400,0.07,0.05,'triangle'); buzz(10); G.pops.push({s:(acc>0.6?'PERFECT ':'')+'+'+p,x:VW/2,y:VH*0.3,t:0,c:acc>0.6?'#ffd84a':'#bfe0ff'}); next(); }
    else { G.pts=Math.max(0,G.pts-20); G.lock=0.45; S.shake=0.06; blip(150,0.1,0.05,'sawtooth'); say2('Dad: '+['Whoa, other way!','Hold still, little man.','Nope. Try again, dude.','Arm. ARM.'][Math.floor(Math.random()*4)],1.2); } };
  say2('Dad is holding your '+(outfit==='pj'?'jammies':'clothes')+'. Tap when your head, arm or leg lines up with the hole!',3.2);
  S.mini={ full:true, tapA:true, G,
    update(dt){ G.t+=dt; mPops(G,dt); if(G.capT>0) G.capT-=dt; if(G.lock>0) G.lock-=dt; if(G.ok>0) G.ok-=dt; if(hit('a')&&G.t>0.4) tap(); for(const k of ['b','left','right','up','down']) hit(k);
      if(G.state==='go'){ G.pt+=dt; if(G.pt>LIM){ say2('Dad: Got it. Barely.',1.4); blip(300,0.08,0.04,'triangle'); next(); } }
      else { G.endT+=dt; if(G.endT>3){ S.mini=null; resolve({score:G.pts,perf:G.perf}); } } },
    draw(){ const W=VW,Hh=VH, cx=W/2, k=Math.min(1.7,W/210), base=Hh*0.72; ctx.fillStyle='#2a2630'; ctx.fillRect(0,0,W,Hh);
      U.fillStyle='#f0e6f4'; U.fillRect(0,0,W,Hh); U.fillStyle='#e4d6ea'; for(let x=0;x<W;x+=18) U.fillRect(x,0,8,base);
      uRR(cx-90,base,180,16,4,'#ffffff',CO,1.2); uRR(cx-86,base+16,172,Hh-base,0,'#d8c0a0',CO,1);
      const P_=PARTS[Math.min(G.i,PARTS.length-1)], cur=G.state==='go'?P_.p:'', w=wob(), aligned=Math.abs(w)<TOL;
      const shirtOn=G.i>=1, armL=G.i>=2, armR=G.i>=3, legL=G.i>=4, legR=G.i>=5;
      U.save(); U.translate(cx,base); U.scale(k,k);
      const lw=cur==='legL'?w*14:0, rw=cur==='legR'?w*14:0;
      uLimb([[-6,-30],[-8+lw,-14],[-8+lw*1.3,0]],8,legL?col:CAMV.skin); uLimb([[6,-30],[8+rw,-14],[8+rw*1.3,0]],8,legR?col:CAMV.skin);
      uRR(-15,-36,30,12,5,(legL&&legR)?col:'#ffffff',CO,1);
      uRR(-14,-62,28,30,9,shirtOn?col:CAMV.skin,CO,1.1);
      const al=cur==='armL'?w*0.9:Math.sin(G.t*2)*0.15, ar=cur==='armR'?-w*0.9:-Math.sin(G.t*2)*0.15;
      uLimb([[-12,-56],[-24-Math.sin(al)*8,-48+Math.cos(al)*2],[-32-Math.sin(al)*16,-42+Math.cos(al)*8]],6,armL?col:CAMV.skin);
      uLimb([[12,-56],[24-Math.sin(ar)*8,-48+Math.cos(ar)*2],[32-Math.sin(ar)*16,-42+Math.cos(ar)*8]],6,armR?col:CAMV.skin);
      const hx=cur==='head'?w*16:Math.sin(G.t*1.5)*2; camHead(hx,-76,15,{mouth:G.ok>0?'open':G.lock>0?'grr':undefined,eyes:G.ok>0?'happy':undefined,look:w>0?1:-1});
      // what Dad is holding, fixed in place
      if(G.state==='go'){ const ring=(x,y,rx,ry)=>{ U.lineWidth=2.2; U.strokeStyle=aligned&&!L?'#7bf07a':'rgba(255,255,255,0.9)'; U.beginPath(); U.ellipse(x,y,rx,ry,0,0,7); U.stroke(); if(aligned&&!L){ U.globalAlpha=0.35; U.fillStyle='#7bf07a'; U.fill(); U.globalAlpha=1; } };
        if(cur==='head'){ uRR(-22,-112,44,22,8,col,CO,1.1); ring(0,-94,10,4); }
        else if(cur==='armL'){ ring(-30,-44,6,8); uRR(-40,-52,14,6,3,col,CO,0.8); }
        else if(cur==='armR'){ ring(30,-44,6,8); uRR(26,-52,14,6,3,col,CO,0.8); }
        else { const sx=cur==='legL'?-8:8; uRR(-18,6,36,14,4,col,CO,1); ring(sx,6,6,3); }
        if(cur.startsWith('arm')){ const sg=cur==='armL'?-1:1, hx2=sg*44, hy=-52; uLimb([[hx2+sg*2,hy-3],[hx2+sg*26,hy-70]],8,'#24222a'); uCirc(hx2,hy,6,'#eec4a4',CO,1); }
        else for(const s of [-1,1]){ const hy=cur==='head'?-104:14, hx2=s*26; uLimb([[hx2+s*3,hy+(cur==='head'?-3:3)],[hx2+s*30,hy+(cur==='head'?-60:56)]],8,'#24222a'); uCirc(hx2,hy,6,'#eec4a4',CO,1); } }
      U.restore();
      const ly=30; uRR(8,ly,W-16,24,7,'rgba(24,20,34,0.82)','#a9a0b8',1); for(let i=0;i<PARTS.length;i++){ const w2=(W-24)/PARTS.length, x=12+i*w2; uRR(x,ly+4,w2-4,16,5,i<G.i?'#7bd95a':i===G.i?'rgba(255,217,138,0.9)':'rgba(255,255,255,0.08)',null); txt(PARTS[i].n,x+(w2-4)/2,ly+8.5,i===G.i?'#2e2838':'#f4ead8',5.6,'center',true); }
      if(G.state==='go'){ const bw=W-60; uRR(30,Hh-20,bw,6,3,'rgba(24,20,34,0.4)',null); uRR(30,Hh-20,bw*(1-G.pt/LIM),6,3,'#ffd98a',null); }
      mTop('GETTING DRESSED',G.pts,''); if(G.capT>0) mCap(G.cap,58,'#3a78c8'); mPopsDraw(G); } }; }); }

// ---------------------------------------------------------------- Vinny's 3 o'clock dinner ----------------------------------------------------------------
// Upstairs, after everyone has said hi. Dad goes to the hall closet for the big gray scoop with Vinny spinning circles around him.
// Cam races Dad back to the bowl without getting bowled over, then gets Vinny to sit. Vinny inhales it.
const FEED={CLOSET:[232,190],BOWL_N:[478,166],VB:[489,150],GOAL:[468,152]};
function feedExtra(st){ // the scoop in Dad's hand, food in the south bowl
  return [{get sortY(){ return NPC.nick.y+2; }, draw(ox,oy){ if(!st.scoop) return; const n=NPC.nick, s=n.dir==='left'?-1:1, x=Math.round(n.x+s*6-ox), y=Math.round(n.y-12-oy-(st.lift||0));
      ctx.fillStyle='#2e2838'; ctx.fillRect(x-3,y-1,8,6); ctx.fillStyle='#9aa0a8'; ctx.fillRect(x-2,y,6,4); ctx.fillStyle='#c4c8cc'; ctx.fillRect(x-2,y,6,1); ctx.fillStyle='#7a8088'; ctx.fillRect(x+s*4,y+1,3,2); if(st.full){ ctx.fillStyle='#8a5a2c'; ctx.fillRect(x-1,y-1,4,2); } } },
    {sortY:162, draw(ox,oy){ const x=Math.round(503-ox), y=Math.round(139-oy); ctx.fillStyle='#5aa8e0'; ctx.fillRect(x-2,y-3,4,5); ctx.fillStyle='#bfe6ff'; ctx.fillRect(x-1,y-3,2,1);
      if(st.food>0){ const h=Math.ceil(5*st.food); ctx.fillStyle='#8a5a2c'; ctx.fillRect(x-2,y+13-h,4,h); ctx.fillStyle='#b07a40'; ctx.fillRect(x-1,y+13-h,1,1); } } }]; }
function vTwirl(v,cx,cy,a,rx,ry){ v.x=cx+Math.cos(a)*rx; v.y=cy+Math.sin(a)*ry; const t=a+Math.PI/2, dx=-Math.sin(a), dy=Math.cos(a); v.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); v.moving=true; }
async function feedVinny(opts){ opts=opts||{}; const n=NPC.nick, v=NPC.vinny, L=opts.level!=null?opts.level:mLevel('feed');
  claim(n); v.follow=false; v.path=null; v.lie=false; v.sleep=false; v.perch=null; v.visible=true; v.noBlock=true; v.ghost=true; S.vinTok=(S.vinTok||0)+1;
  const st={scoop:false,full:false,food:0,lift:0}; const ex=feedExtra(st); S.extra=(S.extra||[]).concat(ex);
  let tw=null; const twirl=(get,rx,ry,spd)=>{ tw={get,rx,ry,spd,a:Math.atan2(v.y-get()[1],v.x-get()[0])}; };
  const twTick=setInterval(()=>{ if(!tw) return; tw.a+=tw.spd*0.03*(TS||1); const [cx,cy]=tw.get(); vTwirl(v,cx,cy,tw.a,tw.rx,tw.ry); if(Math.random()<0.04) blip(500+Math.random()*300,0.03,0.03,'triangle'); },30);
  try{
    n.dir=faceTo(n,P); await say('Dad','Oh, it\'s time to feed Vinny!');
    bubble(v,'!!!',1200); jingle([660,880,1100],0.06,'square',0.04); S.camFocus=n;
    twirl(()=>[n.x,n.y+4],15,8,6); await wait(1300);
    // to the hall closet; Cam tags along behind
    { const p=findPath(n.x,n.y,...FEED.CLOSET)||[FEED.CLOSET]; const q=findPath(P.x,P.y,FEED.CLOSET[0]+22,FEED.CLOSET[1]+2)||[[FEED.CLOSET[0]+22,FEED.CLOSET[1]+2]];
      walk(P,q,40); await walk(n,p,46); }
    n.dir='up'; await wait(300); blip(200,0.1,0.05,'triangle'); bubble(n,'*opens the closet*',1100); await wait(900);
    st.scoop=true; for(let i=0;i<3;i++){ noise(0.05,0.05); blip(140+i*30,0.06,0.05,'square'); await wait(220); } noise(0,0.2); st.full=true; bubble(n,'*scoop*',900); await wait(800);
    n.dir='right'; S.camFocus=null; if(Math.hypot(P.x-FEED.CLOSET[0]-22,P.y-FEED.CLOSET[1]-2)>6){ P.path=null; P.x=FEED.CLOSET[0]+22; P.y=FEED.CLOSET[1]+2; } P.dir='right';
    await say('Dad','Wanna help, little man? Race me to Vinny\'s bowl. Watch out for the tornado.');
    // ---- the race ----
    const nPath=findPath(n.x,n.y,...FEED.BOWL_N)||[FEED.BOWL_N]; let nDone=false;
    walk(n,nPath,L?46:36).then(()=>{ nDone=true; n.dir='up'; });
    twirl(()=>[n.x,n.y+3],L?20:16,L?11:9,L?8.5:6);
    const R=await msFree({ id:'feedrace', bumps:0, cool:0, beat:false,
      tick(dt){ const m=this; m.t+=dt; if(m.cool>0) m.cool-=dt;
        if(m.cool<=0&&!P.sit&&Math.hypot(v.x-P.x,v.y-P.y)<(L?11:9)){ m.bumps++; m.cool=1.2; P.sit=0.8; P.fallDir=v.x<P.x?1:-1; S.shake=0.14; bubble(P,'Oof!',800); blip(160,0.1,0.06,'square'); }
        if(Math.hypot(P.x-FEED.GOAL[0],P.y-FEED.GOAL[1])<20){ m.beat=!nDone; return m.done(m); }
        if(m.t>40) return m.done(m); },
      hud(){ const m=this; msPill('To the bowl!  '+m.t.toFixed(1)+'s'+(m.bumps?'  ·  bonked '+m.bumps:''),'#ffd98a'); } });
    tw=null; while(!nDone) await wait(60); n.dir='up';
    let pts=Math.max(60,520-Math.round(Math.max(0,R.t-6)*22)-R.bumps*90)+(R.beat?150:0);
    if(R.beat){ bubble(P,'Me first!',1100); await say('Dad','You beat me! Fast feet.'); } else await say('Dad','There you are, little dude.');
    // ---- sit ----
    v.x=FEED.VB[0]-6; v.y=FEED.VB[1]+8; twirl(()=>[FEED.VB[0]-8,FEED.VB[1]+6],7,4,L?9:7);
    await say('Dad','Okay. He has to sit first. You tell him!');
    const sit=await new Promise(res=>{ const Gs={t:0,tries:0,r:1,win:0,res:null,msg:'',msgT:0}; const PER=L?1.05:1.4, WIN=L?0.1:0.16;
      const tryIt=()=>{ if(Gs.res) return; const off=Math.abs(Gs.r); bubble(P,'Sit!',800); blip(880,0.06,0.05,'triangle');
        if(off<WIN){ Gs.res=off<WIN*0.45?'perfect':'good'; tw=null; v.dir='right'; v.moving=false; jingle([659,784,1047],0.07,'triangle',0.05); setTimeout(()=>{ S.mini=null; res({q:Gs.res,tries:Gs.tries+1}); },700); }
        else { Gs.tries++; Gs.msg=Gs.r>0?'Too early!':'Too late!'; Gs.msgT=0.9; blip(200,0.1,0.04,'sawtooth'); bubble(v,'*spins*',700); if(Gs.tries>=3){ Gs.res='dad'; tw=null; setTimeout(()=>{ S.mini=null; res({q:'dad',tries:3}); },500); } } };
      S.mini={ tapA:true, update(dt){ Gs.t+=dt; if(Gs.msgT>0) Gs.msgT-=dt; if(!Gs.res){ Gs.r=1-((Gs.t%PER)/PER)*2; } if(hit('a')&&Gs.t>0.3) tryIt(); for(const k of ['b','left','right','up','down']) hit(k); },
        draw(){ const sx=v.x-S.cam.x, sy=v.y-8-S.cam.y, R0=9; U.strokeStyle='rgba(255,255,255,0.9)'; U.lineWidth=1.5; U.beginPath(); U.arc(sx,sy,R0,0,7); U.stroke();
          if(!Gs.res){ const rr=R0+Math.max(0,Gs.r)*26+Math.min(0,Gs.r)*6; U.strokeStyle=Math.abs(Gs.r)<WIN?'#7bf07a':'#ffd84a'; U.lineWidth=2.4; U.beginPath(); U.arc(sx,sy,Math.max(2,rr),0,7); U.stroke(); }
          msPill(Gs.res?(Gs.res==='dad'?'Dad: SIT.':Gs.res==='perfect'?'PERFECT SIT!':'Good sit!'):'Tap when the ring hits Vinny  ·  try '+(Gs.tries+1)+' of 3','#7bf07a'); if(Gs.msgT>0) txt(Gs.msg,VW/2,54,'#ffb0a0',8,'center',true); } }; });
    tw=null; v.moving=false; v.x=FEED.VB[0]-8; v.y=FEED.VB[1]+4; v.dir='right';
    if(sit.q==='dad'){ await say('Dad','Vinny. SIT.'); bubble(v,'*sits*',900); await wait(700); }
    else { bubble(v,'*sits*',900); await wait(500); await say('Dad',sit.q==='perfect'?'Look at that! He listens to you better than me.':'Good job, little man!'); }
    pts+=sit.q==='perfect'?400:sit.q==='good'?Math.max(100,300-80*(sit.tries-1)):0;
    // ---- dinner ----
    n.dir='right'; st.lift=3; await wait(250); for(let i=0;i<4;i++){ blip(500-i*40,0.04,0.04,'square'); await wait(90); } st.full=false; st.scoop=false; st.lift=0; st.food=1; bubble(n,'*pour*',800); await wait(500);
    await say('Dad','Okay... go ahead.');
    const eatT=(sit.q==='perfect'?1.8:2.3)+Math.random()*1.4; v.x=FEED.VB[0]-4; v.dir='right'; bubble(v,'*CHOMP CHOMP CHOMP*',Math.round(eatT*1000)); let et=0;
    while(et<eatT){ await wait(120); et+=0.12*(TS||1); st.food=Math.max(0,1-et/eatT); if(Math.random()<0.6) blip(180+Math.random()*80,0.04,0.05,'square'); }
    st.food=0; bubble(v,'*licks the bowl*',1200); await wait(900);
    S.tip={txt:'Gone in '+eatT.toFixed(1)+' seconds.',until:S.t+3}; await say('Dad','Gone in '+eatT.toFixed(1)+' seconds. New record?');
    for(let i=0;i<6;i++){ v.dir=['down','left','up','right'][i%4]; await wait(110); } bubble(v,'*happy wiggle*',1000);
    mPlayed('feed'); best('feed',pts); if(sit.q==='perfect') award('sitboy');
    await showBoard('feed','FEEDING TIME',pts,sit.q==='perfect'?'perfect sit':'');
    return {score:pts,sit:sit.q};
  } finally { clearInterval(twTick); tw=null; v.noBlock=false; v.ghost=false; v.moving=false; S.camFocus=null; S.extra=(S.extra||[]).filter(e=>!ex.includes(e)); S.mini=null; }
}
// the feeding game on its own, from the mini-games screen
async function feedArcade(){ const n=NPC.nick, v=NPC.vinny; setMap('house'); S.chapter=6; S.clock='3:00 PM'; S.light='day'; S.extra=[]; S.goal=''; S.targets=[]; S.bounds=null; S.noCollide=false; hidden.add('sliderOpen'); hidden.delete('slider');
  for(const k in NPC) NPC[k].visible=false; P.visible=true; P.x=tx(25); P.y=ty(8)+2; P.dir='right'; P.sit=0; P.lift=0; P.carry=null;
  n.visible=true; n.x=394; n.y=162; n.dir='left'; n.seated=false; n.onCouch=false; v.visible=true; v.x=410; v.y=176; v.dir='left'; v.lie=false; v.sleep=false;
  S.snapCam=true; S.cut=true; await fadeTo(0,300); await feedVinny(); await fadeTo(1,250); S.cut=true; }
