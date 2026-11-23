from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(1200); pg.keyboard.press('z')
    for i in range(80):
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        elif ev("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg&&!S.cut"): break
        pg.wait_for_timeout(250)
    o=ev("JSON.stringify(MAPD.objs.filter(o=>o.interact==='bs_tread').map(o=>[o.x,o.y,o.w,o.h]))"); print('tread obj',o)
    ev("P.x=24*16-6; P.y=9*16+4; P.dir='right'"); pg.wait_for_timeout(300); print('free',ev("boxFree(P.x,P.y)"))
    ev("pressed.a=true"); 
    for i in range(160):
        if ev("S.mini&&S.mini.G&&S.mini.G.state==='teach'?1:0"): pg.locator('#c').screenshot(path='/tmp/shots/hk_tread.png'); print('treadmill started'); ev('pressed.left=true'); break
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        pg.wait_for_timeout(200)
    for i in range(200):
        if ev("S.mini&&S.mini.G&&S.mini.G.state!=='done'?1:0"): pg.wait_for_timeout(200); continue
        if ev("S.dlg?1:0"): ev("pressed.a=true")
        if ev("S.mini&&S.mini.full?1:0"): ev("pressed.a=true")
        if ev("!S.mini&&!S.dlg&&!S.cut&&S.fade<0.05?1:0") and i>5: break
        pg.wait_for_timeout(250)
    print('best',ev("JSON.stringify(META.best)"),ev("JSON.stringify(META.plays)"),errs); b.close()
