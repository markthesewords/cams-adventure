import time,sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','nap')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(60):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        pg.wait_for_timeout(250)
    DRIVE_TO="(()=>{ const T=%s; const p=findPath(P.x,P.y,T[0],T[1]); const t=p&&p.length?p[0]:T; const dx=t[0]-P.x, dy=t[1]-P.y; K.b=true; K.left=dx<-1.5; K.right=dx>1.5; K.up=dy<-1.5; K.down=dy>1.5; return Math.hypot(T[0]-P.x,T[1]-P.y); })()"
    for mode in ['hide','flip']:
        ev("msFlags().phone=false; MS.ch=null; for(const k in K) K[k]=false; P.x=344; P.y=123.5; P.dir='down'; S.snapCam=true"); pg.wait_for_timeout(400); ev("pressed.a=true"); t0=time.time(); seen=[]
        while time.time()-t0<60:
            pg.wait_for_timeout(120)
            if ev("S.dlg?1:0"): ev("pressed.a=true"); continue
            m=ev("MS.mode?MS.mode.id:null")
            if m and m not in seen: seen.append(m); pg.screenshot(path=f'/tmp/shots/ch_{mode}_{m}.png')
            if m=='chase':
                if mode=='hide':
                    d=ev(DRIVE_TO%"MS_PANTRY()")
                    if d<6: ev("for(const k in K) K[k]=false")
                else:
                    ev("MS.mode.limit=1.2; MS.mode.e.pathSpeed=10")
            elif m=='flip': ev(DRIVE_TO%"[MS.mode.e.x,MS.mode.e.y]")
            elif not m: ev("for(const k in K) K[k]=false")
            if ev("!!S.flags.ms.phone") and not ev("S.cut"): break
        pg.screenshot(path=f'/tmp/shots/ch_{mode}_end.png'); print(mode,seen,round(time.time()-t0,1),'ach',ev("JSON.stringify(Object.keys(META.ach))"),'P',ev("JSON.stringify([Math.round(P.x),Math.round(P.y),P.visible])"),errs[-2:]); pg.wait_for_timeout(3000)
    b.close()
