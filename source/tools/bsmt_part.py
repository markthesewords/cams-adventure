# The basement. Run inside build.py's namespace (exec), so every house helper is available.
# Layout follows the v10 House Outline basement plan: same footprint as the main floor, stairs in the same spot.
BW,BH=33,26
bg=np.full((BH,BW),'#',dtype='<U1'); broom=np.full((BH,BW),'',dtype=object)
def bfill(x0,y0,x1,y1,ch,r=None):
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            bg[y,x]=ch
            if r is not None: broom[y,x]=r
bfill(1,4,3,5,'f','closet');  bfill(1,6,3,12,'.','closet')
bfill(5,4,8,5,'f','bbath');   bfill(5,6,8,12,'.','bbath')
bfill(10,1,12,2,'f','util');  bfill(10,3,12,10,'.','util')
bfill(14,1,23,2,'f','bhall'); bfill(13,3,24,3,'.','bhall')
bfill(25,1,31,2,'f','store'); bfill(25,3,31,9,'.','store')
bfill(14,5,15,9,'.','bstairs'); bfill(14,10,15,12,'.','landing')
bfill(17,5,23,6,'f','kitch2'); bfill(17,7,23,12,'.','kitch2')
bfill(24,11,31,12,'f','den');  bfill(14,13,31,24,'.','den')
bfill(11,12,12,13,'f','vest'); bfill(11,14,13,16,'.','vest')
bfill(1,14,9,15,'f','bbed');   bfill(1,16,9,24,'.','bbed'); bg[16,10]='.'; broom[16,10]='vest'
bfill(11,18,12,19,'f','laund'); bfill(11,20,12,24,'.','laund')
BDOORS={'b_closet':dict(x=2,y=14,wall=(2,13),open=False),'b_bath':dict(x=6,y=14,wall=(6,13),open=False),
        'b_util':dict(x=11,y=12,wall=(11,11),open=False),'b_laund':dict(x=12,y=18,wall=(12,17),open=False)}
for dd_ in BDOORS.values():
    x,y=dd_['wall']; bg[y,x]='.'; broom[y,x]='bdoor'; bg[dd_['y'],dd_['x']]='.'; bg[dd_['y']+1,dd_['x']]='.'; broom[dd_['y'],dd_['x']]=broom[dd_['y']+1,dd_['x']]='bdoor'
def noise_tile(x,y,col,spread=10):
    rs=np.random.RandomState(x*131+y*17+col[0]); a_=np.zeros((T,T,4),'uint8'); a_[:,:]=col+(255,)
    m_=rs.rand(T,T); a_[m_>0.86,:3]=tuple(max(0,c-spread) for c in col); a_[m_<0.10,:3]=tuple(min(255,c+spread) for c in col); return Image.fromarray(a_)
def pine_tile(x,top):
    im=Image.new('RGBA',(T,T),(226,172,92,255)); q=ImageDraw.Draw(im)
    for yy in (0,5,11): q.line([(0,yy),(T-1,yy)],fill=(176,122,58,255))
    for yy in (1,6,12): q.line([(0,yy),(T-1,yy)],fill=(240,194,118,255))
    if (x*7+(0 if top else 3))%5==0: q.ellipse([4,7,7,9],fill=(150,98,46,255))
    if not top: q.line([(0,T-1),(T-1,T-1)],fill=(140,96,48,255))
    return im
def block_tile(x,top):
    im=Image.new('RGBA',(T,T),(238,236,228,255)); q=ImageDraw.Draw(im)
    for yy in (0,8): q.line([(0,yy),(T-1,yy)],fill=(208,206,198,255))
    off=0 if top else 8
    q.line([(off,0 if top else 8),(off,7 if top else 15)],fill=(208,206,198,255)); q.line([((off+8)%16,8 if top else 0),((off+8)%16,15 if top else 7)],fill=(208,206,198,255))
    if not top: q.line([(0,T-1),(T-1,T-1)],fill=(150,148,140,255))
    return im
