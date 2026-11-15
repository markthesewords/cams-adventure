# Builds drum charts for the three songs from the audio itself: beat grid from beat tracking, then kick / snare / cymbal
# hits read off the percussive part of the recording in three frequency bands, snapped to 16th notes.
import librosa, numpy as np, json, sys
SONGS=[('sunny','Sunny Days','sunny.wav',{}),('shine','Shine','shine.wav',{'halve':1}),('brother','Just Like My Brother','brother.wav',{'bpm':165,'halve':1})]
DEBUG='--debug' in sys.argv
out=[]
for sid,name,fn,cfg in SONGS:
    y,sr=librosa.load('/home/claude/game/audio/'+fn,sr=22050); dur=len(y)/sr
    yh,yp=librosa.effects.hpss(y,margin=2.0)
    hop=256; S=np.abs(librosa.stft(yp,n_fft=1024,hop_length=hop)); f=librosa.fft_frequencies(sr=sr,n_fft=1024)
    def env(lo,hi):
        b=S[(f>=lo)&(f<hi)].sum(0); d=np.maximum(0,np.diff(np.log1p(b*8),prepend=0)); return d
    eL,eS1,eS2,eH=env(30,130),env(150,380),env(1800,6000),env(7000,11000)
    eS=np.sqrt(eS1*eS2+1e-9)
    oenv=librosa.onset.onset_strength(y=yp,sr=sr,hop_length=hop)
    tempo,beats=librosa.beat.beat_track(onset_envelope=oenv,sr=sr,hop_length=hop,units='time',tightness=120,**({'start_bpm':cfg['bpm']} if 'bpm' in cfg else {}))
    tempo=float(np.atleast_1d(tempo)[0]); beats=np.array(beats)
    if len(beats)<8: print(sid,'too few beats'); continue
    if cfg.get('halve'):   # the tracker locked onto eighth notes: keep every other one, on the side where the hits are stronger
        st=lambda t,e:float(e[max(0,int(round((t-0.04)*sr/hop))):int(round((t+0.04)*sr/hop))+1].max())
        sc=[np.mean([st(t,eL)+st(t,eS) for t in beats[ph::2]]) for ph in (0,1)]; beats=beats[int(np.argmax(sc))::2]
    # extend the grid to the start and end of the track
    per=np.median(np.diff(beats)); pre=[]; t=beats[0]-per
    while t>0.05: pre.append(t); t-=per
    post=[]; t=beats[-1]+per
    while t<dur-0.3: post.append(t); t+=per
    beats=np.array(pre[::-1]+list(beats)+post)
    # 16th-note slots
    slots=[]
    for i in range(len(beats)-1):
        for k in range(4): slots.append((beats[i]+(beats[i+1]-beats[i])*k/4,i,k))
    fr=lambda t:int(round(t*sr/hop))
    def strength(e,t,w=0.04):
        a,b=max(0,fr(t-w)),min(len(e),fr(t+w)+1); return float(e[a:b].max()) if b>a else 0.0
    A=np.array([[strength(eL,t),strength(eS,t),strength(eH,t),strength(oenv,t)] for t,_,_ in slots])
    nz=lambda c:np.percentile(A[:,c][A[:,c]>0],90) if (A[:,c]>0).any() else 1
    A=A/np.array([nz(0),nz(1),nz(2),nz(3)])
    L,Sn,H,O=A[:,0],A[:,1],A[:,2],A[:,3]
    onbeat=np.array([k==0 for _,_,k in slots]); bi=np.array([i for _,i,_ in slots])
    if DEBUG: print(sid,'bpm',round(60/per,1),'k-slot L:',[round(float(L[np.array([kk==q for _,_,kk in slots])].mean()),2) for q in range(4)],' Sn:',[round(float(Sn[np.array([kk==q for _,_,kk in slots])].mean()),2) for q in range(4)],' beat mod2 L:',[round(float(L[onbeat&(bi%2==q)].mean()),2) for q in range(2)],' Sn:',[round(float(Sn[onbeat&(bi%2==q)].mean()),2) for q in range(2)],' mod4 L',[round(float(L[onbeat&(bi%4==q)].mean()),2) for q in range(4)],'Sn',[round(float(Sn[onbeat&(bi%4==q)].mean()),2) for q in range(4)])
    # which beats carry the backbeat (snare on 2 and 4)
    sb=[Sn[onbeat&(bi%2==p)].mean()-L[onbeat&(bi%2==p)].mean() for p in (0,1)]; back=int(np.argmax(sb))
    # loudness per beat, to find where the band is actually playing and where sections kick in
    rms=librosa.feature.rms(y=y,frame_length=2048,hop_length=hop)[0]; bl=np.array([rms[fr(beats[i]):fr(beats[i+1])+1].mean() for i in range(len(beats)-1)]); bl=bl/np.percentile(bl,90)
    pe=librosa.feature.rms(y=yp,frame_length=2048,hop_length=hop)[0]; bp=np.array([pe[fr(beats[i]):fr(beats[i+1])+1].mean() for i in range(len(beats)-1)]); bp=bp/np.percentile(bp,90)
    drums_on=np.convolve(bp,np.ones(4)/4,'same')>0.3
    crash_beats=set()
    for i in range(4,len(bl)-4):
        if i%2!=back and bl[i:i+4].mean()>1.35*bl[i-4:i].mean()+0.05 and H[np.where((bi==i)&onbeat)[0][0]]>0.5 and not any(abs(i-c)<8 for c in crash_beats): crash_beats.add(i)
    R=lambda t:round(float(t),3)
    easy=[]; med=[]; hard=[]
    kth,sth=0.55,0.6
    fast=per<0.36   # above ~165 bpm
    for j,(t,i,k) in enumerate(slots):
        if t<0.3 or t>dur-0.4: continue
        kick=L[j]>kth; snare=Sn[j]>sth and Sn[j]>L[j]*0.8; hat=H[j]>0.45
        isback=(i%2==back)
        # a fill: three or more strong snare-band hits inside one beat
        beat_slots=[q for q in range(j-k,j-k+4) if 0<=q<len(slots)]; fill=sum(1 for q in beat_slots if Sn[q]>0.75)>=3
        if k==0:
            pad='crash' if i in crash_beats else ('snare' if isback else 'kick')
            easy.append([R(t),pad])
        # medium: the beat, plus the extra kicks and snares that land on eighth notes, plus simple fills
        if k in(0,2):
            pad=None
            if k==0: pad='crash' if i in crash_beats else ('snare' if isback else 'kick')
            elif drums_on[i]:
                if fill: pad='tom' if not isback else 'floor'
                elif kick and L[j]>0.8: pad='kick'
                elif snare and Sn[j]>0.9: pad='snare'
            if pad: med.append([R(t),pad])
        # hard: what the recording does on every sixteenth, hats filling the gaps
        pad=None
        if k==0 and i in crash_beats: pad='crash'
        elif drums_on[i] or k==0:
            if fill and Sn[j]>0.6: pad=['tom','tom','floor','floor'][k] if isback else ['snare','snare','tom','tom'][k]
            elif snare and (not kick or Sn[j]>=L[j]): pad='snare'
            elif kick and (k in(0,2) or L[j]>0.95): pad='kick'
            elif k==0: pad='snare' if isback else 'kick'
            elif k==2 and hat and not fast: pad='hat'
            elif k==2 and fast and hat and H[j]>0.9: pad='hat'
        if pad and k in(1,3) and fast and pad!='snare' and not fill: pad=None   # at punk tempo only snare rolls stay on the sixteenths
        if pad: hard.append([R(t),pad])
    def stats(c): 
        from collections import Counter
        return len(c),round(len(c)/dur,2),dict(Counter(p for _,p in c))
    print(sid,'bpm',round(60/per,1),'tempo',round(tempo,1),'dur',round(dur,1),'back',back,'crashes',sorted(crash_beats)[:12],'drums_on%',round(drums_on.mean(),2))
    for nm,c in (('easy',easy),('med',med),('hard',hard)): print('  ',nm,stats(c))
    out.append(dict(id=sid,name=name,bpm=round(60/per,1),dur=round(dur,2),first=round(float(beats[0]),3),charts=dict(easy=easy,med=med,hard=hard)))
json.dump(out,open('/home/claude/game/audio/charts.json','w'),separators=(',',':'))
