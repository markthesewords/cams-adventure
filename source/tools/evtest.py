import os
from playwright.sync_api import sync_playwright
PH=bool(os.environ.get('PHONE')); sfx='_ph' if PH else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport=({'width':390,'height':844} if PH else {'width':1280,'height':720}),has_touch=PH,is_mobile=PH)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate; press=pg.keyboard.press
    n=[0]; clips=[]
    def shot(t): pg.screenshot(path=f'/tmp/shots/ev_{n[0]:02d}_{t}{sfx}.png'); n[0]+=1
    def run(maxn,tag,every=6):
        for i in range(maxn):
            c=ev("(()=>{const r=[];for(const k in NPC){const e=NPC[k]; if(e.visible&&!e.dog&&!S.noCollide&&!boxFree(e.x,e.y)) r.push(k+'@'+Math.round(e.x)+','+Math.round(e.y)+(e.path?'m':'s'));} return r.join(' ')})()")
            if c: clips.append(tag+':'+c)
            if ev("S.dlg?1:0"): shot(tag+'_dlg'); pg.wait_for_timeout(300); press('z')
            elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): return True
            elif i%every==0: shot(tag)
            pg.wait_for_timeout(300)
        return False
    # part 1: end of the basement
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(900); press('z')
    for i in range(160):
        if ev("S.dlg?1:0"): press('z')
        elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): break
        pg.wait_for_timeout(250)
    ev("(()=>{ S.flags.bs={guitar:true,cube:true,bed:true}; const v=NPC.vinny; v.visible=true; v.x=290; v.y=330; P.x=BS.throne[0]; P.y=BS.throne[1]; P.lift=4; P.zBias=4; P.dir='down'; NPC.nick.seated=false; NPC.nick.x=BS.throne[0]+22; NPC.nick.y=BS.throne[1]+12; S.goal=''; S.cut=true; emoryIsHere().then(()=>{S.cut=false}); })()")
    print('up',run(200,'a',5), ev("JSON.stringify({ch:S.chapter,map:S.map,goal:S.goal,t:S.targets,P:[P.x|0,P.y|0],glow:goalThings().length})")); shot('goal')
    print('free spots',ev("JSON.stringify(Object.keys(NPC).filter(k=>NPC[k].visible&&!boxFree(NPC[k].x,NPC[k].y)))"))
    # walk to the door by hand: handler
    ev("void runHandler('npc_ryan',NPC.ryan)"); pg.wait_for_timeout(700); shot('ryan'); press('z'); pg.wait_for_timeout(400)
    ev("void runHandler('slider')")
    print('yard',run(80,'y',3), ev("JSON.stringify({map:S.map,goal:S.goal,P:[P.x|0,P.y|0],e:[NPC.emory.x|0,NPC.emory.y|0]})")); shot('yard')
    # walk around: down the west steps to the patio, then to the slide
    for k,ms in [('ArrowLeft',2600),('ArrowUp',600),('ArrowLeft',2500)]:
        pg.keyboard.down(k); pg.wait_for_timeout(ms); pg.keyboard.up(k)
    shot('patio'); print('pos',ev("JSON.stringify([P.x|0,P.y|0])"))
    ev("void runHandler('y_slide')"); 
    for i in range(12): pg.wait_for_timeout(420); shot('slide')
    run(30,'s2'); ev("P.x=300;P.y=300;S.snapCam=true"); pg.wait_for_timeout(2500); shot('lawn')
    ev("P.x=470;P.y=380;S.snapCam=true"); pg.wait_for_timeout(600); shot('garage'); ev("P.x=120;P.y=60;S.snapCam=true"); pg.wait_for_timeout(600); shot('nw')
    print(ev("JSON.stringify({sv:JSON.parse(localStorage.getItem('camAdventure_v2')).ch})"))
    print('clips',sorted(set(clips))[:12]); print('errs',errs); b.close()
