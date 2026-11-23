// ---------------- background music ----------------
// one looping track per area or mini game; it crossfades on a change and sits back
// while the story is talking, then comes up again when Cam can be played.
const MZ={cur:null,src:null,g:null,buf:{},over:null,vol:0.30};
function musBuf(id){ if(!AC||!MUSIC[id]) return null; const b=MZ.buf[id]; if(b) return b==='loading'?null:b;
  MZ.buf[id]='loading'; const s=atob(MUSIC[id]), a=new Uint8Array(s.length); for(let i=0;i<s.length;i++) a[i]=s.charCodeAt(i);
  AC.decodeAudioData(a.buffer).then(x=>{ MZ.buf[id]=x; }).catch(()=>{ MZ.buf[id]=null; }); return null; }
function musWant(){ if(typeof S==='undefined') return null; if(S.title) return 'title'; if(DM.on||DR.on) return null;
  if(MZ.over!==null) return MZ.over||null;
  if(S.map==='park') return 'park'; if(S.map==='bsmt') return 'bsmt'; if(S.map==='yard') return 'yard';
  if(!(S.flags&&S.flags.amMusic)&&clockHours()<7.2) return null;      // nothing in the dark before the diaper change
  return clockHours()<12.5?'house_am':'house_pm'; }
function musLevel(){ if(muted) return 0; const m=uiMode(); return MZ.vol*((m==='walk'||m==='mini'||S.title||MZ.over)?1:0.32); }
function musStop(ms){ if(!MZ.src) return; const s=MZ.src, g=MZ.g, t=AC.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value,t); g.gain.linearRampToValueAtTime(0,t+ms/1000); setTimeout(()=>{ try{ s.stop(); }catch(e){} g.disconnect(); },ms+80); MZ.src=null; MZ.g=null; MZ.cur=null; }
function musTick(){ if(!AC) return; const w=musWant();
  if(w!==MZ.cur){ if(w){ const b=musBuf(w); if(!b) return; musStop(1400); const s=AC.createBufferSource(), g=AC.createGain(); s.buffer=b; s.loop=true; g.gain.value=0; s.connect(g); g.connect(AC.destination); s.start(); MZ.src=s; MZ.g=g; MZ.cur=w; } else { musStop(1600); return; } }
  if(MZ.g) MZ.g.gain.setTargetAtTime(musLevel(),AC.currentTime,0.45); }
setInterval(musTick,150);
// mini games and outings choose their own track ('' = quiet, for the games that make their own music)
function musWrap(name,id){ const f=window[name]; if(typeof f!=='function') return; window[name]=function(...a){ const prev=MZ.over; MZ.over=id; let r; try{ r=f.apply(this,a); }catch(e){ MZ.over=prev; throw e; } Promise.resolve(r).finally(()=>{ if(MZ.over===id) MZ.over=prev; }); return r; }; }
[['treadGame','tread'],['flingGame','fling'],['dressGame','dress'],['feedVinny','feed'],['cubeTour','cube'],['bedJump','bed'],['slideBig','slides'],['slideCurly','slides'],
 ['walkCore','walk'],['cubCore','cub'],['djGame',''],['guitarPlay',''],['drumGame',''],['couchDream','']].forEach(([n,id])=>musWrap(n,id));
// the dream previews start mini games and drop them without finishing, so let go of their tracks after
(function(){ const f=window.dreams; if(typeof f!=='function') return; window.dreams=async function(...a){ try{ return await f.apply(this,a); } finally { MZ.over=null; } }; })();
