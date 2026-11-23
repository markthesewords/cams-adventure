from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for mode in ['five','one','elsewhere','keys']:
        ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate; cdp=ctx.new_cdp_session(pg)
        def tap(x,y,w=150): cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':0}]}); pg.wait_for_timeout(50); cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); pg.wait_for_timeout(w)
        pg.goto('file:///home/claude/game/build/Cams_Adventure.html'); pg.wait_for_timeout(1300)
        r=ev("(()=>{const r=document.getElementById('c').getBoundingClientRect(); return [r.left+r.width/2, r.top+70/VH*r.height, r.top+150/VH*r.height]})()")
        if mode=='five':
            for i in range(5): tap(r[0],r[1])
        elif mode=='one': tap(r[0],r[1])
        elif mode=='elsewhere': tap(r[0],r[2])
        else: pg.keyboard.type('camdev')
        pg.wait_for_timeout(2200)
        print(mode,'-> title',ev("!!S.title"),'dev menu',ev("!!(S.mini&&S.mini.taps&&S.mini.dpad)"),'choices',ev("S.dlg&&S.dlg.choices"),errs); ctx.close()
    b.close()