BFLOOR={'den':(178,162,138),'landing':(178,162,138),'vest':(178,162,138),'bbed':(170,172,182),'closet':(170,172,182),'bdoor':(178,162,138),'store':(150,150,154),'util':(150,150,154),'bhall':(150,150,154)}
bbase=Image.new('RGBA',(BW*T,BH*T),(24,22,30,255)); bd_=ImageDraw.Draw(bbase)
for y in range(BH):
    for x in range(BW):
        ch=bg[y,x]; r=broom[y,x]
        if ch=='.':
            if r in BFLOOR: t_=noise_tile(x,y,BFLOOR[r])
            elif r=='bstairs': t_=noise_tile(x,y,(120,96,70),6)
            else: t_=tl(FL,0+(x%3),6+(y%2))
            bbase.alpha_composite(t_,(x*T,y*T))
        elif ch=='f':
            top=(bg[y-1,x]=='#')
            if r in ('kitch2',): t_=pine_tile(x,top)
            elif r in ('den','store','util','bhall','laund'): t_=block_tile(x,top)
            else: t_=tl(WL,1,6+(0 if top else 1))
            bbase.alpha_composite(t_,(x*T,y*T))
def bisw(x,y): return 0<=x<BW and 0<=y<BH and bg[y,x]=='#'
for y in range(BH):
    for x in range(BW):
        if bg[y,x]=='#': bd_.rectangle([x*T,y*T,x*T+T-1,y*T+T-1],fill=WHITE)
for y in range(BH):
    for x in range(BW):
        if bg[y,x]!='#': continue
        if not bisw(x,y-1) and y>0: bd_.line([(x*T,y*T),(x*T+T-1,y*T)],fill=OUT,width=2)
        if not bisw(x,y+1) and y<BH-1: bd_.line([(x*T,y*T+T-2),(x*T+T-1,y*T+T-2)],fill=OUT,width=2)
        if not bisw(x-1,y) and x>0: bd_.line([(x*T,y*T),(x*T,y*T+T-1)],fill=OUT,width=2)
        if not bisw(x+1,y) and x<BW-1: bd_.line([(x*T+T-2,y*T),(x*T+T-2,y*T+T-1)],fill=OUT,width=2)
bd_.rectangle([0,0,BW*T-1,BH*T-1],outline=OUT,width=2)
bsh=Image.new('RGBA',bbase.size,(0,0,0,0)); bsd=ImageDraw.Draw(bsh)
for y in range(1,BH):
    for x in range(BW):
        if bg[y,x]=='.' and bg[y-1,x] in '#f': bsd.rectangle([x*T,y*T,x*T+T-1,y*T+3],fill=(0,0,0,50))
        if bg[y,x]=='.' and x>0 and bg[y,x-1]=='#': bsd.rectangle([x*T,y*T,x*T+2,y*T+T-1],fill=(0,0,0,35))
bbase.alpha_composite(bsh); bd_=ImageDraw.Draw(bbase)
PINE=(226,172,92,255); PINED=(176,122,58,255)
# pine boards on the walls round the drums and the stairs (seen edge-on from above)
for yy in range(17,25): bd_.rectangle([13*T+T-5,yy*T,13*T+T-3,yy*T+T-1],fill=PINE)
for yy in range(4,13): bd_.rectangle([13*T+T-5,yy*T,13*T+T-3,yy*T+T-1],fill=PINE); bd_.rectangle([16*T+2,yy*T,16*T+4,yy*T+T-1],fill=PINE)
for xx in range(14,25): bd_.rectangle([xx*T,25*T+2,xx*T+T-1,25*T+4],fill=PINE)
# stairs up (same spot as upstairs)
for i in range(10):
    yy=5*T+i*8; bd_.rectangle([14*T+1,yy,16*T-2,yy+7],fill=(150,112,74,255) if i%2 else (170,128,86,255)); bd_.line([(14*T+1,yy+7),(16*T-2,yy+7)],fill=(96,68,44,255))
bd_.line([(14*T+2,5*T),(14*T+2,10*T)],fill=(90,64,40,255),width=2)
# windows, the open bedroom door, side doors
def b_side_win(col,r0,r1,side):
    x=col*T+(T-7 if side=='e' else 2); y0=r0*T+3; y1=(r1+1)*T-4
    bd_.rectangle([x,y0,x+4,y1],fill=FRAME,outline=OUT); bd_.rectangle([x+1,y0+2,x+3,y1-2],fill=GLASS)
