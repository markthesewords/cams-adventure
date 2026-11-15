from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for run in range(3):
        ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); ev=pg.evaluate; cdp=ctx.new_cdp_session(pg)
        def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
        def tap(x,y,w=220): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(60); touch('touchEnd',[]); pg.wait_for_timeout(w)
        pg.goto('file:///home/claude/game/build/Cams_Adventure.html#nap'); pg.wait_for_timeout(1300); tap(200,500,400)
        for i in range(60):
            m=ev("document.body.dataset.mode")
            if m=='walk': break
            if m=='pick': ev("pressed.a=true")
            elif ev("S.dlg?1:0"): tap(200,650)
            pg.wait_for_timeout(300)
        pg.wait_for_timeout(1200)
        r=ev("(()=>{const f=document.getElementById('face'); const r=f.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,!!f.offsetParent,document.body.dataset.mode]})()")
        for i in range(5): tap(r[0],r[1],150)
        pg.wait_for_timeout(1500); print(run,r,'dev',ev("localStorage.getItem('cam_dev')"),'title',ev("!!S.title"),'taps',ev("devTaps.length")); ctx.close()
    b.close()
