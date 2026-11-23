# packs the chosen background tracks into build/music.js (base64 mp3, mono 24 kHz 40 kbps, max 100 s)
import json, os, subprocess, base64
R=os.path.dirname(os.path.abspath(__file__))+'/..'
picks=json.load(open(R+'/music/picks.json'))
out={}
for slot,f in picks.items():
    if not f: continue
    src=R+'/music/'+f; dst='/tmp/mus_'+slot+'.mp3'
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',src],capture_output=True,text=True).stdout)
    L=min(dur,90.0)
    subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-t',str(L),'-i',src,'-af',f'afade=t=in:d=0.05,afade=t=out:st={L-2.5:.2f}:d=2.5','-ac','1','-ar','24000','-b:a','32k',dst],check=True)
    out[slot]=base64.b64encode(open(dst,'rb').read()).decode()
open(R+'/build/music.js','w').write('const MUSIC='+json.dumps(out)+';\n')
print(len(out),'tracks',sum(len(v) for v in out.values())//1024,'KB b64')