def b_south_win(c0,c1,row):
    x0=c0*T+3; x1=(c1+1)*T-4; y=row*T+2
    bd_.rectangle([x0,y,x1,y+4],fill=FRAME,outline=OUT); bd_.rectangle([x0+2,y+1,x1-2,y+3],fill=GLASS)
b_side_win(0,19,21,'e'); b_south_win(3,6,25)
bd_.rectangle([10*T+5,15*T+2,10*T+9,16*T],fill=DOORC,outline=OUT)                 # bedroom door, swung open
bd_.rectangle([24*T+5,8*T+1,24*T+9,9*T+12],fill=DOORC,outline=OUT)                # kitchenette -> shelving door
BOBJ=[]
def badd(id,img,px,py,solid='auto',layer='obj',flat=False,fh=None,**kw):
    o=dict(id='b_'+id,img=img,x=int(px),y=int(py),w=img.width,h=img.height,layer=('flat' if flat else layer),**kw); o['sortY']=int(py+img.height)
    if solid=='auto':
        f=fh if fh is not None else (img.height-6 if img.height<=22 else 14); f=min(f,img.height); o['solid']=[int(px)+1,int(py+img.height-f),img.width-2,f]
    else: o['solid']=solid
    BOBJ.append(o); return o
C4=lambda *c: tuple(c)+(255,)
# ---------------- den: drums, desk, guitar ----------------
def f_kit(q):
    R=C4(40,40,46);
    q.line([(4,6),(4,34)],fill=R,width=2); q.line([(4,8),(22,4)],fill=R,width=2); q.line([(4,30),(20,36)],fill=R,width=2)   # rack
    def pad(cx,cy,r): q.ellipse([cx-r,cy-r,cx+r,cy+r],fill=C4(30,30,34),outline=OUT); q.ellipse([cx-r+2,cy-r+2,cx+r-2,cy+r-2],fill=C4(236,236,232))
    def cym(cx,cy,r): q.ellipse([cx-r,cy-r,cx+r,cy+r],fill=C4(54,54,60),outline=OUT); q.point((cx,cy),fill=C4(160,160,168))
    cym(8,6,6); cym(22,5,5); cym(6,36,5)
    pad(13,13,5); pad(22,16,5); pad(12,25,5); pad(22,29,6)
    q.rectangle([15,19,19,24],fill=C4(30,30,34),outline=OUT); q.rectangle([16,20,18,23],fill=C4(90,200,120))   # the module
    q.rectangle([24,20,29,24],fill=C4(60,60,66),outline=OUT)                                                  # kick pedal
badd('drums',spr(31,43,f_kit),13*T+12,18*T+4,solid=[13*T+13,18*T+8,24,36],interact='bs_drums')
badd('throne',spr(11,10,lambda q:(q.ellipse([0,0,10,8],fill=C4(34,34,40),outline=OUT),q.ellipse([2,1,8,5],fill=C4(58,58,66)))),15*T+13,19*T+12,solid=None,flat=True)
badd('sticks',spr(12,6,lambda q:(q.line([(0,1),(11,4)],fill=C4(226,186,120),width=1),q.line([(1,5),(11,0)],fill=C4(206,166,100),width=1))),18*T+2,18*T+12,solid=None,flat=True)
gm=Image.new('RGBA',(7*T,3*T),(0,0,0,0))
for yy in range(3):
    for xx in range(7): gm.alpha_composite(noise_tile(xx+40,yy,(62,112,84),8),(xx*T,yy*T))
