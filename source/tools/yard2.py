import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate
    def shot(n): pg.locator('#c').screenshot(path=f'/tmp/shots/y2_{n}.png')
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','yard')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(80):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("S.map==='yard'&&!S.cut&&!!S.tick") and i>8: break
        pg.wait_for_timeout(250)
    ev("S.flags.kirby=true; S.flags.poop=true")
    ev("P.x=190;P.y=560;S.snapCam=true"); pg.wait_for_timeout(400); shot('patio')
    ev("P.x=392;P.y=545;S.snapCam=true"); pg.wait_for_timeout(400); shot('deck')
    # downspout: walk left into it
    ev("P.x=135;P.y=576;S.snapCam=true"); pg.wait_for_timeout(300); ev("K.left=true"); pg.wait_for_timeout(900); ev("K.left=false")
    pg.wait_for_timeout(700); shot('spout_fall'); 
    for i in range(30):
        pg.wait_for_timeout(250)
        if not ev("S.cut"): break
    shot('spout_after'); print('spout', ev("JSON.stringify([S.flags.spout, hidden.has('y_spout'), hidden.has('y_spoutDown'), S.cut])"))
    # slide choice
    ev("(()=>{const o=DATA_YARD.objs.find(q=>q.id==='y_slide'); P.x=o.x+o.w/2; P.y=o.y+o.h+4; P.dir='up'; S.snapCam=true;})()"); pg.wait_for_timeout(300)
    print('probe',ev("JSON.stringify(probe())")); ev("pressed.a=true"); t0=time.time(); got=set()
    while time.time()-t0<25:
        pg.wait_for_timeout(200)
        if ev("!!(S.dlg&&S.dlg.choices)") and 'c' not in got:
            got.add('c'); pg.wait_for_timeout(700); shot('slide_choice'); ev("S.dlg.sel=1; pressed.a=true"); continue
        if ev("S.dlg?1:0"):
            if 'd' not in got: got.add('d'); shot('dad_yell')
            ev("pressed.a=true")
        if not ev("S.cut") and 'c' in got: break
    print('slide', got, round(time.time()-t0,1))
    # Kirby closeup
    ev("S.flags.kirby=false; P.x=260;P.y=90;P.dir='up';S.snapCam=true"); pg.wait_for_timeout(300); ev("P.y=76")
    pg.wait_for_timeout(3500); shot('kirby_close')
    for i in range(80):
        pg.wait_for_timeout(300)
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if i==14: shot('kirby_fence')
        if ev("S.flags.kirby&&!S.cut&&!YD.busy"): break
    print(errs); b.close()
