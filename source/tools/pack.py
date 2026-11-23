import re
src='/home/claude/game/src/'
h=open(src+'shell.html').read()
h=h.replace('/*ASSETS*/',open('/home/claude/game/build/assets.js').read()+'\n'+open(src+'faces.js').read()+'\n'+open(src+'songs.js').read())
h=h.replace('/*ENGINE*/',open(src+'engine.js').read()).replace('/*STORY*/',open(src+'story.js').read()+'\n'+open(src+'cub.js').read()+'\n'+open(src+'walk.js').read()+'\n'+open(src+'park.js').read()+'\n'+open(src+'midday.js').read()+'\n'+open(src+'bsmt.js').read()+'\n'+open(src+'evening.js').read()+'\n'+open(src+'mischief.js').read()+'\n'+open(src+'minis.js').read()+'\n'+open(src+'lb.js').read())
open('/home/claude/game/build/Cams_Adventure.html','w').write(h); print(len(h)//1024,'KB')

import shutil; shutil.copy('/home/claude/game/build/Cams_Adventure.html','/home/claude/game/site/public/index.html')