ImageDraw.Draw(gm).rectangle([0,0,7*T-1,3*T-1],outline=(40,84,60,255))
badd('greenmat',gm,14*T,22*T,solid=None,flat=True)
def f_desk(q):
    q.rectangle([0,6,51,21],fill=C4(120,86,56),outline=OUT); q.rectangle([1,7,50,15],fill=C4(150,110,72)); q.line([(1,16),(50,16)],fill=C4(90,64,40))
    q.rectangle([17,0,35,11],fill=C4(30,30,36),outline=OUT); q.rectangle([19,2,33,9],fill=C4(70,130,200)); q.rectangle([20,3,26,4],fill=C4(200,230,250)); q.rectangle([25,12,27,13],fill=C4(30,30,36))
    q.rectangle([19,13,33,15],fill=C4(210,210,214),outline=C4(90,90,96)); q.rectangle([37,12,40,15],fill=C4(210,210,214),outline=C4(90,90,96))
    q.rectangle([3,8,9,14],fill=C4(40,40,46),outline=OUT); q.rectangle([42,8,48,14],fill=C4(40,40,46),outline=OUT)   # speakers
badd('desk',spr(52,22,f_desk),15*T,24*T-6,solid=[15*T+1,24*T+2,50,14],interact='bs_desk')
def f_ochair(q):
    q.ellipse([1,0,13,7],fill=C4(30,30,34),outline=OUT); q.rectangle([3,2,11,5],fill=C4(220,170,50)); q.rectangle([2,7,12,11],fill=C4(30,30,34),outline=OUT); q.line([(7,11),(7,14)],fill=OUT); q.line([(3,14),(11,14)],fill=OUT)
badd('ochair',spr(15,15,f_ochair),16*T+2,22*T+8,solid=None,flat=True)
def f_easel(q):
    q.line([(1,24),(4,2)],fill=C4(190,150,96),width=2); q.line([(17,24),(14,2)],fill=C4(190,150,96),width=2)
    q.rectangle([2,3,16,5],fill=C4(60,130,200),outline=OUT); q.rectangle([3,6,15,16],fill=C4(34,36,42),outline=OUT); q.rectangle([2,17,16,19],fill=C4(60,130,200),outline=OUT)
    for (a,b,c) in ((5,8,(230,70,60)),(8,9,(70,150,230)),(11,8,(230,70,60)),(6,12,(230,70,60)),(10,13,(70,150,230)),(13,11,(230,70,60))): q.point((a,b),fill=C4(*c))
    q.rectangle([4,18,5,19],fill=C4(240,240,240)); q.rectangle([8,18,9,19],fill=C4(240,200,60)); q.rectangle([12,18,13,19],fill=C4(230,90,90))
badd('easel',spr(19,25,f_easel),14*T+2,22*T+2,interact='bs_easel',fh=8)
def f_tele(q):
    NECK=C4(226,190,130)
    q.line([(4,26),(1,31)],fill=C4(40,40,46)); q.line([(6,26),(9,31)],fill=C4(40,40,46)); q.line([(5,24),(5,31)],fill=C4(40,40,46))     # stand
    q.rectangle([4,2,6,14],fill=NECK,outline=None); q.line([(3,2),(3,14)],fill=OUT); q.line([(7,2),(7,14)],fill=OUT)
    q.polygon([(3,0),(7,0),(8,2),(7,4),(3,4)],fill=NECK,outline=OUT)                                                                   # plain headstock
    q.polygon([(1,14),(9,14),(10,17),(10,24),(8,27),(2,27),(0,24),(0,17)],fill=C4(200,36,40),outline=OUT)                               # red body
    q.polygon([(2,15),(6,15),(7,19),(6,24),(3,24),(2,20)],fill=C4(24,24,28))                                                           # black pickguard
    q.rectangle([4,22,6,23],fill=C4(200,200,206)); q.line([(5,5),(5,22)],fill=C4(240,240,240)); q.point((8,22),fill=C4(220,220,226)); q.point((8,24),fill=C4(220,220,226))
badd('guitar',spr(11,32,f_tele),18*T+8,22*T+6,interact='bs_guitar',fh=8)
def f_amp(q):
    q.rectangle([0,0,17,17],fill=C4(34,32,36),outline=OUT); q.rectangle([2,5,15,15],fill=C4(120,104,80));
    for yy in range(6,15,2): q.line([(2,yy),(15,yy)],fill=C4(96,82,62))
    q.rectangle([2,1,15,3],fill=C4(200,200,206)); q.point((4,2),fill=C4(230,60,50))
