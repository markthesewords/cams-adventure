from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#bsmt'); pg.wait_for_timeout(1000)
    cdp=ctx.new_cdp_session(pg)
    def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
    def tap(x,y): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(60); touch('touchEnd',[]); pg.wait_for_timeout(150)
    pg.screenshot(path='/tmp/shots/st_title.png'); tap(200,200)
    for i in range(160):
        if pg.evaluate("S.dlg?1:0"): tap(200,300)
        elif pg.evaluate("S.lock===0&&S.fade<0.05&&!S.mini&&!S.dlg"): break
        pg.wait_for_timeout(250)
    st=lambda: pg.evaluate("JSON.stringify({x:P.x|0,y:P.y|0,run:!!P.running,mv:!!P.moving,dir:P.dir,K:['up','down','left','right','run'].filter(k=>K[k])})")
    print('free',st()); pg.screenshot(path='/tmp/shots/st_idle.png')
    # short drag right from the game picture: walk
    touch('touchStart',[(0,200,250)]); pg.wait_for_timeout(80); touch('touchMove',[(0,225,250)]); pg.wait_for_timeout(700); print('walk right',st()); pg.screenshot(path='/tmp/shots/st_walk.png')
    touch('touchMove',[(0,260,250)]); pg.wait_for_timeout(600); print('run right',st()); pg.screenshot(path='/tmp/shots/st_run.png')
    touch('touchMove',[(0,330,250)]); pg.wait_for_timeout(300); touch('touchMove',[(0,300,250)]); pg.wait_for_timeout(300); print('ring trailed, back 30px ->',st())
    touch('touchMove',[(0,270,290)]); pg.wait_for_timeout(400); print('down-left?',st())
    touch('touchEnd',[]); pg.wait_for_timeout(300); print('released',st())
    # drag from the empty area under the game, while a second finger holds B
    touch('touchStart',[(0,120,560)]); pg.wait_for_timeout(60); touch('touchMove',[(0,120,535)]); pg.wait_for_timeout(500); print('up from below',st())
    touch('touchEnd',[]); pg.wait_for_timeout(200)
    x0=pg.evaluate("P.x"); tap(200,250); pg.wait_for_timeout(300); print('tap moved?',abs(pg.evaluate("P.x")-x0)<1, 'dlg/bubble after tap near nothing ok')
    print(errs); b.close()
