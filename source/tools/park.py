import numpy as np, math
from PIL import Image, ImageDraw
T=16; W,H=30,26
OUT=(46,40,56,255)
EX='/home/claude/packs/ext/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/1_Terrains_and_Fences_16x16.png'
def spr(w,h,fn):
    im=Image.new('RGBA',(w,h),(0,0,0,0)); fn(ImageDraw.Draw(im)); return im
def outline(im):
    a=np.array(im); m=a[:,:,3]>0; ring=np.zeros_like(m)
    for dy,dx in((0,1),(0,-1),(1,0),(-1,0)): ring|=np.roll(np.roll(m,dy,0),dx,1)
    ring&=~m; a[ring]=OUT; return Image.fromarray(a)
def tree(r=18,col=(74,140,66),seed=0):
    rs=np.random.RandomState(seed); w=r*2+8; h=r*2+16
    im=Image.new('RGBA',(w,h),(0,0,0,0)); q=ImageDraw.Draw(im)
    q.rectangle([w//2-3,h-16,w//2+2,h-2],fill=(110,78,52,255)); q.rectangle([w//2-3,h-16,w//2-2,h-2],fill=(84,58,40,255))
    dk=tuple(int(c*0.72) for c in col)+(255,); md=col+(255,); lt=tuple(min(255,int(c*1.22)) for c in col)+(255,)
    blobs=[(w//2+int(rs.randint(-r//2,r//2)),r+2+int(rs.randint(-r//3,r//3)),int(r*rs.uniform(0.5,0.75))) for _ in range(7)]+[(w//2,r+2,int(r*0.8))]
    for x,y,rr in blobs: q.ellipse([x-rr,y-rr+3,x+rr,y+rr+3],fill=dk)
    for x,y,rr in blobs: q.ellipse([x-rr,y-rr,x+rr,y+rr],fill=md)
    for x,y,rr in blobs: q.ellipse([x-rr*0.6-2,y-rr*0.7-2,x+rr*0.2-2,y+rr*0.1-2],fill=lt)
    for _ in range(r): x=rs.randint(4,w-4); y=rs.randint(4,r*2); 
    return outline(im)
def make():
    g=Image.open(EX).convert('RGBA'); gt=[g.crop(((1+i)*T,7*T,(2+i)*T,8*T)) for i in range(1)]
    base=Image.new('RGBA',(W*T,H*T),(120,176,90,255))
    for y in range(H):
        for x in range(W): base.alpha_composite(gt[0],(x*T,y*T))
    rs=np.random.RandomState(5); d=ImageDraw.Draw(base)
    def poly(pts,fill,edge=None):
        P=[(x*T,y*T) for x,y in pts]; d.polygon(P,fill=fill)
        if edge: d.line(P+[P[0]],fill=edge,width=2)
    # asphalt path (west side) and court
    ASP=(126,120,132,255); ASPD=(96,92,104,255)
    poly([(5,0),(8,0),(8.2,4),(7.6,9),(8.6,13),(10.4,18),(12.5,22),(21.5,22),(21.5,26),(12,26),(9.5,23),(7.4,18.5),(5.8,13.5),(5.2,9),(5.4,4)],ASP,ASPD)
    poly([(8,1.2),(21,1.2),(21,2.4),(8,2.4)],(206,200,188,255),(160,154,144,255))   # sidewalk to the building
    # court lines
    d.rectangle([13*T,int(22.3*T),int(21.2*T),26*T-2],outline=(236,236,236,255))
    d.arc([15*T,int(23.2*T),19*T,int(27.2*T)],180,360,fill=(236,236,236,255)); d.line([(17*T,int(22.3*T)),(17*T,int(23.2*T))],fill=(236,236,236,255))
    # wood chips (kidney)
    CH=(214,184,140,255); CHD=(170,138,98,255)
    chips=[(8.6,3.2),(11,2.6),(15.5,2.6),(17.6,3.6),(18.2,6),(18,9.5),(17.2,12.5),(17.6,15.5),(18.8,18.5),(18.6,20.6),(16.5,21.6),(13.5,21.5),(11.8,19.5),(10.6,16),(9.6,12.6),(8.6,9),(8.4,5.5)]
    poly(chips,CH,CHD)
    mask=Image.new('L',base.size,0); ImageDraw.Draw(mask).polygon([(x*T,y*T) for x,y in chips],fill=255); ma=np.array(mask)>0
    a=np.array(base); ys,xs=np.where(ma); pick=rs.rand(len(ys))
    a[ys[pick>0.90],xs[pick>0.90],:3]=(190,158,116); a[ys[pick<0.08],xs[pick<0.08],:3]=(230,204,164); base=Image.fromarray(a); d=ImageDraw.Draw(base)
    d.line([(x*T,y*T) for x,y in chips]+[(chips[0][0]*T,chips[0][1]*T)],fill=CHD,width=2)
    # rec building (east)
    d.rectangle([22*T,0,30*T,int(20.5*T)],fill=(150,146,150,255),outline=OUT,width=2)
    d.rectangle([22*T+3,3,30*T-3,int(20.5*T)-12],fill=(124,120,126,255))
    for (x,y) in ((24,3),(27,6),(25,10),(28,14),(24,16)): d.rectangle([x*T,y*T,x*T+10,y*T+8],fill=(206,206,210,255),outline=(90,88,96,255))
    d.rectangle([22*T,int(20.5*T)-10,30*T,int(20.5*T)],fill=(188,176,160,255),outline=OUT)
    solid=[[0]*W for _ in range(H)]
    for y in range(0,21):
        for x in range(22,30): solid[y][x]=1
    OBJ=[]
    def add(id,img,px,py,solid='auto',flat=False,fh=None,**kw):
        o=dict(id='pk_'+id,img=img,x=int(px),y=int(py),w=img.width,h=img.height,layer='flat' if flat else 'obj',**kw); o['sortY']=int(py+img.height)
        if solid=='auto':
            f=fh if fh is not None else min(img.height,12); o['solid']=[int(px)+2,int(py+img.height-f),img.width-4,f]
        else: o['solid']=solid
        OBJ.append(o); return o
    TEAL=(34,150,150,255); TEALD=(22,110,114,255); TEALL=(90,196,190,255); POST=(60,64,74,255); DECK=(150,112,74,255)
    # ---- big structure (drawn as one sprite, 3/4 view)
    def big(q):
        # decks
        q.rectangle([30,34,66,60],fill=DECK,outline=OUT); 
        for x in range(34,66,5): q.line([(x,35),(x,59)],fill=(120,88,58,255))
        q.rectangle([8,40,30,54],fill=DECK,outline=OUT); q.rectangle([66,40,84,54],fill=DECK,outline=OUT)      # arms
        # posts
        for x,y in ((30,60),(64,60),(30,34),(64,34),(8,54),(84,54)): q.rectangle([x,y,x+2,y+14],fill=POST)
        # tower roof (octagon)
        q.polygon([(36,6),(60,6),(70,16),(70,30),(60,38),(36,38),(26,30),(26,16)],fill=TEAL,outline=OUT)
        q.polygon([(36,6),(60,6),(48,20)],fill=TEALL); q.polygon([(26,16),(36,6),(48,20),(26,30)],fill=TEALD); q.ellipse([45,17,51,23],fill=(240,236,220,255),outline=OUT)
        # big straight slide going down-left
        q.polygon([(8,44),(16,44),(6,84),(-2,84)],fill=TEAL,outline=OUT); q.line([(11,46),(2,82)],fill=TEALL,width=2)
        # curly slide (right)
        q.ellipse([76,50,104,82],fill=(60,170,90,255),outline=OUT); q.ellipse([83,57,97,75],fill=(34,120,60,255),outline=OUT); q.rectangle([86,78,104,90],fill=(60,170,90,255),outline=OUT); q.line([(88,82),(102,82)],fill=(150,220,160,255),width=2)
        # stairs at the bottom (front)
        for i in range(5): q.rectangle([40,62+i*5,56,66+i*5],fill=(190,190,196,255),outline=OUT)
        q.line([(39,60),(39,88)],fill=(250,210,60,255),width=2); q.line([(57,60),(57,88)],fill=(250,210,60,255),width=2)
    add('struct',spr(108,94,big),10*T+4,3*T+8,solid=[10*T+12,6*T+2,84,46],interact='p_struct')
    # ---- swings
    def swings(q):
        WHT=(236,236,240,255)
        for x in (2,39): q.line([(x,6),(x-2,44)],fill=OUT,width=3); q.line([(x,6),(x+2,44)],fill=OUT,width=3); q.line([(x,6),(x-2,44)],fill=WHT); q.line([(x,6),(x+2,44)],fill=WHT)
        q.rectangle([1,3,41,7],fill=WHT,outline=OUT)
        for i,x in enumerate((10,24)):
            q.line([(x,7),(x,30)],fill=(90,90,100,255)); q.line([(x+8,7),(x+8,30)],fill=(90,90,100,255)); q.rectangle([x-1,30,x+9,33],fill=(60,120,220,255) if i else (40,40,50,255),outline=OUT)
    add('swings',spr(44,46,swings),14*T+13,10*T+10,solid=[14*T+15,13*T,40,8],interact='p_swing')
    # ---- small structure
    def small(q):
        q.rectangle([10,8,34,26],fill=DECK,outline=OUT); q.polygon([(8,8),(22,0),(36,8)],fill=TEAL,outline=OUT)
        for x in (10,32): q.rectangle([x,26,x+2,36],fill=POST)
        q.polygon([(34,14),(40,14),(52,36),(44,36)],fill=TEAL,outline=OUT); q.line([(38,17),(47,34)],fill=TEALL,width=2)
        for i in range(3): q.rectangle([0,20+i*5,10,24+i*5],fill=(190,190,196,255),outline=OUT)
    add('small',spr(54,38,small),11*T+6,11*T+6,solid=[11*T+16,12*T+8,26,18],interact='p_small')
    # ---- spring rider, benches, picnic tables
    def rider(q):
        q.ellipse([2,2,16,12],fill=(240,90,70,255),outline=OUT); q.rectangle([12,0,16,5],fill=(240,90,70,255),outline=OUT); q.point((13,3),fill=OUT); q.rectangle([7,12,10,18],fill=(120,120,130,255),outline=OUT); q.rectangle([3,18,14,20],fill=(90,90,100,255))
    add('rider',spr(19,21,rider),13*T+8,15*T,interact='p_rider',fh=8)
    def bench(q): q.rectangle([0,3,25,9],fill=(60,64,74,255),outline=OUT); q.rectangle([0,0,25,3],fill=(84,88,98,255),outline=OUT); q.rectangle([2,9,4,13],fill=OUT); q.rectangle([21,9,23,13],fill=OUT)
    add('bench1',spr(26,14,bench),9*T-4,11*T+4,interact='p_bench',fh=8); add('bench2',spr(26,14,bench),10*T+12,15*T+6,interact='p_bench',fh=8)
    def table(col):
        def f(q):
            q.rectangle([0,6,35,10],fill=col,outline=OUT); q.rectangle([0,14,35,17],fill=tuple(int(c*0.8) for c in col[:3])+(255,),outline=OUT); q.rectangle([3,0,32,8],fill=tuple(min(255,int(c*1.1)) for c in col[:3])+(255,),outline=OUT)
            q.rectangle([4,17,6,22],fill=OUT); q.rectangle([29,17,31,22],fill=OUT)
        return f
    add('ptable1',spr(36,23,table((70,72,80,255))),13*T,17*T+6,interact='p_tablechips',fh=14)
    add('ptable2',spr(36,23,table((70,72,80,255))),14*T+6,19*T,interact='p_tablechips',fh=14)
    add('picnic',spr(36,23,table((160,116,72,255))),2*T+4,6*T+8,interact='p_picnic',fh=14)
    # interesting wood chips (flat sparkle spots)
    def spot(q):
        q.ellipse([1,2,12,9],fill=(190,158,116,255)); q.rectangle([3,3,6,4],fill=(120,88,58,255)); q.rectangle([7,6,10,7],fill=(140,104,70,255)); q.point((9,3),fill=(250,240,200,255))
    for i,(x,y) in enumerate(((9.6,6.5),(16.2,13.2),(12.2,18.6),(16.6,16.2))): add('chips%d'%i,spr(14,11,spot),x*T,y*T,solid=None,flat=True,interact='p_chips')
    # basketball hoop + ball
    def hoop(q): q.rectangle([8,10,10,30],fill=POST); q.rectangle([0,0,18,12],fill=(240,240,244,255),outline=OUT); q.rectangle([6,5,12,10],outline=(230,80,60,255)); q.ellipse([5,11,13,15],outline=(230,100,40,255))
    add('hoop',spr(19,31,hoop),16*T+7,20*T+10,interact='p_hoop',fh=6)
    add('ball',spr(8,8,lambda q:(q.ellipse([0,0,7,7],fill=(230,120,50,255),outline=OUT),q.line([(1,4),(6,4)],fill=(120,60,30,255)))),18*T+4,24*T,solid=None,interact='p_ball')
    # trees
    TR=[(0.2,0.4,20,(74,140,66),1),(2.2,3.6,22,(70,132,62),2),(0.4,9,24,(64,124,60),3),(2.8,11.6,20,(84,150,70),4),(0.2,14.5,24,(60,118,58),5),(3,16.6,22,(74,140,66),6),(0.6,20,24,(70,132,62),7),(4.4,21.6,20,(84,150,70),8),(7.6,22.4,18,(200,170,60),9),
        (19,4.5,12,(84,150,70),10),(19.4,7.6,12,(74,140,66),11),(18.6,12.2,12,(84,150,70),12),(19.4,15,12,(70,132,62),13),(9.4,0.2,10,(74,140,66),14)]
    for i,(x,y,r,col,sd) in enumerate(TR):
        im=tree(r,col,sd); add('tree%d'%i,im,x*T,y*T,solid=[int(x*T+im.width/2-5),int(y*T+im.height-10),10,8],interact='p_tree')
    # park sign
    def sign(q): q.rectangle([0,0,35,11],fill=(60,96,70,255),outline=OUT); q.rectangle([4,12,6,18],fill=POST); q.rectangle([29,12,31,18],fill=POST)
    add('sign',spr(36,19,sign),8*T+6,0*T+4,interact='p_sign',fh=6)
    return base,OBJ,solid,W,H
