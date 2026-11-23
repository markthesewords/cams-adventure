# The backyard. Run inside build.py's namespace (exec). Layout follows the "Lot (outside)" plan in the House Outline:
# backyard north of the house, patio (west) and deck (east) against the house, concrete pad north of the deck by the gate,
# detached garage in the north-east corner, black metal fence north and north-west, wood fence south-west, plastic slide in the grass.
YW,YH=34,41
def ypx(X): return int(round((X-40)*1.6))
def ypy(Y): return int(round((Y+10)*1.6))
_g=Image.open(PK.EX).convert('RGBA').crop((1*T,7*T,2*T,8*T))
ybase=Image.new('RGBA',(YW*T,YH*T),(120,176,90,255))
for y in range(YH):
    for x in range(YW): ybase.alpha_composite(_g,(x*T,y*T))
yd=ImageDraw.Draw(ybase); yrs=np.random.RandomState(11)
FX0,FY0,EX_=ypx(48),ypy(2),ypx(360)                 # west fence x, north fence y, east line x
GX0,GY0,GY1=ypx(345),ypy(48),ypy(180)              # garage
PADX,PADY=ypx(288),ypy(240); DKX,DKY,HY=ypx(210),ypy(300),ypy(372); PTX=ypx(108)
def speck(rect,base_,dark,light,p=0.08):
    x0,y0,x1,y1=rect; yd.rectangle(rect,fill=base_)
    a_=np.array(ybase); sub=a_[y0:y1+1,x0:x1+1]; m_=yrs.rand(*sub.shape[:2]); sub[m_>1-p,:3]=dark; sub[m_<p,:3]=light; a_[y0:y1+1,x0:x1+1]=sub
    return Image.fromarray(a_)
# neighbours beyond the fences
ybase=speck((0,0,FX0-1,YH*T-1),(132,184,100,255),(112,166,84),(150,198,116)); yd=ImageDraw.Draw(ybase)
# firewood / dirt corner, driveway
ybase=speck((EX_+3,0,YW*T-1,GY0-1),(196,170,132,255),(170,142,104),(214,192,156)); yd=ImageDraw.Draw(ybase)
ybase=speck((EX_+3,GY1,YW*T-1,YH*T-1),(150,146,150,255),(132,128,134),(166,162,166),0.05); yd=ImageDraw.Draw(ybase)
for i in range(3):
    for j in range(4): yd.ellipse([EX_+8+j*6,30+i*7,EX_+13+j*6,35+i*7],fill=(176,128,82,255),outline=OUT); yd.point((EX_+10+j*6,32+i*7),fill=(120,84,52,255))
# neighbour's bushes behind the north fence
for i,x in enumerate(range(FX0+2,EX_-6,22)):
    bu=PK.tree(9+(i%3),(64+(i%2)*12,128+(i%3)*8,60),20+i); ybase.alpha_composite(bu.crop((0,0,bu.width,min(bu.height,16))),(x,0))
