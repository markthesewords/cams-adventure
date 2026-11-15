import numpy as np
W,H=33,26
g=np.full((H,W),'#',dtype='<U1'); room=np.full((H,W),'',dtype=object)
def fill(x0,y0,x1,y1,ch,r=None):
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            g[y,x]=ch
            if r is not None: room[y,x]=r
fill(1,1,7,2,'f','cam');   fill(1,3,7,8,'.','cam')
fill(9,1,12,2,'f','bath'); fill(9,3,12,8,'.','bath'); fill(9,6,9,8,'#','')      # Cam's closet block
fill(14,1,15,2,'f','entry'); fill(14,3,15,4,'.','entry')
fill(14,6,15,8,'.','stairs'); g[5,14]='.'; room[5,14]='stairs'
fill(17,1,31,2,'f','kitchen'); fill(17,3,31,9,'.','kitchen'); fill(17,9,23,9,'#','')
g[4,16]='.'; room[4,16]='kitchen'
fill(7,10,15,11,'f','hall'); fill(7,12,15,13,'.','hall')
g[12,16]='.'; g[13,16]='.'; room[12,16]=room[13,16]='hall'
fill(17,10,23,11,'f','living'); fill(24,10,31,11,'.','living'); fill(17,12,31,24,'.','living')
fill(1,15,7,16,'f','bed'); fill(1,17,7,24,'.','bed')
fill(9,15,14,16,'f','office'); fill(9,17,15,24,'.','office'); fill(15,18,15,19,'f','office'); g[17,15]='#'
DOORS={
 'cam':   dict(x=7,  y=10, wall=(7,9),  open=False),
 'bath':  dict(x=10, y=10, wall=(10,9), open=True),
 'bed':   dict(x=7,  y=15, wall=(7,14), open=True),
 'office':dict(x=12, y=15, wall=(12,14),open=True),
}
for d in DOORS.values():
    x,y=d['wall']; g[y,x]='.'; room[y,x]='door'
    g[d['y'],d['x']]='.'; g[d['y']+1,d['x']]='.'; room[d['y'],d['x']]=room[d['y']+1,d['x']]='door'
HARD=(4,12); MAPLE=(0,12)
FLOORS={'cam':HARD,'bath':(0,6),'entry':MAPLE,'stairs':MAPLE,'kitchen':MAPLE,'hall':HARD,'living':HARD,'bed':HARD,'office':(0,22),'door':HARD}
WALLS={'cam':(1,6),'bath':(1,2),'entry':(1,6),'kitchen':(1,6),'hall':(1,6),'living':(1,6),'bed':(1,6),'office':(23,24)}