badd('amp',spr(18,18,f_amp),20*T+2,24*T-4,interact='bs_amp',fh=10)
# ---------------- den: bar, couch, recliners, cube, fireplace, TV ----------------
bar2=blk(14,94,(72,132,152,255),(50,96,112,255),fh=5)
badd('bar',bar2,22*T+8,18*T+4,interact='bs_bar',fh=92)
badd('bstool0',P.crop('stool'),21*T+8,18*T+12,interact='bs_stool'); badd('bstool1',P.crop('stool'),21*T+8,21*T+6,interact='bs_stool')
cv_=vrun(vsofa(40,'w',(112,84,60),2),2)
badd('couchV',cv_,23*T+6,17*T+12,interact='bs_couch',fh=cv_.height-6)
def f_cbot(q):
    q.rounded_rectangle([0,0,99,23],3,fill=C4(80,58,40),outline=OUT); q.rounded_rectangle([1,10,98,22],2,fill=C4(134,102,74))
    q.rectangle([1,1,98,9],fill=C4(112,84,60));
    for xx in (34,66): q.line([(xx,2),(xx,9)],fill=C4(80,58,40))
badd('couchH',spr(100,24,f_cbot),23*T+6,22*T+6,interact='bs_couch',fh=20)
def f_recl(q):
    q.rounded_rectangle([0,0,21,23],4,fill=C4(70,74,86),outline=OUT); q.rounded_rectangle([3,8,18,22],3,fill=C4(104,110,126)); q.rectangle([1,1,20,7],fill=C4(90,96,112)); q.rectangle([1,8,3,20],fill=C4(84,88,102)); q.rectangle([18,8,20,20],fill=C4(84,88,102))
badd('rec1',spr(22,24,f_recl),25*T+10,13*T+6,interact='bs_recl',fh=18); badd('rec2',spr(22,24,f_recl),27*T+8,13*T+6,interact='bs_recl',fh=18)
def f_cubetoy(q):
    q.rectangle([1,8,14,21],fill=C4(236,208,160),outline=OUT); q.rectangle([1,8,14,10],fill=C4(60,120,220)); q.rectangle([1,19,14,21],fill=C4(220,60,50)); q.rectangle([1,8,3,21],fill=C4(60,170,80)); q.rectangle([12,8,14,21],fill=C4(240,200,40))
    q.ellipse([5,12,7,14],outline=C4(220,60,50)); q.rectangle([9,12,11,14],outline=C4(60,120,220)); q.polygon([(6,18),(4,15),(8,15)],outline=C4(60,170,80))
    q.arc([2,0,9,10],180,360,fill=C4(60,120,220)); q.arc([6,1,13,11],180,360,fill=C4(220,60,50)); q.point((4,2),fill=C4(240,200,40)); q.point((10,3),fill=C4(60,170,80)); q.point((7,1),fill=C4(220,60,50))
badd('cube',spr(16,22,f_cubetoy),27*T+4,18*T-2,interact='bs_cube',fh=12)
def bfpl(dd):
    for yy in range(4,80,5): dd.line([(1,yy),(11,yy)],fill=(120,60,50,255))
    dd.rectangle([0,24,8,58],fill=(40,36,40,255),outline=OUT)
bfp=blk(13,84,(150,84,70,255),(176,100,84,255),fh=82,lines=bfpl)
badd('fire',bfp,31*T+3,14*T+6,solid=[31*T+3,14*T+7,13,84],interact='bs_fire')
badd('tvstand',blk(40,14,(60,58,66,255),(40,38,46,255),fh=8),29*T+6,24*T+1,interact='bs_tv'); badd('tv',P.crop('tv'),29*T+11,24*T+15-P.crop('tv').height-9+1,solid=None,interact='bs_tv'); BOBJ[-1]['sortY']=BOBJ[-2]['sortY']+1
def f_wg(col):
    def f(q):
        q.rectangle([0,9,4,10],fill=C4(226,190,130)); q.rectangle([1,2,3,9],fill=C4(226,190,130),outline=None); q.line([(0,2),(0,9)],fill=OUT); q.line([(4,2),(4,9)],fill=OUT)
        q.rectangle([0,0,4,2],fill=C4(60,44,30),outline=OUT); q.ellipse([-1,9,5,18],fill=C4(*col),outline=OUT); q.point((2,13),fill=C4(30,30,30))
    return f
