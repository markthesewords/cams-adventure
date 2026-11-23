# Click-free clip cutting:
#  1. move each edge to the quietest 10 ms window within +/-60 ms (cut in the gap between sounds, not mid-word)
#  2. snap that edge to the nearest zero crossing
#  3. remove DC offset, then S-curve (raised-cosine) fades: 12 ms in, 35 ms out
import numpy as np, soundfile as sf, subprocess, io
_cache={}
def load(path):
    if path not in _cache:
        y,sr=sf.read(path,dtype='float32')
        if y.ndim>1: y=y.mean(1)
        _cache.clear(); _cache[path]=(y,sr)
    return _cache[path]
def quiet_edge(y,sr,t,search=0.06,win=0.010):
    c=int(t*sr); r=int(search*sr); w=max(1,int(win*sr))
    a=max(0,c-r); b=min(len(y)-w,c+r)
    if b<=a: return c
    e=np.convolve(y[a:b+w]**2,np.ones(w),'valid')[:b-a]
    return a+int(np.argmin(e))+w//2
def zero_cross(y,i,look=0.004,sr=44100):
    r=int(look*sr); a=max(1,i-r); b=min(len(y)-1,i+r)
    seg=y[a:b]; z=np.where(np.signbit(seg[:-1])!=np.signbit(seg[1:]))[0]
    return a+int(z[np.argmin(abs(z-(i-a)))]) if len(z) else i
def cut(path,s,e,out,fin=0.012,fout=0.035,br='80k'):
    y,sr=load(path)
    i=zero_cross(y,quiet_edge(y,sr,s),sr=sr); j=zero_cross(y,quiet_edge(y,sr,e),sr=sr)
    if j-i<int(0.15*sr): i,j=int(s*sr),int(e*sr)
    x=y[i:j].astype(np.float64); x-=x.mean()
    n1=min(int(fin*sr),len(x)//4); n2=min(int(fout*sr),len(x)//3)
    if n1>1: x[:n1]*=0.5-0.5*np.cos(np.linspace(0,np.pi,n1))
    if n2>1: x[-n2:]*=0.5+0.5*np.cos(np.linspace(0,np.pi,n2))
    x[0]=0; x[-1]=0
    buf=io.BytesIO(); sf.write(buf,x.astype(np.float32),sr,format='WAV'); 
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','wav','-i','pipe:0','-ac','1','-b:a',br,out],input=buf.getvalue(),check=True)
    return (j-i)/sr
