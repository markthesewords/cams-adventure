import sys,json,numpy as np
from PIL import Image,ImageDraw
from scipy import ndimage
p,out,key=sys.argv[1],sys.argv[2],sys.argv[3]
im=Image.open(p).convert('RGBA'); a=np.array(im)[:,:,3]>0
lab,k=ndimage.label(a,structure=np.ones((3,3)))
objs=ndimage.find_objects(lab)
boxes=[]
for i,s in enumerate(objs):
    y0,y1=s[0].start,s[0].stop; x0,x1=s[1].start,s[1].stop
    if (y1-y0)*(x1-x0)<6: continue
    boxes.append((x0,y0,x1,y1))
boxes.sort(key=lambda b:(b[1]//16,b[0]))
json.dump(boxes,open(f'seg/{key}.json','w'))
S=3; H=im.height; step=300
for ci,yy in enumerate(range(0,H,step)):
    crop=im.crop((0,yy,im.width,min(H,yy+step)))
    bg=Image.new('RGBA',crop.size,(200,200,210,255)); bg.alpha_composite(crop)
    bg=bg.resize((bg.width*S,bg.height*S),Image.NEAREST); d=ImageDraw.Draw(bg)
    for i,(x0,y0,x1,y1) in enumerate(boxes):
        if y1<yy or y0>yy+step: continue
        d.rectangle([x0*S,(y0-yy)*S,x1*S-1,(y1-yy)*S-1],outline=(255,0,0))
        d.text((x0*S+1,(y0-yy)*S+1),str(i),fill=(0,0,255))
    bg.save(f'seg/{key}_{ci}.png')
print(len(boxes), (H+step-1)//step)