badd('wg1',spr(6,19,f_wg((230,170,60))),32*T-7,13*T+2,solid=None,layer='wall',interact='bs_wallguitar')
badd('wg2',spr(6,19,f_wg((60,90,170))),32*T-7,20*T+10,solid=None,layer='wall',interact='bs_wallguitar')
badd('wg3',spr(6,19,f_wg((240,236,220))).rotate(90,expand=True),28*T+2,25*T-6,solid=None,layer='wall',interact='bs_wallguitar')
# the block wall behind the recliners: record clock, tin signs, the animal chart, shelving
def f_clock(q):
    q.ellipse([0,0,17,17],fill=C4(22,22,26),outline=OUT); q.ellipse([5,5,12,12],fill=C4(40,90,60)); q.ellipse([7,7,10,10],fill=C4(250,200,60)); q.line([(8,8),(8,3)],fill=C4(250,250,250)); q.line([(8,8),(12,9)],fill=C4(250,250,250))
badd('clock',spr(18,18,f_clock),24*T+6,11*T-2,solid=None,layer='wall',interact='bs_wall')
def f_sign(c1,c2,w,h):
    return lambda q:(q.rectangle([0,0,w-1,h-1],fill=C4(*c1),outline=OUT),q.rectangle([2,2,w-3,4],fill=C4(*c2)),q.line([(3,7),(w-4,7)],fill=C4(*c2)),q.line([(3,9),(w-6,9)],fill=C4(*c2)))
badd('sign1',spr(9,22,f_sign((60,62,66),(210,210,200),9,22)),23*T+12,11*T-2,solid=None,layer='wall',interact='bs_wall')
badd('sign2',spr(18,20,f_sign((120,160,200),(250,240,220),18,20)),25*T+12,11*T+8,solid=None,layer='wall',interact='bs_wall')
badd('sign3',spr(14,12,f_sign((190,150,90),(90,50,30),14,12)),27*T+2,11*T+0,solid=None,layer='wall',interact='bs_wall')
badd('sign4',spr(16,11,f_sign((40,90,130),(240,210,90),16,11)),27*T+2,11*T+15,solid=None,layer='wall',interact='bs_wall')
def f_chart(q):
    q.rectangle([0,1,21,27],fill=C4(240,232,208),outline=OUT); q.rectangle([0,0,21,1],fill=C4(150,110,70)); q.rectangle([0,27,21,28],fill=C4(150,110,70))
    for r_ in range(4):
        for c_ in range(3): q.rectangle([3+c_*6,5+r_*5,6+c_*6,7+r_*5],fill=C4(*((150,150,150),(110,90,70),(60,60,60),(210,190,170))[(r_+c_)%4])); q.point((7+c_*6,5+r_*5),fill=C4(60,60,60))
badd('chart',spr(22,29,f_chart),28*T+6,11*T-1,solid=None,layer='wall',interact='bs_chart')
def f_shelf(q):
    q.rectangle([0,0,27,3],fill=C4(200,180,150),outline=OUT); q.rectangle([0,14,27,17],fill=C4(200,180,150),outline=OUT)
    for i,c in enumerate(((200,80,70),(80,130,200),(230,200,90),(120,170,110))): q.rectangle([2+i*6,5,6+i*6,13],fill=C4(*c),outline=OUT); q.rectangle([2+i*6,19,6+i*6,26],fill=C4(*c[::-1]),outline=OUT)
