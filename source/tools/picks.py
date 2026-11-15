import json
from PIL import Image
SH={'BED':'4_Bedroom','LR':'2_LivingRoom','KI':'12_Kitchen','BA':'3_Bathroom','GE':'1_Generic','MU':'6_Music_and_sport'}
_im={}; _bx={}
def sheet(k):
    if k not in _im: _im[k]=Image.open(f'bs/{SH[k]}_Black_Shadow_16x16.png').convert('RGBA')
    return _im[k]
def boxes(k):
    if k not in _bx: _bx[k]=json.load(open(f'seg/{SH[k]}.json'))
    return _bx[k]
def at(k,x,y):
    best=None
    for b in boxes(k):
        if b[0]<=x<b[2] and b[1]<=y<b[3]:
            a=(b[2]-b[0])*(b[3]-b[1])
            if best is None or a<best[0]: best=(a,b)
    return best[1] if best else None
P={ # name: (sheet, point) or (sheet, rect4)
 'crib':('BED',(13,413)),'teddy':('BED',(15,45)),'rug_oval':('BED',(80,130)),'dresser_tall':('BED',(216,166)),
 'changing':('BED',(216,210)),'tv':('BED',(159,213)),'nightstand':('BED',(7,1158)),'dresser_small':('BED',(15,516)),
 'plant':('LR',(175,23)),'floorlamp':('LR',(183,166)),'sideboard':('LR',(96,191)),'cabinets3':('LR',(23,223)),
 'booktable':('LR',(63,230)),'bookshelf':('LR',(173,407)),'vsofa':('LR',(66,547)),'armchair':('LR',(213,650)),
 'fireplace':('LR',[64,384,96,424]),'sofa':('LR',[16,452,64,480]),
 'table':('GE',(31,98)),'coffeetable':('GE',(103,113)),'rug_big':('GE',(176,135)),'rug_small':('GE',(160,178)),
 'chair_l':('GE',(72,195)),'chair_r':('GE',(87,195)),'door':('GE',(8,662)),'door_win':('GE',(8,693)),'window':('GE',(112,705)),
 'doormat':('GE',(23,720)),'window_curt':('GE',(103,787)),'stairs':('GE',(183,883)),
 'toilet':('BA',(168,23)),'vanity':('BA',(128,110)),'shower':('BA',(145,267)),'bathmat':('BA',(15,465)),
 'coffeemaker':('KI',(168,100)),'sinkctr':('KI',(143,118)),'stove':('KI',(140,190)),'stool':('KI',(8,185)),
 'fridge':('KI',[144,370,160,418]),
}
def rect(name):
    k,p=P[name]
    return k,(p if len(p)==4 else at(k,*p))
def crop(name):
    k,r=rect(name); return sheet(k).crop(tuple(r))
if __name__=='__main__':
    from PIL import ImageDraw
    ims=[(n,crop(n)) for n in P]
    W=900; x=y=0; rowh=0; pos=[]
    for n,im in ims:
        if x+im.width*2+10>W: x=0; y+=rowh+18; rowh=0
        pos.append((n,im,x,y)); x+=max(im.width*2,60)+10; rowh=max(rowh,im.height*2)
    c=Image.new('RGBA',(W,y+rowh+20),(200,200,210,255)); d=ImageDraw.Draw(c)
    for n,im,x,y in pos:
        c.alpha_composite(im.resize((im.width*2,im.height*2),Image.NEAREST),(x,y+12)); d.text((x,y),n,fill='black')
    c.save('/tmp/picks.png')
    for n in P: print(n, rect(n))
