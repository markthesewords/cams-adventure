from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1280,'height':720})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(900); ev=pg.evaluate; press=pg.keyboard.press; press('z')
    for i in range(160):
        if ev("S.dlg?1:0"): press('z')
        elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg&&!S.cut"): break
        pg.wait_for_timeout(250)
    ev("P.x=94;P.y=322;P.dir='down';S.snapCam=true"); pg.wait_for_timeout(400); ev("void runHandler('bs_bed')"); pg.wait_for_timeout(3500)
    for i in range(40):
        if not ev("S.mini&&S.mini.bed&&!S.mini.G.done?1:0"): break
        pg.keyboard.down('z'); pg.wait_for_timeout(800); pg.keyboard.up('z'); pg.wait_for_timeout(700)
        if i==1: pg.screenshot(path='/tmp/shots/bd_0.png')
    n=1
    for i in range(70):
        pg.wait_for_timeout(500)
        if i%3==0 or ev("S.dlg?1:0") or ev("document.activeElement&&document.activeElement.tagName==='INPUT'?1:0"):
            if n<12: pg.screenshot(path=f'/tmp/shots/bd_{n}.png'); n+=1
        if ev("S.dlg?1:0"): pg.wait_for_timeout(700); press('z')
        if ev("S.lock===0&&!S.dlg&&!S.mini&&S.fade<0.05&&!S.cut"): break
    print(ev("JSON.stringify({bs:S.flags.bs,P:[P.x|0,P.y|0],v:[NPC.vinny.visible,NPC.vinny.follow]})"),errs); b.close()