badd('wshelf',spr(28,27,f_shelf),30*T+2,11*T+1,solid=None,layer='wall',interact='bs_wall')
# ---------------- kitchenette ----------------
kb=blk(14,92,(222,230,226,255),(120,150,150,255),fh=5,lines=lambda dd:(dd.rectangle([3,34,10,48],fill=(190,206,216,255),outline=(90,130,146,255)),dd.rectangle([6,31,7,34],fill=(170,175,185,255))))
badd('kbar',kb,17*T+1,7*T+2,interact='bs_kbar',fh=90)
badd('minifridge',blk(16,20,(240,240,244,255),(206,206,212,255),fh=13,lines=lambda dd:dd.line([(13,10),(13,16)],fill=(120,120,130,255))),21*T+2,7*T-6,interact='bs_fridge')
badd('freezer',blk(16,30,(240,240,244,255),(206,206,212,255),fh=22,lines=lambda dd:dd.line([(13,12),(13,24)],fill=(120,120,130,255))),22*T+6,7*T-14,interact='bs_fridge')
def f_poster(q):
    q.rectangle([0,0,21,25],fill=C4(30,30,34),outline=OUT); q.rectangle([2,2,19,23],fill=C4(240,236,224))
    q.arc([4,4,17,14],200,340,fill=C4(60,60,60));
    for i in range(5): q.line([(6+i*2,8),(6+i*2,12)],fill=C4(60,60,60))
    q.rectangle([4,16,17,17],fill=C4(200,50,40)); q.rectangle([5,19,16,19],fill=C4(200,50,40)); q.rectangle([7,21,14,21],fill=C4(60,60,60))
badd('poster',spr(22,26,f_poster),19*T+2,5*T+2,solid=None,layer='wall',interact='bs_poster')
# ---------------- bedroom ----------------
def f_kbed(q):
    q.rounded_rectangle([0,0,79,77],3,fill=C4(52,50,58),outline=OUT)                # frame
    q.rectangle([2,2,77,62],fill=C4(86,120,132)); q.rectangle([2,2,77,5],fill=C4(108,146,158)); q.line([(2,40),(77,40)],fill=C4(70,100,112))   # blanket (foot at the top)
    q.rectangle([2,50,77,66],fill=C4(236,236,240))                                # sheet
    q.rounded_rectangle([6,53,36,65],3,fill=C4(250,250,252),outline=C4(190,190,200)); q.rounded_rectangle([43,53,73,65],3,fill=C4(250,250,252),outline=C4(190,190,200))
    q.rectangle([1,67,78,76],fill=C4(40,38,46)); q.line([(1,67),(78,67)],fill=C4(70,68,78))       # headboard at the south wall
