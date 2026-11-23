import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.on('console',lambda m:errs.append(m.text[:200]) if m.type=='error' else None); ev=pg.evaluate
    def shot(n): pg.locator('#c').screenshot(path=f'/tmp/shots/yd_{n}.png')
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(800); ev("sessionStorage.setItem('cam_warp','yard')"); pg.reload(); pg.wait_for_timeout(1500); ev("pressed.a=true")
    for i in range(80):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("S.map==='yard'&&!S.cut&&!!S.tick") and i>8: break
        pg.wait_for_timeout(250)
    print('yard', ev("JSON.stringify([S.map,S.cut,YD.poops.map(p=>[Math.round(p.x),Math.round(p.y)])])"))
    # 1. slide: walk to the slide and press A, choose shake
    ev("(()=>{const o=DATA_YARD.objs.find(q=>q.id==='y_slide'); P.x=o.x+o.w/2; P.y=o.y+o.h+8; P.dir='up';})()"); pg.wait_for_timeout(300); ev("pressed.a=true"); t0=time.time(); shotd=set()
    while time.time()-t0<25:
        pg.wait_for_timeout(200)
        if ev("!!(S.dlg&&S.dlg.choices)") and 'c' not in shotd:
            shotd.add('c'); pg.wait_for_timeout(700); shot('slide_choice'); ev("S.dlg.sel=1; pressed.a=true"); continue
        if ev("S.dlg?1:0"):
            if 'd' not in shotd: shotd.add('d'); shot('dad_yell')
            ev("pressed.a=true")
        if not ev("S.cut") and 'c' in shotd: break
    print('slide done', round(time.time()-t0,1), ev("NPC.nick.visible"), errs[-2:])
    pg.wait_for_timeout(1500)
    # 2. Kirby: walk Cam to the back fence (avoid poops)
    ev("YD.poops.forEach(p=>p.y+=0); P.x=260; P.y=90; P.dir='up'")
    pg.wait_for_timeout(200); ev("P.y=76")
    t0=time.time(); k=0
    while time.time()-t0<40:
        pg.wait_for_timeout(300); k+=1
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if k==8: shot('kirby1')
        if k==25: shot('kirby_run')
        if ev("S.flags.kirby&&!S.cut&&!YD.busy"): break
    shot('kirby_end'); print('kirby done', round(time.time()-t0,1), 'vinny follow', ev("NPC.vinny.follow"), errs[-2:])
    # 3. poop
    ev("(()=>{ const p=YD.poops[0]; P.x=p.x; P.y=p.y+12; })()"); pg.wait_for_timeout(200); ev("(()=>{ const p=YD.poops[0]; P.x=p.x; P.y=p.y+2; })()")
    t0=time.time(); k=0
    while time.time()-t0<40:
        pg.wait_for_timeout(300); k+=1
        if ev("S.dlg?1:0"):
            shot('poop_mom'); ev("pressed.a=true")
        if ev("S.flags.poop&&!S.cut&&!NPC.grace.visible"): break
    shot('poop_end'); print('poop done', round(time.time()-t0,1), ev("JSON.stringify(YD.poops.map(p=>!!p.gone))"), errs); b.close()
