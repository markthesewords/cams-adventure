import sys, json, base64, io, colorsys
sys.path.insert(0,'/home/claude/game/tools')
import numpy as np
from PIL import Image, ImageDraw
import mapdef as M, picks as P
T=16
RB='/home/claude/packs/14_limezu_modern_interiors/moderninteriors-win/1_Interiors/16x16/Room_Builder_subfiles/'
FL=Image.open(RB+'Room_Builder_Floors_16x16.png').convert('RGBA')
WL=Image.open(RB+'Room_Builder_Walls_16x16.png').convert('RGBA')
def tl(sheet,c,r): return sheet.crop((c*T,r*T,c*T+T,r*T+T))
W,H=M.W,M.H; g=M.g; room=M.room
OUT=(46,40,56,255); WHITE=(246,244,240,255)
base=Image.new('RGBA',(W*T,H*T),(24,22,30,255)); d=ImageDraw.Draw(base)
for y in range(H):
    for x in range(W):
        ch=g[y,x]; r=room[y,x]
        if ch=='.':
            fc,fr=M.FLOORS.get(r,M.HARD)
            if r in('kitchen',) and y>=10: fc,fr=M.HARD
            t_=tl(FL,fc+(x%3),fr+(y%2))
            if (fc,fr)==M.HARD:
                a_=np.array(t_).astype(float); a_[:,:,:3]=np.clip(a_[:,:,:3]*[1.04,0.76,0.62],0,255); t_=Image.fromarray(a_.astype('uint8'))
            if r=='office':
                rs=np.random.RandomState(x*131+y*17); a_=np.zeros((T,T,4),'uint8'); a_[:,:]=(198,188,172,255)
                m_=rs.rand(T,T); a_[m_>0.86,:3]=(186,176,160); a_[m_<0.10,:3]=(208,198,182); t_=Image.fromarray(a_)
            base.alpha_composite(t_,(x*T,y*T))
        elif ch=='f':
            wc,wr=M.WALLS.get(r,(1,6)); top=(g[y-1,x]=='#')
            base.alpha_composite(tl(WL,wc,wr+(0 if top else 1)),(x*T,y*T))
def isw(x,y): return 0<=x<W and 0<=y<H and g[y,x]=='#'
for y in range(H):
    for x in range(W):
        if g[y,x]!='#': continue
        d.rectangle([x*T,y*T,x*T+T-1,y*T+T-1],fill=WHITE)
for y in range(H):
    for x in range(W):
        if g[y,x]!='#': continue
        if not isw(x,y-1) and y>0: d.line([(x*T,y*T),(x*T+T-1,y*T)],fill=OUT,width=2)
        if not isw(x,y+1) and y<H-1: d.line([(x*T,y*T+T-2),(x*T+T-1,y*T+T-2)],fill=OUT,width=2)
        if not isw(x-1,y) and x>0: d.line([(x*T,y*T),(x*T,y*T+T-1)],fill=OUT,width=2)
        if not isw(x+1,y) and x<W-1: d.line([(x*T+T-2,y*T),(x*T+T-2,y*T+T-1)],fill=OUT,width=2)
d.rectangle([0,0,W*T-1,H*T-1],outline=OUT,width=2)
sh=Image.new('RGBA',base.size,(0,0,0,0)); sd=ImageDraw.Draw(sh)
for y in range(1,H):
    for x in range(W):
        if g[y,x]=='.' and g[y-1,x] in '#f': sd.rectangle([x*T,y*T,x*T+T-1,y*T+3],fill=(0,0,0,50))
        if g[y,x]=='.' and x>0 and g[y,x-1]=='#': sd.rectangle([x*T,y*T,x*T+2,y*T+T-1],fill=(0,0,0,35))