badd('bed',spr(80,78,f_kbed),3*T+6,20*T+2,solid=[3*T+7,20*T+8,78,70],interact='bs_bed')
bns2=blk(13,13,(52,50,58,255),(36,34,42,255),fh=6)
badd('bns1',bns2,1*T+8,24*T+2); badd('bns2',bns2,8*T+10,24*T+2)
badd('bdresser',blk(44,17,(52,50,58,255),(36,34,42,255),fh=9,lines=lambda dd:[dd.line([(2+i*14,11),(12+i*14,11)],fill=(120,120,130,255)) for i in range(3)]),3*T+8,16*T-1,interact='bs_dresser')
badd('bshelves',spr(26,22,lambda q:(q.rectangle([0,0,25,21],fill=C4(206,190,160),outline=OUT),q.line([(1,7),(24,7)],fill=OUT),q.line([(1,14),(24,14)],fill=OUT),q.rectangle([3,2,6,6],fill=C4(200,80,70)),q.rectangle([9,9,13,13],fill=C4(80,130,200)),q.rectangle([16,16,21,20],fill=C4(230,200,90)))),7*T+12,14*T+5,solid=None,layer='wall')
# things on the bedroom floor that make a racket when stepped on
badd('sq0',spr(11,7,lambda q:(q.ellipse([0,1,4,5],fill=C4(240,120,60),outline=OUT),q.ellipse([6,1,10,5],fill=C4(240,120,60),outline=OUT),q.rectangle([3,2,7,4],fill=C4(240,120,60)))),8*T+2,17*T+10,solid=None,flat=True)
badd('sq1',spr(10,9,lambda q:(q.polygon([(1,8),(0,2),(4,0),(9,3),(8,8)],fill=C4(230,60,60),outline=OUT),q.line([(2,3),(7,5)],fill=C4(250,220,90)))),6*T+6,18*T+12,solid=None,flat=True)
badd('sq2',spr(9,8,lambda q:(q.ellipse([0,0,8,7],fill=C4(250,220,60),outline=OUT),q.point((3,3),fill=OUT),q.point((6,3),fill=OUT),q.polygon([(4,4),(6,5),(4,6)],fill=C4(240,140,40)))),5*T+2,17*T+2,solid=None,flat=True)
badd('sq3',spr(12,6,lambda q:(q.rectangle([0,0,11,5],fill=C4(150,200,230),outline=OUT),q.line([(2,1),(5,4)],fill=C4(250,250,250)),q.line([(6,1),(9,4)],fill=C4(250,250,250)))),2*T+4,19*T+4,solid=None,flat=True)
# ---------------- the rooms Cam can't get into ----------------
badd('btoilet',P.crop('toilet'),7*T+4,6*T-10,solid=None); badd('btub',blk(28,50,(246,246,250,255),(206,210,220,255),fh=4,lines=lambda dd:dd.rounded_rectangle([3,3,24,42],4,fill=(200,224,238,255),outline=(150,170,190,255))),5*T+2,8*T+8,solid=None)
badd('cvan',blk(40,13,(246,246,248,255),(108,112,120,255),fh=5),1*T+4,6*T-4,solid=None)
badd('crail',spr(44,60,lambda q:[(q.line([(2,4+i*9),(41,4+i*9)],fill=C4(120,90,60)),[q.rectangle([4+j*7,5+i*9,8+j*7,10+i*9],fill=C4(*((90,110,160),(160,90,90),(90,140,100),(150,150,160),(200,170,90))[(i+j)%5])) for j in range(5)]) for i in range(6)]),1*T+2,7*T+10,solid=None,flat=True)
badd('furnace',blk(22,26,(170,172,178,255),(130,132,140,255),fh=18),10*T+3,3*T-8,solid=None); badd('wheater',spr(16,20,lambda q:(q.ellipse([0,0,15,19],fill=C4(226,226,230),outline=OUT),q.ellipse([4,3,11,9],fill=C4(246,246,250)))),11*T+14,3*T+14,solid=None)
badd('washer',blk(15,18,(246,246,250,255),(214,214,222,255),fh=10,lines=lambda dd:dd.ellipse([4,9,10,15],fill=(120,150,190,255),outline=(90,90,100,255))),11*T+1,20*T+2,solid=None); badd('dryer',blk(15,18,(246,246,250,255),(214,214,222,255),fh=10,lines=lambda dd:dd.ellipse([4,9,10,15],fill=(60,60,70,255),outline=(90,90,100,255))),12*T+0,20*T+2,solid=None)
badd('tread',blk(22,62,(50,50,56,255),(30,30,34,255),fh=4,lines=lambda dd:dd.rectangle([3,8,18,54],fill=(80,80,88,255))),29*T+2,4*T,solid=None); badd('scab',blk(30,16,(214,170,110,255),(170,126,76,255),fh=9),27*T,3*T-6,solid=None)
badd('sshelf',blk(14,60,(200,180,150,255),(150,130,100,255),fh=4,lines=lambda dd:[dd.rectangle([2,4+i*9,11,10+i*9],fill=((200,80,70,255),(80,130,200,255),(230,200,90,255),(120,170,110,255))[i%4],outline=OUT) for i in range(6)]),25*T+1,4*T,solid=None)
for k,dd_ in BDOORS.items():
    badd('door_'+k[2:],DOORIMG,dd_['x']*T+1,dd_['y']*T+(32-DOORIMG.height),solid=[dd_['x']*T,(dd_['y']+1)*T,T,T],layer='door',door=k,interact='bs_door')
badd('stairsUp',Image.new('RGBA',(30,10),(0,0,0,0)),14*T+1,5*T,solid=None,flat=True,interact='bs_stairs')
b_solid=[[1 if bg[y,x] in '#f ' else 0 for x in range(BW)] for y in range(BH)]
for x in (14,15): b_solid[4][x]=1
