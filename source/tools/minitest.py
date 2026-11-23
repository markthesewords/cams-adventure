from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1500)
    shot=lambda n: pg.locator('#c').screenshot(path='/tmp/shots/'+n+'.png')
    # treadmill: tap alternately for ~8s, then stop and let him fly off
    ev("void (S.title=false, S.dlg=null, window.__r=null, treadGame(0).then(r=>window.__r=r))"); pg.wait_for_timeout(600); shot('tr_teach')
    for i in range(50): ev("pressed.%s=true"%('left' if i%2==0 else 'right')); pg.wait_for_timeout(110)
    shot('tr_run'); print('tread mid',ev("JSON.stringify([S.mini.G.p.toFixed(2),S.mini.G.v.toFixed(2),S.mini.G.dist.toFixed(1)])"))
    pg.wait_for_timeout(5000); shot('tr_fly'); pg.wait_for_timeout(4000); print('tread',ev("JSON.stringify(window.__r)"))
    # diaper
    ev("void (window.__r=null, diaperGame(0).then(r=>window.__r=r))"); pg.wait_for_timeout(800); shot('dp_start')
    for i in range(40): ev("pressed.right=true"); pg.wait_for_timeout(90)
    shot('dp_roll'); 
    for i in range(400):
        if ev("!!window.__r"): break
        pg.wait_for_timeout(100)
        if i==30: shot('dp_mid')
    print('diaper',ev("JSON.stringify(window.__r)"))
    # fling
    ev("void (window.__r=null, flingGame(0).then(r=>window.__r=r))"); pg.wait_for_timeout(800); shot('fl_start')
    for i in range(10):
        # aim at Vinny's mouth
        ev("(()=>{const G=S.mini.G; const W=VW, lx0=W*0.30,lx1=W*0.95; G.dadPhase='back'; G.dad=0; G.dadT=9; G.pw=Math.max(0,Math.min(1,((G.vx+(G.face>0?0.075:-0.075))*W-lx0)/(lx1-lx0))); G.vwait=2; pressed.a=true;})()"); pg.wait_for_timeout(250)
        if i==0: shot('fl_fly')
        pg.wait_for_timeout(600)
    for i in range(60):
        if ev("!!window.__r"): break
        pg.wait_for_timeout(100)
    print('fling',ev("JSON.stringify(window.__r)"))
    # dressed
    ev("void (window.__r=null, dressGame(0,'dino').then(r=>window.__r=r))"); pg.wait_for_timeout(700); shot('dr_start')
    for i in range(5):
        for j in range(200):
            if ev("Math.abs(Math.sin(S.mini.G.t*2.2+S.mini.G.ph)*0.85+Math.sin(S.mini.G.t*2.2*1.73+S.mini.G.ph*2)*0.3)<0.1"): break
            pg.wait_for_timeout(16)
        if i==2: shot('dr_arm')
        ev("pressed.a=true"); pg.wait_for_timeout(300)
    for i in range(60):
        if ev("!!window.__r"): break
        pg.wait_for_timeout(100)
    print('dress',ev("JSON.stringify(window.__r)"),errs); b.close()
