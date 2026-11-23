import time, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','nap')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(80):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("document.body.dataset.mode")=='walk' and i>10: break
        pg.wait_for_timeout(250)
    print('state',ev("JSON.stringify([S.chapter,S.goal,NPC.vinny.lie,NPC.vinny.x,NPC.vinny.y,!!NPC.vinny.perch])"))
    # 1: Cam standing just in front of Vinny on the top sofa
    ev("(()=>{const v=NPC.vinny; v.x=392;v.y=285;v.perch=null;v.dir='left'; P.x=398;P.y=294;P.dir='up'; S.snapCam=true; VR.t=-999;})()"); pg.wait_for_timeout(500)
    pg.locator('#c').screenshot(path='/tmp/shots/vin_front.png')
    # each spot and pose
    for i in range(8):
        for pose in (['arm'] if i in (0,2,3,5,6) else ['curl','sprawl','belly']):
            ev(f"(()=>{{const v=NPC.vinny, q=VSPOTS[{i}]; v.x=q.lx; v.y=q.ly; v.dir=q.dir||'left'; v.lie=true; v.perch={{sofa:q.sofa,lx:v.x,ly:v.y,cx:q.cx,cy:q.cy,rot:q.rot,pose:'{pose}'}}; P.x=440; P.y=q.ly; S.snapCam=true; VR.t=-999; }})()")
            pg.wait_for_timeout(250); pg.locator('#c').screenshot(path=f'/tmp/shots/vin_{i}_{pose}.png')
    # roaming
    ev("(()=>{const v=NPC.vinny; v.x=392;v.y=285;v.dir='left'; v.perch=null; S.camFocus=null; P.x=460; P.y=330; VR.t=0; VR.next=1;})()"); t0=time.time(); seen=[]
    while time.time()-t0<60 and len(seen)<4:
        pg.wait_for_timeout(500); q=ev("JSON.stringify(NPC.vinny.lie&&NPC.vinny.perch?[NPC.vinny.perch.sofa,NPC.vinny.perch.cx,NPC.vinny.perch.pose]:null)")
        if q!='null' and (not seen or seen[-1]!=q): seen.append(q); ev("VR.next=1")
    print('roamed',seen,round(time.time()-t0,1),errs); b.close()
