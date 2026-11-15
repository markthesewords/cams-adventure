from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); errs=[]
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); ev=pg.evaluate; cdp=ctx.new_cdp_session(pg)
    def touch(kind,pts): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for (i,x,y) in pts]})
    def tap(x,y,w=220): touch('touchStart',[(0,x,y)]); pg.wait_for_timeout(60); touch('touchEnd',[]); pg.wait_for_timeout(w)
    def cv(x,y): r=ev("(()=>{const r=document.getElementById('c').getBoundingClientRect(); return [r.left,r.top,r.width,r.height,VW,VH]})()"); return (r[0]+x/r[4]*r[2], r[1]+y/r[5]*r[3])
    def tile(i):
        L=ev("(()=>{const n=DEV_LIST.length,cols=VW>=300?4:2, rows=Math.ceil(n/cols), g=n>12?2:4, w=Math.floor((VW-12-(cols-1)*4)/cols), h=Math.min(52,Math.floor((VH-58-(rows-1)*g)/rows)); return [cols,w,h,g]})()")
        return cv(6+(i%L[0])*(L[1]+4)+L[1]/2, 28+(i//L[0])*(L[2]+L[3])+L[2]/2)
    ids=None
    def menu():
        for i in range(40):
            if ev("!!(S.title)"): tap(200,500,500)
            if ev("!!(S.mini&&S.mini.taps&&S.mini.dpad&&!S.dlg)") and ev("typeof DEV_LIST!='undefined'"): return True
            pg.wait_for_timeout(200)
        return False
    pg.goto('file:///home/claude/game/build/Cams_Adventure.html#dev'); pg.wait_for_timeout(1300); print('menu',menu()); pg.screenshot(path='/tmp/shots/dev_menu.png'); ids=ev("DEV_LIST.map(a=>a.id)")
    for t in ['bsmt','yard','park','emory','cub','walk','ch1']:
        tap(*tile(ids.index(t))); pg.wait_for_timeout(800)
        for i in range(40):
            try:
                if ev("typeof S!='undefined'&&S.title&&!!S.titleRes"): break
            except Exception: pass
            pg.wait_for_timeout(200)
        tap(200,500,300); pg.wait_for_timeout(5000)
        print(t,'-> chapter',ev("S.chapter"),'title',ev("!!S.title"),'clock',ev("S.clock"),'mini',ev("!!S.mini"),'goal',(ev("S.goal")or'')[:40])
        pg.goto('about:blank'); pg.goto('file:///home/claude/game/build/Cams_Adventure.html#dev'); pg.wait_for_timeout(1300); menu()
    for t in ['g-park','g-drums']:
        tap(*tile(ids.index(t))); pg.wait_for_timeout(2500); print(t,'-> mini',ev("S.mini?Object.keys(S.mini).filter(k=>typeof S.mini[k]!='function').join(','):'none'"),'dream',ev("DR.on"))
        pg.goto('about:blank'); pg.goto('file:///home/claude/game/build/Cams_Adventure.html#dev'); pg.wait_for_timeout(1300); menu()
    # hide, then unlock again with five taps on the badge while walking
    tap(*tile(ids.index('hide'))); pg.wait_for_timeout(1500); print('hidden:',ev("localStorage.getItem('cam_dev')"))
    pg.goto('about:blank'); pg.goto('file:///home/claude/game/build/Cams_Adventure.html#nap'); pg.wait_for_timeout(1300); tap(200,500,400)
    for i in range(60):
        if ev("document.body.dataset.mode")=='walk': break
        if ev("document.body.dataset.mode")=='pick': ev("pressed.a=true")
        elif ev("S.dlg?1:0"): tap(200,650)
        pg.wait_for_timeout(300)
    r=ev("(()=>{const r=document.getElementById('face').getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]})()"); print('mode',ev("document.body.dataset.mode"))
    for i in range(5): tap(r[0],r[1],120)
    pg.wait_for_timeout(1500); print('after 5 taps: dev',ev("localStorage.getItem('cam_dev')"),'menu',menu()); print(errs); b.close()