base.alpha_composite(sh); d=ImageDraw.Draw(base)
# ---- things drawn on wall tops (side walls / south walls) ----
GLASS=(150,205,235,255); FRAME=(250,250,250,255); DOORC=(196,150,98,255); DOORD=(150,108,66,255)
def side_win(col,r0,r1,side):   # window on a west/east wall, seen from above
    x=col*T+(T-7 if side=='e' else 2); y0=r0*T+3; y1=(r1+1)*T-4
    d.rectangle([x,y0,x+4,y1],fill=FRAME,outline=OUT); d.rectangle([x+1,y0+2,x+3,y1-2],fill=GLASS)
    d.line([(x+1,(y0+y1)//2),(x+3,(y0+y1)//2)],fill=FRAME)
def south_win(c0,c1,row,bay=False):
    x0=c0*T+3; x1=(c1+1)*T-4; y=row*T+2
    d.rectangle([x0,y,x1,y+(6 if bay else 4)],fill=FRAME,outline=OUT); d.rectangle([x0+2,y+1,x1-2,y+(5 if bay else 3)],fill=GLASS)
    for xx in range(x0+ (x1-x0)//3, x1-4, max(8,(x1-x0)//3)): d.line([(xx,y+1),(xx,y+(5 if bay else 3))],fill=FRAME)
def side_door(col,row,side,h=14):
    x=col*T+(T-6 if side=='e' else 1); y=row*T+1
    d.rectangle([x,y,x+4,y+h-1],fill=DOORC,outline=OUT); d.line([(x+2,y+2),(x+2,y+h-3)],fill=DOORD); d.point((x+(1 if side=='e' else 3),y+h//2),fill=(250,220,120,255))
def south_door(col,row,color=DOORC):
    x=col*T+1; y=row*T+1
    d.rectangle([x,y,x+13,y+5],fill=color,outline=OUT); d.point((x+11,y+3),fill=(250,220,120,255))
def paint_edge(cells,side,col):
    for (cx,cy) in cells:
        if side=='e': d.rectangle([cx*T+T-5,cy*T,cx*T+T-3,cy*T+T-1],fill=col)
        if side=='n': d.rectangle([cx*T,cy*T+2,cx*T+T-1,cy*T+4],fill=col)
TEAL=(72,132,152,255)
paint_edge([(0,y) for y in range(1,9)],'e',TEAL); paint_edge([(x,9) for x in range(1,7)],'n',TEAL)   # Cam's teal west + south walls
side_win(0,5,6,'e')                     # Cam west window
side_door(8,7,'w',h=28)                 # Cam's closet (east wall)
side_door(6,12,'e',h=28)                # hall closet at west end
side_win(0,19,21,'e')                   # bedroom west window (behind headboard)
south_win(3,5,25)                       # bedroom south window
south_win(11,13,25)                     # office south window
side_door(15,17,'w',h=14)               # office closet
south_win(21,27,25,bay=True)            # living bay window
south_door(18,25,color=(240,238,232,255)) # front door
# ---------- objects ----------
OBJ=[]
def add(id,img,px,py,solid='auto',layer='obj',flat=False,fh=None,**kw):
    o=dict(id=id,img=img,x=int(px),y=int(py),w=img.width,h=img.height,layer=('flat' if flat else layer),**kw)
    o['sortY']=int(py+img.height)
    if solid=='auto':
        f=fh if fh is not None else (img.height-6 if img.height<=22 else 14)
        f=min(f,img.height); o['solid']=[int(px)+1,int(py+img.height-f),img.width-2,f]
    else: o['solid']=solid
    OBJ.append(o); return o
def put(id,name,tx,ty,dx=0,dy=0,img=None,**kw):
    im=img if img is not None else P.crop(name)
    return add(id,im,tx*T+dx,(ty+1)*T-im.height+dy,**kw)
def S(k,rect): return P.sheet(k).crop(tuple(rect))
def trim(im):
    a=np.array(im)[:,:,3]>0; ys,xs=np.where(a); return im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
BEDS=P.sheet('BED'); KIS=P.sheet('KI'); LRS=P.sheet('LR')
def tiles(sheet,c,r,w=1,h=1): return sheet.crop((c*T,r*T,(c+w)*T,(r+h)*T))
mirror=lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)
def stretch(im,axis,a,b,add):
    """repeat band [a,b) along axis ('x'/'y') to add `add` px"""
    arr=np.array(im); ax=1 if axis=='x' else 0
    band=np.take(arr,range(a,b),axis=ax); reps=[]; n=0
    while n<add:
        take=min(b-a,add-n); reps.append(np.take(band,range(take),axis=ax)); n+=take
    parts=[np.take(arr,range(0,b),axis=ax)]+reps+[np.take(arr,range(b,arr.shape[ax]),axis=ax)]
    return Image.fromarray(np.concatenate(parts,axis=ax))
def recolor(im,pred,rgb,keep=0.0):
    """pixels where pred(h,s,v) -> rgb scaled by original value"""
    a=np.array(im).astype(float); out=a.copy()
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y,x,3]==0: continue
            h,s,v=colorsys.rgb_to_hsv(*(a[y,x,:3]/255))
            if pred(h,s,v):
                k=v/0.75; out[y,x,:3]=np.clip(np.array(rgb)*k,0,255)
    return Image.fromarray(out.astype('uint8'))
def blk(w,h,top,front,fh=6,lines=None):
    im=Image.new('RGBA',(w,h),(0,0,0,0)); dd=ImageDraw.Draw(im)
    dd.rectangle([0,0,w-1,h-1],fill=front,outline=OUT[:3]+(255,))
    dd.rectangle([1,1,w-2,h-1-fh],fill=top); dd.line([(1,h-1-fh),(w-2,h-1-fh)],fill=tuple(int(c*0.75) for c in front[:3])+(255,))
    dd.line([(1,1),(w-2,1)],fill=tuple(min(255,int(c*1.08)+6) for c in top[:3])+(255,))
    if lines: lines(dd)
    return im
is_wood=lambda h,s,v: (0.02<h<0.13 and s>0.3)
# ================= Cam's room =================
def crib_imgs():
    w,h=46,42; WH=(238,236,230,255); SHD=(196,194,190,255)
    full=Image.new('RGBA',(w,h),(0,0,0,0)); q=ImageDraw.Draw(full)
    q.rectangle([0,0,w-1,h-1],fill=(60,56,70,255),outline=OUT)                 # shadowed inside
    q.rectangle([1,1,w-2,10],fill=(214,222,230,255))                           # wall seen through back slats
    for x in range(3,w-2,5): q.rectangle([x,2,x+1,10],fill=WH)
    q.rectangle([1,1,w-2,2],fill=WH); q.line([(1,3),(w-2,3)],fill=SHD)
    q.rectangle([3,11,w-4,33],fill=(170,206,226,255),outline=(120,150,176,255)) # mattress + sheet
    for (a,b) in ((8,15),(20,24),(31,14),(37,27),(13,29),(26,19)): q.point((a,b),fill=(236,244,250,255)); q.point((a+1,b),fill=(236,244,250,255))
    q.rectangle([1,11,2,h-2],fill=WH); q.rectangle([w-3,11,w-2,h-2],fill=WH)
    rail=Image.new('RGBA',(w,h),(0,0,0,0)); r=ImageDraw.Draw(rail)
    r.rectangle([0,31,w-1,33],fill=WH,outline=OUT); r.rectangle([1,32,w-2,32],fill=WH)
    for x in range(3,w-2,6): r.rectangle([x-1,33,x+1,h-2],fill=OUT); r.point((x,33),fill=WH); r.line([(x,34),(x,h-3)],fill=WH)
    r.rectangle([0,h-3,w-1,h-1],fill=SHD,outline=OUT)
    r.rectangle([0,31,1,h-1],fill=WH,outline=OUT); r.rectangle([w-2,31,w-1,h-1],fill=WH,outline=OUT)
    full.alpha_composite(rail); return full,rail
crib,cribrail=crib_imgs()
add('crib',crib,18,42,solid=[18,46,46,38],interact='crib')
add('cribRail',cribrail,18,42,solid=None)
# stuffed monkey
mk=Image.new('RGBA',(11,12),(0,0,0,0)); px=mk.load()
MONK=["..oo...oo..",".oBBo.oBBo.",".oBToooTBo.","..oBBBBBo..","..oTeTeTo..","..oTTTTTo..","...oTmTo...","..oBBBBBo.o",".oBoBTBoBoo",".oo.oBo.ooB","...oBoBo.o.","...oo.oo..."]
PALM={'o':(60,40,30,255),'B':(122,80,48,255),'T':(214,176,128,255),'e':(30,20,20,255),'m':(160,90,80,255)}
for j,row in enumerate(MONK):
    for i,ch in enumerate(row):
        if ch in PALM: px[i,j]=PALM[ch]
add('monkey',mk,24,58,solid=None); OBJ[-1]['sortY']=85
put('rockchair','chair_l',5,4,dx=6,dy=-2)
put('win_cam','window',5,2,dx=4,dy=-6,solid=None,layer='wall')
art=Image.new('RGBA',(26,9),(0,0,0,0)); ad=ImageDraw.Draw(art); ad.rectangle([0,0,25,8],fill=(30,30,36,255)); ad.rectangle([1,1,24,7],fill=(230,120,90,255)); ad.rectangle([1,5,24,7],fill=(60,50,90,255))
put('lamp_cam','floorlamp',4,4,dx=3,dy=-2,img=recolor(P.crop('floorlamp'),lambda h,s,v:(h<0.05 or h>0.95) and s>0.4,(225,200,150)),fh=6)
sofa=P.crop('sofa'); arm=Image.new('RGBA',(26,sofa.height),(0,0,0,0)); arm.alpha_composite(sofa.crop((0,0,13,sofa.height)),(0,0)); arm.alpha_composite(sofa.crop((sofa.width-13,0,sofa.width,sofa.height)),(13,0))
glider=recolor(arm,lambda h,s,v: v>0.35,(92,104,112))
put('glider',None,1,6,dx=1,dy=2,img=glider,interact='glider',fh=18)
ns=blk(14,16,(244,244,246,255),(222,222,228,255),fh=9,lines=lambda dd:(dd.line([(2,9),(11,9)],fill=(170,170,180,255)),dd.line([(2,12),(11,12)],fill=(170,170,180,255)),dd.ellipse([4,1,9,5],fill=(250,250,252,255),outline=(150,150,165,255))))
put('nightstand',None,1,7,dx=1,dy=3,img=ns,interact='whitenoise')
cube=blk(14,15,(246,246,248,255),(228,228,232,255),fh=10,lines=lambda dd:[dd.rectangle([2+i*4,6,4+i*4,12],fill=c) for i,c in enumerate([(200,70,60,255),(70,130,200,255),(240,190,60,255)])])
put('books_cam',None,1,8,dx=1,dy=1,img=cube,interact='books')
put('changing',None,2,8,dx=4,dy=1,img=S('BED',[189,264,243,285]),interact='changing')
rug=P.sheet('BED').crop((209,1073,239,1103)); rug=stretch(stretch(rug,'x',10,20,34),'y',10,20,14)
rug=recolor(rug,lambda h,s,v: True,(150,152,158))
put('rug_cam',None,3,6,dx=-4,dy=6,img=rug,solid=None,flat=True)
def vsofa(h,back,col,n):
    w=24; im=Image.new('RGBA',(w,h),(0,0,0,0)); q=ImageDraw.Draw(im)
    dk=tuple(int(c*0.72) for c in col)+(255,); lt=tuple(min(255,int(c*1.18)) for c in col)+(255,); md=col+(255,)
    q.rounded_rectangle([0,0,w-1,h-1],3,fill=dk,outline=OUT)
    q.rectangle([1,1,w-2,h-6],fill=md)
    bx=(1,8) if back=='w' else (w-9,w-2)
    q.rectangle([bx[0],1,bx[1],h-6],fill=lt); q.line([(bx[1] if back=='w' else bx[0],1),(bx[1] if back=='w' else bx[0],h-6)],fill=dk)
    sx=(10,w-2) if back=='w' else (1,w-11)
    for i in range(1,n): yy=1+i*(h-6)//n; q.line([(sx[0],yy),(sx[1],yy)],fill=dk)
    q.rectangle([1,1,w-2,4],fill=lt); q.rectangle([1,h-10,w-2,h-6],fill=lt); q.line([(1,5),(w-2,5)],fill=dk); q.line([(1,h-11),(w-2,h-11)],fill=dk)
    return im
def vrun(v,n):  # stack n vertical sofa pieces into one long one
    step=v.height-10; im=Image.new('RGBA',(v.width,step*(n-1)+v.height),(0,0,0,0))
    for i in range(n): im.alpha_composite(v.crop((0,0,v.width,step)) if i<n-1 else v,(0,i*step))
    return im
futon=vsofa(62,'e',(84,94,106),3)
put('futon',None,7,6,dx=-9,dy=4,img=futon,interact='futon',fh=futon.height-6)
# ================= Bathroom =================
put('shower','shower',9,5,dx=1,dy=0,interact='shower',fh=40)
put('toilet','toilet',11,3,dx=3,dy=2,interact='toilet',fh=14)
put('win_bath','window',11,2,dx=-2,dy=-8,solid=None,layer='wall')
van=blk(14,46,(246,246,248,255),(108,112,120,255),fh=5,lines=lambda dd:(dd.ellipse([3,14,10,26],fill=(215,225,235,255),outline=(150,160,175,255)),dd.rectangle([11,18,12,21],fill=(170,175,185,255))))
put('vanity',None,12,7,dx=1,dy=0,img=van,interact='vanity',fh=44)
put('bathmat','bathmat',10,6,dx=10,dy=2,solid=None,flat=True,img=P.crop('bathmat').crop((0,0,18,15)))
# ================= Entry / basement stairs =================
put('sidedoor','door_win',14,2,dx=9,solid=None,layer='wall',interact='sidedoor')
put('mat_side','rug_small',14,3,dx=4,dy=2,solid=None,flat=True)
st=P.crop('stairs').crop((0,8,32,56))
put('stairs',None,14,8,img=st,solid=None,flat=True)
bd=Image.new('RGBA',(16,7),(0,0,0,0)); b2=ImageDraw.Draw(bd); b2.rectangle([0,0,15,6],fill=DOORC,outline=OUT); b2.line([(2,3),(12,3)],fill=DOORD); b2.point((13,3),fill=(250,220,120,255))
add('bsmtdoor',bd,14*T,5*T+8,solid=[14*T,5*T,16,16],interact='bsmtdoor')
# ================= Kitchen =================
put('win_kit','window',19,2,dx=4,dy=-6,solid=None,layer='wall')
put('win_kit2','window',20,2,dx=12,dy=-6,solid=None,layer='wall')
OAK=(206,150,92,255); CTOP=(246,246,242,255)
ctr=blk(16,17,CTOP,OAK,fh=8,lines=lambda dd:(dd.line([(8,10),(8,15)],fill=(160,110,62,255)),dd.point((6,12),fill=(60,50,50,255)),dd.point((10,12),fill=(60,50,50,255))))
ctrV=blk(16,17,CTOP,OAK,fh=3)
for x in range(17,23):
    put(f'ctrN{x}',None,x,3,img=ctr,interact='counter' if x in (19,20) else 'cabinet')
put('sink','sinkctr',19,3,dx=4,dy=-2,solid=None,interact='sink'); OBJ[-1]['sortY']+=2
put('coffee','coffeemaker',22,3,dx=1,dy=-7,solid=None,interact='coffee'); OBJ[-1]['sortY']+=2
blender=Image.new('RGBA',(7,12),(0,0,0,0)); bl=ImageDraw.Draw(blender); bl.rectangle([1,0,5,7],fill=(190,225,240,255),outline=OUT); bl.rectangle([2,3,4,6],fill=(150,110,80,255)); bl.rectangle([0,8,6,11],fill=(60,60,70,255),outline=OUT)
put('blender',None,20,3,dx=14,dy=-5,img=blender,solid=None); OBJ[-1]['sortY']+=2
barimg=blk(16,66,CTOP,OAK,fh=5)
put('bar',None,23,6,img=barimg,interact='bar',fh=64)
put('barfoot',None,22,6,dx=-2,img=blk(19,17,CTOP,OAK,fh=5),interact='bar',fh=16); OBJ[-1]['sortY']+=1
for i,y in enumerate((4,5)): put(f'stool{i}','stool',24,y,dx=2,dy=-1,interact='stool',fh=10)
for x in range(17,22):
    if x==19: continue
    put(f'ctrS{x}',None,x,8,img=ctr,interact='cabinet')
put('stove',None,19,8,img=S('KI',[128,178,144,206]),interact='stove',fh=16)
cart=blk(16,14,(226,190,130,255),(200,160,100,255),fh=6,lines=lambda dd:(dd.ellipse([9,1,13,5],fill=(235,130,40,255),outline=(150,80,20,255)),dd.rectangle([2,2,7,5],fill=(120,110,100,255))))
put('cart',None,22,8,img=cart,interact='cart')
fr=P.crop('fridge'); fr2=Image.new('RGBA',(16,34),(0,0,0,0)); fr2.alpha_composite(fr.crop((0,0,16,20)),(0,0)); fr2.alpha_composite(fr.crop((0,34,16,48)),(0,20))
put('fridge',None,16,6,img=fr2,solid=None,interact='fridge')
pan=Image.new('RGBA',(14,16),(0,0,0,0)); pd=ImageDraw.Draw(pan); pd.rectangle([0,0,13,15],fill=(70,60,56,255),outline=OUT)
for j,yy in enumerate((2,7,12)):
    pd.line([(1,yy+3),(12,yy+3)],fill=(190,160,120,255))
    for i,c in enumerate([(200,70,60,255),(240,200,80,255),(90,150,90,255),(230,230,230,255)]): pd.rectangle([2+i*3,yy,3+i*3,yy+2],fill=c if (i+j)%2 else (120,170,210,255))
put('pantry',None,16,7,dx=2,img=pan,solid=None,interact='pantry')
# ================= Dining =================
gl=Image.new('RGBA',(34,28),(0,0,0,0)); gd=ImageDraw.Draw(gl)
def slider_img(open_):
    im=Image.new('RGBA',(34,28),(0,0,0,0)); q=ImageDraw.Draw(im)
    q.rectangle([0,0,33,27],fill=(250,250,250,255),outline=OUT)
    for i,(x0,x1) in enumerate(((2,16),(17,31))):
        if open_ and i==0: q.rectangle([x0,2,x1,27],fill=(96,150,96,255)); q.rectangle([x0,18,x1,27],fill=(104,96,104,255)); continue
        q.rectangle([x0,2,x1,25],fill=(168,214,238,255),outline=(120,130,150,255))
        q.line([(x0+3,12),(x0+9,4)],fill=(235,246,252,255)); q.line([(x0+5,16),(x0+12,7)],fill=(235,246,252,255))
        q.rectangle([x0+1,19,x1-1,24],fill=(150,198,150,255))
    if open_: q.rectangle([17,2,27,25],outline=(120,130,150,255))
    q.rectangle([17 if not open_ else 27,12,18 if not open_ else 28,16],fill=(90,90,100,255))
    return im
put('slider',None,25,2,dx=-1,img=slider_img(False),solid=None,layer='wall',interact='slider')
put('sliderOpen',None,25,2,dx=-1,img=slider_img(True),solid=None,layer='wall',interact='slider')
put('mat_slider','rug_small',25,3,dx=4,dy=0,solid=None,flat=True)
tb=P.crop('table'); tb=tb.crop((4,0,34,tb.height)); tb=stretch(tb,'y',10,22,16)
tb=recolor(tb,lambda h,s,v: s>0.25 and v>0.6,(236,226,204))
put('table',None,29,7,dx=-7,dy=2,img=tb,interact='table',fh=tb.height-10)
put('chairL1','chair_l',27,5,dx=10,dy=2,fh=8); put('chairL2','chair_l',27,6,dx=10,dy=6,fh=8)
put('chairR1','chair_r',30,5,dx=8,dy=2,fh=8); put('chairR2','chair_r',30,6,dx=8,dy=6,fh=8)
wick=blk(12,30,(206,170,120,255),(170,130,86,255),fh=4,lines=lambda dd:[dd.line([(1,6+i*8),(10,6+i*8)],fill=(140,104,66,255)) for i in range(3)])
put('wicker',None,31,9,dx=3,img=wick,interact='shelves',fh=28)
# ================= Living room =================
F35={'A':'010101111101101','C':'011100100100011','D':'110101101101110','E':'111100110100111','G':'011100101101011','H':'101101111101101','I':'111010010010111','K':'101101110101101','N':'110101101101101','O':'010101101101010','P':'110101110100100','R':'110101110101101','S':'011100010001110','U':'101101101101111','V':'101101101101010',' ':'000000000000000'}
def ptext(q,x,y,s_,col):
    for ch_ in s_:
        g_=F35[ch_]
        for i_ in range(15):
            if g_[i_]=='1': q.point((x+i_%3,y+i_//3),fill=col)
        x+=4
flag=Image.new('RGBA',(60,29),(0,0,0,0)); fd=ImageDraw.Draw(flag)
GRN=(28,70,52,255); GOLD=(255,190,40,255); PUR=(82,44,138,255); WHT=(250,250,250,255)
fd.rectangle([0,0,59,28],fill=GRN,outline=OUT); fd.rectangle([30,1,58,27],fill=PUR)
fd.rectangle([1,1,58,8],fill=(34,32,42,255)); ptext(fd,5,2,'HOUSE DIVIDED',WHT)
fd.line([(1,9),(58,9)],fill=GOLD); fd.line([(30,10),(30,27)],fill=WHT)
ptext(fd,2,13,'PACKERS',GOLD); ptext(fd,32,13,'VIKINGS',GOLD)
fd.rectangle([2,21,28,22],fill=GOLD); fd.rectangle([2,24,28,25],fill=WHT); fd.rectangle([32,21,57,22],fill=WHT); fd.rectangle([32,24,57,25],fill=GOLD)
put('flag',None,19,10,dx=6,dy=14,img=flag,solid=None,layer='wall',interact='flag')
blackcab=blk(26,16,(52,50,58,255),(36,34,42,255),fh=9,lines=lambda dd:(dd.rectangle([15,0,20,5],fill=(190,215,235,255),outline=(90,110,150,255)),dd.rectangle([16,3,19,5],fill=(200,60,60,255))))
put('blackcab',None,18,12,dx=2,dy=-3,img=blackcab,interact='shelves')
def cub(dd):
    cols=[(200,70,60,255),(70,130,200,255),(214,176,128,255),(240,190,60,255),(90,150,90,255),(214,176,128,255)]
    for i in range(3):
        for j in range(2): dd.rectangle([2+j*5,3+i*13,5+j*5,12+i*13],fill=cols[i*2+j])
cubb=blk(13,46,(48,46,54,255),(34,32,40,255),fh=4,lines=cub)
put('cubbies',None,17,16,dx=1,dy=0,img=cubb,interact='cubbies',fh=44)
hooks=Image.new('RGBA',(5,30),(0,0,0,0)); hd=ImageDraw.Draw(hooks)
for i,c in enumerate([(60,160,80,255),(240,210,60,255),(60,60,70,255),(200,180,150,255)]): hd.rectangle([0,i*7,4,i*7+5],fill=c,outline=OUT)
put('hooks',None,17,22,dx=0,img=hooks,solid=None,interact='hooks')
put('doormat','doormat',17,24,dx=6,dy=2,img=P.crop('doormat').crop((0,0,30,16)).copy(),solid=None,flat=True,interact='frontdoor')
trunk=blk(22,76,(96,62,44,255),(70,44,32,255),fh=7,lines=lambda dd:[dd.line([(2,18+i*18),(19,18+i*18)],fill=(70,44,32,255)) for i in range(3)])
put('trunk',None,20,22,dx=14,dy=6,img=trunk,interact='ctable',fh=72)
GREY=(84,90,104)
sf=recolor(sofa,lambda h,s,v: v>0.3,GREY)
sfw=Image.new('RGBA',(78,sf.height),(0,0,0,0)); sfw.alpha_composite(sf.crop((0,0,40,sf.height)),(0,0)); sfw.alpha_composite(sf.crop((10,0,48,sf.height)),(40,0))
put('sofaTop',None,22,17,dx=4,dy=-4,img=sfw,interact='sofa',fh=18)
secL=vsofa(76,'w',GREY,3)
put('sofaLeft',None,22,22,dx=4,dy=6,img=secL,interact='sofa',fh=secL.height-6)
def sofa_back():
    im=Image.new('RGBA',(70,22),(0,0,0,0)); q=ImageDraw.Draw(im)
    q.rounded_rectangle([0,0,69,21],3,fill=(70,76,90,255),outline=OUT)
    q.rounded_rectangle([1,1,68,9],2,fill=(96,102,118,255)); q.line([(24,2),(24,8)],fill=(70,76,90,255)); q.line([(46,2),(46,8)],fill=(70,76,90,255))
    q.rectangle([1,10,68,11],fill=(60,66,80,255)); return im
put('sofaBot',None,22,24,dx=12,dy=-2,img=sofa_back(),interact='sofa',fh=20)
ott=blk(26,18,(170,170,178,255),(140,140,150,255),fh=6)
put('ottoman',None,27,24,dx=10,dy=-3,img=ott,interact='ottoman')
# fireplace on the east wall + hearth
hearth=Image.new('RGBA',(34,78),(0,0,0,0)); hq=ImageDraw.Draw(hearth)
hq.pieslice([0,0,67,77],90,270,fill=(226,214,186,255),outline=OUT)
for yy in range(6,76,8): hq.line([(max(2,34-int((39**2-(yy-39)**2)**0.5*0.87)),yy),(33,yy)],fill=(196,182,150,255))
for xx in range(6,34,8): hq.line([(xx,39-int((34**2-(34-xx)**2)**0.5*1.1)+2),(xx,39+int((34**2-(34-xx)**2)**0.5*1.1)-2)],fill=(196,182,150,255))
add('hearth',hearth,29*T+3,15*T+2,solid=None,flat=True)
def fpl(dd):
    for yy in range(4,80,5): dd.line([(1,yy),(11,yy)],fill=(150,150,140,255))
    dd.rectangle([0,24,8,58],fill=(40,36,40,255),outline=OUT); dd.rectangle([1,34,6,48],fill=(240,140,40,255)); dd.rectangle([2,38,5,45],fill=(255,220,90,255))
fp=blk(13,84,(120,120,112,255),(176,176,164,255),fh=82,lines=fpl)
add('fireplace',fp,31*T+3,15*T-1,solid=[31*T+3,15*T,13,84],interact='fireplace')
dogbed=Image.new('RGBA',(26,20),(0,0,0,0)); dq=ImageDraw.Draw(dogbed); dq.rounded_rectangle([0,0,25,19],5,fill=(130,134,146,255),outline=OUT); dq.rounded_rectangle([3,3,22,16],4,fill=(60,84,150,255)); 
for (a,b) in ((7,6),(14,9),(10,13),(18,5)): dq.point((a,b),fill=(240,230,200,255))
add('dogbed',dogbed,29*T+8,17*T+6,solid=None,flat=True,interact='dogbed')
put('tvstand',None,29,24,dx=4,dy=-1,img=blk(40,14,(60,58,66,255),(40,38,46,255),fh=8),interact='tv')
put('tv','tv',29,24,dx=9,dy=-9,solid=None,interact='tv'); OBJ[-1]['sortY']+=1
def spr(w,h,fn):
    im=Image.new('RGBA',(w,h),(0,0,0,0)); fn(ImageDraw.Draw(im)); return im
O3=OUT
def f_piano(q):
    q.rectangle([3,9,6,17],fill=(150,152,158,255),outline=O3); q.rectangle([17,9,20,17],fill=(150,152,158,255),outline=O3)
    q.rectangle([0,0,23,10],fill=(70,200,186,255),outline=O3); q.rectangle([2,5,13,8],fill=(250,250,250,255))
    for x in range(3,13,2): q.point((x,5),fill=(40,40,50,255)); q.point((x,6),fill=(40,40,50,255))
    q.ellipse([15,4,20,9],fill=(50,50,60,255)); q.point((17,6),fill=(240,240,240,255))
    for i,c in enumerate([(240,80,70,255),(250,210,60,255),(250,140,40,255)]): q.rectangle([3+i*4,2,5+i*4,3],fill=c)
    q.rectangle([16,1,21,2],fill=(250,250,250,255))
def f_chair_eleph(q):
    q.rectangle([1,0,12,8],fill=(176,184,192,255),outline=O3); q.rectangle([0,9,13,13],fill=(196,204,212,255),outline=O3); q.rectangle([1,14,2,16],fill=O3); q.rectangle([11,14,12,16],fill=O3)
    q.ellipse([1,3,5,9],fill=(150,150,158,255),outline=O3); q.ellipse([8,3,12,9],fill=(150,150,158,255),outline=O3); q.ellipse([3,2,10,10],fill=(170,170,178,255),outline=O3)
    q.point((5,5),fill=(20,20,30,255)); q.point((8,5),fill=(20,20,30,255)); q.line([(6,7),(6,10)],fill=(140,140,150,255)); q.line([(7,7),(7,10)],fill=(140,140,150,255))
def f_guitar(q):
    q.rectangle([12,3,25,5],fill=(40,36,44,255),outline=O3)
    for i,c in enumerate([(250,140,40,255),(170,120,220,255),(120,200,90,255),(90,180,230,255),(250,210,60,255)]): q.point((14+i*2,4),fill=c)
    q.ellipse([0,0,14,8],fill=(226,50,50,255),outline=O3); q.ellipse([2,1,6,4],fill=(250,190,40,255)); q.rectangle([8,3,11,5],fill=(250,160,170,255))
def f_fish(q):
    q.rectangle([1,3,2,17],fill=(60,150,210,255)); q.rectangle([12,3,13,17],fill=(60,150,210,255)); q.rectangle([0,0,14,3],fill=(80,190,90,255),outline=O3)
    q.rectangle([1,10,13,12],fill=(230,90,70,255)); q.rectangle([2,14,12,17],fill=(70,170,220,255),outline=O3)
    for x,c in ((3,(250,170,50,255)),(7,(60,120,220,255)),(11,(230,70,80,255))): q.rectangle([x-1,5,x,8],fill=c)
def f_cube(q):
    q.rectangle([0,7,16,20],fill=(112,128,52,255),outline=O3)
    for x in (4,8,12):
        for y in range(9,19,2): q.point((x+(y//2)%2,y),fill=(40,48,20,255))
    q.rectangle([0,4,16,7],fill=(240,226,150,255),outline=O3)
    q.arc([1,-2,8,8],180,360,fill=(250,190,40,255)); q.arc([6,-3,14,9],180,360,fill=(170,90,200,255)); q.arc([3,0,12,9],180,360,fill=(150,210,70,255))
    for (x,y,c) in ((2,3,(230,70,70,255)),(9,1,(70,150,220,255)),(13,3,(250,140,40,255)),(6,2,(250,250,250,255))): q.point((x,y),fill=c)
def f_plane(q):
    q.rectangle([0,6,23,9],fill=(248,120,150,255),outline=O3); q.ellipse([6,2,17,15],fill=(250,250,250,255),outline=O3)
    q.rectangle([8,0,15,3],fill=(160,90,190,255),outline=O3); q.rectangle([8,9,15,14],fill=(130,70,160,255),outline=O3); q.point((11,6),fill=(230,60,60,255))
def f_truck(q):
    q.rectangle([1,0,8,4],fill=(60,150,220,255),outline=O3); q.ellipse([0,3,4,7],fill=(30,30,36,255)); q.ellipse([6,3,10,7],fill=(30,30,36,255)); q.point((2,5),fill=(250,210,60,255)); q.point((8,5),fill=(250,210,60,255))
def f_books(q):
    for i,c in enumerate([(90,150,90,255),(70,110,180,255),(240,236,220,255)]): q.rectangle([i%2,6-i*3,10+i%2,8-i*3],fill=c,outline=O3)
def f_giraffe(q):
    q.ellipse([1,5,9,11],fill=(236,170,80,255),outline=O3); q.ellipse([3,0,8,6],fill=(246,226,190,255),outline=O3); q.point((4,2),fill=(20,20,30,255)); q.point((7,2),fill=(20,20,30,255))
    for (x,y) in ((3,7),(6,9),(7,6)): q.point((x,y),fill=(250,250,250,255))
    q.rectangle([1,11,3,12],fill=(90,60,40,255)); q.rectangle([7,11,9,12],fill=(90,60,40,255))
def f_cup(q): q.polygon([(1,0),(5,0),(6,6),(0,6)],fill=(250,140,40,255),outline=O3); q.point((2,3),fill=O3); q.point((4,3),fill=O3)
def ball(c): return spr(5,5,lambda q:(q.ellipse([0,0,4,4],fill=c,outline=O3),q.point((1,1),fill=(255,255,255,255))))
def f_blocks(q):
    q.rectangle([0,5,5,10],fill=(240,80,70,255),outline=O3); q.rectangle([6,5,11,10],fill=(70,130,220,255),outline=O3); q.rectangle([3,0,8,5],fill=(250,210,60,255),outline=O3)
add('toys',spr(24,18,f_piano),29*T+10,21*T+4,solid=[29*T+11,21*T+8,22,13],interact='toys')
add('kidchair',spr(14,17,f_chair_eleph),30*T+8,20*T+2,solid=[30*T+9,20*T+6,12,12],interact='elephant')
SC=[('guitar',spr(26,9,f_guitar),430,352),('fishtoy',spr(15,18,f_fish),444,296),('cube',spr(17,21,f_cube),298,322),('plane',spr(24,16,f_plane),462,222),
    ('truck',spr(11,8,f_truck),300,268),('books2',spr(12,9,f_books),352,212),('giraffe',spr(11,13,f_giraffe),420,246),('cup',spr(7,7,f_cup),392,236),
    ('blocks',spr(12,11,f_blocks),282,226),('ball1',ball((230,60,60,255)),410,302),('ball2',ball((80,190,90,255)),452,330),('ball3',ball((70,140,230,255)),398,344),
    ('ball4',ball((250,210,60,255)),336,250),('blocks2',spr(12,11,f_blocks),380,392),('truck2',spr(11,8,f_truck),470,372)]
for n,im,x,y in SC: add('sc_'+n,im,x,y,solid=None,flat=True,interact='sc_'+''.join(c for c in n if not c.isdigit()))
put('artcab',None,31,13,dx=1,dy=0,img=blk(14,26,(226,150,70,255),(190,116,48,255),fh=4),interact='shelves',fh=24)
# ================= Our bedroom =================
hb=S('BED',[48,617,96,650])
def bed(colr,w,h,frame=None):
    b=trim(hb); b=stretch(b,'x',26,34,w-b.width); b=stretch(b,'y',8,14,h-b.height)
    b=recolor(b,lambda hh,s,v: 0.5<hh<0.72 and s<0.35 and v>0.4,colr)       # blanket
    if frame: b=recolor(b,is_wood,frame)
    return b
king=bed((112,96,150),66,54,frame=(52,50,58))
put('kingbed',None,1,22,dx=2,dy=-4,img=king,interact='bigbed',fh=king.height-8)
bns=blk(13,13,(52,50,58,255),(36,34,42,255),fh=6)
put('ns1',None,1,18,dx=2,dy=0,img=bns); put('ns2',None,1,23,dx=2,dy=4,img=bns)
closet=Image.new('RGBA',(60,26),(0,0,0,0)); cq=ImageDraw.Draw(closet); cq.rectangle([0,0,59,25],fill=(214,170,110,255),outline=OUT)
for i in range(4): cq.rectangle([2+i*14,2,13+i*14,23],outline=(170,126,76,255)); cq.point((12+i*14 if i%2==0 else 3+i*14,13),fill=(250,220,120,255))
put('closet_bed',None,1,16,dx=10,dy=0,img=closet,solid=None,layer='wall',interact='closet')
mint=blk(13,30,(196,226,208,255),(160,196,176,255),fh=4,lines=lambda dd:[dd.line([(1,7+i*7),(11,7+i*7)],fill=(214,180,90,255)) for i in range(3)])
put('dresserMint',None,7,20,dx=2,dy=0,img=mint,interact='dresser',fh=28)
gfab=blk(13,38,(92,94,104,255),(66,68,78,255),fh=4,lines=lambda dd:[dd.line([(1,6+i*6),(11,6+i*6)],fill=(50,52,60,255)) for i in range(5)])
put('dresserGrey',None,7,23,dx=2,dy=2,img=gfab,interact='dresser',fh=36)
rb=recolor(stretch(P.sheet('BED').crop((209,1073,239,1103)),'x',10,20,10),lambda h,s,v:True,(160,160,164))
put('rug_bed',None,4,24,dx=-6,dy=-2,img=rb,solid=None,flat=True)
# ================= Spare room / Grace's office =================
put('desk',None,9,17,dx=4,dy=8,img=S('GE',[95,10,112,48]),interact='desk',fh=24)
filec=blk(12,14,(224,220,206,255),(190,186,172,255),fh=8)
put('filecab',None,9,19,dx=1,dy=4,img=filec)
spare=bed((126,84,170),52,34)
put('sparebed',None,9,22,dx=2,dy=0,img=spare,interact='sparebed',fh=spare.height-8)
put('ns_spare',None,9,24,dx=2,dy=-1,img=blk(13,13,(214,170,110,255),(170,126,76,255),fh=6))
mir=Image.new('RGBA',(14,10),(0,0,0,0)); mq=ImageDraw.Draw(mir); mq.rectangle([0,0,13,9],fill=(120,110,100,255),outline=OUT); mq.rectangle([2,2,11,7],fill=(200,225,235,255))
put('mirror_off',None,10,16,dx=10,dy=-8,img=mir,solid=None,layer='wall')
# ================= doors =================
DOORIMG=P.crop('door')
for k,dd_ in M.DOORS.items():
    add('door_'+k,DOORIMG,dd_['x']*T+1,dd_['y']*T+(32-DOORIMG.height),solid=[dd_['x']*T,(dd_['y']+1)*T,T,T],layer='door',door=k,interact='door_'+k)
add('linen',DOORIMG,14*T+1,10*T+(32-DOORIMG.height),solid=None,layer='wall',interact='linen')
# ---------- characters ----------
CP='/home/claude/packs/14_limezu_modern_interiors/Character Generator 2.0 Linux Build/Character Pieces/'
def comp(parts,rows,ncols):
    out=None
    for p in parts:
        im=Image.open(CP+p).convert('RGBA').crop((0,0,ncols*16,rows*32))
        out=im if out is None else Image.alpha_composite(out,im)
    return out
CHAR={}
def framebox(n_rows,ncols=24):
    return [(c,r) for r in range(n_rows) for c in range(ncols)]
def ramp(im,pred,cols):
    """recolour pixels matching pred(r,g,b) to a 3-step ramp by brightness"""
    a=np.array(im).astype(int); m=(a[:,:,3]>0)&pred(a[:,:,0],a[:,:,1],a[:,:,2])
    if not m.any(): return im
    lum=a[:,:,:3].sum(2); vals=np.unique(lum[m]); out=a.copy()
    for v in vals:
        k=0 if len(vals)==1 else (list(vals).index(v))/(len(vals)-1)
        out[m&(lum==v),:3]=cols[min(len(cols)-1,int(round(k*(len(cols)-1))))]
    return Image.fromarray(out.astype('uint8'))
def load(p,rows,ncols=24): return Image.open(CP+p).convert('RGBA').crop((0,0,ncols*16,rows*32))
SKINISH=lambda r,g,b:(r>200)&(g>130)&(b>110)
def kid_outfit(o):
    """paint an outfit from the kid_5 clothing layer: shirt / sleeves / pants / shoes + small accents"""
    src=np.array(load('Outfits_kids/16x16/Outfit_kid_5.png',4)).astype(int); out=src.copy()
    SH=[(219,237,249),(192,216,243)]; PA=[(59,122,162),(54,97,152)]; SO=[(242,178,43)]
    def is_(cols): 
        m=np.zeros(src.shape[:2],bool)
        for c in cols: m|=(src[:,:,0]==c[0])&(src[:,:,1]==c[1])&(src[:,:,2]==c[2])&(src[:,:,3]>0)
        return m
    msh,mpa,mso=is_(SH),is_(PA),is_(SO)
    lite=lambda c,k: tuple(max(0,min(255,int(v*k))) for v in c)
    for r in range(4):
        for c in range(24):
            sl=(slice(r*32,r*32+32),slice(c*16,c*16+16))
            sh=msh[sl]; pa=mpa[sl]; so=mso[sl]; blk_=out[sl]; s0=src[sl]
            ys,xs=np.where(sh)
            if len(ys)==0: continue
            py,px_=np.where(pa|so); cx=px_.mean() if len(px_) else xs.mean(); top=ys.min()
            for y,x in zip(ys,xs):
                hi=(tuple(s0[y,x,:3])==SH[0])
                col=o['shirt']
                if o.get('sleeve') and abs(x-cx)>3.2: col=o['sleeve']
                elif o.get('stripe') and (y-top)%2==1: col=o['stripe']
                elif o.get('bib') and y==top: col=o['bib']
                blk_[y,x,:3]=lite(col,1.0 if hi else 0.86)
            if o.get('chest') and not (6<=c<12 and r in (1,2)) and not (r==0 and c==1) and r!=3:
                yy=top+1 if (sh[top+1] if top+1<32 else sh[top]).any() else top
                xx=int(round(cx))
                if sh[yy,xx]: blk_[yy,xx,:3]=o['chest']
            if o.get('dots'):
                for y,x in zip(ys,xs):
                    if (x*7+y*13+c)%5==0: blk_[y,x,:3]=o['dots']
            for y,x in zip(*np.where(pa)):
                blk_[y,x,:3]=lite(o['pants'],1.0 if tuple(s0[y,x,:3])==PA[0] else 0.84)
                if o.get('dots') and (x*5+y*11+c)%4==0: blk_[y,x,:3]=o['dots']
            for y,x in zip(*np.where(so)): blk_[y,x,:3]=o['shoes']
    return Image.fromarray(out.astype('uint8'))
BLOND=[(196,158,84),(226,192,112),(244,220,150)]
def kid(o,hair='Hairstyles_kids/16x16/Hairstyle_kid_5_1.png',haircols=BLOND):
    out=load('Bodies_kids/16x16/Body_2_kid.png',4)
    out=Image.alpha_composite(out,load('Eyes_kids/16x16/Eyes_kids_1.png',4))
    out=Image.alpha_composite(out,kid_outfit(o))
    h_=ramp(load(hair,4),lambda r,g,b:(r>150)&(r-b>60),haircols)
    return Image.alpha_composite(out,h_)
GREYP=(168,168,176); JEAN=(70,92,140)
OUTFITS=[
 ('pj','Halloween jammies',dict(shirt=(44,56,104),pants=(44,56,104),shoes=(44,56,104),dots=(236,120,50))),
 ('dino','Dinosaur shirt',dict(shirt=(72,150,160),pants=GREYP,shoes=(120,124,132),dots=(40,70,110))),
 ('jacket','Puffy jacket',dict(shirt=(98,106,124),pants=(182,182,190),shoes=(150,200,70))),
 ('fuzzy','Blue fuzzy suit',dict(shirt=(40,164,236),pants=(40,164,236),shoes=(200,200,206),bib=(92,196,248))),
 ('orange','Orange Halloween tee',dict(shirt=(240,128,38),pants=(48,46,58),shoes=(236,232,220),chest=(120,200,90))),
 ('sweats','Packers sweats',dict(shirt=(172,172,180),pants=(172,172,180),shoes=(120,124,132),chest=(255,190,40),bib=(40,90,64))),
 ('bibs','Snow bibs',dict(shirt=(40,54,110),sleeve=(214,56,52),pants=(40,54,110),shoes=(110,120,150))),
 ('cozy','Cozy sweatshirt',dict(shirt=(238,236,230),sleeve=(168,168,176),pants=GREYP,shoes=(236,236,240),chest=(60,150,230))),
 ('gold','Yellow Packers tee',dict(shirt=(246,190,36),pants=(128,126,112),shoes=(120,124,132),chest=(34,84,60))),
 ('polo','Striped polo',dict(shirt=(214,50,50),stripe=(52,44,92),pants=JEAN,shoes=(236,232,220))),
 ('vikes','Vikings jersey',dict(shirt=(92,52,156),sleeve=(246,190,36),pants=(84,84,96),shoes=(120,124,132),chest=(250,250,250))),
]
for oid,_,od in OUTFITS: CHAR['cam_'+oid]=kid(od)
CHAR['emory']=kid(dict(shirt=(36,96,66),sleeve=(168,168,176),pants=JEAN,shoes=(240,170,190),chest=(255,190,40)),hair='Hairstyles_kids/16x16/Hairstyle_kid_6_1.png',haircols=[(206,170,92),(236,206,128),(248,230,166)])
def adult(shirt,pants,extra=(),chest=None,shoes=(196,124,92)):
    out=load('Bodies/16x16/Body_02.png',3); out=Image.alpha_composite(out,load('Eyes/16x16/Eyes_01.png',3))
    a=np.array(load('Outfits/16x16/Outfit_01_03.png',3)).astype(int)
    def sw(src,dst):
        m=(a[:,:,0]==src[0])&(a[:,:,1]==src[1])&(a[:,:,2]==src[2]); a[m,:3]=dst
    sw((208,190,156),shirt); sw((191,166,144),tuple(int(v*0.84) for v in shirt)); sw((106,132,147),pants); sw((90,103,117),tuple(int(v*0.82) for v in pants)); sw((196,124,92),shoes)
    if chest:
        for r in range(3):
            for c in range(24):
                if (6<=c<12 and r in (1,2)) or (r==0 and c==1): continue
                blk_=a[r*32:r*32+32,c*16:c*16+16]; m=(blk_[:,:,0]==shirt[0])&(blk_[:,:,1]==shirt[1])&(blk_[:,:,2]==shirt[2]); ys,xs=np.where(m)
                if len(ys)>3: yy=int(np.median(ys)); xx=int(np.median(xs)); blk_[yy,xx,:3]=chest; 
    out=Image.alpha_composite(out,Image.fromarray(a.astype('uint8')))
    for e in extra: out=Image.alpha_composite(out,e)
    return out
beard=ramp(load('Accessories/16x16/Accessory_13_Beard_04.png',3),lambda r,g,b:(r+g+b>250),[(104,92,88),(138,126,120),(170,160,154)])
CHAR['nick']=adult((66,64,78),(64,84,128),extra=[beard],chest=(226,140,150))
CHAR['grace']=adult((58,54,72),(84,108,156),extra=[load('Hairstyles/16x16/Hairstyle_09_03.png',3)],shoes=(236,232,224))
dog=Image.open('/home/claude/packs/dogs/Dog_Labrador_Dark_Brown_16x16.png').convert('RGBA')
dd=Image.new('RGBA',(24*48,6*32),(0,0,0,0))
for i,r in enumerate((0,2,4,6,8)): dd.alpha_composite(dog.crop((0,r*32,24*48,r*32+32)),(0,i*32))
for i,c0 in enumerate((0,12)):
    fr_=dog.crop((c0*48,2*32,c0*48+48,3*32)); arr_=np.array(fr_); al=arr_[:,:,3]>0; ys_,xs_=np.where(al); bot=ys_.max(); x0_,x1_=xs_.min(),xs_.max()
    cut=bot-6; body=arr_.copy(); body[cut:,:,:]=0
    canvas=np.zeros((32,48,4),'uint8'); off=30-cut; canvas[off:off+cut,:,:]=body[:cut]
    # colours
    op=arr_[al]; lum_=op[:,:3].sum(1); dark=tuple(int(v) for v in op[lum_.argmin()][:3])+(255,); mid=tuple(int(v) for v in np.median(op[:,:3],axis=0))+(255,)
    im_=Image.fromarray(canvas); q_=ImageDraw.Draw(im_)
    row_=np.where(al[cut-1])[0]; bx0,bx1=row_.min(),row_.max()
    facing_right=(c0==0)
    front=bx1 if facing_right else bx0; back=bx0 if facing_right else bx1; sgn=1 if facing_right else -1
    yb=off+cut-1
    for (ax,ln,dy_) in ((front-3*sgn,9,0),(front-7*sgn,7,2),(back+3*sgn,-8,1),(back+6*sgn,-6,3)):
        xa=ax; xb=ax+ln*sgn
        q_.line([(xa,yb+dy_-1),(xb,yb+dy_-1)],fill=dark); q_.line([(xa,yb+dy_+1),(xb,yb+dy_+1)],fill=dark)
        q_.line([(xa,yb+dy_),(xb-sgn,yb+dy_)],fill=mid); q_.point((xb,yb+dy_),fill=dark)
    dd.alpha_composite(im_,(i*48,5*32))
a=np.array(dd).astype(int); m=a[:,:,3]>0; lum=a[:,:,:3].sum(2)
yy,xx=np.mgrid[0:a.shape[0],0:a.shape[1]]
body=m&(lum>150)
a[body,:3]=np.clip(a[body,:3]*[0.50,0.38,0.34],0,255)
stripe=((xx+(yy%32)//2)%4==0)&body
a[stripe,:3]=np.clip(a[stripe,:3]*[1.5,1.25,1.1]+[14,2,0],0,255)
CHAR['vinny']=Image.fromarray(a.astype('uint8'))
import park as PK
pk_base,PKOBJ,pk_solid,PKW,PKH=PK.make()
exec(open('/home/claude/game/tools/bsmt_part.py').read())
exec(open('/home/claude/game/tools/yard_part.py').read())
CHAR['ryan']=adult((58,110,168),(106,106,88),extra=[ramp(load('Hairstyles/16x16/Hairstyle_01_01.png',3),lambda r,g,b:(r+g+b>60),[(64,42,26),(90,58,34),(120,82,48)])],shoes=(58,58,68))
CHAR['lizz']=adult((176,84,104),(58,62,84),extra=[ramp(load('Hairstyles/16x16/Hairstyle_05_01.png',3),lambda r,g,b:(r+g+b>60),[(150,104,50),(196,150,84),(228,192,124)])],shoes=(236,232,224))
# ---------- atlas ----------
items=[(o['id'],o['img']) for o in OBJ+PKOBJ+BOBJ+YOBJ]+[('CH_'+k,v) for k,v in CHAR.items()]
AW=1200; x=y=0; rowh=0; place={}
for k,im in sorted(items,key=lambda t:-t[1].height):
    if x+im.width>AW: x=0; y+=rowh+1; rowh=0
    place[k]=(x,y); x+=im.width+1; rowh=max(rowh,im.height)
atlas=Image.new('RGBA',(AW,y+rowh+1),(0,0,0,0))
for k,im in items: atlas.alpha_composite(im,place[k])
def b64(im):
    bio=io.BytesIO(); im.save(bio,'PNG',optimize=True); return 'data:image/png;base64,'+base64.b64encode(bio.getvalue()).decode()
solid=[[1 if g[y,x] in '#f ' else 0 for x in range(W)] for y in range(H)]
objs=[]
for o in OBJ:
    sx,sy=place[o['id']]
    e={k:o[k] for k in ('id','x','y','w','h','sortY','solid','layer')}; e.update(sx=sx,sy=sy)
    for k in ('interact','door'):
        if k in o: e[k]=o[k]
    objs.append(e)
chars={k:dict(sx=place['CH_'+k][0],sy=place['CH_'+k][1]) for k in CHAR}
data=dict(T=T,W=W,H=H,solid=solid,objs=objs,chars=chars,outfits=[[o[0],o[1],'#%02x%02x%02x'%o[2]['shirt'],'#%02x%02x%02x'%o[2]['pants'],'#%02x%02x%02x'%o[2].get('sleeve',o[2]['shirt'])] for o in OUTFITS],rooms=[[room[y,x] or '' for x in range(W)] for y in range(H)],
          doors={k:dict(x=v['x'],y=v['y'],wall=v['wall'],open=v['open']) for k,v in M.DOORS.items()})
pobjs=[]
for o in PKOBJ:
    sx,sy=place[o['id']]; e={k:o[k] for k in ('id','x','y','w','h','sortY','solid','layer')}; e.update(sx=sx,sy=sy)
    if 'interact' in o: e['interact']=o['interact']
    pobjs.append(e)
pdata=dict(T=T,W=PKW,H=PKH,solid=pk_solid,objs=pobjs,doors={})
bobjs=[]
for o in BOBJ:
    sx,sy=place[o['id']]; e={k:o[k] for k in ('id','x','y','w','h','sortY','solid','layer')}; e.update(sx=sx,sy=sy)
    for k in ('interact','door'):
        if k in o: e[k]=o[k]
    bobjs.append(e)
bdata=dict(T=T,W=BW,H=BH,solid=b_solid,objs=bobjs,doors={k:dict(x=v['x'],y=v['y'],wall=v['wall'],open=v['open']) for k,v in BDOORS.items()})
yobjs=[]
for o in YOBJ:
    sx,sy=place[o['id']]; e={k:o[k] for k in ('id','x','y','w','h','sortY','solid','layer')}; e.update(sx=sx,sy=sy)
    if 'interact' in o: e['interact']=o['interact']
    yobjs.append(e)
ydata=dict(T=T,W=YW,H=YH,solid=y_solid,objs=yobjs,doors={})
json.dump(data,open('/home/claude/game/build/data.json','w'))
open('/home/claude/game/build/assets.js','w').write('const ASSET_BASE="'+b64(base)+'";\nconst ASSET_ATLAS="'+b64(atlas)+'";\nconst ASSET_PARK="'+b64(pk_base)+'";\nconst DATA='+json.dumps(data)+';\nconst DATA_PARK='+json.dumps(pdata)+';\nconst ASSET_BSMT="'+b64(bbase)+'";\nconst DATA_BSMT='+json.dumps(bdata)+';\n'+'\nconst ASSET_YARD="'+b64(ybase)+'";\nconst DATA_YARD='+json.dumps(ydata)+';\n')
pv=base.copy()
for o in sorted(OBJ,key=lambda o:(o['layer']!='flat',o['layer']!='wall',o['sortY'] if o['layer']!='flat' else 0)):
    if o['layer']=='door' and M.DOORS[o['door']]['open']: continue
    if o['id']=='sliderOpen' or o['id'].startswith('sc_'): continue
    pv.alpha_composite(o['img'],(o['x'],o['y']))
if '--solid' in sys.argv:
    q=ImageDraw.Draw(pv,'RGBA')
    for o in OBJ:
        if o['solid']: s=o['solid']; q.rectangle([s[0],s[1],s[0]+s[2]-1,s[1]+s[3]-1],outline=(255,0,0,200))
pv.resize((pv.width*2,pv.height*2),Image.NEAREST).save('/home/claude/game/build/preview.png')
pp=pk_base.copy()
for o in sorted(PKOBJ,key=lambda o:(o['layer']!='flat',o['sortY'])): pp.alpha_composite(o['img'],(o['x'],o['y']))
pp.resize((pp.width*2,pp.height*2),Image.NEAREST).save('/home/claude/game/build/park_preview.png')
bp=bbase.copy()
for o in sorted(BOBJ,key=lambda o:(o['layer']!='flat',o['layer']!='wall',o['sortY'] if o['layer']!='flat' else 0)): bp.alpha_composite(o['img'],(o['x'],o['y']))
if '--solid' in sys.argv:
    q=ImageDraw.Draw(bp,'RGBA')
    for o in BOBJ:
        if o['solid']: s_=o['solid']; q.rectangle([s_[0],s_[1],s_[0]+s_[2]-1,s_[1]+s_[3]-1],outline=(255,0,0,200))
bp.resize((bp.width*2,bp.height*2),Image.NEAREST).save('/home/claude/game/build/bsmt_preview.png')
yp=ybase.copy()
for o in sorted(YOBJ,key=lambda o:(o['layer']!='flat',o['sortY'])):
    if o['id']!='y_sliderOpen': yp.alpha_composite(o['img'],(o['x'],o['y']))
if '--solid' in sys.argv:
    q=ImageDraw.Draw(yp,'RGBA')
    for o in YOBJ:
        if o['solid']: s_=o['solid']; q.rectangle([s_[0],s_[1],s_[0]+s_[2]-1,s_[1]+s_[3]-1],outline=(255,0,0,200))
yp.resize((yp.width*2,yp.height*2),Image.NEAREST).save('/home/claude/game/build/yard_preview.png')
print('ok',atlas.size,len(OBJ),len(PKOBJ),len(BOBJ))
