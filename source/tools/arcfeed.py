from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1200)
    ev("void (S.title=false, window.__d=0, arcPlay('feed').then(()=>window.__d=1))")
    for i in range(400):
        if ev("window.__d"): break
        if ev("MS.mode&&MS.mode.id==='feedrace'&&!P.path?1:0"): ev("(()=>{const q=findPath(P.x,P.y,468,152); walk(P,q||[[468,152]],62);})()")
        ev("pressed.a=true"); pg.wait_for_timeout(250)
    print(ev("window.__d"),ev("JSON.stringify(META.best)"),errs); b.close()