yd=ImageDraw.Draw(ybase)
# dirt strip down the west side of the house
ybase=speck((FX0+3,HY,PTX-1,YH*T-1),(196,170,132,255),(170,142,104),(214,192,156)); yd=ImageDraw.Draw(ybase)
# patio (pavers) and the concrete pad
ybase=speck((PTX,DKY,DKX-1,HY-1),(198,192,182,255),(180,174,164),(212,206,198),0.05); yd=ImageDraw.Draw(ybase)
for x in range(PTX,DKX,16): yd.line([(x,DKY),(x,HY-1)],fill=(168,162,152,255))
for y in range(DKY,HY,16): yd.line([(PTX,y),(DKX-1,y)],fill=(168,162,152,255))
yd.rectangle([PTX,DKY,DKX-1,HY-1],outline=(140,134,126,255))
ybase=speck((PADX,PADY,EX_-1,DKY-1),(206,204,198,255),(190,188,182),(220,218,212),0.05); yd=ImageDraw.Draw(ybase)
yd.rectangle([PADX,PADY,EX_-1,DKY-1],outline=(150,148,142,255)); yd.line([(PADX+(EX_-PADX)//2,PADY),(PADX+(EX_-PADX)//2,DKY-1)],fill=(176,174,168,255))
# deck: boards, rim, rails, two sets of steps
DKW=(158,112,72,255); DKD=(122,84,52,255); DKL=(182,134,90,255)
yd.rectangle([DKX,DKY,EX_-1,HY-1],fill=DKW)
for y in range(DKY,HY,6): yd.line([(DKX,y),(EX_-1,y)],fill=DKD)
for i,x in enumerate(range(DKX+20,EX_,34)):
    for y in range(DKY+(3 if i%2 else 0),HY,12): yd.line([(x,y),(x,min(HY-1,y+5))],fill=DKD)
yd.rectangle([DKX,DKY,EX_-1,HY-1],outline=OUT)
NSX0,NSX1=ypx(304),ypx(332)          # steps up to the pad (north edge)
WSY0,WSY1=ypy(332),ypy(352)          # steps down to the patio (west edge)
for i in range(3): yd.rectangle([NSX0,DKY-13+i*4,NSX1,DKY-9+i*4],fill=DKL if i%2==0 else DKW,outline=DKD)
yd.rectangle([NSX0,DKY-13,NSX1,DKY],outline=OUT)
for i in range(3): yd.rectangle([DKX-13+i*4,WSY0,DKX-9+i*4,WSY1],fill=DKL if i%2==0 else DKW,outline=DKD)
yd.rectangle([DKX-13,WSY0,DKX,WSY1],outline=OUT)
RAIL=(238,234,224,255)
def rail_h(x0,x1,y):
    yd.rectangle([x0,y-2,x1,y+1],fill=RAIL,outline=OUT)
    for x in range(x0,x1+1,10): yd.rectangle([x,y-3,x+2,y+2],fill=RAIL,outline=OUT)
def rail_v(x,y0,y1):
    yd.rectangle([x-1,y0,x+2,y1],fill=RAIL,outline=OUT)
    for y in range(y0,y1+1,10): yd.rectangle([x-2,y,x+3,y+2],fill=RAIL,outline=OUT)
rail_h(DKX,NSX0-2,DKY); rail_h(NSX1+2,EX_-1,DKY); rail_v(DKX,DKY,WSY0-2); rail_v(DKX,WSY1+2,HY-2); rail_v(EX_-3,DKY,HY-2)
# the house: roof seen from above, with the two doors on its north wall
yd.rectangle([PTX,HY,EX_-1,YH*T-1],fill=(92,88,98,255))
for y in range(HY+8,YH*T,6): yd.line([(PTX,y),(EX_-1,y)],fill=(76,72,82,255))
for i,y in enumerate(range(HY+8,YH*T,6)):
    for x in range(PTX+(5 if i%2 else 0),EX_,10): yd.line([(x,y),(x,y+5)],fill=(76,72,82,255))
yd.rectangle([PTX,HY,EX_-1,HY+7],fill=(232,228,218,255),outline=OUT); yd.rectangle([PTX,HY,EX_-1,YH*T-1],outline=OUT)
# garage (roof from above), bumping into the yard
yd.rectangle([GX0,GY0,YW*T-1,GY1],fill=(104,100,110,255),outline=OUT)
for y in range(GY0+6,GY1-10,6): yd.line([(GX0+1,y),(YW*T-2,y)],fill=(86,82,92,255))
yd.rectangle([GX0,GY1-11,YW*T-1,GY1],fill=(226,222,212,255),outline=OUT)
for y in (GY1-8,GY1-5): yd.line([(GX0+1,y),(YW*T-2,y)],fill=(200,196,186,255))
yd.rectangle([GX0,GY0,GX0+3,GY1],fill=(226,222,212,255),outline=OUT)
# fences
MET=(34,34,40,255); WOOD=(150,104,62,255); WOODD=(104,70,40,255)
def metal_h(x0,x1,y):
    for x in range(x0,x1+1,4): yd.line([(x,y-9),(x,y)],fill=MET)
    yd.line([(x0,y-7),(x1,y-7)],fill=MET); yd.line([(x0,y-1),(x1,y-1)],fill=MET)
    for x in range(x0,x1+1,24): yd.rectangle([x-1,y-11,x+1,y],fill=MET)
def metal_v(x,y0,y1):
    yd.rectangle([x-1,y0,x+1,y1],fill=MET)
    for y in range(y0,y1+1,12): yd.rectangle([x-2,y,x+2,y+2],fill=MET)
def wood_v(x,y0,y1):
    yd.rectangle([x-2,y0,x+2,y1],fill=WOOD,outline=OUT)
    for y in range(y0+5,y1,6): yd.line([(x-1,y),(x+1,y)],fill=WOODD)
metal_h(FX0,YW*T-1,FY0+4); metal_v(FX0,FY0,ypy(228)); wood_v(FX0,ypy(228),YH*T-2)
metal_v(EX_,FY0,GY0); metal_v(EX_,GY1,ypy(261)-1); metal_v(EX_,ypy(279)+1,DKY)
yd.rectangle([0,0,YW*T-1,YH*T-1],outline=OUT,width=2)
YOBJ=[]
def yadd(id,img,px,py,solid='auto',flat=False,fh=None,**kw):
    o=dict(id='y_'+id,img=img,x=int(px),y=int(py),w=img.width,h=img.height,layer='flat' if flat else 'obj',**kw); o['sortY']=int(py+img.height)
    if solid=='auto':
        f=fh if fh is not None else min(img.height,12); o['solid']=[int(px)+2,int(py+img.height-f),img.width-4,f]
    else: o['solid']=solid
    YOBJ.append(o); return o
_clear=Image.new('RGBA',(1,1),(0,0,0,0))
def yblock(name,x,y,w,h): yadd(name,_clear,x,y,solid=[int(x),int(y),int(w),int(h)],flat=True)
yblock('k_n',0,0,YW*T,FY0+6); yblock('k_w',0,0,FX0+3,YH*T); yblock('k_e1',EX_-2,0,40,GY0); yblock('k_gar',GX0,GY0,YW*T-GX0,GY1-GY0+1)
yblock('k_e2',EX_-2,GY1,40,ypy(261)-GY1); yblock('k_e3',EX_-2,ypy(279),40,YH*T-ypy(279))
yblock('k_dn1',DKX,DKY-3,NSX0-DKX,5); yblock('k_dn2',NSX1+1,DKY-3,EX_-NSX1,5); yblock('k_dw1',DKX-2,DKY,5,WSY0-DKY); yblock('k_dw2',DKX-2,WSY1+1,5,HY-WSY1)
yblock('k_ns1',NSX0-3,DKY-13,3,12); yblock('k_ns2',NSX1+1,DKY-13,3,12); yblock('k_ws1',DKX-13,WSY0-3,12,3); yblock('k_ws2',DKX-13,WSY1+1,12,3)
yblock('k_house',PTX,HY-4,EX_-PTX,YH*T-HY+4); yblock('k_s',0,YH*T-10,PTX,10)
# gate (closed), doors on the house, door mats, the plastic slide
def gate_img(q):
    q.rectangle([1,0,3,ypy(279)-ypy(261)],fill=MET)
    for y in range(0,ypy(279)-ypy(261),4): q.line([(0,y),(4,y)],fill=MET)
    q.rectangle([0,13,4,16],fill=(196,84,44,255),outline=OUT)
yadd('gate',PK.spr(5,ypy(279)-ypy(261)+1,gate_img),EX_-2,ypy(261),solid=[EX_-3,ypy(261),40,ypy(279)-ypy(261)+1],interact='y_gate')
SLX0,SLX1=ypx(297),ypx(321); BDX0,BDX1=ypx(213),ypx(226)
def slider_o(open_):
    def f(q):
        w=SLX1-SLX0; q.rectangle([0,0,w,8],fill=(60,60,70,255),outline=OUT)
        if open_: q.rectangle([2,1,w//2-1,7],fill=(40,36,48,255)); q.rectangle([w//2+1,1,w-2,7],fill=(170,214,236,255)); q.rectangle([w//2-3,1,w//2+1,7],fill=(170,214,236,255),outline=(96,140,170,255))
        else: q.rectangle([2,1,w//2-1,7],fill=(170,214,236,255)); q.rectangle([w//2+1,1,w-2,7],fill=(150,200,226,255)); q.line([(w//2,1),(w//2,7)],fill=OUT); q.line([(5,2),(9,6)],fill=(232,244,250,255))
    return PK.spr(SLX1-SLX0+1,9,f)
yadd('slider',slider_o(False),SLX0,HY-1,solid=None,flat=True,interact='y_slider'); yadd('sliderOpen',slider_o(True),SLX0,HY-1,solid=None,flat=True,interact='y_slider')
def bdoor(q): q.rectangle([0,0,BDX1-BDX0,8],fill=(120,84,60,255),outline=OUT); q.rectangle([3,2,BDX1-BDX0-3,6],fill=(170,214,236,255),outline=OUT)
yadd('backdoor',PK.spr(BDX1-BDX0+1,9,bdoor),BDX0,HY-1,solid=None,flat=True,interact='y_backdoor')
def mat(q): q.rectangle([0,0,27,9],fill=(96,110,96,255),outline=OUT); q.rectangle([3,3,24,6],outline=(140,156,140,255))
yadd('mat',PK.spr(28,10,mat),(SLX0+SLX1)//2-14,HY-17,solid=None,flat=True)
def slide(q):
    RED=(224,72,62,255); REDD=(168,44,40,255); REDL=(246,128,112,255); YEL=(250,206,60,255)
    q.polygon([(12,10),(24,10),(40,40),(22,40)],fill=RED,outline=OUT); q.line([(18,13),(30,37)],fill=REDL,width=3)       # chute, running down to the south-east
    q.rectangle([8,2,26,12],fill=YEL,outline=OUT); q.rectangle([10,0,12,4],fill=REDD); q.rectangle([22,0,24,4],fill=REDD) # top platform with handles
    for i in range(3): q.rectangle([0,6+i*5,8,9+i*5],fill=REDD,outline=OUT)                                               # ladder on the west side
    q.rectangle([9,12,11,22],fill=REDD); q.rectangle([23,12,25,18],fill=REDD)
yadd('slide',PK.spr(42,42,slide),ypx(126)-20,ypy(216)-22,solid=[ypx(126)-12,ypy(216)-12,28,24],interact='y_slide')
# ---- patio: pellet smoker, grill, downspout; deck: chairs and glass side tables (placed from Nick's screenshots) ----
BLK=(30,30,36,255); BLKL=(70,70,80,255); STL=(150,154,160,255); STLD=(110,114,122,255)
def smoker(q):   # pellet smoker seen from above: hopper on the north end, long barrel lid, chimney, side shelf
    q.rectangle([2,0,15,11],fill=BLK,outline=OUT); q.rectangle([4,2,13,5],fill=BLKL); q.rectangle([6,8,11,9],fill=STL)              # hopper with lid
    q.rounded_rectangle([0,11,17,47],radius=6,fill=BLK,outline=OUT); q.line([(3,15),(3,43)],fill=BLKL); q.line([(9,14),(9,44)],fill=(48,48,56,255))
    q.rectangle([15,24,17,34],fill=STL,outline=OUT)                                                                                          # lid handle
    q.ellipse([10,38,15,43],fill=STLD,outline=OUT); q.point((12,40),fill=(20,20,24,255))                                                     # chimney
yadd('smoker',PK.spr(18,48,smoker),112,520,solid=[112,528,18,40])
def grill(q):    # gas grill from above: lid, handle, two side shelves
    q.rectangle([0,4,9,13],fill=STL,outline=OUT); q.rectangle([39,4,48,13],fill=STL,outline=OUT)
    for x in (2,5): q.line([(x,6),(x,11)],fill=STLD)
    q.rounded_rectangle([9,0,39,15],radius=4,fill=BLK,outline=OUT); q.line([(12,3),(36,3)],fill=BLKL); q.rectangle([13,13,35,15],fill=STL,outline=OUT)
    q.ellipse([42,6,46,10],fill=(196,60,48,255),outline=OUT)                                                                               # propane knob
yadd('grill',PK.spr(49,16,grill),119,586,solid=[119,589,49,13])
def spout(q):    # downspout coming off the house corner, its extension lying on the patio edge
    q.rectangle([0,0,4,30],fill=(232,228,218,255),outline=OUT); q.line([(2,2),(2,27)],fill=(206,202,192,255)); q.rectangle([0,27,5,31],fill=(212,208,198,255),outline=OUT)
yadd('spout',PK.spr(6,32,spout),110,576,solid=[109,578,6,30])
def spout_down(q):   # knocked into the grass at an angle
    q.polygon([(0,6),(26,0),(28,4),(2,10)],fill=(232,228,218,255),outline=OUT); q.line([(3,7),(25,2)],fill=(206,202,192,255)); q.rectangle([25,0,30,6],fill=(212,208,198,255),outline=OUT)
yadd('spoutDown',PK.spr(31,11,spout_down),80,590,solid=None,flat=True)
MESH=(130,92,62,255); MESHD=(104,72,48,255)
def chair(face):
    def f(q):
        q.rectangle([1,1,13,13],fill=MESH,outline=BLK)
        for i in range(3,13,3): q.line([(2,i),(12,i)],fill=MESHD); q.line([(i,2),(i,12)],fill=MESHD)
        back={'down':[0,0,14,2],'up':[0,12,14,14],'right':[0,0,2,14],'left':[12,0,14,14]}[face]; q.rectangle(back,fill=BLK)
        if face in('down','up'): q.line([(0,1),(0,13)],fill=BLK); q.line([(14,1),(14,13)],fill=BLK)
        else: q.line([(1,0),(13,0)],fill=BLK); q.line([(1,14),(13,14)],fill=BLK)
    return PK.spr(15,15,f)
def gtable(q):
    q.ellipse([0,0,10,10],fill=(150,200,222,255),outline=BLK); q.ellipse([2,2,8,8],outline=(190,226,240,255)); q.line([(3,3),(5,2)],fill=(240,250,255,255))
def planter(q):   # wooden raised garden stand: mostly dirt, a few plants
    W_,H_=95,21; q.rectangle([0,0,W_-1,H_-1],fill=(150,104,62,255),outline=OUT); q.rectangle([3,3,W_-4,H_-4],fill=(96,66,44,255),outline=(104,70,40,255))
    for x in range(6,W_-6,7):
        for y in (5,9,13): q.point((x+(y%3),y),fill=(120,86,58,255))
    for x in range(24,W_,24): q.line([(x,0),(x,H_-1)],fill=(118,80,46,255))
    for (px_,py_,c) in [(14,9,(84,150,62,255)),(37,12,(96,164,70,255)),(61,8,(72,138,56,255)),(80,12,(104,170,74,255))]:
        q.ellipse([px_-3,py_-3,px_+3,py_+3],fill=c,outline=(52,96,40,255)); q.point((px_,py_-1),fill=(150,206,110,255))
    q.ellipse([47,10,50,13],fill=(214,84,64,255))
yadd('planter',PK.spr(95,21,planter),296,500,solid=[296,500,95,21])
for i,(cx,cy,face) in enumerate([(403,511,'down'),(497,527,'left'),(390,597,'up'),(496,587,'left')]):
    yadd('chair%d'%i,chair(face),cx-7,cy-7,solid=[cx-6,cy-4,13,10])
for i,(cx,cy) in enumerate([(419,503),(480,505),(362,595),(494,603)]):
    yadd('gtable%d'%i,PK.spr(11,11,gtable),cx-5,cy-5,solid=[cx-4,cy-3,9,7])
y_solid=[[0]*YW for _ in range(YH)]
